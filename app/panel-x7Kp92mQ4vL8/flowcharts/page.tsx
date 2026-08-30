'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Save, Loader2, Undo, Redo, ZoomIn, ZoomOut, RotateCcw, Bot, Sparkles, Trash2, Copy, Minus, Maximize2, PanTool } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ReactFlow,
  addEdge,
  Connection,
  NodeTypes,
  EdgeTypes,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const nodeTypes: Record<string, string> = {
  project: 'Project',
  feature: 'Feature',
  task: 'Task',
  milestone: 'Milestone',
  bug: 'Bug',
  idea: 'Idea',
  service: 'Service',
  database: 'Database',
  api: 'API',
  frontend: 'Frontend',
  backend: 'Backend',
  infrastructure: 'Infrastructure',
  file: 'File',
  note: 'Note',
};

const nodeTypeColors: Record<string, string> = {
  project: 'bg-purple-500/20 border-purple-500',
  feature: 'bg-blue-500/20 border-blue-500',
  task: 'bg-green-500/20 border-green-500',
  milestone: 'bg-yellow-500/20 border-yellow-500',
  bug: 'bg-red-500/20 border-red-500',
  idea: 'bg-pink-500/20 border-pink-500',
  service: 'bg-indigo-500/20 border-indigo-500',
  database: 'bg-orange-500/20 border-orange-500',
  api: 'bg-teal-500/20 border-teal-500',
  frontend: 'bg-cyan-500/20 border-cyan-500',
  backend: 'bg-violet-500/20 border-violet-500',
  infrastructure: 'bg-amber-500/20 border-amber-500',
  file: 'bg-slate-500/20 border-slate-500',
  note: 'bg-lime-500/20 border-lime-500',
};

const initialNodes: Node[] = [
  { id: '1', type: 'custom', position: { x: 250, y: 50 }, data: { label: 'VexPanel', type: 'project', description: 'Minecraft hosting panel', status: 'DEVELOPMENT', priority: 'HIGH' } },
  { id: '2', type: 'custom', position: { x: 100, y: 200 }, data: { label: 'Authentication', type: 'feature', description: 'Rotating secret key auth', status: 'DONE', priority: 'HIGH' } },
  { id: '3', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Billing', type: 'feature', description: 'Plans, orders, payments', status: 'IN_PROGRESS', priority: 'HIGH' } },
  { id: '4', type: 'custom', position: { x: 400, y: 200 }, data: { label: 'Pterodactyl API', type: 'service', description: 'Server creation & management', status: 'TODO', priority: 'HIGH' } },
  { id: '5', type: 'custom', position: { x: 550, y: 200 }, data: { label: 'Discord Notifications', type: 'feature', description: 'Webhook integration', status: 'TODO', priority: 'NORMAL' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: true },
  { id: 'e1-5', source: '1', target: '5', animated: true },
];

function CustomNode({ data, selected, onClick }: { data: any; selected: boolean; onClick: () => void }) {
  const color = nodeTypeColors[data.type] || 'bg-muted border-border';
  return (
    <div
      className={cn(
        'rounded-lg border-2 p-3 min-w-[180px] max-w-[250px] transition-all cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        color,
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
      onClick={onClick}
      onDoubleClick={onClick}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-primary" />
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-background/50 text-muted-foreground uppercase">
              {nodeTypes[data.type] || data.type}
            </span>
            {data.status && (
              <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-background/50 text-muted-foreground">
                {data.status}
              </span>
            )}
          </div>
          <h4 className="mt-1 font-semibold truncate">{data.label}</h4>
          {data.description && <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{data.description}</p>}
          {data.priority && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-background/50 text-muted-foreground">
                {data.priority}
              </span>
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-primary" />
    </div>
  );
}

const customNodeTypes: NodeTypes = {
  custom: CustomNode,
};

const customEdgeTypes: EdgeTypes = {
  default: ({ data }) => (
    <path
      strokeWidth={2}
      stroke={data?.animated ? 'hsl(var(--primary))' : 'hsl(var(--border))'}
      strokeDasharray={data?.animated ? '5,5' : 'none'}
      markerEnd={MarkerType.ArrowClosed}
    />
  ),
};

export default function AdminFlowchartsPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <FlowchartsContent />;
}

function FlowchartsContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showAIPanel, setShowAIPanel] = React.useState(false);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [aiLoading, setAiLoading] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState<Node | null>(null);
  const [showNodeEditor, setShowNodeEditor] = React.useState(false);
  const reactFlowInstance = useReactFlow();

  const handleConnect = (params: Connection) => setEdges((eds) => addEdge(params, eds));

  const handleNodeClick = (_, node: Node) => {
    setSelectedNode(node);
    setShowNodeEditor(true);
  };

  const handlePaneClick = () => {
    setSelectedNode(null);
    setShowNodeEditor(false);
  };

  const addNode = (type: string) => {
    const viewport = reactFlowInstance.getViewport();
    const center = reactFlowInstance.projectToViewport({ x: viewport.width / 2, y: viewport.height / 2 });
    
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position: center,
      data: { label: nodeTypes[type] || 'New Node', type, description: '', status: 'TODO', priority: 'NORMAL' },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteSelected = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      setShowNodeEditor(false);
    }
  };

  const duplicateSelected = () => {
    if (selectedNode) {
      const viewport = reactFlowInstance.getViewport();
      const pos = reactFlowInstance.projectToViewport({ 
        x: selectedNode.position.x + 50, 
        y: selectedNode.position.y + 50 
      });
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: 'custom',
        position: pos,
        data: { ...selectedNode.data, label: `${selectedNode.data.label} (copy)` },
      };
      setNodes((nds) => [...nds, newNode]);
    }
  };

  const fitView = () => reactFlowInstance.fitView({ padding: 0.1, duration: 300 });

  const zoomIn = () => reactFlowInstance.zoomIn();
  const zoomOut = () => reactFlowInstance.zoomOut();

  const undo = () => {}; // Would need history plugin
  const redo = () => {};

  const saveFlowchart = async () => {
    // Save to API
    console.log('Saving:', { nodes, edges });
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    
    // Mock AI response - in reality this would call an AI API
    const mockNodes: Node[] = [
      { id: `ai-${Date.now()}-1`, type: 'custom', position: { x: 100, y: 400 }, data: { label: 'Project', type: 'project', description: 'Generated from AI', status: 'IDEA', priority: 'HIGH' } },
      { id: `ai-${Date.now()}-2`, type: 'custom', position: { x: 100, y: 550 }, data: { label: 'Authentication', type: 'feature', description: 'Login, registration, permissions', status: 'TODO', priority: 'HIGH' } },
      { id: `ai-${Date.now()}-3`, type: 'custom', position: { x: 100, y: 700 }, data: { label: 'Database', type: 'database', description: 'PostgreSQL with Prisma', status: 'TODO', priority: 'HIGH' } },
    ];
    
    const mockEdges: Edge[] = [
      { id: `e-${Date.now()}-1`, source: mockNodes[0].id, target: mockNodes[1].id, animated: true },
      { id: `e-${Date.now()}-2`, source: mockNodes[0].id, target: mockNodes[2].id, animated: true },
    ];
    
    setNodes(nds => [...nds, ...mockNodes]);
    setEdges(eds => [...eds, ...mockEdges]);
    
    setAiLoading(false);
    setAiPrompt('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Flowcharts</h1>
          <Tabs value="default" className="ml-4">
            <TabsList>
              <TabsTrigger value="vexpanel">VexPanel</TabsTrigger>
              <TabsTrigger value="new">+ New Flowchart</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={undo} title="Undo"><Undo className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={redo} title="Redo"><Redo className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={fitView} title="Fit View"><Maximize2 className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={zoomOut} title="Zoom Out"><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={zoomIn} title="Zoom In"><ZoomIn className="h-4 w-4" /></Button>
          <Button variant="outline" onClick={saveFlowchart}><Save className="mr-2 h-4 w-4" />Save</Button>
          <Button variant="outline" onClick={() => setShowAIPanel(!showAIPanel)}>
            <Bot className="mr-2 h-4 w-4" />AI Assistant
          </Button>
        </div>
      </div>

      <div className="flex-1 flex relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onPaneClick={handlePaneClick}
          nodeTypes={customNodeTypes}
          edgeTypes={customEdgeTypes}
          fitView={true}
          connectionMode="loose"
        >
          <Background variant="dots" gap={16} size={1} color="hsl(var(--border))" />
          <Controls />
          <MiniMap nodeColor={(node) => nodeTypeColors[node.data.type]?.replace('bg-', '').replace('/20 border-', '') || '#666' } />
        </ReactFlow>

        <div className="absolute left-4 bottom-4 flex flex-col gap-2">
          {Object.entries(nodeTypes).map(([type, label]) => (
            <Button
              key={type}
              variant="outline"
              size="icon"
              className={cn('h-8 w-8', nodeTypeColors[type].replace('bg-', '').replace('/20 border-', 'text-'))}
              onClick={() => addNode(type)}
              title={`Add ${label}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          ))}
        </div>

        <Panel position="top-right">
          <Card className="w-72">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Node Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(nodeTypes).map(([type, label]) => (
                <Button
                  key={type}
                  variant="outline"
                  className={cn('w-full justify-start gap-2', nodeTypeColors[type].replace('bg-', '').replace('/20 border-', 'text-'))}
                  onClick={() => addNode(type)}
                >
                  <span className="text-xs uppercase font-medium">{label}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </Panel>

        <AnimatePresence>
          {showAIPanel && (
            <Panel position="bottom-right">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-96"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        AI Flowchart Assistant
                      </CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => setShowAIPanel(false)}><X className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Describe your project</label>
                      <Textarea
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="e.g., Build a Minecraft hosting panel with billing, Pterodactyl integration and Discord notifications"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button onClick={handleAIGenerate} loading={aiLoading} className="sm:col-span-2">
                        <Sparkles className="mr-2 h-4 w-4" />Generate Flowchart
                      </Button>
                      <Button variant="outline" onClick={handleAIGenerate} loading={aiLoading}>Add to Existing</Button>
                      <Button variant="outline" onClick={handleAIGenerate} loading={aiLoading}>Break Into Tasks</Button>
                      <Button variant="outline" onClick={handleAIGenerate} loading={aiLoading}>Generate Roadmap</Button>
                      <Button variant="outline" onClick={handleAIGenerate} loading={aiLoading}>Suggest Missing</Button>
                      <Button variant="outline" onClick={handleAIGenerate} loading={aiLoading}>Explain Node</Button>
                    </div>
                    <div className="p-3 rounded bg-muted text-xs text-muted-foreground">
                      <strong>Security:</strong> AI only generates visual plans. No code execution, no server modifications, no file operations.
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNodeEditor && selectedNode && (
            <Panel position="right">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-80"
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Edit Node</CardTitle>
                      <Button variant="ghost" size="icon" onClick={() => { setShowNodeEditor(false); setSelectedNode(null); }}><X className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Label</label>
                      <Input value={selectedNode.data.label} onChange={e => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Select value={selectedNode.data.type} onValueChange={value => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, type: value } } : n))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(nodeTypes).map(([type, label]) => (
                            <SelectItem key={type} value={type}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea value={selectedNode.data.description} onChange={e => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, description: e.target.value } } : n))} rows={3} />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <Select value={selectedNode.data.status || 'TODO'} onValueChange={value => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, status: value } } : n))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TODO">TODO</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="REVIEW">Review</SelectItem>
                            <SelectItem value="TESTING">Testing</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <Select value={selectedNode.data.priority || 'NORMAL'} onValueChange={value => setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, priority: value } } : n))}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="NORMAL">Normal</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="CRITICAL">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <Button variant="outline" onClick={duplicateSelected} className="flex-1"><Copy className="mr-2 h-3.5 w-3.5" />Duplicate</Button>
                      <Button variant="destructive" onClick={deleteSelected} className="flex-1"><Trash2 className="mr-2 h-3.5 w-3.5" />Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}