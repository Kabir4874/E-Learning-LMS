"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
};

const Header = ({ activeItem, setOpen }: Props) => {
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
  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      {
        setOpenSidebar(false);
      }
    }
  };
  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 shadow-xl transition duration-500"
            : "dark:shadow"
        } w-full h-[80px] z-[80] !border-b dark:border-[#ffffff1c]`}
      >
        <div className="w-[95%] 800px:w-[92%] !mx-auto py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-poppins font-medium !text-black dark:!text-white`}
              >
                ELearning
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <NavItems activeItem={activeItem} isMobile={false} />
              <ThemeSwitcher />

              {/* only for mobile  */}
              <div className="800px:hidden">
                <HiOutlineMenuAlt3
                  size={25}
                  className=" cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              <div className="hidden 800px:block">
                <HiOutlineUserCircle
                  size={25}
                  className=" cursor-pointer dark:text-white text-black"
                  onClick={() => setOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
        {/* mobile sidebar  */}
        {openSidebar && (
          <div
            className=" fixed w-full h-screen top-0 left-0 z-[999999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[9999999999] h-screen bg-white dark:bg-slate-900 dark:opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer !ml-6 !my-4 text-black dark:text-white"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] !py-2 !pl-5 text-black dark:text-white">
                Copyright © 2025 ELearning
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
