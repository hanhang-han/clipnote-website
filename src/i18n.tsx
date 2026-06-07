import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'zh' | 'en';

const LangContext = createContext<{
  lang: Lang;
  toggle: () => void;
}>({ lang: 'zh', toggle: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('clipnote-lang');
      return saved === 'en' ? 'en' : 'zh';
    } catch {
      return 'zh';
    }
  });

  const toggle = () => {
    setLang(l => {
      const next = l === 'zh' ? 'en' : 'zh';
      try { localStorage.setItem('clipnote-lang', next); } catch {}
      return next;
    });
  };

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
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
