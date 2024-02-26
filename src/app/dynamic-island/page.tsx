"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  LucideIcon,
  MicIcon,
  MicOffIcon,
  Minimize2,
  PauseIcon,
  PlayIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  TimerIcon,
  TimerResetIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from "lucide-react";
import { NextPage } from "next";
import {
  ComponentPropsWithoutRef,
  ReactNode,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import * as RadixSlider from "@radix-ui/react-slider";
import clsx from "clsx";

const AppControlPage: NextPage = () => {
  return (
    <div className="h-dvh w-dvw bg-neutral-200 pt-5">
      <div className="m-auto w-min">
        <AppControl />
      </div>
    </div>
  );
};

type Mode = "menu" | "settings" | "sound" | "search" | "stopwatch";
const AppControl: React.FC = () => {
  const [mode, setMode] = useState<Mode>("menu");
  const content = {
    menu: <Menu onChangeMode={setMode} />,
    search: <Search />,
    settings: <Settings />,
    sound: <Sound />,
    stopwatch: <Stopwatch />,
  };

  return (
    <div className="flex max-w-[100dvw] gap-2 px-2">
      {content[mode]}
      {mode !== "menu" && (
        <button
          onClick={() => setMode("menu")}
          className="grid size-[36px] shrink-0 place-items-center rounded-full bg-neutral-900 transition-colors hover:bg-neutral-700"
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
        <MenuItem icon={TimerIcon} onClick={() => onChangeMode("stopwatch")} />
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
      <motion.div layout="preserve-aspect">
        <SearchIcon size={20} />
      </motion.div>
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
        <div className="pointer-events-none absolute left-1 top-0 z-10 flex h-full items-center text-neutral-800">
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
  function CustomRange({ style, ...others }, ref) {
    let right =
      parseFloat(style?.right?.toString().split("calc(")[0] ?? "0") ?? 0;
    const delta = `${(right - 50) / 4}px`;
    let newRight = `calc(${right}% - (${delta}))`;

    return <span ref={ref} {...others} style={{ ...style, right: newRight }} />;
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

const maxSeconds = 359_999;
const Stopwatch: React.FC = () => {
  const [seconds, setSeconds] = useState(0);
  const [isMin, setIsMin] = useState(false);
  const [state, setState] = useState<"running" | "stopped">("stopped");
  const timerIdRef = useRef<number | undefined>(undefined);

  const handleStartTimer = () => {
    window.clearInterval(timerIdRef.current);
    timerIdRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s >= maxSeconds) {
          window.clearInterval(timerIdRef.current);
          setState("stopped");
          return s;
        }
        return s + 1;
      });
    }, 1000);

    setState("running");
  };

  const handleStopTimer = () => {
    window.clearInterval(timerIdRef.current);
    setState("stopped");
  };

  const handleClearTimer = () => {
    setSeconds(0);
  };

  const timerDisplay = useMemo(() => {
    const hh = `0${Math.floor(seconds / 3600)}`.slice(-2);
    const mm = `0${Math.floor(seconds / 60) % 60}`.slice(-2);
    const ss = `0${Math.floor(seconds % 60)}`.slice(-2);

    return `${hh}:${mm}:${ss}`;
  }, [seconds]);

  const actionButtons = {
    stopped: (
      <StopwatchButton
        onClick={handleStartTimer}
        disabled={seconds >= maxSeconds}
      >
        <PlayIcon className="pl-[2px]" />
      </StopwatchButton>
    ),
    running: (
      <StopwatchButton onClick={handleStopTimer}>
        <PauseIcon />
      </StopwatchButton>
    ),
  };

  return isMin ? (
    <motion.button
      layoutId="controls"
      onClick={() => setIsMin(false)}
      className="w-[200px] overflow-hidden bg-neutral-900 px-3 py-2 text-neutral-100"
      style={{ borderRadius: "20px" }}
    >
      <motion.div
        layout="preserve-aspect"
        className="flex items-center justify-between"
      >
        <motion.span layoutId="action">
          <TimerIcon size={20} />
        </motion.span>
        <motion.div
          layoutId="display"
          className="text-sm tabular-nums text-neutral-300"
        >
          {timerDisplay}
        </motion.div>
      </motion.div>
    </motion.button>
  ) : (
    <motion.div
      layoutId="controls"
      className="relative w-[250px] overflow-hidden bg-neutral-900 p-4 text-neutral-100"
      style={{ borderRadius: "20px" }}
    >
      <motion.div
        layout="preserve-aspect"
        className="flex items-center justify-between"
      >
        <div className="flex gap-2">
          <motion.span layoutId="action">{actionButtons[state]}</motion.span>
          <AnimatePresence>
            {seconds > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <StopwatchButton onClick={handleClearTimer} secondary>
                  <TimerResetIcon className="pb-[1px] pr-[2px]" />
                </StopwatchButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-end gap-1">
          <button
            className="rounded p-1 transition-colors hover:bg-white/20"
            onClick={() => setIsMin(true)}
          >
            <Minimize2 size={15} />
          </button>
          <motion.div
            layoutId="display"
            className="select-none text-xl font-bold tabular-nums"
          >
            {timerDisplay}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const StopwatchButton: React.FC<
  {
    children: ReactNode;
    secondary?: boolean;
  } & ComponentPropsWithoutRef<"button">
> = ({ children, secondary, ...props }) => {
  return (
    <button
      className={clsx(
        "grid size-[35px] place-items-center rounded-full text-neutral-200 transition-colors disabled:cursor-not-allowed ",
        secondary
          ? "bg-white/20 enabled:hover:bg-white/30 enabled:hover:text-neutral-50 disabled:bg-neutral-100/10 disabled:text-neutral-400"
          : "bg-neutral-100 text-neutral-900 enabled:hover:bg-neutral-300 disabled:bg-neutral-400 [&_svg]:fill-neutral-900",
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default AppControlPage;
