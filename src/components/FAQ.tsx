import { useLang } from "../i18n";
const questions = {
  zh: [
    [
      "灵剪适合什么样的 Mac？",
      "支持 macOS 14（Sonoma）及以上版本，同时支持 Apple Silicon 和 Intel。灵动岛是软件界面，没有刘海的 Mac 也能使用。",
    ],
    [
      "我的复制内容会存在哪里？",
      "剪贴板历史保存在你的 Mac 上。使用云端 AI 对话、翻译或总结等功能时，相关内容会发送给 AI 服务处理。你可以在隐私政策中了解数据处理方式。",
    ],
    [
      "免费版能一直使用吗？",
      "可以。免费版提供 100 条剪贴板历史、灵动岛交互、基础 AI 功能，以及置顶与收藏。需要更多历史和功能时，可以升级 Pro 或 Ultra。",
    ],
    [
      "试用结束，会自动扣费吗？",
      "不会。安装后可在 App 的账户页面领取 7 天 Pro 试用。到期后恢复为免费版，你可以按需选择是否购买。",
    ],
    [
      "如何安装和更新？",
      "下载 DMG 后，将灵剪拖入「应用程序」文件夹。也可以用 Homebrew 安装。已安装的用户可通过菜单栏中的「检查更新」获取新版。",
    ],
    [
      "怎么找到以前复制的内容？",
      "将鼠标移到屏幕顶部，或使用快捷键 ⌘ ⇧ V 打开灵动岛。使用搜索框输入关键词，或按内容类型筛选，再选择需要的记录。",
    ],
  ],
  en: [
    [
      "Which Macs does CliperX support?",
      "macOS 14 (Sonoma) or later, on Apple Silicon and Intel. Dynamic Island is a software interface, so a hardware notch is not required.",
    ],
    [
      "Where do my copied items live?",
      "Clipboard history is stored on your Mac. Cloud AI conversations, translations, and summaries send the relevant content to an AI service for processing. See our privacy policy for details.",
    ],
    [
      "Can I keep using the free version?",
      "Yes. Free includes 100 clipboard records, Dynamic Island, basic AI features, and pinning and favorites. Upgrade to Pro or Ultra if you need more.",
    ],
    [
      "Will I be charged when the trial ends?",
      "No. Claim your 7-day Pro trial in the app’s Account page. It returns to Free at the end. You decide whether to purchase.",
    ],
    [
      "How do I install and update it?",
      "Download the DMG and drag CliperX into Applications, or install with Homebrew. Existing users can use Check for Updates from the menu bar.",
    ],
    [
      "How do I find something I copied earlier?",
      "Move to the top of your screen or press ⌘ ⇧ V. Search by a keyword or filter by content type, then choose the record you need.",
    ],
  ],
};
export default function FAQ() {
  const { lang } = useLang();
  return (
    <section className="faq-section section-width" id="faq">
      <div>
        <span className="section-index">
          {lang === "zh" ? "你可能想知道" : "A few things to know"}
        </span>
        <h2>
          {lang === "zh" ? (
            <>
              还有一点
              <br />
              小问题？
            </>
          ) : (
            <>
              A little
              <br />
              curiosity?
            </>
          )}
        </h2>
        <a className="text-link" href="mailto:hanhang789@gmail.com">
          {lang === "zh" ? "和我们聊聊" : "Get in touch"} ↗
        </a>
      </div>
      <div className="faq-list">
        {questions[lang].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
