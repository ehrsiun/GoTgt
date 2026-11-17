import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/outfit/400.css";
import "./globals.css";

export const metadata = {
  title: "GoTgt",
  description: "Post what you're already doing. Friends can tap in.",
};
export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#ffffff" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Nexa via Adobe Fonts. Add your Vercel domain to this web project in Adobe Fonts or it falls back to Outfit. */}
        <link rel="stylesheet" href="https://use.typekit.net/pas1cwi.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
