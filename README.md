# Peixe 30 - Backend

Backend da aplicação de gerenciamento de vagas e candidatos.

## ⚠️ **Importante - Limitações do Deploy Gratuito**

Este backend está hospedado no **Render (Plano Gratuito)** com as seguintes limitações:

- ⏰ **Sleep após 15 minutos** de inatividade
- 🐌 **Cold start:** ~30-60 segundos para "acordar" após período inativo
- 💤 **Automatic sleep:** Não há como desativar no plano gratuito

**Primeira requisição pode demorar até 1 minuto para responder** se o serviço estiver "dormindo".

## 🌐 URLs de Produção

- **API Backend:** https://backend-peixe30-gestao-vagas.onrender.com
- **Documentação Swagger:** https://backend-peixe30-gestao-vagas.onrender.com/docs
- **Health Check:** https://backend-peixe30-gestao-vagas.onrender.com/health

## ⏱️ Tempo de Desenvolvimento

**Total do Backend:** 17 horas
- Estrutura inicial e configuração: 2 horas
- Implementação das APIs (CRUD, Auth): 5 horas
- Sistema de match e score: 4 horas
- Validações, middleware e rate limiting: 2 horas
- Documentação e deploy: 4 horas

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

### 1. Clone o repositório

```bash
# HTTPS
git clone https://github.com/PhelipeG/backend-peixe30-gestao-vagas.git

# Entre na pasta do projeto
cd backend-peixe30-gestao-vagas
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo (se existir)
cp .env.example .env

# Ou crie o arquivo .env manualmente
touch .env
```

### 4. Edite o arquivo `.env` com suas configurações
```env
DATABASE_URL="mongodb+srv://seu-usuario:sua-senha@cluster.mongodb.net/peixe30?retryWrites=true&w=majority"
PORT=3333
NODE_ENV=development
JWT_SECRET=sua-chave-secreta-super-segura
DEFAULT_USER_EMAIL=admin@peixe30.com
DEFAULT_USER_PASSWORD=admin123
```

### 5. Configure o banco de dados e popule com dados iniciais

```bash
# Gerar o cliente Prisma
npm run prisma:generate

# Sincronizar o schema com o MongoDB
npm run prisma:push

# Popular banco com dados iniciais
npm run seed
```

## 🎯 Como Rodar o Projeto

### Desenvolvimento
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3333`

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

## 🗂️ Estrutura do Projeto Backend

```
backend/
├── prisma/
│   └── schema.prisma        # Schema do banco de dados
├── src/
│   ├── config/             # Configurações
│   │   ├── app.ts          # Configuração do Fastify
│   │   └── env.ts          # Validação de variáveis de ambiente
│   ├── controllers/        # Controladores das rotas
│   │   ├── auth.controller.ts
│   │   ├── candidate.controller.ts
│   │   └── job.controller.ts
│   ├── middleware/         # Middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── plugins/           # Plugins do Fastify
│   │   ├── index.ts       # Registro de plugins
│   │   └── rate-limit.ts  # Configuração de rate limiting
│   ├── routes/            # Definição de rotas
│   │   ├── index.ts       # Registro de rotas
│   │   ├── auth.routes.ts
│   │   ├── candidate.routes.ts
│   │   ├── health.routes.ts
│   │   └── job.routes.ts
│   ├── services/          # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── candidate.service.ts
│   │   └── job.service.ts
│   ├── types/            # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/            # Utilitários
│   │   ├── match-score.ts # Cálculo de compatibilidade
│   │   ├── prisma.ts     # Cliente Prisma
│   │   └── startup.ts    # Configuração de inicialização
│   ├── seeds/            # Seeds do banco
│   │   ├── candidates.seed.json
│   │   └── seed.ts
│   └── server.ts         # Entry point da aplicação
├── tests/                # Testes (se implementados)
├── .env                  # Variáveis de ambiente (local)
├── .gitignore           # Arquivos ignorados pelo Git
├── eslint.config.js     # Configuração do ESLint
├── package.json         # Dependências e scripts
├── tsconfig.json        # Configuração do TypeScript
└── README.md           # Este arquivo
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

# Verificar lint do código
npm run lint

# Corrigir problemas de lint automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format

# Verificar tipos TypeScript
npm run type-check
```

## 📦 Deploy

### Variáveis de Ambiente em Produção

Certifique-se de configurar todas as variáveis do `.env` na sua plataforma de deploy (Render, Railway, Heroku, etc.).

## 📝 Licença

Este projeto foi desenvolvido como teste técnico para a Peixe 30.