import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

function ToolbarButton({ onClick, active, disabled, children, title }) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={[
                "rounded border px-2 py-1 text-xs font-medium",
                "hover:bg-gray-50 disabled:opacity-50",
                active ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-900 border-gray-300",
            ].join(" ")}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Escreva seu conteúdo…",
    disabled = false,
}) {
    const editor = useEditor({
        editable: !disabled,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: true,
                bulletList: true,
                orderedList: true,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: {
                    rel: "noopener noreferrer nofollow",
                    target: "_blank",
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value || "",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
        editorProps: {
            attributes: {
                class: [
                    "min-h-[240px] w-full rounded-b border border-t-0 border-gray-300",
                    "bg-white p-3 text-sm leading-6 outline-none",
                    "prose prose-sm max-w-none",
                ].join(" "),
            },
        },
    });

    useEffect(() => {
        if (!editor) return;
        const current = editor.getHTML();
        const next = value || "";

        if (current !== next) {
            editor.commands.setContent(next, false);
        }
    }, [value, editor]);

    if (!editor) {
        return (
            <div className="rounded border border-gray-300 p-3 text-sm text-gray-500">
                Carregando editor…
            </div>
        );
    }

    const can = (cmd) => !disabled && cmd?.();

    const setLink = () => {
        const previousUrl = editor.getAttributes("link").href || "";
        const url = window.prompt("URL do link:", previousUrl);
        if (url === null) return;

        if (url.trim() === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
    };

    return (
        <div className="w-full">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 rounded-t border border-gray-300 bg-white p-2">
                <ToolbarButton
                    title="Negrito"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                    disabled={!can(() => editor.can().chain().focus().toggleBold().run())}
                >
                    B
                </ToolbarButton>

                <ToolbarButton
                    title="Itálico"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                    disabled={!can(() => editor.can().chain().focus().toggleItalic().run())}
                >
                    I
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-gray-200" />

                <ToolbarButton
                    title="Heading 1"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive("heading", { level: 1 })}
                    disabled={!can(() => editor.can().chain().focus().toggleHeading({ level: 1 }).run())}
                >
                    H1
                </ToolbarButton>

                <ToolbarButton
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                    disabled={!can(() => editor.can().chain().focus().toggleHeading({ level: 2 }).run())}
                >
                    H2
                </ToolbarButton>

                <ToolbarButton
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                    disabled={!can(() => editor.can().chain().focus().toggleHeading({ level: 3 }).run())}
                >
                    H3
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-gray-200" />

                <ToolbarButton
                    title="Lista"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                    disabled={!can(() => editor.can().chain().focus().toggleBulletList().run())}
                >
                    • List
                </ToolbarButton>

                <ToolbarButton
                    title="Lista numerada"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                    disabled={!can(() => editor.can().chain().focus().toggleOrderedList().run())}
                >
                    1. List
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-gray-200" />

                <ToolbarButton
                    title="Link"
                    onClick={setLink}
                    active={editor.isActive("link")}
                    disabled={!can(() => true)}
                >
                    Link
                </ToolbarButton>

                <ToolbarButton
                    title="Remover link"
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    active={false}
                    disabled={!can(() => editor.isActive("link"))}
                >
                    Unlink
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-gray-200" />

                <ToolbarButton
                    title="Inline code"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    active={editor.isActive("code")}
                    disabled={!can(() => editor.can().chain().focus().toggleCode().run())}
                >
                    {"</>"}
                </ToolbarButton>

                <ToolbarButton
                    title="Code block"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    active={editor.isActive("codeBlock")}
                    disabled={!can(() => editor.can().chain().focus().toggleCodeBlock().run())}
                >
                    Code block
                </ToolbarButton>

                <div className="mx-1 h-5 w-px bg-gray-200" />

                <ToolbarButton
                    title="Desfazer"
                    onClick={() => editor.chain().focus().undo().run()}
                    active={false}
                    disabled={!can(() => editor.can().chain().focus().undo().run())}
                >
                    Undo
                </ToolbarButton>

                <ToolbarButton
                    title="Refazer"
                    onClick={() => editor.chain().focus().redo().run()}
                    active={false}
                    disabled={!can(() => editor.can().chain().focus().redo().run())}
                >
                    Redo
                </ToolbarButton>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
}
