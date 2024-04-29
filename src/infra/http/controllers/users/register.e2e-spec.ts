import request from "supertest";
import { app } from "@/infra/app";

describe("Register (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe2@example.com",
      password: "123456",
    });

    expect(response.status).toEqual(201);
  });
});
