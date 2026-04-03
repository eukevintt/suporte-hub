import { useEffect, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const BaseImage = Quill.import("formats/image");

class CustomImageBlot extends BaseImage {
    static create(value) {
        const node = super.create();

        if (typeof value === "string") {
            node.setAttribute("src", value);
            return node;
        }

        if (value?.url) {
            node.setAttribute("src", value.url);
        }

        if (value?.size) {
            node.setAttribute("data-size", value.size);
        }

        if (value?.align) {
            node.setAttribute("data-align", value.align);
        }

        return node;
    }

    static value(node) {
        return {
            url: node.getAttribute("src") || "",
            size: node.getAttribute("data-size") || "",
            align: node.getAttribute("data-align") || "",
        };
    }

    format(name, value) {
        if (name === "size") {
            if (value) {
                this.domNode.setAttribute("data-size", value);
            } else {
                this.domNode.removeAttribute("data-size");
            }
            return;
        }

        if (name === "imageAlign") {
            if (value) {
                this.domNode.setAttribute("data-align", value);
            } else {
                this.domNode.removeAttribute("data-align");
            }
            return;
        }

        super.format(name, value);
    }
}

CustomImageBlot.blotName = "image";
CustomImageBlot.tagName = "img";

Quill.register(CustomImageBlot, true);

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
    const selectedImageRef = useRef(null);

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

    const applyImageSize = (size) => {
        const quill = quillRef.current?.getEditor();
        const imageNode = selectedImageRef.current;

        if (!quill || !imageNode) {
            alert("Clique na imagem primeiro.");
            return;
        }

        const blot = Quill.find(imageNode);
        if (!blot || blot.statics?.blotName !== "image") {
            alert("Clique na imagem primeiro.");
            return;
        }

        blot.format("size", size);
        quill.update("user");
        onChange?.(quill.root.innerHTML);
    };

    const applyImageAlign = (align) => {
        const quill = quillRef.current?.getEditor();
        const imageNode = selectedImageRef.current;

        if (!quill || !imageNode) {
            alert("Clique na imagem primeiro.");
            return;
        }

        const blot = Quill.find(imageNode);
        if (!blot || blot.statics?.blotName !== "image") {
            alert("Clique na imagem primeiro.");
            return;
        }

        blot.format("imageAlign", align);
        quill.update("user");
        onChange?.(quill.root.innerHTML);
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: "#quill-toolbar",
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
                                const index = range?.index ?? 0;

                                quill.insertEmbed(
                                    index,
                                    "image",
                                    { url, size: "medium", align: "left" },
                                    "user"
                                );

                                quill.setSelection(index + 1, 0);
                                onChange?.(quill.root.innerHTML);
                            } catch (error) {
                                console.error(error);
                                alert("Falha ao enviar imagem.");
                            }
                        };

                        input.click();
                    },

                    smallImage: function () {
                        applyImageSize("small");
                    },

                    mediumImage: function () {
                        applyImageSize("medium");
                    },

                    largeImage: function () {
                        applyImageSize("large");
                    },

                    imageAlignLeft: function () {
                        applyImageAlign("left");
                    },

                    imageAlignCenter: function () {
                        applyImageAlign("center");
                    },

                    imageAlignRight: function () {
                        applyImageAlign("right");
                    },
                },
            },
        }),
        [articleId]
    );

    useEffect(() => {
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const editor = quill.root;

        const handleClick = (event) => {
            const target = event.target;

            if (target instanceof HTMLImageElement) {
                selectedImageRef.current = target;
                return;
            }

            selectedImageRef.current = null;
        };

        editor.addEventListener("click", handleClick);

        return () => {
            editor.removeEventListener("click", handleClick);
        };
    }, []);

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "bullet",
        "link",
        "image",
        "video",
        "code-block",
        "size",
        "align",
        "imageAlign",
    ];

    return (
        <div className="rounded-md border border-gray-300 bg-white">
            <div id="quill-toolbar" className="border-b border-gray-300">
                <span className="ql-formats">
                    <select className="ql-header" defaultValue="">
                        <option value="1" />
                        <option value="2" />
                        <option value="3" />
                        <option value="" />
                    </select>
                </span>

                <span className="ql-formats">
                    <button type="button" className="ql-bold" />
                    <button type="button" className="ql-italic" />
                    <button type="button" className="ql-underline" />
                </span>

                <span className="ql-formats">
                    <button type="button" className="ql-list" value="ordered" />
                    <button type="button" className="ql-list" value="bullet" />
                </span>

                <span className="ql-formats">
                    <select className="ql-align" defaultValue="">
                        <option value="" />
                        <option value="center" />
                        <option value="right" />
                        <option value="justify" />
                    </select>
                </span>

                <span className="ql-formats">
                    <button type="button" className="ql-link" />
                    <button type="button" className="ql-image" />
                    <button type="button" className="ql-video" />
                    <button type="button" className="ql-code-block" />
                </span>

                <span className="ql-formats">
                    <button type="button" className="ql-smallImage">P</button>
                    <button type="button" className="ql-mediumImage">M</button>
                    <button type="button" className="ql-largeImage">G</button>
                </span>

                <span className="ql-formats">
                    <button type="button" className="ql-imageAlignLeft">E</button>
                    <button type="button" className="ql-imageAlignCenter">C</button>
                    <button type="button" className="ql-imageAlignRight">D</button>
                </span>

                <span className="ql-formats">
                    <button type="button" className="ql-clean" />
                </span>
            </div>

            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value || ""}
                onChange={onChange}
                readOnly={disabled}
                modules={modules}
                formats={formats}
                className="
                    [&_.ql-toolbar]:hidden
                    [&_.ql-container]:min-h-[220px]
                    [&_.ql-container]:text-sm
                    [&_.ql-editor_img[data-size='small']]:w-[200px]
                    [&_.ql-editor_img[data-size='medium']]:w-[400px]
                    [&_.ql-editor_img[data-size='large']]:w-full
                    [&_.ql-editor_img]:h-auto
                    [&_.ql-editor_img]:max-w-full
                    [&_.ql-editor_img]:cursor-pointer
                    [&_.ql-editor_img]:border-2
                    [&_.ql-editor_img]:border-transparent
                    [&_.ql-editor_img[data-align='left']]:ml-0
                    [&_.ql-editor_img[data-align='left']]:mr-auto
                    [&_.ql-editor_img[data-align='center']]:mx-auto
                    [&_.ql-editor_img[data-align='right']]:ml-auto
                    [&_.ql-editor_img[data-align='right']]:mr-0
                    [&_.ql-editor_img]:block
                "
            />
        </div>
    );
}
