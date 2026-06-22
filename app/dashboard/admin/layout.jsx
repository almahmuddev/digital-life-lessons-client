"use client";

import PrivateRoute from "@/components/ui/PrivateRoute";

export default function AdminLayout({ children }) {
  return <PrivateRoute adminOnly>{children}</PrivateRoute>;
}
