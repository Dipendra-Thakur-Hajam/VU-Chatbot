import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import AuthForm from '@/components/Auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/chat';

  const handleSubmit = async (data: { email: string; password: string }) => {
    setError('');
    const success = await login(data.email, data.password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary to-ibm-blue-dark p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-primary-foreground">
              College Admission Agent
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
            Your AI-Powered
            <br />
            Admission Assistant
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Get instant answers about admissions, courses, fees, eligibility, and deadlines. 
            Powered by IBM Granite AI technology.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="badge-ibm bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              ⚡ IBM Granite AI
            </span>
            <span className="badge-ibm bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30">
              ☁️ IBM Cloud Lite
            </span>
          </div>
        </div>

        <p className="relative z-10 text-sm text-primary-foreground/60">
          © 2025 College Admission Agent. All rights reserved.
        </p>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">
              College Admission Agent
            </span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">
            Sign in to access your admission assistant
          </p>

          <AuthForm mode="login" onSubmit={handleSubmit} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Login;
