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


export { getDevice, publicRoutes };