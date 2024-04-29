import { type FastifyInstance } from "fastify";
import { verifyJWT } from "../../middleware/verify-jwt";
import { create } from "./create";
import { deleteFarmer } from "./delete";
import { edit } from "./edit";
import { get } from "./get";
import { dashboard } from "./dashboard";

export async function farmersRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/farmers", create);
  app.delete("/farmers/:farmerId", deleteFarmer);
  app.put("/farmers/:farmerId", edit);
  app.get("/farmers/:farmerId", get);

  app.get("/dashboard", dashboard);
}
