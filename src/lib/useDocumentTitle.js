import { useEffect } from "react";

/** Sets the page title and syncs the meta description for each route. */
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — newFrequency` : "newFrequency";
    if (description) {
      const tag = document.querySelector('meta[name="description"]');
      if (tag) tag.setAttribute("content", description);
    }
  }, [title, description]);
}
