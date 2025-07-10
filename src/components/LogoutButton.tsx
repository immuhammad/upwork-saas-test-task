"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setLoading(false);
    router.push("/login");
  };
  return (
    <button
      onClick={handleLogout}
      style={{ position: "absolute", top: 16, right: 24, padding: "8px 20px", background: "#eee", border: "1px solid #ccc", borderRadius: 6, fontWeight: 600, cursor: "pointer" }}
      disabled={loading}
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
} 