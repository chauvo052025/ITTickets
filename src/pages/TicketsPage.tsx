import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TicketPlus } from 'lucide-react';
import TicketList from '../components/tickets/TicketList';
import Button from '../components/ui/Button';
import { useTicketStore } from '../store/tickets';
import { useAuthStore } from '../store/auth';
import { UserRole } from '../types';

const TicketsPage: React.FC = () => {
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
  
  // Role-specific title
  const getPageTitle = () => {
    switch (user.role) {
      case UserRole.ENDUSER:
        return 'My Tickets';
      case UserRole.ITSTAFF:
        return 'Support Queue';
      case UserRole.SUPERVISOR:
        return 'All Tickets';
      case UserRole.MANAGER:
        return 'Ticket Management';
      default:
        return 'Tickets';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
        
        {user.role === UserRole.ENDUSER && (
          <Button
            onClick={() => navigate('/tickets/new')}
            leftIcon={<TicketPlus size={16} />}
          >
            New Ticket
          </Button>
        )}
      </div>
      
      <TicketList tickets={filteredTickets} title="" />
    </div>
  );
};

export default TicketsPage;