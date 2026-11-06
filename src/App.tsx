import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { LanguageProvider, useLang } from "./i18n";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Download from "./pages/Download";

function SiteRoutes() {
  const { pathname, hash, key } = useLocation();
  const { lang } = useLang();
  useEffect(() => {
    if (!["cliperx.com", "www.cliperx.com"].includes(window.location.hostname))
      return;
    fetch("https://api.cliperx.com/api/stats/pv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {});
  }, [pathname]);
  useEffect(() => {
    const name = pathname.startsWith("/docs")
      ? lang === "zh"
        ? "使用指南"
        : "Guide"
      : pathname.startsWith("/download")
        ? lang === "zh"
          ? "下载灵剪"
          : "Download"
        : lang === "zh"
          ? "你的个人 AI 记忆空间"
          : "Your personal AI memory space";
    document.title = `${name} — CliperX 灵剪`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        lang === "zh"
          ? "灵剪 CliperX 为 Mac 留住复制过的文字、链接、图片和代码。灵动岛、搜索与 AI，让好想法随时找得回。"
          : "CliperX keeps the text, links, images, and code you copy on your Mac. Find it again with Dynamic Island, search, and AI.",
      );
  }, [pathname, lang]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash)
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView();
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
    const canonicalPath =
      pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", `https://cliperx.com${canonicalPath}`);
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">
        {lang === "zh" ? "跳到主要内容" : "Skip to content"}
      </a>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs.html" element={<Docs />} />
          <Route path="/download" element={<Download />} />
          <Route path="/download.html" element={<Download />} />
          <Route
            path="*"
            element={
              <section className="not-found">
                <span className="eyebrow">404</span>
                <h1>
                  {lang === "zh"
                    ? "这段记忆，走丢了。"
                    : "This memory wandered off."}
                </h1>
                <Link className="pill-button" to="/">
                  {lang === "zh" ? "回到首页" : "Back home"} ↗
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
export default function App() {
  return (
    <LanguageProvider>
      <SiteRoutes />
    </LanguageProvider>
  );
}
