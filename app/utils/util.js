import moment from "moment";
import { BASE_URL_IMAGE, BASE_URL } from "../constants/config";
import axios from "axios";

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

export const validatePassword = (password) => {
  // Kiểm tra nếu mật khẩu chỉ là số
  const isAllDigits = /^\d+$/.test(password);

  if (isAllDigits) {
    return false; // Nếu chỉ toàn số, trả về false
  }

  // Nếu không phải là toàn số, thì hợp lệ
  return password.length >= 6;
};

export const getImageUrls = (key, item) => {
  if (!item) return null;
  return item.endsWith(".jpg") || item.endsWith(".jpeg") || item.endsWith(".png") 
      || item.endsWith(".JPG") || item.endsWith(".JPEG") || item.endsWith(".PNG")
    ? funcBaseUri_Image(key, item.trim())
    : `https://drive.google.com/thumbnail?id=${item.trim()}`;
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

export const getSharePointList = async (link) => {
  try {
    const response = await axios.get(`${BASE_URL}/sharepoint-api?link=${link}`, {
      responseType: 'arraybuffer',
    });
    
    // Chuyển ArrayBuffer thành base64 string
    const arrayBuffer = response.data;
    const bytes = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64String = btoa(binary);
    
    // Lấy content type từ header
    const contentType = response.headers['content-type'] || 'image/jpeg';
    
    // Tạo data URI
    const dataUri = `data:${contentType};base64,${base64String}`;
    
    return dataUri;
  } catch (error) {
    console.error('Error in getSharePointList:', error);
    throw error;
  }
};
