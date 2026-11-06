import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Pause,
  ArrowUpRight,
  CornerDownLeft,
  Copy,
  Search,
  MessageCircle,
} from "lucide-react";
import { useLang } from "../i18n";
import { DOWNLOAD_URL } from "../lib/site";
export default function ProductStory() {
  const { lang } = useLang();
  const zh = lang === "zh";
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const play = async () => {
    if (!video.current) return;
    if (playing) {
      video.current.pause();
    } else {
      try {
        await video.current.play();
      } catch {
        setVideoError(true);
      }
    }
  };
  return (
    <>
      <section className="manifesto section-width" id="why">
        <p className="eyebrow">
          {zh ? "为你的思绪，腾出空间" : "A little less to keep in your head"}
        </p>
        <h2>
          {zh ? (
            <>
              你只管往前想。
              <br />
              <span>那些一闪而过，交给灵剪。</span>
            </>
          ) : (
            <>
              Stay with the thought.
              <br />
              <span>We’ll keep the pieces.</span>
            </>
          )}
        </h2>
        <p>
          {zh
            ? "不必再翻遍浏览器、聊天和文件。复制过的文字、链接、图片与代码，留在一个熟悉的地方。少一点寻找，多一点专注。"
            : "Less digging through tabs, chats, and files. Keep the text, links, images, and code you copy in one familiar place. Spend less time searching and more time thinking."}
        </p>
      </section>
      <section className="island-section section-width" id="island">
        <div className="section-heading">
          <div>
            <span className="section-index">
              01 / {zh ? "随手记住" : "Capture"}
            </span>
            <h2>
              {zh ? (
                <>
                  轻轻一复制，
                  <br />
                  就留住了。
                </>
              ) : (
                <>
                  A simple copy.
                  <br />A thought kept.
                </>
              )}
            </h2>
          </div>
          <div>
            <p>
              {zh
                ? "灵动岛安静地待在屏幕顶部。需要时展开，离开时收起。你熟悉的 ⌘ C，就是记忆的入口。"
                : "Your clipboard lives quietly at the top of your Mac. Open it when you need it, tuck it away when you don’t. The familiar ⌘ C is all it takes."}
            </p>
            <Link className="text-link" to="/docs">
              {zh ? "了解灵动岛交互" : "Explore Dynamic Island"}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <div className="video-shell">
          <div className="video-top">
            <span>
              <i />
              <i />
              <i />
            </span>
            <p>{zh ? "一点存在感，刚刚好。" : "There when you need it."}</p>
            <span>CliperX for Mac</span>
          </div>
          <div className="video-content">
            <video
              ref={video}
              src="/videos/hero-island.mp4"
              poster="/videos/hero-poster.png"
              preload="none"
              playsInline
              muted
              loop
              controls={playing}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onError={() => setVideoError(true)}
              aria-label={
                zh ? "灵剪灵动岛操作演示" : "CliperX Dynamic Island walkthrough"
              }
            />
            {!playing && !videoError && (
              <button className="play-video" onClick={play}>
                <Play size={20} fill="currentColor" />
                {zh ? "播放产品演示" : "Play walkthrough"}
              </button>
            )}
          </div>
          <div className="video-bottom">
            <span>
              {zh ? "真实产品操作演示" : "A real product walkthrough"}
            </span>
            {playing && (
              <button onClick={play}>
                <Pause size={14} />
                {zh ? "暂停" : "Pause"}
              </button>
            )}
            {videoError && (
              <a href="/videos/hero-island.mp4" className="text-link">
                {zh ? "打开视频文件" : "Open video file"} ↗
              </a>
            )}
            <span>⌘ ⇧ V</span>
          </div>
        </div>
      </section>
      <section className="recall-section section-width" id="ai">
        <div className="recall-visual">
          <div className="floating-note note-back">
            <span>{zh ? "昨天的一个想法" : "A thought from yesterday"}</span>
            <p>
              {zh
                ? "给正在做的事，留下一点线索。"
                : "Leave a little thread for the work in progress."}
            </p>
            <span>⌘ C</span>
          </div>
          <div className="search-mock">
            <div className="mock-search">
              <Search size={19} />
              <span>
                {zh ? "上次的设计思路" : "That design idea from last time"}
              </span>
              <CornerDownLeft size={17} />
            </div>
            <p className="mock-label">
              {zh ? "相关记忆 · 界面示意" : "Related memories · illustration"}
            </p>
            <div className="mock-result">
              <div
                className="collection-photo photo-architecture"
                role="img"
                aria-label={zh ? "建筑设计参考" : "Architecture reference"}
              />
              <div>
                <strong>
                  {zh
                    ? "让留白成为设计的一部分"
                    : "Make room for a little space"}
                </strong>
                <p>
                  {zh
                    ? "设计摘记 · 来自你的剪贴板"
                    : "Design notes · from your clipboard"}
                </p>
              </div>
            </div>
            <div className="mock-result">
              <span className="text-file">Aa</span>
              <div>
                <strong>
                  {zh ? "产品首页的几个想法" : "A few thoughts on the homepage"}
                </strong>
                <p>{zh ? "工作笔记 · 昨天" : "Work notes · yesterday"}</p>
              </div>
            </div>
            <div className="mock-ai">
              <MessageCircle size={17} />
              <span>
                {zh
                  ? "带着这段内容，继续问 AI"
                  : "Keep the conversation going with AI"}
              </span>
              <ArrowUpRight size={17} />
            </div>
          </div>
        </div>
        <div className="recall-copy">
          <span className="section-index">
            02 / {zh ? "重新想起" : "Rediscover"}
          </span>
          <h2>
            {zh ? (
              <>
                不必记得在哪。
                <br />
                记得一点，就好。
              </>
            ) : (
              <>
                You don’t need
                <br />
                every detail.
              </>
            )}
          </h2>
          <p>
            {zh
              ? "用关键词找回记录，按类型缩小范围。遇到值得深挖的内容，让 AI 接着翻译、总结、解释，再往前想一步。"
              : "Find a memory with a keyword. Narrow things down by type. Then take the next step with AI: translate, summarize, explain, and keep thinking."}
          </p>
          <a href="#memories" className="text-link">
            {zh ? "试试上面的记忆搜索" : "Try the memory search"}
            <ArrowUpRight size={16} />
          </a>
          <div className="quiet-benefits">
            <span>{zh ? "全文搜索" : "Full-text search"}</span>
            <span>{zh ? "智能分类" : "Smart categories"}</span>
            <span>{zh ? "AI 对话" : "AI conversations"}</span>
          </div>
        </div>
      </section>
      <section className="little-things section-width" id="features">
        <div>
          <span className="section-index">
            {zh ? "那些小事，也照顾到了" : "The small things, considered"}
          </span>
          <h2>{zh ? "让每一天，顺手一点。" : "A little easier. Every day."}</h2>
        </div>
        <div className="feature-list">
          {(zh
            ? [
                ["置顶与收藏", "常用的地址、话术和代码，不用一遍遍寻找。"],
                [
                  "工作流与今日",
                  "把相关内容放回上下文，回顾今天，接着上次的思路。",
                ],
                ["便签与导出", "随手记下想法，也能把需要的资料带走。"],
                [
                  "你的 Mac，你的记忆",
                  "剪贴板历史保存在本地。使用云端 AI 时，相关内容需要发送给 AI 服务处理。",
                ],
              ]
            : [
                [
                  "Pin & favorite",
                  "Keep frequently used addresses, snippets, and words close at hand.",
                ],
                [
                  "Workflows & Today",
                  "Bring related material together and pick up your train of thought.",
                ],
                [
                  "Notes & export",
                  "Write down a quick idea, or take your collected material with you.",
                ],
                [
                  "Your Mac, your memories",
                  "Clipboard history stays on your Mac. Cloud AI features send the relevant content to an AI service for processing.",
                ],
              ]
          ).map(([title, text], i) => (
            <article key={title} id={i === 1 ? "workflows" : undefined}>
              <span className="feature-number">0{i + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="how-section section-width" id="how">
        <div className="how-heading">
          <span className="section-index">
            03 / {zh ? "从这里开始" : "Begin here"}
          </span>
          <h2>
            {zh ? (
              <>
                不用重新学习。
                <br />
                从下一次复制开始。
              </>
            ) : (
              <>
                Nothing new to learn.
                <br />
                Just copy something.
              </>
            )}
          </h2>
        </div>
        <ol className="how-steps">
          {(zh
            ? [
                [
                  Copy,
                  "照常复制",
                  "文字、图片、链接、代码，像平时一样按下 ⌘ C。",
                ],
                [Search, "随时找回", "移到屏幕顶部，或用 ⌘ ⇧ V 唤起你的记忆。"],
                [
                  MessageCircle,
                  "接着思考",
                  "再次粘贴，收藏起来，或让 AI 帮你继续处理。",
                ],
              ]
            : [
                [
                  Copy,
                  "Copy as usual",
                  "Text, images, links, code. The same familiar ⌘ C.",
                ],
                [
                  Search,
                  "Find it again",
                  "Move to the top of your screen, or press ⌘ ⇧ V.",
                ],
                [
                  MessageCircle,
                  "Keep going",
                  "Paste it, save it, or ask AI to help with the next step.",
                ],
              ]
          ).map(([Icon, title, desc], i) => {
            const StepIcon = Icon as typeof Copy;
            return (
              <li key={i}>
                <div className="step-illustration">
                  <StepIcon strokeWidth={1.1} size={31} />
                  <span>0{i + 1}</span>
                </div>
                <h3>{title as string}</h3>
                <p>{desc as string}</p>
              </li>
            );
          })}
        </ol>
        <a href={DOWNLOAD_URL} className="pill-button">
          {zh ? "下载灵剪，开始记住" : "Download and start collecting"}
          <ArrowUpRight size={17} />
        </a>
      </section>
    </>
  );
}
