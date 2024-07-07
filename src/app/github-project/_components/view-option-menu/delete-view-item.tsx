import { TrashIcon } from "lucide-react";
import { DropdownItem } from "../dropdown/item";
import { ViewSummary } from "../../_backend/view/api";
import { useDeleteView } from "../../_queries/use-delete-view";
import { ViewDeleteConfirmDialogTrigger } from "../view-delete-confirm-dialog";
import { useRouter } from "next/navigation";
import { Routes } from "../../routes";

type Props = { viewSummary: ViewSummary };

export const DeleteViewItem: React.FC<Props> = ({ viewSummary }) => {
  const router = useRouter();
  const deleteViewMutation = useDeleteView({
    onSuccess: () => {
      router.push(Routes.home({}));
    },
  });

  const handleDeleteView = () => {
    deleteViewMutation.mutate(viewSummary.id);
  };

  return (
    <ViewDeleteConfirmDialogTrigger
      onDelete={handleDeleteView}
      isDeleting={deleteViewMutation.isPending}
    >
      <DropdownItem
        icon={TrashIcon}
        label="Delete view"
        red
        disabled={deleteViewMutation.isPending}
      />
    </ViewDeleteConfirmDialogTrigger>
  );
};
