"use client";

import { useState } from "react";

export function DeleteButton({
  action,
  label = "Delete",
}: {
  action: () => Promise<unknown>;
  label?: string;
}) {
  const [pending, setPending] = useState(false);
  const danger = label === "Delete";
  return (
    <button
      type="button"
      className={danger ? "admin-btn-danger" : "admin-btn-ghost h-8 px-3 text-xs"}
      disabled={pending}
      onClick={async () => {
        if (danger && !window.confirm("This cannot be undone. Continue?")) return;
        setPending(true);
        await action();
        setPending(false);
      }}
    >
      {pending ? "Working..." : label}
    </button>
  );
}
