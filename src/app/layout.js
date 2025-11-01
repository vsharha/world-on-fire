import "@/app/globals.css"
import { Ubuntu } from "next/font/google";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

export const metadata = {
  title: "World on Fire",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  },
  description: "Real-time news heatmap: see what's happening in the world on Fire.",
};

const ubuntu = Ubuntu({
  weight: ['300','400','500','700'],
  subsets: ['latin'],
  variable: "--font-sans",
  display: "swap",
});

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${ubuntu.variable}`}>
        <body className="min-h-screen-dynamic h-screen-dynamic flex flex-col">
            <Providers>
                <Header/>
                {children}
            </Providers>
        </body>
    </html>
  );
}
