import { PiUserBold } from "@react-icons/all-files/pi/PiUserBold";
import clsx from "clsx";

type Props = { size?: "md" | "sm" };

export const UserIcon: React.FC<Props> = ({ size = "md" }) => {
  const sizeClass = {
    md: { base: "size-7", icon: "size-5" },
    sm: { base: "size-5", icon: "" },
  };

  return (
    <div
      className={clsx(
        "grid place-items-center rounded-full bg-stone-500 text-stone-100",
        sizeClass[size].base,
      )}
    >
      <PiUserBold className={clsx(sizeClass[size].icon)} />
    </div>
  );
};
