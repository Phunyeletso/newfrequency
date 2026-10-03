import Header from "./Header";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { pathname, search } = useLocation();
  const chat = pathname === "/business/sales" || (pathname === "/business/missions" && !new URLSearchParams(search).has("mission"));
  return (
    <div className={`flex min-h-screen flex-col${chat ? " business-chat-layout" : ""}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]
          focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:font-medium focus:text-ground"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} className={`flex-1${pathname === "/" ? " home-page" : ""}${chat ? " business-chat-page" : ""}`}>
        {children}
      </main>
      {!chat && <Footer />}
    </div>
  );
}
