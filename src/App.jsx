import { Routes, Route, useLocation, useSearchParams } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SOS from "./pages/SOS";
import ForArtists from "./pages/ForArtists";
import Creators from "./pages/Creators";
import GetTheApp from "./pages/GetTheApp";
import Company from "./pages/Company";
import Invest, { InvestDashboard, InvestConversationDashboard } from "./pages/Invest";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import EmailConfirmed from "./pages/EmailConfirmed";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import DeleteAccount from "./pages/DeleteAccount";
import ChildSafety from "./pages/ChildSafety";
import NotFound from "./pages/NotFound";
import BusinessPortal from "./pages/BusinessPortal";
import Account, { AccountSettings } from "./pages/Account";
import TeamInbox from "./pages/TeamInbox";

const BusinessCreate = lazy(() => import("./pages/BusinessWorkspace").then((module) => ({ default: module.BusinessCreate })));
const BusinessMissions = lazy(() => import("./pages/BusinessWorkspace").then((module) => ({ default: module.BusinessMissions })));
const BusinessReview = lazy(() => import("./pages/BusinessWorkspace").then((module) => ({ default: module.BusinessReview })));
const BusinessChat = lazy(() => import("./pages/BusinessChat"));

function BusinessLanding() {
  const [params] = useSearchParams();
  // Preserve existing bookmarked Mission detail links.
  return params.has("mission") ? <BusinessMissions /> : <BusinessChat />;
}

function RouteLoading() {
  return <div className="page-container" role="status" style={{ paddingBlock: 80, color: "var(--muted)" }}>Loading workspace…</div>;
}

/** Reset scroll and move focus to the top of each new page. */
function RouteChange() {
  const { pathname, search, hash, key } = useLocation();
  const previous = useRef(null);
  useEffect(() => {
    const last = previous.current;
    previous.current = { pathname, search, hash };
    // Checkout query updates and chapter anchors keep the reader's position.
    // Clicking the current page's navigation link still starts its story again.
    if (last?.pathname === pathname && (last.search !== search || last.hash !== hash)) return;
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, search, hash, key]);
  return null;
}

export default function App() {
  return (
    <>
      <RouteChange />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sos" element={<SOS />} />
          <Route path="/for-artists" element={<ForArtists />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/get-the-app" element={<GetTheApp />} />
          <Route path="/company" element={<Company />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/invest/dashboard" element={<InvestDashboard />} />
          <Route path="/invest/conversation" element={<InvestConversationDashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account/settings" element={<AccountSettings />} />
          <Route path="/team" element={<TeamInbox />} />
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
          <Route path="/business/missions" element={<Suspense fallback={<RouteLoading />}><BusinessLanding /></Suspense>} />
          <Route path="/business/campaigns" element={<Suspense fallback={<RouteLoading />}><BusinessMissions /></Suspense>} />
          <Route path="/business/sales" element={<Suspense fallback={<RouteLoading />}><BusinessChat team /></Suspense>} />
          <Route path="/business/review" element={<Suspense fallback={<RouteLoading />}><BusinessReview /></Suspense>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </>
  );
}
