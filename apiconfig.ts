export const API_CONFIG = {
  // The main entry point for the backend API
  BASE_URL: "https://api.srdtechsolutions.com",

  // Specific endpoints appended to the BASE_URL
  ENDPOINTS: {
    GET_COURSES: "/course",
    GET_COUNTRIES: "/countries",
    GET_STATES: "/states",
    GET_ISO_CODES: "/isocode",
    CREATE_INSTITUTE: "/createinstitutes",
  },

  // Request headers (optional, can be expanded)
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
