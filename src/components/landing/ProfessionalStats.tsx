import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stat {
  id: string;
  stat_key: string;
  stat_value: number;
  stat_label: string;
  sort_order: number;
}

const ProfessionalStats = () => {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from("professional_stats")
        .select("*")
        .order("sort_order");
      if (data) setStats(data);
    };
    fetchStats();
  }, []);

  if (stats.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="flex flex-col items-center animate-fade-in"
          style={{ animationDelay: `${index * 150}ms` }}
        >
          <span className="text-3xl font-bold text-primary md:text-4xl">
            {stat.stat_value}
          </span>
          <span className="mt-1 text-center text-xs font-medium text-muted-foreground md:text-sm">
            {stat.stat_label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProfessionalStats;
