import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useDemoMode } from "@/hooks/useDemoMode";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Save, Trash2, Lock, ChevronDown, ChevronUp, Share2, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { demoNotebookEntries } from "@/data/demoData";

interface NotebookEntry {
  id: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  shared_with_therapist?: boolean;
}

const Notebook = () => {
  const { user } = useAuth();
  const { isDemoMode, guardWrite } = useDemoMode();
  const { toast } = useToast();
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (isDemoMode) {
      setEntries(demoNotebookEntries as NotebookEntry[]);
      setIsLoading(false);
      return;
    }
    if (user) fetchEntries();
  }, [user, isDemoMode]);

  const fetchEntries = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("notebook_entries" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setEntries((data as unknown as NotebookEntry[]) || []);
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    if (isDemoMode) { guardWrite("Crear entrada"); return; }
    setIsCreating(true);
    setEditTitle("");
    setEditContent("");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (isDemoMode) { guardWrite("Guardar entrada"); return; }
    if (!user) return;
    setIsSaving(true);
    try {
      if (editingId) {
        const { error } = await (supabase.from("notebook_entries" as any) as any)
          .update({ title: editTitle || null, content: editContent })
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Entrada actualizada" });
      } else {
        const { error } = await (supabase.from("notebook_entries" as any) as any)
          .insert({ user_id: user.id, title: editTitle || null, content: editContent });
        if (error) throw error;
        toast({ title: "Entrada guardada" });
      }
      setIsCreating(false);
      setEditingId(null);
      fetchEntries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (isDemoMode) { guardWrite("Eliminar entrada"); return; }
    try {
      const { error } = await (supabase.from("notebook_entries" as any) as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
      toast({ title: "Entrada eliminada" });
      fetchEntries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const toggleShare = async (entry: NotebookEntry) => {
    if (isDemoMode) { guardWrite("Compartir entrada"); return; }
    const newValue = !entry.shared_with_therapist;
    try {
      const { error } = await (supabase.from("notebook_entries" as any) as any)
        .update({ shared_with_therapist: newValue })
        .eq("id", entry.id);
      if (error) throw error;
      toast({
        title: newValue ? "Compartido con el psicólogo" : "Dejó de compartirse",
        description: newValue
          ? "Tu psicólogo ahora puede leer esta entrada."
          : "Esta entrada volvió a ser privada.",
      });
      fetchEntries();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const startEdit = (entry: NotebookEntry) => {
    if (isDemoMode) { guardWrite("Editar entrada"); return; }
    setEditingId(entry.id);
    setEditTitle(entry.title || "");
    setEditContent(entry.content);
    setIsCreating(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-3 py-4 md:px-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="font-serif text-xl font-bold text-foreground md:text-3xl">
            Mi Cuaderno
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Un espacio tuyo, sin estructura ni juicio. Nadie leerá el contenido del cuaderno, a menos que quieras compartirlo.
        </p>
      </div>

      {/* Privacy notice */}
      <Card className="mb-6 border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-3 py-3">
          <Lock className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Este espacio es completamente privado. Solo vos podés ver lo que escribís aquí. 
            Podés elegir compartir entradas individuales con tu psicólogo usando el botón <Share2 className="inline h-3.5 w-3.5" />.
          </p>
        </CardContent>
      </Card>

      {/* New/Edit Entry */}
      {isCreating ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {editingId ? "Editar entrada" : "Nueva entrada"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Título (opcional)"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <Textarea
              placeholder="Escribí lo que quieras... pensamientos, ideas, reflexiones, lo que necesites expresar."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={!editContent.trim() || isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={() => { setIsCreating(false); setEditingId(null); }}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={handleCreate} className="mb-6">
          <Plus className="h-4 w-4 mr-2" /> Nueva entrada
        </Button>
      )}

      {/* Entries list */}
      {entries.length === 0 && !isCreating ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="font-medium text-foreground">Tu cuaderno está vacío</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Empezá a escribir cuando quieras. No hay reglas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id} className="transition-all hover:shadow-sm">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground">
                        {entry.title || "Sin título"}
                      </p>
                      {entry.shared_with_therapist && (
                        <Badge variant="outline" className="gap-1 text-xs text-primary border-primary/30">
                          <ShieldCheck className="h-3 w-3" />
                          Compartido
                        </Badge>
                      )}
                      {expandedId === entry.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(entry.updated_at), "d 'de' MMMM, yyyy – HH:mm", { locale: es })}
                    </p>
                    {expandedId !== entry.id && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {entry.content}
                      </p>
                    )}
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${entry.shared_with_therapist ? "text-primary" : ""}`}
                      onClick={() => toggleShare(entry)}
                      title={entry.shared_with_therapist ? "Dejar de compartir" : "Compartir con el psicólogo"}
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => startEdit(entry)}>
                      <Save className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(entry.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {expandedId === entry.id && (
                  <div className="mt-3 whitespace-pre-wrap text-sm text-foreground border-t pt-3">
                    {entry.content}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notebook;
