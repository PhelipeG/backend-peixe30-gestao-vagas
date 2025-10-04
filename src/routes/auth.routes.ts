import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", authController.login.bind(authController));
  app.get("/me", {
    onRequest: [authMiddleware],
    handler: authController.me.bind(authController),
  });
}
