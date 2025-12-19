"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
    onUpload: (file: File, alt: string) => Promise<void>;
    currentImage?: string;
    currentAlt?: string;
    isLoading?: boolean;
    className?: string;
}

export function ImageUpload({
    onUpload,
    currentImage,
    currentAlt = "",
    isLoading = false,
    className = "",
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [alt, setAlt] = useState(currentAlt);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((selectedFile: File) => {
        if (!selectedFile.type.startsWith("image/")) {
            alert("Please select an image file");
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
    }, []);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
            }
        },
        [handleFile]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!file || !alt.trim()) {
            alert("Please select an image and provide alt text");
            return;
        }
        await onUpload(file, alt.trim());
        setFile(null);
        setPreview(null);
    };

    const clearPreview = () => {
        setFile(null);
        setPreview(null);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const displayImage = preview || currentImage;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Image Preview / Upload Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all ${dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {displayImage ? (
                    <div className="relative aspect-video">
                        <Image
                            src={displayImage}
                            alt={alt || "Preview"}
                            fill
                            className="object-cover"
                            unoptimized={preview ? true : false}
                        />
                        {preview && (
                            <button
                                onClick={clearPreview}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {!preview && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => inputRef.current?.click()}
                                    className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                                >
                                    Change Image
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        onClick={() => inputRef.current?.click()}
                        className="w-full aspect-video flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <ImageIcon className="w-12 h-12" />
                        <span className="text-sm font-medium">
                            Click or drag image to upload
                        </span>
                        <span className="text-xs text-gray-400">
                            JPEG, PNG, WebP, GIF (max 10MB)
                        </span>
                    </button>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleChange}
                    className="hidden"
                />
            </div>

            {/* Alt Text Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Describe the image for accessibility"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    maxLength={200}
                />
                <p className="text-xs text-gray-400 mt-1">{alt.length}/200 characters</p>
            </div>

            {/* Upload Button */}
            {file && (
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !alt.trim()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload Image
                        </>
                    )}
                </button>
            )}
        </div>
    );
}
