import { IconClipboardText } from "@tabler/icons-react";

export const EmptyTableRow: React.FC = () => {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex h-[400px] w-full items-center justify-center">
          <div className="flex w-[300px] flex-col items-center gap-3 text-center">
            <IconClipboardText size={100} strokeWidth={1.5} />
            <p className="text-lg font-bold">今日やるべきことはなんですか？</p>
            <p className="w-[230px] text-sm text-zinc-300">
              `Cmd+K`または`Ctrl+K`でタスクの入力を開始できます。。
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
};
