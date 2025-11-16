import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogOut, Brain, Network, Lock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const problemStatements = [
    {
      id: 1,
      title: 'Runtime Shield for Fine-Tuned LLMs',
      description: 'Detect drift, leakage, and anomalies in fine-tuned language models with real-time monitoring and protection.',
      icon: Brain,
      route: '/problem-1',
      gradient: 'from-primary to-accent',
    },
    {
      id: 2,
      title: 'Agent Behavioral Anomaly Detection',
      description: 'Monitor autonomous AI agents for suspicious action sequences, credential misuse, and causal chain anomalies.',
      icon: Network,
      route: '/problem-2',
      gradient: 'from-accent to-success',
    },
    {
      id: 3,
      title: 'Runtime Shield for Agentic Protocols',
      description: 'Secure MCP and A2A communications with schema validation, injection detection, and supply-chain analysis.',
      icon: Lock,
      route: '/problem-3',
      gradient: 'from-success to-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Security Runtime Shield</h1>
              <p className="text-xs text-muted-foreground">Interactive Demo Platform</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Security Problem Statements</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive security enhancements for AI systems. Each module includes interactive demos showing real-world protection scenarios.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {problemStatements.map((problem) => {
              const Icon = problem.icon;
              return (
                <Card
                  key={problem.id}
                  className="cursor-pointer transition-all hover:shadow-card hover:-translate-y-1 border-2 hover:border-primary"
                  onClick={() => navigate(problem.route)}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl">{problem.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {problem.description}
                    </CardDescription>
                    <Button className="w-full mt-6" variant="outline">
                      Explore Demo
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
