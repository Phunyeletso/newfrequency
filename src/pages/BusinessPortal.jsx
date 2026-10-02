import { Link, Navigate } from "react-router-dom";
import useDocumentTitle from "../lib/useDocumentTitle";
import { useAccountSession } from "../lib/useAccountSession";

export default function BusinessPortal() {
  useDocumentTitle("Business enquiries", "Contact the newFrequency team about creator campaign availability.");
  const { session } = useAccountSession();
  if (session) return <Navigate to="/business/missions" replace />;
  return <>
    <section className="story-hero business-hero">
      <div className="page-container business-intro-grid">
        <div><p className="eyebrow"><span className="signal-dot" /> Business enquiries</p><h1 className="display-title">Working with<br /><em>creators?</em></h1><p className="lead-copy">Tell our sales team about the campaign you have in mind.</p><div className="button-row"><Link className="button-primary" to="/business/missions">Start a chat <span aria-hidden="true">↗</span></Link></div></div>
      </div>
    </section>
  </>;
}
