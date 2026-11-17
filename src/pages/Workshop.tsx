import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Code2,
  FileUp,
  Layers3,
  Search,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import { useLang } from "../i18n";
import { localizedPath } from "../lib/seo";
import { DOWNLOAD_URL } from "../lib/site";
import {
  adminHeaders,
  canEditSubmission,
  emptyMetadata,
  errorMessage,
  installWidgetURL,
  permissionLabels,
  safeWebURL,
  SubmissionDetail,
  WidgetCategory,
  WidgetMetadata,
  WorkshopAccount,
  WorkshopEntry,
  WorkshopRequestError,
  WorkshopSubmission,
  WorkshopVersion,
  WORKSHOP_API,
  WORKSHOP_ORIGIN,
  workshopJSON,
  workshopLoginURL,
  workshopRequest,
} from "../lib/workshop";
import "../workshop.css";

function useRemote<T>(path: string | null, token?: string) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(Boolean(path));
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    setData(undefined);
    setError(undefined);
    setLoading(Boolean(path));
    if (path)
      workshopRequest<T>(path, { signal: controller.signal }, token)
        .then((value) => {
          if (!controller.signal.aborted) setData(value);
        })
        .catch((value) => {
          if (!controller.signal.aborted) setError(value);
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    return () => controller.abort();
  }, [path, token, revision]);
  return { data, error, loading, reload };
}

const WorkshopContext = createContext<{
  account?: WorkshopAccount;
  accountLoading: boolean;
  accountError?: unknown;
  adminToken: string;
  setAdminToken: (value: string) => void;
}>({ accountLoading: true, adminToken: "", setAdminToken: () => {} });

function useWorkshop() {
  const { lang } = useLang();
  return {
    ...useContext(WorkshopContext),
    zh: lang === "zh",
    path: (suffix = "") => localizedPath(`/workshop${suffix}`, lang),
  };
}

const categories: { value: WidgetCategory; zh: string; en: string }[] = [
  { value: "clipboard", zh: "剪贴板", en: "Clipboard" },
  { value: "ai", zh: "AI 工具", en: "AI tools" },
  { value: "productivity", zh: "效率工具", en: "Productivity" },
  { value: "system", zh: "系统工具", en: "System" },
  { value: "other", zh: "其他", en: "Other" },
];

function statusLabel(status: string, zh: boolean) {
  const labels: Record<string, [string, string]> = {
    draft: ["草稿", "Draft"],
    submitted: ["待审核", "In review"],
    published: ["已发布", "Published"],
    changes_requested: ["需要修改", "Changes requested"],
    rejected: ["未通过", "Rejected"],
    withdrawn: ["已撤回", "Withdrawn"],
    approve: ["审核通过", "Approved"],
    reject: ["未通过", "Rejected"],
  };
  return labels[status]?.[zh ? 0 : 1] || status;
}

function Status({ value }: { value: string }) {
  const { zh } = useWorkshop();
  return (
    <span className={`wk-status wk-status-${value}`}>
      {statusLabel(value, zh)}
    </span>
  );
}

function Notice({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`wk-notice ${error ? "wk-notice-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

function LoadState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error?: unknown;
  retry: () => void;
}) {
  const { zh } = useWorkshop();
  if (loading)
    return (
      <p className="wk-loading" role="status">
        {zh ? "正在读取工坊…" : "Loading the workshop…"}
      </p>
    );
  if (error)
    return (
      <Notice error>
        <p>{errorMessage(error)}</p>
        <button className="wk-button" onClick={retry}>
          {zh ? "重新加载" : "Try again"}
        </button>
      </Notice>
    );
  return null;
}

function LoginLink({ children }: { children?: ReactNode }) {
  const { pathname, search } = useLocation();
  const { zh } = useWorkshop();
  const returnTo =
    typeof window === "undefined"
      ? `https://cliperx.com${pathname}${search}`
      : `${window.location.origin}${pathname}${search}`;
  return (
    <a
      className="wk-button wk-button-primary"
      href={workshopLoginURL(returnTo)}
    >
      {children || (zh ? "登录灵剪账户" : "Sign in to CliperX")}
    </a>
  );
}

function RequireAccount({ children }: { children: ReactNode }) {
  const { account, accountLoading, accountError, zh } = useWorkshop();
  if (accountLoading)
    return (
      <p role="status">{zh ? "正在检查登录状态…" : "Checking your session…"}</p>
    );
  if (!account)
    return (
      <div className="wk-empty">
        <h2>{zh ? "登录后管理你的组件" : "Sign in to manage your widgets"}</h2>
        {accountError &&
          !(
            accountError instanceof WorkshopRequestError &&
            accountError.status === 401
          ) && <Notice error>{errorMessage(accountError)}</Notice>}
        <LoginLink />
      </div>
    );
  return <>{children}</>;
}

function WidgetImage({
  url,
  alt,
  token,
}: {
  url: string;
  alt: string;
  token?: string;
}) {
  const [objectURL, setObjectURL] = useState("");
  const source = safeWebURL(url);
  useEffect(() => {
    if (!source) return;
    const controller = new AbortController();
    let localURL = "";
    setObjectURL("");
    const sameAPI = new URL(source).origin === new URL(WORKSHOP_ORIGIN).origin;
    if (!sameAPI) return;
    fetch(source, {
      signal: controller.signal,
      credentials: "include",
      headers: adminHeaders(token),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Image unavailable");
        return response.blob();
      })
      .then((blob) => {
        if (!controller.signal.aborted) {
          localURL = URL.createObjectURL(blob);
          setObjectURL(localURL);
        }
      })
      .catch(() => {});
    return () => {
      controller.abort();
      if (localURL) URL.revokeObjectURL(localURL);
    };
  }, [source, token]);
  if (!source) return null;
  const sameAPI = new URL(source).origin === new URL(WORKSHOP_ORIGIN).origin;
  return (
    <img
      src={sameAPI ? objectURL || undefined : source}
      alt={alt}
      loading="lazy"
    />
  );
}

function Permissions({ entry }: { entry: WorkshopEntry }) {
  const { zh } = useWorkshop();
  const permissions = permissionLabels(entry.manifest.permissions, zh);
  return (
    <ul className="wk-permissions">
      {permissions.length ? (
        permissions.map((value) => <li key={value}>{value}</li>)
      ) : (
        <li>
          {zh
            ? "本地计算与组件独立存储"
            : "Local computation and widget storage"}
        </li>
      )}
    </ul>
  );
}

export default function WorkshopRoutes() {
  const [adminToken, setAdminToken] = useState("");
  const account = useRemote<WorkshopAccount>("/me", adminToken);
  const { lang } = useLang();
  const zh = lang === "zh";
  const path = (suffix = "") => localizedPath(`/workshop${suffix}`, lang);
  return (
    <WorkshopContext.Provider
      value={{
        account: account.data,
        accountLoading: account.loading,
        accountError: account.error,
        adminToken,
        setAdminToken,
      }}
    >
      <div className="wk-shell section-width">
        <nav
          className="wk-nav"
          aria-label={zh ? "工坊导航" : "Workshop navigation"}
        >
          <Link className="wk-wordmark" to={path()}>
            <Layers3 size={19} />
            {zh ? "创意工坊" : "Workshop"}
          </Link>
          <div className="wk-nav-links">
            <Link to={path()}>{zh ? "发现组件" : "Discover"}</Link>
            <Link to={path("/develop")}>{zh ? "开发指南" : "Develop"}</Link>
            <Link to={path("/mine")}>{zh ? "我的投稿" : "My submissions"}</Link>
            {account.data?.admin && (
              <Link to={path("/review")}>{zh ? "审核" : "Review"}</Link>
            )}
          </div>
          <Link className="wk-button" to={path("/submit")}>
            <FileUp size={15} />
            {zh ? "提交组件" : "Submit widget"}
          </Link>
        </nav>
        <Routes>
          <Route index element={<WorkshopDiscover />} />
          <Route path="develop" element={<WorkshopDevelop />} />
          <Route
            path="submit"
            element={
              <RequireAccount>
                <SubmissionEditor />
              </RequireAccount>
            }
          />
          <Route
            path="mine"
            element={
              <RequireAccount>
                <WorkshopMine />
              </RequireAccount>
            }
          />
          <Route
            path="submissions/:submissionId"
            element={
              <RequireAccount>
                <SubmissionEditor />
              </RequireAccount>
            }
          />
          <Route path="review" element={<WorkshopReviewPage />} />
          <Route path="authorize" element={<WorkshopAuthorize />} />
          <Route path=":widgetId" element={<WorkshopDetail />} />
          <Route
            path="*"
            element={
              <div className="wk-empty">
                <h1>
                  {zh ? "没有找到这个工坊页面" : "Workshop page not found"}
                </h1>
                <Link to={path()}>{zh ? "返回工坊" : "Back to workshop"}</Link>
              </div>
            }
          />
        </Routes>
      </div>
    </WorkshopContext.Provider>
  );
}

function WorkshopDiscover() {
  const { zh, path } = useWorkshop();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const [search, setSearch] = useState(query);
  const result = useRemote<{ widgets: WorkshopEntry[] }>(
    `/widgets?${new URLSearchParams({ q: query, category })}`,
  );
  useEffect(() => setSearch(query), [query]);
  function filter(nextCategory: string) {
    const next = new URLSearchParams(searchParams);
    if (nextCategory) next.set("category", nextCategory);
    else next.delete("category");
    setSearchParams(next);
  }
  function find(event: FormEvent) {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (search.trim()) next.set("q", search.trim());
    else next.delete("q");
    setSearchParams(next);
  }
  return (
    <>
      <header className="wk-intro">
        <h1>{zh ? "灵剪创意工坊" : "CliperX Workshop"}</h1>
        <p>
          {zh
            ? "从收集、整理到 AI 处理，发现社区开发的小组件。"
            : "Discover community widgets for collecting, organizing and working with AI."}
        </p>
      </header>
      <div className="wk-discovery-toolbar">
        <div
          className="wk-filters"
          role="group"
          aria-label={zh ? "组件分类" : "Widget category"}
        >
          <button
            className={!category ? "is-selected" : ""}
            aria-pressed={!category}
            onClick={() => filter("")}
          >
            {zh ? "全部" : "All"}
          </button>
          {categories.map((item) => (
            <button
              key={item.value}
              className={category === item.value ? "is-selected" : ""}
              aria-pressed={category === item.value}
              onClick={() => filter(item.value)}
            >
              {zh ? item.zh : item.en}
            </button>
          ))}
        </div>
        <form className="wk-search" onSubmit={find}>
          <Search size={17} />
          <input
            aria-label={zh ? "搜索组件" : "Search widgets"}
            placeholder={zh ? "搜索组件或用途" : "Search widgets or tasks"}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">{zh ? "搜索" : "Search"}</button>
        </form>
      </div>
      <LoadState {...result} retry={result.reload} />
      {result.data && (
        <div className="wk-grid">
          {result.data.widgets.map((entry) => (
            <Link
              className="wk-card"
              key={entry.manifest.id}
              to={path(`/${encodeURIComponent(entry.manifest.id)}`)}
            >
              <div className="wk-card-visual">
                {entry.metadata?.screenshots?.[0] ? (
                  <WidgetImage
                    url={entry.metadata.screenshots[0]}
                    alt={entry.manifest.name}
                  />
                ) : (
                  <div
                    className={`wk-card-icon wk-category-${entry.metadata?.category || "other"}`}
                  >
                    {entry.metadata?.category === "ai" ? (
                      <WandSparkles size={31} />
                    ) : (
                      <Layers3 size={31} />
                    )}
                  </div>
                )}
              </div>
              <div className="wk-card-copy">
                <div className="wk-card-title">
                  <h2>{entry.manifest.name}</h2>
                  <ArrowUpRight size={18} />
                </div>
                <p>{entry.manifest.description}</p>
                <div className="wk-card-meta">
                  <span>{entry.manifest.author}</span>
                  <span>v{entry.manifest.version}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      {result.data?.widgets.length === 0 && (
        <div className="wk-empty">
          <h2>{zh ? "暂时没有符合条件的组件" : "No matching widgets yet"}</h2>
          <p>
            {zh
              ? "换个关键词，或把你的想法做成一个组件。"
              : "Try another search, or build a widget for your idea."}
          </p>
          <Link className="wk-button" to={path("/develop")}>
            {zh ? "开始开发" : "Start building"}
            <Code2 size={16} />
          </Link>
        </div>
      )}
      <section className="wk-developer-strip">
        <Code2 size={24} />
        <div>
          <h2>
            {zh
              ? "让 Codex 帮你开发第一个组件"
              : "Build your first widget with Codex"}
          </h2>
          <p>
            {zh
              ? "SDK、原生组件模板和开发 Skill 已准备好。"
              : "Start with the SDK, native templates and development Skill."}
          </p>
        </div>
        <Link className="wk-button" to={path("/develop")}>
          {zh ? "查看开发指南" : "Developer guide"}
          <ArrowUpRight size={16} />
        </Link>
      </section>
    </>
  );
}

function WorkshopDetail() {
  const { widgetId = "" } = useParams();
  const { zh, path } = useWorkshop();
  const result = useRemote<{
    widget: WorkshopEntry;
    visibility: string;
    versions: WorkshopVersion[];
  }>(`/widgets/${encodeURIComponent(widgetId)}`);
  const [selectedVersion, setSelectedVersion] = useState("");
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setSelectedVersion("");
    setOpened(false);
  }, [widgetId]);
  const version = result.data?.versions.find(
    (item) =>
      item.version ===
      (selectedVersion || result.data?.widget.manifest.version),
  );
  const entry = version?.entry || result.data?.widget;
  const revoked = version?.revokedAt;
  useEffect(() => {
    if (entry) {
      document.title = `${entry.manifest.name} — ${zh ? "灵剪创意工坊" : "CliperX Workshop"}`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", entry.manifest.description);
      document
        .querySelector('meta[property="og:title"]')
        ?.setAttribute("content", document.title);
      document
        .querySelector('meta[property="og:description"]')
        ?.setAttribute("content", entry.manifest.description);
    }
    if (
      result.error instanceof WorkshopRequestError &&
      [404, 410].includes(result.error.status)
    ) {
      document
        .querySelector('meta[name="robots"]')
        ?.setAttribute("content", "noindex, follow");
    }
  }, [entry, zh, result.error]);
  return (
    <>
      <Link className="wk-back" to={path()}>
        <ArrowLeft size={16} />
        {zh ? "全部组件" : "All widgets"}
      </Link>
      <LoadState {...result} retry={result.reload} />
      {entry && (
        <>
          <div className="wk-detail-layout">
            <article className="wk-detail-main">
              <header className="wk-detail-heading">
                <div className="wk-card-icon">
                  {entry.metadata?.category === "ai" ? (
                    <WandSparkles />
                  ) : (
                    <Layers3 />
                  )}
                </div>
                <div>
                  <h1>{entry.manifest.name}</h1>
                  <p>
                    {entry.manifest.author} · v{entry.manifest.version}
                  </p>
                </div>
              </header>
              <p className="wk-detail-description">
                {entry.manifest.description}
              </p>
              {result.data?.visibility === "unlisted" && (
                <Notice>
                  {zh
                    ? "该组件已退出工坊列表。请先查看版本与作者说明。"
                    : "This widget has been unlisted. Review its version and author notes."}
                </Notice>
              )}
              {revoked && (
                <Notice error>
                  {zh ? "此版本已撤销" : "This version has been revoked"}
                  {version?.reason ? ` · ${version.reason}` : ""}
                </Notice>
              )}
              {entry.metadata?.screenshots?.length > 0 && (
                <div className="wk-screenshots">
                  {entry.metadata.screenshots.map((url, index) => (
                    <WidgetImage
                      key={url}
                      url={url}
                      alt={`${entry.manifest.name} ${index + 1}`}
                    />
                  ))}
                </div>
              )}
              <section className="wk-detail-section">
                <h2>{zh ? "使用说明" : "How to use"}</h2>
                <p className="wk-preserve">
                  {entry.metadata?.readme || entry.manifest.description}
                </p>
              </section>
              {(entry.metadata?.category === "ai" || entry.manifest.task) && (
                <Notice>
                  {zh
                    ? "AI 任务通过灵剪中已配置的执行端运行。请按作者说明准备本地 Codex、模型连接或相应账户。"
                    : "AI tasks use an execution provider configured in CliperX. Follow the author’s instructions for local Codex, model connections or required accounts."}
                </Notice>
              )}
              {entry.manifest.task && (
                <section className="wk-detail-section">
                  <h2>{zh ? "任务输入与执行" : "Task inputs and execution"}</h2>
                  <p>
                    {zh ? "选取" : "Select"}{" "}
                    {entry.manifest.task.input.minItems}–
                    {entry.manifest.task.input.maxItems}{" "}
                    {zh ? "条材料" : "items"} ·{" "}
                    {entry.manifest.task.input.types
                      .map((type) =>
                        type === "image"
                          ? zh
                            ? "图片"
                            : "Images"
                          : zh
                            ? "文字"
                            : "Text",
                      )
                      .join(" / ")}
                  </p>
                  <p>
                    {zh
                      ? "使用本机已登录的 Codex 执行，结果以 Markdown 展示。"
                      : "Runs with your signed-in local Codex and returns Markdown."}
                  </p>
                  {entry.manifest.task.parameters.length > 0 && (
                    <ul className="wk-task-parameters">
                      {entry.manifest.task.parameters.map((parameter) => (
                        <li key={parameter.key}>
                          {parameter.title}
                          {parameter.required
                            ? zh
                              ? " · 必填"
                              : " · Required"
                            : ""}
                          {parameter.default ? ` · ${parameter.default}` : ""}
                        </li>
                      ))}
                    </ul>
                  )}
                  <details>
                    <summary>
                      {zh ? "查看组件任务指令" : "View task instructions"}
                    </summary>
                    <pre className="wk-package-source">
                      <code>{entry.manifest.task.prompt}</code>
                    </pre>
                  </details>
                </section>
              )}
              {entry.metadata?.changelog && (
                <section className="wk-detail-section">
                  <h2>{zh ? "更新记录" : "What changed"}</h2>
                  <p className="wk-preserve">{entry.metadata.changelog}</p>
                </section>
              )}
            </article>
            <aside className="wk-install-panel">
              <h2>{zh ? "安装到灵剪" : "Install in CliperX"}</h2>
              <p>
                {zh
                  ? "点击后在客户端查看权限并确认安装。"
                  : "Review permissions and confirm installation in the app."}
              </p>
              {revoked ? (
                <button className="wk-button" disabled>
                  {zh ? "此版本已撤销" : "Version revoked"}
                </button>
              ) : (
                <a
                  className="wk-button wk-button-primary"
                  href={installWidgetURL(
                    entry.manifest.id,
                    entry.manifest.version,
                  )}
                  onClick={() => setOpened(true)}
                >
                  {zh ? "打开灵剪安装" : "Open CliperX to install"}
                  <ArrowUpRight size={16} />
                </a>
              )}
              {opened && (
                <p className="wk-install-feedback" role="status">
                  {zh
                    ? "已请求打开灵剪。请在客户端确认安装。"
                    : "CliperX was requested to open. Confirm installation in the app."}
                </p>
              )}
              <div className="wk-install-links">
                {!revoked && safeWebURL(entry.packageURL) && (
                  <a href={safeWebURL(entry.packageURL)}>
                    <ArrowDown size={15} />
                    {zh ? "下载组件包" : "Download package"}
                  </a>
                )}
                <a href={DOWNLOAD_URL}>
                  {zh ? "获取灵剪客户端" : "Get CliperX"}
                </a>
              </div>
              <dl className="wk-facts">
                <dt>{zh ? "兼容要求" : "Requirements"}</dt>
                <dd>
                  macOS 14+
                  {entry.metadata?.minAppVersion
                    ? ` · CliperX ${entry.metadata.minAppVersion}+`
                    : ""}
                  <small>
                    {zh ? "客户端需支持" : "Requires"} Widget API{" "}
                    {entry.manifest.apiVersion}
                  </small>
                </dd>
                <dt>{zh ? "许可证" : "License"}</dt>
                <dd>{entry.manifest.license}</dd>
              </dl>
              <h3>{zh ? "组件权限" : "Permissions"}</h3>
              <Permissions entry={entry} />
              {result.data?.versions.length > 0 && (
                <label className="wk-field">
                  {zh ? "版本" : "Version"}
                  <select
                    value={
                      selectedVersion || result.data.widget.manifest.version
                    }
                    onChange={(event) => {
                      setSelectedVersion(event.target.value);
                      setOpened(false);
                    }}
                  >
                    {result.data.versions.map((item) => (
                      <option key={item.version} value={item.version}>
                        v{item.version}
                        {item.revokedAt
                          ? zh
                            ? " · 已撤销"
                            : " · Revoked"
                          : ""}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <div className="wk-install-links">
                {safeWebURL(entry.sourceURL) && (
                  <a
                    href={safeWebURL(entry.sourceURL)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {zh ? "查看源码" : "View source"}
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {safeWebURL(entry.metadata?.feedbackURL) && (
                  <a
                    href={safeWebURL(entry.metadata.feedbackURL)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {zh ? "反馈问题或需求" : "Report an issue"}
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </>
  );
}

function WorkshopDevelop() {
  const { zh, path } = useWorkshop();
  const skillCommand =
    'git clone https://github.com/hanhang-han/cliperx-widgets.git\ncd cliperx-widgets\nmkdir -p ~/.codex/skills\nln -s "$PWD/skills/cliperx-widget-development" ~/.codex/skills/cliperx-widget-development';
  return (
    <article className="wk-guide">
      <header className="wk-intro">
        <h1>{zh ? "开发你的第一个组件" : "Build your first widget"}</h1>
        <p>
          {zh
            ? "告诉 Codex 你要完成的事，使用灵剪 SDK 和 Skill 把它做成组件。"
            : "Tell Codex what you want to do, then build it with the CliperX SDK and Skill."}
        </p>
      </header>
      <section>
        <h2>{zh ? "安装开发 Skill" : "Install the development Skill"}</h2>
        <p>
          {zh
            ? "需要 Node.js 20+。以下命令下载 SDK，并把 Skill 连接到本机 Codex。"
            : "Requires Node.js 20+. Clone the SDK and connect its Skill to local Codex."}
        </p>
        <pre>
          <code>{skillCommand}</code>
        </pre>
        <p>
          {zh
            ? "如果链接已经存在，沿用原有安装位置。Claude Code 可将目标目录改为 ~/.claude/skills。"
            : "Reuse an existing installation if the link already exists. For Claude Code, use ~/.claude/skills."}
        </p>
      </section>
      <section>
        <h2>{zh ? "向 Codex 描述需求" : "Describe your idea to Codex"}</h2>
        <blockquote>
          {zh
            ? "使用 $cliperx-widget-development，帮我开发一个灵剪组件，显示我指定 GitHub 仓库的 Star 和 Issue 数量，点击可以打开仓库。"
            : "Use $cliperx-widget-development to build a CliperX widget showing the stars and issues of a GitHub repository, with an action to open the repository."}
        </blockquote>
        <p>
          {zh
            ? "SDK 提供信息卡、收集篮、上下文和文本任务等模板。原生宿主负责组件样式、选材和执行界面。"
            : "Start with information cards, collection baskets, context or text task templates. The native host provides rendering, material selection and execution UI."}
        </p>
      </section>
      <section>
        <h2>{zh ? "预览与打包" : "Preview and package"}</h2>
        <pre>
          <code>
            {
              "node bin/widget.mjs validate ../my-widget\nnode bin/widget.mjs preview ../my-widget\nnode bin/widget.mjs pack ../my-widget --out dist"
            }
          </code>
        </pre>
        <p>
          {zh
            ? "命令行预览检查输出和操作。原生界面及真实 AI 任务需要导入灵剪，使用自己的材料与执行端验证。"
            : "The CLI checks output and actions. Import the package into CliperX to verify native UI and real AI tasks with your materials and provider."}
        </p>
      </section>
      <section>
        <h2>{zh ? "定义自己的 AI 任务" : "Define your own AI task"}</h2>
        <p>
          {zh
            ? "使用 task-ai 模板创建 Widget API 4 组件。你可以声明接收的文字或图片、材料条数、表单参数及任务指令。宿主提供选材、参数输入、执行进度与结果界面。"
            : "Use the task-ai template to create a Widget API 4 component. Declare text or image inputs, item limits, form parameters and task instructions. CliperX provides selection, parameters, execution status and results."}
        </p>
        <pre>
          <code>
            {
              "node bin/widget.mjs create ../bug-report --id com.yourname.bug-report \\\n  --name Bug单 --author yourname --template task-ai"
            }
          </code>
        </pre>
        <p>
          {zh
            ? "例如，让组件接收报错、日志与截图，按团队模板输出 Bug 单。task.prompt 可以使用 {{question}} 和 {{parameters.KEY}}，材料与来源由宿主附加。第一版使用用户本机已登录的 Codex。"
            : "For example, accept errors, logs and screenshots to create a bug report in your team’s format. task.prompt supports {{question}} and {{parameters.KEY}}. The host attaches materials and source references. The first version uses the user’s signed-in local Codex."}
        </p>
        <p>
          {zh
            ? "在使用说明中写明输入、必填参数和最低客户端版本，再用真实任务验证取消、失败与重试。"
            : "Document inputs, required parameters and the minimum app version. Verify cancellation, failures and retries with a real task."}
        </p>
      </section>
      <section>
        <h2>{zh ? "投稿到创意工坊" : "Submit to the workshop"}</h2>
        <p>
          {zh
            ? "上传 .cliperxwidget 包，填写用途、使用说明与实际截图，源码仓库地址可选。审核意见可以在“我的投稿”查看，更新版本使用相同组件 ID 和新的版本号。"
            : "Upload a .cliperxwidget package with instructions and screenshots. A source repository link is optional. Follow review feedback in My submissions. Keep the widget ID and increment the version for updates."}
        </p>
        <pre>
          <code>
            {
              "node bin/widget.mjs login\nnode bin/widget.mjs upload ../my-widget\nnode bin/widget.mjs status"
            }
          </code>
        </pre>
        <Link className="wk-button wk-button-primary" to={path("/submit")}>
          {zh ? "提交组件" : "Submit widget"}
          <FileUp size={16} />
        </Link>
      </section>
      <div className="wk-guide-links">
        <a
          href="https://github.com/hanhang-han/cliperx-widgets"
          target="_blank"
          rel="noopener noreferrer"
        >
          {zh ? "SDK 与示例源码" : "SDK and examples"}
          <ArrowUpRight size={15} />
        </a>
        <a
          href="https://github.com/hanhang-han/cliperx-widgets/blob/main/skills/cliperx-widget-development/references/protocol.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          {zh ? "组件协议" : "Widget protocol"}
          <ArrowUpRight size={15} />
        </a>
      </div>
    </article>
  );
}

function WorkshopMine() {
  const { zh, path } = useWorkshop();
  const result = useRemote<{ submissions: WorkshopSubmission[] }>(
    "/submissions/mine",
  );
  return (
    <>
      <header className="wk-page-heading">
        <div>
          <h1>{zh ? "我的投稿" : "My submissions"}</h1>
          <p>
            {zh
              ? "查看审核意见，管理草稿和版本更新。"
              : "Manage drafts, updates and review feedback."}
          </p>
        </div>
        <Link className="wk-button wk-button-primary" to={path("/submit")}>
          {zh ? "新建投稿" : "New submission"}
          <FileUp size={16} />
        </Link>
      </header>
      <LoadState {...result} retry={result.reload} />
      <div className="wk-submission-list">
        {result.data?.submissions.map((item) => (
          <Link
            className="wk-submission-row"
            key={item.id}
            to={path(`/submissions/${encodeURIComponent(item.id)}`)}
          >
            <div>
              <h2>{item.manifest?.name || item.widgetId}</h2>
              <p>
                {item.widgetId} · v{item.version}
              </p>
              {item.reviewNote && (
                <p className="wk-review-note">{item.reviewNote}</p>
              )}
            </div>
            <Status value={item.status} />
            <ArrowUpRight size={18} />
          </Link>
        ))}
      </div>
      {result.data?.submissions.length === 0 && (
        <div className="wk-empty">
          <h2>{zh ? "还没有投稿" : "No submissions yet"}</h2>
          <Link className="wk-button" to={path("/develop")}>
            {zh ? "查看开发指南" : "Read the developer guide"}
          </Link>
        </div>
      )}
    </>
  );
}

function SubmissionEditor() {
  const { submissionId } = useParams();
  const { zh, path } = useWorkshop();
  const navigate = useNavigate();
  const detail = useRemote<SubmissionDetail>(
    submissionId ? `/submissions/${encodeURIComponent(submissionId)}` : null,
  );
  const [current, setCurrent] = useState<WorkshopSubmission>();
  const [widgetId, setWidgetId] = useState("");
  const [version, setVersion] = useState("");
  const [sourceURL, setSourceURL] = useState("");
  const [metadata, setMetadata] = useState<WidgetMetadata>(emptyMetadata);
  const [tagsText, setTagsText] = useState("");
  const [file, setFile] = useState<File>();
  const [images, setImages] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (detail.data) {
      const item = detail.data.submission;
      setCurrent(item);
      setWidgetId(item.widgetId);
      setVersion(item.version);
      setSourceURL(item.sourceURL || "");
      setMetadata({ ...emptyMetadata(), ...item.metadata });
      setTagsText(item.metadata.tags.join(", "));
      setFile(undefined);
      setImages([]);
      setError("");
    }
  }, [detail.data]);
  const editable = !current || canEditSubmission(current.status);
  const update = (value: Partial<WidgetMetadata>) =>
    setMetadata((previous) => ({ ...previous, ...value }));

  async function chooseFile(next?: File) {
    if (!next) return;
    try {
      if (next.size > 262144)
        throw new Error(
          zh
            ? "组件包不能超过 256 KB。"
            : "Packages must be 256 KB or smaller.",
        );
      const pkg = JSON.parse(await next.text());
      if (
        !pkg.manifest?.id ||
        !pkg.manifest?.version ||
        typeof pkg.script !== "string"
      )
        throw new Error(
          zh
            ? "组件包缺少有效清单或脚本。"
            : "The package needs a valid manifest and script.",
        );
      if (
        current &&
        (pkg.manifest.id !== current.widgetId ||
          pkg.manifest.version !== current.version)
      )
        throw new Error(
          zh
            ? "组件 ID 和版本必须与当前投稿一致。更新版本请新建投稿。"
            : "The ID and version must match this submission. Create a new submission for a new version.",
        );
      setFile(next);
      setWidgetId(pkg.manifest.id);
      setVersion(pkg.manifest.version);
      setError("");
    } catch (failure) {
      setError(errorMessage(failure));
    }
  }

  async function save(submit: boolean) {
    if (busy || !editable) return;
    setBusy(true);
    setError("");
    setNotice("");
    let item = current;
    try {
      if (!widgetId || !version)
        throw new Error(
          zh
            ? "请先选择组件包，或填写组件 ID 和版本。"
            : "Choose a package or enter the widget ID and version.",
        );
      if ((metadata.screenshots?.length || 0) + images.length > 4)
        throw new Error(
          zh
            ? "每条投稿最多四张截图。"
            : "Each submission supports up to four screenshots.",
        );
      const values = {
        ...metadata,
        tags: tagsText
          .split(/[,，]/)
          .map((value) => value.trim())
          .filter(Boolean),
      };
      if (!item)
        item = (
          await workshopJSON<{ submission: WorkshopSubmission }>(
            "/submissions",
            { widgetId, version, sourceURL, metadata: values },
          )
        ).submission;
      else
        item = (
          await workshopJSON<{ submission: WorkshopSubmission }>(
            `/submissions/${item.id}`,
            { expectedRevision: item.revision, sourceURL, metadata: values },
            "PATCH",
          )
        ).submission;
      setCurrent(item);
      if (file) {
        item = (
          await workshopRequest<{ submission: WorkshopSubmission }>(
            `/submissions/${item.id}/package?revision=${item.revision}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/octet-stream" },
              body: file,
            },
          )
        ).submission;
        setCurrent(item);
        setFile(undefined);
      }
      for (const image of images) {
        if (
          image.size > 2 * 1024 * 1024 ||
          !["image/png", "image/jpeg"].includes(image.type)
        )
          throw new Error(
            zh
              ? "截图需为 PNG 或 JPEG，单张最多 2 MB。"
              : "Screenshots must be PNG or JPEG, up to 2 MB each.",
          );
        const uploaded = await workshopRequest<{
          url: string;
          submission: WorkshopSubmission;
        }>(`/submissions/${item.id}/images?revision=${item.revision}`, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });
        item = uploaded.submission;
        setCurrent(item);
        setMetadata({ ...emptyMetadata(), ...item.metadata });
        setImages((previous) => previous.filter((value) => value !== image));
      }
      if (submit) {
        item = (
          await workshopJSON<{ submission: WorkshopSubmission }>(
            `/submissions/${item.id}/submit`,
            { expectedRevision: item.revision },
          )
        ).submission;
        setCurrent(item);
      }
      setNotice(
        submit
          ? zh
            ? "已提交审核。"
            : "Submitted for review."
          : zh
            ? "草稿已保存。"
            : "Draft saved.",
      );
      if (!submissionId)
        navigate(path(`/submissions/${encodeURIComponent(item.id)}`), {
          replace: true,
        });
      else detail.reload();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  async function withdraw() {
    if (!current || busy) return;
    setBusy(true);
    setError("");
    try {
      const value = await workshopJSON<{ submission: WorkshopSubmission }>(
        `/submissions/${current.id}/withdraw`,
        { expectedRevision: current.revision },
      );
      setCurrent(value.submission);
      detail.reload();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Link className="wk-back" to={path("/mine")}>
        <ArrowLeft size={16} />
        {zh ? "我的投稿" : "My submissions"}
      </Link>
      <header className="wk-page-heading">
        <div>
          <h1>
            {submissionId
              ? zh
                ? "管理投稿"
                : "Manage submission"
              : zh
                ? "提交组件"
                : "Submit a widget"}
          </h1>
          <p>
            {zh
              ? "分享组件包和实际使用说明，审核通过后进入工坊。"
              : "Share your package and instructions. Approved widgets appear in the workshop."}
          </p>
        </div>
        {current && <Status value={current.status} />}
      </header>
      <LoadState {...detail} retry={detail.reload} />
      {error && <Notice error>{error}</Notice>}
      {notice && <Notice>{notice}</Notice>}
      {current?.reviewNote && (
        <Notice>
          <strong>{zh ? "审核意见" : "Review feedback"}</strong>
          <p className="wk-preserve">{current.reviewNote}</p>
        </Notice>
      )}
      {current?.status === "submitted" && (
        <Notice>
          <p>
            {zh
              ? "投稿正在审核，撤回后可以继续修改。"
              : "This submission is in review. Withdraw it to make changes."}
          </p>
          <button className="wk-button" disabled={busy} onClick={withdraw}>
            {zh ? "撤回投稿" : "Withdraw submission"}
          </button>
        </Notice>
      )}
      {current?.status === "published" && (
        <Notice>
          <p>
            {zh
              ? "此版本已发布。新版本使用相同组件 ID 和递增版本号。"
              : "This version is published. Submit a new version with the same widget ID."}
          </p>
          <Link
            className="wk-button"
            to={path(`/${encodeURIComponent(current.widgetId)}`)}
          >
            {zh ? "查看组件" : "View widget"}
          </Link>
        </Notice>
      )}
      {(!submissionId || detail.data) && (
        <form
          className="wk-editor"
          onSubmit={(event) => {
            event.preventDefault();
            void save(true);
          }}
        >
          <fieldset disabled={!editable || busy}>
            <label className="wk-package-upload">
              <FileUp size={27} />
              <strong>
                {file?.name ||
                  current?.manifest?.name ||
                  (zh
                    ? "选择 .cliperxwidget 组件包"
                    : "Choose a .cliperxwidget package")}
              </strong>
              <span>
                {zh
                  ? "最大 256 KB，使用 SDK 的 pack 命令生成。"
                  : "Up to 256 KB. Generate with the SDK pack command."}
              </span>
              <input
                type="file"
                accept=".cliperxwidget,application/json"
                onChange={(event) => void chooseFile(event.target.files?.[0])}
              />
            </label>
            <div className="wk-form-columns">
              <label className="wk-field">
                {zh ? "组件 ID" : "Widget ID"}
                <input
                  value={widgetId}
                  readOnly={Boolean(current || file)}
                  placeholder="com.author.my-widget"
                  onChange={(event) => setWidgetId(event.target.value)}
                  required
                />
              </label>
              <label className="wk-field">
                {zh ? "版本" : "Version"}
                <input
                  value={version}
                  readOnly={Boolean(current || file)}
                  placeholder="1.0.0"
                  onChange={(event) => setVersion(event.target.value)}
                  required
                />
              </label>
            </div>
            <div className="wk-form-columns">
              <label className="wk-field">
                {zh ? "分类" : "Category"}
                <select
                  value={metadata.category}
                  onChange={(event) =>
                    update({ category: event.target.value as WidgetCategory })
                  }
                >
                  {categories.map((value) => (
                    <option value={value.value} key={value.value}>
                      {zh ? value.zh : value.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="wk-field">
                {zh ? "标签，用逗号分隔" : "Tags, separated by commas"}
                <input
                  value={tagsText}
                  onChange={(event) => setTagsText(event.target.value)}
                />
              </label>
            </div>
            <label className="wk-field">
              {zh ? "源码仓库地址，可选" : "Source repository URL, optional"}
              <input
                type="url"
                value={sourceURL}
                onChange={(event) => setSourceURL(event.target.value)}
                placeholder="https://github.com/author/repository"
              />
            </label>
            <label className="wk-field">
              {zh ? "使用说明" : "Instructions"}
              <textarea
                rows={6}
                value={metadata.readme}
                onChange={(event) => update({ readme: event.target.value })}
                placeholder={
                  zh
                    ? "说明组件解决什么问题、如何使用，以及需要的账户或执行端。"
                    : "Explain what the widget does, how to use it and any required accounts or execution provider."
                }
              />
            </label>
            <label className="wk-field">
              {zh ? "本次更新" : "Changes in this version"}
              <textarea
                rows={3}
                value={metadata.changelog}
                onChange={(event) => update({ changelog: event.target.value })}
              />
            </label>
            <div className="wk-form-columns">
              <label className="wk-field">
                {zh
                  ? "最低灵剪版本，可选"
                  : "Minimum CliperX version, optional"}
                <input
                  value={metadata.minAppVersion || ""}
                  placeholder="4.0.15"
                  onChange={(event) =>
                    update({ minAppVersion: event.target.value || undefined })
                  }
                />
              </label>
              <label className="wk-field">
                {zh ? "问题反馈地址，可选" : "Feedback URL, optional"}
                <input
                  type="url"
                  value={metadata.feedbackURL || ""}
                  onChange={(event) =>
                    update({ feedbackURL: event.target.value || undefined })
                  }
                  placeholder="https://github.com/author/repository/issues"
                />
              </label>
            </div>
            <label className="wk-field">
              {zh ? "实际截图，最多四张" : "Screenshots, up to four"}
              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={(event) =>
                  setImages(Array.from(event.target.files || []))
                }
              />
              <small>
                {zh
                  ? "PNG 或 JPEG，单张最大 2 MB。请展示实际组件界面。"
                  : "PNG or JPEG, up to 2 MB each. Show the actual widget."}
              </small>
            </label>
            {images.length > 0 && (
              <p>{images.map((image) => image.name).join(" · ")}</p>
            )}
            <div className="wk-uploaded-images">
              {metadata.screenshots.map((url, index) => (
                <div key={url}>
                  <WidgetImage
                    url={url}
                    alt={`${zh ? "截图" : "Screenshot"} ${index + 1}`}
                  />
                  <button
                    className="wk-button"
                    type="button"
                    onClick={() =>
                      update({
                        screenshots: metadata.screenshots.filter(
                          (value) => value !== url,
                        ),
                      })
                    }
                  >
                    {zh ? "移除" : "Remove"}
                  </button>
                </div>
              ))}
            </div>
            <div className="wk-form-actions">
              <button
                className="wk-button"
                type="button"
                onClick={() => void save(false)}
              >
                {busy
                  ? zh
                    ? "正在保存…"
                    : "Saving…"
                  : zh
                    ? "保存草稿"
                    : "Save draft"}
              </button>
              <button
                className="wk-button wk-button-primary"
                type="submit"
                disabled={!file && !current?.checks?.valid}
              >
                {zh ? "提交审核" : "Submit for review"}
                <ArrowUpRight size={16} />
              </button>
            </div>
          </fieldset>
        </form>
      )}
      {current?.checks && (
        <section className="wk-detail-section">
          <h2>{zh ? "包校验" : "Package validation"}</h2>
          <p>
            {current.checks.valid
              ? zh
                ? "组件包已通过静态校验。"
                : "The package passed static validation."
              : zh
                ? "请上传有效包后提交。"
                : "Upload a valid package before submitting."}
          </p>
          {current.checks.messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </section>
      )}
      {detail.data?.reviews.length > 0 && (
        <section className="wk-detail-section">
          <h2>{zh ? "审核记录" : "Review history"}</h2>
          {detail.data.reviews.map((review, index) => (
            <div
              className="wk-review-history"
              key={`${review.createdAt}-${index}`}
            >
              <strong>{statusLabel(review.decision, zh)}</strong>
              <span>
                {new Date(review.createdAt).toLocaleDateString(
                  zh ? "zh-CN" : "en-US",
                )}
              </span>
              <p className="wk-preserve">{review.note}</p>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

function WorkshopReviewPage() {
  const navigate = useNavigate();
  useEffect(() => { navigate("/admin/workshop", { replace: true }); }, [navigate]);
  return <p><Link to="/admin/workshop">打开管理后台审核队列</Link></p>;
}

function ReviewInspector({
  id,
  onChange,
}: {
  id: string;
  onChange: () => void;
}) {
  const { zh, adminToken } = useWorkshop();
  const detail = useRemote<SubmissionDetail>(
    `/submissions/${encodeURIComponent(id)}`,
    adminToken,
  );
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [packageText, setPackageText] = useState("");
  const [sourceLoading, setSourceLoading] = useState(false);
  const item = detail.data?.submission;
  const currentPermissions = permissionLabels(item?.manifest?.permissions, zh);
  const previousPermissions = permissionLabels(
    detail.data?.previous?.manifest.permissions,
    zh,
  );

  async function decide(decision: "approve" | "changes_requested" | "reject") {
    if (!item || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await workshopJSON(
        `/submissions/${id}/review`,
        {
          decision,
          expectedRevision: item.revision,
          sha256: item.sha256,
          note,
        },
        "POST",
        adminToken,
      );
      setNotice(zh ? "审核结果已保存。" : "Review saved.");
      detail.reload();
      onChange();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  async function moderate(action: "unlist" | "revoke") {
    if (!item || !note.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const route =
        action === "unlist"
          ? `/widgets/${encodeURIComponent(item.widgetId)}/unlist`
          : `/widgets/${encodeURIComponent(item.widgetId)}/versions/${item.version}/revoke`;
      await workshopJSON(route, { reason: note }, "POST", adminToken);
      setNotice(zh ? "发布状态已更新。" : "Publication state updated.");
      detail.reload();
      onChange();
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  async function readPackage() {
    setSourceLoading(true);
    setError("");
    try {
      const response = await fetch(
        `${WORKSHOP_API}/submissions/${encodeURIComponent(id)}/package`,
        { credentials: "include", headers: adminHeaders(adminToken) },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setPackageText(JSON.stringify(await response.json(), null, 2));
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setSourceLoading(false);
    }
  }
  return (
    <article className="wk-review-inspector">
      <LoadState {...detail} retry={detail.reload} />
      {item && (
        <>
          <header>
            <h2>{item.manifest?.name || item.widgetId}</h2>
            <p>
              {item.widgetId} · v{item.version} · {zh ? "修订" : "Revision"}{" "}
              {item.revision}
            </p>
            <Status value={item.status} />
          </header>
          {error && <Notice error>{error}</Notice>}
          {notice && <Notice>{notice}</Notice>}
          <dl className="wk-facts">
            <dt>{zh ? "作者账号" : "Owner account"}</dt>
            <dd>{item.ownerId}</dd>
            <dt>SHA256</dt>
            <dd className="wk-hash">{item.sha256 || "—"}</dd>
            <dt>{zh ? "源码" : "Source"}</dt>
            <dd>
              {safeWebURL(item.sourceURL) ? (
                <a
                  href={safeWebURL(item.sourceURL)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.sourceURL}
                  <ArrowUpRight size={13} />
                </a>
              ) : (
                "—"
              )}
            </dd>
          </dl>
          <h3>{zh ? "使用说明" : "Instructions"}</h3>
          <p className="wk-preserve">
            {item.metadata.readme || item.manifest?.description}
          </p>
          <h3>{zh ? "更新内容" : "Changes"}</h3>
          <p className="wk-preserve">{item.metadata.changelog || "—"}</p>
          <div className="wk-screenshots">
            {item.metadata.screenshots.map((url, index) => (
              <WidgetImage
                key={url}
                url={url}
                token={adminToken}
                alt={`${zh ? "投稿截图" : "Submission screenshot"} ${index + 1}`}
              />
            ))}
          </div>
          <h3>{zh ? "权限变化" : "Permission changes"}</h3>
          <div className="wk-permission-diff">
            <div>
              <strong>{zh ? "上一发布版本" : "Previous release"}</strong>
              <ul>
                {previousPermissions.length ? (
                  previousPermissions.map((value) => (
                    <li key={value}>{value}</li>
                  ))
                ) : (
                  <li>{zh ? "无" : "None"}</li>
                )}
              </ul>
            </div>
            <div>
              <strong>{zh ? "当前投稿" : "Current submission"}</strong>
              <ul>
                {currentPermissions.length ? (
                  currentPermissions.map((value) => (
                    <li
                      className={
                        !previousPermissions.includes(value) ? "wk-added" : ""
                      }
                      key={value}
                    >
                      {value}
                      {!previousPermissions.includes(value)
                        ? zh
                          ? " · 新增"
                          : " · Added"
                        : ""}
                    </li>
                  ))
                ) : (
                  <li>{zh ? "无" : "None"}</li>
                )}
              </ul>
            </div>
          </div>
          <h3>{zh ? "自动校验" : "Automated checks"}</h3>
          <p>
            {item.checks.valid
              ? zh
                ? "静态校验通过"
                : "Static validation passed"
              : zh
                ? "组件包校验尚未通过"
                : "Package validation has not passed"}
          </p>
          {item.checks.messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
          <button
            className="wk-button"
            onClick={readPackage}
            disabled={sourceLoading || !item.sha256}
          >
            {sourceLoading
              ? zh
                ? "正在读取…"
                : "Loading…"
              : zh
                ? "查看完整包与脚本"
                : "Inspect package and script"}
            <Code2 size={15} />
          </button>
          {packageText && (
            <pre className="wk-package-source">
              <code>{packageText}</code>
            </pre>
          )}
          <label className="wk-field">
            {zh ? "审核意见或处理原因" : "Review feedback or moderation reason"}
            <textarea
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                zh
                  ? "写明需要修改的地方，或本次发布处理的原因。"
                  : "Describe requested changes or the reason for moderation."
              }
            />
          </label>
          {item.status === "submitted" && (
            <div className="wk-form-actions">
              <button
                className="wk-button"
                disabled={busy || !note.trim()}
                onClick={() => void decide("changes_requested")}
              >
                {zh ? "退回修改" : "Request changes"}
              </button>
              <button
                className="wk-button wk-button-danger"
                disabled={busy || !note.trim()}
                onClick={() => void decide("reject")}
              >
                {zh ? "拒绝" : "Reject"}
              </button>
              <button
                className="wk-button wk-button-primary"
                disabled={busy || !item.checks.valid || !item.sha256}
                onClick={() => void decide("approve")}
              >
                {zh ? "审核通过并发布" : "Approve and publish"}
                <Check size={15} />
              </button>
            </div>
          )}
          {item.status === "published" && (
            <div className="wk-form-actions">
              <button
                className="wk-button"
                disabled={busy || !note.trim()}
                onClick={() => void moderate("unlist")}
              >
                {zh ? "从工坊列表下架" : "Unlist widget"}
              </button>
              <button
                className="wk-button wk-button-danger"
                disabled={busy || !note.trim()}
                onClick={() => void moderate("revoke")}
              >
                {zh ? "撤销此版本" : "Revoke this version"}
              </button>
            </div>
          )}
        </>
      )}
    </article>
  );
}

function WorkshopAuthorize() {
  const { zh, account } = useWorkshop();
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");
  async function authorize(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await workshopJSON("/cli/authorize", { userCode: code.trim() });
      setComplete(true);
    } catch (failure) {
      setError(errorMessage(failure));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="wk-authorize">
      <ShieldCheck size={31} />
      <h1>{zh ? "授权工坊开发工具" : "Authorize workshop tools"}</h1>
      <RequireAccount>
        {complete ? (
          <Notice>
            <Check size={18} />
            {zh
              ? "已授权，请返回终端继续。"
              : "Authorized. Return to your terminal."}
          </Notice>
        ) : (
          <form onSubmit={authorize}>
            <p>
              {zh
                ? `使用 ${account?.user.name || account?.user.userId || "当前账户"} 授权本次开发工具登录，以管理你的工坊投稿。`
                : `Authorize this developer tool as ${account?.user.name || account?.user.userId || "your current account"} to manage workshop submissions.`}
            </p>
            <label className="wk-field">
              {zh ? "终端显示的授权码" : "Code shown in your terminal"}
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                autoComplete="off"
                required
              />
            </label>
            {error && <Notice error>{error}</Notice>}
            <button className="wk-button wk-button-primary" disabled={busy}>
              {busy
                ? zh
                  ? "正在授权…"
                  : "Authorizing…"
                : zh
                  ? "授权此工具"
                  : "Authorize this tool"}
            </button>
          </form>
        )}
      </RequireAccount>
    </div>
  );
}
