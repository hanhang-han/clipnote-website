import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
type Lang = "zh" | "en";
const LangContext = createContext<{ lang: Lang; toggle: () => void }>({
  lang: "zh",
  toggle: () => {},
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "zh";
    const query = new URLSearchParams(window.location.search).get("lang");
    if (query === "en" || query === "zh") return query;
    try {
      const saved = localStorage.getItem("clipnote-lang");
      if (saved === "en" || saved === "zh") return saved;
    } catch {}
    return navigator.language.startsWith("zh") ? "zh" : "en";
  });
  const toggle = () =>
    setLang((l) => {
      const next = l === "zh" ? "en" : "zh";
      try {
        localStorage.setItem("clipnote-lang", next);
      } catch {}
      return next;
    });
  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);
  return (
    <LangContext.Provider value={{ lang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}
export function useLang() {
  return useContext(LangContext);
}
