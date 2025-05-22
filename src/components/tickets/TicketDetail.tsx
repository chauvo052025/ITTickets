import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format } from 'date-fns';
import { MessageSquare, AlertTriangle, ThumbsUp, Clock, ArrowLeft, MoreVertical, Check, XCircle, Pencil, Share2 } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import Textarea from '../ui/Textarea';
import { StatusBadge, SeverityBadge } from '../ui/Badge';
import { useTicketStore } from '../../store/tickets';
import { useAuthStore } from '../../store/auth';
import { useKnowledgeBaseStore } from '../../store/knowledgeBase';
import { TicketStatus, UserRole } from '../../types';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { getTicketById, getTicketComments, addComment, assignTicket, resolveTicket, closeTicket, reopenTicket, escalateTicket } = useTicketStore();
  const { user } = useAuthStore();
  const { getRelatedArticles } = useKnowledgeBaseStore();
  
  const [comment, setComment] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  
  if (!id || !user) {
    return <div>Invalid ticket ID or user not logged in</div>;
  }
  
  const ticket = getTicketById(id);
  const comments = getTicketComments(id);
  const relatedArticles = getRelatedArticles(id);
  
  if (!ticket) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Ticket not found</h2>
        <p className="text-gray-500 mb-4">The ticket you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/tickets')}>Back to Tickets</Button>
      </div>
    );
  }
  
  // Format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        relative: formatDistanceToNow(date, { addSuffix: true }),
        full: format(date, 'PPP p'),
      };
    } catch (error) {
      return { relative: 'Invalid date', full: 'Invalid date' };
    }
  };
  
  // Handle comment submission
  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    
    addComment({
      ticketId: id,
      userId: user.id,
      content: comment,
      isInternal: isInternalComment,
    });
    
    setComment('');
  };
  
  // Action handlers
  const handleAssignToMe = () => {
    assignTicket(id, user.id);
    setActionMenuOpen(false);
  };
  
  const handleResolveTicket = () => {
    resolveTicket(id);
    setActionMenuOpen(false);
  };
  
  const handleCloseTicket = () => {
    closeTicket(id, true);
    setActionMenuOpen(false);
  };
  
  const handleReopenTicket = () => {
    reopenTicket(id);
    setActionMenuOpen(false);
  };
  
  const handleEscalateTicket = () => {
    // In a real application, we might show a modal to select a supervisor
    escalateTicket(id, '3'); // Hardcoded supervisor ID for demo
    setActionMenuOpen(false);
  };
  
  // Check permissions
  const canAssign = user.role === UserRole.ITSTAFF || user.role === UserRole.SUPERVISOR;
  const canResolve = (user.role === UserRole.ITSTAFF || user.role === UserRole.SUPERVISOR) && 
                    (ticket.assignedTo === user.id || user.role === UserRole.SUPERVISOR);
  const canClose = user.role === UserRole.ENDUSER && ticket.createdBy === user.id && ticket.status === TicketStatus.RESOLVED;
  const canReopen = user.role === UserRole.ENDUSER && ticket.createdBy === user.id && ticket.status === TicketStatus.CLOSED;
  const canEscalate = (user.role === UserRole.ITSTAFF || user.role === UserRole.SUPERVISOR) && 
                      !ticket.isEscalated && ticket.status !== TicketStatus.CLOSED;
  
  // Determine available actions
  const availableActions = [];
  
  if (canAssign && !ticket.assignedTo) {
    availableActions.push({ label: 'Assign to me', icon: <Check size={16} />, action: handleAssignToMe });
  }
  
  if (canResolve && ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED) {
    availableActions.push({ label: 'Mark as resolved', icon: <ThumbsUp size={16} />, action: handleResolveTicket });
  }
  
  if (canClose) {
    availableActions.push({ label: 'Close ticket', icon: <Check size={16} />, action: handleCloseTicket });
  }
  
  if (canReopen) {
    availableActions.push({ label: 'Reopen ticket', icon: <XCircle size={16} />, action: handleReopenTicket });
  }
  
  if (canEscalate) {
    availableActions.push({ label: 'Escalate ticket', icon: <AlertTriangle size={16} />, action: handleEscalateTicket });
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-4">
        <button 
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to tickets
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 mb-1">{ticket.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Ticket #{ticket.id}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  <span title={formatDate(ticket.createdAt).full}>
                    {formatDate(ticket.createdAt).relative}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <StatusBadge status={ticket.status} />
              <SeverityBadge severity={ticket.severity} />
              
              {/* Action menu */}
              {availableActions.length > 0 && (
                <div className="relative">
                  <button 
                    className="p-1 rounded-full hover:bg-gray-100"
                    onClick={() => setActionMenuOpen(!actionMenuOpen)}
                  >
                    <MoreVertical size={18} className="text-gray-500" />
                  </button>
                  
                  {actionMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                      {availableActions.map((action, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={action.action}
                        >
                          <span className="mr-2">{action.icon}</span>
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="prose max-w-none">
            <p>{ticket.description}</p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Discussion</h3>
            
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => {
                  const isUserComment = comment.userId === user.id;
                  return (
                    <div 
                      key={comment.id}
                      className={`p-4 rounded-lg ${
                        comment.isInternal 
                          ? 'bg-yellow-50 border border-yellow-100' 
                          : isUserComment 
                            ? 'bg-primary-50 border border-primary-100' 
                            : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">
                          {isUserComment ? 'You' : 'Support Staff'}
                          {comment.isInternal && (
                            <span className="ml-2 text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Internal Note
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(comment.createdAt).relative}
                        </div>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet.
              </div>
            )}
            
            <div className="mt-6">
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment or update..."
                rows={4}
                fullWidth
              />
              
              {(user.role === UserRole.ITSTAFF || user.role === UserRole.SUPERVISOR) && (
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id="internal-comment"
                    checked={isInternalComment}
                    onChange={(e) => setIsInternalComment(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label htmlFor="internal-comment" className="ml-2 text-sm text-gray-600">
                    Internal note (not visible to end user)
                  </label>
                </div>
              )}
              
              <div className="mt-3 flex justify-end">
                <Button onClick={handleSubmitComment} disabled={!comment.trim()}>
                  <MessageSquare size={16} className="mr-2" />
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related resources */}
      {relatedArticles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Related Knowledge Base Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedArticles.map((article) => (
              <Card key={article.id} className="h-full">
                <CardHeader>
                  <CardTitle className="text-base">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600">
                  <p className="line-clamp-2">
                    {article.content.slice(0, 150)}...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/knowledge/${article.id}`)}
                  >
                    Read Article
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetail;