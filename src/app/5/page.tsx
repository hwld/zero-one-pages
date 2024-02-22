"use client";

import { motion } from "framer-motion";
import {
  LucideIcon,
  MicIcon,
  MicOffIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from "lucide-react";
import { NextPage } from "next";
import { forwardRef, useState } from "react";
import * as RadixSlider from "@radix-ui/react-slider";

const AppControlPage: NextPage = () => {
  return (
    <div className="h-dvh w-dvw bg-neutral-200 pt-5">
      <div className="m-auto w-min">
        <AppControl />
      </div>
    </div>
  );
};

type Mode = "menu" | "settings" | "sound" | "search";
const AppControl: React.FC = () => {
  const [mode, setMode] = useState<Mode>("menu");
  const content = {
    menu: <Menu onChangeMode={setMode} />,
    search: <Search />,
    settings: <Settings />,
    sound: <Sound />,
  };

  return (
    <div className="flex gap-2">
      <motion.div>{content[mode]}</motion.div>
      {mode !== "menu" && (
        <button
          onClick={() => setMode("menu")}
          className="grid size-[36px] place-items-center rounded-full bg-neutral-900 transition-colors hover:bg-neutral-700"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
};

const Menu: React.FC<{ onChangeMode: (mode: Mode) => void }> = ({
  onChangeMode,
}) => {
  return (
    <motion.div
      layout
      layoutId="controls"
      className="flex h-[40px] w-fit min-w-[150px] items-center justify-between bg-neutral-900 px-[5px] shadow"
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 400,
      }}
      style={{ borderRadius: "20px" }}
    >
      <motion.div
        layout="preserve-aspect"
        className="flex gap-1 [&>.control-item:first-child]:rounded-l-full [&>.control-item:last-child]:rounded-r-full"
      >
        <MenuItem icon={SearchIcon} onClick={() => onChangeMode("search")} />
        <MenuItem icon={Volume2Icon} onClick={() => onChangeMode("sound")} />
        <MenuItem
          icon={SettingsIcon}
          onClick={() => onChangeMode("settings")}
        />
      </motion.div>
    </motion.div>
  );
};

const MenuItem: React.FC<{ icon: LucideIcon; onClick?: () => void }> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      className="control-item grid h-[30px] w-full min-w-[45px] place-items-center rounded text-neutral-100 transition-colors hover:bg-white/20"
      onClick={onClick}
    >
      <Icon size={20} />
    </button>
  );
};

const Search: React.FC = () => {
  return (
    <motion.div
      layoutId="controls"
      className="flex h-[40px] w-[450px] items-center gap-2 rounded-full bg-neutral-900 px-3 outline-2 outline-offset-2 outline-neutral-900 focus-within:outline"
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      style={{ borderRadius: "20px" }}
    >
      <SearchIcon size={20} />
      <input className="grow bg-transparent text-neutral-100 outline-none" />
    </motion.div>
  );
};

const Sound: React.FC = () => {
  const [speaker, setSpeaker] = useState(50);
  const [mic, setMic] = useState(50);

  return (
    <motion.div
      layoutId="controls"
      className="w-[300px] overflow-hidden bg-neutral-900 px-5 pb-8 pt-5"
      style={{ borderRadius: "20px" }}
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
    >
      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <div className="text-sm text-neutral-300">スピーカー</div>
            <Slider
              value={speaker}
              onChangeValue={setSpeaker}
              icon={speaker === 0 ? VolumeXIcon : Volume2Icon}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-neutral-300">マイク</div>
            <Slider
              value={mic}
              onChangeValue={setMic}
              icon={mic === 0 ? MicOffIcon : MicIcon}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Slider: React.FC<{
  icon: LucideIcon;
  value: number;
  onChangeValue: (v: number) => void;
}> = ({ icon: Icon, value, onChangeValue }) => {
  return (
    <RadixSlider.Root
      className="relative flex w-full touch-none select-none items-center"
      max={100}
      step={1}
      value={[value]}
      onValueChange={(e) => onChangeValue(e[0])}
    >
      <RadixSlider.Track className="relative h-[30px] w-full grow overflow-hidden rounded-full bg-white/20">
        <RadixSlider.Range asChild className="absolute h-full bg-neutral-100">
          <CustomRange />
        </RadixSlider.Range>
        <div className="absolute left-1 top-0 z-10 flex h-full items-center text-neutral-800">
          <Icon size={20} />
        </div>
      </RadixSlider.Track>
      <RadixSlider.Thumb
        className="focus-visible:ring-ring block size-[30px] rounded-full border border-neutral-300 bg-neutral-200 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
        aria-label="Volume"
      />
    </RadixSlider.Root>
  );
};

// Rangeの長さを調節して、Thumbとずれないようにする
const CustomRange = forwardRef<HTMLSpanElement, RadixSlider.SliderThumbProps>(
  function CustomRange({ style, ...others }) {
    let right =
      parseFloat(style?.right?.toString().split("calc(")[0] ?? "0") ?? 0;
    const delta = `${(right - 50) / 4}px`;
    let newRight = `calc(${right}% - (${delta}))`;

    return <span {...others} style={{ ...style, right: newRight }} />;
  },
);

const Settings: React.FC = () => {
  return (
    <motion.div
      layoutId="controls"
      transition={{ type: "spring", damping: 20, stiffness: 200 }}
      className="flex  w-[250px] flex-col items-start gap-1 overflow-hidden bg-neutral-900 p-3"
      style={{ borderRadius: "20px" }}
    >
      <SettingItem />
      <SettingItem />
      <SettingItem />
      <SettingItem />
      <SettingItem />
      <SettingItem />
    </motion.div>
  );
};

const SettingItem: React.FC = () => {
  return (
    <motion.button
      layout
      className="flex w-full items-center gap-2 rounded p-2 transition-colors hover:bg-white/20"
    >
      <SmileIcon />
      設定
    </motion.button>
  );
};

export default AppControlPage;
