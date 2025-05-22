import React from 'react';
import { TicketStatus, TicketSeverity, UserRole } from '../../types';
import { useTicketStore } from '../../store/tickets';
import { useAuthStore } from '../../store/auth';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { AlertTriangle, CheckCircle, Clock, Hourglass } from 'lucide-react';

const DashboardStats: React.FC = () => {
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
  
  // Calculate stats
  const stats = {
    total: filteredTickets.length,
    open: filteredTickets.filter(ticket => 
      ticket.status !== TicketStatus.CLOSED && 
      ticket.status !== TicketStatus.RESOLVED
    ).length,
    resolved: filteredTickets.filter(ticket => ticket.status === TicketStatus.RESOLVED).length,
    urgent: filteredTickets.filter(ticket => 
      (ticket.severity === TicketSeverity.URGENT || ticket.severity === TicketSeverity.MISSION_CRITICAL) &&
      ticket.status !== TicketStatus.CLOSED
    ).length,
  };
  
  // Stats cards
  const statCards = [
    {
      title: 'Active Tickets',
      value: stats.open,
      icon: <Clock className="h-8 w-8 text-primary-500" />,
      color: 'border-primary-500',
    },
    {
      title: 'Urgent Issues',
      value: stats.urgent,
      icon: <AlertTriangle className="h-8 w-8 text-error-500" />,
      color: 'border-error-500',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: <CheckCircle className="h-8 w-8 text-success-500" />,
      color: 'border-success-500',
    },
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: <Hourglass className="h-8 w-8 text-secondary-500" />,
      color: 'border-secondary-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index} className={`border-l-4 ${card.color}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-500">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold">{card.value}</div>
              {card.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;