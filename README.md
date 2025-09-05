# ABECMED API

API para gestão de clínicas médicas especializadas em medicina canábica, desenvolvida em TypeScript com NestJS, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Backend:** NestJS (Node.js + TypeScript)
- **Banco de dados:** PostgreSQL
- **ORM:** Prisma
- **Autenticação:** JWT
- **Documentação:** Swagger/OpenAPI
- **Filas:** Bull + Redis
- **Containerização:** Docker

## 📋 Funcionalidades

### 🏥 Gestão de Clínicas
- Cadastro e gerenciamento de empresas/clínicas
- Controle de usuários por empresa

### 👥 Gestão de Pessoas
- **Administradores:** Gestão completa da clínica
- **Médicos:** Profissionais com documentação específica (CRM, etc.)
- **Recepcionistas:** Controle de acesso e pacientes
- **Pacientes:** Histórico médico e prescrições

### 💊 Gestão de Produtos
- Cadastro de produtos canábicos
- Controle de estoque em tempo real
- Operações de débito/crédito de estoque
- Sistema de retorno automático de estoque
- Agrupamento por compostos (THC, CBD, etc.)

### 🔒 Segurança e Autenticação
- Sistema JWT com diferentes níveis de acesso
- Documentação Swagger protegida
- Validação de CPF
- Controle de permissões por tipo de usuário

### ⚡ Sistema de Filas
- Processamento assíncrono de operações de estoque
- Retorno automático de produtos
- Monitoramento via Bull Board

## 🏗️ Arquitetura

### Estrutura de Módulos
```
src/
├── administrators/     # Gestão de administradores
├── auth/              # Autenticação e autorização
├── city/              # Gestão de cidades
├── state/             # Gestão de estados
├── doctor/            # Gestão de médicos
├── patient/           # Gestão de pacientes
├── reception/         # Gestão de recepcionistas
├── productTemporary/  # Gestão de produtos e estoque
├── queues/           # Sistema de filas (Bull)
├── prisma/           # Configuração do banco
└── common/           # Utilitários e validadores
```

### Documentação Swagger Organizada
Cada módulo possui documentação separada e organizada:
- `dto/*-swagger.dto.ts` - DTOs específicos para documentação
- `decorators/*-swagger.decorator.ts` - Decorators personalizados
- Controllers limpos sem poluição de documentação inline

## 🛠️ Instalação e Configuração

### Requisitos
- Node.js 20+
- Docker e Docker Compose
- PostgreSQL
- Redis

### 1. Clone o repositório
```bash
git clone git@github.com:ABECMED/abecmed-api.git
cd abecmed-api
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.development .env
```

Ajuste as variáveis conforme necessário:
```env
DATABASE_URL=postgresql://abecmed_user:abecmed_password@localhost:5434/abecmed_db
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=seu_jwt_secret_aqui
```

### 3. Subir serviços com Docker
```bash
docker compose up -d
```

### 4. Instalar dependências
```bash
npm install
```

### 5. Configurar banco de dados
```bash
npx prisma generate
npx prisma migrate dev
```

### 6. Popular banco (opcional)
```bash
npm run seed
```

### 7. Executar aplicação
```bash
npm run start:dev
```

## 📚 Acesso aos Serviços

### 🌐 URLs Principais
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api-docs?jwt=SEU_TOKEN
- **Bull Board:** http://localhost:3000/admin/queues?jwt=SEU_TOKEN_ADMIN

### 🔐 Autenticação Swagger
A documentação Swagger é protegida e requer autenticação JWT:
1. Faça login via `/auth/login` para obter o token
2. Acesse: `http://localhost:3000/api-docs?jwt=SEU_TOKEN`

## 📖 Endpoints Principais

### 🔑 Autenticação
- `POST /auth/login` - Login e obtenção de token JWT

### 👥 Gestão de Pessoas
- `POST /administrators` - Cadastrar administrador
- `GET /administrators` - Listar administradores
- `POST /doctors` - Cadastrar médico
- `GET /doctors` - Listar médicos
- `POST /patients` - Cadastrar paciente
- `GET /patients` - Listar pacientes
- `POST /reception` - Cadastrar recepcionista
- `GET /reception` - Listar recepcionistas

### 🏢 Localização
- `GET /state` - Listar estados
- `GET /city/search?stateId=1` - Listar cidades por estado

### 💊 Produtos e Estoque
- `GET /products` - Listar todos os produtos
- `GET /products/flowers` - Produtos agrupados por composto
- `POST /products/new` - Cadastrar produto
- `POST /products/check-stock` - Verificar disponibilidade
- `PATCH /products/add-stock` - Adicionar estoque
- `PATCH /products/remove-stock` - Remover estoque
- `PATCH /products/debit-stock` - Debitar estoque em lote
- `POST /products/return-stock` - Agendar retorno de estoque

## 🔄 Sistema de Filas

### Funcionalidades
- **Retorno de Estoque:** Automaticamente retorna produtos ao estoque após período determinado
- **Processamento Assíncrono:** Operações de estoque são processadas em background
- **Monitoramento:** Interface Bull Board para acompanhar jobs

### Configuração
O sistema utiliza Redis para gerenciar filas Bull. Certifique-se de que o Redis esteja rodando:
```bash
docker compose up redis -d
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm install
npm run build
npm run start:prod
```

### Docker
```bash
docker compose up --build
```

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 🔧 Padrões de Desenvolvimento

### Documentação Swagger
- DTOs separados para documentação (`*-swagger.dto.ts`)
- Decorators personalizados (`*-swagger.decorator.ts`)
- Controllers limpos sem poluição visual

### Estrutura de Módulos
- Service para lógica de negócio
- Controller para rotas e validação
- DTOs para validação de entrada
- Documentação separada para Swagger

## ⚠️ Observações Importantes

- **Redis obrigatório** para funcionamento das filas
- **Reiniciar servidor** ao adicionar novas filas Bull
- **Autenticação JWT** necessária para Swagger e Bull Board
- **Validação de CPF** implementada em todos os cadastros
- **Controle de empresa** - usuários só veem dados da própria empresa

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato com a equipe de desenvolvimento ABECMED.

### 👨‍💻 Desenvolvedor Principal

**Cristiano Morelato**  
- 💼 LinkedIn: [https://www.linkedin.com/in/cristiano-morelato/](https://www.linkedin.com/in/cristiano-morelato/)
- 📧 E-mail: cristianomorelato01@gmail.com

---

**ABECMED** - Medicina Canábica Especializada
