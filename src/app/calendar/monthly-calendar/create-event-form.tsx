import { cn } from "@/lib/utils";
import {
  forwardRef,
  ComponentPropsWithoutRef,
  ReactNode,
  useMemo,
} from "react";
import { IconType } from "react-icons/lib";
import { TbTextCaption, TbClockHour5, TbAlertCircle } from "react-icons/tb";
import { CreateEventInput, createEventInputSchema } from "../mocks/api";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parse, startOfDay } from "date-fns";

export const CREATE_EVENT_FORM_ID = "create-event-form-id";

// input[type="date"|"datetime-locale"]に合わせる
const getDateFormatString = (allDay: boolean = false) => {
  if (allDay) {
    return "yyyy-MM-dd";
  } else {
    return "yyyy-MM-dd'T'HH:mm";
  }
};

type Props = {
  onCreateEvent: (input: CreateEventInput) => void;
  defaultValues: Partial<CreateEventInput>;
};

export const CreateEventForm: React.FC<Props> = ({
  onCreateEvent,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateEventInput>({
    defaultValues,
    resolver: zodResolver(createEventInputSchema),
  });
  const isAllDay = useWatch({ control, name: "allDay" });

  const handleCreateEvent = (data: CreateEventInput) => {
    const startDate = data.allDay ? startOfDay(data.start) : data.start;
    const endDate = data.allDay ? startOfDay(data.end) : data.end;

    onCreateEvent({
      ...data,
      start: startDate,
      end: endDate,
    });
  };

  return (
    <form
      id={CREATE_EVENT_FORM_ID}
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleCreateEvent)}
    >
      <FormField icon={TbTextCaption} error={errors.title?.message}>
        <Input
          placeholder="タイトルを入力してください..."
          autoFocus
          error={!!errors.title}
          {...register("title")}
        />
      </FormField>
      <FormField
        icon={TbClockHour5}
        error={errors.start?.message ?? errors.end?.message}
        option={
          <div className="flex shrink-0 gap-1">
            <input id="allDay" type="checkbox" {...register("allDay")} />
            <label htmlFor="allDay" className="select-none text-sm">
              終日
            </label>
          </div>
        }
      >
        <div className="flex w-full items-center gap-2">
          <Controller
            control={control}
            name="start"
            render={({ field, fieldState }) => {
              return (
                <DateInput
                  isAllDay={isAllDay}
                  error={!!fieldState.error}
                  {...field}
                />
              );
            }}
            defaultValue={defaultValues.start}
          />
          <div className="text-xs">〜</div>
          <Controller
            control={control}
            name="end"
            render={({ field, fieldState }) => {
              return (
                <DateInput
                  isAllDay={isAllDay}
                  error={!!fieldState.error}
                  {...field}
                />
              );
            }}
            defaultValue={defaultValues.end}
          />
        </div>
      </FormField>
    </form>
  );
};

type InputProps = { error?: boolean } & ComponentPropsWithoutRef<"input">;
const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "focus-visible:outline-neu h-8 w-full rounded border bg-neutral-50 px-2 text-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-1",
        error
          ? "border-red-600 ring-red-600"
          : "border-neutral-300 ring-neutral-500",
        className,
      )}
    />
  );
});

const DateInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, "value" | "onChange"> & {
    isAllDay: boolean;
    value: Date | null;
    onChange: (date: Date | null) => void;
  }
>(function DateInput({ isAllDay, value, onChange, ...props }, ref) {
  const valueStr = useMemo(() => {
    if (!value) {
      return "";
    }

    return format(value, getDateFormatString(isAllDay));
  }, [isAllDay, value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parse(
      e.target.value,
      getDateFormatString(isAllDay),
      new Date(),
    );

    if (isNaN(date.getTime())) {
      onChange(new Date());
    } else {
      onChange(date);
    }
  };

  return (
    <Input
      ref={ref}
      value={valueStr}
      onChange={handleChange}
      type={isAllDay ? "date" : "datetime-local"}
      {...props}
    />
  );
});

const FormField: React.FC<{
  icon: IconType;
  children: ReactNode;
  option?: ReactNode;
  error?: string;
}> = ({ icon, children, option, error }) => {
  const Icon = icon;
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center gap-2">
        <Icon size={20} className="shrink-0 text-neutral-700" />
        {children}
      </div>
      {(option || error) && (
        <div className="flex gap-2">
          <div className="size-[20px]" />
          {option}
          {error && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <TbAlertCircle size={16} />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
