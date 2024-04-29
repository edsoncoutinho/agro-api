import { type FastifyInstance } from "fastify";
import { verifyJWT } from "../../middleware/verify-jwt";
import { create } from "./create";

export async function plantationsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", verifyJWT);

  app.post("/plantations", create);
}
