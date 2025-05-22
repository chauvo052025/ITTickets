import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import TicketCard from './TicketCard';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { TicketStatus, TicketSeverity, Ticket } from '../../types';

interface TicketListProps {
  tickets: Ticket[];
  title?: string;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, title = 'Tickets' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    ...Object.values(TicketStatus).map((status) => ({
      value: status,
      label: status.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0) + txt.slice(1).toLowerCase()),
    })),
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    ...Object.values(TicketSeverity).map((severity) => ({
      value: severity,
      label: severity.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0) + txt.slice(1).toLowerCase()),
    })),
  ];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = searchTerm === '' || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || ticket.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} className="text-gray-400" />}
              fullWidth
            />
          </div>
          
          <div className="flex gap-3">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
              leftIcon={<Filter size={18} className="text-gray-400" />}
              className="w-40"
            />
            
            <Select
              options={severityOptions}
              value={severityFilter}
              onChange={setSeverityFilter}
              className="w-40"
            />
          </div>
        </div>
      </div>
      
      {filteredTickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No tickets match your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TicketList;