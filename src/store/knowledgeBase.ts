import { create } from 'zustand';
import { KnowledgeArticle } from '../types';

// Mock data
const mockArticles: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'How to reset your email password',
    content: `
# Resetting Your Email Password

If you're unable to access your email, follow these steps to reset your password:

1. Go to the email login page
2. Click on "Forgot Password"
3. Enter your email address
4. Follow the instructions sent to your recovery email or phone
5. Create a new strong password

**Note:** If you don't receive a reset email within 5 minutes, check your spam folder or contact IT support.
    `,
    category: 'Email',
    tags: ['password', 'email', 'access', 'reset'],
    author: '2',
    createdAt: '2025-05-15T10:00:00Z',
    updatedAt: '2025-05-15T10:00:00Z',
    relatedTickets: ['1'],
  },
  {
    id: '2',
    title: 'Troubleshooting common printer errors',
    content: `
# Common Printer Error Codes and Solutions

## Error E-01: Paper Jam
1. Open the printer cover
2. Carefully remove any jammed paper
3. Check the paper path for torn pieces
4. Close the cover and try printing again

## Error E-02: Low Toner
1. Open the front panel
2. Remove the toner cartridge
3. Gently shake it horizontally 5-6 times to redistribute toner
4. Reinsert the cartridge
5. If error persists, replace the toner cartridge

## Error E-03: Connection Error
1. Check that the printer is powered on
2. Verify network cable is securely connected (for network printers)
3. Restart the printer
4. Restart your computer
5. Try printing a test page

For persistent errors, please contact IT support with the specific error code.
    `,
    category: 'Hardware',
    tags: ['printer', 'error', 'troubleshooting', 'hardware'],
    author: '2',
    createdAt: '2025-05-20T14:30:00Z',
    updatedAt: '2025-05-20T14:30:00Z',
    relatedTickets: ['2'],
  },
  {
    id: '3',
    title: 'Accessing shared network drives',
    content: `
# How to Access Shared Network Drives

## Windows
1. Open File Explorer
2. Click on "This PC" in the left navigation
3. Click on "Map network drive" in the Computer tab
4. Enter the network path (e.g., \\\\server\\share)
5. Check "Reconnect at sign-in" if needed
6. Click Finish

## Mac
1. Open Finder
2. Press Cmd+K or select Go > Connect to Server
3. Enter the server address (e.g., smb://server/share)
4. Click Connect
5. Enter your credentials if prompted

## Troubleshooting
- Ensure you're connected to the company network or VPN
- Verify you have correct permissions for the shared drive
- Try restarting your computer if you're having connection issues
    `,
    category: 'Network',
    tags: ['network', 'shared drive', 'access', 'storage'],
    author: '2',
    createdAt: '2025-05-25T09:15:00Z',
    updatedAt: '2025-05-25T09:15:00Z',
  },
];

interface KnowledgeBaseState {
  articles: KnowledgeArticle[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  getArticleById: (id: string) => KnowledgeArticle | undefined;
  searchArticles: (query: string) => KnowledgeArticle[];
  getArticlesByCategory: (category: string) => KnowledgeArticle[];
  getArticlesByTag: (tag: string) => KnowledgeArticle[];
  getRelatedArticles: (ticketId: string) => KnowledgeArticle[];
  addArticle: (article: Partial<KnowledgeArticle>) => void;
  updateArticle: (id: string, updates: Partial<KnowledgeArticle>) => void;
  deleteArticle: (id: string) => void;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseState>((set, get) => ({
  articles: [...mockArticles],
  isLoading: false,
  error: null,
  
  getArticleById: (id) => {
    return get().articles.find((article) => article.id === id);
  },
  
  searchArticles: (query) => {
    const lowercaseQuery = query.toLowerCase();
    return get().articles.filter((article) => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.content.toLowerCase().includes(lowercaseQuery) ||
      article.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    );
  },
  
  getArticlesByCategory: (category) => {
    return get().articles.filter((article) => article.category === category);
  },
  
  getArticlesByTag: (tag) => {
    return get().articles.filter((article) => 
      article.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );
  },
  
  getRelatedArticles: (ticketId) => {
    return get().articles.filter((article) => 
      article.relatedTickets?.includes(ticketId)
    );
  },
  
  addArticle: (articleData) => {
    const timestamp = new Date().toISOString();
    
    const newArticle: KnowledgeArticle = {
      id: String(get().articles.length + 1),
      title: articleData.title || '',
      content: articleData.content || '',
      category: articleData.category || 'General',
      tags: articleData.tags || [],
      author: articleData.author || '',
      createdAt: timestamp,
      updatedAt: timestamp,
      relatedTickets: articleData.relatedTickets,
    };
    
    set((state) => ({
      articles: [...state.articles, newArticle],
    }));
  },
  
  updateArticle: (id, updates) => {
    set((state) => ({
      articles: state.articles.map((article) => 
        article.id === id 
          ? { 
              ...article, 
              ...updates, 
              updatedAt: new Date().toISOString() 
            } 
          : article
      ),
    }));
  },
  
  deleteArticle: (id) => {
    set((state) => ({
      articles: state.articles.filter((article) => article.id !== id),
    }));
  },
}));