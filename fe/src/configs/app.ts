const CONFIG = {
  MAIN_API_URL: import.meta.env.VITE_MAIN_API as string,
  EMPLOYEE_IMAGE_URL: import.meta.env.VITE_EMPLOYEE_IMAGE_URL as string,
  APP_VERSION: import.meta.env.VITE_APP_VERSION as string,
  AXIOS_TIMEOUT: 15 * 1_000,
};

export default CONFIG;
