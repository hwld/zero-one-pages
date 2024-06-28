import { useForm } from "react-hook-form";
import {
  CreateViewInput,
  createViewInputSchema,
} from "../../_backend/view/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../input";
import { useId } from "@floating-ui/react";
import { FloatingErrorMessage } from "../floating-error-message";

type Props = { id: string; onSubmit: (input: CreateViewInput) => void };

export const CreateViewForm: React.FC<Props> = ({ id, onSubmit }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateViewInput>({
    defaultValues: { name: "" },
    resolver: zodResolver(createViewInputSchema),
  });

  const nameErrorId = `${useId()}-title-error`;

  const { ref, ...otherRegister } = register("name");

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="py-2">
      <FloatingErrorMessage
        messageId={nameErrorId}
        message={errors.name?.message}
        anchorRef={ref}
        anchor={
          <Input
            autoComplete="off"
            autoFocus
            {...otherRegister}
            aria-invalid={!!errors.name}
            aria-errormessage={nameErrorId}
            placeholder="Type view name"
          />
        }
      />
    </form>
  );
};
