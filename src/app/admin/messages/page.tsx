import { getAdminMessages } from "@/lib/content/admin-queries";
import { deleteMessage, updateMessageStatus } from "@/lib/actions/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { StatusPill } from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await getAdminMessages();

  return (
    <div className="admin-manage">
      <AdminPageHeader title="Messages" subtitle={`${messages.length} inbound · contact form`} />
      <section className="admin-tile admin-tile-static p-4 md:p-5">
        {messages.length ? (
          <div className="admin-inbox">
            {messages.map((item) => (
              <article key={String(item._id)} className="admin-inbox-item">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="admin-record-title">{String(item.subject)}</p>
                    <p className="admin-record-meta">
                      {String(item.name)} · {String(item.email)}
                    </p>
                  </div>
                  <StatusPill value={String(item.status)} />
                </div>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[#a6abb8]">{String(item.message)}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <DeleteButton action={updateMessageStatus.bind(null, String(item._id), "READ")} label="Mark read" />
                  <DeleteButton action={updateMessageStatus.bind(null, String(item._id), "ARCHIVED")} label="Archive" />
                  <DeleteButton action={deleteMessage.bind(null, String(item._id))} />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="admin-empty">Inbox is empty.</p>
        )}
      </section>
    </div>
  );
}
