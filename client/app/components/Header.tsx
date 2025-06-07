"use client";
import { useSocialAuthMutation } from "@/redux/features/auth/authApi";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import avatar from "../../public/avatar.png";
import CustomModal from "../utils/CustomModal";
import NavItems from "../utils/NavItems";
import ThemeSwitcher from "../utils/ThemeSwitcher";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import Verification from "./Auth/Verification";
type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header = ({ open, activeItem, setOpen, route, setRoute }: Props) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);

  const { user } = useSelector((state: any) => state.auth);
  console.log(user, "user");
  const { data } = useSession();
  const [socialAuth, { isSuccess, error }] = useSocialAuthMutation();

  useEffect(() => {
    if (!user) {
      if (data) {
        socialAuth({
          email: data.user?.email,
          name: data.user?.name,
          avatar: data.user?.image,
        });
      }
    }
    if (isSuccess) {
      toast.success("Login Successful", { duration: 3000 });
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message, { duration: 3000 });
      }
    }
  }, [data, user, error]);

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
            ? "dark:opacity-50 dark:bg-linear-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 shadow-xl! transition duration-500"
            : "dark:shadow!"
        } w-full h-[80px] z-80 border-b! dark:border-[#ffffff1c]!`}
      >
        <div className="w-[95%] 800px:w-[92%] mx-auto! py-2 h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div>
              <Link
                href={"/"}
                className={`text-[25px] font-poppins font-medium text-black! dark:text-white!`}
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
                {user ? (
                  <Link href={"/profile"}>
                    <Image
                      src={user?.avatar ? user.avatar : avatar}
                      alt="avatar"
                      width={30}
                      height={30}
                      className=" cursor-pointer"
                    />
                  </Link>
                ) : (
                  <HiOutlineUserCircle
                    size={25}
                    className=" cursor-pointer dark:text-white text-black"
                    onClick={() => setOpen(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* mobile sidebar  */}
        {openSidebar && (
          <div
            className=" fixed w-full h-screen top-0 left-0 z-999999 dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-9999999999 h-screen bg-white dark:bg-slate-900 dark:opacity-90 top-0 right-0">
              <NavItems activeItem={activeItem} isMobile={true} />
              <HiOutlineUserCircle
                size={25}
                className="cursor-pointer ml-6! my-4! text-black dark:text-white"
                onClick={() => setOpen(true)}
              />
              <br />
              <br />
              <p className="text-[16px] py-2! pl-5! text-black dark:text-white">
                Copyright © 2025 ELearning
              </p>
            </div>
          </div>
        )}
      </div>
      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}
      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
      {route === "Verification" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Verification}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
