import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AccountGate from "../components/AccountGate";
import { businessChatService, CAMPAIGN_PROMPTS, chatError, readChatDrafts, writeChatDrafts } from "../lib/businessChatService";
import { supabase } from "../lib/supabaseClient";
import useDocumentTitle from "../lib/useDocumentTitle";

function dateLabel(value) {
  return new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function MessageText({ body }) {
  return body.split(/(https?:\/\/[^\s<>]+)/g).map((part, index) => {
    if (!/^https?:\/\//.test(part)) return part;
    const href = part.replace(/[.,;!?)]*$/, "");
    return <span key={index}><a href={href} target="_blank" rel="noopener noreferrer">{href}</a>{part.slice(href.length)}</span>;
  });
}

function ChatIcon({ name }) {
  const paths = {
    settings: <><path d="m9 3-.6 2.2-2 .9-2-.6-2 3.4 1.5 1.6v2.3l-1.5 1.6 2 3.4 2-.6 2 .9L9 21h4l.6-2.2 2-.9 2 .6 2-3.4-1.5-1.6v-2.3l1.5-1.6-2-3.4-2 .6-2-.9L13 3Z" /><circle cx="11" cy="12" r="3" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="m22 2-11 11" /></>,
    save: <><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z" /><path d="M7 3v6h9V3M7 21v-8h10v8" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 6.1A8 8 0 0 1 20 12M4 12a8 8 0 0 0 13.9 5.9" /></>,
    missions: <path d="M3 7h6l2 2h10v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 0V5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v2" />,
    inbox: <><path d="M4 4h16v16H4Z" /><path d="M4 13h5l2 3h2l2-3h5" /></>,
    signOut: <><path d="M9 21H4V3h5M9 12h12m-4-4 4 4-4 4" /></>,
  };
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function Conversations({ user, team = false, service = businessChatService, client = supabase, onSignOut }) {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get("chat");
  const [remote, setRemote] = useState([]);
  const [drafts, setDrafts] = useState(() => readChatDrafts(`${team ? "sales:" : ""}${user.id}`));
  const [threads, setThreads] = useState({});
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [operator, setOperator] = useState(false);
  const [promptIndex, setPromptIndex] = useState(null);
  const [connected, setConnected] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settings = useRef(null);
  const settingsButton = useRef(null);
  const composer = useRef(null);
  const log = useRef(null);
  const activeId = useRef(selectedId);
  activeId.current = selectedId;
  const storageUser = `${team ? "sales:" : ""}${user.id}`;

  useEffect(() => {
    if (!writeChatDrafts(storageUser, drafts)) setNotice("This browser could not save your draft. Use Save draft before leaving.");
  }, [drafts, storageUser]);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    const result = await service.list(team);
    if (result.ok) { setRemote(result.data || []); if (!quiet) setError(""); }
    else if (!quiet) setError(chatError(result));
    setLoading(false);
    return result;
  }, [team, service]);

  const loadMessages = useCallback(async (id, quiet = false) => {
    if (!quiet) setThreadLoading(true);
    const result = await service.messages(id);
    if (result.ok) setThreads(previous => ({ ...previous, [id]: result.data || [] }));
    else if (!quiet && activeId.current === id) setError(chatError(result));
    if (activeId.current === id) setThreadLoading(false);
  }, [service]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    let active = true;
    client?.rpc("is_moderator").then(({ data }) => { if (active) setOperator(data === true); });
    return () => { active = false; };
  }, [client]);

  const conversations = useMemo(() => {
    const merged = new Map(remote.map(row => [row.id, row]));
    if (!team) Object.values(drafts).forEach(draft => {
      if (!merged.has(draft.id)) merged.set(draft.id, draft);
    });
    return [...merged.values()].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }, [remote, drafts, team]);
  const selected = conversations.find(row => row.id === selectedId);
  const selectedRemote = remote.find(row => row.id === selectedId);
  const messages = threads[selectedId] || [];
  const localDraft = drafts[selectedId];
  const draftText = localDraft && (!localDraft.synced || team) ? localDraft.draft : (team ? "" : selected?.draft || "");
  const businessCount = messages.filter(message => message.sender === "business").length;
  const prompt = CAMPAIGN_PROMPTS[promptIndex ?? Math.min(businessCount, CAMPAIGN_PROMPTS.length - 1)];

  useEffect(() => {
    setPromptIndex(null); setNotice(""); setThreadLoading(false);
    if (selectedRemote?.id) loadMessages(selectedRemote.id);
  }, [selectedId, selectedRemote?.id, loadMessages]);

  useEffect(() => {
    if (!client) return undefined;
    const channel = client.channel(`business-chat:${team ? "team" : user.id}:${selectedId || "list"}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "business_conversations" }, () => load(true));
    if (selectedId) channel.on("postgres_changes", { event: "INSERT", schema: "public", table: "business_conversation_messages", filter: `conversation_id=eq.${selectedId}` }, () => { loadMessages(selectedId, true); load(true); });
    channel.subscribe(status => setConnected(status === "SUBSCRIBED"));
    // Reconnect and polling also recover updates missed during a dropped socket.
    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      load(true);
      if (selectedRemote?.id) loadMessages(selectedRemote.id, true);
    }, 20000);
    return () => { window.clearInterval(timer); client.removeChannel(channel); };
  }, [selectedId, selectedRemote?.id, team, user.id, load, loadMessages, client]);

  useEffect(() => {
    if (log.current) log.current.scrollTop = messages.length ? log.current.scrollHeight : 0;
  }, [selectedId, messages.length]);

  useEffect(() => {
    if (!composer.current) return;
    composer.current.style.height = "auto";
    composer.current.style.height = `${Math.min(composer.current.scrollHeight, 100)}px`;
  }, [draftText, selectedId]);

  useEffect(() => {
    if (!settingsOpen) return undefined;
    const dismiss = event => {
      if (event.type === "keydown" && event.key !== "Escape") return;
      if (event.type === "pointerdown" && settings.current?.contains(event.target)) return;
      setSettingsOpen(false);
      if (event.type === "keydown") settingsButton.current?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => { document.removeEventListener("pointerdown", dismiss); document.removeEventListener("keydown", dismiss); };
  }, [settingsOpen]);

  function updateDraft(text) {
    setDrafts(previous => ({ ...previous, [selectedId]: {
      ...selected, ...previous[selectedId], id: selectedId, draft: text,
      updated_at: new Date().toISOString(), synced: false,
    } }));
    setNotice("Draft saved on this device.");
  }

  async function newChat() {
    const id = crypto.randomUUID();
    const conversation = { id, title: "New campaign", draft: "", state: "draft", updated_at: new Date().toISOString() };
    setDrafts(previous => ({ ...previous, [id]: conversation }));
    setParams({ chat: id }); setError(""); setBusy(true);
    const result = await service.save(conversation);
    if (result.ok) { setRemote(previous => [result.data, ...previous.filter(row => row.id !== id)]); await load(true); }
    else setError(chatError(result));
    setBusy(false);
    composer.current?.focus();
  }

  async function saveDraft() {
    if (!selected || team) return;
    setBusy(true); setError("");
    const result = await service.save({ ...selected, draft: draftText });
    if (result.ok) {
      setRemote(previous => [result.data, ...previous.filter(row => row.id !== selected.id)]);
      setDrafts(previous => ({ ...previous, [selected.id]: { ...previous[selected.id], ...selected, draft: draftText, synced: true } }));
      setNotice("Draft saved to your account. You can return later.");
      await load(true);
    } else setError(chatError(result));
    setBusy(false);
  }

  async function send(event) {
    event.preventDefault();
    if (!selected || !draftText.trim() || busy) return;
    const id = selected.id;
    const body = draftText.trim();
    // Preserve this id on uncertain responses, including across reloads.
    const saved = drafts[id]?.pending;
    const request = saved?.body === body ? saved : { id: crypto.randomUUID(), body };
    setDrafts(previous => ({ ...previous, [id]: { ...selected, ...previous[id], draft: draftText, pending: request } }));
    setBusy(true); setError(""); setNotice("");
    if (!team && !selectedRemote) {
      const created = await service.save({ ...selected, draft: draftText });
      if (!created.ok) { setError(chatError(created)); setBusy(false); return; }
    }
    const result = await service.send({ conversationId: id, ...request });
    if (!result.ok) setError(chatError(result));
    else {
      setRemote(previous => [{ ...selected, draft: "", state: "open", title: selected.title === "New campaign" ? body.slice(0, 80) : selected.title, preview: body.slice(0, 100), updated_at: result.data.created_at }, ...previous.filter(row => row.id !== id)]);
      setThreads(previous => ({ ...previous, [id]: [...(previous[id] || []).filter(message => message.id !== result.data.id), result.data] }));
      setDrafts(previous => {
        const next = { ...previous }; delete next[id]; return next;
      });
      setNotice(team ? "Reply sent." : "Message sent to the sales team.");
      await load(true);
    }
    setBusy(false); composer.current?.focus();
  }

  async function refresh() {
    setError("");
    await load();
    if (selectedRemote) await loadMessages(selectedRemote.id);
  }

  return <div className="campaign-chat-workspace sales-chat-workspace">
    <aside className="campaign-chat-sidebar" aria-label="Campaign conversations">
      <div className="sales-sidebar-title"><span className="section-kicker">Business</span><h2>{team ? "Sales inbox" : "Campaign chats"}</h2></div>
      {!team && <button className="sales-new-chat" type="button" onClick={newChat} disabled={busy}><span aria-hidden="true">+</span> New chat</button>}
      <nav className="campaign-chat-list" aria-label="Previous campaign chats">
        {loading && <p className="campaign-chat-empty" role="status">Loading conversations…</p>}
        {!loading && !conversations.length && <p className="campaign-chat-empty">{team ? "No campaign messages yet." : "Your conversations will appear here."}</p>}
        {conversations.map(row => <Link key={row.id} className={`campaign-chat-item${row.id === selectedId ? " active" : ""}`} to={`?chat=${row.id}`} aria-current={row.id === selectedId ? "page" : undefined} onClick={() => setError("")}>
          <span className="campaign-chat-item-icon" aria-hidden="true">{row.title.slice(0, 1).toUpperCase()}</span>
          <span className="campaign-chat-item-copy"><strong>{row.title}</strong><small>{drafts[row.id]?.draft ? "Unsent draft" : row.preview || "Draft · not sent"}</small></span>
        </Link>)}
      </nav>
      <div className="sales-sidebar-bottom">
        <div className="sales-settings" ref={settings}>
          <button ref={settingsButton} className="sales-icon-button" type="button" aria-label="Settings" title="Settings" aria-expanded={settingsOpen} aria-controls="sales-settings-panel" onClick={() => setSettingsOpen(value => !value)}><ChatIcon name="settings" /></button>
          {settingsOpen && <div id="sales-settings-panel" className="sales-settings-panel" aria-label="Account actions"><Link to="/account/settings"><ChatIcon name="settings" />Account settings</Link><button type="button" onClick={async () => { setSettingsOpen(false); await onSignOut?.(); }}><ChatIcon name="signOut" />Sign out</button></div>}
        </div>
        <Link className="sales-icon-button" to="/business/campaigns" aria-label="Manage Missions" title="Manage Missions"><ChatIcon name="missions" /></Link>
        {operator && <Link className="sales-icon-button" to={team ? "/business/missions" : "/business/sales"} aria-label={team ? "My campaign chats" : "Sales inbox"} title={team ? "My campaign chats" : "Sales inbox"}><ChatIcon name="inbox" /></Link>}
      </div>
    </aside>
    <section className="campaign-chat-main sales-chat-main" aria-label="Active campaign conversation">
      <h1 className="sr-only">{selected?.title || "Campaign conversations"}</h1>
      {error && <div className="sales-chat-error" role="alert"><p>{error}</p><button className="sales-icon-button" type="button" onClick={refresh} disabled={loading || busy} aria-label="Retry connection" title="Retry connection"><ChatIcon name="refresh" /></button></div>}
      {selected ? <>
        <div className="sales-message-log" ref={log} role="log" aria-label="Campaign messages" aria-live="polite" aria-relevant="additions">
          {threadLoading && <p className="campaign-chat-empty" role="status">Loading messages…</p>}
          {!threadLoading && !messages.length && <div className="sales-welcome"><span className="campaign-assistant-avatar" aria-hidden="true">nf</span><h2>Tell us what you have in mind.</h2><p>Describe your campaign and send it to our sales team. The campaign guide can help you shape the brief.</p></div>}
          {messages.map(message => <article key={message.id} className={`sales-message ${message.sender === "business" ? "from-business" : "from-sales"}`}><div className="sales-message-meta"><strong>{message.sender === "sales" ? "Sales team" : team ? "Business" : "You"}</strong><time dateTime={message.created_at}>{dateLabel(message.created_at)}</time></div><p><MessageText body={message.body} /></p></article>)}
          {!team && <div className="sales-guide"><strong>Campaign guide <span>· Automated prompt</span></strong><p>{prompt.text}</p><div className="sales-prompt-buttons" role="group" aria-label="Campaign prompts">{CAMPAIGN_PROMPTS.map((item, index) => <button key={item.label} type="button" aria-pressed={item === prompt} onClick={() => { setPromptIndex(index); composer.current?.focus(); }}>{item.label}</button>)}</div></div>}
        </div>
        <form className="sales-composer" onSubmit={send} aria-busy={busy}>
          <label className="sr-only" htmlFor="campaign-message">{team ? "Reply to this business" : "Message the sales team"}</label>
          <span className="sr-only" id="campaign-composer-help">Maximum 6000 characters. Press Control or Command and Enter to send. Save draft to access it on another device.</span>
          <div className="sales-composer-row">
            <textarea id="campaign-message" ref={composer} rows={1} maxLength={6000} value={draftText} aria-describedby="campaign-composer-help" onChange={event => updateDraft(event.target.value)} disabled={busy} placeholder={team ? "Write your reply…" : "Message the sales team…"} onKeyDown={event => { if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
            {!team && <button className="sales-icon-button" type="button" onClick={saveDraft} disabled={busy} aria-label="Save draft" title="Save draft"><ChatIcon name="save" /></button>}
            <button className="sales-icon-button sales-send-button" type="submit" disabled={busy || !draftText.trim()} aria-label="Send message" title="Send message"><ChatIcon name="send" /></button>
          </div>
          <p className="sales-save-state" role="status">{busy ? "Saving…" : notice || (draftText ? drafts[selectedId]?.synced ? "Draft saved to your account." : "Draft saved on this device." : connected ? "Connected" : "")}</p>
        </form>
      </> : <div className="campaign-empty-chat"><span className="campaign-assistant-avatar" aria-hidden="true">nf</span><h2>{selectedId ? "Conversation unavailable" : team ? "Choose a conversation" : "Your next campaign starts here."}</h2><p>{selectedId ? "Choose a conversation from the list, or start a new chat." : team ? "Open a campaign chat to read the brief and reply." : "Talk to our sales team about your goals, audience and budget. Start with an idea; we’ll work through the details."}</p>{!team && <button className="button-primary" type="button" onClick={newChat} disabled={busy}>New chat <span aria-hidden="true">+</span></button>}</div>}
    </section>
  </div>;
}

export default function BusinessChat({ team = false }) {
  useDocumentTitle(team ? "Sales inbox" : "Campaign chats", "Your private campaign conversations with the newFrequency sales team.");
  return <AccountGate showHeading={false} showIdentity={false} showAccountActions={false} fullScreen wide compact redirectPath={team ? "/business/sales" : "/business/missions"}>{(session, { signOut }) => <Conversations key={`${session.user.id}:${team}`} user={session.user} team={team} onSignOut={signOut} />}</AccountGate>;
}
