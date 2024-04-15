"use client";
import { TbMusic, TbX } from "react-icons/tb";
import { MusicWavesIndicator } from "./music-waves-indicator";
import { useEffect, useRef } from "react";

export const MusicFile: React.FC<{
  id: string;
  fileName: string;
  onDelete?: (id: string) => void;
  isCurrentMusic: boolean;
  isPlaying: boolean;
}> = ({ id, fileName, onDelete, isCurrentMusic, isPlaying }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleDelete = () => {
    onDelete?.(id);
  };

  useEffect(() => {
    if (isCurrentMusic) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [isCurrentMusic]);

  return (
    <div ref={ref} className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="grid size-8 shrink-0 place-items-center overflow-hidden rounded border border-neutral-600 bg-neutral-700 text-neutral-100">
          {isCurrentMusic ? (
            <MusicWavesIndicator playing={isPlaying} />
          ) : (
            <TbMusic className="text-[16px]" />
          )}
        </div>
        <div className="break-all text-sm">{fileName}</div>
      </div>
      {onDelete && (
        <button
          className="grid size-6 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/15 hover:text-neutral-300"
          onClick={handleDelete}
        >
          <TbX />
        </button>
      )}
    </div>
  );
};
