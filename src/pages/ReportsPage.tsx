import React from 'react';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TicketStatus, TicketSeverity } from '../types';
import { useTicketStore } from '../store/tickets';

const ReportsPage: React.FC = () => {
  const { tickets } = useTicketStore();
  
  // Calculate metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status !== TicketStatus.CLOSED).length;
  const closedTickets = tickets.filter(t => t.status === TicketStatus.CLOSED).length;
  
  // Tickets by severity
  const severityCounts = Object.values(TicketSeverity).reduce((acc, severity) => {
    acc[severity] = tickets.filter(t => t.severity === severity).length;
    return acc;
  }, {} as Record<string, number>);
  
  // Average resolution time (mock data for demo)
  const avgResolutionTime = {
    [TicketSeverity.LOW]: '3 days',
    [TicketSeverity.NORMAL]: '24 hours',
    [TicketSeverity.URGENT]: '4 hours',
    [TicketSeverity.MISSION_CRITICAL]: '1 hour',
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-500">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTickets}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-500">Open Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openTickets}</div>
            <div className="text-sm text-gray-500">
              {Math.round((openTickets / totalTickets) * 100)}% of total
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-gray-500">Closed Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{closedTickets}</div>
            <div className="text-sm text-gray-500">
              {Math.round((closedTickets / totalTickets) * 100)}% of total
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Severity</th>
                  <th className="text-right pb-2">Count</th>
                  <th className="text-right pb-2">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(severityCounts).map(([severity, count]) => (
                  <tr key={severity} className="border-b last:border-0">
                    <td className="py-3">{severity.replace(/_/g, ' ')}</td>
                    <td className="text-right py-3">{count}</td>
                    <td className="text-right py-3">
                      {Math.round((count / totalTickets) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Severity</th>
                  <th className="text-right pb-2">Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(avgResolutionTime).map(([severity, time]) => (
                  <tr key={severity} className="border-b last:border-0">
                    <td className="py-3">{severity.replace(/_/g, ' ')}</td>
                    <td className="text-right py-3">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Campus Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-4">
              More detailed analytics would be available in a production environment.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;