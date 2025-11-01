import {ThemeProvider as NextThemesProvider} from "next-themes";
import * as React from "react";

function ThemeProvider({children}) {
    return (
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          className="h-full">
          {children}
        </NextThemesProvider>
    );
}

export default ThemeProvider;