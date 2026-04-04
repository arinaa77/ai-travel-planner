"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import AuthModal from "@/components/auth/AuthModal";
import MyTripsPanel from "@/components/trips/MyTripsPanel";

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showTrips, setShowTrips] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
        <div className="text-2xl font-black tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            TripAgent
          </span>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <button
              onClick={() => setShowTrips(true)}
              className="px-5 py-2 text-sm font-semibold border-2 border-gray-200 rounded-full text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              My trips
            </button>
          )}

          <button className="px-5 py-2 text-sm font-bold rounded-full text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90 transition-all shadow-sm">
            New trip ✈︎
          </button>

          {user ? (
            <button
              onClick={handleSignOut}
              className="px-5 py-2 text-sm font-semibold border-2 border-gray-200 rounded-full text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2 text-sm font-semibold border-2 border-gray-200 rounded-full text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}

      {showTrips && (
        <MyTripsPanel onClose={() => setShowTrips(false)} />
      )}
    </>
  );
}
