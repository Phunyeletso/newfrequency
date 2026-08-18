import Button from "../components/Button";
import useDocumentTitle from "../lib/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Page not found");

  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-prose">
        <h1 className="mb-4 text-3xl">That page isn't here</h1>
        <p className="mb-8 text-lg text-muted text-pretty">
          The link may be old, or we may have moved something. The pages below
          are all of them.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button to="/">Home</Button>
          <Button to="/get-the-app" variant="secondary">Get the app</Button>
          <Button to="/feedback" variant="secondary">Send feedback</Button>
        </div>
      </div>
    </section>
  );
}
