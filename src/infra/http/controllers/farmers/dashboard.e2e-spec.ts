import request from "supertest";
import { app } from "@/infra/app";
import { FarmerFactory } from "test/factories/make-farmer";

describe("Get Dashboard (e2e)", () => {
  let farmerFactory: FarmerFactory;

  beforeAll(async () => {
    await app.ready();
    farmerFactory = new FarmerFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get dashboard", async () => {
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

    await farmerFactory.makePrismaFarmer();
    await farmerFactory.makePrismaFarmer();
    await farmerFactory.makePrismaFarmer();

    const response = await request(app.server)
      .get(`/dashboard`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      dashboard: expect.objectContaining({ farmers: expect.any(Number) }),
    });
  });
});
