import moment from "moment";
import { BASE_URL_IMAGE } from "../constants/config";

export const logScreenName = (screenName) => {
  console.log("Screen:", screenName);
};

export const formatDate = (date) => {
  const dateStr = date;
  const [day, month, year] = dateStr.split("-");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export const nowDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const nowDate = year + "-" + month + "-" + day;
  return nowDate;
};

export const funcBaseUri_Image = (key, image) => {
  let uri = ""
  switch (key) {
    // checklist
    case 1:
      uri = `${BASE_URL_IMAGE}/checklist/${image}`;
      break;
    // báo cáo chỉ số
    case 2:
      uri = `${BASE_URL_IMAGE}/baocaochiso/${image}`;
      break;
    // sự cố ngoài
    case 3:
      uri = `${BASE_URL_IMAGE}/sucongoai/${image}`;
      break;
  }
  return uri;
};
