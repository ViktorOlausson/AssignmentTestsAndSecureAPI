import dotenv from "dotenv";
import expressOpenIdConnect from "express-openid-connect";

dotenv.config({ path: ["backend/.env", ".env"], quiet: true });

const { auth, requiresAuth } = expressOpenIdConnect;

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not set`);
  }

  return value;
};

const clientSecret = process.env.AUTH0_CLIENT_SECRET;

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  errorOnRequiredAuth: true,
  secret: requiredEnv("AUTH0_SECRET"),
  baseURL: requiredEnv("AUTH0_BASE_URL"),
  clientID: requiredEnv("AUTH0_CLIENT_ID"),
  issuerBaseURL: requiredEnv("AUTH0_ISSUER_BASE_URL"),
  ...(clientSecret
    ? {
        clientSecret,
        authorizationParams: {
          response_type: "code",
          response_mode: "query",
          scope: "openid profile email",
        },
      }
    : {}),
};
export const authMiddleware = auth(config);
export { requiresAuth };
