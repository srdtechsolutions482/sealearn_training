const API_URL=import.meta.env.VITE_API_URL

export const API_CONFIG = {

  // The main entry point for the backend API
  BASE_URL: API_URL,

  // Specific endpoints appended to the BASE_URL
  ENDPOINTS: {
    GET_COURSES: "/course",
    GET_COUNTRIES: "/countries",
    GET_STATES: "/states",
    GET_ISO_CODES: "/isocode",
    CREATE_INSTITUTE: "/createinstitutes",
    REGISTER_SEAFARER: "/register",
    GET_INSTITUTE_DETAILS:"/getinstitutesdetails"
  },

  // Request headers (optional, can be expanded)
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
