import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { userLocation } from "../utils";

const Profile = () => {
  const [city, setCity] = useState<string>("");
  const { user } = useContext(AuthContext);

  const getLocation = async () => {
    const data = await userLocation();

    setCity(data?.city);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="min-h-screen max-md:w-full w-[300px] dark:bg-zinc-700">
      <div className="flex items-center justify-between px-6 pt-6">
        <h2 className="text-xl font-semibold mb-0 text-gray-700 dark:text-gray-50">
          My Profile
        </h2>
      </div>

      <div className="p-6 text-center border-b border-gray-100 dark:border-zinc-600">
        <div className="flex justify-center mt-4 flex-col items-center">
          <div className="w-24 h-24 rounded-full relative flex cursor-pointer">
            <img
              className="p-1 rounded-full bg-gray-50 dark:bg-zinc-700 object-cover "
              src={user?.profilePic}
              alt={user?.username}
            />
          </div>

          <h4 className="mb-1 mt-3 text-base font-semibold  dark:text-gray-50">
            {user?.displayName}
          </h4>
          <p className="text-gray-400">
            {user?.bio ? user?.bio : "Edit bio in the settings to show here"}
          </p>
        </div>
      </div>

      <div>
        <h2 className=" text-lg px-8 py-3 font-semibold mb-0 text-gray-700 dark:text-gray-50">
          Personal Info:
        </h2>

        <form className="px-5 py-2">
          <div className=" px-4">
            <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
              Name:
            </p>
            <h5 className="text-base pl-1 dark:text-gray-50">
              {user?.username}
            </h5>
          </div>

          <div className="mt-3 px-4">
            <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
              Email:
            </p>
            <h5 className="text-base pl-1 dark:text-gray-50">{user?.email}</h5>
          </div>

          <div className="mt-3 px-4">
            <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
              Bio:
            </p>
            <h5 className="text-base pl-1 dark:text-gray-50">
              {user?.bio ? user?.bio : "Not added yet"}
            </h5>
          </div>

          <div className=" mt-3 px-4">
            <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
              City:
            </p>
            <h5 className="text-base pl-1 dark:text-gray-50">{city}</h5>
            <p className="text-sm mt-1">We Get your location from your IP</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
