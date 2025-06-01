"use client";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { styles } from "../../..//app/styles/style";

type Props = {
  setRoute: (route: string) => void;
};
type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};
const Verification = ({ setRoute }: Props) => {
  const [invalidError, setInvalidError] = useState<boolean>(false);
  const [activation, { isSuccess, error, isLoading }] = useActivationMutation();
  const { token } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully", { duration: 3000 });
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message, { duration: 3000 });
        setInvalidError(true);
      }
    }
  }, [isSuccess, error]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    "0": "",
    "1": "",
    "2": "",
    "3": "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };
  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);
    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };
  return (
    <div>
      <h1 className={styles.title}>Verify Your Account</h1>
      <br />
      <div className="w-full flex items-center justify-center mt-2!">
        <div className="w-[80px] h-[80px] rounded-full! bg-[#497df2]! flex items-center justify-center">
          <VscWorkspaceTrusted size={40} />
        </div>
      </div>
      <br />
      <br />
      <div className="m-auto! flex items-center justify-around">
        {Object.keys(verifyNumber).map((key, index) => (
          <input
            type="number"
            key={key}
            ref={inputRefs[index]}
            className={`w-[65px] h-[65px] bg-transparent! border-[3px]! rounded-[10px]! flex items-center text-black! dark:text-white! justify-center text-[18px]! font-poppins! outline-none text-center ${
              invalidError
                ? "shake border-red-500!"
                : "dark:border-white! border-[#0000004a]!"
            }`}
            placeholder=""
            maxLength={1}
            value={verifyNumber[key as keyof VerifyNumber]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        ))}
      </div>
      <br />
      <br />
      <div className="w-full flex justify-center p-4!">
        <button className={styles.button} onClick={verificationHandler}>
          {isLoading ? "Loading..." : "Verify OTP"}
        </button>
      </div>
      <br />
      <h5 className="text-center pb-4! font-poppins! text-[14px]! text-black! dark:text-white!">
        Go back to sign in?{" "}
        <span
          className="text-[#2190ff]! pl-1! cursor-pointer"
          onClick={() => setRoute("Login")}
        >
          Sign In
        </span>
      </h5>
    </div>
  );
};

export default Verification;
