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
    document.title = lang === 'zh'
      ? '灵剪 ClipNote - macOS 灵动岛剪贴板管理工具 | AI 智能剪贴板'
      : 'ClipNote - AI Clipboard Manager for macOS | Dynamic Island';
    const desc = lang === 'zh'
      ? '灵剪(ClipNote)是 macOS 灵动岛剪贴板管理工具。自动记录复制内容、AI智能翻译总结、极速搜索、智能分类。Pro版¥18买断，免费下载。'
      : 'ClipNote is the AI-powered clipboard manager for macOS with Dynamic Island. Auto-saves clips, instant search, smart categorization, AI translation & summary. Free download.';
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
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
