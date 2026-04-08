import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AdminTestResultsModal } from "@/components/admin/AdminTestResultsModal";

interface TestRecord {
  id: string;
  user_id: string;
  test_type: string;
  is_complete: boolean;
  total_questions_answered: number;
  total_questions: number;
  created_at: string;
  updated_at: string;
  user_name?: string;
  user_email?: string;
}

export function AdminTestsSection() {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [selectedTest, setSelectedTest] = useState<TestRecord | null>(null);

  useEffect(() => {
    fetchAllTests();
  }, []);

  const fetchAllTests = async () => {
    try {
      const [mmpi2Res, mcmi3Res, mbtiRes, scl90rRes, profilesRes] = await Promise.all([
        supabase.from("mmpi2_tests").select("id, user_id, is_complete, total_questions_answered, created_at, updated_at"),
        supabase.from("mcmi3_tests").select("id, user_id, is_complete, total_questions_answered, created_at, updated_at"),
        supabase.from("mbti_tests").select("id, user_id, is_complete, created_at, updated_at"),
        supabase.from("scl90r_tests").select("id, user_id, is_complete, total_questions_answered, created_at, updated_at"),
        supabase.from("profiles").select("user_id, full_name, email"),
      ]);

      const profileMap = new Map((profilesRes.data || []).map((p) => [p.user_id, p]));

      const mapTests = (data: any[] | null, type: string, totalQ: number): TestRecord[] =>
        (data || []).map((t) => ({
          id: t.id,
          user_id: t.user_id,
          test_type: type,
          is_complete: t.is_complete || false,
          total_questions_answered: t.total_questions_answered || 0,
          total_questions: totalQ,
          created_at: t.created_at,
          updated_at: t.updated_at,
          user_name: profileMap.get(t.user_id)?.full_name || undefined,
          user_email: profileMap.get(t.user_id)?.email || undefined,
        }));

      const all = [
        ...mapTests(mmpi2Res.data, "MMPI-2", 567),
        ...mapTests(mcmi3Res.data, "MCMI-III", 175),
        ...mapTests(mbtiRes.data, "MBTI", 70),
        ...mapTests(scl90rRes.data, "SCL-90-R", 90),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setTests(all);
    } catch (e) {
      console.error("Error fetching tests:", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filterType === "all" ? tests : tests.filter((t) => t.test_type === filterType);
  const inProgress = filtered.filter((t) => !t.is_complete);
  const completed = filtered.filter((t) => t.is_complete);

  const TestTable = ({ items, showProgress }: { items: TestRecord[]; showProgress?: boolean }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>Test</TableHead>
          {showProgress && <TableHead>Progreso</TableHead>}
          <TableHead className="hidden md:table-cell">Fecha</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Sin registros</TableCell></TableRow>
        ) : (
          items.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <div>
                  <p className="text-sm font-medium">{t.user_name || "Sin nombre"}</p>
                  <p className="text-xs text-muted-foreground">{t.user_email}</p>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{t.test_type}</Badge>
              </TableCell>
              {showProgress && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={t.total_questions > 0 ? (t.total_questions_answered / t.total_questions) * 100 : 0} className="h-2 w-20" />
                    <span className="text-xs text-muted-foreground">
                      {t.total_questions_answered}/{t.total_questions}
                    </span>
                  </div>
                </TableCell>
              )}
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {format(new Date(t.created_at), "dd MMM yyyy", { locale: es })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    title="Ver resultados"
                    onClick={() => setSelectedTest(t)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {t.is_complete && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      title="Ver resultados e informe"
                      onClick={() => setSelectedTest(t)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Tipo de test" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="MMPI-2">MMPI-2</SelectItem>
            <SelectItem value="MCMI-III">MCMI-III</SelectItem>
            <SelectItem value="MBTI">MBTI</SelectItem>
            <SelectItem value="SCL-90-R">SCL-90-R</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline">{filtered.length} tests totales</Badge>
      </div>

      <Tabs defaultValue="in-progress">
        <TabsList>
          <TabsTrigger value="in-progress">En curso ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="completed">Completados ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="in-progress">
          <Card>
            <CardContent className="pt-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-border/30 animate-pulse">
                      <div className="flex-1 space-y-1.5"><div className="h-3.5 w-32 bg-muted rounded" /><div className="h-3 w-48 bg-muted rounded" /></div>
                      <div className="h-5 w-16 bg-muted rounded-full" />
                    </div>
                  ))}
                </div>
              ) : <TestTable items={inProgress} showProgress />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-border/30 animate-pulse">
                      <div className="flex-1 space-y-1.5"><div className="h-3.5 w-32 bg-muted rounded" /><div className="h-3 w-48 bg-muted rounded" /></div>
                      <div className="h-5 w-16 bg-muted rounded-full" />
                    </div>
                  ))}
                </div>
              ) : <TestTable items={completed} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Results Modal */}
      {selectedTest && (
        <AdminTestResultsModal
          open={!!selectedTest}
          onOpenChange={(open) => { if (!open) setSelectedTest(null); }}
          testId={selectedTest.id}
          testType={selectedTest.test_type}
          userId={selectedTest.user_id}
          userName={selectedTest.user_name}
        />
      )}
    </div>
  );
}
