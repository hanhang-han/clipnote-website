import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "../i18n";
import { BREW_COMMAND, DOWNLOAD_URL, RELEASES_URL } from "../lib/site";
export default function DownloadPage() {
  const { lang } = useLang();
  const zh = lang === "zh";
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(BREW_COMMAND);
      setCopied(true);
      setFailed(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setFailed(true);
    }
  }
  return (
    <>
      <header className="page-intro">
        <span className="eyebrow">CliperX for Mac</span>
        <h1>{zh ? "给好想法，一个家。" : "A home for your thoughts."}</h1>
        <p>
          {zh
            ? "免费下载，从下一次复制开始。"
            : "Download free. Start with your next copy."}
        </p>
      </header>
      <div className="download-content">
        <section className="download-panel">
          <img src="/icon.png" width="75" height="75" alt="CliperX" />
          <h2>
            {zh ? "灵剪，常伴你的 Mac。" : "CliperX, at home on your Mac."}
          </h2>
          <a className="pill-button" href={DOWNLOAD_URL}>
            {zh ? "下载最新版 DMG" : "Download the latest DMG"}
            <ArrowDown size={18} />
          </a>
          <p>
            macOS 14+ · Apple Silicon & Intel
            <br />
            {zh
              ? "免费版可持续使用 · Pro 支持 7 天试用"
              : "Keep using Free · Try Pro for 7 days"}
          </p>
        </section>
        <ol className="install-steps">
          {(zh
            ? [
                ["下载", "点击按钮，获取最新的 DMG 安装包。"],
                ["安装", "打开 DMG，将灵剪拖入「应用程序」。"],
                ["开始", "启动灵剪，按引导授权，复制第一段内容。"],
              ]
            : [
                [
                  "Download",
                  "Get the latest DMG installer using the button above.",
                ],
                ["Install", "Open the DMG and drag CliperX into Applications."],
                [
                  "Begin",
                  "Launch CliperX, follow the setup, and copy something.",
                ],
              ]
          ).map(([title, text], i) => (
            <li key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
        <section className="brew-panel">
          <h2>{zh ? "也可以，用 Homebrew。" : "Or, use Homebrew."}</h2>
          <div className="brew-code">
            <code>{BREW_COMMAND}</code>
            <button
              onClick={copy}
              aria-label={zh ? "复制安装命令" : "Copy install command"}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p aria-live="polite">
            {failed ? (
              zh ? (
                "未能访问剪贴板，请手动选中上方命令复制。"
              ) : (
                "Clipboard access failed. Please select and copy the command."
              )
            ) : copied ? (
              zh ? (
                "已复制安装命令。"
              ) : (
                "Install command copied."
              )
            ) : (
              <>
                <a
                  href="https://brew.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {zh ? "先安装 Homebrew ↗" : "Install Homebrew first ↗"}
                </a>
              </>
            )}
          </p>
        </section>
        <section className="system-requirements">
          <h2>{zh ? "准备好这些，就够了。" : "All you need."}</h2>
          <ul>
            <li>macOS 14 (Sonoma) {zh ? "或更新版本" : "or later"}</li>
            <li>Apple Silicon / Intel Mac</li>
            <li>
              {zh
                ? "使用云端 AI 功能时需要联网"
                : "An internet connection for cloud AI features"}
            </li>
          </ul>
        </section>
        <section className="download-links">
          <h2>{zh ? "想了解更多？" : "A little more to explore."}</h2>
          <div>
            <a
              className="text-link"
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {zh ? "历史版本与更新记录" : "Releases & changelog"}
              <ArrowUpRight size={15} />
            </a>
            <Link className="text-link" to="/docs">
              {zh ? "安装与使用指南" : "Installation & guide"}
              <ArrowUpRight size={15} />
            </Link>
            <a className="text-link" href="/#comparison">
              {zh ? "比较各个版本" : "Compare plans"}
              <ArrowUpRight size={15} />
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
