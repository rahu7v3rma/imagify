"use client";

import { useFirebase } from "@/context/firebase";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useFirebase();
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/login");
    }
  };

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {user && (
        <>
          <p className="text-lg mb-6">{user.email}</p>
          <Button onPress={handleLogout}>Logout</Button>
        </>
      )}
    </div>
  );
}
