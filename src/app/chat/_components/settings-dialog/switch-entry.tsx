import { SettingSwitch } from "./switch";

export type SwitchSetting = {
  name: string;
  description: string;
};
export const SwitchSettingEntry: React.FC<{ setting: SwitchSetting }> = ({
  setting: { name, description },
}) => {
  return (
    <div className="space-y-2">
      <SettingSwitch label={name} />
      <div className="text-sm text-neutral-300">{description}</div>
    </div>
  );
};
