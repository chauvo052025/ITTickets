import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TicketStatus, UserRole } from '../../types';
import { useTicketStore } from '../../store/tickets';
import { useAuthStore } from '../../store/auth';

const TicketsByStatus: React.FC = () => {
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
  
  // Count tickets by status
  const statusCounts = Object.values(TicketStatus).reduce((acc, status) => {
    acc[status] = filteredTickets.filter(ticket => ticket.status === status).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Get total for percentage calculation
  const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
  
  // Status display config
  const statusConfig = {
    [TicketStatus.NEW]: { color: 'bg-blue-500', label: 'New' },
    [TicketStatus.ASSIGNED]: { color: 'bg-purple-500', label: 'Assigned' },
    [TicketStatus.IN_PROGRESS]: { color: 'bg-secondary-500', label: 'In Progress' },
    [TicketStatus.PENDING_INFO]: { color: 'bg-warning-500', label: 'Pending Info' },
    [TicketStatus.RESOLVED]: { color: 'bg-success-500', label: 'Resolved' },
    [TicketStatus.CLOSED]: { color: 'bg-gray-500', label: 'Closed' },
    [TicketStatus.REOPENED]: { color: 'bg-error-500', label: 'Reopened' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tickets by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(statusCounts)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([status, count]) => {
              const percentage = total ? Math.round((count / total) * 100) : 0;
              const config = statusConfig[status as TicketStatus];
              
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`${config.color} h-2.5 rounded-full`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketsByStatus;