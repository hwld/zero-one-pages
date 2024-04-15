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
import { useAudio } from "./use-audio";
import { Slider } from "./slider";
import { useEffect, useState } from "react";

export type MusicNavigationDirection = "first" | "prev" | "next" | "last";

type Props = {
  src?: string;
  hasPrev: boolean;
  hasNext: boolean;
  onMusicChange: (dir: MusicNavigationDirection) => void;
};
export const CardAudioPlayer: React.FC<Props> = ({
  src: _src,
  hasPrev,
  hasNext,
  onMusicChange,
}) => {
  const [src, setSrc] = useState<string | undefined>(undefined);
  const { audioRef, state, controls, handlers } = useAudio({
    initialVolume: 0.1,
  });

  // srcを直接渡すと、事前に音声を読み込んでしまうので様々なハンドラが呼ばれなくなるためレンダリング後にsrcを設定する。
  // preload属性を使用して再生されたときに読み込むことも考えたが、再生する前にシークバーを動かすとエラーになってしまう
  useEffect(() => {
    setSrc(_src);
  }, [_src]);

  const handleMusicChange = (dir: MusicNavigationDirection) => {
    onMusicChange(dir);
    window.setTimeout(() => {
      controls.changePlaying(true);
    }, 0);
  };

  return (
    <Card>
      <div className="flex h-full flex-col gap-8">
        <div className="min-h-[230px] w-full rounded-lg bg-neutral-300" />
        <audio ref={audioRef} src={src} {...handlers} />
        <div className="flex grow flex-col items-center justify-between gap-2">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-center gap-1">
              <SubButton
                disabled={!hasPrev}
                onClick={() => handleMusicChange("first")}
              >
                <TbPlayerTrackPrevFilled />
              </SubButton>
              <SubButton
                disabled={!hasPrev}
                onClick={() => handleMusicChange("prev")}
              >
                <TbPlayerSkipBackFilled />
              </SubButton>
              <SubButton
                onClick={() => {
                  controls.changeCurrentTime(state.currentTime - 10);
                }}
              >
                <TbRewindBackward10 />
              </SubButton>
              <button
                className="grid size-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-[25px] text-neutral-900 transition-colors hover:bg-neutral-300"
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
                onClick={() => {
                  controls.changeCurrentTime(state.currentTime + 10);
                }}
              >
                <TbRewindForward10 />
              </SubButton>
              <SubButton
                disabled={!hasNext}
                onClick={() => handleMusicChange("next")}
              >
                <TbPlayerSkipForwardFilled />
              </SubButton>
              <SubButton
                disabled={!hasNext}
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
