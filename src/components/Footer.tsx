import { localizedPath } from "../lib/seo";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
export default function Footer() {
  const { lang } = useLang();
  const zh = lang === "zh";
  return (
    <footer className="site-footer section-width">
      <div className="footer-top">
        <Link to={localizedPath("/", lang)} className="brand">
          <img src="/icon.png" width="32" height="32" alt="" />
          <span>{zh ? "灵剪" : "CliperX"}</span>
        </Link>
        <p>
          {zh ? "你的想法，值得被记住。" : "Your thoughts are worth keeping."}
        </p>
        <div>
          <Link to={localizedPath("/docs", lang)}>{zh ? "使用指南" : "Guide"}</Link>
          <Link to={localizedPath("/download", lang)}>{zh ? "下载" : "Download"}</Link>
          <Link to={localizedPath("/workshop", lang)}>{zh ? "创意工坊" : "Workshop"}</Link>
          <a href="/blog/how-to-view-clipboard-history-mac.html">{zh ? "剪贴板历史教程" : "Clipboard guide (中文)"}</a>
          <a href="/store">{zh ? "商店" : "Store"}</a>
          <a href="/account">{zh ? "账户" : "Account"}</a>
          <a href="mailto:hanhang789@gmail.com">{zh ? "联系" : "Contact"}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} CliperX</span>
        <div>
          <a href="/privacy.html">{zh ? "隐私政策" : "Privacy"}</a>
          <a href="/terms.html">{zh ? "用户协议" : "Terms"}</a>
          <a href="/refund.html">{zh ? "退款政策" : "Refunds"}</a>
          <a
            href="https://x.com/jch47643085"
            target="_blank"
            rel="noopener noreferrer"
          >
            X ↗
          </a>
          <a
            href="https://xhslink.com/m/7OAhON5Terr"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zh ? "小红书 ↗" : "Xiaohongshu ↗"}
          </a>
        </div>
      </div>
    </footer>
  );
}
