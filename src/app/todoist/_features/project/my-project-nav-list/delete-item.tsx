import { MenuButtonItem } from "@/app/todoist/_components/menu/item";
import { PiTrashLight } from "@react-icons/all-files/pi/PiTrashLight";
import { ProjectDeleteDialog } from "../project-delete-dialog";
import { ProjectNode } from "../logic/project";
import { useState } from "react";

type Props = { project: ProjectNode };

export const ProjectDeleteMenuItem: React.FC<Props> = ({ project }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <MenuButtonItem
        closeMenuOnClick={false}
        icon={PiTrashLight}
        label="削除"
        variant="destructive"
        onClick={() => setIsDialogOpen(true)}
      />
      <ProjectDeleteDialog
        project={project}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
