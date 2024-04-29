import request from "supertest";
import { app } from "@/infra/app";

describe("Create Plantation (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const responseToken = await request(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const accessToken = responseToken.body.access_token;

    const response = await request(app.server)
      .post("/plantations")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        title: "Soja",
      });

    expect(response.status).toEqual(201);
  });
});
