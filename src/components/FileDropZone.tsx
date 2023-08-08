import { cn } from "@/lib/utils";
import { GenerateBlurHashStore } from "@/state/generate-blurhash";
import { type DragEvent, useRef, useState, useEffect } from "react";

const FileDropZone = () => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { setSelectedImage, selectedImage } = GenerateBlurHashStore()

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;

        if (files && files.length > 0) {
            const selectedFile = files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setSelectedImage(imageUrl);
        }
    };

    const handleFileInput = () => {
        const files = fileInputRef.current?.files;

        if (files && files.length > 0) {
            const selectedFile = files[0];
            const imageUrl = URL.createObjectURL(selectedFile);
            setSelectedImage(imageUrl);
        }
    };

    return (
        <div
            className={cn("h-full flex items-center justify-center hover:bg-foreground/10", isDragging && "bg-foreground/10")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <p className="pointer-events-none">{isDragging ? 'Drop the image here' : 'Drag and drop a image here or click to select'}</p>
        </div>
    );
};

export default FileDropZone;
