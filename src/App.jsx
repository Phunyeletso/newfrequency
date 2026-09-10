import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ForArtists from "./pages/ForArtists";
import GetTheApp from "./pages/GetTheApp";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import EmailConfirmed from "./pages/EmailConfirmed";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import BusinessPortal, { BusinessCreate, BusinessMissions } from "./pages/BusinessPortal";

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
          {/* Where a signup confirmation email lands. Not linked from
              anywhere on purpose: the only way here is the email. */}
          <Route path="/auth/confirmed" element={<EmailConfirmed />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/business" element={<BusinessPortal />} />
          <Route path="/business/create" element={<BusinessCreate />} />
          <Route path="/business/missions" element={<BusinessMissions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}
