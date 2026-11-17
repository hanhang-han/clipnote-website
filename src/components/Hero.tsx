import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useLang } from "../i18n";
import { DOWNLOAD_URL } from "../lib/site";
import MemoryGallery from "./MemoryGallery";
export default function Hero() {
  const { lang } = useLang();
  const types =
    lang === "zh"
      ? ["文字", "链接", "图片", "代码", "灵感"]
      : ["notes", "links", "images", "code", "ideas"];
  return (
    <section className="home-hero" id="hero">
      <div className="hero-aura" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">
          {lang === "zh"
            ? "灵剪 · Mac 剪贴板与 AI 记忆空间"
            : "CliperX · AI clipboard manager for Mac"}
        </p>
        <h1>
          {lang === "zh" ? (
            <>
              好想法，
              <br />
              都值得被记住。
            </>
          ) : (
            <>
              Keep the thought.
              <br />
              <em>Find it again.</em>
            </>
          )}
        </h1>
        <p className="hero-description">
          {lang === "zh" ? (
            <>
              你复制过的
              {types.map((t, i) => (
                <span className={`word-chip chip-${i}`} key={t}>
                  {t}
                </span>
              ))}
              <br />
              都在这里，成为随时找得回的记忆。
            </>
          ) : (
            <>
              All your{" "}
              {types.map((t, i) => (
                <span className={`word-chip chip-${i}`} key={t}>
                  {t}
                </span>
              ))}
              <br />
              Together, and always within reach.
            </>
          )}
        </p>
        <div className="hero-actions">
          <a href={DOWNLOAD_URL} className="pill-button">
            {lang === "zh" ? "免费下载 Mac 版" : "Download for Mac"}
            <ArrowDown size={18} />
          </a>
          <a className="text-link" href="#island">
            {lang === "zh" ? "看看它如何工作" : "See how it works"}
            <ArrowUpRight size={16} />
          </a>
        </div>
        <p className="system-note">
          macOS 14+ <span>·</span> Apple Silicon & Intel
        </p>
      </div>
      <MemoryGallery />
    </section>
  );
}
