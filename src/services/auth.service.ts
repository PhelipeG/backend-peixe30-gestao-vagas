import bcrypt from 'bcryptjs';

import { env } from '../config/env';
import { LoginRequest, LoginResponse } from '../types';
import { prisma } from '../utils/prisma';

export class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse | null> {
    if (
      data.email === env.DEFAULT_USER_EMAIL &&
      data.password === env.DEFAULT_USER_PASSWORD
    ) {
      let user = await prisma.user.findUnique({
        where: { email: env.DEFAULT_USER_EMAIL },
      });
      if (!user) {
        const hashedPassword = await bcrypt.hash(env.DEFAULT_USER_PASSWORD, 10);
        user = await prisma.user.create({
          data: {
            email: env.DEFAULT_USER_EMAIL,
            name: 'Administrador',
            password: hashedPassword,
          },
        });
      }
      return {
        token: '',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    }
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      return null;
    }

    return {
      token: '',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
  async createUser(email: string, password: string, name?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
  }
}
