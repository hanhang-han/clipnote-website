import { useState } from "react";
import { Search, X, ArrowUpRight, Command } from "lucide-react";
import { useLang } from "../i18n";

type Filter = "all" | "image" | "note" | "link" | "code";
type Memory = {
  id: number;
  kind: Exclude<Filter, "all">;
  style: string;
  title: [string, string];
  body?: [string, string];
  tags: string;
  photo?: string;
};
const memories: Memory[] = [
  {
    id: 1,
    kind: "image",
    style: "picture",
    title: ["给工作角落一点温暖", "A warmer corner"],
    tags: "室内 家具 椅子 设计 orange chair interior",
    photo: "chair",
  },
  {
    id: 2,
    kind: "note",
    style: "quote",
    title: [
      "好设计，让复杂的事情变得简单。",
      "Good design makes room for what matters.",
    ],
    body: ["今天的阅读摘记", "A note from today’s reading"],
    tags: "设计 阅读 摘录 想法 design note reading",
  },
  {
    id: 3,
    kind: "image",
    style: "picture tall",
    title: ["光走过的地方", "Where the light goes"],
    tags: "建筑 旅行 蓝色 拱门 architecture blue travel",
    photo: "architecture",
  },
  {
    id: 4,
    kind: "code",
    style: "code",
    title: ["让灵感，留在这里。", "Make room for ideas."],
    body: [
      'const memory = {\n  thought: "a little spark",\n  captured: true,\n  yours: "always"\n};',
      'const memory = {\n  thought: "a little spark",\n  captured: true,\n  yours: "always"\n};',
    ],
    tags: "代码 开发 javascript code developer",
  },
  {
    id: 5,
    kind: "note",
    style: "palette",
    title: ["下一次设计的颜色", "Colors for the next idea"],
    tags: "颜色 配色 设计 green palette color",
  },
  {
    id: 6,
    kind: "link",
    style: "link",
    title: ["为日常，留一点好奇心。", "A little everyday curiosity."],
    body: [
      "关于观察、记录，和重新发现。",
      "On noticing, collecting, and rediscovering.",
    ],
    tags: "链接 阅读 文章 浏览器 curiosity reading link",
  },
  {
    id: 7,
    kind: "image",
    style: "picture",
    title: ["绿色，让思绪慢下来", "A slower shade of green"],
    tags: "植物 绿色 自然 leaf green nature",
    photo: "leaf",
  },
  {
    id: 8,
    kind: "note",
    style: "todo",
    title: ["一个还在生长的想法", "An idea in progress"],
    body: [
      "收集一些参考\n记下突然想到的事\n留到明天，接着想",
      "Collect a few references\nWrite down a small thought\nPick it up again tomorrow",
    ],
    tags: "想法 计划 待办 项目 idea task project",
  },
  {
    id: 9,
    kind: "image",
    style: "picture",
    title: ["咖啡之后，再想一会儿", "One more thought, after coffee"],
    tags: "阅读 咖啡 书 笔记 coffee book reading",
    photo: "desk",
  },
  {
    id: 10,
    kind: "note",
    style: "journal",
    title: [
      "不是所有灵感，都要立刻有答案。",
      "Not every idea needs an answer today.",
    ],
    body: [
      "先记下来。以后的你，会感谢现在的你。",
      "Keep it. Your future self will be glad you did.",
    ],
    tags: "笔记 摘录 文字 灵感 inspiration journal note",
  },
];
export default function MemoryGallery() {
  const { lang } = useLang();
  const l = lang === "zh" ? 0 : 1;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const filters: [Filter, string][] = [
    ["all", l === 0 ? "全部记忆" : "Everything"],
    ["image", l === 0 ? "图片" : "Images"],
    ["note", l === 0 ? "笔记" : "Notes"],
    ["link", l === 0 ? "链接" : "Links"],
    ["code", l === 0 ? "代码" : "Code"],
  ];
  const visible = memories.filter(
    (m) =>
      (filter === "all" || m.kind === filter) &&
      (!query.trim() ||
        [...m.title, ...(m.body || []), m.tags]
          .join(" ")
          .toLowerCase()
          .includes(query.trim().toLowerCase())),
  );
  return (
    <section
      className="memory-browser"
      id="memories"
      aria-label={l === 0 ? "记忆搜索交互示例" : "Interactive memory demo"}
    >
      <div className="memory-toolbar">
        <div className="memory-brand">
          <Command size={19} />
          <span>{l === 0 ? "我的记忆" : "My memories"}</span>
        </div>
        <div
          className="memory-filters"
          aria-label={l === 0 ? "按内容类型筛选" : "Filter by type"}
        >
          {filters.map(([key, label]) => (
            <button
              key={key}
              aria-pressed={key === filter}
              className={key === filter ? "active" : ""}
              onClick={() => {
                setFilter(key);
                setSelected(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="memory-search">
          <Search size={16} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={l === 0 ? "试试「设计」" : "Try “design”"}
            aria-label={l === 0 ? "搜索示例记忆" : "Search example memories"}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label={l === 0 ? "清空搜索" : "Clear search"}
            >
              <X size={14} />
            </button>
          )}
        </label>
      </div>
      <div className="memory-wall">
        {visible.map((m) => (
          <article
            className={`memory-tile ${m.style} ${selected === m.id ? "is-selected" : ""}`}
            key={m.id}
          >
            <button
              className="tile-button"
              onClick={() => setSelected(selected === m.id ? null : m.id)}
              aria-expanded={selected === m.id}
              aria-controls={selected === m.id ? `memory-${m.id}` : undefined}
            >
              {m.photo && (
                <div
                  className={`collection-photo photo-${m.photo}`}
                  role="img"
                  aria-label={m.title[l]}
                />
              )}
              {m.style === "palette" && (
                <div className="color-strip" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              )}
              {m.style === "quote" && (
                <span className="quotation" aria-hidden="true">
                  “
                </span>
              )}
              {m.style === "link" && (
                <div className="link-cover">
                  <span>
                    curiosity
                    <br />
                    <em>is a habit.</em>
                  </span>
                  <ArrowUpRight size={22} />
                </div>
              )}
              {m.style === "code" && (
                <div className="code-label">
                  <span>JavaScript</span>
                  <i>⌘ C</i>
                </div>
              )}
              <div className="tile-copy">
                <h3>{m.title[l]}</h3>
                {m.body &&
                  (m.kind === "code" ? (
                    <pre>{m.body[l]}</pre>
                  ) : m.style === "todo" ? (
                    <ul>
                      {m.body[l].split("\n").map((t) => (
                        <li key={t}>
                          <span>○</span>
                          {t}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>{m.body[l]}</p>
                  ))}
              </div>
            </button>
            {selected === m.id && (
              <div id={`memory-${m.id}`} className="tile-detail">
                <span>
                  {l === 0
                    ? "记忆预览 · 示例内容"
                    : "Memory preview · sample content"}
                </span>
                <p>
                  {l === 0
                    ? "打开灵剪后，可以在真实记录中查看来源、搜索和再次复制。"
                    : "In CliperX, open the source, search your history, and copy it again."}
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="memory-empty">
          <Search size={25} />
          <h3>
            {l === 0 ? "这里还没有这段记忆。" : "No matching memories here."}
          </h3>
          <p>
            {l === 0
              ? "试试「设计」「代码」或「绿色」，也可以清空筛选。"
              : "Try “design”, “code”, or “green”, or clear the filters."}
          </p>
          <button
            className="text-link"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            {l === 0 ? "查看全部示例" : "Show all examples"} ↗
          </button>
        </div>
      )}
      <div className="memory-caption">
        <span aria-live="polite">
          {l === 0
            ? `${visible.length} 条示例记忆`
            : `${visible.length} sample memories`}
        </span>
        <span>
          {l === 0
            ? "试着搜索、筛选，点开一段记忆。"
            : "Search, filter, and open a memory."}
        </span>
        <span className="demo-label">
          {l === 0 ? "交互示例" : "Interactive demo"}
        </span>
      </div>
    </section>
  );
}
