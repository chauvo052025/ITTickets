import React from 'react';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { Check, Clock, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useTicketStore } from '../store/tickets';
import { UserRole } from '../types';

// Mock IT staff data
const mockStaff = [
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Support Specialist',
    email: 'jane.smith@example.com',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    status: 'online',
  },
  {
    id: '5',
    name: 'Alex Johnson',
    role: 'Desktop Support',
    email: 'alex.johnson@example.com',
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    status: 'busy',
  },
  {
    id: '6',
    name: 'Emily Davis',
    role: 'Network Specialist',
    email: 'emily.davis@example.com',
    profileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
    status: 'offline',
  },
];

const StaffPage: React.FC = () => {
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();
  
  if (!user || (user.role !== UserRole.SUPERVISOR && user.role !== UserRole.MANAGER)) {
    return <div>Access denied. You do not have permission to view this page.</div>;
  }
  
  // Get workload for each staff member
  const getStaffWorkload = (staffId: string) => {
    return tickets.filter(t => t.assignedTo === staffId && t.status !== 'CLOSED').length;
  };
  
  // Status badge component
  const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    switch (status) {
      case 'online':
        return (
          <Badge variant="success" className="flex items-center">
            <Check size={10} className="mr-1" />
            Available
          </Badge>
        );
      case 'busy':
        return (
          <Badge variant="warning" className="flex items-center">
            <Clock size={10} className="mr-1" />
            Busy
          </Badge>
        );
      case 'offline':
        return (
          <Badge variant="default" className="flex items-center">
            <X size={10} className="mr-1" />
            Offline
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">IT Support Staff</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockStaff.map(staff => (
          <Card key={staff.id} className="overflow-hidden">
            <div className="p-4 flex items-center">
              <div className="mr-4">
                <img 
                  src={staff.profileImage} 
                  alt={staff.name}
                  className="h-16 w-16 rounded-full"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">{staff.name}</h3>
                <p className="text-sm text-gray-500">{staff.role}</p>
                <div className="flex items-center justify-between mt-2">
                  <StatusBadge status={staff.status} />
                  <div className="text-xs text-gray-500">
                    Workload: <span className="font-medium">{getStaffWorkload(staff.id)} tickets</span>
                  </div>
                </div>
              </div>
            </div>
            
            <CardContent className="bg-gray-50 border-t">
              <div className="flex justify-between items-center text-sm">
                <a href={`mailto:${staff.email}`} className="text-primary-600 hover:text-primary-800">
                  Contact
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-800">
                  View Assigned Tickets
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Performance Metrics</h2>
        
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left">Staff Member</th>
                  <th className="px-4 py-3 text-center">Tickets Resolved</th>
                  <th className="px-4 py-3 text-center">Avg. Resolution Time</th>
                  <th className="px-4 py-3 text-center">Customer Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {mockStaff.map(staff => (
                  <tr key={staff.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <img 
                          src={staff.profileImage} 
                          alt={staff.name}
                          className="h-8 w-8 rounded-full mr-3"
                        />
                        <span>{staff.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{Math.floor(Math.random() * 50) + 10}</td>
                    <td className="px-4 py-3 text-center">{Math.floor(Math.random() * 24) + 1} hours</td>
                    <td className="px-4 py-3 text-center">{(Math.random() * 2 + 3).toFixed(1)}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StaffPage;