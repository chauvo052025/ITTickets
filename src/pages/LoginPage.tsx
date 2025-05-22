import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LifeBuoy, Lock, User } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-700 mb-4">
            <LifeBuoy size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">IT Support Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to access your support tickets</p>
        </div>
        
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-error-50 text-error-700 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<User size={18} className="text-gray-400" />}
                fullWidth
                required
              />
              
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={18} className="text-gray-400" />}
                helperText="Use 'password' for the demo"
                fullWidth
                required
              />
              
              <div className="pt-2">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  fullWidth
                >
                  Sign In
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>For demo purposes, use these accounts:</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-gray-600">
                  <div>
                    <p><strong>End User:</strong></p>
                    <p>john.doe@example.com</p>
                  </div>
                  <div>
                    <p><strong>IT Staff:</strong></p>
                    <p>jane.smith@example.com</p>
                  </div>
                  <div>
                    <p><strong>Supervisor:</strong></p>
                    <p>mike.johnson@example.com</p>
                  </div>
                  <div>
                    <p><strong>Manager:</strong></p>
                    <p>sarah.williams@example.com</p>
                  </div>
                </div>
                <p className="mt-2">Password for all: "password"</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;