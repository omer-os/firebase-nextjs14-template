"use client";
import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase-config";

export default function Page() {
  const router = useRouter();

  async function signOutUser() {
    //Sign out with the Firebase client
    await signOut(auth);

    //Clear the cookies in the server using our API in app/api/logout/route.ts
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.status === 200) {
      router.push("/auth/login");
    }
  }

  useEffect(() => {
    signOutUser();
  }, []);

  return <div>loging out ...</div>;
}
