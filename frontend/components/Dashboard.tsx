"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ProjectGrid } from "./ProjectGrid";
import { Analytics } from "./Analytics";
import { LoginScreen } from "./LoginScreen";

export function Dashboard() {
  const { data: session, status } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState("overview");

  const handleSyncComplete = () => {
    // Force ProjectGrid to refresh by changing the key
    setRefreshKey((prev) => prev + 1);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "analytics":
        return <Analytics />;
      case "projects":
        return <ProjectGrid key={refreshKey} />;
      case "overview":
      default:
        return <ProjectGrid key={refreshKey} />;
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header onSyncComplete={handleSyncComplete} />
      <div className="flex">
        <Sidebar activeItem={activeView} onItemChange={setActiveView} />
        <main className="flex-1 p-6">{renderActiveView()}</main>
      </div>
    </div>
  );
}
