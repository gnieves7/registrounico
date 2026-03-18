import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ReferenceArea } from "recharts";
import { Activity, TrendingUp } from "lucide-react";
import {
  VALIDITY_SCALES, CLINICAL_SCALES,
  calculateRawScore, calculateTScore,
} from "@/data/mmpi2ScoringData";

interface Mmpi2Response {
  question_number: number;
  answer: 'V' | 'F';
}

interface Mmpi2ProfileChartProps {
  responses: Mmpi2Response[];
  totalAnswered: number;
  gender?: 'male' | 'female';
  onGenderChange?: (gender: 'male' | 'female') => void;
}

export const Mmpi2ProfileChart = ({ responses, totalAnswered, gender = 'male', onGenderChange }: Mmpi2ProfileChartProps) => {
  const [internalGender, setInternalGender] = useState<'male' | 'female'>(gender);
  const activeGender = onGenderChange ? gender : internalGender;
  const handleGenderChange = (v: string) => {
    const g = v as 'male' | 'female';
    if (onGenderChange) onGenderChange(g);
    else setInternalGender(g);
  };

  const chartData = useMemo(() => {
    if (responses.length < 100) return { validity: [], clinical: [] };

    const responseMap = new Map<number, 'V' | 'F'>(
      responses.map(r => [r.question_number, r.answer])
    );

    const kScale = VALIDITY_SCALES.find(s => s.code === 'K')!;
    const kRaw = calculateRawScore(responseMap, kScale);

    const validity = VALIDITY_SCALES.map(scale => {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, activeGender);
      return { name: scale.code, tScore: t, raw, fullName: scale.name };
    });

    const clinical = CLINICAL_SCALES.map(scale => {
      const raw = calculateRawScore(responseMap, scale);
      const t = calculateTScore(raw, scale.code, activeGender, scale.kCorrection ? kRaw : undefined, scale.kCorrection);
      return { name: scale.code, tScore: t, raw, fullName: scale.name };
    });

    return { validity, clinical };
  }, [responses, activeGender]);

  if (responses.length < 100) return null;

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border rounded-lg p-2 shadow-lg text-xs">
        <p className="font-semibold">{d.name} - {d.fullName}</p>
        <p>T-Score: <span className="font-mono font-bold">{d.tScore}</span></p>
        <p className="text-muted-foreground">PD: {d.raw}</p>
      </div>
    );
  };

  const renderChart = (data: typeof chartData.validity, title: string, description: string, icon: React.ReactNode) => (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            {/* @ts-ignore - recharts type compat */}
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            {/* @ts-ignore */}
            <YAxis domain={[30, 120]} tick={{ fontSize: 10 }} ticks={[30, 40, 50, 65, 76, 90, 100, 110, 120]} />
            {/* @ts-ignore */}
            <Tooltip content={<CustomTooltip />} />
            {/* @ts-ignore */}
            <ReferenceArea y1={30} y2={50} fill="hsl(var(--primary))" fillOpacity={0.04} />
            {/* @ts-ignore */}
            <ReferenceArea y1={50} y2={65} fill="hsl(var(--primary))" fillOpacity={0.06} />
            {/* @ts-ignore */}
            <ReferenceArea y1={65} y2={76} fill="hsl(45, 93%, 58%)" fillOpacity={0.1} />
            {/* @ts-ignore */}
            <ReferenceArea y1={76} y2={120} fill="hsl(var(--destructive))" fillOpacity={0.08} />
            {/* @ts-ignore */}
            <ReferenceLine y={50} stroke="hsl(var(--muted-foreground))" strokeDasharray="6 3" strokeWidth={1} />
            {/* @ts-ignore */}
            <ReferenceLine y={65} stroke="hsl(45, 93%, 58%)" strokeDasharray="4 4" strokeWidth={1.5} />
            {/* @ts-ignore */}
            <ReferenceLine y={76} stroke="hsl(var(--destructive))" strokeDasharray="4 4" strokeWidth={1.5} />
            {/* @ts-ignore */}
            <Line
              type="monotone"
              dataKey="tScore"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ r: 5, fill: "hsl(var(--primary))", strokeWidth: 2, stroke: "hsl(var(--background))" }}
              activeDot={{ r: 7, strokeWidth: 2 }}
              name="T-Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Baremos:</span>
        <Select value={activeGender} onValueChange={handleGenderChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Hombres</SelectItem>
            <SelectItem value="female">Mujeres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderChart(
        chartData.validity,
        "Perfil de Escalas de Validez",
        "L (Mentira) · F (Infrecuencia) · K (Corrección)",
        <Activity className="h-4 w-4" />
      )}

      {renderChart(
        chartData.clinical,
        "Perfil de Escalas Clínicas",
        "Hs · D · Hy · Pd · Mf · Pa · Pt · Sc · Ma · Si",
        <TrendingUp className="h-4 w-4" />
      )}
    </div>
  );
};
