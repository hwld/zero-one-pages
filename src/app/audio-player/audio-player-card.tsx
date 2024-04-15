import {
  TbDevices,
  TbList,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
  TbQuestionMark,
  TbRewindBackward10,
  TbRewindForward10,
  TbVolume,
} from "react-icons/tb";
import { Card } from "./card";
import { SubButton } from "./sub-button";
import { Slider } from "./slider";
import { useAudioContext } from "./audio/audio-provider";
import { Music } from "./page";
import Image from "next/image";

export type MusicNavigationDirection = "first" | "prev" | "next" | "last";

type Props = {
  currentMusic: Music | undefined;
  hasPrev: boolean;
  hasNext: boolean;
  onMusicChange: (dir: MusicNavigationDirection) => void;
};
export const AudioPlayerCard: React.FC<Props> = ({
  currentMusic,
  hasPrev,
  hasNext,
  onMusicChange,
}) => {
  const { audioRef, state, controls, handlers } = useAudioContext();

  const handleMusicChange = (dir: MusicNavigationDirection) => {
    onMusicChange(dir);
    window.setTimeout(() => {
      controls.changePlaying(true);
    }, 0);
  };

  return (
    <Card>
      <div className="flex h-full flex-col gap-8">
        <div className="relative min-h-[230px] w-full overflow-hidden rounded-lg bg-neutral-300 text-neutral-900">
          <Image
            className="object-cover"
            src={`https://api.dicebear.com/8.x/thumbs/svg?seed=${currentMusic?.fileName}`}
            alt="thumbnail"
            fill
          />
          <div className="absolute bottom-2 right-2 max-w-[60%] items-center truncate rounded-full border border-neutral-300 bg-neutral-100 px-2 text-sm shadow">
            {currentMusic?.fileName}
          </div>
        </div>
        <audio ref={audioRef} {...handlers}></audio>
        <div className="flex grow flex-col items-center justify-between gap-2">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-center gap-1">
              <SubButton
                disabled={!hasPrev || !state.isReady}
                onClick={() => handleMusicChange("first")}
              >
                <TbPlayerTrackPrevFilled />
              </SubButton>
              <SubButton
                disabled={!hasPrev || !state.isReady}
                onClick={() => handleMusicChange("prev")}
              >
                <TbPlayerSkipBackFilled />
              </SubButton>
              <SubButton
                disabled={!state.isReady}
                onClick={() => {
                  controls.changeCurrentTime(state.currentTime - 10);
                }}
              >
                <TbRewindBackward10 />
              </SubButton>
              <button
                disabled={!state.isReady}
                className="grid size-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-[25px] text-neutral-900 transition-colors hover:bg-neutral-300 disabled:opacity-50"
                onClick={() => {
                  controls.changePlaying(!state.playing);
                }}
              >
                {state.playing ? (
                  <TbPlayerPauseFilled />
                ) : (
                  <TbPlayerPlayFilled />
                )}
              </button>
              <SubButton
                disabled={!state.isReady}
                onClick={() => {
                  controls.changeCurrentTime(state.currentTime + 10);
                }}
              >
                <TbRewindForward10 />
              </SubButton>
              <SubButton
                disabled={!hasNext || !state.isReady}
                onClick={() => handleMusicChange("next")}
              >
                <TbPlayerSkipForwardFilled />
              </SubButton>
              <SubButton
                disabled={!hasNext || !state.isReady}
                onClick={() => handleMusicChange("last")}
              >
                <TbPlayerTrackNextFilled />
              </SubButton>
            </div>
            <div className="flex w-full items-center gap-2">
              <Time total={state.currentTime} />
              <Slider
                max={state.duration}
                min={0}
                step={state.duration / 1000}
                value={state.currentTime}
                onValueChange={(value) => {
                  controls.seek(value);
                  controls.changeCurrentTime(value);
                }}
                onValueCommit={() => {
                  controls.seekEnd();
                }}
              />
              <Time total={state.duration} />
            </div>
          </div>
          <div className="flex w-full justify-between gap-2">
            <div className="flex items-center">
              <SubButton>
                <TbVolume />
              </SubButton>
              <div className="w-[120px]">
                <Slider
                  max={1}
                  min={0}
                  step={0.01}
                  value={state.volume}
                  onValueChange={(value) => {
                    controls.changeVolume(value);
                  }}
                />
              </div>
            </div>
            <div className="flex items-center">
              <SubButton>
                <TbDevices />
              </SubButton>
              <SubButton>
                <TbList />
              </SubButton>
              <SubButton>
                <TbQuestionMark />
              </SubButton>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const Time: React.FC<{ total: number }> = ({ total }) => {
  const minuts = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return (
    <div className="text-sm tabular-nums text-neutral-400">
      {minuts}:{seconds}
    </div>
  );
};
