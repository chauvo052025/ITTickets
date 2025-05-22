import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Tag } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import { KnowledgeArticle } from '../../types';

interface KnowledgeCardProps {
  article: KnowledgeArticle;
}

const KnowledgeCard: React.FC<KnowledgeCardProps> = ({ article }) => {
  return (
    <Link to={`/knowledge/${article.id}`}>
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start space-x-2">
            <Book size={18} className="text-primary-500 flex-shrink-0 mt-0.5" />
            <CardTitle className="text-base">{article.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
            {article.content
              .replace(/^#+\s+.*$/gm, '') // Remove markdown headings
              .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
              .replace(/\n+/g, ' ') // Replace newlines with spaces
              .trim()
              .slice(0, 150)}
            {article.content.length > 150 ? '...' : ''}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="default" className="text-xs">
                <Tag size={10} className="mr-1" />
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="default" className="text-xs">
                +{article.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default KnowledgeCard;