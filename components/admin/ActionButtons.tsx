"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
  action: () => Promise<void>;
  label?: string;
}

export function DeleteButton({ action, label = "Delete" }: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("Are you sure you want to delete this? This cannot be undone.")) return;
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}

interface ToggleStatusButtonProps {
  action: () => Promise<void>;
  status: string;
}

export function ToggleStatusButton({ action, status }: ToggleStatusButtonProps) {
  const [pending, startTransition] = useTransition();
  const isPublished = status === "published";

  function handleClick() {
    startTransition(async () => {
      await action();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`text-sm disabled:opacity-50 transition-colors ${
        isPublished
          ? "text-yellow-600 hover:text-yellow-800"
          : "text-green-600 hover:text-green-800"
      }`}
    >
      {pending ? "Saving…" : isPublished ? "Unpublish" : "Publish"}
    </button>
  );
}

interface SaveButtonProps {
  pending: boolean;
  label?: string;
}

export function SaveButton({ pending, label = "Save" }: SaveButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
