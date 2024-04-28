import axios from "axios";
import FileSaver from "file-saver";

export const fileSaver = (file: any, name: string) => {
  FileSaver.saveAs(file, name);
};

export const convertToBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (err) => {
      reject(err);
    };
  });
};

export const messageTime = (time: any) => {
  const d = new Date();
  const date = time?.split("T")[1]?.split(".")[0];

  const dateArr = date?.split(":");

  const hours = dateArr && +dateArr[0] + -d.getTimezoneOffset() / 60;

  if (hours > 12) {
    return `${hours - 12}:${dateArr[1]}:${dateArr[2]} PM`;
  } else {
    return dateArr && `${hours}:${dateArr[1]}:${dateArr[2]} AM`;
  }
};

export const userLocation = async () => {
  const { data } = await axios.get("https://api.ipify.org/?format=json");

  const res = await axios.get(
    `https://ipinfo.io/${data?.ip}?token=${import.meta.env.VITE_IPINFO_TOKEN}`
  );

  return res.data;
};
