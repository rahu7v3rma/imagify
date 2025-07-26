"use client";

import Header from "./_components/header";
import Sidebar from "./_components/sidebar";
import { useFirebase } from "@/context/firebase";
import { useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useFirebase();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = Cookies.get("imagify.auth.token");
        
        if (!authToken) {
          return;
        }

        const response = await axios.get("/dashboard/api", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.data.success) {
          setUser({
            email: response.data.data.email,
            credits: response.data.data.credits,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [setUser]);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-[8%]">
        <Header />
      </div>
      <div className="flex h-[92%] w-full">
        <Sidebar />
        <main className="p-4 w-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
