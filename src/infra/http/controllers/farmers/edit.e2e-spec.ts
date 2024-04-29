import request from "supertest";
import { app } from "@/infra/app";
import { prisma } from "@/lib/prisma";
import { FarmerFactory } from "test/factories/make-farmer";
import { PlantationFactory } from "test/factories/make-plantations";

describe("Edit Farmer (e2e)", () => {
  let farmerFactory: FarmerFactory;
  let plantationFactory: PlantationFactory;
  beforeAll(async () => {
    await app.ready();
    farmerFactory = new FarmerFactory();
    plantationFactory = new PlantationFactory();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to edit", async () => {
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

    const plantation = await plantationFactory.makePrismaPlantation({
      title: "Soja",
    });

    const response = await request(app.server)
      .put(`/farmers/${farmer.id}`)
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

    const farmerOnDatabase = await prisma.farmer.findFirst({
      where: {
        document: "12104418372",
      },
    });

    expect(response.status).toEqual(200);
    expect(farmerOnDatabase).toBeTruthy();
  });
});
