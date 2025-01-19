export const BASE_URL = `${process.env.BASE_URL}/api`; // Construct BASE_URL dynamically
export const API_KEY = process.env.PAYLOAD_SECRET || ''; // Default to empty string if not set
export const BASE_DB = process.env.DATABASE_URI || "";

if (!API_KEY) {
  console.error('⚠️  API_KEY (PAYLOAD_SECRET) is missing. Ensure it is set in your .env file.');
}