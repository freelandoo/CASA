import { Anton, Archivo, Caveat } from "next/font/google"

// Display condensado ultra-black (estilo manchete de tabloide)
export const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
})

// Corpo / UI
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
})

// Manuscrito para rabiscos e stickers
export const caveat = Caveat({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
})

export const casaFontVars = `${anton.variable} ${archivo.variable} ${caveat.variable}`
