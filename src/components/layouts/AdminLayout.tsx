import { useState } from "react";
import { Sidebar } from "./AdminSidebar";
import { Navbar } from "./AdminNavbar";
import { Outlet } from "react-router-dom";

export function AdminLayout() {
 const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#f4f7f0" }} >
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-[280px]">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}