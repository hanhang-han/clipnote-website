import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { LanguageProvider, useLang } from "./i18n";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { seoFor, localizedPath } from "./lib/seo";
import Home from "./pages/Home";
import Docs from "./pages/Docs";
import Download from "./pages/Download";
import Workshop from "./pages/Workshop";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import { AccountProvider } from "./lib/account";

function SiteRoutes() {
  const { pathname, hash, key } = useLocation();
  const { lang } = useLang();
  useEffect(() => {
    if (/^\/(en\/)?(account|admin)(\/|$)/.test(pathname)) return;
    if (!["cliperx.com", "www.cliperx.com"].includes(window.location.hostname))
      return;
    fetch("https://api.cliperx.com/api/stats/pv", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
    }).catch(() => {});
  }, [pathname]);
  useEffect(() => {
    const seo = seoFor(pathname);
    document.title = seo.title;
    const meta = (selector: string, value: string) => document.querySelector(selector)?.setAttribute("content", value);
    meta('meta[name="description"]', seo.description);
    meta('meta[name="robots"]', seo.indexable ? "index, follow, max-image-preview:large" : "noindex, follow");
    meta('meta[property="og:title"]', seo.title);
    meta('meta[property="og:description"]', seo.description);
    meta('meta[property="og:url"]', seo.canonical);
    meta('meta[property="og:locale"]', seo.lang === "zh" ? "zh_CN" : "en_US");
    meta('meta[name="twitter:title"]', seo.title);
    meta('meta[name="twitter:description"]', seo.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", seo.canonical);
    const schemaElement = document.querySelector('script[type="application/ld+json"]');
    if (schemaElement && seo.known) {
      const schema = JSON.parse(schemaElement.textContent || "{}");
      schema.url = seo.canonical;
      schema.description = seo.description;
      schema.inLanguage = seo.lang === "zh" ? "zh-CN" : "en";
      if (schema.offers) schema.offers.name = seo.lang === "zh" ? "免费版" : "Free";
      schemaElement.textContent = JSON.stringify(schema);
    }

    for (const [language, href] of Object.entries(seo.alternates)) {
      document.querySelector(`link[hreflang="${language}"]`)?.setAttribute("href", href);
    }
  }, [pathname, lang]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash)
        document
          .getElementById(decodeURIComponent(hash.slice(1)))
          ?.scrollIntoView();
      else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    });
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
          <Route path="/en" element={<Home />} />
          <Route path="/en/docs" element={<Docs />} />
          <Route path="/en/download" element={<Download />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/docs.html" element={<Docs />} />
          <Route path="/download" element={<Download />} />
          <Route path="/download.html" element={<Download />} />
          <Route path="/account" element={<Account />} />
          <Route path="/en/account" element={<Account />} />
          <Route path="/checkout" element={<Account />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/workshop/*" element={<Workshop />} />
          <Route path="/en/workshop/*" element={<Workshop />} />
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
                <Link className="pill-button" to={localizedPath("/", lang)}>
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
      <AccountProvider><SiteRoutes /></AccountProvider>
    </LanguageProvider>
  );
}
