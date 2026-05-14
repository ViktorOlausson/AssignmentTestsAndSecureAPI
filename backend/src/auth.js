import { auth, requiresAuth } from "express-openid-connect";

export const authMiddleware = auth({
  authRequired: false,
  errorOnRequiredAuth: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

export { requiresAuth };
