"use client";
import {
  Slider as SliderPrimitive,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";
import { ComponentPropsWithoutRef, ReactNode, useState } from "react";
import {
  TbDevices,
  TbList,
  TbMusic,
  TbMusicPlus,
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
  TbX,
} from "react-icons/tb";
import { useAudio } from "./use-audio";

type Music = { file: File; url: string; id: string };

const Page: React.FC = () => {
  const [musics, setMusics] = useState<Music[]>([]);
  const { audioRef, state, controls, handlers } = useAudio({
    initialVolume: 0.3,
  });

  return (
    <div
      className="grid h-[100dvh] w-full place-items-center bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <div className="grid grid-cols-[400px_400px] grid-rows-[550px] gap-4">
        <Card>
          <div className="flex h-full flex-col gap-8">
            <div className="min-h-[230px] w-full rounded-lg bg-neutral-300" />
            <audio
              ref={audioRef}
              src={musics.length !== 0 ? musics[0].url : undefined}
              {...handlers}
            />
            <div className="flex grow flex-col items-center justify-between gap-2">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full items-center justify-center gap-1">
                  <SubButton>
                    <TbPlayerTrackPrevFilled />
                  </SubButton>
                  <SubButton>
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
                  <SubButton>
                    <TbPlayerSkipForwardFilled />
                  </SubButton>
                  <SubButton>
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
        <div className="flex h-min max-h-full flex-col">
          <Card>
            <div className="flex min-h-0 grow flex-col gap-4">
              <div
                className="grid h-[230px] w-full shrink-0 place-items-center rounded-lg border-2 border-dashed border-neutral-500 bg-white/5"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const fileCount = e.dataTransfer.files.length;
                  let musics = [...new Array(fileCount)]
                    .map((_, i) => e.dataTransfer.files[i])
                    .filter((f) => f.type.startsWith("audio/"))
                    .map((f): Music => {
                      return {
                        file: f,
                        url: URL.createObjectURL(f),
                        id: crypto.randomUUID(),
                      };
                    });
                  setMusics((ms) => [...ms, ...musics]);
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <TbMusicPlus className="size-[40px]" />
                  <div className="text-center text-sm">
                    ここに音声をドラッグ&ドロップしてください
                  </div>
                  <div className="text-center text-xs text-neutral-400">
                    音声はサーバーにアップロードされることはありません。
                    <br />
                    画面を更新するとリセットされます。
                  </div>
                </div>
              </div>

              {musics.length > 0 && (
                <div className="flex grow flex-col gap-2 overflow-hidden">
                  <div className="px-2 text-neutral-400">music files</div>
                  <div className="flex grow flex-col gap-4 overflow-auto rounded-lg px-2">
                    {musics.map((m) => {
                      return (
                        <MusicFile
                          key={m.id}
                          music={m}
                          onDelete={(id) => {
                            setMusics((ms) => ms.filter((m) => m.id !== id));
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const MusicFile: React.FC<{ music: Music; onDelete: (id: string) => void }> = ({
  music,
  onDelete,
}) => {
  const handleDelete = () => {
    onDelete(music.id);
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="grid size-8 shrink-0 place-items-center rounded bg-neutral-100">
          <TbMusic className="text-[16px] text-neutral-800" />
        </div>
        <div className="text-sm">{music.file.name}</div>
      </div>
      <button
        className="grid size-6 shrink-0 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/15 hover:text-neutral-300"
        onClick={handleDelete}
      >
        <TbX />
      </button>
    </div>
  );
};

const Card: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-neutral-600 bg-neutral-800 p-4 shadow">
      {children}
    </div>
  );
};

const Slider: React.FC<{
  max?: number;
  min?: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  onValueCommit?: () => void;
}> = ({
  max = 100,
  min = 0,
  step = 1,
  value,
  onValueChange,
  onValueCommit,
}) => {
  const handleValueChange = (value: number[]) => {
    onValueChange(value[0]);
  };

  return (
    <SliderPrimitive
      max={max}
      min={min}
      step={step}
      className="group relative flex h-4 grow cursor-pointer items-center"
      value={[value]}
      onValueChange={handleValueChange}
      onValueCommit={onValueCommit}
    >
      <SliderTrack className="relative h-[4px] w-full rounded-full bg-white/15">
        <SliderRange className="absolute h-full rounded-full bg-neutral-100" />
      </SliderTrack>
      <SliderThumb className="block size-4 rounded-full bg-neutral-100 opacity-0 transition-[opacity_colors_shadow] hover:bg-neutral-300 focus:shadow-[0_0_0_5px] focus:shadow-white/30 focus:outline-none group-hover:opacity-100" />
    </SliderPrimitive>
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

const SubButton: React.FC<
  { children: ReactNode } & ComponentPropsWithoutRef<"button">
> = ({ children, ...props }) => {
  return (
    <button
      className="grid size-8 shrink-0 place-items-center rounded-full text-[18px] transition-colors hover:bg-white/15"
      {...props}
    >
      {children}
    </button>
  );
};

export default Page;
