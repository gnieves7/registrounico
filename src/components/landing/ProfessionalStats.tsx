import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Stat {
  id: string;
  stat_key: string;
  stat_value: number;
  stat_label: string;
  sort_order: number;
}

const useCountUp = (target: number, duration = 2000, startDelay = 0) => {
  const [count, setCount] = useState(0);
  const hasStarted = useRef(false);

  const start = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const startTime = performance.now() + startDelay;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) {
        requestAnimationFrame(animate);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target, duration, startDelay]);

  return { count, start };
};

const AnimatedStat = ({ stat, index }: { stat: Stat; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { count, start } = useCountUp(stat.stat_value, 2000, index * 200);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center animate-fade-in"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 md:h-28 md:w-28">
        <span className="text-2xl font-bold text-primary md:text-3xl tabular-nums">
          {count}
        </span>
      </div>
      <span className="mt-2 text-center text-xs font-medium text-muted-foreground md:text-sm max-w-[120px]">
        {stat.stat_label}
      </span>
    </div>
  );
};

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
    <div className="space-y-4 py-4">
      <h3 className="text-center text-lg font-semibold text-foreground md:text-xl">
        Intervenciones hasta el momento
      </h3>
      <div className="flex flex-wrap items-start justify-center gap-6 md:gap-0">
        {stats.map((stat, index) => (
          <div key={stat.id} className="flex items-start">
            <AnimatedStat stat={stat} index={index} />
            {index < stats.length - 1 && (
              <div className="mx-4 mt-4 hidden h-20 w-px bg-border md:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalStats;
