"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

export function ManageChrome({
  title,
  subtitle,
  count,
  addLabel,
  form,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  addLabel: string;
  form: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-manage">
      <AdminPageHeader title={title} subtitle={`${count} records · ${subtitle}`}>
        <button type="button" className="admin-btn-primary" onClick={() => setOpen(true)}>
          <Plus className="size-3.5" />
          {addLabel}
        </button>
      </AdminPageHeader>
      <section className="admin-tile admin-tile-static p-4 md:p-5">{children}</section>
      {open ? (
        <div className="admin-drawer-overlay" onClick={() => setOpen(false)}>
          <aside className="admin-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="admin-eyebrow">Composer</p>
                <h2 className="admin-heading mt-1 text-xl">{addLabel}</h2>
              </div>
              <button type="button" className="admin-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            {form}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
