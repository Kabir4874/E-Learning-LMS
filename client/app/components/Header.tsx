"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import NavItems from "../utils/NavItems";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
};

const Header = ({ activeItem }: Props) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
          setActive(true);
        } else {
          setActive(false);
        }
      });
    }
  }, []);
  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 shadow-xl transition duration-500"
            : "dark:shadow"
        } w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c]`}
      >
        <div className="w-[95%] 800px:w-[92%] !mx-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-poppins font-medium text-black dark:text-white`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems activeItem={activeItem} isMobile={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
