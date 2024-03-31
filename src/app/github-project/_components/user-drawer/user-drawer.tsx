import { useState } from "react";
import { Drawer } from "../drawer/drawer";
import { Avatar } from "../avatar";

export const UserDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      position="right"
      trigger={
        <button>
          <Avatar />
        </button>
      }
    >
      <div></div>
    </Drawer>
  );
};
