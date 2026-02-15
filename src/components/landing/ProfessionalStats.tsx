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
      <span className="text-3xl font-bold text-primary md:text-4xl tabular-nums">
        {count}
      </span>
      <span className="mt-1 text-center text-xs font-medium text-muted-foreground md:text-sm">
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
    <div className="flex flex-wrap items-center justify-center gap-8 py-4">
      {stats.map((stat, index) => (
        <AnimatedStat key={stat.id} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default ProfessionalStats;
