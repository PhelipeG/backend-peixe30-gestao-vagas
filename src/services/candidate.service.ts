import { CandidateWithScore } from "../types";
import { calculateMatchScore } from "../utils/match-score";
import { prisma } from "../utils/prisma";

export class CandidateService {
  async getMatchingCandidates(jobId: string): Promise<CandidateWithScore[]> {
    // Buscar a vaga
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new Error("Vaga nao encontrada!");
    }

    // Buscar todos os candidatos
    const candidates = await prisma.candidate.findMany();

    // Buscar convites já feitos para esta vaga
    const invitations = await prisma.invitation.findMany({
      where: { jobId },
      select: { candidateId: true },
    });
    if (!invitations) {
      throw new Error("Erro ao buscar convites!");
    }

    const invitedCandidateIds = new Set(invitations.map(inv => inv.candidateId));

    // Calcular score para cada candidato
    const candidatesWithScore: CandidateWithScore[] = candidates.map(candidate => ({
      id: candidate.id,
      name: candidate.name,
      email: candidate.email,
      skills: candidate.skills,
      experienceYears: candidate.experienceYears,
      score: calculateMatchScore(candidate.skills, job.skills, candidate.experienceYears),
      invited: invitedCandidateIds.has(candidate.id),
    }));

    // Ordenar por score (maior para menor)
    candidatesWithScore.sort((a, b) => b.score - a.score);

    return candidatesWithScore;
  }
  async inviteCandidate(jobId: string, candidateId: string): Promise<void> {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      throw new Error("Vaga nao encontrada!");
    }
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });
    if (!candidate) {
      throw new Error("Candidato nao encontrado!");
    }
    // Verifica se o convite ja existe
    const existingInvitation = await prisma.invitation.findUnique({
      where: {
        jobId_candidateId: { jobId, candidateId },
      },
    });
    if (existingInvitation) {
      throw new Error("Convite ja enviado para este candidato!");
    }
    await prisma.invitation.create({
      data: {
        jobId,
        candidateId,
      },
    });
  }
  async getCandidatesCount(): Promise<number> {
    return prisma.candidate.count();
  }
  async getAllCandidates() {
    return prisma.candidate.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}
