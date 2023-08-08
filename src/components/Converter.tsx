/* eslint-disable @next/next/no-img-element */
"use client"

import Image from "next/image";
import { type ChangeEvent, useEffect } from "react";
import { GenerateBlurHashStore } from "@/state/generate-blurhash";
import { generateBlurHashImage } from "@/generators/blurhash";
import { cn } from "@/lib/utils";
import FileDropZone from "@/components/FileDropZone";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { LoaderIcon } from "./Icons";

export default function Convertor() {
    const { selectedImage, setSelectedImage, generatedData, setGeneratedData, isGenerating, setIsGenerating, isError, setIsError } = GenerateBlurHashStore()

    useEffect(() => {
        if (selectedImage) {
            const handleGenerate = async () => {
                setIsGenerating(true)
                setIsError(false)
                try {
                    const generated = await generateBlurHashImage(selectedImage, 4, 3)
                    if (generated) setGeneratedData(generated)
                } catch (error) {
                    setIsError(true)
                } finally {
                    setIsGenerating(false)
                }
            }
            handleGenerate()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedImage, selectedImage])

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedImage(e.target.value)
    }

    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-6">
                <div className="relative aspect-video">
                    {selectedImage && <img src={selectedImage} alt="" className="w-full border" />}
                    <div className={cn("cursor-pointer h-full w-full border border-dashed", selectedImage && "absolute inset-0 opacity-0")}>
                        <FileDropZone />
                    </div>
                </div>
                <div className={cn("relative border flex items-center justify-center", !selectedImage && "aspect-video")}>
                    {!isGenerating && generatedData && !isError && <Image key={Math.random()} src={generatedData.webpDataUrl} fill alt="" />}
                    {isGenerating ? <LoaderIcon className="animate-spin" /> : isError ? <p className="text-red-500">Error</p> : <p>Output</p>}
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <div className="space-y-1">
                        <div>Input Image</div>
                        <Input placeholder="Paste Image Url" onChange={onInputChange} />
                    </div>
                    {generatedData &&
                        <div className="space-y-1">
                            <div>BlurHash</div>
                            <Input type="text" value={generatedData.blurHash} readOnly />
                        </div>
                    }
                </div>
                <div>
                    <div className="space-y-1">
                        <div>DataUrls</div>
                        {generatedData &&
                            <div className="flex gap-3">
                                <Button variant="outline">WEBP</Button>
                                <Button variant="outline">JPEG</Button>
                                <Button variant="outline">PNG</Button>
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div>
                {generatedData && <div className="grid grid-cols-3 gap-3">
                    <img src={generatedData.jpegDataUrl} alt="" className="w-full" />
                    <img src={generatedData.pngDataUrl} alt="" className="w-full" />
                    <img src={generatedData.webpDataUrl} alt="" className="w-full" />
                </div>}
            </div>
        </div>
    )
}
