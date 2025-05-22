import { create } from 'zustand';
import { Ticket, TicketStatus, TicketSeverity, TicketComment, TicketHistory } from '../types';
import { formatISO } from 'date-fns';

// Mock data
const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Cannot access email',
    description: 'I cannot access my email account since this morning. Getting "server not found" error.',
    status: TicketStatus.NEW,
    severity: TicketSeverity.NORMAL,
    createdBy: '1',
    campusId: '1',
    category: 'Email',
    createdAt: '2025-06-01T08:30:00Z',
    updatedAt: '2025-06-01T08:30:00Z',
    isEscalated: false,
    confirmationRequired: true,
  },
  {
    id: '2',
    title: 'Printer not working',
    description: 'The printer in the finance department is showing error code E-02 and not printing documents.',
    status: TicketStatus.ASSIGNED,
    severity: TicketSeverity.LOW,
    createdBy: '1',
    assignedTo: '2',
    campusId: '1',
    category: 'Hardware',
    createdAt: '2025-06-01T09:15:00Z',
    updatedAt: '2025-06-01T09:45:00Z',
    isEscalated: false,
    confirmationRequired: true,
  },
  {
    id: '3',
    title: 'Database server down',
    description: 'The main database server is not responding. All applications that depend on it are affected.',
    status: TicketStatus.IN_PROGRESS,
    severity: TicketSeverity.MISSION_CRITICAL,
    createdBy: '1',
    assignedTo: '2',
    supervisorId: '3',
    campusId: '1',
    category: 'Server',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:05:00Z',
    isEscalated: true,
    confirmationRequired: true,
  },
];

const mockComments: TicketComment[] = [
  {
    id: '1',
    ticketId: '2',
    userId: '2',
    content: 'I\'ll check the printer. Have you tried turning it off and on again?',
    createdAt: '2025-06-01T09:50:00Z',
    isInternal: false,
  },
  {
    id: '2',
    ticketId: '3',
    userId: '2',
    content: 'Initial diagnosis shows possible disk failure. Escalating to supervisor.',
    createdAt: '2025-06-01T10:10:00Z',
    isInternal: true,
  },
  {
    id: '3',
    ticketId: '3',
    userId: '3',
    content: 'Server team has been notified. Starting emergency recovery protocol.',
    createdAt: '2025-06-01T10:15:00Z',
    isInternal: false,
  },
];

const mockHistory: TicketHistory[] = [
  {
    id: '1',
    ticketId: '2',
    userId: '2',
    action: 'STATUS_CHANGE',
    timestamp: '2025-06-01T09:45:00Z',
    previousValue: TicketStatus.NEW,
    newValue: TicketStatus.ASSIGNED,
  },
  {
    id: '2',
    ticketId: '3',
    userId: '2',
    action: 'STATUS_CHANGE',
    timestamp: '2025-06-01T10:05:00Z',
    previousValue: TicketStatus.NEW,
    newValue: TicketStatus.IN_PROGRESS,
  },
  {
    id: '3',
    ticketId: '3',
    userId: '2',
    action: 'ESCALATION',
    timestamp: '2025-06-01T10:10:00Z',
    previousValue: 'false',
    newValue: 'true',
  },
];

interface TicketState {
  tickets: Ticket[];
  comments: TicketComment[];
  history: TicketHistory[];
  isLoading: boolean;
  error: string | null;
  
  // Ticket CRUD operations
  createTicket: (ticket: Partial<Ticket>) => string;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  assignTicket: (ticketId: string, userId: string) => void;
  escalateTicket: (ticketId: string, supervisorId: string) => void;
  resolveTicket: (ticketId: string) => void;
  closeTicket: (ticketId: string, confirmed: boolean) => void;
  reopenTicket: (ticketId: string) => void;
  
  // Comment operations
  addComment: (comment: Partial<TicketComment>) => void;
  
  // Filtering and query operations
  getTicketById: (id: string) => Ticket | undefined;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByCampus: (campusId: string) => Ticket[];
  getTicketsByStatus: (status: TicketStatus) => Ticket[];
  getTicketComments: (ticketId: string) => TicketComment[];
  getTicketHistory: (ticketId: string) => TicketHistory[];
}

export const useTicketStore = create<TicketState>((set, get) => ({
  tickets: [...mockTickets],
  comments: [...mockComments],
  history: [...mockHistory],
  isLoading: false,
  error: null,
  
  createTicket: (ticketData) => {
    const newId = String(get().tickets.length + 1);
    const timestamp = formatISO(new Date());
    
    const newTicket: Ticket = {
      id: newId,
      title: ticketData.title || '',
      description: ticketData.description || '',
      status: TicketStatus.NEW,
      severity: ticketData.severity || TicketSeverity.NORMAL,
      createdBy: ticketData.createdBy || '',
      campusId: ticketData.campusId || '',
      category: ticketData.category || 'General',
      createdAt: timestamp,
      updatedAt: timestamp,
      isEscalated: false,
      confirmationRequired: true,
    };
    
    set((state) => ({
      tickets: [...state.tickets, newTicket],
    }));
    
    // Add to history
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId: newId,
      userId: newTicket.createdBy,
      action: 'CREATED',
      timestamp,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
    
    return newId;
  },
  
  updateTicket: (id, updates) => {
    set((state) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === id ? { ...ticket, ...updates, updatedAt: formatISO(new Date()) } : ticket
      ),
    }));
    
    // Add to history
    const timestamp = formatISO(new Date());
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId: id,
      userId: updates.assignedTo || 'system',
      action: 'UPDATED',
      timestamp,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
  },
  
  assignTicket: (ticketId, userId) => {
    const timestamp = formatISO(new Date());
    
    set((state) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              assignedTo: userId, 
              status: TicketStatus.ASSIGNED, 
              updatedAt: timestamp 
            } 
          : ticket
      ),
    }));
    
    // Add to history
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId,
      userId,
      action: 'ASSIGNED',
      timestamp,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
  },
  
  escalateTicket: (ticketId, supervisorId) => {
    const timestamp = formatISO(new Date());
    
    set((state) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === ticketId 
          ? { 
              ...ticket, 
              supervisorId, 
              isEscalated: true, 
              updatedAt: timestamp 
            } 
          : ticket
      ),
    }));
    
    // Add to history
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId,
      userId: supervisorId,
      action: 'ESCALATED',
      timestamp,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
  },
  
  resolveTicket: (ticketId) => {
    const timestamp = formatISO(new Date());
    const ticket = get().tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    set((state) => ({
      tickets: state.tickets.map((t) => 
        t.id === ticketId 
          ? { 
              ...t, 
              status: TicketStatus.RESOLVED, 
              updatedAt: timestamp 
            } 
          : t
      ),
    }));
    
    // Add to history
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId,
      userId: ticket.assignedTo || 'system',
      action: 'STATUS_CHANGE',
      timestamp,
      previousValue: ticket.status,
      newValue: TicketStatus.RESOLVED,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
  },
  
  closeTicket: (ticketId, confirmed) => {
    const timestamp = formatISO(new Date());
    const ticket = get().tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    set((state) => ({
      tickets: state.tickets.map((t) => 
        t.id === ticketId 
          ? { 
              ...t, 
              status: TicketStatus.CLOSED, 
              updatedAt: timestamp,
              closedAt: timestamp,
              confirmationStatus: confirmed
            } 
          : t
      ),
    }));
    
    // Add to history
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId,
      userId: ticket.createdBy,
      action: 'CLOSED',
      timestamp,
      previousValue: ticket.status,
      newValue: TicketStatus.CLOSED,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
  },
  
  reopenTicket: (ticketId) => {
    const timestamp = formatISO(new Date());
    const ticket = get().tickets.find(t => t.id === ticketId);
    
    if (!ticket) return;
    
    set((state) => ({
      tickets: state.tickets.map((t) => 
        t.id === ticketId 
          ? { 
              ...t, 
              status: TicketStatus.REOPENED, 
              updatedAt: timestamp,
              closedAt: undefined,
              confirmationStatus: undefined
            } 
          : t
      ),
    }));
    
    // Add to history
    const historyEntry: TicketHistory = {
      id: String(get().history.length + 1),
      ticketId,
      userId: ticket.createdBy,
      action: 'REOPENED',
      timestamp,
      previousValue: ticket.status,
      newValue: TicketStatus.REOPENED,
    };
    
    set((state) => ({
      history: [...state.history, historyEntry],
    }));
  },
  
  addComment: (commentData) => {
    const timestamp = formatISO(new Date());
    
    const newComment: TicketComment = {
      id: String(get().comments.length + 1),
      ticketId: commentData.ticketId || '',
      userId: commentData.userId || '',
      content: commentData.content || '',
      createdAt: timestamp,
      isInternal: commentData.isInternal || false,
      attachments: commentData.attachments,
    };
    
    set((state) => ({
      comments: [...state.comments, newComment],
    }));
    
    // Update ticket's updatedAt
    set((state) => ({
      tickets: state.tickets.map((ticket) => 
        ticket.id === newComment.ticketId 
          ? { ...ticket, updatedAt: timestamp } 
          : ticket
      ),
    }));
  },
  
  getTicketById: (id) => {
    return get().tickets.find((ticket) => ticket.id === id);
  },
  
  getTicketsByUser: (userId) => {
    return get().tickets.filter((ticket) => 
      ticket.createdBy === userId || ticket.assignedTo === userId || ticket.supervisorId === userId
    );
  },
  
  getTicketsByCampus: (campusId) => {
    return get().tickets.filter((ticket) => ticket.campusId === campusId);
  },
  
  getTicketsByStatus: (status) => {
    return get().tickets.filter((ticket) => ticket.status === status);
  },
  
  getTicketComments: (ticketId) => {
    return get().comments.filter((comment) => comment.ticketId === ticketId);
  },
  
  getTicketHistory: (ticketId) => {
    return get().history.filter((history) => history.ticketId === ticketId);
  },
}));