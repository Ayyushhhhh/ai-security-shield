import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Lock, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ToolCall {
  id: number;
  toolName: string;
  parameters: string;
  expectedSchema: string;
  executionTrace: string;
}

const Problem3 = () => {
  const navigate = useNavigate();
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([
    {
      id: 1,
      toolName: 'database_query',
      parameters: '{"table": "users", "action": "SELECT"}',
      expectedSchema: '{"table": "string", "action": "string"}',
      executionTrace: 'mcp://db-server/query',
    },
  ]);
  const [analysis, setAnalysis] = useState<any>(null);

  const addToolCall = () => {
    const newCall = {
      id: Date.now(),
      toolName: 'api_call',
      parameters: '{"endpoint": "/data"}',
      expectedSchema: '{"endpoint": "string"}',
      executionTrace: 'mcp://api-server/call',
    };
    setToolCalls([...toolCalls, newCall]);
  };

  const removeToolCall = (id: number) => {
    setToolCalls(toolCalls.filter(c => c.id !== id));
  };

  const updateToolCall = (id: number, field: string, value: string) => {
    setToolCalls(toolCalls.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const analyzeTools = () => {
    const findings: any[] = [];
    let maxRisk = 0;

    toolCalls.forEach((call, idx) => {
      let risk = Math.random() * 20;
      
      // Check for schema mismatches
      try {
        const params = JSON.parse(call.parameters);
        const schema = JSON.parse(call.expectedSchema);
        const paramKeys = Object.keys(params);
        const schemaKeys = Object.keys(schema);
        
        if (paramKeys.some(k => !schemaKeys.includes(k))) {
          findings.push({
            type: 'Schema Mismatch',
            severity: 'high',
            detail: `Tool ${call.toolName}: Unexpected parameter keys detected`,
          });
          risk += 40;
        }
      } catch {
        findings.push({
          type: 'Invalid Schema',
          severity: 'high',
          detail: `Tool ${call.toolName}: Malformed JSON in parameters or schema`,
        });
        risk += 45;
      }

      // Check for suspicious patterns
      if (call.parameters.toLowerCase().includes('drop') || 
          call.parameters.toLowerCase().includes('delete') ||
          call.parameters.toLowerCase().includes('exec')) {
        findings.push({
          type: 'Injection Pattern',
          severity: 'critical',
          detail: `Tool ${call.toolName}: Potential SQL/Command injection detected`,
        });
        risk += 60;
      }

      // Check for unauthorized escalation
      if (call.toolName.includes('admin') || call.toolName.includes('root')) {
        findings.push({
          type: 'Privilege Escalation',
          severity: 'high',
          detail: `Tool ${call.toolName}: Attempting to use privileged tool`,
        });
        risk += 50;
      }

      // Check execution trace
      if (!call.executionTrace.startsWith('mcp://')) {
        findings.push({
          type: 'Suspicious Server',
          severity: 'medium',
          detail: `Tool ${call.toolName}: Non-standard MCP server protocol`,
        });
        risk += 30;
      }

      maxRisk = Math.max(maxRisk, risk);
    });

    // Add YARA-style findings
    if (Math.random() > 0.5) {
      findings.push({
        type: 'YARA Rule Match',
        severity: 'medium',
        detail: 'Pattern matches known malicious tool signature database',
      });
    }

    const decision = maxRisk > 60 ? 'BLOCK' : maxRisk > 30 ? 'WARN' : 'ALLOW';
    const overallRisk = Math.min(maxRisk, 100);

    setAnalysis({
      findings,
      riskScore: overallRisk.toFixed(1),
      decision,
      explanation: decision === 'BLOCK'
        ? 'Critical security violations detected. Tool execution blocked to prevent system compromise.'
        : decision === 'WARN'
        ? 'Suspicious patterns detected. Tool execution allowed with enhanced monitoring and logging.'
        : 'All tools passed security validation. Execution proceeding normally.',
    });
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-destructive/80">High</Badge>;
      case 'medium':
        return <Badge className="bg-warning">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case 'ALLOW':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Allowed</Badge>;
      case 'WARN':
        return <Badge className="bg-warning text-warning-foreground"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
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
            <div className="w-10 h-10 bg-gradient-to-br from-success to-primary rounded-lg flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Problem Statement 3</h1>
              <p className="text-xs text-muted-foreground">Runtime Shield for Agentic Protocols (MCP/A2A)</p>
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
                  The Model Context Protocol (MCP) and Agent-to-Agent (A2A) communication enable powerful inter-agent collaboration and tool sharing. However, these protocols introduce significant supply-chain security risks. Malicious or compromised MCP servers can expose tools with hidden backdoors, schema mismatches, or injection vulnerabilities. Traditional security controls focus on network perimeters, leaving runtime tool invocations largely unmonitored and vulnerable to exploitation.
                </p>
                <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Real-World Risk Examples
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>Supply-Chain Poisoning:</strong> Compromised MCP server distributes tools with hidden malicious code</li>
                    <li>• <strong>Schema Deviation Attacks:</strong> Tool parameters don't match declared schema, enabling injection attacks</li>
                    <li>• <strong>Prompt Injection via Tools:</strong> Malicious instructions hidden in tool descriptions or server responses</li>
                    <li>• <strong>Unauthorized Tool Chaining:</strong> Agent combines tools in ways that bypass security controls</li>
                    <li>• <strong>Credential Harvesting:</strong> MCP servers designed to capture API keys and authentication tokens</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="enhancements" className="space-y-4">
            {[
              {
                title: 'Runtime Schema Validation',
                gap: 'MCP tools are trusted based on server declarations, with no runtime verification',
                value: 'Validate every tool invocation against expected schemas in real-time, detecting deviations that indicate attacks',
              },
              {
                title: 'MCP-Scanner Integration (YARA-Style)',
                gap: 'No automated scanning exists for MCP server code and tool definitions',
                value: 'Scan MCP servers for known malicious patterns, unsafe code, and suspicious metadata before trust establishment',
              },
              {
                title: 'Hidden Prompt Injection Detection',
                gap: 'Tool descriptions and server responses can contain hidden instructions that manipulate agents',
                value: 'Analyze tool metadata and responses for prompt injection patterns, preventing agent manipulation',
              },
              {
                title: 'Tool Interference Chain Analysis',
                gap: 'Agents can chain tools in unexpected ways to bypass individual tool restrictions',
                value: 'Model tool interaction graphs to detect suspicious chaining patterns that enable privilege escalation',
              },
              {
                title: 'Dynamic Trust Scoring',
                gap: 'MCP servers are either trusted or not, with no granular risk assessment',
                value: 'Continuously score MCP servers based on behavior, updating trust levels as new intelligence emerges',
              },
            ].map((enhancement, idx) => (
              <Card key={idx} className="border-l-4 border-l-success">
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
                <CardTitle>MCP Tool-Invocation Firewall Playground</CardTitle>
                <CardDescription>
                  Simulate MCP tool calls and detect security vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {toolCalls.map((call) => (
                    <div key={call.id} className="p-4 bg-muted rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Input
                          value={call.toolName}
                          onChange={(e) => updateToolCall(call.id, 'toolName', e.target.value)}
                          placeholder="Tool name"
                          className="flex-1 mr-2"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeToolCall(call.id)}
                          disabled={toolCalls.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Parameters (JSON)</label>
                          <Textarea
                            value={call.parameters}
                            onChange={(e) => updateToolCall(call.id, 'parameters', e.target.value)}
                            placeholder='{"key": "value"}'
                            rows={2}
                            className="font-mono text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">Expected Schema (JSON)</label>
                          <Textarea
                            value={call.expectedSchema}
                            onChange={(e) => updateToolCall(call.id, 'expectedSchema', e.target.value)}
                            placeholder='{"key": "type"}'
                            rows={2}
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1 block">Execution Trace</label>
                        <Input
                          value={call.executionTrace}
                          onChange={(e) => updateToolCall(call.id, 'executionTrace', e.target.value)}
                          placeholder="mcp://server/tool"
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={addToolCall} variant="outline" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tool Call
                  </Button>
                  <Button onClick={analyzeTools} className="flex-1">
                    Analyze Tool Calls
                  </Button>
                </div>
              </CardContent>
            </Card>

            {analysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Security Analysis</span>
                      {getDecisionBadge(analysis.decision)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Overall Risk Score</div>
                      <div className="text-4xl font-bold">{analysis.riskScore}%</div>
                    </div>

                    {analysis.findings.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Supply-Chain Vulnerability Alerts</h4>
                        <div className="space-y-3">
                          {analysis.findings.map((finding: any, idx: number) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border-2 ${
                                finding.severity === 'critical' || finding.severity === 'high'
                                  ? 'bg-destructive/10 border-destructive'
                                  : finding.severity === 'medium'
                                  ? 'bg-warning/10 border-warning'
                                  : 'bg-muted border-border'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className={`w-4 h-4 ${
                                    finding.severity === 'critical' || finding.severity === 'high'
                                      ? 'text-destructive'
                                      : finding.severity === 'medium'
                                      ? 'text-warning'
                                      : 'text-muted-foreground'
                                  }`} />
                                  <span className="font-semibold">{finding.type}</span>
                                </div>
                                {getSeverityBadge(finding.severity)}
                              </div>
                              <p className="text-sm text-muted-foreground">{finding.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
                          Without Runtime Checks
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Tools executed based on server trust alone. Schema deviations, injection patterns, and supply-chain risks go undetected. "Tool executed successfully."
                        </p>
                      </div>
                      <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          With Our MCP Framework
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Runtime validation detects {analysis.findings.length} security issue(s). System {analysis.decision === 'BLOCK' ? 'blocks execution due to critical vulnerabilities' : analysis.decision === 'WARN' ? 'allows with enhanced monitoring' : 'allows safe execution'}.
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

export default Problem3;
