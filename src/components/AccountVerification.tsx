import { useEffect, useState, type ReactNode } from "react";
import { useAccount, useAccountData } from "../lib/account";
import { WORKSHOP_ORIGIN } from "../lib/workshop";

interface Security {
  recentAuthentication: boolean;
  securityURL: string;
}

export default function AccountVerification({ children }: { children: ReactNode }) {
  const { profile } = useAccount();
  const security = useAccountData<Security>(profile ? "/api/auth/security" : null);
  const [required, setRequired] = useState(false);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!profile) return;
    const refresh = () => security.reload();
    const requireVerification = () => { setRequired(true); security.reload(); };
    window.addEventListener("focus", refresh);
    window.addEventListener("cliperx:verification-required", requireVerification);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("cliperx:verification-required", requireVerification);
    };
  }, [profile?.userId]);
  useEffect(() => {
    if (security.data?.recentAuthentication) {
      setRequired(false); setStarted(false);
    }
  }, [security.data]);
  if (!profile) return children;
  return <>
    {required && <article className="account-card account-feedback" role="status">
      <h2>确认当前账号</h2>
      <p>完成敏感操作前，请重新登录确认身份。完成后返回此页，已填写的表单会保留。</p>
      {security.error && <p role="alert">{security.error}</p>}
      <div className="account-actions">
        <form action={WORKSHOP_ORIGIN + "/api/auth/reauth"} method="post" target="_blank" onSubmit={() => setStarted(true)}>
          <input type="hidden" name="returnTo" value={typeof window !== "undefined" ? window.location.href : "https://cliperx.com/account"} />
          <button className="account-button primary">重新登录确认</button>
        </form>
        <a className="account-button" href={security.data?.securityURL || "https://auth.cliperx.com/account"} target="_blank" rel="noreferrer">账号安全设置</a>
        <button className="account-button" onClick={security.reload} disabled={security.loading}>刷新状态</button>
      </div>
      {started && <p>请在新标签页完成验证，再返回这里继续操作。</p>}
    </article>}
    {children}
  </>;
}
