import { useLang } from "../i18n";
import { BREW_COMMAND } from "../lib/site";
export default function Docs() {
  const { lang } = useLang();
  const zh = lang === "zh";
  const sections = zh
    ? [
        {
          id: "getting-started",
          title: "从这里开始",
          items: [
            [
              "安装灵剪",
              "在下载页获取 DMG，打开后将灵剪拖入「应用程序」。启动时按照引导完成权限设置。",
            ],
            [
              "打开你的记忆",
              "将鼠标移到屏幕顶部，或使用 ⌘ ⇧ V 打开灵动岛。没有刘海的 Mac 也能使用这套软件界面。",
            ],
          ],
        },
        {
          id: "core-features",
          title: "复制、找回、再使用",
          items: [
            [
              "记录与搜索",
              "照常复制文字、链接、代码和图片。历史记录会出现在灵剪中，可以使用关键词搜索，或按照内容类型筛选。",
            ],
            [
              "置顶与收藏",
              "把常用的内容置顶或收藏，减少反复寻找。不同版本支持的历史容量，请在官网价格区和 App 账户页面查看。",
            ],
            [
              "便签与导出",
              "在支持的版本中，可以记录便签、归档内容，并导出需要的资料。具体格式与操作以当前 App 为准。",
            ],
          ],
        },
        {
          id: "ai",
          title: "和 AI 接着聊",
          items: [
            [
              "从一段内容开始",
              "选中需要处理的内容，使用翻译、总结、解释等 AI 操作，也可以继续对话。可用能力与额度请在 App 的账户页面查看。",
            ],
            [
              "网络与数据",
              "云端 AI 需要联网，并会把相关内容发送给 AI 服务处理。剪贴板历史的本地保存与云端 AI 处理是不同的过程。",
            ],
          ],
        },
        {
          id: "shortcuts",
          title: "用熟悉的快捷键",
          items: [
            ["⌘ C · 复制", "保持你原来的复制习惯，灵剪帮你保留历史。"],
            [
              "⌘ ⇧ V · 唤起",
              "随时打开灵动岛，找回以前复制的内容。快捷键可以在设置中调整，避免与其他工具冲突。",
            ],
          ],
        },
        {
          id: "privacy",
          title: "关于你的数据",
          items: [
            [
              "本地记忆",
              "剪贴板历史保存在你的 Mac 上。请在 App 中按需管理历史、收藏和敏感内容。",
            ],
            [
              "了解云端处理",
              "使用云端 AI 时，相关内容会被发送处理。完整的数据处理说明，请查阅隐私政策。",
            ],
          ],
        },
        {
          id: "advanced",
          title: "遇到一点小问题",
          items: [
            [
              "找不到灵动岛",
              "确认系统为 macOS 14 或更新版本，检查 App 引导中的权限要求，然后重新启动灵剪。也可以尝试用快捷键唤起。",
            ],
            [
              "检查更新",
              "打开菜单栏中的灵剪，选择「检查更新」。如自动更新不可用，可以从官网下载最新版。",
            ],
            [
              "联系支持",
              "仍然需要帮助，可以发送问题说明和系统版本至 hanhang789@gmail.com。",
            ],
          ],
        },
      ]
    : [
        {
          id: "getting-started",
          title: "Getting started",
          items: [
            [
              "Install CliperX",
              "Get the DMG from the download page, then drag CliperX into Applications. Launch it and follow the permission setup.",
            ],
            [
              "Open your memories",
              "Move to the top of your screen or press ⌘ ⇧ V. A hardware notch is not required.",
            ],
          ],
        },
        {
          id: "core-features",
          title: "Copy, find, reuse",
          items: [
            [
              "History & search",
              "Copy text, links, code, and images as usual. Search your records with a keyword, or filter them by content type.",
            ],
            [
              "Pin & favorite",
              "Keep frequently used content close. Check the pricing section and your in-app account for history limits.",
            ],
            [
              "Notes & export",
              "Supported plans include notes, archives, and exports. Available formats and controls depend on your current app version.",
            ],
          ],
        },
        {
          id: "ai",
          title: "Keep thinking with AI",
          items: [
            [
              "Start with a piece of content",
              "Choose content to translate, summarize, explain, or discuss. See your in-app account for available features and capacity.",
            ],
            [
              "Network & data",
              "Cloud AI requires a connection and sends the relevant content to an AI service. Local clipboard storage and cloud processing are separate operations.",
            ],
          ],
        },
        {
          id: "shortcuts",
          title: "Familiar shortcuts",
          items: [
            [
              "⌘ C · Copy",
              "Keep your existing copying habits. CliperX keeps the history.",
            ],
            [
              "⌘ ⇧ V · Open",
              "Open Dynamic Island and find a previous copy. Adjust shortcuts in Settings if they conflict with other tools.",
            ],
          ],
        },
        {
          id: "privacy",
          title: "Your data",
          items: [
            [
              "Local memories",
              "Clipboard history is stored on your Mac. Manage your history, favorites, and sensitive content in the app.",
            ],
            [
              "Cloud processing",
              "Cloud AI sends relevant content for processing. Read our privacy policy for the full details.",
            ],
          ],
        },
        {
          id: "advanced",
          title: "A little help",
          items: [
            [
              "Can’t find Dynamic Island?",
              "Check that you use macOS 14 or later, review the setup permissions, and restart CliperX. You can also try the keyboard shortcut.",
            ],
            [
              "Check for updates",
              "Open CliperX in the menu bar and choose Check for Updates, or download the latest installer from this website.",
            ],
            [
              "Contact support",
              "Email your question and macOS version to hanhang789@gmail.com.",
            ],
          ],
        },
      ];
  return (
    <>
      <header className="page-intro">
        <span className="eyebrow">
          {zh ? "一点指引，轻松开始" : "A little guidance to get going"}
        </span>
        <h1>{zh ? "CliperX 使用指南：安装、快捷键与剪贴板搜索" : "CliperX guide: installation, shortcuts and clipboard search"}</h1>
        <p>
          {zh
            ? "从安装和首次复制，到搜索历史与排查快捷键问题。先用不含敏感信息的内容测试，再按需开启 AI。"
            : "From the first install to your everyday flow."}
        </p>
      </header>
      <div className="doc-layout">
        <nav
          className="doc-sidebar"
          aria-label={zh ? "文档章节" : "Guide chapters"}
        >
          <a href="#quick-check">{zh ? "首次使用检查" : "First-use check"}</a>
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.title}
            </a>
          ))}
        </nav>
        <div className="doc-content">
          <section id="quick-check">
            <h2>{zh ? "先完成一次复制与找回" : "Try copying and finding a clip"}</h2>
            <ol>
              <li>{zh ? "安装并启动 App，按引导完成设置。复制一段普通测试文字，不使用密码或客户资料。" : "Install and launch the app, then follow setup. Copy a harmless sample, not a password or customer data."}</li>
              <li>{zh ? "按 ⌘ ⇧ V 唤起界面，用关键词查找刚才的文字。快捷键若已调整，以设置为准。" : "Press ⌘ ⇧ V and search for your sample. If you changed the shortcut, use your configured key combination."}</li>
              <li>{zh ? "在常用编辑器里尝试粘贴，确认内容与格式符合预期。" : "Try pasting into your usual editor and check the content and formatting."}</li>
            </ol>
            <p><a href={zh ? "/download" : "/en/download/"}>{zh ? "下载与安装说明" : "Download and installation"}</a></p>
          </section>

          {sections.map((s) => (
            <section id={s.id} key={s.id}>
              <h2>{s.title}</h2>
              {s.items.map(([q, a]) => (
                <article key={q}>
                  <h3>{q}</h3>
                  <p>{a}</p>
                </article>
              ))}
              {s.id === "getting-started" && (
                <p style={{ marginTop: 20 }}>
                  Homebrew: <code>{BREW_COMMAND}</code>
                </p>
              )}
              {s.id === "privacy" && (
                <p style={{ marginTop: 20 }}>
                  <a href="/privacy.html">
                    {zh ? "阅读隐私政策" : "Read the privacy policy"} ↗
                  </a>
                </p>
              )}
            </section>
          ))}
          <section id="more-guides">
            <h2>{zh ? "继续阅读" : "More guides (Chinese)"}</h2>
            <ul>
              <li><a href="/blog/how-to-view-clipboard-history-mac.html">{zh ? "Mac 剪贴板历史在哪里？系统功能与查看方法" : "Finding clipboard history on macOS"}</a></li>
              <li><a href="/blog/best-clipboard-manager-mac.html">{zh ? "7 款剪贴板工具的选择方法" : "Choosing a clipboard manager"}</a></li>
              <li><a href="/compare/paste.html">{zh ? "CliperX 与 Paste：费用、AI 和设备需求" : "CliperX vs Paste: plans, AI and devices"}</a></li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
