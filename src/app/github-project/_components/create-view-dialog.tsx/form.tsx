import { useForm } from "react-hook-form";
import {
  CreateViewInput,
  createViewInputSchema,
} from "../../_backend/view/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../input";
import {
  autoUpdate,
  offset,
  useFloating,
  useId,
  useMergeRefs,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";

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

  const { refs, floatingStyles } = useFloating({
    open: !!errors.name,
    placement: "top-start",
    middleware: [offset(10)],
    whileElementsMounted: autoUpdate,
  });

  const { ref, ...otherRegister } = register("name");
  const nameInputRef = useMergeRefs([refs.setReference, ref]);

  const nameErrorId = `${useId()}-title-error`;

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="py-2">
      <Input
        autoComplete="off"
        ref={nameInputRef}
        autoFocus
        {...otherRegister}
        aria-invalid={!!errors.name}
        aria-errormessage={nameErrorId}
        placeholder="Type view name"
      />
      <AnimatePresence>
        {!!errors.name && (
          <div ref={refs.setFloating} style={floatingStyles}>
            <motion.p
              id={nameErrorId}
              className="rounded bg-neutral-900 px-1 py-1 text-xs text-red-400"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
            >
              {errors.name.message}
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
};
