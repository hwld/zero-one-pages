"use client";
import {
  Slider as SliderPrimitive,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";
import { ReactNode } from "react";
import {
  TbDevices,
  TbList,
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

const Page: React.FC = () => {
  return (
    <div
      className="grid h-[100dvh] w-full place-items-center bg-neutral-900 text-neutral-100"
      style={{ colorScheme: "dark" }}
    >
      <div className="flex h-full max-h-[500px] w-[95%] max-w-[400px] flex-col gap-4 rounded-lg border border-neutral-600 bg-neutral-800 p-4 shadow">
        <div className="h-[300px] w-full rounded-lg bg-neutral-300" />
        <div className="flex grow flex-col items-center justify-between gap-2">
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-center gap-1">
              <SubButton>
                <TbPlayerTrackPrevFilled />
              </SubButton>
              <SubButton>
                <TbPlayerSkipBackFilled />
              </SubButton>
              <SubButton>
                <TbRewindBackward10 />
              </SubButton>
              <button className="grid size-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-[25px] text-neutral-900 transition-colors hover:bg-neutral-300">
                <TbPlayerPlayFilled />
              </button>
              <SubButton>
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
              <Time total={0} />
              <Slider />
              <Time total={100} />
            </div>
          </div>
          <div className="flex w-full justify-between gap-2">
            <div className="flex items-center">
              <SubButton>
                <TbVolume />
              </SubButton>
              <div className="w-[120px]">
                <Slider />
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
    </div>
  );
};

const Slider: React.FC = () => {
  return (
    <SliderPrimitive className="group relative flex h-4 grow cursor-pointer items-center">
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
    <div className="text-sm tabular-nums">
      {minuts}:{seconds}
    </div>
  );
};

const SubButton: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <button className="grid size-8 shrink-0 place-items-center rounded-full text-[18px] transition-colors hover:bg-white/15">
      {children}
    </button>
  );
};

export default Page;
