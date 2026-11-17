import { useEffect, useState, Children, type ReactNode } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Receipt,
  ShieldCheck,
  Blocks,
  KeyRound,
  SlidersHorizontal,
  ScrollText,
  ArrowLeft,
} from "lucide-react";
import {
  accountAPI,
  dateText,
  loginHref,
  stateText,
  useAccount,
  useAccountData,
} from "../lib/account";
import { WORKSHOP_ORIGIN } from "../lib/workshop";
import "../account.css";

type Row = Record<string, any>;
const roleNames = ["reviewer", "support", "billing_admin", "platform_admin"];
const nav = [
  { path: "", name: "概览", icon: LayoutDashboard, permission: "" },
  { path: "users", name: "用户管理", icon: Users, permission: "users.read" },
  {
    path: "orders",
    name: "订单与退款",
    icon: Receipt,
    permission: "orders.read",
  },
  {
    path: "entitlements",
    name: "会员权益",
    icon: ShieldCheck,
    permission: "orders.read",
  },
  {
    path: "workshop",
    name: "创意工坊",
    icon: Blocks,
    permission: "workshop.review",
  },
  {
    path: "access",
    name: "角色权限",
    icon: KeyRound,
    permission: "roles.manage",
  },
  {
    path: "products",
    name: "商品设置",
    icon: SlidersHorizontal,
    permission: "products.manage",
  },
  {
    path: "audit",
    name: "操作日志",
    icon: ScrollText,
    permission: "audit.read",
  },
];

function Status({ value }: { value: unknown }) {
  return (
    <span className={`account-status state-${String(value)}`}>
      {stateText(value)}
    </span>
  );
}
function Table({
  headings,
  children,
}: {
  headings: string[];
  children: ReactNode;
}) {
  return (
    <div className="account-table-scroll">
      <table>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading}>{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Children.count(children) ? (
            children
          ) : (
            <tr>
              <td colSpan={headings.length} className="account-empty">
                没有匹配的记录
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function ResultState({
  result,
}: {
  result: { loading: boolean; error: string; reload: () => void };
}) {
  if (result.loading)
    return (
      <p className="account-empty" role="status">
        正在读取…
      </p>
    );
  if (result.error)
    return (
      <p className="account-feedback" role="alert">
        {result.error}{" "}
        <button className="account-button" onClick={result.reload}>
          重试
        </button>
      </p>
    );
  return null;
}
function useAction(reload: () => void) {
  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const { refresh } = useAccount();
  async function run(action: () => Promise<unknown>, success = "操作已完成") {
    setBusy(true);
    setMessage("");
    try {
      await action();
      setMessage(success);
      reload();
      await refresh();
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return { busy, message, run };
}
function Filter({ statuses = [] }: { statuses?: string[] }) {
  const [params, setParams] = useSearchParams(),
    [query, setQuery] = useState(params.get("q") || "");
  return (
    <form
      className="admin-filter"
      onSubmit={(event) => {
        event.preventDefault();
        const next = new URLSearchParams(params);
        next.set("q", query);
        next.set("page", "1");
        setParams(next);
      }}
    >
      <input
        aria-label="搜索"
        placeholder="搜索用户、订单或交易号"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {statuses.length > 0 && (
        <select
          aria-label="状态筛选"
          value={params.get("status") || ""}
          onChange={(event) => {
            const next = new URLSearchParams(params);
            next.set("status", event.target.value);
            next.set("page", "1");
            setParams(next);
          }}
        >
          <option value="">全部状态</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {stateText(status)}
            </option>
          ))}
        </select>
      )}
      <button className="account-button">搜索</button>
    </form>
  );
}
function Pages({ count, total }: { count: number; total?: number }) {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const go = (next: number) => {
    const updated = new URLSearchParams(params);
    updated.set("page", String(next));
    setParams(updated);
  };
  return (
    <div className="admin-pagination">
      <span>
        {total === undefined
          ? `第 ${page} 页`
          : `共 ${total} 条 · 第 ${page} 页`}
      </span>
      <button
        className="account-button"
        disabled={page <= 1}
        onClick={() => go(page - 1)}
      >
        上一页
      </button>
      <button
        className="account-button"
        disabled={total === undefined ? count < 30 : page * 30 >= total}
        onClick={() => go(page + 1)}
      >
        下一页
      </button>
    </div>
  );
}
function Overview() {
  const result = useAccountData<Row>("/api/admin/overview");
  const data = result.data;
  return (
    <>
      <h1>概览</h1>
      <ResultState result={result} />
      {data && (
        <>
          <div className="admin-metrics">
            {[
              ["用户", data.users, "/admin/users"],
              ["待审核投稿", data.submissions, "/admin/workshop"],
              [
                "待确认订单",
                data.pendingOrders,
                "/admin/orders?status=pending",
              ],
              ["待核对退款", data.pendingRefunds, "/admin/orders"],
            ]
              .filter((item) => item[1] !== undefined)
              .map((item) => (
                <Link
                  className="account-card"
                  key={String(item[0])}
                  to={String(item[2])}
                >
                  <span>{item[0]}</span>
                  <strong>{item[1]}</strong>
                </Link>
              ))}
          </div>
          {data.payments && (
            <article className="account-card">
              <h2>累计已确认交易 · CNY</h2>
              <dl>
                <dt>成交笔数</dt>
                <dd>{data.payments.count}</dd>
                <dt>成交金额</dt>
                <dd>¥{(data.payments.gross / 100).toFixed(2)}</dd>
                <dt>已确认退款</dt>
                <dd>¥{(data.payments.refunded / 100).toFixed(2)}</dd>
                <dt>退款后金额</dt>
                <dd>
                  ¥
                  {(
                    (data.payments.gross - data.payments.refunded) /
                    100
                  ).toFixed(2)}
                </dd>
              </dl>
            </article>
          )}
          <p className="account-muted">
            统计来自已确认的订单与退款记录，时间按当前浏览器时区展示。
          </p>
        </>
      )}
    </>
  );
}
function UsersPage() {
  const [params] = useSearchParams();
  const result = useAccountData<Row>("/api/admin/users?" + params.toString());
  return (
    <>
      <h1>用户管理</h1>
      <Filter
        statuses={["active", "suspended", "deletion_requested", "deleted"]}
      />
      <ResultState result={result} />
      <Table
        headings={["用户", "会员", "状态", "角色", "注册时间", "最近登录"]}
      >
        {result.data?.users.map((user: Row) => (
          <tr key={user.userId}>
            <td>
              <Link to={"/admin/users/" + encodeURIComponent(user.userId)}>
                {user.name || user.userId}
              </Link>
              <small>{user.email || user.userId}</small>
            </td>
            <td>
              {stateText(user.membership.plan)} ·{" "}
              {stateText(user.membership.billingType)}
            </td>
            <td>
              <Status value={user.status} />
            </td>
            <td>{user.roles.map(stateText).join("、") || "普通用户"}</td>
            <td>{dateText(user.createdAt)}</td>
            <td>{dateText(user.lastLoginAt)}</td>
          </tr>
        ))}
      </Table>
      {result.data && (
        <Pages count={result.data.users.length} total={result.data.total} />
      )}
    </>
  );
}
function UserDetail() {
  const { userId = "" } = useParams(),
    [tab, setTab] = useState("overview"),
    [reason, setReason] = useState("");
  const { profile } = useAccount();
  const result = useAccountData<Row>(
    "/api/admin/users/" + encodeURIComponent(userId),
  );
  const action = useAction(result.reload),
    data = result.data;
  return (
    <>
      <Link className="admin-back" to="/admin/users">
        <ArrowLeft size={16} />
        用户管理
      </Link>
      <h1>{data?.user.name || "用户详情"}</h1>
      <ResultState result={result} />
      {data && (
        <>
          <p className="account-id">
            {data.user.userId} · {data.user.email || "尚未填写邮箱"}
          </p>
          <div className="admin-tabs">
            {[
              ["overview", "概览"],
              ["entitlements", "会员权益"],
              ["orders", "订单"],
              ["sessions", "设备会话"],
              ["workshop", "工坊投稿"],
              ["audit", "操作记录"],
            ].map(([value, label]) => (
              <button
                key={value}
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
              >
                {label}
              </button>
            ))}
          </div>
          {action.message && (
            <p className="account-feedback" role="status">
              {action.message}
            </p>
          )}
          {tab === "overview" && (
            <article className="account-card">
              <dl>
                <dt>账号状态</dt>
                <dd>
                  <Status value={data.user.status} /> {data.user.statusReason}
                </dd>
                <dt>身份中心同步</dt>
                <dd>{data.user.identitySyncPending ? "等待重试" : "已同步"}</dd>
                <dt>有效会员</dt>
                <dd>
                  {stateText(data.membership.plan)} ·{" "}
                  {stateText(data.membership.billingType)}
                  {data.membership.proExpirationDate &&
                    ` · 至 ${dateText(data.membership.proExpirationDate)}`}
                </dd>
                <dt>角色</dt>
                <dd>{data.roles.map(stateText).join("、") || "普通用户"}</dd>
                <dt>注册时间</dt>
                <dd>{dateText(data.user.createdAt)}</dd>
              </dl>
              {profile?.permissions.includes("users.manage") && (
                <div className="admin-form">
                  <label>
                    操作原因
                    <input
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      placeholder="填写账号状态调整的原因"
                    />
                  </label>
                  <div className="account-actions">
                    {!!data.user.identitySyncPending && (
                      <button
                        className="account-button"
                        disabled={action.busy || reason.trim().length < 2}
                        onClick={() =>
                          void action.run(() =>
                            accountAPI(
                              `/api/admin/users/${userId}/identity-sync`,
                              {
                                method: "POST",
                                body: JSON.stringify({ reason }),
                              },
                            ),
                          )
                        }
                      >
                        重试身份同步
                      </button>
                    )}
                    {[
                      "active",
                      "suspended",
                      ...(data.user.status === "deletion_requested"
                        ? ["deleted"]
                        : []),
                    ].map((status) => (
                      <button
                        key={status}
                        className="account-button"
                        disabled={
                          action.busy ||
                          reason.trim().length < 2 ||
                          data.user.status === status
                        }
                        onClick={() => {
                          if (
                            confirm(
                              `将当前账号设置为“${stateText(status)}”？${status === "deleted" ? "将删除身份中心登录资料，请确认作品留存与购买记录已核对。" : ""}`,
                            )
                          )
                            void action.run(() =>
                              accountAPI(`/api/admin/users/${userId}/status`, {
                                method: "PATCH",
                                body: JSON.stringify({ status, reason }),
                              }),
                            );
                        }}
                      >
                        {status === "active"
                          ? "恢复账号"
                          : status === "suspended"
                            ? "停用账号"
                            : "完成注销处理"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <h3>历史购买关联</h3>
              {data.claimConflicts?.map((claim: Row) => (
                <div className="account-card" key={claim.id}>
                  <p>认领账号 {claim.userId}</p>
                  <p>原归属账号 {claim.previousUserId}</p>
                  <p>
                    {claim.status === "pending"
                      ? "待核对归属"
                      : claim.status === "transferred"
                        ? "已转移到认领账号"
                        : "已保留原归属"}{" "}
                    · {dateText(claim.createdAt)}
                  </p>
                  {claim.evidence && <p>{claim.evidence}</p>}
                  {claim.status === "pending" &&
                    profile?.permissions.includes("users.manage") &&
                    profile.permissions.includes("billing.manage") && (
                      <>
                        <p className="account-muted">
                          在上方操作原因中填写双方身份核验依据与处理原因，至少 8
                          字。转移将同步该设备的历史订单、余额与对应权益。
                        </p>
                        <div className="account-actions">
                          {[
                            ["keep_existing", "保留原归属"],
                            ["transfer", "转移到认领账号"],
                          ].map(([resolution, label]) => (
                            <button
                              key={resolution}
                              className="account-button"
                              disabled={action.busy || reason.trim().length < 8}
                              onClick={() => {
                                if (
                                  confirm(
                                    `${label}？已核验双方身份与历史购买归属，并记录依据。`,
                                  )
                                )
                                  void action.run(() =>
                                    accountAPI(
                                      `/api/admin/users/${claim.userId}/claims/${claim.id}`,
                                      {
                                        method: "POST",
                                        body: JSON.stringify({
                                          resolution,
                                          reason,
                                          expectedOwnerId: claim.previousUserId,
                                        }),
                                      },
                                    ),
                                  );
                              }}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                </div>
              ))}
              {data.claims.length ? (
                data.claims.map((claim: Row, index: number) => (
                  <p key={index}>
                    {stateText(claim.status)} · {dateText(claim.created_at)} ·{" "}
                    {JSON.parse(claim.details).orderCount || 0} 笔历史订单
                  </p>
                ))
              ) : (
                <p className="account-muted">暂无关联记录。</p>
              )}
            </article>
          )}
          {tab === "entitlements" && (
            <GrantTable rows={data.entitlements} reload={result.reload} />
          )}
          {tab === "orders" && (
            <Table headings={["订单", "金额", "状态", "购买时间"]}>
              {data.orders.map((order: Row) => (
                <tr key={order.order_id}>
                  <td>
                    <Link to={"/admin/orders/" + order.order_id}>
                      {order.order_id}
                    </Link>
                  </td>
                  <td>¥{order.amount}</td>
                  <td>
                    <Status value={order.status} />
                  </td>
                  <td>{dateText(order.created_at)}</td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "sessions" && (
            <>
              <label className="admin-field">
                撤销原因
                <input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                />
              </label>
              <Table headings={["设备", "最近活动", "到期时间", "操作"]}>
                {data.sessions.map((session: Row) => (
                  <tr key={session.id}>
                    <td>{session.deviceName}</td>
                    <td>{dateText(session.lastActiveAt)}</td>
                    <td>{dateText(session.expiresAt)}</td>
                    <td>
                      {profile?.permissions.includes("users.manage") && (
                        <button
                          className="account-button"
                          disabled={action.busy || reason.trim().length < 2}
                          onClick={() => {
                            void action.run(() =>
                              accountAPI(
                                `/api/admin/users/${userId}/sessions`,
                                {
                                  method: "DELETE",
                                  body: JSON.stringify({
                                    sessionId: session.id,
                                    reason,
                                  }),
                                },
                              ),
                            );
                          }}
                        >
                          撤销会话
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
              {profile?.permissions.includes("users.manage") && (
                <button
                  className="account-button"
                  disabled={action.busy || reason.trim().length < 2}
                  onClick={() => {
                    if (confirm("撤销该账号全部登录和 CLI 授权？"))
                      void action.run(() =>
                        accountAPI(`/api/admin/users/${userId}/sessions`, {
                          method: "DELETE",
                          body: JSON.stringify({ reason }),
                        }),
                      );
                  }}
                >
                  撤销全部会话
                </button>
              )}
            </>
          )}
          {tab === "workshop" && (
            <Table headings={["组件", "版本", "状态", "更新时间"]}>
              {data.submissions.map((item: Row) => (
                <tr key={item.id}>
                  <td>
                    <Link to={"/admin/workshop?submission=" + item.id}>
                      {item.widget_id}
                    </Link>
                  </td>
                  <td>{item.version}</td>
                  <td>
                    <Status value={item.status} />
                  </td>
                  <td>{dateText(item.updated_at)}</td>
                </tr>
              ))}
            </Table>
          )}
          {tab === "audit" && <AuditTable rows={data.audit} />}
        </>
      )}
    </>
  );
}
function OrdersPage() {
  const [params] = useSearchParams(),
    result = useAccountData<Row>("/api/admin/orders?" + params.toString());
  return (
    <>
      <h1>订单与退款</h1>
      <Filter statuses={["pending", "activated", "refunded", "expired"]} />
      <ResultState result={result} />
      <Table headings={["订单", "用户", "金额", "状态", "已退", "创建时间"]}>
        {result.data?.orders.map((order: Row) => (
          <tr key={order.orderId}>
            <td>
              <Link to={"/admin/orders/" + order.orderId}>{order.orderId}</Link>
              <small>{order.tradeNo}</small>
            </td>
            <td>
              {order.userId ? (
                <Link to={"/admin/users/" + order.userId}>{order.userId}</Link>
              ) : (
                "历史设备订单"
              )}
            </td>
            <td>¥{order.amount}</td>
            <td>
              <Status value={order.status} />
            </td>
            <td>¥{order.refundedAmount}</td>
            <td>{dateText(order.createdAt)}</td>
          </tr>
        ))}
      </Table>
      {result.data && (
        <Pages count={result.data.orders.length} total={result.data.total} />
      )}
    </>
  );
}
function RefundConfirm({ row, reload }: { row: Row; reload: () => void }) {
  const [reference, setReference] = useState(""),
    action = useAction(reload);
  if (row.status !== "pending")
    return (
      <p>
        {stateText(row.status)} · {row.channel_reference || ""}
      </p>
    );
  return (
    <>
      <form
        className="account-inline-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (confirm("确认支付渠道已完成这笔退款，且凭证与金额已核对？"))
            void action.run(() =>
              accountAPI(`/api/admin/refunds/${row.id}/confirm`, {
                method: "POST",
                body: JSON.stringify({ reference }),
              }),
            );
        }}
      >
        <input
          aria-label="渠道退款凭证号"
          placeholder="渠道退款凭证号"
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          required
          minLength={4}
        />
        <button className="account-button" disabled={action.busy}>
          确认渠道退款
        </button>
        <button
          type="button"
          className="account-button"
          disabled={action.busy}
          onClick={() => {
            void action.run(() =>
              accountAPI(`/api/admin/refunds/${row.id}/cancel`, {
                method: "POST",
                body: "{}",
              }),
            );
          }}
        >
          取消记录
        </button>
      </form>
      {action.message && <p role="status">{action.message}</p>}
    </>
  );
}
function OrderDetail() {
  const { orderId = "" } = useParams(),
    result = useAccountData<Row>("/api/admin/orders/" + orderId),
    action = useAction(result.reload);
  const { profile } = useAccount(),
    [amount, setAmount] = useState(""),
    [reason, setReason] = useState(""),
    [revoke, setRevoke] = useState(true);
  const order = result.data?.order;
  return (
    <>
      <Link className="admin-back" to="/admin/orders">
        <ArrowLeft size={16} />
        订单与退款
      </Link>
      <h1>订单详情</h1>
      <ResultState result={result} />
      {action.message && (
        <p className="account-feedback" role="status">
          {action.message}
        </p>
      )}
      {order && (
        <>
          <article className="account-card">
            <dl>
              <dt>订单号</dt>
              <dd className="account-id">{order.orderId}</dd>
              <dt>用户</dt>
              <dd>
                {order.userId ? (
                  <Link to={"/admin/users/" + order.userId}>
                    {order.userId}
                  </Link>
                ) : (
                  "历史设备购买"
                )}
              </dd>
              <dt>商品</dt>
              <dd>{stateText(order.plan)}</dd>
              <dt>成交金额</dt>
              <dd>
                ¥{order.amount} {order.currency}
              </dd>
              <dt>状态</dt>
              <dd>
                <Status value={order.status} />
              </dd>
              <dt>已确认退款</dt>
              <dd>¥{order.refundedAmount}</dd>
              <dt>渠道交易号</dt>
              <dd>{order.tradeNo || "等待支付"}</dd>
              <dt>创建 / 支付 / 开通</dt>
              <dd>
                {dateText(order.createdAt)} / {dateText(order.paidAt)} /{" "}
                {dateText(order.activatedAt)}
              </dd>
            </dl>
            {profile?.permissions.includes("billing.manage") && (
              <button
                className="account-button"
                disabled={action.busy}
                onClick={() => {
                  void action.run(
                    () =>
                      accountAPI(`/api/admin/orders/${orderId}/verify`, {
                        method: "POST",
                      }),
                    "渠道查单与权益恢复已完成",
                  );
                }}
              >
                主动查单并恢复处理
              </button>
            )}
          </article>
          <article className="account-card">
            <h2>支付处理记录</h2>
            {result.data?.events.length ? (
              result.data.events.map((event: Row) => (
                <div className="admin-event" key={event.id}>
                  <strong>{stateText(event.status)}</strong>
                  <span>
                    {dateText(event.processed_at || event.created_at)}
                  </span>
                  <p>{event.error || "支付事实及权益发放已持久化"}</p>
                  <small>
                    查询次数 {event.attempts} ·{" "}
                    {event.transaction_id || "等待渠道交易号"}
                  </small>
                </div>
              ))
            ) : (
              <p className="account-muted">尚未收到支付确认。</p>
            )}
          </article>
          <article className="account-card">
            <h2>退款记录</h2>
            {result.data?.refunds.map((row: Row) => (
              <div className="admin-event" key={row.id}>
                <strong>
                  ¥{(row.amount_minor / 100).toFixed(2)} ·{" "}
                  {stateText(row.status)}
                </strong>
                <p>
                  {row.reason} · {dateText(row.created_at)}
                </p>
                {profile?.permissions.includes("billing.manage") && (
                  <RefundConfirm row={row} reload={result.reload} />
                )}
              </div>
            ))}
            {profile?.permissions.includes("billing.manage") &&
              order.status === "activated" && (
                <form
                  className="admin-form"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void action.run(
                      () =>
                        accountAPI(`/api/admin/orders/${orderId}/refunds`, {
                          method: "POST",
                          body: JSON.stringify({
                            amount,
                            reason,
                            revokeEntitlement: revoke,
                          }),
                        }),
                      "退款记录已建立，请在支付渠道完成退款后核对凭证",
                    );
                  }}
                >
                  <p>
                    先建立退款记录，在 ZPay
                    渠道完成实际退款后，填写凭证确认处理结果。
                  </p>
                  <label>
                    退款金额
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      max={Number(order.amount) - Number(order.refundedAmount)}
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    原因
                    <textarea
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      required
                      minLength={2}
                    />
                  </label>
                  <label className="admin-checkbox">
                    <input
                      type="checkbox"
                      checked={revoke}
                      onChange={(event) => setRevoke(event.target.checked)}
                    />
                    退款完成后撤销此订单的权益，全额退款会撤销对应权益
                  </label>
                  <button className="account-button" disabled={action.busy}>
                    建立退款记录
                  </button>
                </form>
              )}
          </article>
        </>
      )}
    </>
  );
}
function GrantTable({ rows, reload }: { rows: Row[]; reload: () => void }) {
  const { profile } = useAccount(),
    action = useAction(reload),
    [reason, setReason] = useState("");
  return (
    <>
      {profile?.permissions.includes("billing.manage") && (
        <label className="admin-field">
          撤销原因
          <input
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="撤销操作需要填写原因"
          />
        </label>
      )}
      {action.message && (
        <p className="account-feedback" role="status">
          {action.message}
        </p>
      )}
      <Table
        headings={["用户 / 来源", "会员", "有效期", "状态", "原因", "操作"]}
      >
        {rows.map((row) => (
          <tr key={row.id}>
            <td>
              {row.user_id && (
                <Link to={"/admin/users/" + row.user_id}>
                  {row.name || row.user_id}
                </Link>
              )}
              <small>{stateText(row.source_type)}</small>
            </td>
            <td>
              {stateText(row.plan)} · {stateText(row.billing_type)}
            </td>
            <td>{row.expires_at ? dateText(row.expires_at) : "终身"}</td>
            <td>
              <Status value={row.status} />
            </td>
            <td>{row.reason}</td>
            <td>
              {profile?.permissions.includes("billing.manage") &&
                row.status === "active" && (
                  <button
                    className="account-button"
                    disabled={action.busy || reason.trim().length < 2}
                    onClick={() => {
                      if (
                        confirm(
                          "撤销此来源权益，并按其余有效来源重新计算会员？",
                        )
                      )
                        void action.run(() =>
                          accountAPI(
                            `/api/admin/entitlements/${row.id}/revoke`,
                            {
                              method: "POST",
                              body: JSON.stringify({ reason }),
                            },
                          ),
                        );
                    }}
                  >
                    撤销
                  </button>
                )}
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
function EntitlementsPage() {
  const [params] = useSearchParams(),
    result = useAccountData<Row>(
      "/api/admin/entitlements?" + params.toString(),
    ),
    action = useAction(result.reload);
  const { profile } = useAccount(),
    [userId, setUserId] = useState(""),
    [plan, setPlan] = useState("pro"),
    [expiresAt, setExpiresAt] = useState(""),
    [reason, setReason] = useState("");
  return (
    <>
      <h1>会员权益</h1>
      <Filter />
      <ResultState result={result} />
      {result.data && (
        <>
          <GrantTable rows={result.data.entitlements} reload={result.reload} />
          <Pages count={result.data.entitlements.length} />
        </>
      )}
      {profile?.permissions.includes("billing.manage") && (
        <details className="account-card">
          <summary>发放人工补偿权益</summary>
          <form
            className="admin-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (
                confirm(
                  `为 ${userId} 发放 ${stateText(plan)} ${expiresAt ? "限期" : "终身"}权益？`,
                )
              )
                void action.run(() =>
                  accountAPI("/api/admin/entitlements", {
                    method: "POST",
                    headers: { "Idempotency-Key": crypto.randomUUID() },
                    body: JSON.stringify({
                      userId,
                      plan,
                      expiresAt: expiresAt
                        ? new Date(expiresAt).toISOString()
                        : null,
                      reason,
                    }),
                  }),
                );
            }}
          >
            <label>
              用户 ID
              <input
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                required
              />
            </label>
            <label>
              会员等级
              <select
                value={plan}
                onChange={(event) => setPlan(event.target.value)}
              >
                <option value="pro">Pro</option>
                <option value="ultra">Ultra</option>
              </select>
            </label>
            <label>
              到期时间，留空为终身
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
            </label>
            <label>
              调整原因
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                required
                minLength={2}
              />
            </label>
            <button className="account-button primary" disabled={action.busy}>
              确认发放
            </button>
            {action.message && <p role="status">{action.message}</p>}
          </form>
        </details>
      )}
    </>
  );
}
function AccessPage() {
  const [userId, setUserId] = useState(""),
    [target, setTarget] = useState(""),
    [selected, setSelected] = useState<string[]>([]),
    [reason, setReason] = useState("");
  const result = useAccountData<Row>(
      target ? "/api/admin/users/" + encodeURIComponent(target) : null,
    ),
    definitions = useAccountData<Row>("/api/admin/roles"),
    action = useAction(result.reload);
  useEffect(() => {
    if (result.data) setSelected(result.data.roles);
  }, [result.data]);
  return (
    <>
      <h1>角色权限</h1>
      <form
        className="admin-filter"
        onSubmit={(event) => {
          event.preventDefault();
          setTarget(userId.trim());
        }}
      >
        <input
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="输入完整用户 ID"
          aria-label="用户 ID"
          required
        />
        <button className="account-button">查看授权</button>
      </form>
      <ResultState result={result} />
      {result.data && (
        <form
          className="account-card admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              confirm(
                `将 ${result.data?.user.name || target} 的角色修改为 ${selected.map(stateText).join("、") || "普通用户"}？`,
              )
            )
              void action.run(() =>
                accountAPI(
                  `/api/admin/users/${encodeURIComponent(target)}/roles`,
                  {
                    method: "PUT",
                    body: JSON.stringify({ roles: selected, reason }),
                  },
                ),
              );
          }}
        >
          <h2>{result.data.user.name || target}</h2>
          <p className="account-id">{target}</p>
          {roleNames.map((role) => (
            <label className="admin-checkbox" key={role}>
              <input
                type="checkbox"
                checked={selected.includes(role)}
                onChange={(event) =>
                  setSelected((value) =>
                    event.target.checked
                      ? [...value, role]
                      : value.filter((item) => item !== role),
                  )
                }
              />
              <span>
                {stateText(role)}
                <small>{definitions.data?.roles[role]?.join(" · ")}</small>
              </span>
            </label>
          ))}
          <label>
            授权原因
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              minLength={2}
            />
          </label>
          <button className="account-button primary" disabled={action.busy}>
            保存角色
          </button>
          {action.message && <p role="status">{action.message}</p>}
        </form>
      )}
    </>
  );
}
function ProductsPage() {
  const result = useAccountData<Row>("/api/admin/products"),
    action = useAction(result.reload),
    [price, setPrice] = useState(""),
    [enabled, setEnabled] = useState(true),
    [reason, setReason] = useState("");
  useEffect(() => {
    if (result.data) {
      setPrice(result.data.lifetime.price);
      setEnabled(result.data.lifetime.enabled);
    }
  }, [result.data]);
  return (
    <>
      <h1>商品设置</h1>
      <ResultState result={result} />
      {result.data && (
        <form
          className="account-card admin-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (
              confirm(
                `后续新订单使用价格 ¥${price}，商品${enabled ? "可购买" : "暂停售卖"}。确认保存？`,
              )
            )
              void action.run(() =>
                accountAPI("/api/admin/products", {
                  method: "PATCH",
                  body: JSON.stringify({
                    price,
                    enabled,
                    reason,
                    expectedPrice: result.data?.lifetime.price,
                    expectedEnabled: result.data?.lifetime.enabled,
                  }),
                }),
              );
          }}
        >
          <h2>Pro 终身会员</h2>
          <p>一次购买 · CNY，订单按创建时的价格快照核验付款。</p>
          <label>
            新订单售价
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </label>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
            开放购买
          </label>
          <label>
            修改原因
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              required
              minLength={2}
            />
          </label>
          <button className="account-button primary" disabled={action.busy}>
            保存商品设置
          </button>
          {action.message && <p role="status">{action.message}</p>}
        </form>
      )}
    </>
  );
}
function AuditTable({ rows }: { rows: Row[] }) {
  return (
    <Table headings={["时间", "操作者", "操作", "目标", "原因与详情"]}>
      {rows.map((row) => (
        <tr key={row.id}>
          <td>{dateText(row.created_at)}</td>
          <td className="account-id">{row.actor_id}</td>
          <td>{row.action}</td>
          <td className="account-id">{row.target_id}</td>
          <td>
            {row.reason}
            <details>
              <summary>查看变更</summary>
              <pre>
                {JSON.stringify(JSON.parse(row.details || "{}"), null, 2)}
              </pre>
            </details>
          </td>
        </tr>
      ))}
    </Table>
  );
}
function AuditPage() {
  const [params] = useSearchParams(),
    result = useAccountData<Row>("/api/admin/audit?" + params.toString());
  return (
    <>
      <h1>操作日志</h1>
      <Filter />
      <ResultState result={result} />
      {result.data && (
        <>
          <AuditTable rows={result.data.logs} />
          <Pages count={result.data.logs.length} />
        </>
      )}
    </>
  );
}
function WorkshopPage() {
  const [params, setParams] = useSearchParams(),
    status = params.get("status") || "submitted";
  const result = useAccountData<Row>(
    "/api/workshop/reviews?status=" + encodeURIComponent(status),
  );
  const selected = params.get("submission");
  const detail = useAccountData<Row>(
    selected ? "/api/workshop/submissions/" + selected : null,
  );
  const [note, setNote] = useState("");
  const action = useAction(() => {
    result.reload();
    detail.reload();
  });
  const item = detail.data?.submission;
  const decision = (value: string) =>
    action.run(() =>
      accountAPI(`/api/workshop/submissions/${item.id}/review`, {
        method: "POST",
        body: JSON.stringify({
          decision: value,
          expectedRevision: item.revision,
          sha256: item.sha256,
          note,
        }),
      }),
    );
  return (
    <>
      <h1>创意工坊</h1>
      <div className="admin-filter">
        <select
          aria-label="投稿状态"
          value={status}
          onChange={(event) => setParams({ status: event.target.value })}
        >
          {[
            "submitted",
            "changes_requested",
            "published",
            "unlisted",
            "rejected",
          ].map((value) => (
            <option value={value} key={value}>
              {value === "unlisted" ? "已下架" : stateText(value)}
            </option>
          ))}
        </select>
        <button className="account-button" onClick={result.reload}>
          刷新
        </button>
      </div>
      <ResultState result={result} />
      <Table headings={["组件", "作者", "版本", "状态", "更新时间"]}>
        {result.data?.submissions.map((row: Row) => (
          <tr key={row.id}>
            <td>
              <button
                className="admin-link"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  next.set("submission", row.id);
                  setParams(next);
                  setNote("");
                }}
              >
                {row.manifest?.name || row.widgetId}
              </button>
            </td>
            <td>{row.ownerId}</td>
            <td>{row.version}</td>
            <td>
              <Status value={row.status} />
            </td>
            <td>{dateText(row.updatedAt)}</td>
          </tr>
        ))}
      </Table>
      <ResultState result={detail} />
      {item && (
        <article className="account-card admin-review">
          <h2>{item.manifest?.name || item.widgetId}</h2>
          <p>{item.manifest?.description}</p>
          <p>
            作者 {item.ownerId} · 版本 {item.version} · 修订 {item.revision}
          </p>
          <p className="account-id">SHA-256 {item.sha256 || "等待上传"}</p>
          <h3>权限声明</h3>
          <pre>{JSON.stringify(item.manifest?.permissions || {}, null, 2)}</pre>
          <h3>组件说明</h3>
          <p className="admin-preserve">
            {item.metadata?.readme || "作者尚未提供说明"}
          </p>
          <div className="admin-screenshots">
            {item.metadata?.screenshots?.map(
              (src: string) =>
                /^https?:\/\//.test(src) && (
                  <a href={src} key={src} target="_blank" rel="noreferrer">
                    <img src={src} alt="作者提供的组件截图" />
                  </a>
                ),
            )}
          </div>
          <div className="account-actions">
            <a
              className="account-button"
              href={
                WORKSHOP_ORIGIN + `/api/workshop/submissions/${item.id}/package`
              }
            >
              下载当前包检查源码
            </a>
            {/^https?:\/\//.test(item.sourceURL || "") && (
              <a
                className="account-button"
                href={item.sourceURL}
                target="_blank"
                rel="noreferrer"
              >
                打开来源
              </a>
            )}
          </div>
          <label className="admin-field">
            审核意见或操作原因
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <div className="account-actions">
            {item.status === "submitted" && (
              <>
                <button
                  className="account-button primary"
                  disabled={action.busy}
                  onClick={() => {
                    if (confirm("批准当前所见版本和包哈希，发布到工坊？"))
                      void decision("approve");
                  }}
                >
                  批准并发布
                </button>
                <button
                  className="account-button"
                  disabled={action.busy || note.trim().length < 2}
                  onClick={() => {
                    void decision("changes_requested");
                  }}
                >
                  要求修改
                </button>
                <button
                  className="account-button"
                  disabled={action.busy || note.trim().length < 2}
                  onClick={() => {
                    void decision("reject");
                  }}
                >
                  拒绝
                </button>
              </>
            )}
            {item.status === "published" && (
              <>
                <button
                  className="account-button"
                  disabled={action.busy || note.trim().length < 2}
                  onClick={() => {
                    if (confirm("将当前组件从公开工坊下架？"))
                      void action.run(() =>
                        accountAPI(
                          `/api/workshop/widgets/${item.widgetId}/unlist`,
                          {
                            method: "POST",
                            body: JSON.stringify({ reason: note }),
                          },
                        ),
                      );
                  }}
                >
                  下架组件
                </button>
                <button
                  className="account-button"
                  disabled={action.busy || note.trim().length < 2}
                  onClick={() => {
                    if (confirm("撤销当前版本，停止该版本下载？"))
                      void action.run(() =>
                        accountAPI(
                          `/api/workshop/widgets/${item.widgetId}/versions/${item.version}/revoke`,
                          {
                            method: "POST",
                            body: JSON.stringify({ reason: note }),
                          },
                        ),
                      );
                  }}
                >
                  撤销此版本
                </button>
                <Link
                  className="account-button"
                  to={"/workshop/" + item.widgetId}
                >
                  公开详情
                </Link>
              </>
            )}
          </div>
          {action.message && (
            <p className="account-feedback" role="status">
              {action.message}
            </p>
          )}
          {detail.data?.reviews?.length > 0 && (
            <>
              <h3>审核记录</h3>
              {detail.data.reviews.map((review: Row, index: number) => (
                <div className="admin-event" key={index}>
                  <strong>{review.decision}</strong>
                  <span>{dateText(review.createdAt)}</span>
                  <p>{review.note}</p>
                </div>
              ))}
            </>
          )}
        </article>
      )}
    </>
  );
}

export default function Admin() {
  const { profile, loading, error } = useAccount();
  if (loading)
    return (
      <section className="account-page">
        <p>正在验证管理员身份…</p>
      </section>
    );
  if (!profile)
    return (
      <section className="account-page account-login account-card">
        <h1>登录管理后台</h1>
        <p>{error || "使用已授权的灵剪个人账号登录。"}</p>
        <a
          className="account-button primary"
          href={loginHref(window.location.pathname + window.location.search)}
        >
          登录
        </a>
      </section>
    );
  if (!profile.permissions.length)
    return (
      <section className="account-page account-card">
        <h1>当前账号没有管理权限</h1>
        <p>
          {profile.name} · {profile.userId}
        </p>
        <Link to="/account">返回账户中心</Link>
      </section>
    );
  const allowed = (permission: string, page: ReactNode) =>
    profile.permissions.includes(permission) ? (
      page
    ) : (
      <article className="account-card">
        <h1>权限不足</h1>
        <p>当前角色无法访问该页面。</p>
        <Link to="/admin">返回概览</Link>
      </article>
    );
  return (
    <section className="admin-page">
      <aside className="admin-sidebar">
        <p className="account-kicker">灵剪管理后台</p>
        <nav aria-label="后台导航">
          {nav
            .filter(
              (item) =>
                !item.permission ||
                profile.permissions.includes(item.permission),
            )
            .map((item) => (
              <NavLink
                key={item.path}
                to={"/admin" + (item.path ? "/" + item.path : "")}
                end={!item.path}
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
        </nav>
        <p className="account-muted">
          {profile.name || profile.userId}
          <br />
          {profile.roles.map(stateText).join("、")}
        </p>
      </aside>
      <div className="admin-content">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="users" element={allowed("users.read", <UsersPage />)} />
          <Route
            path="users/:userId"
            element={allowed("users.read", <UserDetail />)}
          />
          <Route
            path="orders"
            element={allowed("orders.read", <OrdersPage />)}
          />
          <Route
            path="orders/:orderId"
            element={allowed("orders.read", <OrderDetail />)}
          />
          <Route
            path="entitlements"
            element={allowed("orders.read", <EntitlementsPage />)}
          />
          <Route
            path="workshop"
            element={allowed("workshop.review", <WorkshopPage />)}
          />
          <Route
            path="access"
            element={allowed("roles.manage", <AccessPage />)}
          />
          <Route
            path="products"
            element={allowed("products.manage", <ProductsPage />)}
          />
          <Route path="audit" element={allowed("audit.read", <AuditPage />)} />
          <Route
            path="*"
            element={
              <p>
                页面不存在。<Link to="/admin">返回概览</Link>
              </p>
            }
          />
        </Routes>
      </div>
    </section>
  );
}
