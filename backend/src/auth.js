import dotenv from "dotenv";
import expressOpenIdConnect from "express-openid-connect";

dotenv.config({ path: ["backend/.env", ".env"], quiet: true });

const { auth, requiresAuth } = expressOpenIdConnect;

const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
};

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  errorOnRequiredAuth: true,
  secret: requiredEnv("AUTH0_SECRET"),
  baseURL: requiredEnv("AUTH0_BASE_URL"),
  clientID: requiredEnv("AUTH0_CLIENT_ID"),
  issuerBaseURL: requiredEnv("AUTH0_ISSUER_BASE_URL"),
};
export const authMiddleware = auth(config);
export { requiresAuth };
