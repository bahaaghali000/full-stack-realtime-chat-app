import { useState, useEffect, useContext, ChangeEvent } from "react";
import { RiEdit2Line } from "react-icons/ri";
import { AuthContext } from "../context/AuthContext";
import PersonalInformation from "../components/settings/PersonalInformation";
import { convertToBase64 } from "../utils";
import { CiDark, CiLight } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/Store";
import { changeChatTheme } from "../redux/slices/userSlice";

const Settings: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [imageBase64, setImageBase64] = useState<string | any>("");
  const [image, setImage] = useState<string | undefined>(undefined);

  const { darkMode } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    setImage(user?.profilePic);
  }, [user]);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setImageBase64(base64);

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (darkMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, user]);

  return (
    <div className="min-h-screen max-md:w-full w-[300px] dark:bg-zinc-700">
      <div className="flex items-center justify-between px-6 pt-6 max-md:pt-2">
        <h2 className="text-xl font-semibold mb-0 text-gray-700 dark:text-gray-50">
          Settings
        </h2>
        <div className=" mt-2">
          <span
            onClick={() => dispatch(changeChatTheme(undefined))}
            className=" block text-4xl w-10 h-10 text-gray-400 cursor-pointer"
          >
            {darkMode === "dark" ? <CiLight /> : <CiDark />}
          </span>
        </div>
      </div>

      <div className="p-6 text-center border-b border-gray-100 dark:border-zinc-600">
        <div className="flex justify-center mt-8 max-md:mt-2 flex-col items-center">
          <div className="w-24 h-24 rounded-full relative flex">
            <img
              className="p-1 rounded-full bg-gray-50 dark:bg-zinc-700 object-cover "
              src={image}
              alt={user?.username}
            />
            <label
              htmlFor="img"
              className=" w-10 h-10 cursor-pointer text-gray-50 flex items-center justify-center dark:bg-black absolute bottom-0 right-0 rounded-full"
            >
              <RiEdit2Line />
            </label>

            <input
              onChange={handleImageChange}
              type="file"
              id="img"
              className="hidden"
              accept="image/*"
            />
          </div>

          <h4 className="mb-1 mt-3 text-base font-semibold  dark:text-gray-50">
            {user?.username}
          </h4>
          <p className="text-gray-400">
            {user?.bio ? user?.bio : "Edit bio in the bottom to show here"}
          </p>
        </div>
      </div>

      <PersonalInformation imageBase64={imageBase64} />
    </div>
  );
};

export default Settings;
