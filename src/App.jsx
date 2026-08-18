import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ForArtists from "./pages/ForArtists";
import GetTheApp from "./pages/GetTheApp";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

/** Reset scroll and move focus to the top of each new page. */
function RouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteChange />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/for-artists" element={<ForArtists />} />
          <Route path="/get-the-app" element={<GetTheApp />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}
