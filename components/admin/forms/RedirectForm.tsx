"use client";

import { useActionState } from "react";
import type { Redirect } from "@prisma/client";
import { saveRedirect } from "@/lib/actions/redirects";

interface Props {
  redirect?: Redirect;
}

export default function RedirectForm({ redirect: item }: Props) {
  const [state, action, pending] = useActionState(saveRedirect, { error: null });

  return (
    <form action={action} className="space-y-5 max-w-xl">
      {item && <input type="hidden" name="id" value={item.id} />}

      {state.error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Source URL <span className="text-red-500">*</span>
        </label>
        <input
          name="sourceUrl"
          defaultValue={item?.sourceUrl ?? ""}
          placeholder="/old-page-url"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500">The URL to redirect from (e.g. /old-service)</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target URL <span className="text-red-500">*</span>
        </label>
        <input
          name="targetUrl"
          defaultValue={item?.targetUrl ?? ""}
          placeholder="/new-page-url or https://example.com"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500">The URL to redirect to</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Redirect Type</label>
        <select
          name="statusCode"
          defaultValue={item?.statusCode ?? 301}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={301}>301 — Permanent</option>
          <option value={302}>302 — Temporary</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          defaultValue={item?.notes ?? ""}
          rows={2}
          placeholder="Why this redirect exists (optional)"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : item ? "Update Redirect" : "Create Redirect"}
        </button>
        <a href="/admin/redirects" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </a>
      </div>
    </form>
  );
}
