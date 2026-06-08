import { useLang } from '../i18n';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="py-12 text-center border-t border-[#222]">
      <p className="text-[13px] text-[#666] font-light mb-2">© 2026 灵剪 (CliperX)</p>
      <div className="flex justify-center gap-6">
        <a href="mailto:hanhang789@gmail.com" className="text-[13px] text-[#999] font-light no-underline hover:text-[#888] transition-colors">
          {lang === 'zh' ? '联系我们' : 'Contact'}
        </a>
        <span className="text-[13px] text-[#444]">·</span>
        <a href="#privacy" className="text-[13px] text-[#999] font-light no-underline hover:text-[#888] transition-colors">
          {lang === 'zh' ? '隐私政策' : 'Privacy'}
        </a>
        <span className="text-[13px] text-[#444]">·</span>
        <a href="#terms" className="text-[13px] text-[#999] font-light no-underline hover:text-[#888] transition-colors">
          {lang === 'zh' ? '用户协议' : 'Terms'}
        </a>
      </div>
    </footer>
  );
}
