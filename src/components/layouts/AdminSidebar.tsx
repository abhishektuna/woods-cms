import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { X, Home,Package, Search, ChevronDown } from "lucide-react";

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (value: boolean) => void }) {
const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  // const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin-dashboard" },
    // {
    //   icon: Users, 
    //   label: "Users", 
    //   path: "/users",
    //   subItems: [
    //     { label: "All Users", path: "/users/all" },
    //     { label: "Add User", path: "/users/add" },
    //     { label: "Roles", path: "/users/roles" }
    //   ]
    // },
    {
      icon: Package, 
      label: "Product", 
      path: "/product",
      subItems: [
        { label: "All Product", path: "product" },
        { label: "Add Product", path: "product/create" }
      ]
    },
     {
      icon: Package, 
      label: "Category", 
      path: "/category",
      subItems: [
        { label: "All Categories", path: "category" },
        { label: "Add Category", path: "category/create" }
      ]
    },
     {
      icon: Package, 
      label: "SubCategory", 
      path: "/subcategory",
      subItems: [
        { label: "All SubCategories", path: "subcategory" },
        { label: "Add SubCategory", path: "subcategory/create" }
      ]
    }
   
  ];

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          style={{
            animation: "fadeIn 0.3s ease-in-out"
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: "280px",
          background: "linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%)",
          boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)"
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)"
          }}
        >
          <Link to="/dashboard" className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-xl"
              style={{
                background: "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)",
                boxShadow: "0 4px 12px rgba(235, 139, 29, 0.3)"
              }}
            >
              A
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
              {/* <p className="text-gray-400 text-xs">Dashboard v2.0</p> */}
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-white placeholder-gray-400 focus:outline-none focus:border-opacity-20 transition-all"
              style={{
                backdropFilter: "blur(10px)"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#eb8b1d";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235, 139, 29, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4" style={{ maxHeight: "calc(100vh - 280px)" }}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenu === item.label;
              const hasSubItems = item.subItems && item.subItems.length > 0;

              const isItemActive = (pathname: string) => {
                if (hasSubItems) {
                  return (
                    pathname === item.path ||
                    item.subItems!.some((s) => pathname.startsWith(s.path))
                  );
                }

                return pathname === item.path;
              };

              return (
                <div key={item.label}>
                  {/* If item has no subitems, use NavLink to navigate */}
                  {!hasSubItems ? (
                    <NavLink
                      to={item.path}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group"
                      style={({ isActive: navActive }) => ({
                        background: navActive ? "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)" : "transparent",
                        color: navActive ? "white" : "#9ca3af",
                        transform: navActive ? "translateX(4px)" : "translateX(0)"
                      })}
                      onMouseEnter={(e) => {
                        // preserve hover effect
                        e.currentTarget.style.background = e.currentTarget.getAttribute("data-active") === "true" ? e.currentTarget.style.background : "rgba(255, 255, 255, 0.05)";
                        e.currentTarget.style.color = e.currentTarget.getAttribute("data-active") === "true" ? e.currentTarget.style.color : "white";
                      }}
                      onMouseLeave={(e) => {
                        const active = e.currentTarget.getAttribute("aria-current") === "page";
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#9ca3af";
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                    </NavLink>
                  ) : (
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group"
                      style={{
                        background: isItemActive(window.location.pathname) ? "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)" : "transparent",
                        color: isItemActive(window.location.pathname) ? "white" : "#9ca3af",
                        transform: isItemActive(window.location.pathname) ? "translateX(4px)" : "translateX(0)"
                      }}
                      onMouseEnter={(e) => {
                        if (!isItemActive(window.location.pathname)) {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                          e.currentTarget.style.color = "white";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive(window.location.pathname)) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#9ca3af";
                        }
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={20} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                        }}
                      />
                    </button>
                  )}

                  {/* Submenu */}
                  {hasSubItems && (
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isExpanded ? "200px" : "0"
                      }}
                    >
                      <div className="mt-1 ml-6 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <NavLink
                            key={subItem.label}
                            to={subItem.path}
                            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                            style={({ isActive: navActive }) => ({
                              background: navActive ? "rgba(235, 139, 29, 0.1)" : "transparent",
                              color: navActive ? "#eb8b1d" : "#9ca3af",
                              borderLeft: navActive ? "2px solid #eb8b1d" : "2px solid transparent"
                            })}
                            onMouseEnter={(e) => {
                              if (e.currentTarget.getAttribute("aria-current") !== "page") {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                e.currentTarget.style.color = "white";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (e.currentTarget.getAttribute("aria-current") !== "page") {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#9ca3af";
                              }
                            }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            <span className="text-sm">{subItem.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        {/* <div
          className="p-4 border-t"
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)"
          }}
        >
          <div
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200"
            style={{
              background: "rgba(255, 255, 255, 0.05)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #b5ce07 0%, #a3ba06 100%)"
              }}
            >
              JD
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">John Doe</p>
              <p className="text-gray-400 text-xs">john@company.com</p>
            </div>
            <button
              className="text-gray-400 hover:text-white transition-colors"
              onClick={() => alert("Logout clicked")}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div> */}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Custom Scrollbar */
        nav::-webkit-scrollbar {
          width: 6px;
        }
        
        nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: rgba(235, 139, 29, 0.3);
          border-radius: 10px;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(235, 139, 29, 0.5);
        }
      `}</style>
    </>
  );
}