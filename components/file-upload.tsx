"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { CloudUpload, Link2, ImageIcon, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "upload" | "url";

interface FileUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  label = "Image",
  accept = "image/*,.pdf,.svg",
  className,
}: FileUploadProps) {
  const [mode, setMode] = useState<Mode>(value && value.startsWith("http") ? "url" : "url");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [urlInput, setUrlInput] = useState(value || "");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    // Show local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = api.getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/uploads`,
        {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || err.message || "Upload failed");
      }

      const data = await res.json();
      setPreview(data.url);
      onChange(data.url);
    } catch (err: any) {
      setError(err.message);
      setPreview(null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    setError("");
    if (url) {
      setPreview(url);
      onChange(url);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUrlInput("");
    onChange(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1 rounded-lg border p-0.5">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              mode === "url"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Link2 className="h-3 w-3" />
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              mode === "upload"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <CloudUpload className="h-3 w-3" />
            Upload
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="pl-9"
            />
          </div>
          {preview && (
            <Button variant="ghost" size="icon" onClick={handleClear} type="button">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            onClick={() => fileRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-muted-foreground/50"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            ) : (
              <>
                <CloudUpload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  or drag and drop (max 50MB)
                </p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}

      {preview && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="h-full w-full object-contain"
            onError={() => setPreview(null)}
          />
        </div>
      )}
    </div>
  );
}
