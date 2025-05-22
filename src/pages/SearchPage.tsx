import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag, Calendar, Ticket } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { StatusBadge, SeverityBadge } from '../components/ui/Badge';
import { useTicketStore } from '../store/tickets';
import { useKnowledgeBaseStore } from '../store/knowledgeBase';
import { formatDistanceToNow } from 'date-fns';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { tickets } = useTicketStore();
  const { articles } = useKnowledgeBaseStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    tickets: typeof tickets;
    articles: typeof articles;
  }>({ tickets: [], articles: [] });
  
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Search tickets
    const matchedTickets = tickets.filter(ticket => 
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Search knowledge base
    const matchedArticles = articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setSearchResults({ tickets: matchedTickets, articles: matchedArticles });
    setHasSearched(true);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Search</h1>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search tickets, solutions, and knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={18} className="text-gray-400" />}
                fullWidth
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>
      
      {hasSearched && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Tickets ({searchResults.tickets.length})
            </h2>
            
            {searchResults.tickets.length > 0 ? (
              <div className="space-y-3">
                {searchResults.tickets.map((ticket) => (
                  <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 mb-2 md:mb-0">
                          <h3 className="text-base font-medium text-gray-900">{ticket.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">{ticket.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <StatusBadge status={ticket.status} />
                          <SeverityBadge severity={ticket.severity} />
                          <div className="text-xs text-gray-500 flex items-center">
                            <Ticket size={12} className="mr-1" />
                            #{ticket.id}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No matching tickets found.
                </CardContent>
              </Card>
            )}
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Knowledge Base Articles ({searchResults.articles.length})
            </h2>
            
            {searchResults.articles.length > 0 ? (
              <div className="space-y-3">
                {searchResults.articles.map((article) => (
                  <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/knowledge/${article.id}`)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                        <div className="flex-1 mb-2 md:mb-0">
                          <h3 className="text-base font-medium text-gray-900">{article.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {article.content
                              .replace(/^#+\s+.*$/gm, '')
                              .replace(/\*\*(.*?)\*\*/g, '$1')
                              .replace(/\n+/g, ' ')
                              .trim()
                              .slice(0, 150)}
                            {article.content.length > 150 ? '...' : ''}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                          <div className="flex items-center text-xs text-gray-500">
                            <Tag size={12} className="mr-1" />
                            {article.category}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            {formatDate(article.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  No matching knowledge base articles found.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
      
      {!hasSearched && (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
            <Search size={72} />
          </div>
          <h2 className="text-xl font-medium text-gray-600 mb-2">Search the Support System</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Enter keywords to find tickets, solutions, and knowledge base articles
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;