import { Link } from "react-router-dom";
import { useLang } from "../i18n";
export default function Footer() {
  const { lang } = useLang();
  const zh = lang === "zh";
  return (
    <footer className="site-footer section-width">
      <div className="footer-top">
        <Link to="/" className="brand">
          <img src="/icon.png" width="32" height="32" alt="" />
          <span>{zh ? "灵剪" : "CliperX"}</span>
        </Link>
        <p>
          {zh ? "你的想法，值得被记住。" : "Your thoughts are worth keeping."}
        </p>
        <div>
          <Link to="/docs">{zh ? "使用指南" : "Guide"}</Link>
          <Link to="/download">{zh ? "下载" : "Download"}</Link>
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
