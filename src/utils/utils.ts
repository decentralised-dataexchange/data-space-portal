/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/default-param-last */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/naming-convention
const getDevice = () => {
  const isMobile = window.matchMedia('only screen and (min-width: 320px) and (max-width: 767px)').matches;
  const isTablet = window.matchMedia('only screen and (max-width: 1200px) and (min-width: 768px)').matches;
  return { isMobile, isTablet };
};

const publicRoutes = (pathname: string) => {
  return pathname == "/" || pathname == "/data-source-list"
}

const formatISODateToLocalString = (isoDateTime: string) => {
  const date = new Date(isoDateTime);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = date.getDate();
  const dayOfWeek = daysOfWeek[date.getDay()];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;

  return `${month} ${day}, ${year} ${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")}${ampm}`;
};

const imageBlobToBase64 = (imageBlob: any, image) => {
  let reader = new FileReader();
    reader.readAsDataURL(imageBlob);
    reader.onloadend = function() {
      const img = reader.result;
      if(image == 'logo') {
        localStorage.setItem('cachedLogoImage', img);
      } else {
        localStorage.setItem('cachedCoverImage', img);
      }
  }
  
}


export { getDevice, publicRoutes, formatISODateToLocalString, imageBlobToBase64 };