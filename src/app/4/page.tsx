"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogPortal,
} from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import * as Switch from "@radix-ui/react-switch";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { AnimatePresence, motion } from "framer-motion";
import {
  BellIcon,
  BirdIcon,
  CatIcon,
  CheckIcon,
  DogIcon,
  FishIcon,
  HashIcon,
  LucideIcon,
  MessagesSquareIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusCircleIcon,
  PlusIcon,
  RabbitIcon,
  ReplyIcon,
  SendHorizontalIcon,
  SettingsIcon,
  SmileIcon,
  TrashIcon,
  UserIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { NextPage } from "next";
import {
  ComponentPropsWithoutRef,
  FormEventHandler,
  ReactNode,
  forwardRef,
  useId,
  useState,
} from "react";
import { radioSettings, switchSettings } from "./data";

const chatInputName = "chat";

const Page: NextPage = () => {
  const [chats, setChats] = useState<{ id: string; text: string }[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    setChats((c) => [
      ...c,
      {
        id: crypto.randomUUID(),
        text: formData.get(chatInputName)!.toString(),
      },
    ]);

    Array.from(form.elements).forEach((e) => {
      if (e instanceof HTMLInputElement) {
        e.value = "";
      }
    });
  };

  return (
    <div className="grid h-dvh grid-cols-[70px_250px_1fr] bg-neutral-100 text-neutral-100">
      <div className="flex flex-col items-center justify-between gap-3 bg-neutral-950 py-3">
        <div className="flex flex-col gap-3">
          <div className="size-[45px] rounded-full bg-green-500" />
          <Spacer />
        </div>
        <div className="flex h-full flex-col gap-3">
          <ServerItem icon={BirdIcon} />
          <ServerItem icon={CatIcon} active />
          <ServerItem icon={DogIcon} />
          <ServerItem icon={FishIcon} />
          <ServerItem icon={RabbitIcon} />
        </div>
        <div className="flex flex-col">
          <button className="grid size-[45px] place-items-center rounded-md bg-neutral-500 text-neutral-100 transition-colors hover:bg-neutral-600">
            <PlusIcon />
          </button>
        </div>
      </div>
      <div className="grid grid-rows-[40px_1fr_min-content] bg-neutral-900">
        <div className="flex items-center gap-1 bg-white/10 p-3 text-sm">
          <CatIcon size={18} strokeWidth={1.5} />
          Cat server
        </div>
        <div className="flex flex-col items-start gap-1 p-3">
          <ChannelLink active />
          <ChannelLink />
          <ChannelLink />
          <ChannelLink />
          <ChannelLink />
          <ChannelLink />
        </div>
        <div className="flex justify-between gap-2 bg-white/10 p-3">
          <div className="grid size-[30px] shrink-0 place-items-center rounded-full border border-neutral-400 bg-neutral-700">
            <UserIcon size={20} className="text-green-500" />
          </div>
          <div className="w-full text-sm">
            <div>username</div>
            <div className="text-xs">status</div>
          </div>
          <div className="flex gap-1">
            <UserMenuItem icon={BellIcon} />
            <UserMenuItem
              icon={SettingsIcon}
              onClick={() => setIsSettingsOpen(true)}
            />
            <SettingsDialog
              isOpen={isSettingsOpen}
              onOpenChange={setIsSettingsOpen}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-rows-[40px_1fr_70px] overflow-hidden bg-neutral-800">
        <div className="flex items-center gap-1 bg-white/10 p-5 text-sm">
          <HashIcon size={18} className="text-green-500" />
          <div>channnel</div>
        </div>
        <div className="flex flex-col gap-3 overflow-auto p-5">
          {chats.length === 0 && <EmptyChat />}
          {chats.map(({ id, text }) => (
            <ChatCard
              key={id}
              onDelete={() => {
                setChats((c) => c.filter((c) => c.id !== id));
              }}
            >
              {text}
            </ChatCard>
          ))}
        </div>
        <div className="flex items-center bg-transparent px-10">
          <form
            onSubmit={handleSubmit}
            className="flex h-[45px] w-full items-center gap-2 rounded-md bg-neutral-600 px-3 ring-neutral-400 ring-offset-2 ring-offset-neutral-700 transition-shadow focus-within:ring-2"
          >
            <PlusCircleIcon className="text-green-500" />
            <input
              name={chatInputName}
              autoComplete="off"
              className="h-full w-full bg-transparent focus-visible:outline-none"
            />
            <SendHorizontalIcon className="text-green-500" />
          </form>
        </div>
      </div>
    </div>
  );
};
export default Page;

const UserMenuItem = forwardRef<
  HTMLButtonElement,
  { icon: LucideIcon; onClick?: () => void }
>(function UserMenuItem({ icon: Icon, onClick }, ref) {
  return (
    <button
      ref={ref}
      className="grid size-[30px] place-items-center rounded-full bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-600"
      onClick={onClick}
    >
      <Icon size={20} />
    </button>
  );
});

const ServerItem: React.FC<{ icon: LucideIcon; active?: boolean }> = ({
  icon: Icon,
  active,
}) => {
  return (
    <button
      className={clsx(
        "grid size-[45px] place-items-center rounded-full bg-neutral-300 text-neutral-900 transition-colors hover:bg-neutral-400",
        active && "ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-800",
      )}
    >
      <Icon />
    </button>
  );
};

const EmptyChat: React.FC = () => {
  return (
    <div className="grid h-full place-content-center place-items-center gap-2">
      <MessagesSquareIcon size={100} strokeWidth={1.1} />
      <div className="flex gap-1 text-xl font-bold">
        <div className="flex items-center gap-1">
          <HashIcon size={25} className="text-green-500" strokeWidth={3} />
          channel
        </div>
        <div>へようこそ</div>
      </div>
    </div>
  );
};

const ChatCard: React.FC<{ children: ReactNode; onDelete?: () => void }> = ({
  children,
  onDelete,
}) => {
  return (
    <div className="group relative grid min-h-fit grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] gap-x-3 gap-y-1 p-3">
      <div className="row-span-2 grid size-[40px] place-items-center rounded-full bg-neutral-700 text-green-500">
        <UserIcon />
      </div>
      <div className="flex items-center gap-3">
        <div>user-name</div>
        <div className="text-xs text-neutral-400">2024/02/11 11:11:11</div>
      </div>
      <div className="break-all">{children}</div>
      <div className="absolute right-0 top-0 hidden overflow-hidden rounded bg-neutral-700 transition-opacity group-hover:flex">
        <ChatCardMenuItem icon={SmileIcon} label="絵文字をつける" />
        <ChatCardMenuItem icon={ReplyIcon} label="返信" />
        <ChatCardMenuItem icon={TrashIcon} label="削除" onClick={onDelete} />
        <ChatCardMenuItem icon={MoreHorizontalIcon} label="その他" />
      </div>
    </div>
  );
};

const ChatCardMenuItem: React.FC<{
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}> = ({ icon: Icon, label, onClick }) => {
  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger
          className="grid place-items-center p-2 transition-colors hover:bg-white/5"
          onClick={onClick}
        >
          <Icon size={20} />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={3}
            className="rounded bg-neutral-900 px-2 py-1 text-xs"
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

type ChannelLinkProps = { active?: boolean };
const ChannelLink: React.FC<ChannelLinkProps> = ({ active }) => {
  return (
    <button
      className={clsx(
        "flex w-full items-center gap-1 rounded p-2 transition-colors",
        active ? "bg-green-500/25" : "hover:bg-green-500/10",
      )}
    >
      <HashIcon size={18} className="text-green-500" />
      <div>channnel</div>
    </button>
  );
};

const SettingsDialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ isOpen, onOpenChange }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogContent asChild onOpenAutoFocus={(e) => e.preventDefault()}>
              <motion.div
                className="fixed inset-0 grid grid-cols-[30%_1fr] bg-neutral-950 text-neutral-100 focus-visible:outline-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <SettingsSidebar />
                <div className="grid grid-cols-[700px_50px] justify-start gap-8 overflow-auto bg-neutral-700 px-6 py-14">
                  <div className="flex h-full flex-col gap-8">
                    <h1 className="text-lg font-bold">プロフィール</h1>
                    <div className="flex flex-col gap-10">
                      <ProfileForm />
                      <Spacer />
                      <SettingGroup group="サーバーのデフォルトプライバシー設定">
                        {switchSettings.map((s) => {
                          return (
                            <SwitchSettingEntry key={s.name} setting={s} />
                          );
                        })}
                      </SettingGroup>
                      <Spacer />
                      <SettingGroup group="ダイレクトメッセージフィルター">
                        {radioSettings.map((s) => {
                          return <RadioSettingEntry key={s.name} setting={s} />;
                        })}
                      </SettingGroup>
                    </div>
                  </div>
                  <div>
                    <DialogClose className="sticky top-0 flex flex-col items-center gap-1 text-neutral-400 transition-colors hover:text-neutral-100">
                      <XCircleIcon size={45} strokeWidth={2} />
                      <div className="text-sm">ESC</div>
                    </DialogClose>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

const SettingsSidebar = () => {
  return (
    <div className="grid grid-cols-[1fr_200px] justify-end overflow-auto bg-neutral-800">
      <div className="col-start-2 flex flex-col gap-4 px-4 py-14">
        <SettingItemGroup name="ユーザー設定">
          <SettingItem active>プロフィール</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
        </SettingItemGroup>

        <Spacer />

        <SettingItemGroup name="アプリの設定">
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
        </SettingItemGroup>

        <Spacer />

        <SettingItemGroup name="その他の設定">
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
          <SettingItem>設定1</SettingItem>
        </SettingItemGroup>
      </div>
    </div>
  );
};

const ProfileForm: React.FC = () => {
  return (
    <div className="grid grid-cols-[1fr_200px] gap-8">
      <div className="flex flex-col gap-4">
        <Input label="ユーザー名" />
        <Textarea label="プロフィール" rows={8} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm">アイコン</div>
        <button className="group relative grid size-[180px] place-items-center overflow-hidden rounded-full bg-neutral-800">
          <UserIcon
            size={150}
            className="transition-opacity group-hover:opacity-20"
          />
          <div className="absolute inset-0 grid place-content-center place-items-center gap-3 bg-black/30 text-neutral-100 opacity-0 transition-opacity group-hover:opacity-100">
            <PencilIcon size={50} />
            <div className="text-xs">アイコンを変更する</div>
          </div>
        </button>
      </div>
    </div>
  );
};

const Spacer: React.FC = () => {
  return <div className="h-[1px] w-full bg-white/15" />;
};

const SettingItemGroup: React.FC<{ name: string; children: ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-neutral-400">{name}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
};

const inputBaseClass =
  "rounded bg-neutral-800 px-3 py-2 text-neutral-100 focus-visible:outline-none";
const Input: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm">{label}</label>
      <input className={clsx(inputBaseClass)} />
    </div>
  );
};

const Textarea: React.FC<
  { label: string } & ComponentPropsWithoutRef<"textarea">
> = ({ label, ...props }) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <label className="text-sm">{label}</label>
      <textarea className={clsx(inputBaseClass, "resize-none")} {...props} />
    </div>
  );
};

const SettingItem: React.FC<{ children: ReactNode; active?: boolean }> = ({
  children,
  active,
}) => {
  return (
    <button
      className={clsx(
        "flex justify-start rounded px-4 py-1 transition-colors hover:bg-white/5",
        active ? "bg-white/20 text-neutral-100" : "text-neutral-300",
      )}
    >
      {children}
    </button>
  );
};

const SettingSwitch: React.FC<{ label: string }> = ({ label }) => {
  const id = useId();
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex w-full items-center justify-between">
      <label className="cursor-pointer pr-4" htmlFor={id}>
        {label}
      </label>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={setChecked}
        className={clsx(
          "h-[28px] w-[46px] shrink-0 rounded-full transition-colors",
          checked ? "bg-green-500" : "bg-neutral-500",
        )}
      >
        <Switch.Thumb asChild>
          <motion.span
            className="grid size-[20px] place-items-center rounded-full bg-neutral-100"
            animate={{ x: checked ? 22 : 4 }}
          >
            {checked ? (
              <CheckIcon size={16} className="text-green-500" />
            ) : (
              <XIcon size={16} className="text-neutral-500" />
            )}
          </motion.span>
        </Switch.Thumb>
      </Switch.Root>
    </div>
  );
};

type SettingRadioItem = { value: string; label: string; description?: string };

const SettingRadioGroup: React.FC<{
  items: SettingRadioItem[];
}> = ({ items }) => {
  const [selectedValue, setSelectedValue] = useState(items[0]?.value ?? "");

  return (
    <RadioGroup.Root
      className="grid gap-2"
      value={selectedValue}
      onValueChange={setSelectedValue}
    >
      {items.map((item) => {
        return (
          <SettingRadio
            key={item.value}
            item={item}
            isSelected={selectedValue === item.value}
            onSelect={setSelectedValue}
          />
        );
      })}
    </RadioGroup.Root>
  );
};

const SettingRadio: React.FC<{
  isSelected: boolean;
  item: SettingRadioItem;
  onSelect: (value: string) => void;
}> = ({ isSelected, item, onSelect }) => {
  return (
    <div
      className={clsx(
        "t flex cursor-pointer items-center rounded p-4 transition-colors",
        isSelected
          ? "bg-white/20 outline outline-2 outline-green-400"
          : "bg-white/10 hover:bg-white/15",
      )}
      onClick={() => onSelect(item.value)}
    >
      <RadioGroup.Item
        value={item.value}
        className={clsx(
          "grid size-[24px] place-items-center rounded-full border-2",
          isSelected ? "border-green-400" : "border-neutral-100",
        )}
      >
        <AnimatePresence>
          {isSelected && (
            <RadioGroup.Indicator asChild forceMount>
              <motion.span
                className="size-[12px] rounded-full bg-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              />
            </RadioGroup.Indicator>
          )}
        </AnimatePresence>
      </RadioGroup.Item>
      <div className="geid gap-1 pl-4">
        <label>{item.label}</label>
        {item.description && (
          <div className="text-sm text-neutral-300">{item.description}</div>
        )}
      </div>
    </div>
  );
};

const SettingGroup: React.FC<{ group: string; children: ReactNode }> = ({
  group,
  children,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-xs text-neutral-300">{group}</div>
      <div className="space-y-8">{children}</div>
    </div>
  );
};

export type SwitchSetting = {
  name: string;
  description: string;
};
const SwitchSettingEntry: React.FC<{ setting: SwitchSetting }> = ({
  setting: { name, description },
}) => {
  return (
    <div className="space-y-2">
      <SettingSwitch label={name} />
      <div className="text-sm text-neutral-300">{description}</div>
    </div>
  );
};

export type RadioSetting = {
  name: string;
  description: string;
  items: SettingRadioItem[];
};
const RadioSettingEntry: React.FC<{ setting: RadioSetting }> = ({
  setting: { name, description, items },
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div>{name}</div>
        <div className="text-sm text-neutral-300">{description}</div>
      </div>
      <SettingRadioGroup items={items} />
    </div>
  );
};
