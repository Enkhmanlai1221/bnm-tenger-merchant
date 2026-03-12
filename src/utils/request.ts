import { HttpHandler } from "@/utils/http/http-handler";
import { HttpRequest as BaseHttpRequest } from "@/utils/http/http-request";
import { store } from "../store";
import { decode } from "blurhash";

export class HttpRequest extends BaseHttpRequest {
  store = store;
  errorHandler = (statusCode: number, error: HttpHandler): HttpHandler => {
    // if (statusCode === 401) {
    //   store.dispatch(logout());
    // }
    throw error as any;
  };
}

// Function to convert blurhash to DataURL
export const blurhashToDataURL = (blurhash: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 32; // Keep small for performance
  canvas.height = 32;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = ctx.createImageData(32, 32);
  const pixels = decode(blurhash, 32, 32);

  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
};
