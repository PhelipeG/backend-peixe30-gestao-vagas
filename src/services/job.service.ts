import { Job } from "@prisma/client";
import {
  CreateJobRequest,
  PaginatedResponse,
  UpdateJobRequest,
} from "../types";
import { prisma } from "../utils/prisma";

export class JobService {
  async create(data: CreateJobRequest): Promise<Job> {
    return prisma.job.create({
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salaryRange: data.salaryRange,
        skills: data.skills,
      },
    });
  }
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Job>> {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.job.count(),
    ]);

    return {
      data: jobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async update(id: string, data: UpdateJobRequest): Promise<Job> {
    return prisma.job.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description && { description: data.description }),
        ...(data.location && { location: data.location }),
        ...(data.salaryRange && { salaryRange: data.salaryRange }),
        ...(data.skills && { skills: data.skills }),
      },
    });
  }
  async findById(id: string): Promise<Job | null> {
    return prisma.job.findUnique({
      where: { id },
    });
  }
  async delete(id: string): Promise<void> {
    await prisma.job.delete({
      where: { id },
    });
  }
  async getJobsCount(): Promise<number> {
    return prisma.job.count();
  }
}
