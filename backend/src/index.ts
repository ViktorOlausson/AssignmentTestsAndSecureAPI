import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { prisma } from "./prisma.js";
import { authMiddleware, requiresAuth } from "./auth.js";

dotenv.config({ path: ["backend/.env", ".env"], quiet: true });

export const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(authMiddleware);

app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.get("/gyms", async (req, res) => {
  const gyms = await prisma.gym.findMany({
    include: {
      reviews: true,
    },
  });

  res.status(200).json(gyms);
});

app.get("/gyms/:id", async (req, res) => {
  const id = Number(req.params.id);

  const gym = await prisma.gym.findUnique({
    where: { id },
    include: {
      reviews: true,
    },
  });

  if (!gym) {
    return res.status(404).json({ error: "Gym not found" });
  }

  res.status(200).json(gym);
});

app.post("/gyms", requiresAuth(), async (req, res) => {
  const { name, location } = req.body;

  if (!name || !location) {
    return res.status(400).json({
      error: "Name and location are required",
    });
  }

  const gym = await prisma.gym.create({
    data: {
      name,
      location,
    },
  });

  res.status(201).json(gym);
});

app.post("/gyms/:id/reviews", requiresAuth(), async (req, res) => {
  const gymId = Number(req.params.id);
  const { rating, comment } = req.body;

  const gym = await prisma.gym.findUnique({
    where: { id: gymId },
  });

  if (!gym) {
    return res.status(404).json({ error: "Gym not found" });
  }

  if (!rating || !comment) {
    return res.status(400).json({
      error: "Rating and comment are required",
    });
  }

  const review = await prisma.review.create({
    data: {
      rating: Number(rating),
      comment,
      gymId,
    },
  });

  res.status(201).json(review);
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.status(200).json({
    user: req.oidc.user,
  });
});
