// tailwind config is required for editor support

import type { Config } from "tailwindcss"
import sharedConfig from "@repo/tailwind-config"

const config: Pick<Config, "content" | "presets"> = {
  content: ["./app/**/*.tsx", "./src/**/*.tsx"],
  presets: [sharedConfig],
  // safelist: [
  //   {
  //     pattern: /bg-\[url\('?.+'?\)\]/, // 允许动态背景图片URL
  //   },
  // ],
}

export default config
