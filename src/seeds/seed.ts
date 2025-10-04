import 'dotenv/config';
import candidatesData from './candidates.seed.json';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { prisma } from '../utils/prisma';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Limpar dados existentes
    console.log('🗑️  Cleaning existing data...');
    await prisma.invitation.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.job.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuário padrão
    console.log('👤 Creating default user...');
    const hashedPassword = await bcrypt.hash(env.DEFAULT_USER_PASSWORD, 10);
    await prisma.user.create({
      data: {
        email: env.DEFAULT_USER_EMAIL,
        password: hashedPassword,
        name: 'Administrador Sistema',
      },
    });
    console.log(`✅ User created: ${env.DEFAULT_USER_EMAIL}`);

    // Criar candidatos
    console.log('👥 Creating candidates...');
    for (const candidate of candidatesData) {
      await prisma.candidate.create({
        data: candidate,
      });
      console.log(`✅ Candidate created: ${candidate.name}`);
    }
    console.log('💼 Creating sample jobs...');
    const jobs = [
      {
        title: 'Desenvolvedor Full Stack',
        description: 'Buscamos desenvolvedor full stack com experiência em Node.js e React para trabalhar em projetos inovadores.',
        location: 'São Paulo - SP',
        salaryRange: 'R$ 8.000 - R$ 12.000',
        skills: ['Node.js', 'React', 'TypeScript', 'MongoDB'],
      },
      {
        title: 'DevOps Engineer',
        description: 'Profissional para gerenciar infraestrutura em cloud e implementar práticas de CI/CD.',
        location: 'Remote',
        salaryRange: 'R$ 10.000 - R$ 15.000',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
      },
      {
        title: 'QA Automation',
        description: 'Especialista em automação de testes para garantir a qualidade de nossas aplicações.',
        location: 'Rio de Janeiro - RJ',
        salaryRange: 'R$ 6.000 - R$ 9.000',
        skills: ['Cypress', 'Selenium', 'JavaScript', 'Jest'],
      },
    ];

    for (const job of jobs) {
      await prisma.job.create({
        data: job,
      });
      console.log(`✅ Job created: ${job.title}`);
    }

    console.log('✨ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();