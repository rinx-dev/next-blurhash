"use client"

import Image from "next/image";
import { useEffect, useState } from "react";
import { GenerateBlurHashStore } from "@/state/generate-blurhash";
import { generateBlurHashImage } from "@/generators/blurhash";
import { cn } from "@/lib/utils";
import FileDropZone from "@/components/FileDropZone";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatFileSizeFromDataURL } from "@/lib/getFileSizeFromDataURL";
import { Loader2 } from "lucide-react";

export default function Convertor() {
    const { selectedImage, generatedData, setGeneratedData, isGenerating, setIsGenerating, isError, setIsError } = GenerateBlurHashStore()
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
                        // navigator.clipboard.writeText(generatedData!.pngDataUrl)
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

    const changeSelect = (value: string) => {
        setSelectedBlurType(value)
    }

    return (
        <section className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-6 overflow-hidden">
                <div className="relative">
                    {selectedImage && <Image unoptimized src={selectedImage} alt="" width={200} height={200} className="w-full h-full border" />}
                    <div
                        className={cn("cursor-pointer h-full w-full border border-dashed", selectedImage && "absolute inset-0 opacity-0")}>
                        <FileDropZone />
                    </div>
                </div>
                <div className={cn("relative border flex items-center justify-center", !selectedImage && "aspect-video")}>
                    {!isGenerating && selectedBlurType && !isError && <Image src={selectedBlurType} height={2000} width={2000} alt="" className="w-full h-full" />}
                    {isGenerating ?
                        <div className="animate-spin">
                            <Loader2 className="w-6 h-6" />
                        </div>
                        : isError ?
                            <p className="text-red-500">Error</p> : !selectedBlurType && <p>Output</p>
                    }
                </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                    {generatedData &&
                        <div className="space-y-2">
                            <p>BlurHash</p>
                            <Input type="text" value={generatedData.blurHash} readOnly />
                        </div>
                    }
                </div>
                <div>
                    {generatedData &&
                        <div className="space-y-2">
                            <p>DataUrls {selectedBlurType && <span>({formatFileSizeFromDataURL(selectedBlurType)})</span>}</p>
                            <div className="flex gap-3 flex-col lg:flex-row">
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className={cn("", selectedBlurType === generatedData.webpDataUrl && "bg-secondary")}
                                        onClick={() => changeSelect(generatedData.webpDataUrl)}
                                    >
                                        WEBP
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={cn("", selectedBlurType === generatedData.jpegDataUrl && "bg-secondary")}
                                        onClick={() => changeSelect(generatedData.jpegDataUrl)}
                                    >
                                        JPEG
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className={cn("", selectedBlurType === generatedData.pngDataUrl && "bg-secondary")}
                                        onClick={() => changeSelect(generatedData.pngDataUrl)}
                                    >
                                        PNG
                                    </Button>
                                </div>
                                <div className="w-full">
                                    <Input value={selectedBlurType} readOnly />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </section>
    )
}
