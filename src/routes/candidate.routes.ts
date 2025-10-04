import { FastifyInstance } from "fastify";
import { CandidateController } from "../controllers/candidate.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const candidateController = new CandidateController();

export async function candidateRoutes(app: FastifyInstance) {
  app.addHook("onRequest", authMiddleware); // rotas protegidas(all)

  app.get(
    "/all",
    candidateController.getAllCandidates.bind(candidateController)
  );
  app.get('/jobs/:jobId/getMatchingCandidates', candidateController.getMatchingCandidates.bind(candidateController));
  app.post('/invitations', candidateController.inviteCandidate.bind(candidateController));
}
