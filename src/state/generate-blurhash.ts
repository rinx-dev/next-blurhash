import { create } from "zustand";

export type TGeneratedBlurHashImage = {
  webpDataUrl: string;
  pngDataUrl: string;
  jpegDataUrl: string;
  blurHash: string;
};

type TGenerateBlurHashState = {
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;

  isError: boolean;
  setIsError: (isError: boolean) => void;

  selectedImage: string | undefined;
  setSelectedImage: (selectedImage: string) => void;

  generatedData: TGeneratedBlurHashImage | undefined;
  setGeneratedData: (generatedData: TGeneratedBlurHashImage) => void;
};

export const GenerateBlurHashStore = create<TGenerateBlurHashState>()(
  (set) => ({
    isGenerating: false,
    setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),

    isError: false,
    setIsError: (isError: boolean) => set({ isError }),

    selectedImage: undefined,
    setSelectedImage: (selectedImage: string) => set({ selectedImage }),

    generatedData: undefined,
    setGeneratedData: (generatedData: TGeneratedBlurHashImage) =>
      set({ generatedData }),
  })
);
