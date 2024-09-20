import moment from 'moment';

export const logScreenName = (screenName) => {
  console.log("Screen:", screenName);
};

export const formatDate = (date) => {
  const dateStr = date;
  const [day, month, year] = dateStr.split('-'); 
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

