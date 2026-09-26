import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ForArtists from "./pages/ForArtists";
import Creators from "./pages/Creators";
import GetTheApp from "./pages/GetTheApp";
import Company from "./pages/Company";
import Invest, { InvestDashboard } from "./pages/Invest";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import EmailConfirmed from "./pages/EmailConfirmed";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DeleteAccount from "./pages/DeleteAccount";
import ChildSafety from "./pages/ChildSafety";
import NotFound from "./pages/NotFound";
import BusinessPortal from "./pages/BusinessPortal";

const BusinessCreate = lazy(() => import("./pages/BusinessWorkspace").then((module) => ({ default: module.BusinessCreate })));
const BusinessMissions = lazy(() => import("./pages/BusinessWorkspace").then((module) => ({ default: module.BusinessMissions })));

function RouteLoading() {
  return <div className="page-container" role="status" style={{ paddingBlock: 80, color: "var(--muted)" }}>Loading workspace…</div>;
}

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
          <Route path="/creators" element={<Creators />} />
          <Route path="/get-the-app" element={<GetTheApp />} />
          <Route path="/company" element={<Company />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/invest/dashboard" element={<InvestDashboard />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          {/* Where a signup confirmation email lands. Not linked from
              anywhere on purpose: the only way here is the email. */}
          <Route path="/auth/confirmed" element={<EmailConfirmed />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/child-safety" element={<ChildSafety />} />
          <Route path="/business" element={<BusinessPortal />} />
          <Route path="/business/create" element={<Suspense fallback={<RouteLoading />}><BusinessCreate /></Suspense>} />
          <Route path="/business/missions" element={<Suspense fallback={<RouteLoading />}><BusinessMissions /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}
