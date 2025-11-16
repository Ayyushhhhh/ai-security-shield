import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Network, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AgentStep {
  id: number;
  step: number;
  tool: string;
  arguments: string;
  timeGap: string;
  credential: string;
  riskScore?: number;
}

const Problem2 = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState<AgentStep[]>([
    { id: 1, step: 1, tool: 'read_file', arguments: 'config.json', timeGap: '0.2s', credential: 'user_token' },
    { id: 2, step: 2, tool: 'api_call', arguments: 'GET /data', timeGap: '0.5s', credential: 'user_token' },
    { id: 3, step: 3, tool: 'write_file', arguments: 'output.txt', timeGap: '0.3s', credential: 'user_token' },
  ]);
  const [analysis, setAnalysis] = useState<any>(null);

  const addStep = () => {
    const newStep = {
      id: Date.now(),
      step: steps.length + 1,
      tool: 'read_file',
      arguments: 'file.txt',
      timeGap: '0.1s',
      credential: 'user_token',
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter(s => s.id !== id));
  };

  const updateStep = (id: number, field: string, value: string) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const analyzeSequence = () => {
    // Mock analysis
    const stepsWithRisk = steps.map((step, idx) => {
      let risk = Math.random() * 30;
      
      // Increase risk for suspicious patterns
      if (step.tool === 'execute_command' || step.tool === 'modify_permissions') {
        risk += 40;
      }
      if (step.credential === 'admin_token' && idx > 0 && steps[idx - 1].credential !== 'admin_token') {
        risk += 30;
      }
      if (parseFloat(step.timeGap) > 2) {
        risk += 20;
      }
      
      return { ...step, riskScore: Math.min(risk, 100) };
    });

    const maxRisk = Math.max(...stepsWithRisk.map(s => s.riskScore || 0));
    const suspiciousStep = stepsWithRisk.find(s => (s.riskScore || 0) > 60);
    
    const decision = maxRisk > 70 ? 'HUMAN_REVIEW' : maxRisk > 40 ? 'SANDBOX' : 'ALLOW';
    
    setAnalysis({
      steps: stepsWithRisk,
      sequenceLikelihood: (100 - maxRisk * 0.5).toFixed(1),
      causalScore: (80 - maxRisk * 0.3).toFixed(1),
      driftScore: maxRisk.toFixed(1),
      decision,
      rootCause: suspiciousStep 
        ? `Step ${suspiciousStep.step}: Unusual ${suspiciousStep.tool} execution with ${suspiciousStep.credential}. Pattern deviates from expected agent behavior.`
        : 'All steps within normal parameters. No significant anomalies detected.',
      explanation: decision === 'HUMAN_REVIEW'
        ? 'High-risk sequence detected. Requires human oversight before execution.'
        : decision === 'SANDBOX'
        ? 'Moderate risk detected. Executing in isolated sandbox environment.'
        : 'Sequence appears normal. Proceeding with standard execution.',
    });
  };

  const getRiskColor = (risk: number) => {
    if (risk > 60) return 'bg-destructive/20 border-destructive';
    if (risk > 30) return 'bg-warning/20 border-warning';
    return 'bg-success/20 border-success';
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Allowed</Badge>;
      case 'SANDBOX':
        return <Badge className="bg-warning text-warning-foreground"><AlertTriangle className="w-3 h-3 mr-1" />Sandbox</Badge>;
      case 'HUMAN_REVIEW':
        return <Badge className="bg-destructive text-destructive-foreground"><XCircle className="w-3 h-3 mr-1" />Human Review</Badge>;
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
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-success rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Problem Statement 2</h1>
              <p className="text-xs text-muted-foreground">Agent Behavioral Anomaly Detection</p>
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
                  Autonomous AI agents operate with increasing independence, making tool calls and accessing resources with minimal human oversight. While this enables powerful automation, it creates security blind spots. Traditional monitoring focuses on individual actions, missing the subtle patterns of malicious behavior that emerge across sequences of tool calls. A compromised or misaligned agent can exploit this gap to perform unauthorized actions that appear normal in isolation.
                </p>
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Real-World Risk Examples
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Credential Escalation:</strong> Agent gradually escalates privileges through seemingly innocent tool calls</li>
                    <li>• <strong>Data Exfiltration Chain:</strong> Multi-step sequence to read sensitive data, encode it, and send externally</li>
                    <li>• <strong>Backdoor Installation:</strong> Agent modifies system configurations in ways that enable future unauthorized access</li>
                    <li>• <strong>Resource Abuse:</strong> Unusual patterns of API calls that indicate cryptomining or DDoS participation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enhancements" className="space-y-4">
            {[
              {
                title: 'Causal Chain Analysis (CDT-Lite)',
                gap: 'Current systems evaluate each action independently, missing causal relationships between steps',
                value: 'Detect suspicious multi-step sequences by analyzing causal dependencies and identifying non-obvious attack chains',
              },
              {
                title: 'Tool-Call Semantics Scoring',
                gap: 'No standardized way to measure if tool usage patterns match legitimate agent behavior',
                value: 'Quantify how well tool call sequences align with expected semantic patterns, flagging anomalous combinations',
              },
              {
                title: 'Temporal Anomaly Detection',
                gap: 'Time-based patterns in agent behavior are typically ignored',
                value: 'Identify suspicious timing patterns like unusually long delays that may indicate human-in-the-loop attacks',
              },
              {
                title: 'Credential Flow Tracing',
                gap: 'Privilege escalation often goes unnoticed when it happens gradually',
                value: 'Track credential usage across action sequences, detecting unauthorized privilege elevation attempts',
              },
              {
                title: 'Behavioral Drift Trajectory',
                gap: 'Agents can slowly drift from intended behavior without triggering alarms',
                value: 'Monitor agent behavior over time, detecting gradual shifts that indicate compromise or misalignment',
              },
            ].map((enhancement, idx) => (
              <Card key={idx} className="border-l-4 border-l-accent">
                <CardHeader>
                  <CardTitle className="text-lg">{enhancement.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">The Gap</Badge>
                    <p className="text-sm text-muted-foreground">{enhancement.gap}</p>
                  </div>
                  <div>
                    <Badge className="bg-success text-success-foreground mb-2">Our Value</Badge>
                    <p className="text-sm font-medium">{enhancement.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Action Sequence Anomaly Simulator</CardTitle>
                <CardDescription>
                  Simulate agent tool call sequences and detect behavioral anomalies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {steps.map((step) => (
                    <div key={step.id} className="grid grid-cols-6 gap-2 items-center p-3 bg-muted rounded-lg">
                      <Input 
                        value={step.step} 
                        disabled 
                        className="text-center"
                      />
                      <Select value={step.tool} onValueChange={(v) => updateStep(step.id, 'tool', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="read_file">read_file</SelectItem>
                          <SelectItem value="write_file">write_file</SelectItem>
                          <SelectItem value="api_call">api_call</SelectItem>
                          <SelectItem value="execute_command">execute_command</SelectItem>
                          <SelectItem value="modify_permissions">modify_permissions</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        value={step.arguments} 
                        onChange={(e) => updateStep(step.id, 'arguments', e.target.value)}
                        placeholder="args"
                      />
                      <Input 
                        value={step.timeGap} 
                        onChange={(e) => updateStep(step.id, 'timeGap', e.target.value)}
                        placeholder="0.1s"
                      />
                      <Select value={step.credential} onValueChange={(v) => updateStep(step.id, 'credential', v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user_token">user_token</SelectItem>
                          <SelectItem value="admin_token">admin_token</SelectItem>
                          <SelectItem value="service_token">service_token</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeStep(step.id)}
                        disabled={steps.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={addStep} variant="outline" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Step
                  </Button>
                  <Button onClick={analyzeSequence} className="flex-1">
                    Analyze Sequence
                  </Button>
                </div>
              </CardContent>
            </Card>

            {analysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Anomaly Analysis</span>
                      {getDecisionBadge(analysis.decision)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Sequence Likelihood</div>
                        <div className="text-2xl font-bold">{analysis.sequenceLikelihood}%</div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Causal Chain Score</div>
                        <div className="text-2xl font-bold">{analysis.causalScore}%</div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Drift Score</div>
                        <div className="text-2xl font-bold">{analysis.driftScore}%</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Action Timeline with Risk Heatmap</h4>
                      <div className="space-y-2">
                        {analysis.steps.map((step: AgentStep) => (
                          <div 
                            key={step.id} 
                            className={`p-3 rounded-lg border-2 ${getRiskColor(step.riskScore || 0)}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline">Step {step.step}</Badge>
                                <span className="font-mono text-sm">{step.tool}</span>
                                <span className="text-sm text-muted-foreground">{step.arguments}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge variant="secondary">{step.credential}</Badge>
                                <Badge className={
                                  (step.riskScore || 0) > 60 ? 'bg-destructive' : 
                                  (step.riskScore || 0) > 30 ? 'bg-warning' : 'bg-success'
                                }>
                                  Risk: {step.riskScore?.toFixed(0)}%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        Root Cause Capsule
                      </h4>
                      <p className="text-sm">{analysis.rootCause}</p>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Decision Explanation</h4>
                      <p className="text-sm">{analysis.explanation}</p>
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
                          Without Our Sequence Modeling
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Each action evaluated independently. Multi-step attack chains go undetected. "Everything looks normal" until damage is done.
                        </p>
                      </div>
                      <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          With Our Causal Analysis
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Suspicious patterns detected across action sequences. Root cause identified. System automatically {analysis.decision === 'HUMAN_REVIEW' ? 'escalates to human review' : analysis.decision === 'SANDBOX' ? 'isolates execution' : 'allows safe operation'}.
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

export default Problem2;
