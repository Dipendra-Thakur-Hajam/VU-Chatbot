import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MessageSquare, LayoutDashboard, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Answers',
    description: 'Get instant, accurate responses to all your admission queries powered by IBM Granite.',
  },
  {
    icon: Shield,
    title: 'Reliable Information',
    description: 'RAG-based responses ensure information is sourced from official admission documents.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Designed for IBM Cloud Lite with optimized performance and low latency.',
  },
];

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-secondary-foreground">
                Powered by IBM Granite AI
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Your Smart College
              <span className="block gradient-text">Admission Assistant</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '200ms' }}>
              Get instant answers about admissions, courses, eligibility, fees, and deadlines. 
              Built with cutting-edge RAG technology for accurate, reliable information.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link to={isAuthenticated ? '/chat' : '/register'}>
                <Button size="lg" className="h-14 px-8 text-lg">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
              <span className="badge-ibm">
                ⚡ IBM Granite AI
              </span>
              <span className="badge-ibm">
                ☁️ IBM Cloud Lite Ready
              </span>
              <span className="badge-ibm">
                🎓 Education Focused
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Admission Agent?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of college admission assistance with our AI-powered platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card-elevated p-8 text-center group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-ibm-blue-dark rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Start Your Admission Journey?
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of students who found their perfect college match with our AI assistant.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={isAuthenticated ? '/chat' : '/register'}>
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Start Chatting
                  </Button>
                </Link>
                {isAuthenticated && (
                  <Link to="/dashboard">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">College Admission Agent</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Powered by IBM Granite • Designed for IBM Cloud Lite • © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
