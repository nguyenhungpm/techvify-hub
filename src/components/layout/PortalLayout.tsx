import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { Sidebar } from "./Sidebar";

export function PortalLayout() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <div className="flex w-full">
        <Sidebar />
        <main className="flex-1 min-w-0 px-8 py-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
