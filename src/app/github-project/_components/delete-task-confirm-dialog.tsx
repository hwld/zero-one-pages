import { ReactNode, useState } from "react";
import { Dialog } from "./dialog";
import { Button } from "./button";

type Props = {
  children: ReactNode;
  onDelete: () => void;
  isDeleting: boolean;
};

export const DeleteTaskConfirmDialogTrigger: React.FC<Props> = ({
  children,
  onDelete,
  isDeleting,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Delete item?"
      trigger={children}
      action={
        <div className="flex w-full justify-end gap-2">
          <Button size="lg" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="lg"
            color="destructive"
            onClick={onDelete}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      }
    >
      <div className="text-sm text-neutral-300">
        Are you sure you want to delete this item from this project?
      </div>
      <div></div>
    </Dialog>
  );
};
