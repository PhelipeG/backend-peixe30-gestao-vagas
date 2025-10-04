# Peixe 30 - Backend

Backend da aplicação de gerenciamento de vagas e candidatos.

## 🚀 Tecnologias

- **Node.js** com **TypeScript**
- **Fastify** - Framework web
- **Prisma** - ORM
- **MongoDB** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+ instalado
- MongoDB Atlas (ou MongoDB local)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório e entre na pasta do backend:
```bash
cd peixe30-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/peixe30?retryWrites=true&w=majority"
PORT=3333
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-super-segura
DEFAULT_USER_EMAIL=admin@peixe30.com
DEFAULT_USER_PASSWORD=admin123
```

5. Configure o banco de dados e popule com dados iniciais:
```bash
npm run setup
```

Este comando irá:
- Gerar o cliente Prisma
- Sincronizar o schema com o MongoDB
- Criar usuário padrão e dados de exemplo (candidatos e vagas)

## 🎯 Como executar

### Desenvolvimento
```bash
npm run dev
```

O servidor iniciará em `http://localhost:3333`

### Produção
```bash
npm run build
npm start
```

## 📚 Documentação da API

### Base URL
```
http://localhost:3333/api
```

### Autenticação

#### POST /api/auth/login
Realiza login e retorna token JWT.

**Body:**
```json
{
  "email": "admin@peixe30.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "admin@peixe30.com",
    "name": "Administrador"
  }
}
```

#### GET /api/auth/me
Retorna dados do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

---

### Vagas (Jobs)

Todas as rotas requerem autenticação (Bearer token).

#### POST /api/jobs
Cria uma nova vaga.

**Body:**
```json
{
  "title": "Desenvolvedor Full Stack",
  "description": "Descrição da vaga...",
  "location": "São Paulo - SP",
  "salaryRange": "R$ 8.000 - R$ 12.000",
  "skills": ["Node.js", "React", "TypeScript"]
}
```

#### GET /api/jobs
Lista todas as vagas com paginação.

**Query Params:**
- `page` (opcional, default: 1)
- `limit` (opcional, default: 10)

**Response:**
```json
{
  "data": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

#### GET /api/jobs/:id
Busca uma vaga específica.

#### PUT /api/jobs/:id
Atualiza uma vaga.

#### DELETE /api/jobs/:id
Deleta uma vaga.

---

### Candidatos (Candidates)

#### GET /api/candidates
Lista todos os candidatos.

#### GET /api/jobs/:jobId/candidates
Lista candidatos compatíveis com uma vaga, ordenados por score.

**Response:**
```json
[
  {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Milena Nogueira",
    "email": "milena.nogueira@email.com",
    "skills": ["ElasticSearch", "Cypress", "TypeScript"],
    "experienceYears": 3,
    "score": 85,
    "invited": false
  }
]
```

#### POST /api/invitations
Convida um candidato para uma vaga.

**Body:**
```json
{
  "jobId": "65f1a2b3c4d5e6f7g8h9i0j1",
  "candidateId": "65f1a2b3c4d5e6f7g8h9i0j2"
}
```

---

## 🧮 Cálculo do Match Score

O score de compatibilidade (0-100) é calculado assim:

- **70%** baseado nas skills:
  - Proporção de skills da vaga que o candidato possui
  
- **30%** baseado na experiência:
  - 0-2 anos: 30% dos pontos (9 pontos)
  - 3-5 anos: 60% dos pontos (18 pontos)
  - 6-10 anos: 80% dos pontos (24 pontos)
  - 10+ anos: 100% dos pontos (30 pontos)

**Exemplo:**
- Vaga exige: ["Node.js", "React", "TypeScript"]
- Candidato tem: ["Node.js", "React", "JavaScript"] + 5 anos exp
- Score de skills: 2/3 = 66.67% → 46.67 pontos
- Score de experiência: 18 pontos
- **Total: 65 pontos**

## 🗂️ Estrutura do Projeto

```
src/
├── config/          # Configurações (env)
├── controllers/     # Controladores das rotas
├── middleware/      # Middlewares (auth)
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
├── utils/           # Utilitários (prisma, match-score)
├── seeds/           # Seeds do banco
└── server.ts        # Entry point
```

## 🔐 Credenciais Padrão

**Email:** admin@peixe30.com  
**Senha:** admin123

## 🛠️ Scripts Úteis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start

# Gerar Prisma Client
npm run prisma:generate

# Sincronizar schema com DB
npm run prisma:push

# Abrir Prisma Studio
npm run prisma:studio

# Popular banco com dados
npm run seed

# Setup completo (gerar + push + seed)
npm run setup
```

## 📦 Deploy

### Variáveis de Ambiente em Produção

Certifique-se de configurar todas as variáveis do `.env` na sua plataforma de deploy (Render, Railway, Heroku, etc.).

### MongoDB Atlas

1. Crie um cluster no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configure o IP whitelist (libere `0.0.0.0/0` para testes)
3. Copie a connection string e adicione ao `DATABASE_URL`

## 📝 Licença

Este projeto foi desenvolvido como teste técnico para a Peixe 30.