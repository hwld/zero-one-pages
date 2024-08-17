import { PiQuestionLight } from "@react-icons/all-files/pi/PiQuestionLight";
import {
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../_components/dialog";
import { IconButton } from "../../_components/icon-button";
import { Separator } from "../../_components/separator";
import { Button } from "../../_components/button";
import { ProjectForm } from "./project-form";
import { useCreateProject } from "./use-create-project";
import { ProjectFormData } from "../../_backend/project/api";
import { useId } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProjectCreateDialog: React.FC<Props> = ({
  isOpen,
  onOpenChange,
}) => {
  const formId = useId();
  const createProject = useCreateProject();

  const handleCreateProject = (data: ProjectFormData) => {
    createProject.mutate(data, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogHeader withClose>
        <div className="flex grow items-center gap-2">
          <DialogTitle>プロジェクトを追加</DialogTitle>
          <IconButton icon={PiQuestionLight} />
        </div>
      </DialogHeader>
      <Separator />
      <DialogContent>
        <ProjectForm id={formId} onSubmit={handleCreateProject} />
      </DialogContent>
      <Separator />
      <DialogFooter>
        <DialogActions>
          <DialogClose>
            <Button color="secondary">キャンセル</Button>
          </DialogClose>
          <Button
            type="submit"
            form={formId}
            disabled={createProject.isPending}
          >
            追加
          </Button>
        </DialogActions>
      </DialogFooter>
    </Dialog>
  );
};
