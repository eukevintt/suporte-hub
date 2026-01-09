import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CkRichTextEditor({ value, onChange, disabled = false }) {
    return (
        <div className="w-full">
            <div className="rounded border border-gray-300 bg-white">
                <div className="prose prose-sm max-w-none">
                    <CKEditor
                        editor={ClassicEditor}
                        data={value || ""}
                        disabled={disabled}
                        onChange={(_, editor) => {
                            const data = editor.getData();
                            onChange?.(data);
                        }}
                    />
                </div>
            </div>

            <style>{`
                .ck-editor__editable {
                    min-height: 240px;
                    padding: 12px;
                }
                .ck.ck-toolbar {
                    border-bottom: 1px solid rgb(209 213 219);
                }
                .ck.ck-editor__main > .ck-editor__editable {
                    border: 0;
                    border-radius: 0 0 .375rem .375rem;
                }
            `}</style>
        </div>
    );
}
