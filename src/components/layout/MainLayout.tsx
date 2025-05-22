import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/auth';
import { UserRole } from '../../types';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const { user, logout } = useAuthStore();

  // If not authenticated, we'll handle this at the router level

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  // Role-specific title
  const getRoleTitle = () => {
    switch (user?.role) {
      case UserRole.ENDUSER:
        return 'Support Portal';
      case UserRole.ITSTAFF:
        return 'Support Desk';
      case UserRole.SUPERVISOR:
        return 'Supervisor Dashboard';
      case UserRole.MANAGER:
        return 'Management Console';
      default:
        return 'IT Support System';
    }
  };
  
  // Mock notifications
  const notifications = [
    { id: '1', message: 'Your ticket #1234 has been updated', time: '5 min ago' },
    { id: '2', message: 'New comment on ticket #5678', time: '1 hour ago' },
    { id: '3', message: 'Ticket #9012 has been resolved', time: '3 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar} />
      
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:h-screen`}>
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="text-xl font-semibold text-primary-600">IT Support</div>
          <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="md:ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center">
              <button className="md:hidden text-gray-500 mr-2" onClick={toggleSidebar}>
                <Menu size={24} />
              </button>
              <h1 className="text-lg font-medium text-gray-800">{getRoleTitle()}</h1>
            </div>
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={toggleNotifications}
                >
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white"></span>
                </button>
                
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                          <p className="text-sm text-gray-700">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                      <div className="px-4 py-2 text-center">
                        <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-sm focus:outline-none"
                  onClick={toggleUserMenu}
                >
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt={user.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <User size={18} className="text-gray-500" />
                    )}
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">{user?.name}</span>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 text-xs text-gray-500">
                        Logged in as <span className="font-medium">{user?.role}</span>
                      </div>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        onClick={logout}
                      >
                        <LogOut size={16} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t py-3 px-4">
          <p className="text-xs text-gray-500 text-center">© 2025 IT Support Ticketing System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;