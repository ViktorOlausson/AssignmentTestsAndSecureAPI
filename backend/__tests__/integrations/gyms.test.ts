import { describe, it, expect, beforeAll, beforeEach, afterAll } from "vitest";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { app } from "../../src/index.js";
import { prisma } from "../../src/prisma.js";

let server: http.Server;
let baseUrl: string;

function request(path: string, options: RequestInit = {}) {
  return fetch(`${baseUrl}${path}`, options);
}

describe("Gym API integration tests", () => {
  beforeAll(async () => {
    server = http.createServer(app);

    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  beforeEach(async () => {
    await prisma.review.deleteMany();
    await prisma.gym.deleteMany();

    await prisma.gym.createMany({
      data: [
        {
          name: "Iron House Gym",
          location: "Stockholm",
        },
        {
          name: "Nordic Fitness",
          location: "Göteborg",
        },
      ],
    });
  });

  afterAll(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    await prisma.$disconnect();
  });

  it("GET /gyms returns 200 and an array", async () => {
    const res = await request("/gyms");
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it("GET /gyms/:id returns one gym", async () => {
    const gymsRes = await request("/gyms");
    const gyms = await gymsRes.json();

    const res = await request(`/gyms/${gyms[0].id}`);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.name).toBe("Iron House Gym");
  });

  it("GET /gyms/:id returns 404 for unknown ID", async () => {
    const res = await request("/gyms/999999");

    expect(res.status).toBe(404);
  });

  it("POST /gyms without login returns 401", async () => {
    const res = await request("/gyms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test Gym",
        location: "Malmö",
      }),
    });

    expect(res.status).toBe(401);
  });

  it("POST /gyms/:id/reviews without login returns 401", async () => {
    const gymsRes = await request("/gyms");
    const gyms = await gymsRes.json();

    const res = await request(`/gyms/${gyms[0].id}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating: 5,
        comment: "Great gym",
      }),
    });

    expect(res.status).toBe(401);
  });
});
