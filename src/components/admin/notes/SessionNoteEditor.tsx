import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useActiveSchool } from '@/hooks/useActiveSchool';
import { useAutosave } from '@/hooks/useAutosave';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { FileDown, Keyboard, Save, Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import {
  getTemplatesForSchool,
  parseStoredNote,
  serializeNote,
  plainTextFromNote,
  type NoteTemplate,
} from '@/data/sessionNoteTemplates';
import { exportSessionNotePdf } from '@/lib/sessionNotePdf';
import { SchoolSwitcher } from '@/components/SchoolSwitcher';
import { SCHOOL_CONFIG, type SchoolType } from '@/config/schools';

interface SessionRow {
  id: string;
  patient_id: string;
  session_date: string;
  topic: string | null;
  clinical_notes: string | null;
  is_editable_by_patient: boolean | null;
}

interface Props {
  session: SessionRow;
  patientName: string;
  onClose: () => void;
  onSaved?: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  onNew?: () => void;
}

export function SessionNoteEditor({ session, patientName, onClose, onSaved, onNavigate, onNew }: Props) {
  const { profile } = useAuth();
  const { schoolId, school } = useActiveSchool();
  const [noteSchoolId, setNoteSchoolId] = useState<SchoolType>(schoolId);
  const activeSchool = SCHOOL_CONFIG[noteSchoolId];
  const templates = useMemo(() => getTemplatesForSchool(noteSchoolId), [noteSchoolId]);

  const parsed = useMemo(() => parseStoredNote(session.clinical_notes), [session.id]);
  // For new/empty notes, default to the school-specific template (templates[1]) instead of 'free'.
  const hasContent = !!(session.clinical_notes && session.clinical_notes.trim());
  const explicitTemplate = templates.find((t) => t.id === parsed.templateId);
  const initialTemplate =
    explicitTemplate ||
    (!hasContent && templates.length > 1 ? templates[1] : templates[0]);

  const [templateId, setTemplateId] = useState<string>(initialTemplate.id);
  const [values, setValues] = useState<Record<string, string>>(parsed.values);

  const initialDate = new Date(session.session_date);
  const [date, setDate] = useState(format(initialDate, 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(initialDate, 'HH:mm'));
  const [topic, setTopic] = useState(session.topic || '');
  const [editable, setEditable] = useState(session.is_editable_by_patient ?? true);

  const template = templates.find((t) => t.id === templateId) || templates[0];

  const editorRef = useRef<HTMLDivElement>(null);

  // Sync when session changes
  useEffect(() => {
    const p = parseStoredNote(session.clinical_notes);
    setTemplateId(p.templateId);
    setValues(p.values);
    setTopic(session.topic || '');
    setEditable(session.is_editable_by_patient ?? true);
    const d = new Date(session.session_date);
    setDate(format(d, 'yyyy-MM-dd'));
    setTime(format(d, 'HH:mm'));
  }, [session.id]);

  const buildPayload = () => {
    const body = serializeNote(templateId, template, values);
    return {
      session_date: `${date}T${time}:00`,
      topic: topic.trim() || null,
      clinical_notes: body,
      is_editable_by_patient: editable,
    };
  };

  const saveNow = async () => {
    const payload = buildPayload();
    const { error } = await supabase.from('sessions').update(payload).eq('id', session.id);
    if (error) throw error;
    onSaved?.();
  };

  const validateRequired = (): boolean => {
    const missing = template.fields.filter((f) => f.required && !(values[f.key] || '').trim());
    if (missing.length === 0) return true;
    toast({
      title: 'Faltan campos requeridos',
      description: `Completá: ${missing.map((m) => m.label).join(', ')}`,
      variant: 'destructive',
    });
    return false;
  };

  const handleManualSave = async () => {
    if (!validateRequired()) return;
    await flush();
  };

  const autosaveValue = useMemo(
    () => ({ templateId, values, date, time, topic, editable }),
    [templateId, values, date, time, topic, editable],
  );

  const { status, lastSavedAt, flush } = useAutosave({
    value: autosaveValue,
    onSave: async () => {
      await saveNow();
    },
    delayMs: 1500,
    localKey: `note-draft:${session.id}`,
  });

  // Keyboard shortcuts scoped to editor
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inside = editorRef.current?.contains(target as Node) ?? false;
      if (!inside && !(e.metaKey || e.ctrlKey)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!validateRequired()) return;
        void flush().then(() =>
          toast({ title: 'Guardado', description: 'Nota guardada manualmente.' }),
        );
      } else if (mod && e.key === 'Enter') {
        e.preventDefault();
        if (!validateRequired()) return;
        void flush().then(() => onClose());
      } else if (mod && e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigate?.('prev');
      } else if (mod && e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigate?.('next');
      } else if (mod && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onNew?.();
      } else if (e.key === 'Escape' && inside) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [flush, onClose, onNavigate, onNew]);

  const handleExportPdf = async () => {
    if (!validateRequired()) return;
    await flush();
    exportSessionNotePdf({
      patientName,
      professionalName: profile?.full_name || 'Profesional',
      sessionDate: `${date}T${time}:00`,
      topic: topic.trim() || null,
      templateName: template.name,
      body: plainTextFromNote(templateId, template, values),
    });
  };

  return (
    <div ref={editorRef} className="flex flex-col h-full bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-3 flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 items-end flex-wrap flex-1 min-w-0">
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Fecha</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-8 w-[140px] text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Hora</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-8 w-[100px] text-xs" />
          </div>
          <div className="space-y-1 flex-1 min-w-[160px]">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Tema</Label>
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Tema de la sesión" className="h-8 text-xs" />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Cerrar">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Template + status */}
      <div className="border-b border-border px-3 py-2 flex items-center gap-3 flex-wrap bg-muted/30">
        <div className="flex items-center gap-2 flex-wrap">
          <Label className="text-[11px] text-muted-foreground">Escuela de esta nota:</Label>
          <SchoolSwitcher
            compact
            value={noteSchoolId}
            onChange={(id) => {
              setNoteSchoolId(id);
              const tpls = getTemplatesForSchool(id);
              if (!tpls.some((t) => t.id === templateId)) {
                setTemplateId(tpls[0]?.id || 'free');
              }
            }}
          />
          <Label className="text-[11px] text-muted-foreground">Plantilla ({activeSchool.name}):</Label>
          <Select value={templateId} onValueChange={(v) => setTemplateId(v)}>
            <SelectTrigger className="h-7 w-[200px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={editable} onCheckedChange={setEditable} id="editable-switch" />
          <Label htmlFor="editable-switch" className="text-[11px] text-muted-foreground">
            Paciente puede agregar notas
          </Label>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <StatusBadge status={status} lastSavedAt={lastSavedAt} />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Keyboard className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-[11px]">
                <p><kbd>Ctrl/⌘+S</kbd> guardar</p>
                <p><kbd>Ctrl/⌘+Enter</kbd> guardar y cerrar</p>
                <p><kbd>Ctrl/⌘+↑/↓</kbd> nota anterior / siguiente</p>
                <p><kbd>Ctrl/⌘+N</kbd> nueva nota</p>
                <p><kbd>Esc</kbd> cerrar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-xs text-muted-foreground italic">{template.description}</p>
        {template.fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1">
              {f.label}
              {f.required && <span className="text-destructive" aria-label="requerido">*</span>}
            </Label>
            {f.hint && <p className="text-[10px] text-muted-foreground">{f.hint}</p>}
            <Textarea
              value={values[f.key] || ''}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              rows={f.rows || 3}
              placeholder={f.placeholder}
              className={`text-sm resize-y ${f.required && !(values[f.key] || '').trim() ? 'border-destructive/40 focus-visible:ring-destructive/30' : ''}`}
            />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3 flex items-center gap-2 bg-muted/20">
        <StatusBadge status={status} lastSavedAt={lastSavedAt} compact />
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={handleExportPdf} className="gap-1.5 h-8">
          <FileDown className="h-3.5 w-3.5" />
          Exportar PDF
        </Button>
        <Button size="sm" onClick={() => void handleManualSave()} className="gap-1.5 h-8">
          <Save className="h-3.5 w-3.5" />
          Guardar
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
  lastSavedAt,
  compact,
}: {
  status: ReturnType<typeof useAutosave>['status'];
  lastSavedAt: Date | null;
  compact?: boolean;
}) {
  if (status === 'saving') {
    return (
      <Badge variant="outline" className="gap-1 text-[10px]">
        <Loader2 className="h-3 w-3 animate-spin" /> Guardando…
      </Badge>
    );
  }
  if (status === 'error') {
    return (
      <Badge variant="destructive" className="gap-1 text-[10px]">
        <AlertCircle className="h-3 w-3" /> Error al guardar
      </Badge>
    );
  }
  if (status === 'saved' && lastSavedAt) {
    return (
      <Badge variant="outline" className="gap-1 text-[10px] text-emerald-600 border-emerald-200">
        <CheckCircle2 className="h-3 w-3" />
        {compact ? 'Guardado' : `Guardado ${format(lastSavedAt, 'HH:mm:ss')}`}
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-[10px] text-muted-foreground">
      Borrador
    </Badge>
  );
}