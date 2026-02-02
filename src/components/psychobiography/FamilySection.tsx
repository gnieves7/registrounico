import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Users, Save, Loader2, Plus, Trash2 } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate, FamilyData } from "@/hooks/usePsychobiography";
import type { Json } from "@/integrations/supabase/types";

interface FamilySectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function FamilySection({ data, onSave, isSaving }: FamilySectionProps) {
  const [formData, setFormData] = useState<FamilyData>({
    parents: {
      father: { name: "", age: undefined, occupation: "", relationship: "", alive: true },
      mother: { name: "", age: undefined, occupation: "", relationship: "", alive: true },
    },
    siblings: [],
    children: [],
    familyDynamics: "",
    significantRelationships: "",
  });

  useEffect(() => {
    if (data?.family_data) {
      const familyData = data.family_data as unknown as FamilyData;
      setFormData({
        parents: familyData.parents || {
          father: { name: "", age: undefined, occupation: "", relationship: "", alive: true },
          mother: { name: "", age: undefined, occupation: "", relationship: "", alive: true },
        },
        siblings: familyData.siblings || [],
        children: familyData.children || [],
        familyDynamics: familyData.familyDynamics || "",
        significantRelationships: familyData.significantRelationships || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      family_data: formData as unknown as Json,
    });
  };

  const addSibling = () => {
    setFormData({
      ...formData,
      siblings: [...(formData.siblings || []), { name: "", age: undefined, relationship: "" }],
    });
  };

  const removeSibling = (index: number) => {
    setFormData({
      ...formData,
      siblings: formData.siblings?.filter((_, i) => i !== index),
    });
  };

  const addChild = () => {
    setFormData({
      ...formData,
      children: [...(formData.children || []), { name: "", age: undefined }],
    });
  };

  const removeChild = (index: number) => {
    setFormData({
      ...formData,
      children: formData.children?.filter((_, i) => i !== index),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Datos Familiares
        </CardTitle>
        <CardDescription>
          Información sobre tu familia y relaciones significativas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Father */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Padre</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                placeholder="Nombre del padre"
                value={formData.parents?.father?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      father: { ...formData.parents?.father, name: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Edad</Label>
              <Input
                type="number"
                placeholder="Edad"
                value={formData.parents?.father?.age || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      father: { ...formData.parents?.father, age: parseInt(e.target.value) || undefined },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Ocupación</Label>
              <Input
                placeholder="Ocupación"
                value={formData.parents?.father?.occupation || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      father: { ...formData.parents?.father, occupation: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={formData.parents?.father?.alive ?? true}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      father: { ...formData.parents?.father, alive: checked },
                    },
                  })
                }
              />
              <Label>Vivo</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Relación con tu padre</Label>
            <Textarea
              placeholder="Describe tu relación con tu padre..."
              value={formData.parents?.father?.relationship || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parents: {
                    ...formData.parents,
                    father: { ...formData.parents?.father, relationship: e.target.value },
                  },
                })
              }
              rows={2}
            />
          </div>
        </div>

        {/* Mother */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Madre</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                placeholder="Nombre de la madre"
                value={formData.parents?.mother?.name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      mother: { ...formData.parents?.mother, name: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Edad</Label>
              <Input
                type="number"
                placeholder="Edad"
                value={formData.parents?.mother?.age || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      mother: { ...formData.parents?.mother, age: parseInt(e.target.value) || undefined },
                    },
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Ocupación</Label>
              <Input
                placeholder="Ocupación"
                value={formData.parents?.mother?.occupation || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      mother: { ...formData.parents?.mother, occupation: e.target.value },
                    },
                  })
                }
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch
                checked={formData.parents?.mother?.alive ?? true}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    parents: {
                      ...formData.parents,
                      mother: { ...formData.parents?.mother, alive: checked },
                    },
                  })
                }
              />
              <Label>Viva</Label>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Relación con tu madre</Label>
            <Textarea
              placeholder="Describe tu relación con tu madre..."
              value={formData.parents?.mother?.relationship || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  parents: {
                    ...formData.parents,
                    mother: { ...formData.parents?.mother, relationship: e.target.value },
                  },
                })
              }
              rows={2}
            />
          </div>
        </div>

        {/* Siblings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Hermanos/as</h3>
            <Button variant="outline" size="sm" onClick={addSibling}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
          {formData.siblings?.map((sibling, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Nombre"
                  value={sibling.name || ""}
                  onChange={(e) => {
                    const newSiblings = [...(formData.siblings || [])];
                    newSiblings[index] = { ...sibling, name: e.target.value };
                    setFormData({ ...formData, siblings: newSiblings });
                  }}
                />
              </div>
              <div className="w-24 space-y-2">
                <Label>Edad</Label>
                <Input
                  type="number"
                  placeholder="Edad"
                  value={sibling.age || ""}
                  onChange={(e) => {
                    const newSiblings = [...(formData.siblings || [])];
                    newSiblings[index] = { ...sibling, age: parseInt(e.target.value) || undefined };
                    setFormData({ ...formData, siblings: newSiblings });
                  }}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Relación</Label>
                <Input
                  placeholder="Describe la relación"
                  value={sibling.relationship || ""}
                  onChange={(e) => {
                    const newSiblings = [...(formData.siblings || [])];
                    newSiblings[index] = { ...sibling, relationship: e.target.value };
                    setFormData({ ...formData, siblings: newSiblings });
                  }}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeSibling(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Children */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Hijos/as</h3>
            <Button variant="outline" size="sm" onClick={addChild}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar
            </Button>
          </div>
          {formData.children?.map((child, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Nombre"
                  value={child.name || ""}
                  onChange={(e) => {
                    const newChildren = [...(formData.children || [])];
                    newChildren[index] = { ...child, name: e.target.value };
                    setFormData({ ...formData, children: newChildren });
                  }}
                />
              </div>
              <div className="w-24 space-y-2">
                <Label>Edad</Label>
                <Input
                  type="number"
                  placeholder="Edad"
                  value={child.age || ""}
                  onChange={(e) => {
                    const newChildren = [...(formData.children || [])];
                    newChildren[index] = { ...child, age: parseInt(e.target.value) || undefined };
                    setFormData({ ...formData, children: newChildren });
                  }}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeChild(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {/* Family Dynamics */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Dinámica Familiar</Label>
            <Textarea
              placeholder="Describe cómo es la dinámica en tu familia, cómo se comunican, resuelven conflictos, etc."
              value={formData.familyDynamics || ""}
              onChange={(e) => setFormData({ ...formData, familyDynamics: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Relaciones Significativas</Label>
            <Textarea
              placeholder="Describe otras relaciones familiares importantes (abuelos, tíos, primos, etc.)"
              value={formData.significantRelationships || ""}
              onChange={(e) => setFormData({ ...formData, significantRelationships: e.target.value })}
              rows={3}
            />
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
}
