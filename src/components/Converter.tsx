/* eslint-disable @next/next/no-img-element */
"use client"

import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { GenerateBlurHashStore } from "@/state/generate-blurhash";
import { generateBlurHashImage } from "@/generators/blurhash";
import { cn } from "@/lib/utils";
import FileDropZone from "@/components/FileDropZone";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { LoaderIcon } from "./Icons";
import { formatFileSizeFromDataURL } from "@/lib/getFileSizeFromDataURL";

export default function Convertor() {
    const { selectedImage, setSelectedImage, generatedData, setGeneratedData, isGenerating, setIsGenerating, isError, setIsError } = GenerateBlurHashStore()
    const [selectedBlurType, setSelectedBlurType] = useState<string>()

    useEffect(() => {
        if (selectedImage) {
            const handleGenerate = async () => {
                setIsGenerating(true)
                setIsError(false)
                try {
                    const generated = await generateBlurHashImage(selectedImage, 4, 3)
                    if (generated) {
                        setGeneratedData(generated)
                        setSelectedBlurType(generated.pngDataUrl)
                    }
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
                    {!isGenerating && selectedBlurType && !isError && <Image src={selectedBlurType} fill alt="" />}
                    {isGenerating ? <div className="animate-spin"><LoaderIcon /></div> : isError ? <p className="text-red-500">Error</p> : <p>Output</p>}
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                    {/* <div className="space-y-1">
                        <div>Input Image</div>
                        <Input placeholder="Paste Image Url" onChange={onInputChange} />
                    </div> */}
                    {generatedData &&
                        <div className="space-y-2">
                            <div>BlurHash</div>
                            <Input type="text" value={generatedData.blurHash} readOnly />
                        </div>
                    }
                </div>
                <div>
                    <div className="space-y-2">
                        <div>DataUrls {selectedBlurType && `(${formatFileSizeFromDataURL(selectedBlurType)})`}</div>
                        {generatedData &&
                            <div className="flex gap-3 flex-col lg:flex-row">
                                <div className="flex gap-3">
                                    <Button variant="outline" className={cn("", selectedBlurType === generatedData.webpDataUrl && "bg-secondary")} onClick={() => setSelectedBlurType(generatedData.webpDataUrl)}>WEBP</Button>
                                    <Button variant="outline" className={cn("", selectedBlurType === generatedData.jpegDataUrl && "bg-secondary")} onClick={() => setSelectedBlurType(generatedData.jpegDataUrl)}>JPEG</Button>
                                    <Button variant="outline" className={cn("", selectedBlurType === generatedData.pngDataUrl && "bg-secondary")} onClick={() => setSelectedBlurType(generatedData.pngDataUrl)}>PNG</Button>
                                </div>
                                <div className="w-full">
                                    <Input value={selectedBlurType} readOnly />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
