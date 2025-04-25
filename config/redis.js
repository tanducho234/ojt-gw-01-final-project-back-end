const Redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

// Get Redis URL from environment variables
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.error("REDIS_URL is not defined in environment variables");
  process.exit(1);
}

const redisClient = Redis.createClient({
  url: redisUrl,
  // Add TLS configuration for production
  ...(process.env.NODE_ENV === "production" && {
    socket: {
      tls: true,
      rejectUnauthorized: false,
    },
  }),
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
  // Don't exit in production, just log the error
  if (process.env.NODE_ENV !== "production") {
    process.exit(1);
  }
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
  if (process.env.NODE_ENV === "production") {
    console.log("Using production Redis instance");
  } else {
    console.log("Using local Redis instance");
  }
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
})();

module.exports = redisClient;
