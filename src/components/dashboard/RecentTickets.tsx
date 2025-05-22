import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { useTicketStore } from '../../store/tickets';
import { useAuthStore } from '../../store/auth';
import { UserRole } from '../../types';

const RecentTickets: React.FC = () => {
  const navigate = useNavigate();
  const { tickets } = useTicketStore();
  const { user } = useAuthStore();
  
  if (!user) return null;
  
  // Filter tickets based on user role
  const filteredTickets = (() => {
    switch (user.role) {
      case UserRole.ENDUSER:
        return tickets.filter(ticket => ticket.createdBy === user.id);
      case UserRole.ITSTAFF:
        return tickets.filter(ticket => ticket.assignedTo === user.id || !ticket.assignedTo);
      case UserRole.SUPERVISOR:
      case UserRole.MANAGER:
        return tickets;
      default:
        return [];
    }
  })();
  
  // Sort by most recent and take first 5
  const recentTickets = [...filteredTickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Recent Tickets</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/tickets')}
        >
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {recentTickets.length > 0 ? (
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {ticket.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated {formatDate(ticket.updatedAt)}
                  </p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No tickets found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTickets;