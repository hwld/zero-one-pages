import { useMemo } from "react";
import { Button } from "../../_components/button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "../../_components/dialog";
import { ProjectNode } from "./logic/project";
import { useDeleteProject } from "./use-delete-project";

type Props = {
  project: ProjectNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProjectDeleteDialog: React.FC<Props> = ({
  project,
  isOpen,
  onOpenChange,
}) => {
  const deleteProject = useDeleteProject();

  const handleDelete = () => {
    deleteProject.mutate(project.id);
  };

  const description = useMemo(() => {
    const projectName = <span className="font-bold">「{project.label}」</span>;

    if (project.descendantsProjectCount > 0) {
      return (
        <>
          {projectName}とその{project.descendantsProjectCount}
          件のサブプロジェクトとそのすべてのタスクは永久に削除されます。これを取り消すことはできません。
        </>
      );
    } else {
      return (
        <>
          {projectName}
          とそのタスクは永久に削除されます。これを取り消すことはできません。
        </>
      );
    }
  }, [project.label, project.descendantsProjectCount]);

  return (
    <Dialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle>削除しますか？</DialogTitle>
      <DialogContent>{description}</DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={() => onOpenChange(false)}>
          キャンセル
        </Button>
        <Button onClick={handleDelete} disabled={deleteProject.isPending}>
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};
