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
      if (saved === 'en' || saved === 'zh') return saved;
    } catch {}
    const browserLang = navigator.language || '';
    return browserLang.startsWith('zh') ? 'zh' : 'en';
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
      ? '灵剪 CliperX - macOS 灵动岛 AI 剪贴板 | Jack 记忆管家 | 工作流自动整理'
      : 'CliperX - AI Clipboard for macOS | Jack Memory管家 | Auto Workflows';
    const desc = lang === 'zh'
      ? '灵剪(CliperX)是 macOS 灵动岛剪贴板管理工具。Jack AI 记忆管家自动整理工作流、智能搜索、AI 翻译总结。免费版100条记录，Pro ¥8/月或 ¥28 终身。'
      : 'CliperX is the AI-powered clipboard manager for macOS with Dynamic Island. Jack AI memory管家 auto-organizes workflows, smart search, AI translation. Free 100 items, Pro ¥8/mo or ¥28 lifetime.';
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
