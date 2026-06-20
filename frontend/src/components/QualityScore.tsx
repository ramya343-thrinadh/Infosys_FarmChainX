import { motion } from "framer-motion";

interface QualityScoreProps {
  score: number; // 0-100
  label?: string;
}

const QualityScore = ({ score, label = "Quality Score" }: QualityScoreProps) => {
  const color = score >= 80 ? "text-success" : score >= 50 ? "text-warning" : "text-destructive";
  const bgColor = score >= 80 ? "stroke-success" : score >= 50 ? "stroke-warning" : "stroke-destructive";
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" className="stroke-muted" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="45" fill="none"
            className={bgColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-bold ${color}`}>{score}%</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );
};

export default QualityScore;
