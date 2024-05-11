import { Dialog } from "./dialog";
import { TbLoader2, TbX } from "react-icons/tb";
import { CreateEventInput } from "./mocks/api";
import { useCreateEvent } from "./queries/use-create-event";
import { EVENT_FORM_ID, EventForm } from "./event-form";
import clsx from "clsx";
import { DragDateRange } from "./utils";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  defaultFormValues: Omit<CreateEventInput, "title"> | undefined;
  onChangeEventPeriodPreview: Dispatch<
    SetStateAction<DragDateRange | undefined>
  >;
  onClose: () => void;
};
export const CreateEventFormDialog: React.FC<Props> = ({
  isOpen,
  defaultFormValues,
  onChangeEventPeriodPreview,
  onClose,
}) => {
  const createEventMutation = useCreateEvent();

  const handleChangeOpen = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const handleCreateEvent = (input: CreateEventInput) => {
    createEventMutation.mutate(input, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Dialog isOpen={isOpen} onChangeOpen={handleChangeOpen}>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-2">
          <div className="select-none text-sm text-neutral-500">
            イベント作成
          </div>
          <button
            className="absolute right-2 top-2 grid size-6 place-items-center rounded transition-colors hover:bg-black/10"
            onClick={onClose}
          >
            <TbX size={18} />
          </button>
        </div>
        {defaultFormValues !== undefined && (
          <EventForm
            defaultValues={defaultFormValues}
            onSubmit={handleCreateEvent}
            onChangeEventPeriodPreview={onChangeEventPeriodPreview}
            isPending={createEventMutation.isPending}
          />
        )}
        <div className="flex gap-2 self-end">
          <button
            className="flex h-8 items-center rounded px-2 text-sm transition-colors hover:bg-black/10"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            type="submit"
            form={EVENT_FORM_ID}
            className={clsx(
              "relative flex h-8 select-none items-center rounded bg-neutral-700 px-2 text-sm text-neutral-100 transition-colors hover:bg-neutral-800",
              createEventMutation.isPending && "pointer-events-none",
            )}
          >
            <div className={createEventMutation.isPending ? "opacity-0" : ""}>
              作成する
            </div>
            {createEventMutation.isPending && (
              <div className="absolute left-1/2 top-1/2 block size-5 -translate-x-1/2 -translate-y-1/2">
                <TbLoader2 className="size-full animate-spin text-neutral-400" />
              </div>
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
};
