import { Home, Users, Settings, FileText, BarChart3 } from "lucide-react";

export const SIDEBAR_LINKS = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { 
      icon: Users, 
      label: "Users", 
      path: "/users",
      subItems: [
        { label: "All Users", path: "/users/all" },
        { label: "Add User", path: "/users/add" },
        { label: "Roles", path: "/users/roles" }
      ]
    },
    { 
      icon: FileText, 
      label: "Documents", 
      path: "/documents",
      subItems: [
        { label: "All Documents", path: "/documents/all" },
        { label: "Upload", path: "/documents/upload" }
      ]
    },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];