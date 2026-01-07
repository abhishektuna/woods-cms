

const AdminHome = () => {
  return (
   <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back! 👋</h1>
              <p className="text-gray-600">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Cards */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: "Total Users", value: "2,543", change: "+12%", color: "#eb8b1d" },
                { label: "Revenue", value: "$45,231", change: "+8%", color: "#b5ce07" },
                { label: "Active Projects", value: "24", change: "+3%", color: "#3b82f6" },
                { label: "Completion Rate", value: "94%", change: "+2%", color: "#10b981" }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md transition-all duration-200 cursor-pointer"
                  style={{
                    border: "1px solid rgba(0, 0, 0, 0.05)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                >
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                    <span
                      className="text-sm font-semibold px-2 py-1 rounded"
                      style={{
                        background: `${stat.color}20`,
                        color: stat.color
                      }}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div> */}

            {/* Content Card */}
            {/* <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 p-4 rounded-lg transition-colors duration-200"
                    style={{ background: "#f4f7f0" }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "#eb8b1d" }}
                    >
                      <Bell className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">New user registered</p>
                      <p className="text-sm text-gray-600">2 minutes ago</p>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                      style={{
                        background: "transparent",
                        border: "1px solid #eb8b1d",
                        color: "#eb8b1d"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#eb8b1d";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#eb8b1d";
                      }}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
  );
};

export default AdminHome;
