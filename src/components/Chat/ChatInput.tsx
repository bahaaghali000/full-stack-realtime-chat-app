import { useState, FormEvent, ChangeEvent } from "react";
import {
  RiEmotionHappyLine,
  RiAttachmentLine,
  RiSendPlane2Fill,
} from "react-icons/ri";

import { db, storage } from "../../firebase.config";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import useAuth from "../../hooks/useAuth";
import { v4 as uuid } from "uuid";

import { RootState } from "../../redux/Store";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import { setLastMsg } from "../../redux/slices/userSlice";

const ChatInput: React.FC = () => {
  const { chatId } = useSelector((state: RootState) => state.user);

  const [message, setMessage] = useState<string>("");
  const [imageCaption, setImageCaption] = useState<string>("");
  const [image, setImage] = useState<File>();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const user = useAuth();

  const dispatch = useDispatch();

  const formatter: any = Intl.NumberFormat("en", {
    notation: "compact",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (image) {
      const storageRef = ref(storage, `chatImages/${uuid() + image.name}`);
      const uploadTask: any = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        () => {},
        (error: Error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: imageCaption,
                senderId: user.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
      setSelectedImage(undefined);
      setImage(undefined);

      toast.promise(uploadTask, {
        loading: "Sending...",
        success: "Sent successfully",
        error: "Somthing went wrong",
      });
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();

    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: uuid(),
        text: message,
        senderId: user.uid,
        date: Timestamp.now(),
      }),
    });

    dispatch(setLastMsg(message));

    await updateDoc(doc(db, "usersChats", chatId), {
      lastMsg: {
        text: message,
      },
      date: serverTimestamp(),
    });

    setMessage("");
    toast.success("Message sent successfully", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  return (
    <div className="z-40 w-full p-6 max-md:pb-0 mb-0  bg-white border-t lg:mb-1 border-gray-50 dark:bg-zinc-800 dark:border-zinc-700">
      <form onSubmit={handleSend} className="flex gap-2 items-center">
        <div className="flex-grow">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            required
            minLength={2}
            maxLength={150}
            className="
            w-full border-transparent rounded bg-gray-50 placeholder:text-base text-base dark:bg-zinc-700 dark:placeholder:text-gray-300 dark:text-gray-300 outline-none p-2"
            placeholder="Enter Message..."
          />
        </div>

        <div>
          <ul className="mb-0 flex items-center gap-5">
            <li className="inline-block" title="Emoji">
              <span className="border-transparent  relative dark:text-violet-200 text-base">
                <RiEmotionHappyLine />
              </span>
            </li>

            <li className="inline-block" title="Attached File">
              <label
                htmlFor="file"
                className="border-transparent  relative dark:text-violet-200 text-base cursor-pointer"
              >
                <RiAttachmentLine />
              </label>
              <input
                type="file"
                id="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </li>

            <li className="inline-block" title="Attached File">
              <button
                type="submit"
                className="text-white border-transparent btn bg-violet-500 hover:bg-violet-600"
              >
                <RiSendPlane2Fill />
              </button>
            </li>

            {selectedImage && (
              <li className=" absolute bottom-20 right-10 w-1/3 max-md:w-1/2 max-sm:w-3/4 h-60  dark:bg-zinc-700 shadow-2xl rounded-lg overflow-hidden">
                <div className=" relative flex flex-col items-center justify-between h-full gap-1 ">
                  <img
                    src={selectedImage}
                    className=" h-44 mt-2 mx-auto rounded-lg"
                    alt="Selected"
                  />
                  <p className=" absolute top-3 right-4 bg-slate-600 px-4 py-1 rounded-2xl text-base text-gray-100 font-semibold">
                    Size: {formatter.format(image?.size)}
                  </p>
                  <div className="flex justify-between  w-full gap-3 p-2">
                    <input
                      type="text"
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Write Caption"
                      className="
                        w-full border-transparent rounded bg-gray-50 placeholder:text-base text-base dark:bg-zinc-800 dark:placeholder:text-gray-300 dark:text-gray-300 outline-none px-2"
                    />
                    <button
                      onClick={handleUpload}
                      className="text-white text-left btn border-transparent p-2 rounded-lg  bg-violet-500 hover:bg-violet-600"
                    >
                      <RiSendPlane2Fill />
                    </button>
                  </div>
                </div>
              </li>
            )}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
