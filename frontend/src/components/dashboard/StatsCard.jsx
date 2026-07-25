import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Animated count-up helper component for metric values.
 */
function CountUp({ to, duration = 0.8 }) {
  const [count, setCount] = useState(0);
  const targetStr = String(to || "0");
  const targetNum = parseFloat(targetStr.replace(/[^0-9.]/g, "")) || 0;
  const isPercentage = targetStr.includes("%");
  const isCurrency = targetStr.includes("$") || targetStr.startsWith("$");

  useEffect(() => {
    let start = 0;
    const end = targetNum;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const intervalTime = 16; // ~60 FPS
    const totalSteps = Math.ceil(totalMiliseconds / intervalTime);
    const stepIncrement = (end - start) / totalSteps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= totalSteps) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount((prev) => {
          const next = prev + stepIncrement;
          return next > end ? end : next;
        });
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [targetNum, duration]);

  if (isPercentage) {
    return <span>{Math.round(count)}%</span>;
  }
  if (isCurrency) {
    return <span>${Math.round(count).toLocaleString()}</span>;
  }
  return <span>{Math.round(count).toLocaleString()}</span>;
}

/**
 * StatsCard component displays a metric with custom count-up numbers,
 * active percentage metrics, and a stylized inline SVG sparkline graph.
 */
function StatsCard({ title, value, icon: IconComponent, change, color = "primary" }) {
  const changeStr = String(change || "0%");
  const isPositive = !changeStr.startsWith("-");
  const displayChange = changeStr.startsWith("+") || changeStr.startsWith("-") ? changeStr : `+${changeStr}`;

  // Generate a mock sparkline path based on the title seed to ensure a premium look
  const getSparklinePath = () => {
    const seed = title.charCodeAt(0) || 12;
    const points = [];
    let currentVal = isPositive ? 15 : 30;
    for (let i = 0; i < 7; i++) {
      const step = ((seed + i * 11) % 12) * (isPositive ? 1.2 : -1.2);
      currentVal = Math.max(5, Math.min(35, currentVal + step + (isPositive ? 1.5 : -1.5)));
      points.push(currentVal);
    }
    const width = 90;
    const height = 40;
    const coords = points.map((p, idx) => `${(idx * (width / 6))},${height - p}`);
    return `M ${coords.join(" L ")}`;
  };

  const sparklinePath = getSparklinePath();

  const colorMap = {
    primary: {
      bg: "bg-blue-50/50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30",
      glow: "shadow-blue-500/10",
      accent: "from-blue-500 to-indigo-500",
    },
    success: {
      bg: "bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30",
      glow: "shadow-emerald-500/10",
      accent: "from-emerald-500 to-teal-500",
    },
    warning: {
      bg: "bg-amber-50/50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30",
      glow: "shadow-amber-500/10",
      accent: "from-amber-500 to-orange-500",
    },
    danger: {
      bg: "bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30",
      glow: "shadow-rose-500/10",
      accent: "from-rose-500 to-red-500",
    },
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-[20px] shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between border border-slate-200/40 dark:border-slate-800/30"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            <CountUp to={value} />
          </h3>
        </div>

        {IconComponent && (
          <div className={`p-2.5 rounded-xl border ${selectedColor.bg} ${selectedColor.glow} shadow-sm flex items-center justify-center`}>
            <IconComponent size={20} className="stroke-[2.25]" />
          </div>
        )}
      </div>

      {/* Sparkline & Percentage Area */}
      <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/40">
        <div className="flex items-center gap-1">
          <span
            className={`flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
                : "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30"
            }`}
          >
            {isPositive ? (
              <TrendingUp size={11} className="stroke-[2.5]" />
            ) : (
              <TrendingDown size={11} className="stroke-[2.5]" />
            )}
            {displayChange}
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">vs last month</span>
        </div>

        {/* Sparkline Render */}
        <div className="h-10 w-24">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 90 40">
            <defs>
              <linearGradient id={`sparkGrad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.2" />
                <stop offset="100%" stopColor={isPositive ? "#10B981" : "#EF4444"} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`${sparklinePath} L 90,40 L 0,40 Z`}
              fill={`url(#sparkGrad-${title.replace(/\s+/g, '')})`}
              className="transition-all duration-700"
            />
            <path
              d={sparklinePath}
              fill="none"
              stroke={isPositive ? "#10B981" : "#EF4444"}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-700"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default StatsCard;