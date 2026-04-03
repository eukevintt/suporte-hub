import { useMemo, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function getCsrf() {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el?.getAttribute("content") || "";
}

function normalizeUrl(url) {
    if (!url) return "";

    const trimmed = url.trim();
    if (!trimmed) return "";

    if (
        trimmed.startsWith("http://") ||
        trimmed.startsWith("https://") ||
        trimmed.startsWith("mailto:") ||
        trimmed.startsWith("tel:")
    ) {
        return trimmed;
    }

    return `https://${trimmed}`;
}

export default function QuillEditor({
    value,
    onChange,
    disabled = false,
    articleId = null,
}) {
    const quillRef = useRef(null);

    const uploadFile = async (fileOrBlob, filename) => {
        const formData = new FormData();
        formData.append("file", fileOrBlob, filename);

        if (articleId) {
            formData.append("article_id", String(articleId));
        }

        const res = await fetch(route("articles.images.upload"), {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "X-CSRF-TOKEN": getCsrf(),
                Accept: "application/json",
            },
            body: formData,
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Upload failed");
        }

        const json = await res.json();

        if (!json.location) {
            throw new Error("Invalid upload response");
        }

        return json.location;
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image", "code-block"],
                    ["clean"],
                ],
                handlers: {
                    link: function () {
                        const quill = quillRef.current?.getEditor();
                        if (!quill) return;

                        const range = quill.getSelection();
                        if (!range || range.length === 0) {
                            alert("Selecione um texto para adicionar o link.");
                            return;
                        }

                        const currentLink = quill.getFormat(range).link || "";
                        const input = window.prompt("Digite a URL:", currentLink);

                        if (input === null) return;

                        const url = normalizeUrl(input);

                        if (!url) {
                            quill.format("link", false);
                            return;
                        }

                        quill.format("link", url);
                    },

                    image: function () {
                        const quill = quillRef.current?.getEditor();
                        if (!quill) return;

                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";

                        input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;

                            try {
                                const url = await uploadFile(file, file.name);
                                const range = quill.getSelection(true);

                                quill.insertEmbed(range?.index ?? 0, "image", url, "user");
                                quill.setSelection((range?.index ?? 0) + 1, 0);
                            } catch (error) {
                                console.error(error);
                                alert("Falha ao enviar imagem.");
                            }
                        };

                        input.click();
                    },
                },
            },
        }),
        [articleId]
    );

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
        "image",
        "code-block",
    ];

    return (
        <div className="rounded-md border border-gray-300 bg-white">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value || ""}
                onChange={onChange}
                readOnly={disabled}
                modules={modules}
                formats={formats}
                className="[&_.ql-container]:min-h-[220px] [&_.ql-container]:text-sm"
            />
        </div>
    );
}
