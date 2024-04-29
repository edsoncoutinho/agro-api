import request from "supertest";
import { app } from "@/infra/app";
import { FarmerFactory } from "test/factories/make-farmer";

describe("Get Farmer (e2e)", () => {
  let farmerFactory: FarmerFactory;
  beforeAll(async () => {
    await app.ready();
    farmerFactory = new FarmerFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get", async () => {
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

    const farmer = await farmerFactory.makePrismaFarmer();

    const response = await request(app.server)
      .get(`/farmers/${farmer.id.toString()}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.status).toEqual(200);
  });
});
