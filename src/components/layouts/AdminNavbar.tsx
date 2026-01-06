import { useState } from "react";
import { Menu, Bell, Search, ChevronDown, LogOut, Mail} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/auth.slice";

export function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state: any) => state.auth);
  const userData = user.data;
  console.log( )
  const navigate = useNavigate();

  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", unread: true },
    { id: 2, title: "Server backup completed", time: "1 hour ago", unread: true },
    { id: 3, title: "Database update finished", time: "3 hours ago", unread: false },
  ];

  const handleLogout = () => {
dispatch(logout());
navigate("/login");
  }

  return (
    <nav
      className="sticky top-0 z-30 w-full backdrop-blur-md border-b"
      style={{
        background: "rgba(255, 255, 255, 0.8)",
        borderColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)"
      }}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)",
              color: "white"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(235, 139, 29, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-400">/</span>
            <span className="font-medium" style={{ color: "#eb8b1d" }}>Overview</span>
          </div>
        </div>

        {/* Center Section - Search (Hidden on mobile) */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none transition-all"
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#eb8b1d";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(235, 139, 29, 0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Theme Toggle */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} className="text-gray-700" /> : <Moon size={20} className="text-gray-700" />}
          </button> */}

          {/* Language Selector */}
          {/* <button
            className="hidden lg:flex p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
            title="Change language"
          >
            <Globe size={20} className="text-gray-700" />
          </button> */}

          {/* Messages */}
          {/* <button
            className="hidden sm:flex p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 relative"
            title="Messages"
          >
            <MessageSquare size={20} className="text-gray-700" />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: "#b5ce07" }}
            />
          </button> */}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 relative"
              title="Notifications"
            >
              <Bell size={20} className="text-gray-700" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "#eb8b1d" }}
              />
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                style={{
                  animation: "slideDown 0.2s ease-out"
                }}
              >
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <p className="text-xs text-gray-500 mt-0.5">You have 2 unread messages</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{
                        background: notif.unread ? "rgba(235, 139, 29, 0.02)" : "transparent"
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-2 h-2 rounded-full mt-2"
                          style={{
                            background: notif.unread ? "#eb8b1d" : "#d1d5db"
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center border-t border-gray-100">
                  <button
                    className="text-sm font-medium transition-colors"
                    style={{ color: "#eb8b1d" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#d97a16"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#eb8b1d"}
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-1.5 rounded-lg transition-all duration-200 hover:bg-gray-100"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                style={{
                  background: "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)"
                }}
              >
                AD
              </div>
              <ChevronDown size={16} className="text-gray-600 hidden lg:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                style={{
                  animation: "slideDown 0.2s ease-out"
                }}
              >
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{
                        background: "linear-gradient(135deg, #eb8b1d 0%, #d97a16 100%)"
                      }}
                    >
                      AD
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{userData.role}</p>
                      <p className="text-xs text-gray-500">{userData.companyEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  {[
                    // { icon: User, label: "My Profile" },
                    // { icon: Settings, label: "Settings" },
                    { icon: Bell, label: "Notifications" },
                    { icon: Mail, label: "Messages" }
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={index}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(235, 139, 29, 0.05)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <Icon size={18} className="text-gray-600" />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button
                  onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left text-red-600"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(239, 68, 68, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}