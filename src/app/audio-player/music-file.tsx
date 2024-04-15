"use client";
import {
  TbMusic,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbX,
} from "react-icons/tb";
import { MusicWavesIndicator } from "./music-waves-indicator";
import { ComponentPropsWithoutRef, ReactNode, useEffect, useRef } from "react";
import clsx from "clsx";
import { IconType } from "react-icons/lib";

export const MusicFile: React.FC<{
  id: string;
  fileName: string;
  onDelete?: (id: string) => void;
  isCurrentMusic: boolean;
  isPlaying: boolean;
  onPlay: (id: string) => void;
  onPause: () => void;
}> = ({
  id,
  fileName,
  onDelete,
  isCurrentMusic,
  isPlaying,
  onPlay,
  onPause,
}) => {
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

  const handlePlay = () => {
    onPlay(id);
  };

  return (
    <div ref={ref} className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {isCurrentMusic && isPlaying ? (
          <MusicFileButton hoverIcon={TbPlayerPauseFilled} onClick={onPause}>
            <MusicWavesIndicator />
          </MusicFileButton>
        ) : (
          <MusicFileButton hoverIcon={TbPlayerPlayFilled} onClick={handlePlay}>
            <TbMusic
              className={clsx(
                "text-[16px]",
                isCurrentMusic ? "text-sky-400" : "text-neutral-100",
              )}
            />
          </MusicFileButton>
        )}
        <div
          className={clsx(
            "break-all text-sm",
            isCurrentMusic ? "text-sky-400" : "text-neutral-100",
          )}
        >
          {fileName}
        </div>
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

const MusicFileButton: React.FC<
  {
    children: ReactNode;
    hoverIcon: IconType;
  } & ComponentPropsWithoutRef<"button">
> = ({ children, hoverIcon: HoverIcon, ...props }) => {
  return (
    <button
      {...props}
      className={
        "group relative grid size-8 shrink-0 place-items-center overflow-hidden rounded border border-neutral-600 bg-neutral-800 text-neutral-100"
      }
    >
      {children}
      <div className="absolute inset-0 grid place-items-center bg-neutral-800 text-[18px] text-sky-400 opacity-0 transition-opacity group-hover:opacity-100">
        <HoverIcon />
      </div>
    </button>
  );
};
