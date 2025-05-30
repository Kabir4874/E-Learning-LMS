import Image from "next/image";
import Link from "next/link";
import { BiSearch } from "react-icons/bi";

const Hero = () => {
  return (
    <div className="w-full 1000px:flex items-center">
      <div className="absolute top-[100px] left-[100px] 1000px:top-[unset] 1500px:h-[700px] 1500px:w-[700px] 1100px:h-[600px] 1100px:w-[600px] h-[50vh] w-[50vh] hero_animation rounded-full"></div>

      <div className="1000px:w-[40%] flex 1000px:min-h-screen items-center justify-end pt-[70px] 1000px:pt-[0] z-10">
        <Image
          src="/test.svg"
          alt="hero image"
          width={40}
          height={40}
          className="object-contain 1100px:max-w-[90%] w-[90%] 1500px:max-w-[85%] h-[auto] z-[10]"
        />
      </div>

      <div className="1000px:w-[60%] flex flex-col items-center 1000px:mt-[0px] text-center 1000px:text-left mt-[150px]">
        <h2 className="dark:text-white text-[#000000c7] !text-[30px] !px-3 w-full 1000px:!text-[70px] !font-semibold font-josefin !py-2 1000px:leading-[75px] 1500px:w-[60%]">
          Improve Your Online Learning Experience Better Instantly
        </h2>
        <hr />
        <p className="dark:text-[#edfff4] text-[#000000ac] font-josefin font-semibold !text-[18px] 1500px:w-[55%] 1100px:w-[79%]">
          We have 40k+ online courses & 500k+ online registered student, find
          your desired Courses from them.
        </p>
        <hr />
        <br />

        <div className="1500px:w-[55%] 1100px:w-[79%] w-[90%] h-[50px] bg-transparent relative">
          <input
            type="search"
            placeholder="Search Courses..."
            className="bg-transparent !border dark:!border-none dark:!bg-[#575757] dark:placeholder:!text-[#ffffffdd] !rounded-[5px] !p-2 w-full h-full outline-none !text-[#000000b8]"
          />
          <div className="absolute flex items-center justify-center w-[50px] cursor-pointer h-[50px] right-0 top-0 bg-[#39C1f3] rounded-r-[5px]">
            <BiSearch className="text-white" size={30} />
          </div>
        </div>

        <br />
        <br />

        <div className="1500px:w-[55%] 1100px:w-[78%] w-[90%] flex items-center">
          <Image
            src={"/428573.png"}
            alt=""
            className="rounded-full"
            width={40}
            height={40}
          />
          <Image
            src={"/219988.png"}
            alt=""
            className="rounded-full !ml-[-20px]"
            width={40}
            height={40}
          />
          <Image
            src={"/219969.png"}
            alt=""
            className="rounded-full !ml-[-20px]"
            width={40}
            height={40}
          />
          <p className="font-josefin dark:text-[#edfff4] text-[#000000b3] 1000px:!pl-3 !text-[18px] font-semibold">
            500K+ People already trusted us.{" "}
            <Link
              href="/courses"
              className="dark:!text-[#46e256] !text-[crimson]"
            >
              View Courses
            </Link>
          </p>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Hero;
