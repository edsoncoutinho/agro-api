import request from "supertest";
import { app } from "@/infra/app";
import { PlantationFactory } from "test/factories/make-plantations";

describe("Create Farmer (e2e)", () => {
  let plantationFactory: PlantationFactory;
  beforeAll(async () => {
    await app.ready();
    plantationFactory = new PlantationFactory();
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

    const plantation = await plantationFactory.makePrismaPlantation();

    const response = await request(app.server)
      .post("/farmers")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "John Doe",
        document: "12104418372",
        documentType: "CPF",
        farmName: "Doe Farm",
        state: "SP",
        city: "São Paulo",
        totalArea: 100,
        arableArea: 50,
        vegetationArea: 50,
        plantations: [
          {
            id: plantation.id.toString(),
            title: "Soja",
          },
        ],
      });

    expect(response.status).toEqual(201);
  });
});
