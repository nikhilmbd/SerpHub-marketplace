"use client";

import { FormEvent, useEffect, useState } from "react";

type AdminDomain = { id: string; name: string; priceUSD: number; category: string; status: string; createdAt: string; description: string | null; ageYears: number | null; authorityScore: number | null; domainAuthority: number | null; pageAuthority: number | null; domainRating: number | null; backlinks: number | null; tags: string[]; featured: boolean };
type DomainForm = typeof initial;
const initial = { name: "", priceUSD: "", category: "", description: "", ageYears: "", authorityScore: "", domainAuthority: "", pageAuthority: "", domainRating: "", backlinks: "", tags: "", status: "AVAILABLE", featured: false };

const fieldStyle: React.CSSProperties = { width: "100%", padding: "11px 12px", border: "1px solid #d9e0eb", borderRadius: 9, font: "inherit", background: "#fff", color: "#17243a", boxSizing: "border-box" };
const labelStyle: React.CSSProperties = { display: "grid", gap: 6, color: "#344258", fontSize: 13, fontWeight: 650 };

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [domains, setDomains] = useState<AdminDomain[]>([]);
  const [form, setForm] = useState<DomainForm>(initial);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  async function loadDomains() {
    const response = await fetch("/api/admin/domains", { cache: "no-store" });
    if (response.status === 401) { setLoggedIn(false); return; }
    if (!response.ok) throw new Error("Could not load inventory.");
    const data = await response.json();
    setDomains(data.domains ?? []);
    setLoggedIn(true);
  }

  useEffect(() => { loadDomains().catch(() => setLoggedIn(false)); }, []);

  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setError(false);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      setPassword(""); await loadDomains(); setMessage("You are signed in.");
    } catch (e) { setError(true); setMessage(e instanceof Error ? e.message : "Login failed."); }
    finally { setBusy(false); }
  }

  function formPayload() {
    return { ...form, name: form.name.trim().toLowerCase(), priceUSD: Number(form.priceUSD), ageYears: form.ageYears === "" ? null : Number(form.ageYears), authorityScore: form.authorityScore === "" ? null : Number(form.authorityScore), domainAuthority: form.domainAuthority === "" ? null : Number(form.domainAuthority), pageAuthority: form.pageAuthority === "" ? null : Number(form.pageAuthority), domainRating: form.domainRating === "" ? null : Number(form.domainRating), backlinks: form.backlinks === "" ? null : Number(form.backlinks), tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean) };
  }

  function startEditing(domain: AdminDomain) {
    setEditingId(domain.id);
    setForm({
      name: domain.name,
      priceUSD: String(domain.priceUSD),
      category: domain.category === "Uncategorized" ? "" : domain.category,
      description: domain.description ?? "",
      ageYears: domain.ageYears === null ? "" : String(domain.ageYears),
      authorityScore: domain.authorityScore === null ? "" : String(domain.authorityScore),
      domainAuthority: domain.domainAuthority === null ? "" : String(domain.domainAuthority),
      pageAuthority: domain.pageAuthority === null ? "" : String(domain.pageAuthority),
      domainRating: domain.domainRating === null ? "" : String(domain.domainRating),
      backlinks: domain.backlinks === null ? "" : String(domain.backlinks),
      tags: (domain.tags ?? []).join(", "),
      status: domain.status,
      featured: domain.featured,
    });
    setMessage(`Editing ${domain.name}`);
    setError(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(initial);
    setMessage("Edit cancelled.");
    setError(false);
  }

  async function saveDomain(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setError(false);
    try {
      const payload = formPayload();
      const response = await fetch("/api/admin/domains", { method: editingId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editingId ? { ...payload, id: editingId } : payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || (editingId ? "Could not update domain." : "Could not add domain."));
      const savedName = data.domain.name;
      setForm(initial); setEditingId(null); await loadDomains();
      setMessage(editingId ? `${savedName} updated successfully.` : `${savedName} added successfully.`);
    } catch (e) { setError(true); setMessage(e instanceof Error ? e.message : "Could not save domain."); }
    finally { setBusy(false); }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false); setDomains([]); setMessage("You have been signed out.");
  }

  const input = (key: keyof typeof initial, label: string, type = "text", required = false, hint?: string) => (
    <label style={labelStyle}>{label}<input style={fieldStyle} type={type} required={required} value={String(form[key])} onChange={(e) => setForm((current) => ({ ...current, [key]: type === "checkbox" ? e.target.checked : e.target.value }))} />{hint && <small style={{ color: "#718096", fontWeight: 400 }}>{hint}</small>}</label>
  );

  return <main style={{ minHeight: "100vh", background: "#f4f7fb", padding: "36px 18px", color: "#17243a" }}>
    <div style={{ maxWidth: 1050, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 28 }}>
        <div><div style={{ fontSize: 13, letterSpacing: 2, color: "#3478e5", fontWeight: 800 }}>SERPHUB</div><h1 style={{ fontSize: 30, margin: "5px 0 0" }}>Domain inventory admin</h1><p style={{ color: "#68778d", margin: "6px 0 0" }}>Add new listings or edit existing domains in your marketplace.</p></div>
        {loggedIn && <button onClick={logout} style={{ border: "1px solid #d5deea", background: "white", padding: "10px 15px", borderRadius: 9, cursor: "pointer" }}>Sign out</button>}
      </header>
      {message && <div role="status" style={{ padding: 12, marginBottom: 18, borderRadius: 9, background: error ? "#fff0f0" : "#eaf7ef", color: error ? "#a52b2b" : "#176b3a" }}>{message}</div>}
      {!loggedIn ? <form onSubmit={login} style={{ maxWidth: 440, background: "white", padding: 26, borderRadius: 16, border: "1px solid #e2e8f0", display: "grid", gap: 16 }}>
        <h2 style={{ margin: 0 }}>Admin sign in</h2><p style={{ color: "#68778d", margin: 0 }}>Enter the admin password configured in your hosting environment.</p>
        <label style={labelStyle}>Admin password<input style={fieldStyle} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button disabled={busy} style={{ border: 0, background: "#246be8", color: "white", borderRadius: 9, padding: 13, fontWeight: 700, cursor: "pointer" }}>{busy ? "Signing in…" : "Sign in"}</button>
      </form> : <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, .8fr)", gap: 22, alignItems: "start" }}>
        <form onSubmit={saveDomain} style={{ background: "white", padding: 24, borderRadius: 16, border: "1px solid #e2e8f0", display: "grid", gap: 15 }}>
          <h2 style={{ margin: 0 }}>{editingId ? "Edit domain" : "Add a domain"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>{input("name", "Domain name", "text", true, "Example: example.com")}{input("priceUSD", "Price (USD)", "number", true)}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13 }}>{input("category", "Category", "text", true)}{<label style={labelStyle}>Status<select style={fieldStyle} value={form.status} onChange={(e) => setForm((v) => ({ ...v, status: e.target.value }))}><option value="AVAILABLE">Available</option><option value="RESERVED">Reserved</option><option value="SOLD">Sold</option><option value="INACTIVE">Inactive</option></select></label>}</div>
          <label style={labelStyle}>Description<textarea style={{ ...fieldStyle, minHeight: 75, resize: "vertical" }} value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} /></label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 13 }}>{input("ageYears", "Age (years)", "number")}{input("authorityScore", "AS", "number")}{input("domainAuthority", "DA", "number")}{input("pageAuthority", "PA", "number")}{input("domainRating", "DR", "number")}{input("backlinks", "Backlinks", "number")}</div>
          {input("tags", "Tags", "text", false, "Separate multiple tags with commas")}
          <label style={{ display: "flex", alignItems: "center", gap: 9, color: "#344258", fontSize: 14 }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm((v) => ({ ...v, featured: e.target.checked }))} /> Feature this domain</label>
          <button disabled={busy} style={{ border: 0, background: "#246be8", color: "white", borderRadius: 9, padding: 14, fontWeight: 750, cursor: "pointer" }}>{busy ? "Saving…" : editingId ? "Save domain changes" : "Add domain to marketplace"}</button>
          {editingId && <button type="button" onClick={cancelEditing} disabled={busy} style={{ border: "1px solid #d5deea", background: "white", color: "#344258", borderRadius: 9, padding: 12, fontWeight: 650, cursor: "pointer" }}>Cancel editing</button>}
        </form>
        <section style={{ background: "white", padding: 22, borderRadius: 16, border: "1px solid #e2e8f0" }}><h2 style={{ margin: "0 0 5px" }}>Inventory</h2><p style={{ color: "#68778d", margin: "0 0 15px", fontSize: 13 }}>{domains.length} domains in database</p><div style={{ display: "grid", gap: 0 }}>{domains.map((d) => <div key={d.id} style={{ padding: "12px 0", borderTop: "1px solid #edf0f5", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}><div style={{ minWidth: 0 }}><strong style={{ display: "block", overflowWrap: "anywhere" }}>{d.name}</strong><span style={{ color: "#68778d", fontSize: 12 }}>{d.category} · ${d.priceUSD.toLocaleString("en-US")} · {d.status}</span></div><button type="button" onClick={() => startEditing(d)} style={{ flexShrink: 0, border: "1px solid #cbd9ef", background: "#f4f8ff", color: "#246be8", padding: "8px 11px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Edit</button></div>)}</div></section>
      </div>}
      <p style={{ color: "#7b8798", fontSize: 12, marginTop: 22 }}>Private admin area. Do not share the admin password. Domain metrics should be checked before publishing.</p>
    </div>
  </main>;
}
