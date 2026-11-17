import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Language, languageForPath, localizedPath } from "./lib/seo";
const LangContext = createContext<{ lang: Language; toggle: () => void }>({ lang: "zh", toggle: () => {} });
export function LanguageProvider({ children }: { children: ReactNode }) {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const lang = languageForPath(pathname);
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    // Keep old shared ?lang= links functional while consolidating language URLs.
    const params = new URLSearchParams(search);
    const legacy = params.get("lang");
    if (legacy === "zh" || legacy === "en") {
      params.delete("lang");
      navigate(localizedPath(pathname, legacy) + (params.size ? `?${params}` : "") + hash, { replace: true });
    }
  }, [lang, pathname, search, hash, navigate]);
  const toggle = () => navigate(localizedPath(pathname, lang === "zh" ? "en" : "zh") + search + hash);
  return <LangContext.Provider value={{ lang, toggle }}>{children}</LangContext.Provider>;
}
export function useLang() { return useContext(LangContext); }
