import { useState, useEffect, FormEvent } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import useAuth from "../../hooks/useAuth";

import { RiEdit2Line } from "react-icons/ri";
import { db, storage } from "../../firebase.config";

import { v4 as uuid } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const Settings: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [city, setCity] = useState<string>("");

  const user = useAuth();

  useEffect(() => {
    setBio(user?.bio);
    setUsername(user?.displayName);
    setCity(user?.city);
  }, [user]);

  const uploadPic = (file: File) => {
    const storageRef = ref(storage, `profilePictures/${uuid() + file.name}`);

    const uploadTask: any = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      (error: Error) => {
        console.log(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateDoc(doc(db, "users", user.uid), {
            photoURL: downloadURL,
          });
        });
      }
    );
    toast.promise(uploadTask, {
      loading: "Uploading...",
      success: "Uploaded successfully",
      error: "Somthing went wrong",
    });
  };

  const handleUpdate = (e: FormEvent) => {
    e.preventDefault();
    updateDoc(doc(db, "users", user.uid), {
      displayName: username || "",
      city: city || "",
      bio: bio || "",
    })
      .then(() => {
        toast.success("Your Profile updated successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between px-6 pt-6 max-md:pt-2">
        <h2 className="text-xl font-semibold mb-0 text-gray-700 dark:text-gray-50">
          Settings
        </h2>
      </div>

      <div className="p-6 text-center border-b border-gray-100 dark:border-zinc-600">
        <div className="flex justify-center mt-8 max-md:mt-2 flex-col items-center">
          <div className="w-24 h-24 rounded-full relative flex">
            <img
              className="p-1 rounded-full bg-gray-50 dark:bg-zinc-700 object-cover "
              src={user?.photoURL}
              alt="Profile Picture"
            />
            <label
              htmlFor="img"
              className=" w-10 h-10 cursor-pointer text-gray-50 flex items-center justify-center dark:bg-black absolute bottom-0 right-0 rounded-full"
            >
              <RiEdit2Line />
            </label>

            <input
              onChange={(e: any) => uploadPic(e.target.files[0])}
              type="file"
              id="img"
              className="hidden"
              accept="image/*"
            />
          </div>

          <h4 className="mb-1 mt-3 text-base font-semibold  dark:text-gray-50">
            {user?.displayName}
          </h4>
          <p className="text-gray-400">
            {user?.bio ? user?.bio : "Edit bio in the bottom to show here"}
          </p>
        </div>
      </div>

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
              readOnly
            />
          </div>

          <div className="mt-3 px-4">
            <p className="mb-1 text-gray-500 dark:text-gray-300 font-semibold">
              Bio:
            </p>
            <input
              type="text"
              className="text-base px-1 dark:text-gray-50 outline-none bg-slate-100 dark:bg-zinc-600 w-full h-8 rounded"
              placeholder="Enter Bio"
              minLength={4}
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
              className="text-base px-1 dark:text-gray-50 outline-none bg-slate-100 dark:bg-zinc-600 w-full h-8 rounded"
              placeholder="Enter Username"
              minLength={4}
              maxLength={20}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="mt-5 px-4">
            <button
              type="submit"
              className="text-white border-transparent btn bg-violet-500 hover:bg-violet-600"
            >
              Edit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
