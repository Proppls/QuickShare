import { useRef } from 'react';

export default function FileDropzone({ file, onFileSelect }) {
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    onFileSelect(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    handleFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    handleFile(selectedFile);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="
          border-2 border-dashed border-slate-300
          rounded-xl
          p-10
          text-center
          cursor-pointer
          transition
          hover:border-blue-500
          hover:bg-slate-50
        "
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
        />

        <div className="space-y-3">
          <div className="text-5xl">📁</div>

          <h2 className="text-xl font-semibold">
            Drag & Drop File
          </h2>

          <p className="text-slate-500">
            or click to browse
          </p>
        </div>
      </div>

      {file && (
        <div className="mt-4 rounded-lg border p-4 bg-white shadow-sm">
          <h3 className="font-medium truncate">
            {file.name}
          </h3>

          <div className="mt-1 text-sm text-slate-500">
            {formatSize(file.size)}
          </div>

          {file.type && (
            <div className="text-sm text-slate-500">
              {file.type}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
