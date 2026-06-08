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
      ? '灵剪 CliperX - macOS 灵动岛剪贴板管理工具 | AI智能助手 | ¥18一次性买断'
      : 'CliperX - AI Clipboard Manager for macOS | Dynamic Island | ¥18 One-time';
    const desc = lang === 'zh'
      ? '灵剪(CliperX)是 macOS 灵动岛剪贴板管理工具。自动记录复制内容、AI智能翻译总结、极速搜索、智能分类。Pro版¥18一次性买断，支持 Homebrew 安装。'
      : 'CliperX is the AI-powered clipboard manager for macOS with Dynamic Island. Auto-saves clips, instant search, smart categorization, AI translation & summary. ¥18 one-time purchase.';
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
