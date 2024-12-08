const config = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://contactsbackemd.rahulluthra.in"
      : "http://localhost:5000",
};

export default config;
