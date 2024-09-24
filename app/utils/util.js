import moment from "moment";

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
