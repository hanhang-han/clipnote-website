import { localizedPath } from "../lib/seo";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowDown, Menu, X } from "lucide-react";
import { useLang } from "../i18n";
import { AccountMenu } from "../lib/account";
import { DOWNLOAD_URL } from "../lib/site";
export default function Navbar() {
  const { lang, toggle } = useLang();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 36);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open]);
  const links = [
    { href: "/#memories", zh: "记住什么", en: "What", color: "orange" },
    { href: "/#why", zh: "为什么灵剪", en: "Why", color: "yellow" },
    { href: "/#how", zh: "如何开始", en: "How", color: "pink" },
    { href: "/workshop", zh: "创意工坊", en: "Workshop", color: "orange" },
  ];
  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <nav
        className="nav-inner"
        aria-label={lang === "zh" ? "主导航" : "Main navigation"}
      >
        <Link
          to={localizedPath("/", lang)}
          className="brand"
          aria-label={lang === "zh" ? "CliperX 首页" : "CliperX home"}
        >
          <img src="/icon.png" width="34" height="34" alt="" />
          <span>{lang === "zh" ? "灵剪" : "CliperX"}</span>
        </Link>
        <div className="nav-center">
          {links.map((l) => (
            <Link to={localizedPath(l.href, lang)} key={l.href}>
              <i className={`nav-dot ${l.color}`} />
              {l[lang]}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <AccountMenu />
          <Link className="nav-price" to={localizedPath("/#comparison", lang)}>
            {lang === "zh" ? "价格" : "Pricing"}
          </Link>
          <button
            className="language-toggle"
            onClick={toggle}
            aria-label={lang === "zh" ? "Switch to English" : "切换中文"}
          >
            {lang === "zh" ? "EN" : "中文"}
          </button>
          <a className="pill-button small" href={DOWNLOAD_URL}>
            {lang === "zh" ? "免费下载" : "Download"}
            <ArrowDown size={16} />
          </a>
          <button
            id="menu-toggle"
            className="menu-toggle"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={
              open
                ? lang === "zh"
                  ? "关闭菜单"
                  : "Close menu"
                : lang === "zh"
                  ? "打开菜单"
                  : "Open menu"
            }
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label={lang === "zh" ? "移动导航" : "Mobile navigation"}
        >
          {links.map((l) => (
            <Link key={l.href} to={localizedPath(l.href, lang)} onClick={() => setOpen(false)}>
              <i className={`nav-dot ${l.color}`} />
              {l[lang]}
            </Link>
          ))}
          <Link to={localizedPath("/#comparison", lang)} onClick={() => setOpen(false)}>
            {lang === "zh" ? "价格" : "Pricing"}
          </Link>
          <Link to={localizedPath("/docs", lang)}>{lang === "zh" ? "使用指南" : "Guide"}</Link>
          <Link to={localizedPath("/download", lang)}>
            {lang === "zh" ? "下载与安装" : "Installation"}
          </Link>
        </nav>
      )}
    </header>
  );
}
