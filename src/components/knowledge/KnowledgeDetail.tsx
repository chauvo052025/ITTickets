import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useKnowledgeBaseStore } from '../../store/knowledgeBase';
import { useAuthStore } from '../../store/auth';
import { UserRole } from '../../types';

// Simple markdown parser (for demo purposes)
const parseMarkdown = (markdown: string) => {
  let html = markdown
    // Headers
    .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-5 mb-3">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Lists
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal mb-1">$1</li>')
    .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc mb-1">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-3">')
    // Notes
    .replace(/\*\*Note:\*\* (.*)/g, '<div class="bg-blue-50 p-3 rounded my-3 text-blue-800"><strong>Note:</strong> $1</div>');
  
  // Wrap in paragraph if not already wrapped
  if (!html.startsWith('<h') && !html.startsWith('<p')) {
    html = `<p class="my-3">${html}</p>`;
  }
  
  return html;
};

const KnowledgeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { getArticleById } = useKnowledgeBaseStore();
  const { user } = useAuthStore();
  
  if (!id) {
    return <div>Invalid article ID</div>;
  }
  
  const article = getArticleById(id);
  
  if (!article) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium text-gray-900 mb-2">Article not found</h2>
        <p className="text-gray-500 mb-4">The article you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/knowledge')}>Back to Knowledge Base</Button>
      </div>
    );
  }
  
  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Check if user can edit
  const canEdit = user && (user.role === UserRole.ITSTAFF || user.role === UserRole.SUPERVISOR || user.role === UserRole.MANAGER);

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-4">
        <button 
          onClick={() => navigate('/knowledge')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to knowledge base
        </button>
      </div>
      
      <Card className="overflow-visible">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag, index) => (
              <Badge key={index} variant="primary" className="text-xs">
                <Tag size={12} className="mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>Updated {formatDate(article.updatedAt)}</span>
            </div>
            <div className="flex items-center">
              <User size={14} className="mr-1" />
              <span>IT Support</span>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(article.content) }}
          />
          
          {canEdit && (
            <div className="mt-8 pt-4 border-t flex justify-end">
              <Button
                variant="outline"
                leftIcon={<Tag size={16} />}
                onClick={() => {
                  // In a real app, navigate to edit page
                  alert('Edit functionality would be implemented in a real application.');
                }}
              >
                Edit Article
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeDetail;