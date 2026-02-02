import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users2, Save, Loader2, Plus, X, Trash2 } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate, SocialData, WorkHistory } from "@/hooks/usePsychobiography";
import type { Json } from "@/integrations/supabase/types";

interface SocialWorkSectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function SocialWorkSection({ data, onSave, isSaving }: SocialWorkSectionProps) {
  const [socialData, setSocialData] = useState<SocialData>({
    socialNetwork: "",
    friendships: "",
    communityInvolvement: "",
    hobbies: [],
    spirituality: "",
  });

  const [workData, setWorkData] = useState<WorkHistory>({
    currentJob: { title: "", company: "", duration: "", satisfaction: "" },
    previousJobs: [],
    careerGoals: "",
    workChallenges: "",
  });

  const [newHobby, setNewHobby] = useState("");

  useEffect(() => {
    if (data?.social_data) {
      const social = data.social_data as unknown as SocialData;
      setSocialData({
        socialNetwork: social.socialNetwork || "",
        friendships: social.friendships || "",
        communityInvolvement: social.communityInvolvement || "",
        hobbies: social.hobbies || [],
        spirituality: social.spirituality || "",
      });
    }
    if (data?.work_history) {
      const work = data.work_history as unknown as WorkHistory;
      setWorkData({
        currentJob: work.currentJob || { title: "", company: "", duration: "", satisfaction: "" },
        previousJobs: work.previousJobs || [],
        careerGoals: work.careerGoals || "",
        workChallenges: work.workChallenges || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      social_data: socialData as unknown as Json,
      work_history: workData as unknown as Json,
    });
  };

  const addHobby = () => {
    if (newHobby.trim()) {
      setSocialData({
        ...socialData,
        hobbies: [...(socialData.hobbies || []), newHobby.trim()],
      });
      setNewHobby("");
    }
  };

  const removeHobby = (index: number) => {
    setSocialData({
      ...socialData,
      hobbies: socialData.hobbies?.filter((_, i) => i !== index),
    });
  };

  const addPreviousJob = () => {
    setWorkData({
      ...workData,
      previousJobs: [...(workData.previousJobs || []), { title: "", company: "", duration: "", reason_left: "" }],
    });
  };

  const removePreviousJob = (index: number) => {
    setWorkData({
      ...workData,
      previousJobs: workData.previousJobs?.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Social Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5 text-primary" />
            Vida Social
          </CardTitle>
          <CardDescription>
            Información sobre tus relaciones sociales y actividades.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Red de Apoyo Social</Label>
            <Textarea
              placeholder="¿Con quién cuentas cuando necesitas apoyo? ¿Quiénes son las personas más importantes en tu vida?"
              value={socialData.socialNetwork || ""}
              onChange={(e) => setSocialData({ ...socialData, socialNetwork: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Amistades</Label>
            <Textarea
              placeholder="Describe tus amistades: ¿tienes amigos cercanos? ¿Cómo son esas relaciones? ¿Te resulta fácil o difícil hacer amigos?"
              value={socialData.friendships || ""}
              onChange={(e) => setSocialData({ ...socialData, friendships: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Pasatiempos e Intereses</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Agregar pasatiempo o interés"
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addHobby()}
              />
              <Button type="button" variant="outline" size="icon" onClick={addHobby}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {socialData.hobbies?.map((hobby, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {hobby}
                  <button onClick={() => removeHobby(index)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Participación Comunitaria</Label>
            <Textarea
              placeholder="¿Participas en grupos, organizaciones, voluntariado, etc.?"
              value={socialData.communityInvolvement || ""}
              onChange={(e) => setSocialData({ ...socialData, communityInvolvement: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Espiritualidad / Religión</Label>
            <Textarea
              placeholder="¿Tienes creencias espirituales o religiosas? ¿Qué papel juegan en tu vida?"
              value={socialData.spirituality || ""}
              onChange={(e) => setSocialData({ ...socialData, spirituality: e.target.value })}
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Work Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Historia Laboral
          </CardTitle>
          <CardDescription>
            Información sobre tu trabajo y carrera profesional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Job */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Trabajo Actual</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Puesto</Label>
                <Input
                  placeholder="Tu puesto actual"
                  value={workData.currentJob?.title || ""}
                  onChange={(e) =>
                    setWorkData({
                      ...workData,
                      currentJob: { ...workData.currentJob, title: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa / Organización</Label>
                <Input
                  placeholder="Nombre de la empresa"
                  value={workData.currentJob?.company || ""}
                  onChange={(e) =>
                    setWorkData({
                      ...workData,
                      currentJob: { ...workData.currentJob, company: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tiempo en el puesto</Label>
                <Input
                  placeholder="Ej: 2 años"
                  value={workData.currentJob?.duration || ""}
                  onChange={(e) =>
                    setWorkData({
                      ...workData,
                      currentJob: { ...workData.currentJob, duration: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Satisfacción Laboral</Label>
                <Input
                  placeholder="¿Qué tan satisfecho/a estás?"
                  value={workData.currentJob?.satisfaction || ""}
                  onChange={(e) =>
                    setWorkData({
                      ...workData,
                      currentJob: { ...workData.currentJob, satisfaction: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Previous Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Trabajos Anteriores</h3>
              <Button variant="outline" size="sm" onClick={addPreviousJob}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar
              </Button>
            </div>
            {workData.previousJobs?.map((job, index) => (
              <div key={index} className="grid gap-4 md:grid-cols-5 items-end border-b border-border pb-4">
                <div className="space-y-2">
                  <Label>Puesto</Label>
                  <Input
                    placeholder="Puesto"
                    value={job.title || ""}
                    onChange={(e) => {
                      const newJobs = [...(workData.previousJobs || [])];
                      newJobs[index] = { ...job, title: e.target.value };
                      setWorkData({ ...workData, previousJobs: newJobs });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <Input
                    placeholder="Empresa"
                    value={job.company || ""}
                    onChange={(e) => {
                      const newJobs = [...(workData.previousJobs || [])];
                      newJobs[index] = { ...job, company: e.target.value };
                      setWorkData({ ...workData, previousJobs: newJobs });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duración</Label>
                  <Input
                    placeholder="Duración"
                    value={job.duration || ""}
                    onChange={(e) => {
                      const newJobs = [...(workData.previousJobs || [])];
                      newJobs[index] = { ...job, duration: e.target.value };
                      setWorkData({ ...workData, previousJobs: newJobs });
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Razón de salida</Label>
                  <Input
                    placeholder="Por qué te fuiste"
                    value={job.reason_left || ""}
                    onChange={(e) => {
                      const newJobs = [...(workData.previousJobs || [])];
                      newJobs[index] = { ...job, reason_left: e.target.value };
                      setWorkData({ ...workData, previousJobs: newJobs });
                    }}
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => removePreviousJob(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Metas Profesionales</Label>
            <Textarea
              placeholder="¿Cuáles son tus metas profesionales? ¿Qué te gustaría lograr en tu carrera?"
              value={workData.careerGoals || ""}
              onChange={(e) => setWorkData({ ...workData, careerGoals: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Desafíos Laborales</Label>
            <Textarea
              placeholder="¿Qué desafíos enfrentas en tu trabajo? ¿Hay algo que te cause estrés o preocupación?"
              value={workData.workChallenges || ""}
              onChange={(e) => setWorkData({ ...workData, workChallenges: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar Sección
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
