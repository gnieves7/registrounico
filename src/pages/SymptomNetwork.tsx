import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Network, Plus, Save, Users, Star, Info, Trash2 } from "lucide-react";

export default function SymptomNetwork() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [bridgeSymptom, setBridgeSymptom] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [showAddNode, setShowAddNode] = useState(false);
  const [newSymptom, setNewSymptom] = useState("");
  const [newFrequency, setNewFrequency] = useState([3]);
  const [newDistress, setNewDistress] = useState([3]);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => setPatients(data || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedPatient) loadNetwork();
  }, [selectedPatient]);

  const getNodeColor = (distress: number) => {
    if (distress >= 4) return { bg: "#fee2e2", border: "#ef4444" };
    if (distress >= 3) return { bg: "#fef3c7", border: "#f59e0b" };
    return { bg: "#dcfce7", border: "#22c55e" };
  };

  const loadNetwork = async () => {
    const { data } = await supabase
      .from("symptom_networks")
      .select("*")
      .eq("patient_id", selectedPatient)
      .maybeSingle();

    if (data) {
      setNetworkId(data.id);
      setBridgeSymptom(data.bridge_symptom);
      const loadedNodes = (data.nodes as any[]).map((n: any) => {
        const color = getNodeColor(n.data?.distress || 3);
        return {
          ...n,
          style: {
            background: color.bg,
            border: `2px solid ${color.border}`,
            borderRadius: "50%",
            padding: "16px",
            fontSize: "12px",
            fontWeight: 600,
            width: 30 + (n.data?.frequency || 3) * 15,
            height: 30 + (n.data?.frequency || 3) * 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center" as const,
          },
        };
      });
      setNodes(loadedNodes);
      setEdges(data.edges as unknown as Edge[]);
    } else {
      setNetworkId(null);
      setBridgeSymptom(null);
      setNodes([]);
      setEdges([]);
    }
  };

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed }, style: { strokeWidth: 2, stroke: "#6b7280" } }, eds),
      ),
    [setEdges],
  );

  const calculateBridge = useCallback(() => {
    // Bridge symptom = node with most connections
    const connectionCount: Record<string, number> = {};
    edges.forEach((e) => {
      connectionCount[e.source] = (connectionCount[e.source] || 0) + 1;
      connectionCount[e.target] = (connectionCount[e.target] || 0) + 1;
    });
    let maxNode = "";
    let maxCount = 0;
    Object.entries(connectionCount).forEach(([nodeId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxNode = nodeId;
      }
    });
    const bridgeNode = nodes.find((n) => n.id === maxNode);
    return bridgeNode ? (bridgeNode.data.label as string) : null;
  }, [nodes, edges]);

  const addSymptom = () => {
    if (!newSymptom.trim()) return;
    const color = getNodeColor(newDistress[0]);
    const size = 30 + newFrequency[0] * 15;
    const node: Node = {
      id: `symptom-${Date.now()}`,
      type: "default",
      position: { x: 150 + Math.random() * 300, y: 100 + Math.random() * 250 },
      data: { label: newSymptom.trim(), frequency: newFrequency[0], distress: newDistress[0] },
      style: {
        background: color.bg,
        border: `2px solid ${color.border}`,
        borderRadius: "50%",
        padding: "16px",
        fontSize: "12px",
        fontWeight: 600,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center" as const,
      },
    };
    setNodes((nds) => [...nds, node]);
    setNewSymptom("");
    setNewFrequency([3]);
    setNewDistress([3]);
    setShowAddNode(false);
  };

  const saveNetwork = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    const bridge = calculateBridge();
    setBridgeSymptom(bridge);
    try {
      if (networkId) {
        await supabase.from("symptom_networks").update({
          nodes: nodes as any,
          edges: edges as any,
          bridge_symptom: bridge,
        }).eq("id", networkId);
      } else {
        await supabase.from("symptom_networks").insert({
          patient_id: selectedPatient,
          nodes: nodes as any,
          edges: edges as any,
          bridge_symptom: bridge,
        });
      }
      toast({ title: "Red guardada" });
      loadNetwork();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Network className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Red de Síntomas Interactiva</h1>
        </div>
        <p className="text-sm text-muted-foreground">Visualización de red de síntomas con análisis de síntoma puente</p>
      </div>

      {/* Patient Selector */}
      <Card className="mb-4">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Users className="h-5 w-5 text-muted-foreground shrink-0" />
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="sm:max-w-xs">
                <SelectValue placeholder="Seleccionar paciente..." />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.user_id} value={p.user_id}>{p.full_name || "Sin nombre"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPatient && (
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => setShowAddNode(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Síntoma
                </Button>
                <Button size="sm" variant="outline" onClick={saveNetwork} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-1" /> {isSaving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bridge Symptom Alert */}
      {bridgeSymptom && (
        <Card className="mb-4 border-primary/30 bg-primary/5">
          <CardContent className="py-3">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium text-sm">Síntoma Puente: <span className="text-primary font-bold">{bridgeSymptom}</span></p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 cursor-help">
                      Este síntoma puede ser el punto de intervención más estratégico.
                      <Info className="h-3 w-3" />
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>El síntoma puente es el nodo con más conexiones en la red. Intervenir sobre él puede generar un efecto cascada positivo en toda la red de síntomas.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Canvas */}
      {selectedPatient ? (
        <Card>
          <CardContent className="p-0">
            <div className="h-[500px] md:h-[600px] w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeContextMenu={(e, node) => {
                  e.preventDefault();
                  if (confirm(`¿Eliminar síntoma "${node.data.label}"?`)) {
                    setNodes((nds) => nds.filter((n) => n.id !== node.id));
                    setEdges((eds) => eds.filter((ed) => ed.source !== node.id && ed.target !== node.id));
                  }
                }}
                fitView
              >
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={20} />
                <Panel position="bottom-left">
                  <div className="bg-background/80 rounded px-2 py-1 space-y-1">
                    <p className="text-xs text-muted-foreground">Tamaño = frecuencia • Color = nivel de malestar</p>
                    <div className="flex gap-2">
                      <Badge style={{ backgroundColor: "#dcfce7", color: "#22c55e", border: "1px solid #22c55e" }}>Bajo</Badge>
                      <Badge style={{ backgroundColor: "#fef3c7", color: "#f59e0b", border: "1px solid #f59e0b" }}>Medio</Badge>
                      <Badge style={{ backgroundColor: "#fee2e2", color: "#ef4444", border: "1px solid #ef4444" }}>Alto</Badge>
                    </div>
                  </div>
                </Panel>
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Seleccioná un paciente para comenzar.</CardContent></Card>
      )}

      {/* Add Symptom Dialog */}
      <Dialog open={showAddNode} onOpenChange={setShowAddNode}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Síntoma</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Nombre del síntoma</Label>
              <Input placeholder="Ej: Insomnio, Rumiación..." value={newSymptom} onChange={(e) => setNewSymptom(e.target.value)} />
            </div>
            <div>
              <Label className="mb-2 block">Frecuencia: {newFrequency[0]}/5</Label>
              <Slider value={newFrequency} onValueChange={setNewFrequency} min={1} max={5} step={1} />
            </div>
            <div>
              <Label className="mb-2 block">Nivel de malestar: {newDistress[0]}/5</Label>
              <Slider value={newDistress} onValueChange={setNewDistress} min={1} max={5} step={1} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addSymptom} disabled={!newSymptom.trim()}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
