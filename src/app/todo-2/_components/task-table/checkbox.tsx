import { Checkbox, CheckboxIndicator } from "@radix-ui/react-checkbox";
import { IconCheck } from "@tabler/icons-react";

type Props = { checked: boolean; onChange: (checked: boolean) => void };

export const TaskTableCheckbox: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onChange}
      className="block size-[18px] appearance-none rounded border border-zinc-500 transition-colors data-[state=checked]:border-zinc-300 data-[state=checked]:bg-zinc-300 hover:data-[state=unchecked]:bg-white/10"
    >
      <CheckboxIndicator className="grid place-items-center text-zinc-700">
        <IconCheck size={18} className="pr-[3px]" />
      </CheckboxIndicator>
    </Checkbox>
  );
};
