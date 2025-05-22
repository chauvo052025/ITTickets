import { create } from 'zustand';
import { Campus } from '../types';

// Mock data
const mockCampuses: Campus[] = [
  {
    id: '1',
    name: 'Main Campus',
    location: 'New York, NY',
    description: 'The main headquarters with 5 buildings and over 2,000 employees.',
  },
  {
    id: '2',
    name: 'West Campus',
    location: 'San Francisco, CA',
    description: 'Technology center with focus on R&D and innovation.',
  },
  {
    id: '3',
    name: 'South Campus',
    location: 'Austin, TX',
    description: 'Operations and customer support center.',
  },
  {
    id: '4',
    name: 'International Campus',
    location: 'London, UK',
    description: 'European headquarters managing international operations.',
  },
];

interface CampusState {
  campuses: Campus[];
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  getCampusById: (id: string) => Campus | undefined;
  getAllCampuses: () => Campus[];
}

export const useCampusStore = create<CampusState>((set, get) => ({
  campuses: [...mockCampuses],
  isLoading: false,
  error: null,
  
  getCampusById: (id) => {
    return get().campuses.find((campus) => campus.id === id);
  },
  
  getAllCampuses: () => {
    return get().campuses;
  },
}));