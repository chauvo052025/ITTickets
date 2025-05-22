import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import { StatusBadge, SeverityBadge } from '../ui/Badge';
import { Ticket } from '../../types';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <Link to={`/tickets/${ticket.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base truncate" title={ticket.title}>
              {ticket.title}
            </CardTitle>
            <div className="flex space-x-2">
              <StatusBadge status={ticket.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-gray-600">
          <p className="line-clamp-2 mb-3 h-10" title={ticket.description}>
            {ticket.description}
          </p>
          
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center text-gray-500">
              <Clock size={14} className="mr-1" />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <SeverityBadge severity={ticket.severity} />
              <ArrowUpRight size={14} className="text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TicketCard;