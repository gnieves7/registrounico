import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { Plus, Search, FileDown, Edit, Trash2, Calendar, Clock } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { SessionNoteEditor } from './SessionNoteEditor';
import { exportSessionNotePdf } from '@/lib/sessionNotePdf';
import {
  parseStoredNote,
  plainTextFromNote,
  getTemplatesForSchool,
} from '@/data/sessionNoteTemplates';
import { useActiveSchool } from '@/hooks/useActiveSchool';

interface SessionRow {
  id: string;
  patient_id: string;
  session_date: string;
  topic: string | null;
  clinical_notes: string | null;
  is_editable_by_patient: boolean | null;
  created_at: string;
}

interface Props {
  userId: string;
  patientName: string;
}

export function SessionNotesList({ userId, patientName }: Props) {
  const { profile } = useAuth();
  const { schoolId } = useActiveSchool();
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('patient_id', userId)
      .order('session_date', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: 'No se pudieron cargar las notas', variant: 'destructive' });
    } else {
      setSessions((data as SessionRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter(
      (s) =>
        (s.topic || '').toLowerCase().includes(q) ||
        (s.clinical_notes || '').toLowerCase().includes(q) ||
        format(new Date(s.session_date), 'PPP', { locale: es }).toLowerCase().includes(q),
    );
  }, [sessions, search]);

  // Group by month
  const grouped = useMemo(() => {
    const map = new Map<string, SessionRow[]>();
    filtered.forEach((s) => {
      const key = format(new Date(s.session_date), 'MMMM yyyy', { locale: es });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const selected = sessions.find((s) => s.id === selectedId) || null;

  const handleNew = async () => {
    const now = new Date();
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        patient_id: userId,
        session_date: now.toISOString(),
        topic: null,
        clinical_notes: '<!-- template: free -->\n',
        is_editable_by_patient: true,
      })
      .select('*')
      .single();
    if (error || !data) {
      toast({ title: 'Error', description: 'No se pudo crear la nota', variant: 'destructive' });
      return;
    }
    await fetchSessions();
    setSelectedId((data as any).id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta nota de sesión?')) return;
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) {
      toast({ title: 'Error', description: 'No se pudo eliminar', variant: 'destructive' });
      return;
    }
    toast({ title: 'Nota eliminada' });
    if (selectedId === id) setSelectedId(null);
    fetchSessions();
  };

  const handleQuickExport = (s: SessionRow) => {
    const parsed = parseStoredNote(s.clinical_notes);
    // Use the school that was active when the note was written so the exported
    // labels match what the professional sees inside the editor.
    const noteSchool = parsed.schoolId ?? schoolId;
    const templates = getTemplatesForSchool(noteSchool);
    const template = templates.find((t) => t.id === parsed.templateId) || templates[0];
    exportSessionNotePdf({
      patientName,
      professionalName: profile?.full_name || 'Profesional',
      sessionDate: s.session_date,
      topic: s.topic,
      templateName: template.name,
      body: plainTextFromNote(parsed.templateId, template, parsed.values),
    });
  };

  const navigateNote = (direction: 'prev' | 'next') => {
    if (!selected) return;
    const idx = sessions.findIndex((s) => s.id === selected.id);
    if (idx < 0) return;
    const nextIdx = direction === 'prev' ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= sessions.length) return;
    setSelectedId(sessions[nextIdx].id);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr] min-h-[calc(100vh-260px)]">
      {/* LEFT: list */}
      <div className="flex flex-col gap-3 min-h-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar nota o tema…"
              className="pl-8 h-8 text-xs"
            />
          </div>
          <Button size="sm" onClick={handleNew} className="gap-1.5 h-8">
            <Plus className="h-3.5 w-3.5" />
            Nueva
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : grouped.length === 0 ? (
            <Card className="p-6 text-center text-xs text-muted-foreground">
              No hay notas todavía. Creá la primera con “Nueva”.
            </Card>
          ) : (
            grouped.map(([month, items]) => (
              <div key={month}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
                  {month}
                </p>
                <div className="space-y-1.5">
                  {items.map((s) => {
                    const upcoming = isAfter(new Date(s.session_date), new Date());
                    const parsed = parseStoredNote(s.clinical_notes);
                    const hasContent = Object.values(parsed.values).some((v) => v && v.trim().length > 0);
                    const isSelected = selectedId === s.id;
                    return (
                      <Card
                        key={s.id}
                        className={`p-2.5 cursor-pointer transition-colors border ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/40'
                        }`}
                        onClick={() => setSelectedId(s.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`rounded-md p-1.5 shrink-0 ${upcoming ? 'bg-primary/10' : 'bg-muted'}`}>
                            <Calendar className={`h-3.5 w-3.5 ${upcoming ? 'text-primary' : 'text-muted-foreground'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-medium truncate">
                                {format(new Date(s.session_date), "EEE d MMM", { locale: es })}
                              </span>
                              <Badge variant="outline" className="text-[9px] h-4 px-1 gap-0.5">
                                <Clock className="h-2.5 w-2.5" />
                                {format(new Date(s.session_date), 'HH:mm')}
                              </Badge>
                              {upcoming && (
                                <Badge className="text-[9px] h-4 px-1 bg-primary/15 text-primary hover:bg-primary/15">
                                  Próxima
                                </Badge>
                              )}
                              {hasContent && (
                                <span className="text-[9px] text-emerald-600">●</span>
                              )}
                            </div>
                            {s.topic && (
                              <p className="text-[11px] text-muted-foreground truncate mt-0.5">{s.topic}</p>
                            )}
                            <div className="flex items-center gap-0.5 mt-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedId(s.id);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickExport(s);
                                }}
                              >
                                <FileDown className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(s.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT: editor */}
      <div className="min-h-[500px]">
        {selected ? (
          <SessionNoteEditor
            key={selected.id}
            session={selected}
            patientName={patientName}
            onClose={() => setSelectedId(null)}
            onSaved={fetchSessions}
            onNavigate={navigateNote}
            onNew={handleNew}
          />
        ) : (
          <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
            <Edit className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">Seleccioná una nota para editarla</p>
            <p className="text-xs text-muted-foreground mt-1">
              O creá una nueva con el botón <strong>Nueva</strong>. Ctrl/⌘+N también funciona.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}