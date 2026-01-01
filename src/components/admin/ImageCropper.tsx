"use client";

import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { Loader2, Crop, X, ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Slider } from "@/src/components/ui/slider";

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImageBlob: Blob) => void;
    onCancel: () => void;
    aspect?: number;
    shape?: "rect" | "round";
}

interface Area {
    width: number;
    height: number;
    x: number;
    y: number;
}

export function ImageCropper({
    image,
    onCropComplete,
    onCancel,
    aspect = 1,
    shape = "round",
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropChange = useCallback((crop: { x: number; y: number }) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    const onRotationChange = useCallback((rotation: number) => {
        setRotation(rotation);
    }, []);

    const onCropAreaComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = useCallback(async (
        imageSrc: string,
        pixelCrop: Area,
        rotation = 0
    ): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("No 2d context");
        }

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                resolve(blob);
            }, "image/jpeg", 0.95);
        });
    }, []);

    const handleCrop = useCallback(async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
            onCropComplete(croppedBlob);
        } catch (error) {
            console.error("Error cropping image:", error);
            alert("Failed to crop image. Please try again.");
            setIsProcessing(false);
        }
    }, [croppedAreaPixels, image, rotation, onCropComplete, getCroppedImg]);

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
            if (e.key === 'Enter' && !isProcessing) handleCrop();
            if (e.key === '+' || e.key === '=') setZoom(z => Math.min(3, z + 0.1));
            if (e.key === '-' || e.key === '_') setZoom(z => Math.max(1, z - 0.1));
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isProcessing, onCancel, handleCrop]);

    return (
        <div className="fixed inset-0 bg-black/95 z-100 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 border-b border-gray-700/50 px-6 py-4 flex items-center justify-between shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Crop className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">Crop Image</h2>
                        <p className="text-sm text-gray-400">Adjust and perfect your image</p>
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-800 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isProcessing}
                    title="Close (Esc)"
                >
                    <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
                </button>
            </div>

            {/* Cropper Area */}
            <div className="flex-1 relative bg-linear-to-br from-gray-950 via-black to-gray-950">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    rotation={rotation}
                    aspect={aspect}
                    cropShape={shape}
                    showGrid={true}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onRotationChange={onRotationChange}
                    onCropComplete={onCropAreaComplete}
                />
            </div>

            {/* Controls */}
            <div className="bg-gradient-to-r from-gray-900/95 to-gray-800/95 border-t border-gray-700/50 px-6 py-2 shadow-2xl backdrop-blur-md">
                <div className="max-w-4xl mx-auto">
                    {/* Instructions */}
                    <div className="text-center space-y-2 pb-2">
                        <p className="text-sm text-gray-300 font-semibold tracking-wide">Image Controls</p>
                        <p className="text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">Drag to move</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className="inline-flex items-center gap-1">Scroll or +/- to zoom</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className="inline-flex items-center gap-1">ESC to cancel • ENTER to apply</span>
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center justify-center gap-2 pb-2">
                        <button
                            onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                            disabled={isProcessing || zoom <= 1}
                            className="p-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700/50 hover:border-gray-600 hover:scale-105 active:scale-95"
                            title="Zoom Out (-)"
                        >
                            <ZoomOut className="w-4 h-4 text-gray-300" />
                        </button>
                        <button
                            onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                            disabled={isProcessing || zoom >= 3}
                            className="p-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700/50 hover:border-gray-600 hover:scale-105 active:scale-95"
                            title="Zoom In (+)"
                        >
                            <ZoomIn className="w-4 h-4 text-gray-300" />
                        </button>
                        <div className="w-px h-6 bg-gray-700 mx-1"></div>
                        <button
                            onClick={handleRotate}
                            disabled={isProcessing}
                            className="p-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700/50 hover:border-gray-600 hover:scale-105 active:scale-95"
                            title="Rotate 90°"
                        >
                            <RotateCw className="w-4 h-4 text-gray-300" />
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={isProcessing}
                            className="p-2.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed border border-gray-700/50 hover:border-gray-600 hover:scale-105 active:scale-95"
                            title="Reset View"
                        >
                            <Maximize2 className="w-4 h-4 text-gray-300" />
                        </button>
                    </div>

                    {/* Zoom Slider */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                <ZoomIn className="w-4 h-4" />
                                Zoom
                            </label>
                            <span className="text-sm text-gray-400 font-mono bg-gray-800/50 px-2.5 py-1 rounded-md border border-gray-700/50">{zoom.toFixed(1)}x</span>
                        </div>
                        <Slider
                            value={[zoom]}
                            onValueChange={([value]) => setZoom(value)}
                            min={1}
                            max={3}
                            step={0.05}
                            className="w-full"
                            disabled={isProcessing}
                        />
                    </div>

                    {/* Rotation Indicator */}
                    {rotation !== 0 && (
                        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <RotateCw className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-blue-300 font-medium">Rotated {rotation}°</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={onCancel}
                            variant="outline"
                            className="flex-1 bg-gray-800/80 border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCrop}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all border border-blue-500/20"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Crop className="w-5 h-5 mr-2" />
                                    Apply Crop
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
