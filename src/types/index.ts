export enum UserRole {
  ENDUSER = 'ENDUSER',
  ITSTAFF = 'ITSTAFF',
  SUPERVISOR = 'SUPERVISOR',
  MANAGER = 'MANAGER',
}

export enum TicketStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_INFO = 'PENDING_INFO',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export enum TicketSeverity {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
  MISSION_CRITICAL = 'MISSION_CRITICAL',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  campusId: string;
  department?: string;
  position?: string;
  profileImage?: string;
}

export interface Campus {
  id: string;
  name: string;
  location: string;
  description?: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  severity: TicketSeverity;
  createdBy: string; // User ID
  assignedTo?: string; // IT Staff ID
  supervisorId?: string; // Supervisor ID
  campusId: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  dueBy?: string;
  closedAt?: string;
  isEscalated: boolean;
  confirmationRequired: boolean;
  confirmationStatus?: boolean;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  createdAt: string;
  isInternal: boolean;
  attachments?: string[];
}

export interface TicketHistory {
  id: string;
  ticketId: string;
  userId: string;
  action: string;
  timestamp: string;
  previousValue?: string;
  newValue?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  relatedTickets?: string[];
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
}