import { FastifyReply, FastifyRequest } from 'fastify';
import z from 'zod';

import { JobService } from '../services/job.service';

const jobService = new JobService();

const createJobSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  salaryRange: z.string().min(1, 'Salary range is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

const updateJobSchema = createJobSchema.partial();

const listJobsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

const jobIdSchema = z.object({
  id: z.string().length(24, 'Id invalido!'),
});

export class JobController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createJobSchema.parse(request.body);
      const job = await jobService.create(body);
      return reply.status(201).send(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }
      console.error('Erro ao criar job:', error);
      return reply.status(500).send({
        error: 'Erro Interno',
        message: 'Erro ao criar job',
      });
    }
  }
  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const query = listJobsSchema.parse(request.query);
      const result = await jobService.findAll(query.page, query.limit);

      return reply.status(200).send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }

      console.error('List jobs error:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao listar os jobs',
      });
    }
  }
  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = jobIdSchema.parse(request.params);
      const job = await jobService.findById(params.id);

      if (!job) {
        return reply.status(404).send({
          error: 'Nao encontrado',
          message: 'Job nao encontrado no sistema !',
        });
      }

      return reply.status(200).send(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validaçao',
          message: error.message,
        });
      }

      console.error('Get job error:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao buscar o job',
      });
    }
  }
  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = jobIdSchema.parse(request.params);
      const body = updateJobSchema.parse(request.body);
      const job = await jobService.update(params.id, body);

      return reply.status(200).send(job);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }

      console.error('Update job error:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao atualizar o job',
      });
    }
  }
  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const params = jobIdSchema.parse(request.params);
      await jobService.delete(params.id);

      return reply.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          error: 'Erro de validação',
          message: error.message,
        });
      }

      console.error('Delete job error:', error);
      return reply.status(500).send({
        error: 'Erro interno',
        message: 'Ocorreu um erro ao deletar o job',
      });
    }
  }
}
