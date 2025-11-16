import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Problem1 = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [modelType, setModelType] = useState('base');
  const [result, setResult] = useState<any>(null);

  const analyzePrompt = () => {
    // Mock analysis logic
    const isFineTuned = modelType === 'fine-tuned';
    const driftScore = isFineTuned ? Math.random() * 40 + 30 : Math.random() * 15;
    const leakageScore = isFineTuned ? Math.random() * 60 + 20 : Math.random() * 10;
    const toxicitySpike = isFineTuned ? Math.random() * 50 + 25 : Math.random() * 10;
    const perplexityDelta = isFineTuned ? Math.random() * 45 + 20 : Math.random() * 15;
    
    const decision = isFineTuned && (driftScore > 40 || leakageScore > 50) 
      ? 'BLOCK' 
      : isFineTuned && (driftScore > 25 || leakageScore > 30)
      ? 'ROUTE_TO_BASE'
      : 'ALLOW';

    setResult({
      driftScore: driftScore.toFixed(1),
      leakageScore: leakageScore.toFixed(1),
      toxicitySpike: toxicitySpike.toFixed(1),
      perplexityDelta: perplexityDelta.toFixed(1),
      decision,
      divergentTokens: isFineTuned ? ['confidential', 'internal', 'proprietary'] : [],
      explanation: decision === 'BLOCK' 
        ? 'High drift and potential data leakage detected. Fine-tuned model showing suspicious behavior.'
        : decision === 'ROUTE_TO_BASE'
        ? 'Moderate drift detected. Routing to base model for safety.'
        : 'Model output within safe parameters.',
    });
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Allowed</Badge>;
      case 'ROUTE_TO_BASE':
        return <Badge className="bg-warning text-warning-foreground"><AlertTriangle className="w-3 h-3 mr-1" />Route to Base</Badge>;
      case 'BLOCK':
        return <Badge className="bg-destructive text-destructive-foreground"><XCircle className="w-3 h-3 mr-1" />Blocked</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Problem Statement 1</h1>
              <p className="text-xs text-muted-foreground">Runtime Shield for Fine-Tuned LLMs</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="enhancements">Our Enhancements</TabsTrigger>
            <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>What This Problem Statement Addresses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-relaxed">
                  Fine-tuned LLMs are increasingly deployed in production, but they pose unique security risks. When models are fine-tuned on proprietary or sensitive data, they can inadvertently leak information, drift from their intended behavior, or be poisoned by malicious training data. Traditional security measures can't detect these subtle model-level anomalies that occur at inference time.
                </p>
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Real-World Risk Examples
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Data Leakage:</strong> Model trained on customer data accidentally reveals PII in responses</li>
                    <li>• <strong>Model Drift:</strong> Fine-tuned model deviates from safety guidelines learned during base training</li>
                    <li>• <strong>Backdoor Attacks:</strong> Poisoned training data causes model to behave maliciously on specific triggers</li>
                    <li>• <strong>Toxicity Injection:</strong> Model becomes more biased or toxic after fine-tuning process</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enhancements" className="space-y-4">
            {[
              {
                title: 'Real-Time Drift Detection',
                gap: 'No existing tools monitor semantic drift between base and fine-tuned models at inference time',
                value: 'Detect when fine-tuned responses diverge from base model behavior, preventing unintended behavior before it reaches users',
              },
              {
                title: 'Canary Token Leakage Detection',
                gap: 'Training data leakage is difficult to detect without knowing what data was in the training set',
                value: 'Automatically identify potential data leakage by detecting patterns characteristic of training data memorization',
              },
              {
                title: 'Token-Level Divergence Analysis',
                gap: 'Current systems evaluate entire responses, missing subtle token-level anomalies',
                value: 'Highlight specific tokens where fine-tuned model deviates, enabling precise identification of problematic outputs',
              },
              {
                title: 'Adaptive Routing Intelligence',
                gap: 'Binary allow/block decisions are too rigid for production systems',
                value: 'Intelligently route suspicious queries to base model while allowing safe fine-tuned responses, balancing security and performance',
              },
              {
                title: 'Perplexity-Based Anomaly Scoring',
                gap: 'No standardized metrics exist for measuring fine-tuned model safety',
                value: 'Use perplexity delta as a quantifiable metric for detecting unusual model behavior and potential security issues',
              },
            ].map((enhancement, idx) => (
              <Card key={idx} className="border-l-4 border-l-primary">
                <CardHeader>
                  <CardTitle className="text-lg">{enhancement.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">The Gap</Badge>
                    <p className="text-sm text-muted-foreground">{enhancement.gap}</p>
                  </div>
                  <div>
                    <Badge className="bg-accent text-accent-foreground mb-2">Our Value</Badge>
                    <p className="text-sm font-medium">{enhancement.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fine-Tune Drift & Leakage Detector Sandbox</CardTitle>
                <CardDescription>
                  Test how our runtime shield detects anomalies in fine-tuned model outputs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Test Prompt</label>
                  <Textarea
                    placeholder="Enter a prompt to test (e.g., 'Tell me about your training data')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Model Type</label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base">Base Model Output (Simulated)</SelectItem>
                      <SelectItem value="fine-tuned">Fine-Tuned Model Output (Simulated)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={analyzePrompt} disabled={!prompt} className="w-full">
                  Analyze Output
                </Button>
              </CardContent>
            </Card>

            {result && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Analysis Results</span>
                      {getDecisionBadge(result.decision)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Drift Score</span>
                          <span className="font-mono">{result.driftScore}%</span>
                        </div>
                        <Progress value={parseFloat(result.driftScore)} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Leakage Score</span>
                          <span className="font-mono">{result.leakageScore}%</span>
                        </div>
                        <Progress value={parseFloat(result.leakageScore)} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Toxicity Spike</span>
                          <span className="font-mono">{result.toxicitySpike}%</span>
                        </div>
                        <Progress value={parseFloat(result.toxicitySpike)} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Perplexity Delta</span>
                          <span className="font-mono">{result.perplexityDelta}%</span>
                        </div>
                        <Progress value={parseFloat(result.perplexityDelta)} className="h-2" />
                      </div>
                    </div>
                    
                    {result.divergentTokens.length > 0 && (
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="text-sm font-semibold mb-2">Token-Level Divergence</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.divergentTokens.map((token: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="bg-destructive/10 border-destructive">
                              {token}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Decision Explanation</h4>
                      <p className="text-sm">{result.explanation}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Value Comparison</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-destructive" />
                          Without Our Enhancement
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Request processed normally. Potential data leakage or model drift goes undetected. Users receive potentially unsafe or leaked information.
                        </p>
                      </div>
                      <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          With Our Enhancement
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Real-time analysis detects anomalies. System automatically {result.decision === 'BLOCK' ? 'blocks unsafe content' : result.decision === 'ROUTE_TO_BASE' ? 'routes to secure base model' : 'allows safe response'}. Users protected from model-level vulnerabilities.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Problem1;
