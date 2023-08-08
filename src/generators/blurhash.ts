import { TGeneratedBlurHashImage } from "@/state/generate-blurhash";
import { encode } from "blurhash";

function applyGaussianBlur(
  imageData: ImageData,
  width: number,
  height: number,
  radius: number
): ImageData {
  const outputImageData = new ImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const pixel = [data[i], data[i + 1], data[i + 2], data[i + 3]];

    let r = 0,
      g = 0,
      b = 0,
      a = 0,
      weightSum = 0;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const x = Math.min(Math.max(0, ((i / 4) % width) + dx), width - 1);
        const y = Math.min(
          Math.max(0, Math.floor(i / 4 / width) + dy),
          height - 1
        );

        const weight =
          Math.exp(-(dx * dx + dy * dy) / (2 * radius * radius)) /
          (2 * Math.PI * radius * radius);
        const index = (y * width + x) * 4;

        r += data[index] * weight;
        g += data[index + 1] * weight;
        b += data[index + 2] * weight;
        a += data[index + 3] * weight;
        weightSum += weight;
      }
    }

    outputImageData.data[i] = r / weightSum;
    outputImageData.data[i + 1] = g / weightSum;
    outputImageData.data[i + 2] = b / weightSum;
    outputImageData.data[i + 3] = a / weightSum;
  }

  return outputImageData;
}

export async function generateBlurHashImage(
  imageUrl: string,
  componentX: number,
  componentY: number
): Promise<TGeneratedBlurHashImage | null> {
  const img = new Image();
  img.crossOrigin = "anonymous"; // If the image is hosted on a different domain, you might need to set the crossOrigin property.
  img.src = imageUrl;

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Resolve even on error to avoid blocking execution.
  });

  const aspectRatio = img.width / img.height;

  const width = 32; // Adjust the width and height to maintain the desired aspect ratio
  const height = Math.round(width / aspectRatio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const blurHash = encode(
    imageData.data,
    width,
    height,
    componentX,
    componentY
  );

  // Apply Gaussian blur to the image
  const radius = componentX;
  const blurredImageData = applyGaussianBlur(imageData, width, height, radius);

  // Convert the blurred image to different formats and output as data URLs
  const formats = ["png", "webp", "jpeg"];
  const generatedImages: TGeneratedBlurHashImage = {
    webpDataUrl: "",
    pngDataUrl: "",
    jpegDataUrl: "",
    blurHash: blurHash,
  };

  for (const format of formats) {
    const outputCanvas = document.createElement("canvas");
    outputCanvas.width = width;
    outputCanvas.height = height;
    const outputCtx = outputCanvas.getContext("2d");
    if (!outputCtx) {
      throw new Error("Could not create output canvas context");
    }

    outputCtx.putImageData(blurredImageData, 0, 0);

    const outputDataUrl = outputCanvas.toDataURL(`image/${format}`);
    if (format === "png") {
      generatedImages.pngDataUrl = outputDataUrl;
    } else if (format === "webp") {
      generatedImages.webpDataUrl = outputDataUrl;
    } else if (format === "jpeg") {
      generatedImages.jpegDataUrl = outputDataUrl;
    }
  }

  return generatedImages;
}
