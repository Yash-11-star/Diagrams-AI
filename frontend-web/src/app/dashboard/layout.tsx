"use client";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

  const { user, loading } = useAuth();

    if (!loading && !user) router.push("/login");

    return (
        <div className="w-8 h-8 border-2 border-apple-blue border-t-transparent rounded-full animate-spin" />
    );


    <div className="flex flex-col h-screen bg-apple-bg">
      <main className="flex-1 overflow-hidden min-h-0">
      </main>
  );
