/* O projeto que acompanha a trilha: uma parte por fase do mapa. */
const PROJETO = {
  title: "Plataforma de gestão de tarefas com IA",
  intro:
    "Em vez de cinco projetos pequenos e descartáveis, você constrói um projeto só, que evolui junto com o seu conhecimento. Uma API e uma aplicação para criar projetos, gerenciar tarefas, controlar usuários e, no fim, usar IA para resumir atividades e sugerir prioridades. Cada fase da trilha acrescenta uma parte; no fim, o repositório conta a história inteira: código, decisões registradas, diagramas, testes e números medidos.",
  stack: [
    "TypeScript (modo estrito)",
    "Node.js LTS (24 ou 26)",
    "NestJS 12",
    "PostgreSQL + Prisma 7",
    "Redis + BullMQ",
    "Vitest, Supertest e Testcontainers",
    "Docker e Docker Compose",
    "GitHub Actions",
    "OpenTelemetry + Grafana",
    "API da Anthropic (Claude)",
  ],
  regra:
    "Não comece com microsserviços. Primeiro construa um monolito modular bem estruturado. Depois, documente quais problemas reais justificariam separar algum módulo num serviço independente.",
  evolucao: [
    { t: "Versão inicial", d: "Cadastro, login, CRUD de projetos e tarefas, validação e banco de dados.", fases: ["p-fund", "p-ling", "p-sql", "p-git", "p-web", "p-mvc", "p-docker"] },
    { t: "Código sustentável", d: "Separação por módulos, testes, tratamento consistente de erros e regras de negócio no domínio.", fases: ["p-nosql", "p-qual", "p-testes", "p-patterns", "p-refac"] },
    { t: "Escalabilidade", d: "Cache e filas de processamento quando houver uma necessidade concreta, medida.", fases: ["p-perf", "p-nfr", "p-consist"] },
    { t: "Operação", d: "Docker, integração contínua, logs, métricas, tracing e implantação.", fases: ["p-cloud", "p-disp"] },
    { t: "Arquitetura explícita", d: "ADRs, C4, DDD e monolito modular com fronteiras verificadas no CI.", fases: ["p-arq", "p-ddd", "p-estilos"] },
    { t: "Segurança", d: "Autorização por papel, proteção de credenciais, validação de entradas e limites de requisições.", fases: ["p-seg", "p-final"] },
    { t: "IA", d: "Resumos e sugestões, com controle de custos, limites de uso, avaliação de resultados e proteção de dados.", fases: ["p-extra"] },
  ],
  partes: [
    /* ===================== Largada → Programador Júnior ===================== */
    {
      fase: "p-fund",
      t: "Preparar a máquina",
      objetivo: "Montar o ambiente de trabalho que você vai usar até o fim: Linux (via WSL2 no Windows), Node.js, Git, editor e terminal. E entender o que acontece quando um programa roda.",
      entregas: [
        "WSL2 com Ubuntu instalado e o terminal do Ubuntu como padrão no VS Code",
        "Node.js LTS instalado com um gerenciador de versões (fnm ou nvm)",
        "Git configurado com seu nome, e-mail e chave SSH no GitHub",
        "Pasta <code>~/projetos/tarefas</code> criada dentro do Linux (não em /mnt/c)",
        "Primeiro arquivo <code>ola.ts</code> rodando com <code>node ola.ts</code>",
      ],
      passos: [
        {
          t: "Instale o WSL2 e trabalhe dentro do Linux",
          d: `<p>No PowerShell como administrador, rode <code>wsl --install</code> e reinicie. Abra o Ubuntu, crie seu usuário e, a partir daqui, tudo acontece no terminal do Linux. Guarde os projetos dentro do sistema de arquivos do Linux (<code>~/projetos</code>), não em <code>/mnt/c</code>: o acesso ao disco do Windows pelo WSL é bem mais lento, e ferramentas como o Docker e o recarregamento automático sofrem com isso.</p>
<p>No VS Code, instale a extensão <strong>WSL</strong> e abra a pasta com <code>code .</code> de dentro do Ubuntu.</p>`,
        },
        {
          t: "Node.js com gerenciador de versões",
          d: `<p>Não instale o Node "solto": use o <strong>fnm</strong> (ou nvm) para trocar de versão por projeto. Fixe a versão num arquivo <code>.node-version</code>, para que qualquer pessoa (e o CI) use a mesma.</p>`,
          code: `curl -fsSL https://fnm.vercel.app/install | bash
fnm install --lts
fnm use --lts
node --version        # v24.x ou v26.x
git config --global user.name "Seu Nome"
git config --global user.email "voce@exemplo.com"
ssh-keygen -t ed25519 -C "voce@exemplo.com"   # depois cole a chave pública no GitHub`,
        },
        {
          t: "O primeiro programa e o processo por trás dele",
          d: `<p>Crie <code>~/projetos/tarefas/ola.ts</code> com uma função tipada e rode com <code>node ola.ts</code>: o Node atual remove os tipos e executa. Em outro terminal, observe o processo com <code>ps</code> e <code>top</code>: memória residente, número de threads. Anote o que viu num arquivo <code>NOTAS.md</code>; ele vai crescer ao longo da trilha.</p>`,
        },
      ],
      pronto: "Você abre o VS Code dentro do Ubuntu, roda <code>node ola.ts</code>, faz um <code>git commit</code> e consegue explicar, com suas palavras, o que são processo, memória e thread.",
    },
    {
      fase: "p-ling",
      t: "O domínio em TypeScript puro",
      objetivo: "Modelar o coração do sistema (usuários, projetos e tarefas) só com TypeScript, sem framework e sem banco. Regras de negócio protegidas por tipos e testes. Este código vai ser movido para dentro da API mais tarde sem mudar uma linha.",
      entregas: [
        "Projeto Node com <code>\"type\": \"module\"</code>, TypeScript estrito e Vitest",
        "Tipos com marca para os IDs (<code>UserId</code>, <code>ProjectId</code>, <code>TarefaId</code>)",
        "Classe <code>Tarefa</code> com status como união (<code>aberta</code>, <code>em_andamento</code>, <code>concluida</code>) e transições validadas",
        "Value Object <code>Prazo</code> e regra <code>estaAtrasada(agora)</code>",
        "Pelo menos 15 testes de domínio passando",
      ],
      passos: [
        {
          t: "Crie o projeto",
          code: `cd ~/projetos/tarefas
npm init -y
npm pkg set type=module
npm i -D typescript vitest @types/node
npx tsc --init --strict --module nodenext --target es2024 --noEmit
mkdir -p src/dominio && git init`,
        },
        {
          t: "Modele a tarefa e suas regras",
          d: `<p>Comece pelas regras, não pelos campos: uma tarefa nasce <em>aberta</em>; só vai para <em>em andamento</em> com um responsável; só é concluída se não estiver concluída; ao concluir, guarda a data. O tempo entra como parâmetro (<code>agora</code>), nunca com <code>new Date()</code> lá dentro: isso deixa as regras testáveis.</p>`,
          code: `// src/dominio/tarefa.ts
export type TarefaId = string & { readonly __marca: "TarefaId" };
export type UserId = string & { readonly __marca: "UserId" };
export type Status = "aberta" | "em_andamento" | "concluida";
export type Prioridade = "baixa" | "media" | "alta";

export class RegraViolada extends Error {
  constructor(readonly codigo: string, mensagem: string) { super(mensagem); }
}

export class Tarefa {
  private constructor(
    readonly id: TarefaId,
    private _titulo: string,
    private _status: Status,
    private _responsavelId: UserId | null,
    private _prazo: Date | null,
    private _concluidaEm: Date | null,
    readonly prioridade: Prioridade,
  ) {}

  static criar(id: TarefaId, titulo: string, prioridade: Prioridade = "media", prazo: Date | null = null) {
    const t = titulo.trim();
    if (t.length < 3 || t.length > 120) throw new RegraViolada("titulo-invalido", "Título deve ter de 3 a 120 caracteres");
    return new Tarefa(id, t, "aberta", null, prazo, null, prioridade);
  }

  iniciar(responsavelId: UserId): void {
    if (this._status !== "aberta") throw new RegraViolada("transicao-invalida", "Só tarefas abertas podem ser iniciadas");
    this._responsavelId = responsavelId;
    this._status = "em_andamento";
  }

  concluir(agora: Date): void {
    if (this._status === "concluida") throw new RegraViolada("ja-concluida", "Tarefa já concluída");
    this._status = "concluida";
    this._concluidaEm = agora;
  }

  estaAtrasada(agora: Date): boolean {
    return this._status !== "concluida" && this._prazo !== null && this._prazo < agora;
  }

  get status() { return this._status; }
  get titulo() { return this._titulo; }
}`,
        },
        {
          t: "Teste cada regra",
          d: `<p>Um arquivo <code>tarefa.test.ts</code> ao lado, um teste por regra, incluindo os caminhos de erro. Rode com <code>npx vitest</code> e deixe aberto: ele roda de novo a cada mudança. Faça o mesmo para <code>Projeto</code> (nome, dono, lista de membros com papel <code>dono</code>, <code>editor</code> ou <code>leitor</code>).</p>`,
          code: `// src/dominio/tarefa.test.ts
import { describe, expect, it } from "vitest";
import { Tarefa, type TarefaId, type UserId } from "./tarefa.js";

const id = "t1" as TarefaId;
const ana = "u-ana" as UserId;

describe("Tarefa", () => {
  it("nasce aberta", () => {
    expect(Tarefa.criar(id, "Revisar PR").status).toBe("aberta");
  });

  it("não aceita título curto", () => {
    expect(() => Tarefa.criar(id, "ok")).toThrow(/3 a 120/);
  });

  it("não pode ser iniciada duas vezes", () => {
    const t = Tarefa.criar(id, "Revisar PR");
    t.iniciar(ana);
    expect(() => t.iniciar(ana)).toThrow(/abertas/);
  });

  it("fica atrasada depois do prazo, até ser concluída", () => {
    const t = Tarefa.criar(id, "Entregar relatório", "alta", new Date("2026-10-20"));
    const agora = new Date("2026-10-22");
    expect(t.estaAtrasada(agora)).toBe(true);
    t.concluir(agora);
    expect(t.estaAtrasada(agora)).toBe(false);
  });
});`,
        },
      ],
      pronto: "<code>npx vitest run</code> passa, <code>npx tsc</code> não reclama de nada, e não existe nenhum <code>any</code> nem import de biblioteca externa em <code>src/dominio</code>.",
    },
    {
      fase: "p-sql",
      t: "O modelo de dados no PostgreSQL",
      objetivo: "Desenhar as tabelas à mão, em SQL, antes de qualquer ORM. Você vai entender o que o Prisma gera depois e por quê.",
      entregas: [
        "PostgreSQL rodando (Docker ou instalação local)",
        "<code>db/schema.sql</code> com usuários, projetos, membros e tarefas, com chaves, constraints e índices",
        "<code>db/consultas.sql</code> com 8 consultas que a aplicação vai precisar",
        "Plano de execução (<code>EXPLAIN ANALYZE</code>) da listagem de tarefas com 100 mil linhas",
      ],
      passos: [
        {
          t: "Suba um PostgreSQL",
          d: `<p>O Docker é aprofundado na última fase desta etapa; por ora, um comando basta (instale o Docker Desktop com integração ao WSL). Conecte com <code>psql</code> ou com um cliente gráfico como DBeaver.</p>`,
          code: `docker run -d --name pg-tarefas -p 5432:5432 \\
  -e POSTGRES_USER=tarefas -e POSTGRES_PASSWORD=tarefas -e POSTGRES_DB=tarefas \\
  postgres:17-alpine
psql postgresql://tarefas:tarefas@localhost:5432/tarefas`,
        },
        {
          t: "Escreva o schema com as regras no banco",
          d: `<p>O banco é a última linha de defesa: o que não pode acontecer nunca (tarefa sem projeto, papel inválido, membro duplicado) vira constraint. A coluna <code>version</code> prepara o locking otimista que você vai usar na fase de performance.</p>`,
          code: `-- db/schema.sql
CREATE TABLE usuarios (
  id          uuid PRIMARY KEY,
  email       text NOT NULL UNIQUE,
  nome        text NOT NULL,
  hash_senha  text NOT NULL,
  criado_em   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE projetos (
  id          uuid PRIMARY KEY,
  nome        text NOT NULL CHECK (length(nome) BETWEEN 3 AND 80),
  arquivado   boolean NOT NULL DEFAULT false,
  criado_em   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE membros (
  projeto_id  uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  usuario_id  uuid NOT NULL REFERENCES usuarios(id),
  papel       text NOT NULL CHECK (papel IN ('dono', 'editor', 'leitor')),
  PRIMARY KEY (projeto_id, usuario_id)
);

CREATE TABLE tarefas (
  id              uuid PRIMARY KEY,
  projeto_id      uuid NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
  titulo          text NOT NULL CHECK (length(titulo) BETWEEN 3 AND 120),
  status          text NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_andamento', 'concluida')),
  prioridade      text NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta')),
  responsavel_id  uuid REFERENCES usuarios(id),
  prazo           timestamptz,
  concluida_em    timestamptz,
  version         integer NOT NULL DEFAULT 0,
  criada_em       timestamptz NOT NULL DEFAULT now(),
  CHECK (status <> 'em_andamento' OR responsavel_id IS NOT NULL)
);

-- A consulta mais frequente: tarefas pendentes de um projeto, por prazo
CREATE INDEX idx_tarefas_projeto_pendentes ON tarefas (projeto_id, prazo) WHERE status <> 'concluida';`,
        },
        {
          t: "Escreva as consultas que a tela vai precisar",
          d: `<p>Antes da API, pense nas telas: lista de projetos do usuário com contagem de tarefas abertas; tarefas de um projeto filtradas por status; tarefas atrasadas; tarefas de uma pessoa; painel com contagem por status. Gere 100 mil tarefas com <code>generate_series</code> e confira com <code>EXPLAIN ANALYZE</code> se o índice está sendo usado.</p>`,
        },
      ],
      pronto: "O schema roda do zero sem erro, as 8 consultas retornam o que deveriam, e você consegue explicar o plano de execução da listagem de tarefas.",
    },
    {
      fase: "p-git",
      t: "Repositório profissional",
      objetivo: "Transformar a pasta num repositório que qualquer pessoa clona, entende e roda. Daqui para frente, toda mudança entra por pull request.",
      entregas: [
        "Repositório público no GitHub com README (o que é, como rodar, como testar)",
        "<code>.gitignore</code> com <code>node_modules</code>, <code>dist</code> e <code>.env</code>; <code>package-lock.json</code> commitado",
        "Scripts <code>npm test</code>, <code>npm run typecheck</code>, <code>npm run lint</code>",
        "Branch <code>main</code> protegida: só entra por pull request",
        "Dependabot configurado e commits seguindo Conventional Commits",
        "<code>docs/decisoes.md</code> com as primeiras decisões e o porquê de cada uma",
      ],
      passos: [
        {
          t: "Publique e proteja a main",
          d: `<p>Crie o repositório no GitHub, adicione o remoto e faça o primeiro push. Em <em>Settings → Branches</em>, crie uma regra para <code>main</code> exigindo pull request. Mesmo sozinho, trabalhe assim: uma branch curta por mudança (<code>feat/tarefa-prazo</code>), PR com descrição, merge. É o hábito que os times esperam de você.</p>`,
        },
        {
          t: "Scripts e dependências",
          code: `{
  "scripts": {
    "test": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "oxlint ."
  }
}

# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule: { interval: weekly }`,
        },
        {
          t: "Comece o registro de decisões",
          d: `<p>Crie <code>docs/decisoes.md</code> e anote, com data, cada escolha que você fez e o porquê: "TypeScript estrito", "Vitest", "PostgreSQL". Na etapa de Arquiteto, cada item vira um ADR formal. Quem só escreve o código perde o porquê em poucas semanas.</p>`,
        },
      ],
      pronto: "Alguém que nunca viu o projeto clona, roda <code>npm ci && npm test</code> seguindo o README e tudo passa. O histórico tem commits pequenos com mensagens que explicam o porquê.",
    },
    {
      fase: "p-web",
      t: "O contrato da API",
      objetivo: "Desenhar a API antes de implementá-la: recursos, verbos, códigos de status, formato de erro e estratégia de autenticação. E sentir o HTTP cru, sem framework.",
      entregas: [
        "<code>docs/openapi.yaml</code> com os endpoints de autenticação, projetos e tarefas",
        "Formato de erro padronizado (Problem Details, RFC 9457) documentado",
        "Decisão de autenticação registrada: access token curto + refresh token em cookie <code>HttpOnly</code>",
        "Servidor mínimo com <code>node:http</code> respondendo <code>GET /health</code>, explorado com <code>curl -v</code>",
      ],
      passos: [
        {
          t: "Liste os recursos e os endpoints",
          d: `<p>Recursos são substantivos; ações de negócio viram sub-recursos.</p>
<ul>
<li><code>POST /auth/cadastro</code>, <code>POST /auth/login</code>, <code>POST /auth/refresh</code>, <code>POST /auth/logout</code>, <code>GET /me</code></li>
<li><code>POST /projetos</code>, <code>GET /projetos</code>, <code>GET /projetos/{id}</code>, <code>PATCH /projetos/{id}</code>, <code>POST /projetos/{id}/membros</code></li>
<li><code>POST /projetos/{id}/tarefas</code>, <code>GET /projetos/{id}/tarefas?status=&amp;cursor=</code></li>
<li><code>GET /tarefas/{id}</code>, <code>PATCH /tarefas/{id}</code>, <code>POST /tarefas/{id}/inicio</code>, <code>POST /tarefas/{id}/conclusao</code>, <code>DELETE /tarefas/{id}</code></li>
</ul>`,
          code: `# docs/openapi.yaml (trecho)
openapi: 3.1.0
info: { title: Tarefas API, version: 0.1.0 }
paths:
  /projetos/{projetoId}/tarefas:
    post:
      summary: Cria uma tarefa no projeto
      parameters:
        - { name: projetoId, in: path, required: true, schema: { type: string, format: uuid } }
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [titulo]
              properties:
                titulo: { type: string, minLength: 3, maxLength: 120 }
                prioridade: { type: string, enum: [baixa, media, alta] }
                prazo: { type: string, format: date-time }
      responses:
        "201": { description: Criada; header Location aponta para /tarefas/{id} }
        "400": { description: Entrada inválida (application/problem+json) }
        "404": { description: Projeto não existe ou você não é membro }`,
        },
        {
          t: "Decida a autenticação",
          d: `<p>Escreva em <code>docs/decisoes.md</code>: senha com hash Argon2; <em>access token</em> JWT de 15 minutos no header <code>Authorization</code>; <em>refresh token</em> aleatório, guardado (com hash) no banco e enviado em cookie <code>HttpOnly; Secure; SameSite=Lax</code>, trocado a cada uso (rotação). Anote o trade-off: JWT não é revogável antes de expirar, por isso dura pouco.</p>`,
        },
        {
          t: "Sinta o HTTP sem framework",
          d: `<p>Escreva um servidor de 15 linhas com <code>node:http</code> que responde <code>GET /health</code> com JSON e 404 para o resto. Chame com <code>curl -v</code> e leia cada linha: método, headers, status. Esse é o mesmo HTTP que o NestJS vai esconder de você na próxima fase.</p>`,
        },
      ],
      pronto: "O <code>openapi.yaml</code> abre sem erros no Swagger Editor, cada endpoint tem códigos de sucesso e de erro definidos, e a decisão de autenticação está escrita com prós e contras.",
    },
    {
      fase: "p-mvc",
      t: "A API com NestJS",
      objetivo: "Implementar a versão inicial: cadastro, login, CRUD de projetos e tarefas, validação, autorização por membro do projeto e banco de dados com Prisma. O domínio da fase 2 entra sem mudanças.",
      entregas: [
        "Projeto NestJS 12 (ESM, Vitest) com módulos <code>identidade</code>, <code>projetos</code> e <code>tarefas</code>",
        "Configuração validada com zod na inicialização",
        "Prisma 7 com PostgreSQL, migração inicial e <code>PrismaService</code> injetável",
        "Cadastro e login com Argon2 e JWT; rotas protegidas por padrão",
        "Validação de entrada com zod nas rotas e erros no formato Problem Details",
        "Checagem de acesso: ninguém lê ou altera projeto do qual não é membro (teste provando)",
        "Teste ponta a ponta: cadastro → login → criar projeto → criar tarefa → concluir",
      ],
      passos: [
        {
          t: "Crie o projeto e traga o domínio",
          d: `<p>Responda <strong>ESM</strong> ao <code>nest new</code> (vem com Vitest e oxlint) e, por enquanto, <strong>não</strong> ao SDK de observabilidade: você vai montar a sua com OpenTelemetry mais adiante. Copie <code>src/dominio</code> da fase 2 para <code>src/modules/tarefas/dominio</code> com os testes: eles devem passar sem nenhuma alteração. Isso prova que o domínio não depende de framework.</p>`,
          code: `npm i -g @nestjs/cli
nest new tarefas-api          # ESM · npm · NestJS Observe: não
cd tarefas-api
nest g module modules/identidade
nest g module modules/projetos
nest g module modules/tarefas
npm i @nestjs/config @nestjs/jwt zod argon2`,
        },
        {
          t: "Configure o Prisma 7",
          d: `<p>Fixe a versão 7 (a tag <code>latest</code> pode apontar para uma pré-versão da 8). O Prisma 7 exige um <em>driver adapter</em> e não lê o <code>.env</code> sozinho: a URL do banco fica no arquivo de configuração que o <code>prisma init</code> cria na raiz. Traduza o <code>schema.sql</code> da fase 3 para modelos e rode a migração.</p>`,
          code: `npm i -D prisma@7 dotenv
npm i @prisma/client@7 @prisma/adapter-pg pg
npx prisma init --datasource-provider postgresql --output ../src/generated/prisma
# edite prisma/schema.prisma com os modelos, depois:
npx prisma migrate dev --name inicial
npx prisma generate`,
        },
        {
          t: "Modelos do Prisma",
          code: `generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model Usuario {
  id        String   @id @default(uuid(7)) @db.Uuid
  email     String   @unique
  nome      String
  hashSenha String   @map("hash_senha")
  criadoEm  DateTime @default(now()) @map("criado_em")
  membros   Membro[]
  @@map("usuarios")
}

model Projeto {
  id        String   @id @default(uuid(7)) @db.Uuid
  nome      String
  arquivado Boolean  @default(false)
  criadoEm  DateTime @default(now()) @map("criado_em")
  membros   Membro[]
  tarefas   Tarefa[]
  @@map("projetos")
}

model Membro {
  projetoId String  @map("projeto_id") @db.Uuid
  usuarioId String  @map("usuario_id") @db.Uuid
  papel     String
  projeto   Projeto @relation(fields: [projetoId], references: [id], onDelete: Cascade)
  usuario   Usuario @relation(fields: [usuarioId], references: [id])
  @@id([projetoId, usuarioId])
  @@map("membros")
}

model Tarefa {
  id            String    @id @default(uuid(7)) @db.Uuid
  projetoId     String    @map("projeto_id") @db.Uuid
  titulo        String
  status        String    @default("aberta")
  prioridade    String    @default("media")
  responsavelId String?   @map("responsavel_id") @db.Uuid
  prazo         DateTime?
  concluidaEm   DateTime? @map("concluida_em")
  version       Int       @default(0)
  criadaEm      DateTime  @default(now()) @map("criada_em")
  projeto       Projeto   @relation(fields: [projetoId], references: [id], onDelete: Cascade)
  @@index([projetoId, prazo])
  @@map("tarefas")
}`,
        },
        {
          t: "PrismaService e configuração validada",
          code: `// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({ adapter: new PrismaPg({ connectionString: config.getOrThrow<string>("DATABASE_URL") }) });
  }
  onModuleInit() { return this.$connect(); }
  onModuleDestroy() { return this.$disconnect(); }
}

// src/main.ts
import { StandardSchemaValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

const app = await NestFactory.create(AppModule);
app.useGlobalPipes(new StandardSchemaValidationPipe());
app.enableShutdownHooks();
await app.listen(process.env.PORT ?? 3000);`,
        },
        {
          t: "Controller fino, validação na borda, acesso checado",
          d: `<p>O controller só traduz HTTP para o caso de uso. A checagem "você é membro deste projeto?" acontece antes de qualquer leitura: se não for, a resposta é 404 (não confirma que o projeto existe). Um guard global exige JWT em todas as rotas; as públicas (cadastro, login) são marcadas com um decorator <code>@Publico()</code>.</p>`,
          code: `// src/modules/tarefas/tarefas.controller.ts
const NovaTarefa = z.object({
  titulo: z.string().trim().min(3).max(120),
  prioridade: z.enum(["baixa", "media", "alta"]).default("media"),
  prazo: z.coerce.date().optional(),
});
type NovaTarefa = z.infer<typeof NovaTarefa>;

@Controller()
export class TarefasController {
  constructor(private readonly tarefas: TarefasService) {}

  @Post("projetos/:projetoId/tarefas")
  async criar(
    @Param("projetoId", { schema: z.uuid() }) projetoId: string,
    @Body({ schema: NovaTarefa }) dados: NovaTarefa,
    @UsuarioAtual() usuario: { id: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const tarefa = await this.tarefas.criar(usuario.id, projetoId, dados); // lança 404 se não for membro
    res.status(201).location("/tarefas/" + tarefa.id);
    return tarefa;
  }

  @Post("tarefas/:id/conclusao")
  @HttpCode(204)
  concluir(@Param("id", { schema: z.uuid() }) id: string, @UsuarioAtual() usuario: { id: string }) {
    return this.tarefas.concluir(usuario.id, id);
  }
}`,
        },
        {
          t: "O teste que prova o fluxo",
          d: `<p>Com Supertest, suba a aplicação inteira contra um banco de teste e percorra o fluxo principal. Inclua o teste de segurança mais importante desta fase: a usuária B tenta ler a tarefa da usuária A e recebe 404.</p>`,
        },
      ],
      pronto: "Pelo terminal (ou pelo Insomnia/Bruno), você se cadastra, faz login, cria um projeto, cria tarefas, conclui uma, e não consegue ver nada de outro usuário. Todos os testes passam.",
    },
    {
      fase: "p-docker",
      t: "Tudo sobe com um comando",
      objetivo: "Empacotar a API numa imagem enxuta e descrever o ambiente inteiro (API, banco, migrações) no Docker Compose. Fecha a versão inicial.",
      entregas: [
        "Dockerfile multi-stage rodando como usuário <code>node</code>, imagem abaixo de 250 MB",
        "<code>.dockerignore</code> (sem <code>node_modules</code>, <code>.env</code> e <code>.git</code>)",
        "<code>compose.yaml</code> com API, PostgreSQL com volume e healthcheck, e um serviço que aplica as migrações",
        "README atualizado: <code>docker compose up</code> e a API está no ar",
        "Tag <code>v0.1.0</code> no Git: a versão inicial",
      ],
      passos: [
        {
          t: "Dockerfile multi-stage",
          d: `<p>Use o Dockerfile do tópico "Do Docker ao Kubernetes" como base. Copie <code>package.json</code> e o lockfile antes do código para aproveitar o cache de camadas, gere o cliente do Prisma no estágio de build e inicie com <code>node dist/main.js</code> (não com <code>npm start</code>, que não repassa o <code>SIGTERM</code>).</p>`,
        },
        {
          t: "Compose com migrações como um passo separado",
          d: `<p>Migração não roda no <code>main.ts</code>: com 3 réplicas, as 3 tentariam migrar ao mesmo tempo. Um serviço de uma execução só aplica as migrações e a API espera ele terminar.</p>`,
          code: `services:
  db:
    image: postgres:17-alpine
    environment: { POSTGRES_DB: tarefas, POSTGRES_USER: tarefas, POSTGRES_PASSWORD: tarefas }
    volumes: [dados-pg:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tarefas"]
      interval: 5s

  migracoes:
    build: { context: ., target: build }
    command: npx prisma migrate deploy
    environment: { DATABASE_URL: postgresql://tarefas:tarefas@db:5432/tarefas }
    depends_on: { db: { condition: service_healthy } }

  api:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    environment: { DATABASE_URL: postgresql://tarefas:tarefas@db:5432/tarefas }
    depends_on:
      migracoes: { condition: service_completed_successfully }

volumes:
  dados-pg:`,
        },
      ],
      pronto: "Num clone limpo, <code>docker compose up</code> sobe tudo, o fluxo da fase anterior funciona contra a API em contêiner, e <code>docker compose down && docker compose up</code> mantém os dados.",
    },

    /* ===================== Programador Pleno / Sênior ===================== */
    {
      fase: "p-nosql",
      t: "Histórico de atividades",
      objetivo: "Registrar tudo o que acontece num projeto (tarefa criada, concluída, membro convidado) num formato flexível. Essa é a matéria-prima dos resumos com IA no fim da trilha. E decidir, com dados, onde guardar.",
      entregas: [
        "Tabela <code>atividades</code> com <code>tipo</code>, <code>ator_id</code>, <code>projeto_id</code>, <code>ocorrida_em</code> e <code>dados jsonb</code>",
        "Toda mudança de tarefa e de membro grava uma atividade",
        "<code>GET /projetos/{id}/atividades</code> paginado por cursor",
        "Um protótipo do mesmo histórico em MongoDB, numa branch separada",
        "Decisão registrada: PostgreSQL com JSONB ou MongoDB, com os números que você mediu",
      ],
      passos: [
        {
          t: "Modele a atividade como um fato",
          d: `<p>Uma atividade é imutável: algo que aconteceu. Campos fixos para o que você filtra (projeto, tipo, data) e um <code>jsonb</code> para os detalhes, que variam por tipo (o título antigo e o novo numa renomeação, o papel num convite). Índice em <code>(projeto_id, ocorrida_em DESC)</code>.</p>`,
        },
        {
          t: "Compare com MongoDB, de verdade",
          d: `<p>Numa branch <code>spike/mongo</code>, implemente o mesmo endpoint com o driver oficial do MongoDB. Gere 1 milhão de atividades nos dois e compare: tempo da página mais recente, tempo de "quantas tarefas cada pessoa concluiu no mês" (agregação), e o custo de operar mais um banco. Escreva a decisão em <code>docs/decisoes.md</code>. Para este projeto, a resposta provável é "JSONB resolve", e tudo bem: o valor está em decidir medindo.</p>`,
        },
      ],
      pronto: "Ao concluir uma tarefa, a atividade aparece no histórico do projeto, e a decisão sobre onde guardar está escrita com números.",
    },
    {
      fase: "p-qual",
      t: "Código que dá gosto de manter",
      objetivo: "Arrumar a casa: regras dentro do domínio, controllers e serviços finos, erros de domínio tratados num só lugar e dependências invertidas.",
      entregas: [
        "Nenhuma regra de negócio em controller; casos de uso pequenos com nomes do negócio (<code>ConcluirTarefa</code>, <code>ConvidarMembro</code>)",
        "Repositórios como <code>abstract class</code> no domínio, implementados com Prisma na infraestrutura",
        "Erros de domínio (<code>RegraViolada</code>) convertidos em 409/422 por um exception filter global",
        "Regra de complexidade no linter e nenhum <code>any</code> no projeto",
        "README com uma seção de convenções de código",
      ],
      passos: [
        {
          t: "Encontre o que está no lugar errado",
          d: `<p>Leia cada controller e serviço procurando <code>if</code> com regra de negócio, <code>prisma.tarefa.update</code> que muda status direto e checagens repetidas. Cada achado vira um método no domínio ou um caso de uso. Use o exemplo "Dependency Inversion na prática" do tópico de SOLID como modelo.</p>`,
        },
        {
          t: "Um lugar para traduzir erros",
          d: `<p>O domínio lança <code>RegraViolada("ja-concluida", ...)</code>; o filter converte para Problem Details com <code>type</code> estável (<code>/erros/ja-concluida</code>). O front-end passa a decidir pelo código do erro, não pela mensagem.</p>`,
        },
      ],
      pronto: "Um caso de uso pode ser lido em voz alta para alguém do negócio e faz sentido. O linter passa com a regra de complexidade ligada.",
    },
    {
      fase: "p-testes",
      t: "A rede de segurança",
      objetivo: "Montar a pirâmide de testes do projeto e usar TDD numa regra nova: o limite de tarefas em andamento por pessoa.",
      entregas: [
        "Testes de domínio cobrindo todas as regras (unitários, milissegundos)",
        "Testes de integração dos repositórios Prisma com Testcontainers",
        "Testes ponta a ponta com Supertest nos fluxos principais e nos de segurança",
        "Regra nova feita com TDD: no máximo 3 tarefas em andamento por pessoa em cada projeto",
        "Mutation testing com StrykerJS no domínio, com pelo menos 80% de mutantes mortos",
      ],
      passos: [
        {
          t: "Separe os níveis",
          d: `<p><code>*.test.ts</code> para unitários e <code>*.int.test.ts</code> para integração, com scripts separados (<code>npm test</code> rápido, <code>npm run test:int</code> com Docker). Use o exemplo de Testcontainers do tópico de testes: o banco do teste é um PostgreSQL de verdade, com as migrações aplicadas.</p>`,
        },
        {
          t: "TDD na regra do limite de trabalho em andamento",
          d: `<p>Comece pelo teste: "Ana já tem 3 tarefas em andamento no projeto; iniciar a quarta lança <code>RegraViolada('limite-wip')</code>". Veja falhar, implemente o mínimo, refatore. Depois pense: onde essa regra mora? Ela envolve várias tarefas, então não cabe dentro de uma <code>Tarefa</code>. Anote a dúvida: ela volta na fase de DDD.</p>`,
        },
      ],
      pronto: "<code>npm test</code> roda em segundos, <code>npm run test:int</code> roda com Docker, e você consegue quebrar qualquer regra de propósito e ver um teste falhar.",
    },
    {
      fase: "p-patterns",
      t: "Padrões onde eles pagam o próprio custo",
      objetivo: "Aplicar quatro padrões em problemas reais do projeto, cada um justificado pela mudança futura que torna barata.",
      entregas: [
        "<strong>Strategy</strong>: ordenação da lista de tarefas por prazo, prioridade ou manual (<code>?ordem=</code>)",
        "<strong>Observer</strong>: eventos de domínio (<code>tarefa.concluida</code>) com <code>@nestjs/event-emitter</code>; o histórico de atividades passa a ouvir os eventos",
        "<strong>Adapter</strong>: porta <code>Notificador</code> com adaptador de console (dev) e de e-mail SMTP (Mailpit no Compose)",
        "<strong>Decorator</strong>: <code>NotificadorComRetry</code> envolvendo o adaptador de e-mail",
        "<strong>Builder</strong> de dados de teste: <code>umaTarefa().comPrazo(...).emAndamento()</code>",
      ],
      passos: [
        {
          t: "Desacople o histórico com eventos",
          d: `<p>Hoje o caso de uso de tarefas grava a atividade diretamente: tarefas conhece atividades. Com eventos, o caso de uso só emite <code>tarefa.concluida</code>; um listener no módulo de atividades grava. Amanhã, notificações e IA ouvem o mesmo evento sem tocar em tarefas.</p>`,
        },
        {
          t: "Convite por e-mail com um servidor falso",
          d: `<p>Adicione o Mailpit ao Compose (uma caixa de e-mail falsa com interface web). Convidar um membro envia um e-mail que você vê em <code>localhost:8025</code>. Em produção, troque o adaptador; o caso de uso não muda.</p>`,
        },
      ],
      pronto: "Para cada padrão, um parágrafo em <code>docs/decisoes.md</code> diz qual mudança futura ele torna barata. Se não souber escrever, remova o padrão.",
    },
    {
      fase: "p-refac",
      t: "Pagando a dívida",
      objetivo: "Tornar a dívida técnica visível e pagar a mais cara com refatorações seguras, uma por commit.",
      entregas: [
        "<code>docs/debito-tecnico.md</code> com 10 itens: impacto, esforço e prioridade",
        "Value Objects onde há primitivos espalhados (<code>Email</code>, <code>TituloDaTarefa</code>, <code>Prazo</code>)",
        "Os 3 itens mais caros resolvidos, cada refatoração num commit separado, testes verdes em todos",
        "Nenhum parâmetro booleano solto nas funções públicas",
      ],
      passos: [
        {
          t: "Liste antes de mexer",
          d: `<p>Percorra o código com o catálogo de smells do tópico de refactoring. Para cada item, escreva o impacto em linguagem de negócio ("toda nova regra de prazo exige mexer em 4 arquivos"). Priorize pelo que você vai tocar nas próximas fases.</p>`,
        },
        {
          t: "Refatore em passos pequenos",
          d: `<p>Sem teste cobrindo, escreva primeiro um teste de caracterização. Depois uma refatoração nomeada por commit (<code>refactor: Replace Primitive with Object em Email</code>). Se um commit mistura refatoração e mudança de comportamento, desfaça e separe.</p>`,
        },
      ],
      pronto: "O registro de dívida existe e está priorizado, os 3 primeiros itens estão resolvidos e o <code>git log</code> mostra uma refatoração por commit.",
    },
    {
      fase: "p-perf",
      t: "Rápido onde importa: cache, filas e SQL",
      objetivo: "Medir antes de otimizar e tirar do caminho da requisição o que não precisa estar lá. Introduz o Redis, o worker e o locking otimista.",
      entregas: [
        "Teste de carga com k6 nos 3 endpoints mais usados, com p95 e p99 antes e depois",
        "Painel do projeto (<code>GET /projetos/{id}/painel</code>) com cache-aside no Redis e invalidação por evento",
        "BullMQ: e-mail de convite e lembrete diário de prazos processados num worker separado",
        "Paginação por cursor na lista de tarefas e índices conferidos com <code>EXPLAIN ANALYZE</code>",
        "Locking otimista: <code>PATCH /tarefas/{id}</code> com versão; conflito vira 409",
        "Limite de tarefas em andamento à prova de corrida: com 50 requisições simultâneas, ninguém passa do limite",
      ],
      passos: [
        {
          t: "Meça primeiro",
          d: `<p>Gere dados realistas (100 projetos, 200 mil tarefas), rode k6 e guarde os números em <code>docs/performance.md</code>. Só otimize o que os números apontarem. Se o painel já responde em 20 ms, cache ali é complexidade sem retorno: registre isso também.</p>`,
        },
        {
          t: "Um worker, não um setTimeout",
          d: `<p>O worker é a mesma base de código iniciada por outro arquivo: sobe o contexto do Nest sem servidor HTTP e processa as filas. No Compose, vira mais um serviço (<code>command: node dist/worker.js</code>), junto com o Redis.</p>`,
          code: `// src/worker.ts
import { NestFactory } from "@nestjs/core";
import { WorkerModule } from "./worker.module.js";

// Sem HTTP: só providers, incluindo os @Processor do BullMQ
const app = await NestFactory.createApplicationContext(WorkerModule);
app.enableShutdownHooks(); // termina o job atual antes de sair

// src/modules/notificacoes/lembretes.agendamento.ts — job repetido todo dia às 8h
await fila.upsertJobScheduler("lembrete-diario", { pattern: "0 8 * * *", tz: "America/Sao_Paulo" }, {
  name: "lembrar-prazos",
});`,
        },
        {
          t: "Conflitos de edição com a coluna version",
          d: `<p>O cliente envia a <code>version</code> que leu. O update só acontece <code>WHERE id = $1 AND version = $2</code> e incrementa a versão; zero linhas afetadas vira 409 com a mensagem "alguém alterou esta tarefa". Escreva o teste com duas edições concorrentes.</p>`,
        },
      ],
      pronto: "Os números de antes e depois estão em <code>docs/performance.md</code>, convites e lembretes saem pelo worker, e o teste de concorrência não deixa ninguém passar do limite.",
    },
    {
      fase: "p-cloud",
      t: "No ar, com pipeline",
      objetivo: "Todo merge na main passa por um pipeline e vai para um ambiente público. Operação deixa de ser manual.",
      entregas: [
        "GitHub Actions: lint, tipos, testes unitários e de integração em todo PR",
        "Imagem publicada no GitHub Container Registry a cada merge na main, com a tag do commit",
        "Deploy automático num serviço de contêineres (ECS Fargate, Render, Fly.io ou similar) com PostgreSQL e Redis gerenciados",
        "Migrações aplicadas no deploy, antes da nova versão receber tráfego",
        "Segredos fora do repositório (secrets do GitHub e do provedor)",
        "Alarme de orçamento configurado na conta da nuvem",
      ],
      passos: [
        {
          t: "O pipeline",
          d: `<p>Use o pipeline do tópico de CI/CD como base. Os testes de integração rodam no próprio runner do GitHub, que tem Docker. Meta: PR verde em menos de 10 minutos.</p>`,
        },
        {
          t: "Escolha onde rodar e registre",
          d: `<p>Compare duas opções (por exemplo, ECS Fargate e uma plataforma como Render) em custo mensal, esforço de operação e aprendizado. Escolha, registre em <code>docs/decisoes.md</code> e implante: API, worker, banco e Redis. Deixe a URL pública no README.</p>`,
        },
      ],
      pronto: "Um merge na main chega em produção sem nenhum passo manual, e um PR com teste quebrado não consegue ser mergeado.",
    },

    /* ===================== Arquiteto de Software ===================== */
    {
      fase: "p-arq",
      t: "A arquitetura escrita",
      objetivo: "Transformar o que está na sua cabeça e em <code>docs/decisoes.md</code> em documentação de arquitetura de verdade: ADRs, diagramas C4 e características priorizadas com cenários mensuráveis.",
      entregas: [
        "<code>docs/adr/</code> com um ADR para cada decisão importante já tomada (pelo menos 8)",
        "Diagramas C4 de contexto e de contêineres (Structurizr DSL ou Mermaid) no repositório",
        "As 3 características de arquitetura principais, cada uma com um cenário mensurável",
        "Uma fitness function no CI para uma delas (por exemplo, p99 da listagem com k6)",
        "README reorganizado no formato arc42 leve",
      ],
      passos: [
        {
          t: "De anotações para ADRs",
          d: `<p>Cada item de <code>docs/decisoes.md</code> vira <code>docs/adr/000N-titulo.md</code> com contexto, decisão, alternativas e consequências (boas e ruins). Use o ADR de exemplo do tópico de decisões como modelo. Decisões candidatas: TypeScript estrito, NestJS, PostgreSQL com Prisma, JWT com refresh em cookie, JSONB para atividades, BullMQ, onde implantar.</p>`,
        },
        {
          t: "Escolha as características",
          d: `<p>Para um SaaS de tarefas com IA, candidatas fortes: <strong>segurança</strong> (dados de clientes), <strong>disponibilidade</strong> (o time trabalha nele o dia todo) e <strong>custo</strong> (IA cobra por uso). Escreva um cenário para cada, no formato de seis partes, e justifique por que outras ficaram de fora.</p>`,
        },
      ],
      pronto: "Alguém novo no projeto entende, em 30 minutos de leitura, o que o sistema faz, como está dividido, por que cada escolha foi feita e o que ele precisa garantir.",
    },
    {
      fase: "p-ddd",
      t: "O domínio de verdade",
      objetivo: "Usar DDD para redesenhar as fronteiras: descobrir os contextos, a linguagem e os agregados certos antes de reorganizar o código.",
      entregas: [
        "EventStorming (Big Picture) do ciclo de vida de um projeto, no Miro, com hotspots marcados",
        "Glossário da linguagem ubíqua em <code>docs/glossario.md</code>",
        "Bounded contexts definidos: Identidade, Trabalho (projetos e tarefas), Atividades e Insights, Notificações",
        "Context map com o tipo de relação entre cada par",
        "Agregados revistos: invariantes de <code>Projeto</code> (membros e papéis) e de <code>Tarefa</code>, e onde mora o limite de trabalho em andamento",
      ],
      passos: [
        {
          t: "EventStorming sozinho ou com amigos",
          d: `<p>Na parede do Miro, eventos no passado: "Usuário cadastrado", "Projeto criado", "Membro convidado", "Convite aceito", "Tarefa criada", "Tarefa iniciada", "Prazo vencido", "Tarefa concluída", "Resumo semanal gerado". Depois, comandos, atores e políticas ("quando o prazo vence, avisar o responsável"). Onde a linguagem muda, há uma fronteira.</p>`,
        },
        {
          t: "Resolva a dúvida do limite",
          d: `<p>Lembra da regra de no máximo 3 tarefas em andamento? Ela envolve várias tarefas da mesma pessoa no mesmo projeto. Opções: um agregado maior (Projeto com todas as tarefas: lento), um serviço de domínio com a consulta e uma garantia no banco, ou aceitar consistência eventual. Escolha e escreva um ADR.</p>`,
        },
      ],
      pronto: "O glossário e o context map existem, e cada agregado tem suas invariantes escritas e testadas.",
    },
    {
      fase: "p-estilos",
      t: "Monolito modular com fronteiras verificadas",
      objetivo: "Reorganizar o código em módulos por contexto, com API pública e regras de dependência que o CI fiscaliza. Hexagonal só onde o domínio é rico.",
      entregas: [
        "<code>src/modules/{identidade,projetos,tarefas,atividades,notificacoes}</code>, cada um com <code>index.ts</code> como API pública",
        "dependency-cruiser no CI: sem ciclos, sem import interno entre módulos, domínio sem framework",
        "Comunicação entre módulos por eventos ou pela API pública, nunca por tabela alheia",
        "Hexagonal no módulo de tarefas: portas no domínio, adaptadores Prisma e em memória",
        "ADR: \"monolito modular, não microsserviços\", com os sinais que justificariam extrair um módulo",
      ],
      passos: [
        {
          t: "Mova por contexto, não por camada",
          d: `<p>Use a estrutura do tópico de monolito modular. Comece criando os <code>index.ts</code> e corrigindo os imports para passarem por eles; depois mova os arquivos internos. Rode os testes a cada passo.</p>`,
        },
        {
          t: "O ADR que o projeto pede",
          d: `<p>Escreva o que justificaria separar um módulo: o worker de IA precisar escalar de forma muito diferente da API; notificações exigirem um time próprio; uma falha de um módulo derrubar os outros apesar dos bulkheads. Até lá, um deploy só. Este ADR é o que mais mostra maturidade no seu portfólio.</p>`,
        },
      ],
      pronto: "Um import proibido quebra o CI, os testes do módulo de tarefas rodam com adaptadores em memória, e o ADR do monolito modular está aceito.",
    },

    /* ===================== Arquiteto de Soluções ===================== */
    {
      fase: "p-nfr",
      t: "Capacidade e escala, com números",
      objetivo: "Planejar a capacidade com premissas explícitas, encontrar o ponto de saturação e provar que a API escala horizontalmente.",
      entregas: [
        "<code>docs/capacidade.md</code>: premissas de uso, RPS médio e de pico, concorrência, instâncias e custo",
        "Teste de carga que encontra o ponto de saturação de uma instância e o gargalo (CPU, event loop, banco ou pool)",
        "3 réplicas da API atrás de um Nginx no Compose, com uma derrubada no meio do teste sem erros visíveis",
        "Pool de conexões dimensionado somando todas as réplicas",
        "Checklist dos anti-padrões de performance aplicado ao projeto",
      ],
      passos: [
        {
          t: "Premissas primeiro",
          d: `<p>Exemplo: 5.000 empresas, 20 usuários ativos por empresa por dia, 60 requisições por usuário. Calcule com a planilha em código do tópico de capacidade e, principalmente, troque o <code>rpsPorInstancia</code> chutado pelo número que o seu k6 mediu.</p>`,
        },
        {
          t: "Prove o stateless",
          d: `<p>Com 3 réplicas atrás do Nginx, rode o k6 e derrube uma réplica. Se algum usuário perde a sessão ou recebe erro, há estado na instância: encontre e mova para o Redis ou o banco.</p>`,
        },
      ],
      pronto: "O documento de capacidade usa números medidos, você sabe qual recurso satura primeiro, e a API sobrevive à perda de uma réplica.",
    },
    {
      fase: "p-consist",
      t: "Dados corretos entre processos",
      objetivo: "Garantir que nada se perca nem se duplique entre a API, o banco e o worker: idempotência, outbox e um modelo de leitura para o painel.",
      entregas: [
        "<code>Idempotency-Key</code> obrigatório em <code>POST /projetos/{id}/tarefas</code>",
        "Tabela <code>outbox</code> gravada na mesma transação; o worker publica os eventos na fila",
        "Consumidores idempotentes (tabela <code>eventos_processados</code>)",
        "Painel do projeto lido de uma tabela de leitura atualizada por eventos (CQRS nível 2)",
        "Teste de caos: derrubar o worker no meio e provar que nenhum evento se perde nem é aplicado duas vezes",
      ],
      passos: [
        {
          t: "Troque o evento em memória pelo outbox onde importa",
          d: `<p>O <code>EventEmitter</code> em memória perde eventos se o processo cair entre o commit e o envio do e-mail. Para eventos que geram efeitos fora do processo (notificações, IA), grave no outbox junto com a mudança e deixe o worker entregar. Use o exemplo do tópico de sagas e outbox.</p>`,
        },
        {
          t: "Explique a consistência eventual na interface",
          d: `<p>O painel agora pode atrasar alguns segundos. Decida com o "produto" (você mesmo) se isso é aceitável, mostre "atualizado há X segundos" e registre a decisão.</p>`,
        },
      ],
      pronto: "O teste de caos passa: derrubar o worker no pior momento não perde nem duplica nenhum evento.",
    },
    {
      fase: "p-disp",
      t: "Falha bem e se explica",
      objetivo: "Tornar o sistema resiliente às falhas das dependências e observável o bastante para investigar um incidente só pelos dados.",
      entregas: [
        "Timeout em toda chamada externa (SMTP, IA, HTTP) e políticas de retry e circuit breaker com cockatiel",
        "Health checks <code>/health/live</code> e <code>/health/ready</code> e desligamento gracioso testado",
        "Logs estruturados com pino, com <code>traceId</code> e sem dados sensíveis",
        "OpenTelemetry na API e no worker, enviando para o Grafana LGTM no Compose",
        "2 SLOs definidos, com painel e alerta de burn rate",
        "Um game day com Toxiproxy documentado num postmortem sem culpados",
      ],
      passos: [
        {
          t: "Observabilidade antes do incidente",
          d: `<p>Adicione o contêiner <code>grafana/otel-lgtm</code> ao Compose e carregue a instrumentação antes da aplicação (<code>node --import ./dist/instrumentation.js</code>), como no tópico de observabilidade. Siga um traceId do <code>POST</code> da tarefa até o job de notificação no worker.</p>`,
        },
        {
          t: "Game day",
          d: `<p>Hipótese: "se o SMTP ficar 10 segundos lento, criar tarefas continua rápido". Injete a latência com Toxiproxy, observe no Grafana, compare com a hipótese e escreva o postmortem com o que mudou.</p>`,
        },
      ],
      pronto: "Com o SMTP fora do ar, o resto do sistema funciona normalmente, e você encontra a causa de um problema simulado só olhando o Grafana.",
    },
    {
      fase: "p-seg",
      t: "Segurança como requisito",
      objetivo: "Endurecer o sistema contra os ataques mais comuns e provar com testes: autorização por papel, credenciais protegidas, entradas validadas e limites de requisições.",
      entregas: [
        "Matriz de autorização (dono, editor, leitor × cada operação) implementada e testada rota a rota",
        "Rate limiting no login (força bruta) e por usuário na API, com 429 e <code>Retry-After</code>",
        "Refresh tokens com hash no banco, rotação a cada uso e revogação no logout e na troca de senha",
        "Helmet, CORS restrito, limite de tamanho de corpo e nenhuma consulta SQL concatenada",
        "Modelagem de ameaças STRIDE em <code>docs/ameacas.md</code>",
        "Pipeline com <code>npm audit</code>, Semgrep, Trivy e Gitleaks",
        "LGPD: exportar e excluir a própria conta",
      ],
      passos: [
        {
          t: "Teste a autorização como um atacante",
          d: `<p>Para cada rota, escreva testes com quatro personagens: dono, editor, leitor e um estranho. O estranho recebe 404 em tudo; o leitor não altera nada; só o dono convida e arquiva. Esses testes valem mais do que qualquer ferramenta.</p>`,
        },
        {
          t: "Ameaças específicas deste sistema",
          d: `<p>No STRIDE, inclua as que são só suas: convite enviado para e-mail errado dando acesso ao projeto; enumeração de usuários pelo cadastro; e, pensando na próxima etapa, texto de tarefa com instruções tentando manipular a IA.</p>`,
        },
      ],
      pronto: "Todos os testes de autorização passam, o login bloqueia força bruta, e o pipeline falha se alguém commitar um segredo.",
    },
    {
      fase: "p-final",
      t: "Revisão Well-Architected e o desenho para escala",
      objetivo: "Avaliar o projeto com os seis pilares do AWS Well-Architected e desenhar como ele seria para cem vezes mais usuários.",
      entregas: [
        "Revisão pelos seis pilares (excelência operacional, segurança, confiabilidade, eficiência de desempenho, custo, sustentabilidade) em <code>docs/well-architected.md</code>",
        "Diagrama da arquitetura-alvo na AWS: ALB, ECS Fargate (API e worker), RDS Multi-AZ, ElastiCache, Secrets Manager",
        "Estratégia de recuperação de desastres escolhida, com RTO e RPO",
        "Documento de system design: \"e se tivéssemos 500 mil empresas?\", com o que muda e o que não muda",
        "Estimativa de custo mensal das duas versões",
      ],
      passos: [
        {
          t: "Avalie com honestidade",
          d: `<p>Para cada pilar, responda as perguntas do framework e classifique: atende, atende parcialmente, não atende. Os "não atende" viram itens no backlog ou riscos aceitos num ADR. A ferramenta Well-Architected Tool da AWS ajuda a seguir o roteiro.</p>`,
        },
        {
          t: "System design do próprio projeto",
          d: `<p>Use o método de 6 passos do tópico de system design no seu sistema. Perguntas que vão aparecer: particionar por empresa? réplicas de leitura para o painel? o custo de IA cresce linearmente com os usuários?</p>`,
        },
      ],
      pronto: "Você consegue apresentar em 15 minutos a arquitetura atual, os riscos que aceitou, a versão para escala e quanto cada uma custa.",
    },

    /* ===================== Fora da curva ===================== */
    {
      fase: "p-extra",
      t: "IA com custo, limite e avaliação",
      objetivo: "Adicionar resumos semanais do projeto e sugestões de prioridade com IA, tratando o modelo como uma dependência externa cara, lenta e não determinística.",
      entregas: [
        "Porta <code>AssistenteIa</code> no módulo de Insights e um adaptador com o SDK da Anthropic",
        "Chamadas à IA só no worker, via fila; o usuário recebe o resumo quando fica pronto",
        "Saída estruturada validada com zod; IDs de tarefas citados conferidos contra o banco",
        "Controle de custo: orçamento mensal de tokens por empresa, rate limit por usuário, cache do resumo por período",
        "Proteção de dados: só títulos, status e datas vão para o modelo; nomes e e-mails pseudonimizados; IA só liga com opt-in do projeto",
        "Defesa contra prompt injection: o texto das tarefas vai delimitado como dado e a IA não tem nenhuma ferramenta com efeito",
        "Avaliação: 20 projetos de exemplo com critérios automáticos, rodada antes de mudar prompt ou modelo",
        "Métricas de tokens, custo e latência por chamada no Grafana; ADR da funcionalidade",
      ],
      passos: [
        {
          t: "A IA atrás de uma porta",
          d: `<p>O domínio pede "um resumo do período"; não sabe que existe um modelo. Isso permite um adaptador falso nos testes, trocar de modelo ou provedor por configuração e medir tudo num ponto só. Use o exemplo de resumo estruturado do tópico de IA como base do adaptador.</p>`,
          code: `// src/modules/insights/dominio/assistente-ia.ts
export type ResumoDoPeriodo = { resumo: string; riscos: string[]; tarefasCitadas: string[] };

export abstract class AssistenteIa {
  abstract resumir(atividades: AtividadeAnonimizada[], opcoes: { signal: AbortSignal }): Promise<ResumoDoPeriodo | null>;
}

// src/modules/insights/aplicacao/gerar-resumo.ts (roda no worker)
export class GerarResumo {
  constructor(
    private readonly ia: AssistenteIa,
    private readonly orcamento: OrcamentoDeTokens,
    private readonly atividades: AtividadesConsulta,
    private readonly resumos: ResumosRepository,
  ) {}

  async executar(projetoId: string, semana: string): Promise<void> {
    if (await this.resumos.existe(projetoId, semana)) return;            // idempotente e cacheado
    if (!(await this.orcamento.temSaldo(projetoId))) return;            // sem orçamento, sem chamada
    const dados = anonimizar(await this.atividades.daSemana(projetoId, semana));
    const resumo = await this.ia.resumir(dados, { signal: AbortSignal.timeout(60_000) });
    if (!resumo) return;                                                // recusa ou falha: degrada
    const validas = await this.atividades.tarefasExistem(projetoId, resumo.tarefasCitadas);
    await this.resumos.salvar(projetoId, semana, { ...resumo, tarefasCitadas: validas });
  }
}`,
        },
        {
          t: "Avalie antes de mudar qualquer coisa",
          d: `<p>Monte 20 projetos de exemplo (com casos difíceis: projeto vazio, tarefa com texto tentando dar ordens à IA, nomes de pessoas no título). Critérios automáticos: JSON válido, só IDs existentes, nenhum e-mail ou nome real no resumo, resumo com menos de 120 palavras. Rode a avaliação antes de trocar prompt, esforço ou modelo, e registre os resultados: cada rodada custa dinheiro, então decida quando rodar.</p>`,
        },
        {
          t: "Custos visíveis",
          d: `<p>Registre <code>usage.input_tokens</code>, <code>output_tokens</code> e <code>cache_read_input_tokens</code> de cada chamada como métricas, converta para dólares com a tabela de preços e mostre no Grafana: custo por empresa por dia. Use <code>effort: "low"</code> para um resumo simples e só aumente se a avaliação mostrar ganho real.</p>`,
        },
      ],
      pronto: "O resumo semanal aparece no projeto, a avaliação passa, o custo por empresa está num painel, e o ADR explica o que vai para o modelo, o que não vai e por quê.",
    },
  ],
};
