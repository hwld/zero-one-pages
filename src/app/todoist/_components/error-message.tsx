import { ComponentPropsWithoutRef } from "react";

type Props = { errorId: string } & Omit<ComponentPropsWithoutRef<"p">, "id">;

export const ErrorMessage: React.FC<Props> = ({ errorId, ...props }) => {
  return <p {...props} id={errorId} className="text-xs text-red-600" />;
};
