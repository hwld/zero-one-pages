import { motion } from "framer-motion";

const delays = [0.1, 0.4, 0.2, 0.3];
export const MusicWavesIndicator: React.FC = () => {
  return (
    <div className="grid h-[17px] w-[15px] grid-cols-4 items-end justify-between gap-[1px] overflow-hidden bg-transparent">
      {[...new Array(4)].map((_, i) => {
        return (
          <motion.div
            key={i}
            initial={{ y: "70%" }}
            animate={{
              y: ["70%", "20%", "70%"],
              transition: { repeat: Infinity, delay: delays[i] },
            }}
            className="h-full rounded-b-none rounded-t-md bg-sky-400 py-[2px]"
          />
        );
      })}
    </div>
  );
};
