import React from "react";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/gif";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const DEFAULT_MAX_FILES = 3;

let _nextId = 0;

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="tpu-forum__upload-spinner">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function ImageUploader({ api, maxFiles, onChange, onUploadingChange }) {
  const max = maxFiles || DEFAULT_MAX_FILES;
  const [entries, setEntries] = React.useState([]);
  const inputRef = React.useRef(null);

  const uploadingCount = entries.filter((e) => e.status === "uploading").length;

  React.useEffect(() => {
    if (onUploadingChange) onUploadingChange(uploadingCount > 0);
  }, [uploadingCount, onUploadingChange]);

  React.useEffect(() => {
    const urls = entries
      .filter((e) => e.status === "done" && e.uploadedUrl)
      .map((e) => e.uploadedUrl);
    if (onChange) onChange(urls);
  }, [entries, onChange]);

  const addFiles = React.useCallback(
    (fileList) => {
      const files = Array.from(fileList);
      const available = max - entries.length;
      if (available <= 0) return;

      const toAdd = files.slice(0, available).map((file) => {
        const id = ++_nextId;

        if (!file.type || !ACCEPTED_TYPES.includes(file.type)) {
          return { id, file, previewUrl: null, uploadedUrl: null, status: "error", error: "Invalid file type" };
        }
        if (file.size > MAX_FILE_SIZE) {
          return { id, file, previewUrl: null, uploadedUrl: null, status: "error", error: "File too large (max 5 MB)" };
        }

        const previewUrl = URL.createObjectURL(file);
        return { id, file, previewUrl, uploadedUrl: null, status: "uploading", error: null };
      });

      setEntries((prev) => {
        const next = [...prev, ...toAdd];

        toAdd
          .filter((e) => e.status === "uploading")
          .forEach((entry) => {
            api
              .uploadImage(entry.file)
              .then((res) => {
                setEntries((curr) =>
                  curr.map((e) =>
                    e.id === entry.id
                      ? { ...e, status: "done", uploadedUrl: res.url }
                      : e,
                  ),
                );
              })
              .catch((err) => {
                setEntries((curr) =>
                  curr.map((e) =>
                    e.id === entry.id
                      ? { ...e, status: "error", error: err.message || "Upload failed" }
                      : e,
                  ),
                );
              });
          });

        return next;
      });
    },
    [api, entries.length, max],
  );

  const removeEntry = React.useCallback((id) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.id === id);
      if (entry && entry.previewUrl) {
        URL.revokeObjectURL(entry.previewUrl);
      }
      return prev.filter((e) => e.id !== id);
    });
  }, []);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length) {
      addFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Clean up object URLs on unmount
  React.useEffect(() => {
    return () => {
      entries.forEach((e) => {
        if (e.previewUrl) URL.revokeObjectURL(e.previewUrl);
      });
    };
  }, []);

  const canAdd = entries.length < max;

  return (
    <div className="tpu-forum__image-uploader">
      {entries.length > 0 && (
        <div className="tpu-forum__image-previews">
          {entries.map((entry) => (
            <div key={entry.id} className="tpu-forum__image-preview">
              {entry.previewUrl ? (
                <img src={entry.previewUrl} alt="Upload preview" />
              ) : (
                <div className="tpu-forum__image-preview-placeholder" />
              )}
              <div className="tpu-forum__image-preview-overlay">
                {entry.status === "uploading" && <SpinnerIcon />}
                {entry.status === "done" && <CheckIcon />}
                <button
                  type="button"
                  className="tpu-forum__image-preview-remove"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Remove image"
                >
                  <XIcon />
                </button>
              </div>
              {entry.status === "error" && (
                <Badge variant="destructive" className="tpu-forum__image-preview-error">
                  {entry.error}
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}

      {canAdd && (
        <div
          className="tpu-forum__image-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current && inputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current && inputRef.current.click();
            }
          }}
        >
          <CameraIcon />
          <span>
            Add photos ({entries.length}/{max})
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            multiple
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
