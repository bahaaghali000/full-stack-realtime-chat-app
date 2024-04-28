import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import Loader from "../Loader";
import { userLocation } from "../../utils";

interface Props {
  imageBase64: string;
}

const PersonalInformation: React.FC<Props> = ({ imageBase64 }) => {
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const { user } = useContext(AuthContext);
  const { loading, updateProfile } = useUpdateProfile();

  useEffect(() => {
    setBio(user?.bio);
    setUsername(user?.username);
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateProfile({ username, bio, imageBase64 });
  };

  const getLocation = async () => {
    const data = await userLocation();

    setCity(data?.city);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <h2 className=" text-lg px-8 py-3 font-semibold mb-0 text-gray-700 dark:text-gray-50">
        Personal Info:
      </h2>

      <form className="px-5 py-2" onSubmit={handleUpdate}>
        <div className=" px-4">
          <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
            Name:
          </p>
          <input
            type="text"
            className="text-base px-1 dark:text-gray-50 outline-none bg-slate-100 dark:bg-zinc-600 w-full h-8 rounded"
            placeholder="Enter Username"
            minLength={4}
            maxLength={20}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-3 px-4">
          <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
            Email:
          </p>
          <input
            type="text"
            className="text-base px-1 dark:text-gray-50 outline-none bg-slate-100 dark:bg-zinc-600 cursor-not-allowed w-full h-8 rounded"
            value={user?.email}
            disabled
          />
        </div>

        <div className="mt-3 px-4">
          <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
            Bio:
          </p>
          <textarea
            className="text-base px-1 dark:text-gray-50 outline-none bg-slate-100 dark:bg-zinc-600 w-full rounded"
            placeholder="Enter Bio"
            minLength={4}
            rows={3}
            maxLength={100}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <p className=" text-sm pl-1 text-gray-400 ">
            Write something about you in max 100 character
          </p>
        </div>

        <div className=" mt-3 px-4">
          <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
            City:
          </p>
          <input
            type="text"
            className="text-base input-disabled  px-1 dark:text-gray-50 outline-none bg-slate-100 dark:bg-zinc-600 w-full h-8 rounded"
            placeholder="Enter City"
            minLength={4}
            maxLength={20}
            value={city}
            disabled
            onChange={(e) => setCity(e.target.value)}
          />
          <p className="text-sm mt-1">We Get your location from your IP</p>
        </div>

        <div className="mt-5 px-4">
          <button
            type="submit"
            className="text-white border-transparent btn bg-violet-500 hover:bg-violet-600"
          >
            {loading ? <Loader /> : "Edit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
