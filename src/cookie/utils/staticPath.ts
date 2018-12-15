import { isDevelopment } from "common/env";

declare var __static: string;

export const staticPath = isDevelopment
  ? __static
  : __dirname.replace(/app\.asar$/, "static");
