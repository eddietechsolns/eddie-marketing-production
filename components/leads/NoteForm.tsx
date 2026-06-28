"use client";

import { useActionState, useEffect, useRef } from "react";
import { addLeadNote, type AddLeadNoteState } from "@/actions/addLeadNote";

interface Props {
  leadId: number;
}

export function NoteForm({ leadId }: Props) {
  const boundAction = addLeadNote.bind(null, leadId);
  const [state, formAction, pending] = useActionState<AddLeadNoteState, FormData>(
    boundAction,
    null
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state?.success && textareaRef.current) {
      textareaRef.current.value = "";
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          Note saved.
        </p>
      )}
      <textarea
        ref={textareaRef}
        name="note"
        rows={3}
        placeholder="Add an internal note…"
        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none"
        required
        minLength={2}
      />
      <div className="flex items-center gap-3">
        <input
          name="createdBy"
          type="text"
          placeholder="Your name (optional)"
          className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
        >
          {pending ? "Saving…" : "Add Note"}
        </button>
      </div>
    </form>
  );
}
