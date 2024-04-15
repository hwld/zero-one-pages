"use client";
import {
  Slider as SliderPrimitive,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@radix-ui/react-slider";

type Props = {
  max?: number;
  min?: number;
  step?: number;
  value: number;
  onValueChange: (value: number) => void;
  onValueCommit?: () => void;
};

export const Slider: React.FC<Props> = ({
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
