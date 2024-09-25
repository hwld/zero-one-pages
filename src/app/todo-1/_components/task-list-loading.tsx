import { TaskListStateCard } from "./task-list-state-card";

export const TaskListLoading: React.FC = () => {
  return (
    <TaskListStateCard>
      <div className="flex h-min items-center gap-3">
        <BounceDot delay={0} />
        <BounceDot delay={0.2} />
        <BounceDot delay={0.4} />
      </div>
    </TaskListStateCard>
  );
};

export const BounceDot: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <div
      className="size-2 rounded-full bg-neutral-700 text-2xl"
      style={{
        animation: "pulseScale 0.8s infinite",
        animationDelay: `${delay}s`,
      }}
    >
      <style>
        {`
          @keyframes pulseScale {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.4); }
          }
        `}
      </style>
    </div>
  );
};
