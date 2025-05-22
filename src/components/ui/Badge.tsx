import React from 'react';
import clsx from 'clsx';
import { TicketStatus, TicketSeverity } from '../../types';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-error-100 text-error-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const statusConfig: Record<TicketStatus, { variant: BadgeVariant; label: string }> = {
    [TicketStatus.NEW]: { variant: 'info', label: 'New' },
    [TicketStatus.ASSIGNED]: { variant: 'primary', label: 'Assigned' },
    [TicketStatus.IN_PROGRESS]: { variant: 'secondary', label: 'In Progress' },
    [TicketStatus.PENDING_INFO]: { variant: 'warning', label: 'Pending Info' },
    [TicketStatus.RESOLVED]: { variant: 'success', label: 'Resolved' },
    [TicketStatus.CLOSED]: { variant: 'default', label: 'Closed' },
    [TicketStatus.REOPENED]: { variant: 'danger', label: 'Reopened' },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export const SeverityBadge: React.FC<{ severity: TicketSeverity }> = ({ severity }) => {
  const severityConfig: Record<TicketSeverity, { variant: BadgeVariant; label: string }> = {
    [TicketSeverity.LOW]: { variant: 'default', label: 'Low' },
    [TicketSeverity.NORMAL]: { variant: 'info', label: 'Normal' },
    [TicketSeverity.URGENT]: { variant: 'warning', label: 'Urgent' },
    [TicketSeverity.MISSION_CRITICAL]: { variant: 'danger', label: 'Mission Critical' },
  };

  const config = severityConfig[severity];

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};

export default Badge;