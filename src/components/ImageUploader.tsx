
import React, { useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Image as ImageIcon, X, Check, Copy } from "lucide-react";

const IMGBB_API = "https://api.imgbb.com/1/upload";
const API_KEY = "04681133a4a38934de48d8034658f39b";
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_SIZE_MB = 5;

type Props = {
  onUpload: (url: string) => void;
  value?: string; // Optionally pass current url to control from outside
};

const ImageUploader: React.FC<Props> = ({ onUpload, value }) => {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(value || null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger file select dialog
  const openFileDialog = () => {
    inputRef.current?.click();
  };

  // Reset state to allow re-upload
  const reset = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    toast({ title: "Reset", description: "Selection cleared." });
  };

  // Copy image URL to clipboard
  const copyUrl = async () => {
    if (uploadedUrl) {
      await navigator.clipboard.writeText(uploadedUrl);
      toast({ title: "Copied", description: "Image URL copied to clipboard." });
    }
  };

  // Validate file: type & size
  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Only PNG, JPG, and WEBP images are allowed.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File size must be less than ${MAX_SIZE_MB} MB.`;
    }
    return "";
  };

  // Preview image & start upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    const issue = validateFile(file);
    if (issue) {
      setError(issue);
      toast({ title: "Invalid file", description: issue });
      reset();
      return;
    }

    // Base64 preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to ImgBB
    try {
      setUploading(true);
      const base64 = await readFileAsBase64(file);
      const form = new FormData();
      form.append("key", API_KEY);
      form.append("image", base64.split(",")[1]); // strip data:image/*;base64,
      const resp = await fetch(IMGBB_API, { method: "POST", body: form });
      const data = await resp.json();
      if (data?.success) {
        setUploadedUrl(data.data.url);
        onUpload(data.data.url);
        toast({ title: "Upload Success", description: "Image uploaded successfully!" });
      } else {
        const msg = data?.error?.message || "Unknown upload error!";
        setError(msg);
        toast({ title: "Upload Failed", description: msg });
        setUploadedUrl(null);
      }
    } catch (err: any) {
      setError("Network/server error!");
      toast({ title: "Upload Failed", description: "Network/server error." });
      setUploadedUrl(null);
    } finally {
      setUploading(false);
    }
  };

  // Utility for reading base64
  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = e => reject(e);
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto gap-2 bg-white/80 dark:bg-lux-black/70 rounded-2xl shadow-lg px-3 py-4">
      <input
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
        aria-label="Upload product image"
        tabIndex={-1}
      />

      <div
        className={
          "w-full min-h-[120px] rounded-lg border border-yellow-200 flex items-center justify-center overflow-hidden mb-2 " +
          (preview ? "" : "bg-yellow-50 dark:bg-gray-900")
        }
        style={{ cursor: uploadedUrl ? "default" : "pointer", background: preview ? undefined : undefined }}
        role="region"
        aria-label="Image Preview"
        tabIndex={0}
        onClick={() => !uploadedUrl && openFileDialog()}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="object-contain w-full h-32"
            style={{ maxHeight: 128, maxWidth: "100%" }}
            loading="lazy"
          />
        ) : (
          <span className="flex flex-col items-center justify-center text-yellow-700 opacity-60 dark:text-yellow-300 gap-1">
            <ImageIcon size={38} />
            <span className="text-xs">Click to select image</span>
            <span className="text-[10px] text-yellow-600 dark:text-yellow-200">(PNG, JPG, WEBP; ≤5MB)</span>
          </span>
        )}
      </div>

      {/* Status + Buttons */}
      <div className="w-full flex gap-2 items-center justify-center">
        {!uploadedUrl && (
          <Button
            variant="default"
            type="button"
            size="sm"
            aria-label="Choose image"
            onClick={openFileDialog}
            disabled={uploading}
          >
            <Upload size={16} className="mr-1" />
            {uploading ? (
              <span className="flex items-center"><Loader2 size={15} className="animate-spin" /> Uploading...</span>
            ) : (
              "Choose File"
            )}
          </Button>
        )}
        {uploadedUrl && (
          <>
            <Button
              type="button"
              onClick={copyUrl}
              size="sm"
              variant="outline"
              aria-label="Copy image URL"
              className="text-green-700 border-green-700 hover:bg-green-50"
            >
              <Copy size={15} className="mr-1" />
              Copy URL
            </Button>
            <Button
              type="button"
              onClick={reset}
              size="sm"
              variant="destructive"
              aria-label="Remove image"
            >
              <X size={15} className="mr-1" />
              Reset
            </Button>
          </>
        )}
      </div>

      {/* Error or Uploaded URL Info */}
      <div className="min-h-[24px] w-full mt-1 text-center text-xs">
        {error && <span className="text-red-600">{error}</span>}
        {uploadedUrl && (
          <span className="text-green-700 break-all"><Check size={12} className="inline mb-0.5" /> Uploaded!</span>
        )}
      </div>

      {/* Accessibility: file label for screenreaders */}
      <label htmlFor="file-upload-input" className="sr-only">Upload image (PNG, JPG, or WEBP)</label>
    </div>
  );
};

export default ImageUploader;
