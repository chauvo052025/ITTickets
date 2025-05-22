import React, { useState } from 'react';
import { Search } from 'lucide-react';
import KnowledgeCard from './KnowledgeCard';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { KnowledgeArticle } from '../../types';

interface KnowledgeListProps {
  articles: KnowledgeArticle[];
  title?: string;
}

const KnowledgeList: React.FC<KnowledgeListProps> = ({ 
  articles, 
  title = 'Knowledge Base' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Extract unique categories
  const categories = ['all', ...new Set(articles.map(article => article.category))];
  
  const categoryOptions = categories.map(category => ({
    value: category,
    label: category === 'all' ? 'All Categories' : category,
  }));
  
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
        
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={18} className="text-gray-400" />}
              fullWidth
            />
          </div>
          
          <div>
            <Select
              options={categoryOptions}
              value={categoryFilter}
              onChange={setCategoryFilter}
              className="w-40"
            />
          </div>
        </div>
      </div>
      
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <KnowledgeCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No articles match your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeList;