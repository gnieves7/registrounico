import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Save, Loader2 } from "lucide-react";
import type { Psychobiography, PsychobiographyUpdate } from "@/hooks/usePsychobiography";

interface PersonalDataSectionProps {
  data: Psychobiography | null;
  onSave: (updates: PsychobiographyUpdate) => Promise<boolean>;
  isSaving: boolean;
}

export function PersonalDataSection({ data, onSave, isSaving }: PersonalDataSectionProps) {
  const [formData, setFormData] = useState({
    birth_date: "",
    birth_place: "",
    nationality: "",
    address: "",
    education_level: "",
    occupation: "",
    marital_status: "",
  });

  useEffect(() => {
    if (data) {
      setFormData({
        birth_date: data.birth_date || "",
        birth_place: data.birth_place || "",
        nationality: data.nationality || "",
        address: data.address || "",
        education_level: data.education_level || "",
        occupation: data.occupation || "",
        marital_status: data.marital_status || "",
      });
    }
  }, [data]);

  const handleSave = async () => {
    await onSave({
      birth_date: formData.birth_date || null,
      birth_place: formData.birth_place || null,
      nationality: formData.nationality || null,
      address: formData.address || null,
      education_level: formData.education_level || null,
      occupation: formData.occupation || null,
      marital_status: formData.marital_status || null,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Datos Personales
        </CardTitle>
        <CardDescription>
          Información básica sobre ti. Esta información nos ayuda a conocerte mejor.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth_place">Lugar de Nacimiento</Label>
            <Input
              id="birth_place"
              placeholder="Ciudad, País"
              value={formData.birth_place}
              onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nacionalidad</Label>
            <Input
              id="nationality"
              placeholder="Tu nacionalidad"
              value={formData.nationality}
              onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marital_status">Estado Civil</Label>
            <Select
              value={formData.marital_status}
              onValueChange={(value) => setFormData({ ...formData, marital_status: value })}
            >
              <SelectTrigger id="marital_status">
                <SelectValue placeholder="Selecciona tu estado civil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soltero">Soltero/a</SelectItem>
                <SelectItem value="casado">Casado/a</SelectItem>
                <SelectItem value="union_libre">Unión Libre</SelectItem>
                <SelectItem value="divorciado">Divorciado/a</SelectItem>
                <SelectItem value="viudo">Viudo/a</SelectItem>
                <SelectItem value="separado">Separado/a</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education_level">Nivel Educativo</Label>
            <Select
              value={formData.education_level}
              onValueChange={(value) => setFormData({ ...formData, education_level: value })}
            >
              <SelectTrigger id="education_level">
                <SelectValue placeholder="Selecciona tu nivel educativo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primaria">Primaria</SelectItem>
                <SelectItem value="secundaria">Secundaria</SelectItem>
                <SelectItem value="preparatoria">Preparatoria/Bachillerato</SelectItem>
                <SelectItem value="tecnico">Técnico/Tecnológico</SelectItem>
                <SelectItem value="universitario">Universitario</SelectItem>
                <SelectItem value="posgrado">Posgrado</SelectItem>
                <SelectItem value="doctorado">Doctorado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation">Ocupación Actual</Label>
            <Input
              id="occupation"
              placeholder="Tu ocupación o profesión"
              value={formData.occupation}
              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Dirección Actual</Label>
          <Textarea
            id="address"
            placeholder="Tu dirección completa"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            rows={2}
          />
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
