"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  minHeight?: number;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Small toolbar button helper
───────────────────────────────────────────────────────────────────────────── */
function TBtn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      disabled={disabled}
      className={`inline-flex items-center justify-center w-7 h-7 rounded text-sm transition-colors select-none
        ${active
          ? "bg-slate-800 text-white"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
        ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SVG icons (inline, no extra dep)
───────────────────────────────────────────────────────────────────────────── */
const icons = {
  bold:        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 11h4.5a2.5 2.5 0 0 0 0-5H8v5Zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5ZM8 13v5h5.5a2.5 2.5 0 0 0 0-5H8Z"/></svg>,
  italic:      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M15 4H9v2h2.927l-2.516 12H7v2h6v-2h-2.927l2.516-12H15V4Z"/></svg>,
  underline:   <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 3v9a4 4 0 0 0 8 0V3h2v9a6 6 0 0 1-12 0V3h2ZM4 20h16v2H4v-2Z"/></svg>,
  strike:      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.719H17.154ZM11.586 4c1.552 0 2.994.382 4.327 1.145s2.017 1.8 2.017 3.114c0 .867-.217 1.602-.65 2.205-.433.601-.938 1.038-1.516 1.311H4v-2h7.067c-.624-.22-1.14-.535-1.55-.946-.41-.41-.615-.974-.615-1.692 0-.67.242-1.225.727-1.665C10.113 4.822 10.76 4.5 11.586 4.5V4ZM4 11h16v2H4v-2Z"/></svg>,
  h1:          <span className="text-[10px] font-bold leading-none">H1</span>,
  h2:          <span className="text-[10px] font-bold leading-none">H2</span>,
  h3:          <span className="text-[10px] font-bold leading-none">H3</span>,
  h4:          <span className="text-[10px] font-bold leading-none">H4</span>,
  p:           <span className="text-[10px] font-medium leading-none">¶</span>,
  ul:          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 4h13v2H8V4ZM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3ZM8 11h13v2H8v-2Zm0 7h13v2H8v-2Z"/></svg>,
  ol:          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M8 4h13v2H8V4ZM5 3v3h1v1H3V6h1V4H3V3h2Zm-2 9.5h1.8l-1.8 2.1V16h3v-1H4.2l1.8-2.1V11H3v1.5Zm2 5.5v3H3v-1h1v-.5H3V14h1v-.5H3V13h2v5Zm1 2h13v2H8v-2Zm0-7h13v2H8v-2Z"/></svg>,
  blockquote:  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179Z"/></svg>,
  hr:          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M2 11h2v2H2v-2Zm4 0h12v2H6v-2Zm14 0h2v2h-2v-2Z"/></svg>,
  link:        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.364 15.536 16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.221a7 7 0 0 1 9.9 9.9l-1.415 1.415Zm-2.828 2.828-1.415 1.415a7 7 0 0 1-9.9-9.9l1.415-1.415L7.05 9.878l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.415Zm-.708-10.607 1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.071Z"/></svg>,
  unlink:      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="m17.657 14.828-1.414-1.414L17.657 12A5 5 0 0 0 10.586 4.93L9.172 6.343 7.757 4.929 9.172 3.515a7 7 0 0 1 9.9 9.9l-1.415 1.413Zm-2.829 2.83-1.414 1.413a7 7 0 0 1-9.9-9.9l1.414-1.414 1.414 1.414L4.929 10.6a5 5 0 0 0 7.07 7.07l1.415-1.414 1.414 1.414Zm0-9.9 1.415 1.415L9.17 16.244 7.757 14.83l7.071-7.071ZM5.775 2.293l1.932-.518L8.74 5.215l-1.931.518-1.034-3.44ZM2.293 5.775l.518-1.932 3.44 1.034-.518 1.932-3.44-1.034Zm14.49 14.585-1.931.518-1.034-3.44 1.932-.518 1.033 3.44Zm3.44-3.44-.518 1.932-3.44-1.034.518-1.932 3.44 1.034Z"/></svg>,
  image:       <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1ZM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm6.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z"/></svg>,
  youtube:     <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38.945.266 1.687 1.04 1.938 2.022.4 1.56.45 4.602.456 5.339v.27c-.006.737-.056 3.778-.456 5.339-.254.985-.997 1.76-1.938 2.022-2.87.788-10.543.788-10.543.788s-7.668 0-10.543-.788c-.945-.266-1.687-1.04-1.938-2.022-.4-1.56-.45-4.602-.456-5.339v-.27c.006-.737.056-3.778.456-5.339.254-.985.997-1.76 1.938-2.022 2.87-.788 10.543-.788 10.543-.788zm-2.244 4v8l6-4-6-4z"/></svg>,
  table:       <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M5 7h2v2H5V7Zm0 4h2v2H5v-2Zm0 4h2v2H5v-2Zm4-8h6v2H9V7Zm0 4h6v2H9v-2Zm0 4h6v2H9v-2Zm8-8h2v2h-2V7Zm0 4h2v2h-2v-2Zm0 4h2v2h-2v-2ZM3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm1 2v14h16V5H4Z"/></svg>,
  alignL:      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M3 4h18v2H3V4Zm0 4h12v2H3V8Zm0 4h18v2H3v-2Zm0 4h12v2H3v-2Zm0 4h18v2H3v-2Z"/></svg>,
  alignC:      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M3 4h18v2H3V4Zm3 4h12v2H6V8Zm-3 4h18v2H3v-2Zm3 4h12v2H6v-2Zm-3 4h18v2H3v-2Z"/></svg>,
  alignR:      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M3 4h18v2H3V4Zm6 4h12v2H9V8Zm-6 4h18v2H3v-2Zm6 4h12v2H9v-2Zm-6 4h18v2H3v-2Z"/></svg>,
  undo:        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828Z"/></svg>,
  redo:        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7Z"/></svg>,
  code:        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="currentColor"><path d="M23 12l-7.071 7.071-1.414-1.414L20.172 12l-5.657-5.657 1.414-1.414L23 12ZM3.828 12l5.657 5.657-1.414 1.414L1 12l7.071-7.071 1.414 1.414L3.828 12Z"/></svg>,
};

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────────── */
export default function RichTextEditor({ name, defaultValue, placeholder, minHeight = 320 }: Props) {
  const [html, setHtml] = useState<string>(defaultValue ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        codeBlock: false,
      }),
      Underline,
      Image.configure({ allowBase64: true, inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: defaultValue ?? "",
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
    editorProps: {
      handleDrop(view, event, _slice, moved) {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (!file.type.startsWith("image/")) return false;
          const reader = new FileReader();
          reader.onload = () => {
            const { schema } = view.state;
            const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
            const node = schema.nodes.image.create({ src: reader.result });
            const transaction = view.state.tr.insert(coordinates?.pos ?? 0, node);
            view.dispatch(transaction);
          };
          reader.readAsDataURL(file);
          return true;
        }
        return false;
      },
      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const item of Array.from(items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = () => {
              const { schema } = view.state;
              const node = schema.nodes.image.create({ src: reader.result });
              const transaction = view.state.tr.replaceSelectionWith(node);
              view.dispatch(transaction);
            };
            reader.readAsDataURL(file);
            event.preventDefault();
            return true;
          }
        }
        return false;
      },
    },
  });

  // Keep in sync if editor re-mounts (e.g. React strict mode)
  useEffect(() => {
    if (editor && !editor.isDestroyed && defaultValue !== undefined && defaultValue !== null) {
      const current = editor.getHTML();
      if (current !== defaultValue && defaultValue !== html) {
        editor.commands.setContent(defaultValue, false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Toolbar actions ────────────────────────────────────────────────────── */
  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Enter URL:", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback((src?: string) => {
    if (!editor) return;
    const url = src ?? window.prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addYoutube = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("YouTube URL:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }, [editor]);

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }, [editor]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => addImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [editor, addImage]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all">
      {/* Hidden input — submits HTML to server action */}
      <input type="hidden" name={name} value={html} />
      {/* Hidden file input for image upload */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">

        {/* Undo / Redo */}
        <TBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">{icons.undo}</TBtn>
        <TBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">{icons.redo}</TBtn>

        <Divider />

        {/* Block type */}
        <TBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Paragraph">{icons.p}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">{icons.h1}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">{icons.h2}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">{icons.h3}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive("heading", { level: 4 })} title="Heading 4">{icons.h4}</TBtn>

        <Divider />

        {/* Inline formatting */}
        <TBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)">{icons.bold}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)">{icons.italic}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline (Ctrl+U)">{icons.underline}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">{icons.strike}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline Code">{icons.code}</TBtn>

        <Divider />

        {/* Alignment */}
        <TBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">{icons.alignL}</TBtn>
        <TBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">{icons.alignC}</TBtn>
        <TBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">{icons.alignR}</TBtn>

        <Divider />

        {/* Lists */}
        <TBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">{icons.ul}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">{icons.ol}</TBtn>
        <TBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">{icons.blockquote}</TBtn>
        <TBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">{icons.hr}</TBtn>

        <Divider />

        {/* Link */}
        <TBtn onClick={addLink} active={editor.isActive("link")} title="Add Link">{icons.link}</TBtn>
        <TBtn onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} title="Remove Link">{icons.unlink}</TBtn>

        <Divider />

        {/* Media */}
        <TBtn onClick={() => fileInputRef.current?.click()} title="Upload Image from Computer">{icons.image}</TBtn>
        <TBtn onClick={() => addImage()} title="Insert Image by URL">{icons.image}</TBtn>
        <TBtn onClick={addYoutube} title="Embed YouTube Video">{icons.youtube}</TBtn>

        <Divider />

        {/* Table */}
        <TBtn onClick={insertTable} title="Insert Table">{icons.table}</TBtn>
        {editor.isActive("table") && (
          <>
            <TBtn onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Before">
              <span className="text-[9px] font-bold">+Col</span>
            </TBtn>
            <TBtn onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column">
              <span className="text-[9px] font-bold">-Col</span>
            </TBtn>
            <TBtn onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Before">
              <span className="text-[9px] font-bold">+Row</span>
            </TBtn>
            <TBtn onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row">
              <span className="text-[9px] font-bold">-Row</span>
            </TBtn>
            <TBtn onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">
              <span className="text-[9px] font-bold text-red-500">×Tbl</span>
            </TBtn>
          </>
        )}
      </div>

      {/* ── Editor content area ──────────────────────────────────────────── */}
      <EditorContent
        editor={editor}
        className="rte-content"
        style={{ minHeight }}
      />

      {/* Word count hint */}
      <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
        <p className="text-[10px] text-slate-400">
          Drag & drop images · Paste from Word · Ctrl+Z to undo
        </p>
        <p className="text-[10px] text-slate-400">
          {editor.storage.characterCount?.words?.() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>
    </div>
  );
}
