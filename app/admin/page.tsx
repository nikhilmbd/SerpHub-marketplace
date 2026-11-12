import type { Metadata } from "next";
import AdminPanel from "./admin-panel";

export const metadata: Metadata = {
  title: "SerpHub Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminPanel />;
}
