import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TicketPlus, Search, Book, ListChecks, Settings, Users, BarChart } from 'lucide-react';
import { useAuthStore } from '../../store/auth';
import { UserRole } from '../../types';

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  // Define nav items based on user role
  const getNavItems = () => {
    const baseItems = [
      { to: '/', label: 'Dashboard', icon: <Home size={18} /> },
    ];
    
    // Role-specific items
    switch (user.role) {
      case UserRole.ENDUSER:
        return [
          ...baseItems,
          { to: '/tickets', label: 'My Tickets', icon: <ListChecks size={18} /> },
          { to: '/tickets/new', label: 'New Ticket', icon: <TicketPlus size={18} /> },
          { to: '/knowledge', label: 'Knowledge Base', icon: <Book size={18} /> },
        ];
        
      case UserRole.ITSTAFF:
        return [
          ...baseItems,
          { to: '/tickets', label: 'Tickets', icon: <ListChecks size={18} /> },
          { to: '/search', label: 'Search', icon: <Search size={18} /> },
          { to: '/knowledge', label: 'Knowledge Base', icon: <Book size={18} /> },
        ];
        
      case UserRole.SUPERVISOR:
        return [
          ...baseItems,
          { to: '/tickets', label: 'Tickets', icon: <ListChecks size={18} /> },
          { to: '/staff', label: 'Staff', icon: <Users size={18} /> },
          { to: '/search', label: 'Search', icon: <Search size={18} /> },
          { to: '/knowledge', label: 'Knowledge Base', icon: <Book size={18} /> },
          { to: '/reports', label: 'Reports', icon: <BarChart size={18} /> },
        ];
        
      case UserRole.MANAGER:
        return [
          ...baseItems,
          { to: '/tickets', label: 'Tickets', icon: <ListChecks size={18} /> },
          { to: '/staff', label: 'Staff', icon: <Users size={18} /> },
          { to: '/reports', label: 'Reports', icon: <BarChart size={18} /> },
          { to: '/settings', label: 'Settings', icon: <Settings size={18} /> },
        ];
        
      default:
        return baseItems;
    }
  };
  
  const navItems = getNavItems();

  return (
    <div className="flex flex-col h-full py-4">
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
      
      <div className="px-4 mt-auto">
        <div className="border-t pt-4">
          {/* Mock user selector for demo purposes */}
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Demo Mode
          </div>
          <select
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            value={user.id}
            onChange={(e) => {
              const { switchUser } = useAuthStore.getState();
              switchUser(e.target.value);
            }}
          >
            <option value="1">End User (John)</option>
            <option value="2">IT Staff (Jane)</option>
            <option value="3">Supervisor (Mike)</option>
            <option value="4">Manager (Sarah)</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;