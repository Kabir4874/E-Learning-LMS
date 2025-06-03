import Image from "next/image";
import Avatar from "../../../public/avatar.png";
type Props = {
  user: any;
  active: number;
  avatar: string | null;
  setActive: (active: number) => void;
  logoutHandler: any;
};

const SidebarProfile = ({
  user,
  active,
  setActive,
  avatar,
  logoutHandler,
}: Props) => {
  return (
    <div className="w-full">
      <div
        className={`w-full flex items-center px-3! py-4! cursor-pointer ${
          active === 1 ? "bg-slate-800!" : "bg-transparent"
        }`}
        onClick={() => setActive(1)}
      >
        <Image
          src={user?.avatar || avatar ? user.avatar || avatar : Avatar}
          alt="avatar"
          className="w-[20px] h-[20px] 800px:w-[30px] 800px:h-[30px] cursor-pointer rounded-full"
        />
      </div>
    </div>
  );
};

export default SidebarProfile;
