"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import {
  BellIcon,
  BirdIcon,
  CatIcon,
  DogIcon,
  FishIcon,
  HashIcon,
  LucideIcon,
  MessagesSquareIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  PlusIcon,
  RabbitIcon,
  ReplyIcon,
  SendHorizontalIcon,
  SettingsIcon,
  SmileIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react";
import { NextPage } from "next";
import { FormEventHandler, ReactNode, useState } from "react";

const chatInputName = "chat";

const Page: NextPage = () => {
  const [chats, setChats] = useState<{ id: string; text: string }[]>([]);

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
          <div className="h-[1px] w-[45px] bg-neutral-700" />
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
            <UserMenuItem icon={SettingsIcon} />
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

const UserMenuItem: React.FC<{ icon: LucideIcon }> = ({ icon: Icon }) => {
  return (
    <button className="grid size-[30px] place-items-center rounded-full bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-600">
      <Icon size={20} />
    </button>
  );
};

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
