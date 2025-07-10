export default function Home() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <h1>Welcome to SaaS Funnel</h1>
      <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
        <a href="/login" style={{ padding: "12px 32px", background: "#0070f3", color: "#fff", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>Login</a>
        <a href="/signup" style={{ padding: "12px 32px", background: "#fff", color: "#0070f3", border: "2px solid #0070f3", borderRadius: 6, textDecoration: "none", fontWeight: 600 }}>Sign Up</a>
      </div>
    </div>
  );
}
