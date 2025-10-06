import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { CandidateService } from '../services/candidate.service';

const candidateService = new CandidateService();

const jobIdSchema = z.object({
  jobId: z.string().length(24, 'ID de vaga inválido'),
});

const inviteSchema = z.object({
  jobId: z.string().length(24, 'ID de vaga inválido'),
  candidateId: z.string().length(24, 'ID de candidato inválido'),
});

export class CandidateController {
  async getMatchingCandidates(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = jobIdSchema.parse(request.params);
      const candidates = await candidateService.getMatchingCandidates(
        params.jobId
      );
      return reply.status(200).send(candidates);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }
      console.error('Erro ao buscar candidatos compatíveis:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao buscar candidatos compatíveis',
      });
    }
  }
  async inviteCandidate(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = inviteSchema.parse(request.body);
      const invitation = await candidateService.inviteCandidate(body.jobId, body.candidateId);

      return reply.status(201).send({
        success: true,
        message: 'Candidato convidado com sucesso',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }

      if (error instanceof Error) {
        if (error.message === 'Job not found') {
          return reply.status(404).send({
            error: 'Nao encontrado',
            message: 'Vaga nao encontrada no sistema !',
          });
        }

        if (error.message === 'Candidate not found') {
          return reply.status(404).send({
            error: 'Nao encontrado',
            message: 'Candidato nao encontrado no sistema !',
          });
        }

        if (error.message === 'Convite ja enviado para este candidato!') {
          return reply.status(409).send({
            error: 'Conflict',
            message: 'Candidato ja convidado para esta vaga !',
            alreadyInvited: true,
          });
        }
      }

      console.error('Erro ao convidar candidato:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao convidar o candidato',
      });
    }
  }
  async getAllCandidates(request: FastifyRequest, reply: FastifyReply) {
    try {
      const candidates = await candidateService.getAllCandidates();
      return reply.status(200).send(candidates);
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao buscar candidatos',
      });
    }
  }
}
