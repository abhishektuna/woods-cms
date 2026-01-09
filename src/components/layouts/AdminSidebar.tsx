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
      {/* Mobile Overlay with enhanced backdrop blur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
            animation: "fadeIn 0.3s ease-in-out"
          }}
        />
      )}

      {/* Sidebar with enhanced styling */}
      <div
        className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{
          width: "280px",
          background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 50%, #262626 100%)",
          boxShadow: "8px 0 32px rgba(0, 0, 0, 0.4), inset -1px 0 0 rgba(255, 255, 255, 0.05)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        {/* Header with enhanced gradient and glow */}
        <div
          className="flex items-center justify-between p-6 border-b relative"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            background: "linear-gradient(135deg, rgba(235, 139, 29, 0.05) 0%, transparent 100%)"
          }}
        >
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-xl transition-all duration-300 group-hover:scale-110"
              style={{
                background: "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)",
                boxShadow: "0 8px 24px rgba(235, 139, 29, 0.4), 0 0 40px rgba(235, 139, 29, 0.2)",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              A
            </div>
            <div>
              <h2 className="text-white font-bold text-lg tracking-tight">Admin Panel</h2>
              <p className="text-gray-400 text-xs mt-0.5">Management System</p>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-all duration-200 hover:rotate-90 hover:scale-110"
          >
            <X size={24} />
          </button>
        </div>

        {/* Enhanced Search Bar with glow effect */}
        <div className="p-4">
          <div className="relative group">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-200 group-focus-within:text-orange-400" 
              size={18} 
            />
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
              style={{
                backdropFilter: "blur(10px)"
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#eb8b1d";
                e.currentTarget.style.background = "rgba(235, 139, 29, 0.08)";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(235, 139, 29, 0.15), 0 8px 16px rgba(235, 139, 29, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Navigation Menu with enhanced effects */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4" style={{ maxHeight: "calc(100vh - 280px)" }}>
          <div className="space-y-2">
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
                <div key={item.label} className="relative">
                  {!hasSubItems ? (
                    <NavLink
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
                      style={({ isActive: navActive }) => ({
                        background: navActive 
                          ? "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)" 
                          : "transparent",
                        color: navActive ? "white" : "#9ca3af",
                        transform: navActive ? "translateX(6px)" : "translateX(0)",
                        boxShadow: navActive 
                          ? "0 8px 24px rgba(235, 139, 29, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset"
                          : "none"
                      })}
                      onMouseEnter={(e) => {
                        if (e.currentTarget.getAttribute("aria-current") !== "page") {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const active = e.currentTarget.getAttribute("aria-current") === "page";
                        if (!active) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#9ca3af";
                          e.currentTarget.style.transform = "translateX(0)";
                        }
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium text-[15px]">{item.label}</span>
                      </div>
                    </NavLink>
                  ) : (
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden"
                      style={{
                        background: isItemActive(window.location.pathname) 
                          ? "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)" 
                          : "transparent",
                        color: isItemActive(window.location.pathname) ? "white" : "#9ca3af",
                        transform: isItemActive(window.location.pathname) ? "translateX(6px)" : "translateX(0)",
                        boxShadow: isItemActive(window.location.pathname) 
                          ? "0 8px 24px rgba(235, 139, 29, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset"
                          : "none"
                      }}
                      onMouseEnter={(e) => {
                        if (!isItemActive(window.location.pathname)) {
                          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.transform = "translateX(4px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isItemActive(window.location.pathname)) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#9ca3af";
                          e.currentTarget.style.transform = "translateX(0)";
                        }
                      }}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon size={20} className="group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-medium text-[15px]">{item.label}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className="transition-all duration-300"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)"
                        }}
                      />
                    </button>
                  )}

                  {/* Enhanced Submenu */}
                  {hasSubItems && (
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isExpanded ? "200px" : "0",
                        opacity: isExpanded ? 1 : 0
                      }}
                    >
                      <div className="mt-2 ml-4 space-y-1 pl-4 border-l-2 border-white border-opacity-10">
                        {item.subItems?.map((subItem, index) => (
                          <NavLink
                            key={subItem.label}
                            to={subItem.path}
                            onClick={() => setIsOpen(false)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group"
                            style={({ isActive: navActive }) => ({
                              background: navActive ? "rgba(235, 139, 29, 0.15)" : "transparent",
                              color: navActive ? "#eb8b1d" : "#9ca3af",
                              borderLeft: navActive ? "3px solid #eb8b1d" : "3px solid transparent",
                              marginLeft: "-2px",
                              animationDelay: `${index * 50}ms`,
                              animation: isExpanded ? "slideIn 0.3s ease-out forwards" : "none"
                            })}
                            onMouseEnter={(e) => {
                              if (e.currentTarget.getAttribute("aria-current") !== "page") {
                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                e.currentTarget.style.color = "white";
                                e.currentTarget.style.transform = "translateX(4px)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (e.currentTarget.getAttribute("aria-current") !== "page") {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#9ca3af";
                                e.currentTarget.style.transform = "translateX(0)";
                              }
                            }}
                          >
                            <div 
                              className="w-2 h-2 rounded-full transition-all duration-200 group-hover:scale-125" 
                              style={{ 
                                background: "currentColor",
                                boxShadow: "0 0 8px currentColor"
                              }} 
                            />
                            <span className="font-medium">{subItem.label}</span>
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

        {/* Enhanced Footer with gradient */}
        <div
          className="p-4 border-t relative"
          style={{
            borderColor: "rgba(255, 255, 255, 0.08)",
            background: "linear-gradient(0deg, rgba(235, 139, 29, 0.05) 0%, transparent 100%)"
          }}
        >
          <div className="text-center">
            <p className="text-gray-500 text-xs font-medium">
              Powered by <span className="text-orange-400">Admin System</span>
            </p>
          </div>
        </div>
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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Enhanced Custom Scrollbar */
        nav::-webkit-scrollbar {
          width: 8px;
        }
        
        nav::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
          margin: 8px 0;
        }
        
        nav::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(235, 139, 29, 0.4) 0%, rgba(235, 139, 29, 0.6) 100%);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        nav::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(235, 139, 29, 0.6) 0%, rgba(235, 139, 29, 0.8) 100%);
          background-clip: padding-box;
        }

        /* Smooth scroll behavior */
        nav {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}