"use client"

import * as React from "react"
import ThemeProvider from "@/components/ThemeProvider";

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}

export default Providers;