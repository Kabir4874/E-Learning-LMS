"use client";
import { useRef, useState } from "react";

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
    console.log("test");
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
  return <div>Verification</div>;
};

export default Verification;
