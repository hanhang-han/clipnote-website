import { Check, ArrowUpRight } from "lucide-react";
import { useLang } from "../i18n";
import { DOWNLOAD_URL } from "../lib/site";
export default function Comparison() {
  const { lang } = useLang();
  const zh = lang === "zh";
  const plans = [
    {
      name: zh ? "免费版" : "Free",
      price: "0",
      unit: zh ? "永久免费" : "free, always",
      desc: zh ? "为日常的一点灵感。" : "For everyday little ideas.",
      note: zh ? "从基础功能开始" : "Start with the essentials",
      features: zh
        ? ["100 条剪贴板历史", "灵动岛交互", "基础 AI 能力", "置顶与收藏"]
        : [
            "100 clipboard records",
            "Dynamic Island",
            "Basic AI features",
            "Pin & favorites",
          ],
      cta: zh ? "免费下载" : "Download free",
    },
    {
      name: "Pro",
      price: "8",
      unit: zh ? "/ 月" : "/ month",
      desc: zh ? "给认真工作的你。" : "For your daily flow.",
      note: zh ? "或 ¥28 终身买断" : "Or ¥28 for lifetime access",
      features: zh
        ? [
            "免费版全部功能",
            "500 条历史 · 30 天全文搜索",
            "更充足的 AI 对话额度",
            "工作流整理与今日摘要",
            "便签、归档与导出",
          ]
        : [
            "Everything in Free",
            "500 records · 30-day full-text search",
            "More AI conversation capacity",
            "Workflows & daily summaries",
            "Notes, archive & export",
          ],
      cta: zh ? "下载并试用 Pro" : "Download & try Pro",
    },
    {
      name: "Ultra",
      price: "25",
      unit: zh ? "/ 月" : "/ month",
      desc: zh ? "为更多想法，留更多空间。" : "More room for more ideas.",
      note: zh ? "面向高频使用者" : "For frequent use",
      features: zh
        ? [
            "Pro 版全部功能",
            "无限剪贴板历史",
            "无限全文搜索",
            "更完整的 AI 工具能力",
            "优先客服支持",
          ]
        : [
            "Everything in Pro",
            "Unlimited clipboard history",
            "Unlimited full-text search",
            "Extended AI tools",
            "Priority support",
          ],
      cta: zh ? "下载并了解 Ultra" : "Download & explore Ultra",
    },
  ];
  return (
    <section className="pricing-section section-width" id="comparison">
      <div className="center-heading">
        <span className="section-index">
          {zh ? "简单一点，刚刚好" : "A plan that feels right"}
        </span>
        <h2>{zh ? "给你的记忆，一点空间。" : "Make room for your mind."}</h2>
        <p>
          {zh
            ? "先免费用起来。需要更多时，再选择适合你的版本。"
            : "Start free. Choose more when you need it."}
        </p>
      </div>
      <div className="pricing-grid">
        {plans.map((p, i) => (
          <article
            className={`price-plan ${i === 1 ? "featured" : ""}`}
            key={p.name}
          >
            <div className="plan-header">
              <span className="plan-name">{p.name}</span>
              <p>{p.desc}</p>
              <div className="plan-price">
                <span>¥</span>
                <strong>{p.price}</strong>
                <small>{p.unit}</small>
              </div>
              <p className="plan-note">{p.note}</p>
            </div>
            <ul>
              {p.features.map((f) => (
                <li key={f}>
                  <Check size={15} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={DOWNLOAD_URL}
              className={`pill-button ${i === 1 ? "" : "outline"}`}
            >
              {p.cta}
              <ArrowUpRight size={16} />
            </a>
          </article>
        ))}
      </div>
      <p className="pricing-footnote">
        {zh
          ? "Pro 支持 7 天免费试用，到期不自动扣费。购买与权益详情请在 App 或商店内查看。"
          : "Try Pro for 7 days, with no automatic charge at the end. Purchase and entitlement details are available in the app or store."}{" "}
        <a href="/store" className="text-link">
          {zh ? "前往商店" : "Visit store"} ↗
        </a>
      </p>
    </section>
  );
}
