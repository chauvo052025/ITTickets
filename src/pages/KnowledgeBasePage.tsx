import React from 'react';
import KnowledgeList from '../components/knowledge/KnowledgeList';
import { useKnowledgeBaseStore } from '../store/knowledgeBase';

const KnowledgeBasePage: React.FC = () => {
  const { articles } = useKnowledgeBaseStore();
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Knowledge Base</h1>
      <KnowledgeList articles={articles} title="" />
    </div>
  );
};

export default KnowledgeBasePage;