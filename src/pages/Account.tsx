import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { UserRound, ShieldCheck, Monitor, ArrowUpRight } from "lucide-react";
import {
  accountAPI,
  dateText,
  loginHref,
  stateText,
  useAccount,
  useAccountData,
} from "../lib/account";
import { WORKSHOP_ORIGIN } from "../lib/workshop";
import "../account.css";
import AccountVerification from "../components/AccountVerification";

interface LinkedIdentities {
  apple: { enabled: boolean; linked: boolean };
}

export default function Account() {
  const { profile, loading, error, refresh, logout } = useAccount();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const [code, setCode] = useState("");
  const key = useRef(crypto.randomUUID());
  const pricing = useAccountData<any>("/api/pricing");
  const orders = useAccountData<any>(profile ? "/api/account/orders" : null);
  const sessions = useAccountData<any>(profile ? "/api/auth/sessions" : null);
  const authConfig = useAccountData<{ apple?: { enabled: boolean } }>("/api/auth/config");
  const identities = useAccountData<LinkedIdentities>(profile ? "/api/auth/identities" : null);
  const [bindingStarted, setBindingStarted] = useState(false);
  useEffect(() => {
    if (!profile) return;
    const onFocus = () => identities.reload();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [profile?.userId]);
  const linkFeedback: Record<string, string> = {
    account_mismatch: "验证的账号与当前灵剪账号不一致，请返回原账号重新绑定 Apple。",
    cancelled: "已取消账号验证，可重新发起 Apple 绑定。",
    failed: "账号验证未完成，请重新发起 Apple 绑定。",
    already_linked: "此灵剪账号已绑定 Apple。",
  };
  const orderId = params.get("order");
  const [paymentState, setPaymentState] = useState("");
  const [deletionDue, setDeletionDue] = useState("");
  useEffect(() => {
    if (!profile || !orderId) return;
    let cancelled = false;
    const check = async () => {
      try {
        const result = await accountAPI<any>(
          "/api/order/status?orderId=" + encodeURIComponent(orderId),
        );
        if (cancelled) return;
        setPaymentState(result.status);
        if (["activated", "refunded"].includes(result.status)) {
          await refresh();
          orders.reload();
          clearInterval(timer);
        }
      } catch (error) {
        if (!cancelled) {
          setMessage((error as Error).message);
          clearInterval(timer);
        }
      }
    };
    const timer = setInterval(() => {
      void check();
    }, 5000);
    void check();
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [profile?.userId, orderId]);
  async function act(action: () => Promise<void>) {
    setBusy(true);
    setMessage("");
    try {
      await action();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function buy() {
    await act(async () => {
      const order = await accountAPI<any>("/api/order/create", {
        method: "POST",
        headers: { "Idempotency-Key": key.current },
        body: JSON.stringify({ type: "pro", plan: "lifetime" }),
      });
      window.location.assign(order.paymentURL);
    });
  }
  return (
    <AccountVerification><section className="account-page">
      <header className="account-heading">
        <div>
          <p className="account-kicker">灵剪账户</p>
          <h1>账户与会员</h1>
        </div>
        <Link to="/workshop/mine">
          我的投稿 <ArrowUpRight size={16} />
        </Link>
      </header>
      {deletionDue && <article className="account-card" role="status"><h2>注销申请已受理</h2><p>账号访问和登录凭据已停用，预计处理时间为 {dateText(deletionDue)}。管理员完成购买、退款核对后会删除账户资料并下架公开作品。</p></article>}
      {loading ? (
        <p className="account-feedback" role="status">
          正在读取账户…
        </p>
      ) : !profile ? (
        <div className="account-card account-login">
          <UserRound size={32} />
          <h2>登录灵剪</h2>
          <p>
            {error || "在各台设备上使用同一份会员权益，并管理你的工坊作品。"}
          </p>
          <div className="account-actions">
            {authConfig.data?.apple?.enabled && (
              <a
                className="account-button apple"
                href={loginHref("/account" + window.location.search, false, "apple")}
              >
                使用 Apple 登录
              </a>
            )}
            <a
              className="account-button primary"
              href={loginHref("/account" + window.location.search)}
            >
              登录
            </a>
            <a className="account-button" href={loginHref("/account", true)}>
              创建账户
            </a>
          </div>
          {authConfig.data?.apple?.enabled && (
            <p className="account-muted">
              首次使用 Apple 会创建账户。已有灵剪账号，请先登录后绑定 Apple。
            </p>
          )}
        </div>
      ) : (
        <>
          {message && (
            <p className="account-feedback" role="status">
              {message}
            </p>
          )}
          {linkFeedback[params.get("appleLink") || ""] && (
            <p className="account-feedback" role="status">
              {linkFeedback[params.get("appleLink") || ""]}
            </p>
          )}
          {orderId && (
            <p className="account-feedback" role="status">
              订单 {orderId} ·{" "}
              {paymentState ? stateText(paymentState) : "正在确认支付…"}
            </p>
          )}
          <div className="account-grid">
            <article className="account-card">
              <div className="account-card-heading">
                <UserRound size={22} />
                <h2>{profile.name || "灵剪用户"}</h2>
              </div>
              <dl>
                <dt>邮箱</dt>
                <dd>
                  {profile.email || "尚未填写"} ·{" "}
                  {profile.emailVerified ? "已验证" : "待验证"}
                </dd>
              </dl>
              <div className="account-actions">
                <a
                  className="account-button"
                  href={profile.securityURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  账号安全
                </a>
                <button
                  className="account-button"
                  disabled={busy}
                  onClick={() => {
                    void act(logout);
                  }}
                >
                  退出登录
                </button>
              </div>
            </article>
            <article className="account-card membership-card">
              <div className="account-card-heading">
                <ShieldCheck size={22} />
                <h2>
                  {stateText(profile.plan)}
                  {profile.billingType === "lifetime" ? " 终身会员" : ""}
                </h2>
              </div>
              <p>
                {profile.proExpirationDate
                  ? `有效期至 ${dateText(profile.proExpirationDate)}`
                  : profile.plan === "free"
                    ? "升级后在登录设备上同步会员权益。"
                    : "会员权益已关联到当前账号。"}
              </p>
              {!profile.sources.some(
                (source) => source.billingType === "lifetime",
              ) &&
                pricing.data?.lifetime?.enabled && (
                  <>
                    <div className="account-price">
                      ¥{pricing.data.lifetime.display}
                      <span>一次购买 · Pro 终身会员</span>
                    </div>
                    <button
                      className="account-button primary"
                      disabled={busy}
                      onClick={() => {
                        void buy();
                      }}
                    >
                      {busy ? "正在处理…" : "购买终身会员"}
                    </button>
                  </>
                )}
              <form
                className="account-inline-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void act(async () => {
                    const result = await accountAPI<any>("/api/redeem", {
                      method: "POST",
                      body: JSON.stringify({ code }),
                    });
                    setMessage(result.message || "兑换成功");
                    setCode("");
                    await refresh();
                  });
                }}
              >
                <input
                  aria-label="兑换码"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="输入兑换码"
                  required
                  maxLength={80}
                />
                <button className="account-button" disabled={busy}>
                  兑换
                </button>
              </form>
            </article>
          </div>
          <article className="account-card">
            <div className="account-card-heading">
              <ShieldCheck size={22} />
              <h2>登录方式</h2>
              <button className="account-button" onClick={identities.reload} disabled={identities.loading}>
                刷新
              </button>
            </div>
            {identities.error && <p role="alert">{identities.error}</p>}
            {identities.loading && <p role="status">正在读取登录方式…</p>}
            {identities.data && (
              <div className="account-device">
                <div>
                  <strong>Apple 账号</strong>
                  <p>
                    {identities.data.apple.linked
                      ? "已绑定，可使用 Apple 登录此灵剪账号。"
                      : identities.data.apple.enabled
                        ? "绑定后，可使用 Apple 登录并使用此账号的会员权益和工坊作品。"
                        : "Apple 登录正在配置中。"}
                  </p>
                </div>
                {identities.data.apple.enabled && !identities.data.apple.linked && (
                  <form
                    action={WORKSHOP_ORIGIN + "/api/auth/apple/link"}
                    method="post"
                    target="_blank"
                    onSubmit={() => setBindingStarted(true)}
                  >
                    <button className="account-button" disabled={busy}>绑定 Apple</button>
                  </form>
                )}
              </div>
            )}
            {bindingStarted && !identities.data?.apple.linked && (
              <p className="account-muted" role="status">
                请在新标签页验证当前账号，再在「第三方登录」中绑定 Apple。完成后返回此页查看绑定状态。
              </p>
            )}
          </article>
          <article className="account-card">
            <div className="account-card-heading">
              <h2>购买记录</h2>
              <button className="account-button" onClick={orders.reload}>
                刷新
              </button>
            </div>
            {orders.error && <p role="alert">{orders.error}</p>}
            {orders.loading && <p>正在读取…</p>}
            <div className="account-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>订单</th>
                    <th>商品</th>
                    <th>金额</th>
                    <th>状态</th>
                    <th>购买时间</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.data?.orders.map((order: any) => (
                    <tr key={order.orderId}>
                      <td className="account-id">{order.orderId}</td>
                      <td>{stateText(order.plan)}</td>
                      <td>¥{order.amount}</td>
                      <td>{stateText(order.status)}</td>
                      <td>{dateText(order.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!orders.loading && orders.data?.orders.length === 0 && (
              <p className="account-empty">
                购买记录将显示在这里。历史购买请在客户端登录后关联。
              </p>
            )}
          </article>
          <article className="account-card">
            <div className="account-card-heading">
              <Monitor size={21} />
              <h2>登录设备</h2>
            </div>
            {sessions.error && <p role="alert">{sessions.error}</p>}
            {sessions.data?.sessions.map((session: any) => (
              <div className="account-device" key={session.id}>
                <div>
                  <strong>
                    {session.deviceName}
                    {session.current ? " · 当前会话" : ""}
                  </strong>
                  <p>
                    最近活动 {dateText(session.lastActiveAt)} · 到期{" "}
                    {dateText(session.expiresAt)}
                  </p>
                </div>
                <button
                  className="account-button"
                  disabled={busy}
                  onClick={() => {
                    void act(async () => {
                      await accountAPI("/api/auth/sessions/" + session.id, {
                        method: "DELETE",
                      });
                      sessions.reload();
                      if (session.current) await refresh();
                    });
                  }}
                >
                  退出此设备
                </button>
              </div>
            ))}
            <button
              className="account-button"
              disabled={busy}
              onClick={() => {
                if (confirm("退出当前账号的全部设备和工坊 CLI 授权？"))
                  void act(async () => {
                    const result = await accountAPI<{ logoutURL?: string }>(
                      "/api/auth/logout-all",
                      {
                        method: "POST",
                      },
                    );
                    await refresh();
                    if (result.logoutURL)
                      window.location.assign(result.logoutURL);
                  });
              }}
            >
              退出全部设备
            </button>
          </article>
          {profile.permissions.length > 0 && (
            <Link className="account-button" to="/admin">
              进入管理后台 <ArrowUpRight size={16} />
            </Link>
          )}
          <details className="account-danger">
            <summary>账号注销</summary>
            <p>
              提交后立即停用账号并撤销全部登录，预计七天内由管理员核对订单、退款后完成资料删除和公开作品下架。必要订单、审计和发布版本记录用于追溯，不再公开提供作品下载。本地与 iCloud 剪贴板请在客户端管理。
            </p>
            <button
              className="account-button"
              disabled={busy}
              onClick={() => {
                if (confirm("确认提交当前账号的注销申请？"))
                  void act(async () => {
                    const result = await accountAPI<{ dueAt: string }>("/api/account/deletion-request", {
                      method: "POST",
                      body: JSON.stringify({ confirmUserId: profile.userId }),
                    });
                    setDeletionDue(result.dueAt);
                    await refresh();
                  });
              }}
            >
              提交注销申请
            </button>
          </details>
        </>
      )}
    </section></AccountVerification>
  );
}
