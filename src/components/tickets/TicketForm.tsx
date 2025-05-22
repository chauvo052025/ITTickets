import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAuthStore } from '../../store/auth';
import { useTicketStore } from '../../store/tickets';
import { useCampusStore } from '../../store/campuses';
import { TicketSeverity } from '../../types';

const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createTicket } = useTicketStore();
  const { getAllCampuses } = useCampusStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Hardware');
  const [severity, setSeverity] = useState<TicketSeverity>(TicketSeverity.NORMAL);
  const [campusId, setCampusId] = useState(user?.campusId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const categories = [
    { value: 'Hardware', label: 'Hardware' },
    { value: 'Software', label: 'Software' },
    { value: 'Network', label: 'Network' },
    { value: 'Email', label: 'Email' },
    { value: 'Account', label: 'Account' },
    { value: 'Other', label: 'Other' },
  ];
  
  const severityOptions = Object.values(TicketSeverity).map((sev) => ({
    value: sev,
    label: sev.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0) + txt.slice(1).toLowerCase()),
  }));
  
  const campuses = getAllCampuses().map((campus) => ({
    value: campus.id,
    label: campus.name,
  }));
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!campusId) {
      newErrors.campusId = 'Campus is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const ticketId = createTicket({
        title,
        description,
        category,
        severity,
        campusId,
        createdBy: user.id,
      });
      
      // Navigate to the created ticket
      navigate(`/tickets/${ticketId}`);
    } catch (error) {
      console.error('Failed to create ticket:', error);
      setErrors({ form: 'Failed to create ticket. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Support Ticket</h2>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="bg-error-50 p-4 rounded-md flex items-start">
              <AlertCircle className="text-error-500 mr-3 mt-0.5 flex-shrink-0" size={18} />
              <p className="text-error-700 text-sm">{errors.form}</p>
            </div>
          )}
          
          <Input
            label="Ticket Title"
            placeholder="Brief summary of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
            fullWidth
            required
          />
          
          <Textarea
            label="Description"
            placeholder="Please provide as much detail as possible..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            rows={6}
            fullWidth
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categories}
              value={category}
              onChange={setCategory}
            />
            
            <Select
              label="Severity"
              options={severityOptions}
              value={severity}
              onChange={(value) => setSeverity(value as TicketSeverity)}
              helperText="Higher severity tickets receive faster attention"
            />
            
            <Select
              label="Campus"
              options={campuses}
              value={campusId}
              onChange={setCampusId}
              error={errors.campusId}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/tickets')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Create Ticket
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TicketForm;