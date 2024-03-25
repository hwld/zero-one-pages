"use client";
import { useClickOutside } from "@mantine/hooks";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  BookIcon,
  HomeIcon,
  LucideIcon,
  MapIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { z } from "zod";

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMenuOpen = !!z.string().nullable().parse(searchParams.get("isOpen"));

  const ref = useClickOutside(() => {
    onCloseMenu();
  });

  const onOpenMenu = () => {
    router.push(`${pathname}?isOpen=true`);
  };

  const onCloseMenu = () => {
    router.push(`${pathname}`);
  };

  return (
    <motion.div className="grid h-full min-h-screen place-items-center">
      <div className="relative grid min-h-screen w-full max-w-screen-lg gap-2 px-2 pt-10"></div>
      <div className="fixed bottom-6 flex w-full max-w-screen-lg justify-end px-6">
        {isMenuOpen ? (
          <motion.div
            ref={ref}
            layoutId="panel"
            className="w-[300px] overflow-hidden bg-neutral-900 p-3 text-neutral-100"
            style={{ borderRadius: "20px" }}
          >
            <motion.div layoutId="menu-items" className="flex flex-col gap-2">
              <Item
                isMenuOpen={isMenuOpen}
                icon={
                  <span className="relative">
                    <ItemIcon icon={BookIcon} className="bg-orange-500" />
                    <motion.span
                      layoutId="button"
                      className="absolute left-0 top-0 opacity-0"
                    />
                  </span>
                }
                title="Book"
                href="continuty-transition/book"
              >
                Book flights, hotels, and activities for your next adventure.
              </Item>
              <Item
                isMenuOpen={isMenuOpen}
                icon={<ItemIcon icon={MapIcon} className="bg-rose-500" />}
                title="Explore"
                href="continuty-transition/explore"
              >
                Discover new destinations and plan your itinerary.
              </Item>
              <Item
                isMenuOpen={isMenuOpen}
                icon={<ItemIcon icon={HomeIcon} className="bg-cyan-500" />}
                title="Stay"
                href="continuty-transition/stay"
              >
                Find the perfect accomodation for a comfortable stay.
              </Item>
            </motion.div>
          </motion.div>
        ) : (
          <motion.button
            layoutId="panel"
            className="grid size-[40px] place-items-center bg-neutral-900 text-neutral-100 transition-colors hover:bg-neutral-700"
            onClick={onOpenMenu}
            style={{ borderRadius: "20px" }}
          >
            <motion.div layout="preserve-aspect" layoutId="button">
              <PlusIcon />
            </motion.div>
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Page;

const Item: React.FC<{
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href: string;
  isMenuOpen: boolean;
}> = ({ icon, title, children, href, isMenuOpen }) => {
  return (
    <motion.span layout="position">
      <Link
        href={`/${href}${isMenuOpen ? "?isOpen=true" : ""}`}
        className="flex gap-2 rounded-lg border border-neutral-700 bg-neutral-800 p-2 transition-colors hover:bg-neutral-700"
      >
        {icon}
        <div className="flex flex-col">
          <div className="font-bold">{title}</div>
          <div className="break-all text-sm text-neutral-300">{children}</div>
        </div>
      </Link>
    </motion.span>
  );
};

const ItemIcon: React.FC<{ icon: LucideIcon; className: string }> = ({
  icon: Icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        "grid size-[30px] shrink-0 place-items-center rounded-full",
        className,
      )}
    >
      <Icon size={18} />
    </div>
  );
};
