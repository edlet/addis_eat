import Providers from "./providers";
import "../src/App.css";
import "./globals.css";

export const metadata = { title: "Addis Eats", description: "Ethiopian food delivery in Addis Ababa." };

export default function RootLayout({ children }) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>;
}
