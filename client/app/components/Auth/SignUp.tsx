import { useFormik } from "formik";
import { useState } from "react";
import {
  AiFillGithub,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import * as Yup from "yup";
import { styles } from "../../../app/styles/style";
type Props = {
  setRoute: (route: string) => void;
};

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name!"),
  email: Yup.string()
    .email("Invalid Email")
    .required("Please enter you email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

const SignUp = ({ setRoute }: Props) => {
  const [show, setShow] = useState(false);
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password }) => {
      setRoute("Verification");
    },
  });
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className="w-full p-4!">
      <h1 className={`${styles.title}`}>Join to ELearning</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className={styles.label}>
          Enter you Name
        </label>
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={handleChange}
          id="name"
          placeholder="enter your name"
          className={`${errors.name && touched.name && "border-red-500!"} ${
            styles.input
          } `}
        />
        {errors.name && touched.name && (
          <span className="text-red-500! pt-2! block!">{errors.name}</span>
        )}
        <div className="w-full mt-5! relative mb-1!">
          <label htmlFor="email" className={styles.label}>
            Enter you Email
          </label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            id="email"
            placeholder="example@gmail.com"
            className={`${errors.email && touched.email && "border-red-500!"} ${
              styles.input
            } `}
          />
          {errors.email && touched.email && (
            <span className="text-red-500! pt-2! block!">{errors.email}</span>
          )}
        </div>
        <div className="w-full mt-5! relative mb-1!">
          <label htmlFor="password" className={styles.label}>
            Enter you Password
          </label>
          <input
            type={!show ? "password" : "text"}
            name="password"
            value={values.password}
            onChange={handleChange}
            id="password"
            placeholder="password"
            className={`${
              errors.password && touched.password && "border-red-500!"
            } ${styles.input}`}
          />
          {!show ? (
            <AiOutlineEyeInvisible
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(true)}
            />
          ) : (
            <AiOutlineEye
              className="absolute bottom-3 right-2 z-1 cursor-pointer"
              size={20}
              onClick={() => setShow(false)}
            />
          )}
        </div>
        {errors.password && touched.password && (
          <span className="text-red-500! pt-2! block">{errors.password}</span>
        )}
        <div className="w-full mt-5!">
          <input type="submit" value="Sign Up" className={styles.button} />
        </div>
        <br />
        <h5 className="text-center pt-4! font-poppins! text-[14px]! text-black dark:text-white">
          Or join with
        </h5>
        <div className="flex items-center justify-center my-3!">
          <FcGoogle size={30} className=" cursor-pointer mr-2!" />
          <AiFillGithub
            size={30}
            className=" cursor-pointer ml-2! text-black dark:text-white"
          />
        </div>
        <h5 className="text-center pt-4! font-poppins! text-[14px]! text-black! dark:text-white!">
          Already have an account?{" "}
          <span
            className="text-[#2190ff]! pl-1! cursor-pointer"
            onClick={() => setRoute("Login")}
          >
            Login
          </span>
        </h5>
      </form>
      <br />
    </div>
  );
};

export default SignUp;
