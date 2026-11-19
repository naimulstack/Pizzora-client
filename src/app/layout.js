import { Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import NavbarPage from "@/components/homepage/navbar";
import { Toaster } from "react-hot-toast";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Pizzora | Taste the Magic",
  description: "Order your favorite pizza with Pizzora.",
};

const themeInitScript = `
(function () {
  try {
    var savedTheme = localStorage.getItem("theme");
    var isDark = savedTheme !== "light";
    var root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${jakarta.className} min-h-full flex flex-col`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Toaster position="top-center" />
        <NavbarPage />
        {children}
      </body>
    </html>
  );
}
