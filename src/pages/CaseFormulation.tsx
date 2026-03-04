import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
import { Map, Plus, Save, History, Trash2, Users } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; border: string; label: string }> = {
  predisposing: { bg: "#fee2e2", border: "#ef4444", label: "Factor Predisponente" },
  precipitating: { bg: "#fef3c7", border: "#f59e0b", label: "Factor Precipitante" },
  perpetuating: { bg: "#dbeafe", border: "#3b82f6", label: "Factor de Mantenimiento" },
  protective: { bg: "#dcfce7", border: "#22c55e", label: "Factor Protector" },
};

const createNode = (category: string, label: string, position: { x: number; y: number }): Node => ({
  id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  type: "default",
  position,
  data: { label, category },
  style: {
    background: CATEGORY_COLORS[category]?.bg || "#f3f4f6",
    border: `2px solid ${CATEGORY_COLORS[category]?.border || "#6b7280"}`,
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: 500,
    minWidth: "140px",
    textAlign: "center" as const,
  },
});

export default function CaseFormulation() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [patients, setPatients] = useState<{ user_id: string; full_name: string | null }[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [formulations, setFormulations] = useState<any[]>([]);
  const [currentFormulation, setCurrentFormulation] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddNode, setShowAddNode] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeCategory, setNewNodeCategory] = useState("predisposing");
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      supabase.from("profiles").select("user_id, full_name").then(({ data }) => {
        setPatients(data || []);
      });
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selectedPatient) loadFormulations();
  }, [selectedPatient]);

  const loadFormulations = async () => {
    const { data } = await supabase
      .from("case_formulations")
      .select("*")
      .eq("patient_id", selectedPatient)
      .order("version", { ascending: false });

    setFormulations(data || []);
    if (data && data.length > 0) {
      loadFormulation(data[0]);
    } else {
      setNodes([]);
      setEdges([]);
      setCurrentFormulation(null);
    }
  };

  const loadFormulation = (f: any) => {
    setCurrentFormulation(f);
    const loadedNodes = (f.nodes as any[]).map((n: any) => ({
      ...n,
      style: {
        background: CATEGORY_COLORS[n.data?.category]?.bg || "#f3f4f6",
        border: `2px solid ${CATEGORY_COLORS[n.data?.category]?.border || "#6b7280"}`,
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "13px",
        fontWeight: 500,
        minWidth: "140px",
        textAlign: "center" as const,
      },
    }));
    setNodes(loadedNodes);
    setEdges(f.edges as Edge[]);
  };

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2, stroke: "#6b7280" },
            animated: true,
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const addNode = () => {
    if (!newNodeLabel.trim()) return;
    const position = {
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 300,
    };
    const node = createNode(newNodeCategory, newNodeLabel.trim(), position);
    setNodes((nds) => [...nds, node]);
    setNewNodeLabel("");
    setShowAddNode(false);
  };

  const saveFormulation = async () => {
    if (!selectedPatient) return;
    setIsSaving(true);
    try {
      const nextVersion = (currentFormulation?.version || 0) + 1;
      const { error } = await supabase.from("case_formulations").insert({
        patient_id: selectedPatient,
        version: nextVersion,
        nodes: nodes as any,
        edges: edges as any,
        title: `Formulación v${nextVersion}`,
      });
      if (error) throw error;
      toast({ title: "Formulación guardada", description: `Versión ${nextVersion} creada.` });
      loadFormulations();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  if (authLoading) return <div className="flex h-[50vh] items-center justify-center"><div className="animate-pulse text-primary">Cargando...</div></div>;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <div className="container mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="h-6 w-6 text-primary" />
            <h1 className="font-serif text-xl font-bold text-foreground sm:text-2xl">Mapa de Formulación de Caso</h1>
          </div>
          <p className="text-sm text-muted-foreground">Conceptualización clínica basada en modelo CBT</p>
        </div>
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
                  <SelectItem key={p.user_id} value={p.user_id}>
                    {p.full_name || "Sin nombre"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPatient && (
              <div className="flex gap-2 flex-wrap">
                <Button size="sm" onClick={() => setShowAddNode(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Nodo
                </Button>
                <Button size="sm" variant="outline" onClick={saveFormulation} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-1" /> {isSaving ? "Guardando..." : "Guardar"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowHistory(true)}>
                  <History className="h-4 w-4 mr-1" /> Historial ({formulations.length})
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
          <Badge key={key} style={{ backgroundColor: val.bg, color: val.border, border: `1px solid ${val.border}` }}>
            {val.label}
          </Badge>
        ))}
      </div>

      {/* Canvas */}
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
                onNodeDoubleClick={(_, node) => {
                  const newLabel = prompt("Editar nodo:", node.data.label as string);
                  if (newLabel !== null) {
                    setNodes((nds) =>
                      nds.map((n) =>
                        n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n,
                      ),
                    );
                  }
                }}
                onNodeContextMenu={(e, node) => {
                  e.preventDefault();
                  if (confirm("¿Eliminar este nodo?")) deleteNode(node.id);
                }}
                fitView
              >
                <Controls />
                <Background variant={BackgroundVariant.Dots} gap={20} />
                <Panel position="bottom-left">
                  <p className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                    Doble clic: editar • Clic derecho: eliminar • Arrastrá entre nodos para conectar
                  </p>
                </Panel>
              </ReactFlow>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            Seleccioná un paciente para comenzar la formulación de caso.
          </CardContent>
        </Card>
      )}

      {/* Add Node Dialog */}
      <Dialog open={showAddNode} onOpenChange={setShowAddNode}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nodo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Descripción del factor..." value={newNodeLabel} onChange={(e) => setNewNodeLabel(e.target.value)} />
            <Select value={newNodeCategory} onValueChange={setNewNodeCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={addNode} disabled={!newNodeLabel.trim()}>Agregar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-[95vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Historial de Versiones</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto space-y-2">
            {formulations.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No hay versiones guardadas.</p>
            ) : (
              formulations.map((f) => (
                <Card
                  key={f.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${currentFormulation?.id === f.id ? "border-primary" : ""}`}
                  onClick={() => { loadFormulation(f); setShowHistory(false); }}
                >
                  <CardContent className="py-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{f.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(f.created_at).toLocaleDateString("es-AR")} — {(f.nodes as any[]).length} nodos
                        </p>
                      </div>
                      <Badge variant="outline">v{f.version}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
