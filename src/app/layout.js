
import { Suspense } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NavbarPage from "@/components/homepage/navbar";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import Footer from "@/components/homepage/Footer";


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata = {
  title: "Pizzora | Taste the Magic",
  description: "Order your favorite pizza with Pizzora.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var dark=t?t==="dark":true;document.documentElement.classList.toggle("dark",dark);}catch(e){document.documentElement.classList.add("dark");}})()`,
          }}
        />
      </head>
      <body className={`${jakarta.className} min-h-full flex flex-col`}>
        <Toaster position="top-center" />
        <Suspense fallback={null}>
          <CartProvider>
            <NavbarPage />
            {children}
          </CartProvider>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
