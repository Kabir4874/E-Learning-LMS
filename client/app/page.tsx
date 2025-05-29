"use client";

import { useState } from "react";
import Header from "./components/Header";
import Heading from "./utils/Heading";
type Props = {};

const Page = (props: Props) => {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  return (
    <div>
      <Heading
        title="ELearning"
        description="ELearning is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning"
      />
      <Header open={open} activeItem={activeItem} setOpen={setOpen} />
    </div>
  );
};

export default Page;
