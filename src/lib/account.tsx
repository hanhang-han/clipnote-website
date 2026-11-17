import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import { WORKSHOP_ORIGIN } from "./workshop";

export interface AccountProfile {
  userId: string;
  name: string;
  email: string;
  emailVerified: boolean;
  status: string;
  plan: string;
  billingType: string;
  proExpirationDate: string | null;
  roles: string[];
  permissions: string[];
  securityURL: string;
  sources: {
    id: string;
    plan: string;
    billingType: string;
    expiresAt: string | null;
    source: string;
    reason: string;
  }[];
}
export class APIError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
export async function accountAPI<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(WORKSHOP_ORIGIN + path, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new APIError(
      response.status,
      data.error || "request_failed",
      data.message || "请求失败，请重试。",
    );
  return data as T;
}
export function loginHref(path = "/account", signup = false) {
  return (
    WORKSHOP_ORIGIN +
    `/api/auth/${signup ? "signup" : "login"}?returnTo=` +
    encodeURIComponent(window.location.origin + path)
  );
}
interface AccountState {
  profile: AccountProfile | null;
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}
const Context = createContext<AccountState>({
  profile: null,
  loading: true,
  error: "",
  refresh: async () => {},
  logout: async () => {},
});
export function AccountProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try {
      setProfile(await accountAPI<AccountProfile>("/api/account/profile"));
      setError("");
    } catch (error) {
      setProfile(null);
      setError(
        error instanceof APIError && error.status === 401
          ? ""
          : error instanceof Error
            ? error.message
            : "账号暂时不可用。",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  const logout = useCallback(async () => {
    await accountAPI("/api/auth/logout", { method: "POST" });
    setProfile(null);
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return (
    <Context.Provider value={{ profile, loading, error, refresh, logout }}>
      {children}
    </Context.Provider>
  );
}
export const useAccount = () => useContext(Context);
export function useAccountData<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null),
    [error, setError] = useState("");
  const [loading, setLoading] = useState(false),
    [version, setVersion] = useState(0);
  useEffect(() => {
    if (!path) {
      setData(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setData(null);
    accountAPI<T>(path, { signal: controller.signal })
      .then((value) => {
        if (!controller.signal.aborted) setData(value);
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [path, version]);
  return {
    data,
    error,
    loading,
    reload: () => setVersion((value) => value + 1),
  };
}
export function AccountMenu() {
  const { profile, loading, logout } = useAccount();
  if (loading)
    return (
      <Link className="nav-price" to="/account">
        账户
      </Link>
    );
  if (!profile)
    return (
      <a className="nav-price" href={loginHref()}>
        登录
      </a>
    );
  return (
    <details className="account-menu">
      <summary>{profile.name || "我的账户"}</summary>
      <div>
        <Link to="/account">账户与会员</Link>
        <Link to="/workshop/mine">我的投稿</Link>
        {profile.permissions.length > 0 && <Link to="/admin">管理后台</Link>}
        <button
          onClick={() => {
            void logout();
          }}
        >
          退出登录
        </button>
      </div>
    </details>
  );
}
export function dateText(value: unknown) {
  if (!value) return "—";
  const date = new Date(value as string | number);
  return Number.isFinite(date.getTime()) ? date.toLocaleString("zh-CN") : "—";
}
export const stateLabels: Record<string, string> = {
  active: "有效",
  suspended: "已停用",
  deleted: "已注销",
  deletion_requested: "注销待处理",
  pending: "处理中",
  paid: "已付款",
  activated: "已开通",
  expired: "已过期",
  refunded: "已退款",
  confirmed: "已核对退款",
  cancelled: "已取消",
  revoked: "已撤销",
  submitted: "待审核",
  published: "已发布",
  changes_requested: "待修改",
  rejected: "已拒绝",
  draft: "草稿",
  withdrawn: "已撤回",
  free: "免费版",
  pro: "Pro",
  ultra: "Ultra",
  lifetime: "终身会员",
  monthly: "历史限期会员",
  platform_admin: "平台管理员",
  reviewer: "工坊审核员",
  support: "客服",
  billing_admin: "付费管理员",
  order: "购买订单",
  legacy: "历史购买",
  trial: "体验权益",
  manual: "人工调整",
  redemption: "兑换码",
  completed: "已完成",
  unlisted: "已下架",
  processed: "已处理",
};
export const stateText = (value: unknown) =>
  stateLabels[String(value)] || String(value || "—");
