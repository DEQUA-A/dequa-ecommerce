"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, ImageIcon, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

type ExistingImage = { id: string; url: string; alt: string };

interface ImageUploadProps {
  existingImages?: ExistingImage[];
  name?: string;
  removedIdsName?: string;
  maxFileSize?: number;
  maxFiles?: number;
}

type UploadItem = {
  id: string;
  status: "uploading" | "done" | "error";
  url?: string;
  error?: string;
  alt: string;
};

let uploadIdCounter = 0;
function nextId() {
  uploadIdCounter += 1;
  return `upload_${uploadIdCounter}`;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export function ImageUpload({
  existingImages = [],
  name = "imageUrls",
  removedIdsName = "removedImageIds",
  maxFileSize = 5 * 1024 * 1024,
  maxFiles = 10,
}: ImageUploadProps) {
  const [existing, setExisting] = useState<ExistingImage[]>(existingImages);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalCount = existing.length + uploads.length;

  useEffect(() => {
    setExisting(existingImages);
  }, [existingImages]);

  const removedIds = existingImages
    .filter((img) => !existing.some((e) => e.id === img.id))
    .map((img) => img.id);

  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      setGlobalError(null);
      const fileArray = Array.from(files);

      for (const file of fileArray) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          setGlobalError("فرمت فایل نامعتبر است. فقط JPEG, PNG, WebP, GIF, AVIF مجاز هستند");
          continue;
        }
        if (file.size > maxFileSize) {
          setGlobalError("حجم فایل نباید بیشتر از ۵ مگابایت باشد");
          continue;
        }
        if (totalCount + uploads.length >= maxFiles) {
          setGlobalError(`حداکثر ${maxFiles} تصویر مجاز است`);
          break;
        }

        const itemId = nextId();
        setUploads((prev) => [...prev, { id: itemId, status: "uploading", alt: "", url: undefined }]);

        try {
          const url = await uploadToCloudinary(file);
          setUploads((prev) =>
            prev.map((u) => (u.id === itemId ? { ...u, status: "done", url, alt: file.name.replace(/\.[^.]+$/, "") } : u))
          );
        } catch (err) {
          setUploads((prev) =>
            prev.map((u) => (u.id === itemId ? { ...u, status: "error", error: err instanceof Error ? err.message : "Upload failed" } : u))
          );
        }
      }
    },
    [totalCount, maxFileSize, maxFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
    },
    [processFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const removeUpload = (id: string) => {
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  const removeExisting = (id: string) => {
    setExisting((prev) => prev.filter((img) => img.id !== id));
  };

  const doneUrls = uploads.filter((u) => u.status === "done" && u.url);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">تصاویر محصول</label>

      {doneUrls.length > 0 && (
        <input type="hidden" name={name} value={JSON.stringify(doneUrls.map((u) => ({ url: u.url, alt: u.alt })))} />
      )}

      {removedIds.length > 0 && (
        <input type="hidden" name={removedIdsName} value={JSON.stringify(removedIds)} />
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300 text-center group ${
          dragOver
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            dragOver ? "bg-primary/15 scale-110" : "bg-gray-100 group-hover:bg-gray-200"
          }`}>
            <Upload className={`w-6 h-6 transition-colors duration-300 ${
              dragOver ? "text-primary" : "text-gray-400"
            }`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">
              {dragOver ? "رها کنید" : "تصاویر را بکشید و رها کنید"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              یا برای انتخاب کلیک کنید &mdash; {ALLOWED_TYPES.length} فرمت پشتیبانی می‌شود
            </p>
          </div>
          <p className="text-[10px] text-gray-400">حداکثر حجم: ۵ مگابایت &middot; حداکثر {maxFiles} تصویر</p>
        </div>
      </div>

      {globalError && (
        <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-xl border border-red-200 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {globalError}
        </div>
      )}

      {(existing.length > 0 || uploads.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {existing.map((img) => (
            <div key={img.id} className="group/image relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 aspect-square animate-fade-in-up">
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeExisting(img.id); }}
                  className="opacity-0 group-hover/image:opacity-100 scale-75 group-hover/image:scale-100 transition-all duration-200 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute top-2 right-2">
                <span className="bg-green-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                  <CheckCircle2 className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}

          {uploads.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-xl overflow-hidden border bg-gray-50 aspect-square animate-fade-in-up ${
                item.status === "error" ? "border-red-300" : "border-gray-200"
              }`}
            >
              {item.status === "uploading" && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-[10px] text-gray-400">در حال آپلود...</span>
                </div>
              )}

              {item.status === "done" && item.url && (
                <>
                  <img src={item.url} alt={item.alt} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeUpload(item.id); }}
                      className="opacity-0 hover:opacity-100 scale-75 hover:scale-100 transition-all duration-200 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="bg-green-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center shadow">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  </div>
                </>
              )}

              {item.status === "error" && (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-[10px] text-red-500 text-center leading-relaxed">{item.error || "خطا در آپلود"}</p>
                  <button
                    type="button"
                    onClick={() => removeUpload(item.id)}
                    className="text-[10px] text-red-500 underline hover:no-underline mt-1"
                  >
                    حذف
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {existing.length === 0 && uploads.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400 px-1">
          <ImageIcon className="w-3.5 h-3.5" />
          هنوز تصویری انتخاب نشده است
        </div>
      )}
    </div>
  );
}
