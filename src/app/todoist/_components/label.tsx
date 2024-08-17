import { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"label">;

export const Label: React.FC<Props> = (props) => {
  return <label {...props} className="font-bold" />;
};
