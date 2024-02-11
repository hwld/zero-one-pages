"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import clsx from "clsx";
import {
  HashIcon,
  LucideIcon,
  MoreHorizontalIcon,
  PlusCircleIcon,
  PlusIcon,
  ReplyIcon,
  SendHorizontalIcon,
  SmileIcon,
  TrashIcon,
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
          <button className="size-[45px] rounded-full bg-neutral-300" />
          <div className="h-[1px] w-[45px] bg-neutral-700" />
        </div>
        <div className="flex h-full flex-col gap-3">
          <button className="size-[45px] rounded-full bg-neutral-400" />
          <button className="size-[45px] rounded-full bg-neutral-400" />
          <button className="size-[45px] rounded-full bg-neutral-400" />
        </div>
        <div className="flex flex-col">
          <button className="grid size-[45px] place-items-center rounded-md bg-neutral-400 text-neutral-600 transition-colors hover:bg-neutral-500 hover:text-neutral-700">
            <PlusIcon />
          </button>
        </div>
      </div>
      <div className="grid grid-rows-[40px_1fr_min-content] bg-neutral-900">
        <div className="flex items-center bg-neutral-600 p-3 text-sm">
          server
        </div>
        <div className="flex flex-col items-start gap-1 p-3">
          <ChannelLink active />
          <ChannelLink />
          <ChannelLink />
          <ChannelLink />
          <ChannelLink />
          <ChannelLink />
        </div>
        <div className="flex justify-between gap-2 bg-neutral-600 p-3">
          <div className="size-[30px] shrink-0 rounded-full bg-neutral-400" />
          <div className="w-full text-sm">
            <div>username</div>
            <div className="text-xs">status</div>
          </div>
          <div className="flex gap-1">
            <div className="size-[20px] rounded-full bg-neutral-400" />
            <div className="size-[20px] rounded-full bg-neutral-400" />
            <div className="size-[20px] rounded-full bg-neutral-400" />
          </div>
        </div>
      </div>
      <div className="grid grid-rows-[40px_1fr_70px] overflow-hidden bg-neutral-800">
        <div className="flex items-center gap-1 bg-neutral-700 p-5 text-sm">
          <HashIcon size={18} className="text-neutral-400" />
          <div>channnel</div>
        </div>
        <div className="flex flex-col gap-3 overflow-auto p-5">
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
            className="flex h-[45px] w-full items-center gap-2 rounded-md bg-neutral-500 px-3 ring-neutral-400 ring-offset-2 ring-offset-neutral-700 transition-shadow focus-within:ring-2"
          >
            <PlusCircleIcon />
            <input
              name={chatInputName}
              autoComplete="off"
              className="h-full w-full bg-transparent focus-visible:outline-none"
            />
            <SendHorizontalIcon />
          </form>
        </div>
      </div>
    </div>
  );
};
export default Page;

const ChatCard: React.FC<{ children: ReactNode; onDelete?: () => void }> = ({
  children,
  onDelete,
}) => {
  return (
    <div className="group relative grid min-h-fit grid-cols-[min-content_1fr] grid-rows-[min-content_1fr] gap-x-3 gap-y-1 p-4">
      <div className="row-span-2 size-[40px] rounded-full bg-neutral-500" />
      <div className="flex items-center gap-3">
        <div>user-name</div>
        <div className="text-xs text-neutral-400">2024/02/11 11:11:11</div>
      </div>
      <div className="break-all">{children}</div>
      <div className="absolute right-0 top-0 flex overflow-hidden rounded bg-neutral-700 opacity-0 transition-opacity group-hover:opacity-100">
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
        active ? "bg-neutral-700" : "hover:bg-white/5",
      )}
    >
      <HashIcon size={18} className="text-neutral-400" />
      <div>channnel</div>
    </button>
  );
};
