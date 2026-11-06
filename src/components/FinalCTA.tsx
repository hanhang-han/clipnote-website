import { ArrowDown } from "lucide-react";
import { useLang } from "../i18n";
import { DOWNLOAD_URL } from "../lib/site";
export default function FinalCTA() {
  const { lang } = useLang();
  return (
    <section className="final-cta">
      <div className="cta-aura" aria-hidden="true" />
      <p className="eyebrow">
        {lang === "zh"
          ? "给未来的自己，留一点灵感。"
          : "Leave a little inspiration for your future self."}
      </p>
      <h2>
        {lang === "zh" ? (
          <>
            下一次想起，
            <br />
            它就在这里。
          </>
        ) : (
          <>
            Your next thought
            <br />
            has a home.
          </>
        )}
      </h2>
      <a href={DOWNLOAD_URL} className="pill-button">
        {lang === "zh" ? "免费下载灵剪" : "Download CliperX"}
        <ArrowDown size={18} />
      </a>
      <p className="system-note">macOS 14+ · Apple Silicon & Intel</p>
    </section>
  );
}
