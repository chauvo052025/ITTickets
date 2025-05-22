import React from 'react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { useAuthStore } from '../store/auth';
import { UserRole } from '../types';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user || user.role !== UserRole.MANAGER) {
    return <div>Access denied. You do not have permission to view this page.</div>;
  }
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">System Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure system-wide settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">System Name</h3>
                <p className="text-sm text-gray-500">IT Support Ticketing System</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Auto-Assignment</h3>
                <p className="text-sm text-gray-500">Enabled</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Email Notifications</h3>
                <p className="text-sm text-gray-500">Enabled for all users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>SLA Configuration</CardTitle>
            <CardDescription>Set response and resolution time targets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Normal Severity</h3>
                <p className="text-sm text-gray-500">Response: 30 minutes</p>
                <p className="text-sm text-gray-500">Resolution: 8 hours</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Urgent Severity</h3>
                <p className="text-sm text-gray-500">Response: 5 minutes</p>
                <p className="text-sm text-gray-500">Resolution: 2 hours</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Mission Critical</h3>
                <p className="text-sm text-gray-500">Response: 3 minutes</p>
                <p className="text-sm text-gray-500">Resolution: 1 hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Campus Management</CardTitle>
            <CardDescription>Configure campus settings and staff assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Main Campus</h3>
                <p className="text-sm text-gray-500">IT Staff: 5</p>
                <p className="text-sm text-gray-500">Supervisor: Mike Johnson</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">West Campus</h3>
                <p className="text-sm text-gray-500">IT Staff: 3</p>
                <p className="text-sm text-gray-500">Supervisor: Emily Davis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Knowledge Base Settings</CardTitle>
            <CardDescription>Configure knowledge base and search</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Auto-suggest Articles</h3>
                <p className="text-sm text-gray-500">Enabled</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">Public Access</h3>
                <p className="text-sm text-gray-500">Disabled (Authenticated users only)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Perform system maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 py-4">
              Additional management features would be available in a production environment.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;