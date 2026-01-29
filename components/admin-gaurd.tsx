"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "./utils";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function AdminGuard({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const run = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const res = await api.get("/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { role } = res.data.user;

        if (role !== "ADMIN") {
          router.replace("/");
        } 
      } catch {
        localStorage.removeItem("accessToken");
        router.replace("/login");
      }
    };

    run();
  }, [router]);

  return <>{children}</>;
}
