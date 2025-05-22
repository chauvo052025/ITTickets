import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketPlus, Book } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import DashboardStats from '../components/dashboard/DashboardStats';
import TicketsByStatus from '../components/dashboard/TicketsByStatus';
import RecentTickets from '../components/dashboard/RecentTickets';
import { useAuthStore } from '../store/auth';
import { useTicketStore } from '../store/tickets';
import { UserRole } from '../types';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { tickets } = useTicketStore();
  
  if (!user) return null;
  
  // Role-specific welcome message
  const getWelcomeMessage = () => {
    const timeOfDay = (() => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    })();
    
    return `${timeOfDay}, ${user.name}`;
  };
  
  // Role-specific dashboard content
  const renderRoleSpecificContent = () => {
    switch (user.role) {
      case UserRole.ENDUSER:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>Submit a new support request</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our IT support team is ready to help you with any technical issues you're experiencing.
                </p>
                <Button
                  onClick={() => navigate('/tickets/new')}
                  leftIcon={<TicketPlus size={16} />}
                >
                  Create New Ticket
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Self-Help Resources</CardTitle>
                <CardDescription>Browse our knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Find solutions to common problems in our knowledge base with step-by-step guides.
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/knowledge')}
                  leftIcon={<Book size={16} />}
                >
                  Browse Knowledge Base
                </Button>
              </CardContent>
            </Card>
          </div>
        );
        
      case UserRole.ITSTAFF:
        const unassignedTickets = tickets.filter(t => !t.assignedTo).length;
        return (
          <div className="mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Support Queue Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  There {unassignedTickets === 1 ? 'is' : 'are'} currently <strong>{unassignedTickets}</strong> unassigned {unassignedTickets === 1 ? 'ticket' : 'tickets'} in the queue.
                </p>
                <Button
                  onClick={() => navigate('/tickets')}
                >
                  View Support Queue
                </Button>
              </CardContent>
            </Card>
          </div>
        );
        
      case UserRole.SUPERVISOR:
      case UserRole.MANAGER:
        // Analytics summary for supervisors and managers
        return (
          <div className="mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Monitor the overall status of the support system and performance metrics.
                </p>
                <Button
                  onClick={() => navigate('/reports')}
                >
                  View Detailed Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{getWelcomeMessage()}</h1>
      
      <DashboardStats />
      
      <div className="my-6">
        {renderRoleSpecificContent()}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTickets />
        <TicketsByStatus />
      </div>
    </div>
  );
};

export default DashboardPage;