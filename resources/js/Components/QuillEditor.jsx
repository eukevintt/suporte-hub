import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function QuillEditor({ value, onChange }) {
    return (
        <div className="bg-white">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                className="min-h-[200px]"
            />
        </div>
    );
}
