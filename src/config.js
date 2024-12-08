const config = {
  API_BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://your-production-url.com"
      : "http://localhost:5000",
};

export default config;
