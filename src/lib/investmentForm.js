export const EMPTY_INTEREST = {
  full_name: "", organization: "", investor_type: "individual", amount: "", currency: "ZAR",
  preferred_contact: "email", phone: "", thesis: "", updates_opt_in: false,
};

export const INTEREST_STATES = {
  draft: { label: "Draft", description: "Shape your introduction. Send it when you're ready." },
  submitted: { label: "Sent", description: "Your introduction is with the newFrequency team." },
  under_review: { label: "In review", description: "The team is reading your introduction." },
  needs_information: { label: "Your turn", description: "The team has a question. Update your introduction and send it again." },
  conversation: { label: "Let's talk", description: "The team will use your chosen contact method to continue the conversation." },
  closed: { label: "Conversation closed", description: "Read the team's response below." },
  withdrawn: { label: "Withdrawn", description: "Your introduction has been withdrawn. You can start again at any time." },
};

export function canEditInterest(state) {
  return !state || ["draft", "needs_information", "withdrawn", "closed"].includes(state);
}

export function interestToForm(interest) {
  if (!interest) return { ...EMPTY_INTEREST };
  return Object.fromEntries(Object.keys(EMPTY_INTEREST).map((key) => [
    key, key === "amount" ? (interest[key] == null ? "" : String(interest[key])) : (interest[key] ?? EMPTY_INTEREST[key]),
  ]));
}

export function validateInterest(details, submit = false) {
  const errors = {};
  const amount = String(details.amount ?? "").trim();
  if (amount && (!/^\d{1,12}(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || Number(amount) > 999999999999.99)) {
    errors.amount = "Enter an amount greater than zero, with up to two decimal places.";
  }
  if (submit && !amount) errors.amount = "Add the amount you would like to discuss.";
  if (submit && String(details.full_name ?? "").trim().length < 2) errors.full_name = "Add your name.";
  if (String(details.full_name ?? "").trim().length > 140) errors.full_name = "Keep your name within 140 characters.";
  if (String(details.organization ?? "").trim().length > 180) errors.organization = "Keep the organisation within 180 characters.";
  const thesis = String(details.thesis ?? "").trim();
  if (submit && thesis.length < 20) errors.thesis = "Tell us a little more in at least 20 characters.";
  if (thesis.length > 3000) errors.thesis = "Keep your introduction within 3,000 characters.";
  if (!["individual", "company", "fund"].includes(details.investor_type)) errors.investor_type = "Choose an investor type.";
  if (!["ZAR", "USD", "EUR", "GBP"].includes(details.currency)) errors.currency = "Choose a supported currency.";
  if (!["email", "phone"].includes(details.preferred_contact)) errors.preferred_contact = "Choose a contact method.";
  if ((submit && details.preferred_contact === "phone") || details.phone) {
    if (!/^\+?[0-9 ()-]{7,30}$/.test(String(details.phone ?? "").trim())) errors.phone = "Add a valid phone number, including your country code.";
  }
  return errors;
}

export function investmentError(result) {
  const detail = `${result?.code || ""} ${result?.message || ""}`.toLowerCase();
  if (detail.includes("version_conflict")) return "This introduction changed in another tab. Reload your workspace to see the latest version.";
  if (detail.includes("not_editable")) return "Your introduction is being reviewed. Withdraw it before making a new introduction.";
  if (detail.includes("review_forbidden")) return "This account does not have permission to review introductions.";
  if (detail.includes("invalid_contact")) return "Check your name and phone number.";
  if (detail.includes("invalid_amount")) return "Check the amount and currency.";
  if (detail.includes("invalid_thesis")) return "Add an introduction of 20 to 3,000 characters.";
  if (detail.includes("consent_required")) return "Agree to contact about your introduction before sending it.";
  if (["PGRST202", "42883", "42P01"].includes(result?.code)) return "The investment workspace needs its database update. Please contact newFrequency support.";
  if (result?.code === "network_error") return "Check your connection and try again.";
  return "We could not complete that change. Please try again.";
}
