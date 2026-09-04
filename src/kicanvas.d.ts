import type { DetailedHTMLProps, HTMLAttributes } from "react"

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "kicanvas-embed": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src: string
        controls?: "none" | "basic" | "full"
        controlslist?: string
        theme?: "kicad" | "witchhazel"
        zoom?: string
      }
    }
  }
}
