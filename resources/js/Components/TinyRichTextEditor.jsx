import { Editor } from "@tinymce/tinymce-react";

function getCsrf() {
    const el = document.querySelector('meta[name="csrf-token"]');
    return el?.getAttribute("content") || "";
}

export default function TinyRichTextEditor({
    value,
    onChange,
    disabled = false,
    articleId = null,
}) {
    const uploadFile = async (fileOrBlob, filename) => {
        const formData = new FormData();
        formData.append("file", fileOrBlob, filename);

        if (articleId) formData.append("article_id", String(articleId));

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
        if (!json.location) throw new Error("Invalid upload response");
        return json.location;
    };

    return (
        <div className="w-full">
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={value || ""}
                onEditorChange={(content) => onChange?.(content)}
                disabled={disabled}
                init={{
                    height: 360,
                    menubar: false,
                    branding: false,
                    statusbar: true,
                    plugins: [
                        "lists",
                        "link",
                        "code",
                        "autolink",
                        "charmap",
                        "searchreplace",
                        "visualblocks",
                        "fullscreen",
                        "insertdatetime",
                        "table",
                        "wordcount",
                        "image",
                    ],

                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic underline | forecolor | " +
                        "bullist numlist outdent indent | " +
                        "link table image | " +
                        "fontsizeselect | code fullscreen",

                    fontsize_formats: "12px 14px 16px 18px 20px 24px 28px 32px 36px",
                    block_formats:
                        "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",

                    content_style:
                        "body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-size: 14px; }",

                    automatic_uploads: true,
                    images_reuse_filename: false,

                    images_upload_handler: async (blobInfo) => {
                        return await uploadFile(blobInfo.blob(), blobInfo.filename());
                    },

                    file_picker_types: "image",
                    file_picker_callback: (cb) => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";

                        input.onchange = async () => {
                            const file = input.files?.[0];
                            if (!file) return;

                            try {
                                const url = await uploadFile(file, file.name);
                                cb(url, { alt: file.name });
                            } catch {
                                alert("Falha ao enviar imagem.");
                            }
                        };

                        input.click();
                    },
                }}
            />
        </div>
    );
}
