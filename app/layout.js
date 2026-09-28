import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import MobileNavigation from "./MobileNavigation";
import Providers from "./providers";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food delivery in Addis Ababa",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
          <MobileNavigation />
        </Providers>
      </body>
    </html>
  );
}
