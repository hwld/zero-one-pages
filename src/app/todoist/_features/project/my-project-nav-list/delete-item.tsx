import { PiTrashLight } from "@react-icons/all-files/pi/PiTrashLight";
import { ProjectDeleteDialog } from "../project-delete-dialog";
import { ProjectNode } from "../logic/project";
import { useState } from "react";
import { MenuButtonItem } from "../../../_components/menu/item";

type Props = { project: ProjectNode };

export const ProjectDeleteMenuItem: React.FC<Props> = ({ project }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <ProjectDeleteDialog
        trigger={
          <MenuButtonItem
            closeMenuOnClick={false}
            icon={PiTrashLight}
            label="削除"
            variant="destructive"
            onClick={() => setIsDialogOpen(true)}
          />
        }
        project={project}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
