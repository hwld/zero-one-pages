import { motion } from "framer-motion";
import { TaskListStatusCard } from "./task-list-status-card";

export const LoadingTasks: React.FC = () => {
  return (
    <TaskListStatusCard>
      <div className="flex h-min items-center gap-2">
        <BounceDot delay={0} />
        <BounceDot delay={0.2} />
        <BounceDot delay={0.4} />
      </div>
    </TaskListStatusCard>
  );
};

const BounceDot: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      className="size-1 rounded-full bg-neutral-700 text-2xl"
      animate={{
        scale: [1, 2, 1],
        transition: { repeat: Infinity, duration: 0.8, delay },
      }}
    />
  );
};
