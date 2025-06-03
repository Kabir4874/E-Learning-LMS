"use client";
import { useEffect, useState } from "react";
import SidebarProfile from "./SidebarProfile";

type Props = {
  user: any;
};

const Profile = ({ user }: Props) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);

  const logoutHandler = async () => {
    console.log("logout handler");
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
          setScroll(true);
        } else {
          setScroll(false);
        }
      });
    }
  }, []);
  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] 800px:w-[310px] h-[450px] bg-slate-900! opacity-90 border! border-[##ffffff1d]! rounded-[5px]! shadow-sm! sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        }`}
      >
        <SidebarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logoutHandler={logoutHandler}
        />
      </div>
    </div>
  );
};

export default Profile;
