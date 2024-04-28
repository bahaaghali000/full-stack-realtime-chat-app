import logo from "../assets/logo-dark-removebg-preview (1).png";
import { FaGithub } from "react-icons/fa";

const About = () => {
  return (
    <div className=" min-h-screen max-md:w-full shadow w-[300px] text-gray-700 dark:text-gray-50  dark:bg-zinc-700">
      <div className="px-6 pt-6 flex items-center justify-between">
        <h4 className="mb-0 text-xl font-semibold">About us</h4>
        <div>
          <a
            target="_blank"
            href="https://github.com/bahaaghali000/BGChat"
            className="text-2xl "
          >
            <FaGithub />
          </a>
        </div>
      </div>

      <div>
        <div className="text-center w-full flex items-center justify-center mt-10 gap-2">
          <img className=" w-12 " src={logo} alt="logo" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
            BGChat
          </h2>
        </div>

        <span className="mt-10 mb-5 border-b border-gray-100/20 block"></span>

        <div className="px-7 leading-6">
          This is chat app is developed by{" "}
          <a
            target="_blank"
            href="https://github.com/bahaaghali000/"
            className="font-medium text-indigo-400"
          >
            bahaaghali000
          </a>
          . UI taken from{" "}
          <a
            target="_blank"
            href="https://themesbrand.com/chatvia-tailwind/"
            className=" font-medium text-indigo-400"
          >
            ThemeForest.
          </a>{" "}
          you can take a look at the repo on{" "}
          <a
            target="_blank"
            href="https://github.com/bahaaghali000/BGChat"
            className="font-medium text-indigo-400"
          >
            GitHub
          </a>{" "}
          by clicking on Github icon at the top.
        </div>
      </div>
    </div>
  );
};

export default About;
