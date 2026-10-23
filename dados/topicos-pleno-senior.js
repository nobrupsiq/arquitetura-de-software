/* Programador Pleno / Sênior */

/* ---------- Mais sobre bancos de dados ---------- */

T({
  id: "nosql",
  phase: "p-nosql",
  title: "Bancos não relacionais (NoSQL)",
  level: "Intermediário",
  hours: 20,
  summary: "Document store, key-value, grafos e motores de busca, com MongoDB e Redis na prática em TypeScript.",
  body: `
<p>É o primeiro tópico da etapa Pleno/Sênior no seu mapa. NoSQL não substitui o relacional: amplia as opções quando o padrão de acesso, a escala ou o formato dos dados pedem outra coisa.</p>
<table class="tbl"><thead><tr><th>Tipo</th><th>Modelo</th><th>Bom para</th><th>Exemplos</th></tr></thead><tbody>
<tr><td>Document store</td><td>Documentos JSON/BSON aninhados</td><td>Agregados lidos inteiros, schema que varia</td><td>MongoDB, Couchbase</td></tr>
<tr><td>Key-value</td><td>Chave → valor opaco</td><td>Cache, sessão, contadores, filas, latência mínima</td><td>Redis, Valkey, DynamoDB</td></tr>
<tr><td>Graph database</td><td>Nós e arestas com propriedades</td><td>Relacionamentos como consulta principal: fraude, recomendação, redes</td><td>Neo4j</td></tr>
<tr><td>Search engine</td><td>Índice invertido</td><td>Busca textual, relevância, facetas, logs</td><td>OpenSearch, Elasticsearch</td></tr>
</tbody></table>
<h3>Modelagem orientada a consultas</h3>
<p>No relacional você modela os dados e depois escreve as consultas. Em NoSQL é o contrário: <strong>comece pelas consultas</strong> e modele para que cada uma leia o mínimo de documentos possível. Em MongoDB, a decisão central é <em>embutir</em> (dados lidos juntos ficam no mesmo documento) ou <em>referenciar</em> (dados com ciclo de vida próprio ou listas que crescem sem limite).</p>
<h3>E o JSONB do PostgreSQL?</h3>
<p>O PostgreSQL guarda documentos em colunas <code>jsonb</code>, com índices GIN e operadores de consulta. Para muitos casos "preciso de um campo flexível", isso resolve sem um banco novo. MongoDB começa a valer a pena quando o documento <em>é</em> o modelo principal, o volume pede escala horizontal ou o time precisa da flexibilidade do schema em toda a aplicação.</p>
<h3>Trade-offs</h3>
<p>Você troca joins, integridade referencial e às vezes transações multi-documento por escala horizontal e flexibilidade. Muitas aplicações acabam com <strong>persistência poliglota</strong>: PostgreSQL como fonte da verdade, Redis para cache e filas, OpenSearch para busca. Cada banco novo é mais um sistema para operar, então exija um motivo concreto.</p>
`,
  code: [
    {
      t: "MongoDB com o driver oficial: documento com itens embutidos",
      src: `import { MongoClient, type ObjectId } from "mongodb";

type ComentarioDoc = { autorId: string; texto: string; criadoEm: Date };
type TarefaDoc = {
  _id?: ObjectId;
  projetoId: string;
  titulo: string;
  status: "aberta" | "em_andamento" | "concluida";
  etiquetas: string[];
  comentarios: ComentarioDoc[];   // embutido: sempre lido junto com a tarefa
  criadaEm: Date;
};

const cliente = new MongoClient(process.env.MONGO_URL!);
const tarefas = cliente.db("tarefas").collection<TarefaDoc>("tarefas");

// Índice composto alinhado à consulta mais frequente
await tarefas.createIndex({ projetoId: 1, criadaEm: -1 });

const recentes = await tarefas
  .find({ projetoId: "p-42", status: { $ne: "concluida" } })
  .sort({ criadaEm: -1 })
  .limit(20)
  .toArray();

const comEtiqueta = await tarefas.find({ etiquetas: "urgente" }).toArray();`,
    },
    {
      t: "Redis como key-value para contadores",
      src: `import { Redis } from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

export async function registrarVisualizacao(projetoId: string): Promise<number> {
  const hoje = new Date().toISOString().slice(0, 10);
  const chave = "views:" + hoje + ":" + projetoId;
  const [[, n]] = (await redis
    .multi()
    .incr(chave)                  // atômico, mesmo com várias instâncias da API
    .expire(chave, 2 * 24 * 3600) // some sozinho depois de 2 dias
    .exec()) as [[null, number], unknown];
  return n;
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Faça o curso gratuito MongoDB Basics na MongoDB University e modele um catálogo de produtos com atributos variáveis por categoria." },
    { lvl: 2, text: "Implemente o mesmo histórico de atividades em PostgreSQL (com <code>jsonb</code>) e em MongoDB. Compare consultas, índices e o que acontece quando você precisa de um relatório agregado." },
    { lvl: 2, text: "Indexe 100 mil documentos no OpenSearch e implemente busca com autocompletar e filtros." },
    { lvl: 3, text: "Modele uma detecção simples de fraude em Neo4j (cartões, dispositivos e endereços compartilhados entre contas) e escreva as consultas Cypher." },
  ],
  refs: [
    { t: "MongoDB University (cursos gratuitos)", u: "https://learn.mongodb.com/" },
    { t: "MongoDB: Data Modeling", u: "https://www.mongodb.com/docs/manual/data-modeling/" },
    { t: "MongoDB: driver para Node.js", u: "https://www.mongodb.com/docs/drivers/node/current/" },
    { t: "PostgreSQL: tipos JSON", u: "https://www.postgresql.org/docs/current/datatype-json.html" },
    { t: "Redis: documentação", u: "https://redis.io/docs/latest/" },
    { t: "Neo4j GraphAcademy (gratuito)", u: "https://graphacademy.neo4j.com/" },
    { t: "Livro: NoSQL Distilled (Sadalage & Fowler)", u: "https://martinfowler.com/books/nosql.html" },
  ],
});

/* ---------- Clean Code e Orientação a Objetos avançada ---------- */

T({
  id: "clean-code",
  phase: "p-qual",
  title: "Clean Code e princípios de qualidade (DRY, KISS, YAGNI)",
  level: "Base",
  hours: 25,
  summary: "As regras de Clean Code do seu mapa e os princípios DRY, KISS e YAGNI, com o contraponto de A Philosophy of Software Design.",
  body: `
<p>Código é lido muito mais do que escrito. A arquitetura de um sistema se degrada linha por linha, e se recupera do mesmo jeito. Um arquiteto que não sabe refatorar não consegue mostrar ao time como chegar ao desenho que propôs.</p>
<h3>O essencial</h3>
<ul>
<li><strong>Nomes revelam intenção</strong>: <code>diasDesdeUltimoLogin</code> em vez de <code>d</code>; <code>calcularFrete</code> em vez de <code>processar</code>.</li>
<li><strong>Funções fazem uma coisa</strong>, num único nível de abstração.</li>
<li><strong>Sem efeitos colaterais escondidos</strong>: uma função chamada <code>validar</code> não deve gravar no banco.</li>
<li><strong>Comentários explicam o porquê</strong>, nunca o quê. Se precisa explicar o quê, renomeie.</li>
<li><strong>Tratamento de erro</strong>: erros com contexto (<code>new Error("...", { cause })</code>), nunca <code>catch {}</code> vazio, e nunca uma Promise sem <code>await</code> ou <code>.catch</code> (a rejeição some ou derruba o processo).</li>
</ul>
<h3>Code smells que você deve reconhecer de olhos fechados</h3>
<p><em>Long Function, Large Class, Primitive Obsession, Feature Envy, Shotgun Surgery, Divergent Change, Data Clumps, Switch Statements repetidos, Speculative Generality</em>, e um próprio do TypeScript: <em><code>any</code> espalhado</em>, que desliga o compilador justamente onde ele mais ajudaria. Cada smell tem refatorações conhecidas: <em>Extract Function, Move Function, Replace Primitive with Object, Replace Conditional with Polymorphism, Introduce Parameter Object</em>.</p>
<div class="callout"><b>Leitura crítica:</b> <em>Clean Code</em> é referência obrigatória, mas algumas recomendações (funções extremamente pequenas, por exemplo) são contestadas. Leia junto com <em>A Philosophy of Software Design</em>, de John Ousterhout, que defende "módulos profundos": interfaces simples escondendo implementações ricas. Saber pesar as duas visões já é pensamento de arquiteto.</div>

<h3>As regras do seu roadmap</h3>
<ul>
<li><strong>A regra do escoteiro</strong>: deixe o código um pouco melhor do que encontrou.</li>
<li><strong>Use nomes significativos</strong> e <strong>seja consistente</strong> (o mesmo conceito, o mesmo nome em todo lugar).</li>
<li><strong>Mantenha classes, funções e arquivos pequenos</strong>, com <strong>formatação e estilo</strong> padronizados (Prettier e um linter rodando no CI).</li>
<li><strong>Comente apenas o necessário</strong>: o porquê, nunca o quê.</li>
<li><strong>Evite abstrações precipitadas e refatore sempre.</strong></li>
<li><strong>Minimize a complexidade ciclomática</strong>: menos caminhos possíveis, menos testes necessários, menos bugs. A regra <code>complexity</code> do linter ajuda a vigiar.</li>
<li><strong>Prefira exceções (ou um tipo <code>Result</code>) a códigos de erro</strong>, e <strong>evite passar booleanos e nulos</strong> (use uniões, objetos de opções ou funções separadas).</li>
<li><strong>Testes de unidade</strong> e <strong>funções puras</strong> (sem efeito colateral) tornam o código previsível e fácil de testar.</li>
</ul>
<h3>Princípios de qualidade de código</h3>
<dl class="defs">
<dt>DRY: Don't Repeat Yourself</dt><dd>Cada <em>conhecimento</em> deve ter uma única representação. Atenção: duplicação de texto não é o mesmo que duplicação de conhecimento. Duas regras iguais hoje que mudam por motivos diferentes não devem ser unificadas.</dd>
<dt>KISS: Keep It Simple, Stupid</dt><dd>A solução mais simples que resolve o problema real. Complexidade precisa justificar o próprio custo.</dd>
<dt>YAGNI: You Aren't Gonna Need It</dt><dd>Não construa hoje o que talvez seja preciso amanhã. Generalidade especulativa é código para manter sem benefício.</dd>
</dl>`,
  code: [
    {
      t: "Antes: Primitive Obsession e Long Function",
      src: `function calcular(tipo: string, valor: number, qtd: number, uf: string): number {
  let t = valor * qtd;
  if (tipo === "VIP") t = t * 0.9;
  else if (tipo === "FUNC") t = t * 0.8;
  if (uf === "SP") t += t * 0.18;
  else if (uf === "RJ") t += t * 0.2;
  else t += t * 0.17;
  if (t > 1000) t -= 50;
  return t;
}`,
    },
    {
      t: "Depois: tipos do domínio e responsabilidades separadas",
      src: `const fatorPorCliente = { comum: 1, vip: 0.9, funcionario: 0.8 } as const;
type TipoCliente = keyof typeof fatorPorCliente; // "comum" | "vip" | "funcionario"

type ItemPedido = { precoUnitario: Dinheiro; quantidade: number };
const subtotal = (i: ItemPedido) => i.precoUnitario.vezes(i.quantidade);

class CalculadoraPedido {
  constructor(
    private readonly icms: TabelaIcms,
    private readonly descontoVolume: PoliticaDescontoVolume,
  ) {}

  total(item: ItemPedido, cliente: TipoCliente, uf: Uf): Dinheiro {
    const comDesconto = subtotal(item).vezes(fatorPorCliente[cliente]);
    const comImposto = comDesconto.mais(this.icms.sobre(comDesconto, uf));
    return this.descontoVolume.aplicar(comImposto);
  }
}
// Um tipo de cliente digitado errado ("VPI") agora é erro de compilação.`,
    },
  ],
  exercises: [
    { lvl: 2, text: "Escolha um projeto open source em TypeScript no GitHub, rode SonarQube (ou o SonarQube for IDE) localmente e escreva uma análise dos 5 smells mais graves com proposta de correção." },
    { lvl: 3, text: "Escreva um ensaio de uma página comparando <em>Clean Code</em> e <em>A Philosophy of Software Design</em> em três pontos onde discordam, com sua posição e exemplos em TypeScript." },
    { lvl: 2, text: "Configure Prettier e a regra de complexidade ciclomática do linter no CI. Corrija as 10 funções mais complexas de um projeto seu." },
  ],
  refs: [
    { t: "Livro: Refactoring, 2ª ed. (Martin Fowler)", u: "https://martinfowler.com/books/refactoring.html", note: "os exemplos da 2ª edição são em JavaScript" },
    { t: "Catálogo de refatorações", u: "https://refactoring.com/catalog/" },
    { t: "Refactoring Guru: smells e refatorações ilustrados", u: "https://refactoring.guru/refactoring" },
    { t: "clean-code-typescript: os princípios adaptados para TypeScript", u: "https://github.com/labs42io/clean-code-typescript" },
    { t: "Livro: A Philosophy of Software Design (John Ousterhout)", u: "https://web.stanford.edu/~ouster/cgi-bin/book.php" },
    { t: "Livro: Código Limpo (Robert C. Martin)", u: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/", note: "indicado no seu quadro" },
    { t: "Livro: O Programador Pragmático, 2ª ed. (Hunt & Thomas)", u: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/", note: "origem do DRY; indicado no seu quadro" },
  ],
});

T({
  id: "solid",
  phase: "p-qual",
  title: "Orientação a Objetos avançada: SOLID e Object Calisthenics",
  level: "Base",
  hours: 20,
  summary: "Os cinco princípios explicados com o que eles realmente protegem: a capacidade de mudar o sistema.",
  body: `
<p>SOLID não é um checklist de entrevista. Cada princípio responde a uma pergunta: <em>quando este requisito mudar, quantos lugares do código eu preciso mexer?</em> Arquitetura é a mesma pergunta em escala maior.</p>
<dl class="defs">
<dt>S: Single Responsibility</dt><dd>Um módulo deve ter <em>um único motivo para mudar</em>, ou seja, responder a um único ator do negócio. A regra de cálculo de folha (RH) e o formato do relatório (Financeiro) não devem viver na mesma classe.</dd>
<dt>O: Open/Closed</dt><dd>Aberto para extensão, fechado para modificação. Novos comportamentos entram como novas implementações, não como mais um <code>else if</code>.</dd>
<dt>L: Liskov Substitution</dt><dd>Um subtipo deve poder substituir o tipo base sem quebrar quem usa. Se <code>Quadrado extends Retangulo</code> quebra <code>definirLargura</code>, a herança está errada.</dd>
<dt>I: Interface Segregation</dt><dd>Clientes não devem depender de métodos que não usam. Interfaces pequenas e focadas.</dd>
<dt>D: Dependency Inversion</dt><dd>Regras de negócio não dependem de detalhes (banco, HTTP, framework). Os detalhes dependem de abstrações definidas pelo negócio. Este princípio é a base da arquitetura hexagonal e da Clean Architecture.</dd>
</dl>
<div class="callout"><b>Interfaces somem em tempo de execução</b>No TypeScript, uma <code>interface</code> não existe depois de compilada, então o container do NestJS não consegue usá-la como chave de injeção. A saída é declarar a porta como <code>abstract class</code> (que existe em tempo de execução) ou usar um token: <code>{ provide: TAREFAS_REPO, useClass: TarefasPrisma }</code> e <code>@Inject(TAREFAS_REPO)</code>.</div>
<h3>Coesão e acoplamento: as métricas por trás de tudo</h3>
<p>Alta coesão: coisas que mudam juntas ficam juntas. Baixo acoplamento: coisas que mudam por motivos diferentes ficam separadas. Mark Richards e Neal Ford usam o conceito de <strong>connascence</strong> para medir acoplamento com mais precisão: de nome, de tipo, de significado, de algoritmo, de posição, de tempo. Quanto mais forte o tipo de connascence, mais perto os elementos devem estar.</p>

<h3>Object Calisthenics</h3>
<p>Nove regras de Jeff Bay, propositalmente rígidas, para treinar design orientado a objetos. Use como exercício, não como lei:</p>
<ol>
<li>Apenas um nível de indentação por método.</li>
<li>Não use ELSE.</li>
<li>Envolva todos os tipos primitivos e strings (crie Value Objects).</li>
<li>Coleções de primeira classe (uma classe que só contém a coleção e seu comportamento).</li>
<li>Apenas um ponto por linha (Lei de Demeter).</li>
<li>Não abrevie nomes.</li>
<li>Mantenha as entidades pequenas (classes de até ~50 linhas).</li>
<li>No máximo duas variáveis de instância por classe.</li>
<li>Sem getters e setters: peça ao objeto para fazer, não pergunte pelos dados (Tell, Don't Ask).</li>
</ol>`,
  code: [
    {
      t: "Dependency Inversion na prática",
      src: `// dominio/tarefas.repository.ts — o domínio define o que precisa (porta)
export abstract class TarefasRepository {
  abstract porId(id: TarefaId): Promise<Tarefa | null>;
  abstract salvar(tarefa: Tarefa): Promise<void>;
}

// aplicacao/concluir-tarefa.ts — o caso de uso depende só da abstração
@Injectable()
export class ConcluirTarefa {
  constructor(
    private readonly tarefas: TarefasRepository,
    private readonly relogio: Relogio,
  ) {}

  async executar(id: TarefaId): Promise<void> {
    const tarefa = await this.tarefas.porId(id);
    if (!tarefa) throw new TarefaNaoEncontrada(id);
    tarefa.concluir(this.relogio.agora());
    await this.tarefas.salvar(tarefa);
  }
}

// infra/tarefas.prisma.ts — o detalhe (Prisma) implementa a abstração
@Injectable()
export class TarefasPrisma extends TarefasRepository { /* ... */ }

// No módulo: { provide: TarefasRepository, useClass: TarefasPrisma }`,
    },
    {
      t: "Open/Closed com uma união e um mapa de estratégias",
      src: `type RegraPrioridade = "prazo" | "impacto" | "manual";

const ordenadores: Record<RegraPrioridade, (a: Tarefa, b: Tarefa) => number> = {
  prazo: (a, b) => (a.prazo?.getTime() ?? Infinity) - (b.prazo?.getTime() ?? Infinity),
  impacto: (a, b) => b.impacto - a.impacto,
  manual: (a, b) => a.posicao - b.posicao,
};
// Nova regra = um novo item na união. O compilador aponta o Record incompleto.`,
    },
    {
      t: "Coleção de primeira classe e Tell, Don't Ask",
      src: `// Antes: quem usa precisa saber como calcular
if (projeto.tarefas.filter((t) => t.status !== "concluida").length === 0) { /* ... */ }

// Depois: a coleção tem comportamento próprio
export class Tarefas {
  readonly #itens: readonly Tarefa[];
  constructor(itens: readonly Tarefa[]) { this.#itens = [...itens]; }

  todasConcluidas(): boolean { return this.#itens.every((t) => t.status === "concluida"); }
  atrasadas(agora: Date): Tarefas {
    return new Tarefas(this.#itens.filter((t) => t.prazo !== undefined && t.prazo < agora));
  }
  com(nova: Tarefa): Tarefas { return new Tarefas([...this.#itens, nova]); }
}

if (projeto.tarefas.todasConcluidas()) { /* ... */ }`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Para cada princípio, escreva um exemplo em TypeScript que o viola e a versão corrigida. Explique em uma frase qual mudança futura ficou mais barata." },
    { lvl: 2, text: "Pegue um <code>Service</code> de mais de 500 linhas (de um projeto seu ou open source) e divida segundo SRP, identificando os atores de cada responsabilidade." },
    { lvl: 3, text: "Use o <strong>dependency-cruiser</strong> para escrever regras que impeçam a pasta <code>dominio</code> de importar qualquer coisa de <code>@nestjs/*</code> ou <code>@prisma/*</code>, e rode no CI." },
    { lvl: 2, text: "Faça uma kata (ex.: Bank Account ou Tennis) seguindo as 9 regras de Object Calisthenics à risca. Depois escreva quais regras você manteria no dia a dia." },
  ],
  refs: [
    { t: "Livro: Clean Architecture (Robert C. Martin)", u: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/" },
    { t: "connascence.io", u: "https://connascence.io/" },
    { t: "dependency-cruiser: regras de dependência para JS/TS", u: "https://github.com/sverweij/dependency-cruiser" },
    { t: "NestJS: Custom providers (tokens e useClass)", u: "https://docs.nestjs.com/fundamentals/custom-providers" },
    { t: "William Durand: Object Calisthenics", u: "https://williamdurand.fr/2013/06/03/object-calisthenics/" },
  ],
});

/* ---------- Testes automatizados ---------- */

T({
  id: "testes",
  phase: "p-testes",
  title: "Testes automatizados e TDD",
  level: "Intermediário",
  hours: 30,
  summary: "Vitest, Testcontainers, Supertest, pirâmide de testes, TDD, mutation testing e testes de arquitetura.",
  body: `
<p>Testes são a rede de segurança que permite mudar a arquitetura. Sem eles, toda refatoração grande vira aposta. Um arquiteto define a <strong>estratégia de testes</strong>: o que testar em cada camada, com que ferramentas e quanto custa rodar.</p>
<h3>Estratégia em camadas</h3>
<ul>
<li><strong>Unitários</strong> (milissegundos): regras de domínio puras, sem NestJS, sem banco. A maioria dos testes. Ferramenta: <strong>Vitest</strong>, o padrão do NestJS 12.</li>
<li><strong>Integração</strong> (segundos): repositórios contra um PostgreSQL real via <strong>Testcontainers</strong>; clientes HTTP contra um servidor falso (MSW ou nock).</li>
<li><strong>Ponta a ponta da API</strong>: a aplicação Nest inteira subida em memória e chamada com <strong>Supertest</strong>, nos fluxos críticos de negócio.</li>
<li><strong>Contrato</strong>: garantem que produtor e consumidor de uma API concordam (Pact).</li>
<li><strong>Arquitetura</strong>: dependency-cruiser verifica regras de dependência entre pastas e módulos.</li>
</ul>
<p>Evite mockar o que você não controla e evite banco em memória (SQLite) fingindo ser PostgreSQL: diferenças de dialeto escondem bugs. Testcontainers sobe o banco real em segundos.</p>
<h3>TDD: vermelho, verde, refatorar</h3>
<p>Escreva um teste que falha, escreva o mínimo para passar, refatore. O ganho não é só cobertura: o teste escrito antes força você a desenhar a API do ponto de vista de quem usa. É design, não só verificação.</p>
<h3>Mutation testing</h3>
<p>Cobertura de linha mente: um teste sem asserção cobre 100%. O <strong>StrykerJS</strong> altera seu código (troca <code>&gt;</code> por <code>&gt;=</code>, remove chamadas) e verifica se algum teste falha. Mutantes sobreviventes revelam testes fracos.</p>

<h3>A proporção do seu roadmap</h3>
<p>Seu mapa sugere a pirâmide clássica: cerca de <strong>80% testes unitários</strong>, <strong>15% de integração</strong> e <strong>5% funcionais/ponta a ponta</strong>. Use como ponto de partida: o que importa é que a maior parte do feedback seja rápida e que os testes lentos cubram os fluxos que mais importam ao negócio.</p>`,
  code: [
    {
      t: "Teste de domínio puro com Vitest",
      src: `import { describe, expect, it } from "vitest";

describe("Tarefa", () => {
  const agora = new Date("2026-10-22T10:00:00Z");

  it("não permite concluir tarefa já arquivada", () => {
    const tarefa = umaTarefa().arquivar(agora);
    expect(() => tarefa.concluir(agora)).toThrow(/arquivada/);
  });

  it.each([
    ["2026-10-21", true],
    ["2026-10-22", false],
    ["2026-10-30", false],
  ])("prazo %s → atrasada: %s", (prazo, esperado) => {
    const tarefa = umaTarefa({ prazo: new Date(prazo + "T00:00:00Z") });
    expect(tarefa.estaAtrasada(new Date("2026-10-22T00:00:00Z"))).toBe(esperado);
  });
});`,
    },
    {
      t: "Integração com PostgreSQL real (Testcontainers + Prisma)",
      src: `import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "node:child_process";
import { afterAll, beforeAll, expect, it } from "vitest";

let pg: StartedPostgreSqlContainer;
let repo: TarefasPrisma;

beforeAll(async () => {
  pg = await new PostgreSqlContainer("postgres:17-alpine").start();
  const url = pg.getConnectionUri();
  execSync("npx prisma migrate deploy", { env: { ...process.env, DATABASE_URL: url } });
  repo = new TarefasPrisma(criarPrisma(url));
}, 60_000);

afterAll(() => pg.stop());

it("salva e recupera tarefa com etiquetas", async () => {
  const tarefa = umaTarefa({ etiquetas: ["bug", "urgente"] });
  await repo.salvar(tarefa);
  expect((await repo.porId(tarefa.id))?.etiquetas).toEqual(["bug", "urgente"]);
});`,
    },
    {
      t: "Regra de arquitetura com dependency-cruiser",
      src: `// .dependency-cruiser.cjs
module.exports = {
  forbidden: [
    {
      name: "dominio-independente",
      comment: "O domínio não conhece framework nem banco",
      severity: "error",
      from: { path: "^src/modules/[^/]+/dominio" },
      to: { path: "node_modules/(@nestjs|@prisma|ioredis)" },
    },
    {
      name: "sem-atalho-entre-modulos",
      comment: "Um módulo só usa a API pública (index.ts) de outro",
      severity: "error",
      from: { path: "^src/modules/([^/]+)/" },
      to: { path: "^src/modules/([^/]+)/(?!index\\\\.ts$)", pathNot: "^src/modules/$1/" },
    },
  ],
};
// npx depcruise src --config .dependency-cruiser.cjs  (no CI, quebra o build)`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Faça a kata <strong>Bowling Game</strong> com TDD estrito, commitando a cada ciclo vermelho/verde/refatorar." },
    { lvl: 2, text: "Adicione StrykerJS a um projeto seu, rode e mate pelo menos 80% dos mutantes sobreviventes escrevendo testes melhores." },
    { lvl: 2, text: "Escreva testes de integração para um cliente HTTP usando MSW: sucesso, timeout, 500 e resposta malformada." },
    { lvl: 3, text: "Defina por escrito a estratégia de testes de um sistema de 3 serviços: o que cada nível cobre, tempo-alvo do pipeline e regras do dependency-cruiser. Implemente num projeto exemplo." },
  ],
  refs: [
    { t: "Vitest: documentação", u: "https://vitest.dev/" },
    { t: "Testcontainers for Node.js", u: "https://node.testcontainers.org/" },
    { t: "NestJS: Testing", u: "https://docs.nestjs.com/fundamentals/testing" },
    { t: "StrykerJS: mutation testing", u: "https://stryker-mutator.io/" },
    { t: "Mock Service Worker (MSW)", u: "https://mswjs.io/" },
    { t: "Livro: Test-Driven Development: By Example (Kent Beck)", u: "https://www.oreilly.com/library/view/test-driven-development/0321146530/" },
    { t: "Martin Fowler: The Practical Test Pyramid", u: "https://martinfowler.com/articles/practical-test-pyramid.html" },
  ],
});

/* ---------- Design Patterns ---------- */

T({
  id: "patterns",
  phase: "p-patterns",
  title: "Design patterns (GoF) em TypeScript",
  level: "Intermediário",
  hours: 30,
  summary: "Os padrões que de fato aparecem em sistemas reais e no próprio NestJS, escritos em TypeScript atual.",
  body: `
<p>Os 23 padrões do livro da Gang of Four (1994) são um vocabulário. Quando você diz "isso é um Decorator", o time inteiro entende a estrutura sem precisar desenhar. O objetivo não é decorar todos, mas reconhecer os que importam e saber que vários ficaram mais simples com funções de primeira classe e uniões discriminadas.</p>
<h3>Os mais úteis no dia a dia</h3>
<table class="tbl"><thead><tr><th>Padrão</th><th>Problema que resolve</th><th>Onde você já usa</th></tr></thead><tbody>
<tr><td>Strategy</td><td>Trocar algoritmo em tempo de execução</td><td>A função de comparação do <code>Array.sort</code>, regras de prioridade</td></tr>
<tr><td>Decorator</td><td>Adicionar comportamento sem herança</td><td>Cache e retry em volta de um cliente HTTP</td></tr>
<tr><td>Adapter</td><td>Encaixar uma interface em outra</td><td>Adaptadores da arquitetura hexagonal</td></tr>
<tr><td>Template Method</td><td>Esqueleto fixo, passos variáveis</td><td>Classes base abstratas, como as <em>strategies</em> do Passport</td></tr>
<tr><td>Observer</td><td>Notificar interessados</td><td><code>EventEmitter</code> do Node, <code>@nestjs/event-emitter</code></td></tr>
<tr><td>Factory / Builder</td><td>Construção complexa ou condicional</td><td><code>useFactory</code> do NestJS, <em>query builders</em> como Kysely</td></tr>
<tr><td>Proxy</td><td>Interceptar chamadas</td><td><code>Proxy</code> do JavaScript, interceptors do NestJS</td></tr>
<tr><td>Chain of Responsibility</td><td>Pipeline de handlers</td><td>Middlewares do Express, guards e pipes do NestJS</td></tr>
<tr><td>State</td><td>Comportamento muda com o estado</td><td>Ciclo de vida de tarefa, workflow</td></tr>
<tr><td>Command</td><td>Requisição como objeto</td><td>Jobs numa fila (BullMQ), CQRS (<code>@nestjs/cqrs</code>)</td></tr>
</tbody></table>
<div class="callout"><b>Dois "decorators" diferentes:</b> os <code>@Controller()</code> e <code>@Injectable()</code> do TypeScript são <em>decorators da linguagem</em>: anotam classes com metadados. O <em>padrão</em> Decorator do GoF é outra coisa: um objeto que envolve outro com a mesma interface para acrescentar comportamento. Mesmo nome, ideias diferentes.</div>
<div class="callout"><b>Armadilha:</b> padrão aplicado sem problema real é complexidade gratuita. Antes de usar um, diga em voz alta qual mudança futura ele torna barata. Se não souber dizer, não use.</div>
`,
  code: [
    {
      t: "Decorator: retry e métricas em volta de um gateway",
      src: `interface Notificador {
  enviar(msg: Mensagem): Promise<void>;
}

class ComRetry implements Notificador {
  constructor(private readonly alvo: Notificador, private readonly tentativas = 3) {}

  async enviar(msg: Mensagem): Promise<void> {
    for (let i = 1; ; i++) {
      try {
        return await this.alvo.enviar(msg);
      } catch (e) {
        if (!(e instanceof FalhaTransitoria) || i >= this.tentativas) throw e;
        await new Promise((r) => setTimeout(r, 100 * 2 ** i)); // backoff exponencial
      }
    }
  }
}

class ComMetricas implements Notificador {
  constructor(private readonly alvo: Notificador, private readonly histograma: Histograma) {}

  async enviar(msg: Mensagem): Promise<void> {
    const inicio = performance.now();
    try {
      await this.alvo.enviar(msg);
    } finally {
      this.histograma.record(performance.now() - inicio);
    }
  }
}

// Composição: cada camada com uma responsabilidade
const notificador = new ComMetricas(new ComRetry(new EmailSmtp(cfg), 3), histograma);`,
    },
    {
      t: "State com união discriminada",
      src: `type EstadoTarefa =
  | { tipo: "aberta" }
  | { tipo: "em_andamento"; responsavelId: string }
  | { tipo: "concluida"; em: Date }
  | { tipo: "arquivada"; motivo: string };

function arquivar(atual: EstadoTarefa, motivo: string): EstadoTarefa {
  switch (atual.tipo) {
    case "aberta":
    case "concluida":
      return { tipo: "arquivada", motivo };
    case "em_andamento":
      throw new RegraViolada("tarefa-em-andamento", "Conclua ou devolva a tarefa antes de arquivar");
    case "arquivada":
      return atual; // idempotente
  }
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Implemente cada padrão da tabela num exemplo de domínio diferente (tarefas, banco, logística). Um arquivo por padrão, com teste." },
    { lvl: 2, text: "Abra o código do NestJS no GitHub e encontre 5 padrões GoF reais. Para cada um, anote o arquivo e o motivo da escolha." },
    { lvl: 2, text: "Reescreva Strategy, Command e Observer usando apenas funções e objetos literais, sem classes. Discuta o que se perde e o que se ganha." },
    { lvl: 3, text: "Modele o fluxo de uma reclamação de cliente (aberta, em análise, aguardando cliente, resolvida, reaberta) com o padrão State e garanta via testes que transições inválidas são rejeitadas." },
  ],
  refs: [
    { t: "Refactoring Guru: Design Patterns (com exemplos em TypeScript)", u: "https://refactoring.guru/design-patterns/typescript" },
    { t: "Livro: Design Patterns (Gamma, Helm, Johnson, Vlissides)", u: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/" },
    { t: "Livro: Head First Design Patterns, 2ª ed.", u: "https://www.oreilly.com/library/view/head-first-design/9781492077992/" },
    { t: "Livro: Node.js Design Patterns, 4ª ed. (Casciaro, Mammino)", u: "https://www.nodejsdesignpatterns.com/" },
  ],
});

/* ---------- Técnicas de refactoring ---------- */

T({
  id: "refatoracao",
  phase: "p-refac",
  title: "Técnicas de refactoring e débito técnico",
  level: "Intermediário",
  hours: 20,
  summary: "Débito técnico, code smells e as famílias de refatoração do catálogo de Fowler: composição, dados, condicionais e chamadas.",
  body: `
<p>Refatorar é mudar a estrutura do código sem mudar o comportamento, em passos pequenos e seguros, com testes rodando a cada passo. Seu roadmap organiza o tema em seis partes, que seguimos aqui. Boa notícia: a 2ª edição do livro de Fowler usa JavaScript nos exemplos, então tudo se aplica direto ao seu código.</p>
<h3>O que é débito técnico</h3>
<p>O custo futuro de atalhos tomados hoje. Como uma dívida financeira, pode ser uma ferramenta (lançar antes do concorrente) desde que seja consciente e paga. O problema é a dívida invisível que acumula juros: cada feature nova fica mais lenta. Torne-a visível: registre, estime e negocie com o produto em termos de impacto no prazo.</p>
<h3>Code smells</h3>
<p>Sinais de que algo pode estar errado: <em>Long Function, Large Class, Long Parameter List, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Switch Statements, Shotgun Surgery, Divergent Change, Message Chains, Comments que explicam código confuso</em>.</p>
<h3>As famílias de refatoração</h3>
<dl class="defs">
<dt>Composição de funções</dt><dd><em>Extract Function, Inline Function, Extract Variable, Replace Temp with Query, Split Variable</em>. Quebram funções longas em partes com nomes que explicam a intenção.</dd>
<dt>Organização de dados</dt><dd><em>Replace Primitive with Object, Encapsulate Collection, Replace Magic Literal, Change Value to Reference</em>. Dão tipos e regras aos dados.</dd>
<dt>Expressões condicionais</dt><dd><em>Decompose Conditional, Consolidate Conditional Expression, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Special Case (Null Object)</em>.</dd>
<dt>Simplificar chamadas</dt><dd><em>Change Function Declaration, Introduce Parameter Object, Separate Query from Modifier, Remove Flag Argument, Replace Constructor with Factory Function</em>.</dd>
</dl>
<div class="callout"><b>A regra de ouro</b>Nunca refatore e mude comportamento no mesmo commit. Se não há testes, escreva primeiro testes de caracterização que capturam o comportamento atual, mesmo que ele pareça errado.</div>
`,
  code: [
    {
      t: "Guard clauses no lugar de condicionais aninhadas",
      src: `// Antes
function calcularPagamento(f: Funcionario): number {
  let resultado: number;
  if (f.afastado) {
    resultado = valorAfastamento(f);
  } else {
    if (f.aposentado) {
      resultado = valorAposentadoria(f);
    } else {
      resultado = salarioNormal(f);
    }
  }
  return resultado;
}

// Depois: Replace Nested Conditional with Guard Clauses
function calcularPagamento(f: Funcionario): number {
  if (f.afastado) return valorAfastamento(f);
  if (f.aposentado) return valorAposentadoria(f);
  return salarioNormal(f);
}`,
    },
    {
      t: "Remove Flag Argument + Introduce Parameter Object",
      src: `// Antes: o que significa 'true'? E esses quatro parâmetros soltos?
relatorio.gerar(inicio, fim, projetoId, true);

// Depois
type FiltroRelatorio = { readonly inicio: Date; readonly fim: Date; readonly projetoId: ProjectId };

function filtroRelatorio(inicio: Date, fim: Date, projetoId: ProjectId): FiltroRelatorio {
  if (fim < inicio) throw new Error("Período inválido: o fim vem antes do início");
  return { inicio, fim, projetoId };
}

relatorio.gerarResumido(filtroRelatorio(inicio, fim, projetoId));
relatorio.gerarDetalhado(filtroRelatorio(inicio, fim, projetoId));`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Faça a kata <strong>Gilded Rose</strong> em TypeScript: testes de caracterização primeiro, depois refatore aplicando pelo menos 5 refatorações nomeadas do catálogo." },
    { lvl: 2, text: "Faça a kata <strong>Theatrical Players</strong> (capítulo 1 do livro Refactoring) em TypeScript, com um commit por refatoração." },
    { lvl: 2, text: "Use as refatorações automáticas do VS Code (Rename Symbol, Extract Function, Extract Constant, Move to new file) num projeto seu e anote o que o editor garante e o que não garante." },
    { lvl: 3, text: "Monte um registro de débito técnico de um projeto real ou open source: 10 itens com impacto, esforço e prioridade, e a justificativa em termos de negócio para os 3 primeiros." },
  ],
  refs: [
    { t: "Livro: Refatoração, 2ª ed. (Martin Fowler)", u: "https://martinfowler.com/books/refactoring.html", note: "está na sua lista de livros; exemplos em JavaScript" },
    { t: "Catálogo oficial de refatorações", u: "https://refactoring.com/catalog/" },
    { t: "Refactoring Guru: smells e técnicas", u: "https://refactoring.guru/refactoring" },
    { t: "Gilded Rose Kata (tem versão em TypeScript)", u: "https://github.com/emilybache/GildedRose-Refactoring-Kata" },
    { t: "Theatrical Players Kata", u: "https://github.com/emilybache/Theatrical-Players-Refactoring-Kata" },
    { t: "Livro: Working Effectively with Legacy Code (Michael Feathers)", u: "https://www.oreilly.com/library/view/working-effectively-with/0131177052/" },
    { t: "Martin Fowler: Technical Debt", u: "https://martinfowler.com/bliki/TechnicalDebt.html" },
  ],
});

/* ---------- Otimização e performance ---------- */

T({
  id: "cache",
  phase: "p-perf",
  title: "Cache Aside, CDN e cache em todas as camadas",
  level: "Intermediário",
  hours: 12,
  summary: "Cache-aside, write-through, invalidação, TTL, stampede e cache distribuído com Redis.",
  body: `
<p>Há só duas coisas difíceis em ciência da computação: invalidação de cache e dar nome às coisas (Phil Karlton). Cache é a forma mais barata de ganhar desempenho e a forma mais fácil de servir dado errado.</p>
<h3>Onde há cache</h3>
<p>Navegador → CDN → API gateway → aplicação (local, em memória) → cache distribuído (Redis) → buffer do banco. Cada camada tem custo e validade diferentes.</p>
<h3>Padrões</h3>
<ul>
<li><strong>Cache-aside</strong>: a aplicação lê do cache; se não achar, lê do banco e grava no cache. O mais comum.</li>
<li><strong>Read-through / write-through</strong>: o cache fica no meio e fala com o banco.</li>
<li><strong>Write-behind</strong>: escreve no cache e persiste depois. Rápido, risco de perda.</li>
</ul>
<h3>Problemas clássicos</h3>
<ul>
<li><strong>Cache stampede</strong>: uma chave popular expira e mil requisições vão ao banco ao mesmo tempo. Soluções: deduplicar cargas em andamento (<em>single-flight</em>), lock por chave, expiração antecipada probabilística, recálculo em background.</li>
<li><strong>Dado obsoleto</strong>: defina conscientemente quanto atraso o negócio tolera. Contagem de tarefas num painel: segundos ou minutos. Permissão de acesso a um projeto: zero.</li>
<li><strong>Cache em dois níveis</strong>: local (em memória, como o <code>lru-cache</code>) + distribuído (Redis). Rápido, mas invalidar os locais de várias instâncias exige pub/sub.</li>
</ul>
`,
  code: [
    {
      t: "Cache local com proteção contra stampede (single-flight)",
      src: `import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, Resumo>({ max: 50_000, ttl: 10 * 60_000 });
const emAndamento = new Map<string, Promise<Resumo>>();

export async function resumoDoProjeto(id: string): Promise<Resumo> {
  const emCache = cache.get(id);
  if (emCache) return emCache;

  // 500 requisições simultâneas pela mesma chave → UMA consulta ao banco
  let carga = emAndamento.get(id);
  if (!carga) {
    carga = repositorio.resumo(id)
      .then((r) => { cache.set(id, r); return r; })
      .finally(() => emAndamento.delete(id));
    emAndamento.set(id, carga);
  }
  return carga;
}`,
    },
    {
      t: "Cache-aside com Redis e invalidação na escrita",
      src: `import { Redis } from "ioredis";
const redis = new Redis(process.env.REDIS_URL!);
const TTL_S = 600;

async function buscarProjeto(id: string): Promise<Projeto | null> {
  const chave = "projeto:" + id;
  const emCache = await redis.get(chave);
  if (emCache) return JSON.parse(emCache) as Projeto;

  const projeto = await prisma.projeto.findUnique({ where: { id } });
  if (projeto) await redis.set(chave, JSON.stringify(projeto), "EX", TTL_S);
  return projeto;
}

async function renomearProjeto(id: string, nome: string) {
  await prisma.projeto.update({ where: { id }, data: { nome } });
  await redis.del("projeto:" + id); // invalida DEPOIS de gravar no banco
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Adicione cache a um endpoint lento e meça a melhora com <code>k6</code>. Exponha a taxa de acerto (hit ratio) como métrica." },
    { lvl: 2, text: "Provoque um cache stampede (TTL curto + 500 requisições simultâneas) e corrija com single-flight. Mostre o número de consultas ao banco antes e depois." },
    { lvl: 3, text: "Implemente cache de dois níveis (lru-cache + Redis) com invalidação via Redis pub/sub entre 3 instâncias da aplicação." },
  ],
  refs: [
    { t: "lru-cache (isaacs)", u: "https://github.com/isaacs/node-lru-cache" },
    { t: "Redis: documentação", u: "https://redis.io/docs/latest/" },
    { t: "NestJS: Caching", u: "https://docs.nestjs.com/techniques/caching" },
    { t: "Facebook: Scaling Memcache (paper)", u: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf" },
  ],
});

T({
  id: "performance-jobs",
  phase: "p-perf",
  title: "Jobs assíncronos e performance de SQL",
  level: "Intermediário",
  hours: 15,
  summary: "Tirar trabalho pesado do caminho da requisição e fazer o banco responder rápido: filas de jobs, agendamento e otimização de consultas.",
  body: `
<h3>Jobs assíncronos</h3>
<p>Gerar PDF, enviar e-mail, processar imagem, chamar um parceiro lento ou um modelo de IA: nada disso precisa acontecer enquanto o usuário espera. Responda rápido (<code>202 Accepted</code>), enfileire o trabalho e processe em segundo plano. Opções em Node, da mais simples à mais robusta:</p>
<ul>
<li>Uma Promise solta (<code>void enviarEmail()</code>): simples, mas o trabalho se perde se o processo cair, e erros somem.</li>
<li><strong>Tabela de jobs</strong> no PostgreSQL com <code>FOR UPDATE SKIP LOCKED</code>, ou a biblioteca <strong>pg-boss</strong>, que faz isso por você: durável, sem infraestrutura nova.</li>
<li><strong>BullMQ</strong> sobre Redis: filas com retry, atraso, prioridade, jobs repetidos e painel. Integrado ao NestJS com <code>@nestjs/bullmq</code>.</li>
<li><strong>Fila de mensagens</strong> (RabbitMQ, SQS, Kafka): quando o volume é alto ou vários serviços consomem.</li>
</ul>
<p>Todo job precisa ser <strong>idempotente</strong> (pode rodar duas vezes sem estragar nada) e ter política de retry com backoff e destino para falhas definitivas.</p>
<h3>Otimização e performance de SQL</h3>
<ol>
<li><strong>Meça primeiro</strong>: <code>pg_stat_statements</code> mostra as consultas que mais consomem tempo total.</li>
<li><strong>Leia o plano</strong> com <code>EXPLAIN (ANALYZE, BUFFERS)</code>. Para ver o SQL que o Prisma gera, ligue o log de consultas.</li>
<li><strong>Índices certos</strong>: compostos na ordem das colunas do filtro, parciais para subconjuntos, cobrindo (<code>INCLUDE</code>) para evitar ir à tabela.</li>
<li><strong>Elimine N+1</strong> e <code>SELECT *</code>; traga só as colunas que a tela usa (<code>select</code> no Prisma).</li>
<li><strong>Paginação por cursor</strong> em listas grandes.</li>
<li><strong>Pool de conexões</strong> dimensionado pela lei de Little, não "quanto maior melhor". Várias instâncias da API somam conexões: 10 instâncias com pool de 20 já são 200 conexões no banco.</li>
<li>Operações em lote: <code>createMany</code>, <code>COPY</code> para cargas grandes.</li>
</ol>
`,
  code: [
    {
      t: "Job durável com BullMQ no NestJS",
      src: `// relatorios.controller.ts
@Controller("projetos/:id/relatorios")
export class RelatoriosController {
  constructor(@InjectQueue("relatorios") private readonly fila: Queue) {}

  @Post()
  @HttpCode(202)
  async solicitar(@Param("id") projetoId: string) {
    const job = await this.fila.add(
      "gerar",
      { projetoId },
      { jobId: "relatorio:" + projetoId + ":" + hojeISO(), // mesma chave = mesmo job (idempotente)
        attempts: 5, backoff: { type: "exponential", delay: 1_000 } },
    );
    return { id: job.id, status: "/relatorios/" + job.id };
  }
}

// relatorios.processor.ts — roda no worker, fora do caminho da requisição
@Processor("relatorios")
export class RelatoriosProcessor extends WorkerHost {
  async process(job: Job<{ projetoId: string }>) {
    if (await this.repositorio.jaGerado(job.id!)) return; // idempotente
    const pdf = await this.montarPdf(job.data.projetoId);
    await this.armazenamento.salvar(job.id!, pdf);
    await this.notificador.avisarPronto(job.data.projetoId);
  }
}`,
    },
    {
      t: "Encontrando e corrigindo a consulta lenta",
      src: `-- 1) As 5 consultas que mais consomem tempo
SELECT query, calls, round(total_exec_time) AS ms_total, round(mean_exec_time, 1) AS ms_media
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 5;

-- 2) O plano da pior
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, titulo, prazo FROM tarefas
WHERE projeto_id = '...' AND status <> 'concluida' ORDER BY prazo LIMIT 20;
-- Seq Scan on tarefas ... rows removed by filter: 4.999.980  → problema

-- 3) Índice alinhado ao filtro e à ordenação, cobrindo as colunas lidas
CREATE INDEX CONCURRENTLY idx_tarefas_projeto_pendentes
  ON tarefas (projeto_id, prazo) INCLUDE (titulo)
  WHERE status <> 'concluida';
-- Agora: Index Only Scan, de ~900 ms para ~0,3 ms`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Transforme um endpoint que envia e-mail de forma síncrona em assíncrono com BullMQ. Meça o tempo de resposta antes e depois." },
    { lvl: 2, text: "Ative <code>pg_stat_statements</code>, rode um teste de carga e otimize as 3 consultas mais caras. Documente planos e tempos antes e depois." },
    { lvl: 2, text: "Implemente uma fila de jobs própria com <code>SKIP LOCKED</code>, retry com backoff exponencial e tabela de falhas definitivas. Rode 3 workers em paralelo e compare com pg-boss." },
    { lvl: 3, text: "Importe 10 milhões de linhas de um CSV no PostgreSQL de três jeitos (INSERT um a um, <code>createMany</code> em lotes, <code>COPY</code> com <code>pg-copy-streams</code>) e compare tempos." },
  ],
  refs: [
    { t: "BullMQ: documentação", u: "https://docs.bullmq.io/" },
    { t: "NestJS: Queues", u: "https://docs.nestjs.com/techniques/queues" },
    { t: "pg-boss: filas sobre PostgreSQL", u: "https://github.com/timgit/pg-boss" },
    { t: "PostgreSQL: Using EXPLAIN", u: "https://www.postgresql.org/docs/current/using-explain.html" },
    { t: "Use The Index, Luke", u: "https://use-the-index-luke.com/" },
    { t: "HikariCP: About Pool Sizing", u: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing", note: "escrito para Java, mas o raciocínio vale para qualquer pool" },
  ],
});

T({
  id: "concorrencia",
  phase: "p-perf",
  title: "Concorrência e paralelismo no Node.js",
  level: "Intermediário",
  hours: 25,
  summary: "Event loop, Promises e async/await, condições de corrida entre awaits, cancelamento, limites de concorrência e worker threads.",
  body: `
<p>Todo servidor é concorrente. Entender concorrência é entender por que um sistema trava, perde dados ou não escala. É também a base para entender sistemas distribuídos, que são concorrência com rede no meio.</p>
<h3>Concorrência não é paralelismo</h3>
<p><strong>Concorrência</strong> é lidar com várias coisas em andamento ao mesmo tempo; <strong>paralelismo</strong> é executar várias coisas no mesmo instante, em núcleos diferentes. O Node é altamente concorrente numa thread só: enquanto uma requisição espera o banco, o event loop atende outras. Para paralelismo de CPU, você precisa de <em>worker threads</em> ou de vários processos (várias instâncias, ou o módulo <code>node:cluster</code>).</p>
<h3>Uma thread só não elimina condições de corrida</h3>
<p>É comum achar que, sem threads, não existe corrida. Existe: entre dois <code>await</code>, outras requisições rodam. O padrão <em>ler, decidir, gravar</em> (<em>check-then-act</em>) com um <code>await</code> no meio é a origem de saldos negativos, estoques furados e tarefas atribuídas a duas pessoas. E com várias instâncias da API, a corrida acontece entre processos: a solução tem de estar no banco (update atômico, constraint única, locking otimista) e não numa variável em memória.</p>
<h3>As ferramentas</h3>
<ul>
<li><code>Promise.all</code> (todas, falha na primeira), <code>allSettled</code> (todas, com resultado individual), <code>race</code> e <code>any</code>.</li>
<li><strong>Limite de concorrência</strong>: disparar 10.000 Promises de uma vez derruba o banco ou o parceiro. Use um limitador (<code>p-limit</code>) ou processe em lotes.</li>
<li><strong>Cancelamento</strong> com <code>AbortController</code> e <code>AbortSignal.timeout(ms)</code>: o <code>fetch</code> e muitas bibliotecas aceitam um <code>signal</code>. Toda chamada de rede precisa de timeout.</li>
<li><strong>Worker threads</strong> para CPU pesada (gerar PDF grande, compactar, processar imagem) sem bloquear o event loop. Para casos simples, uma biblioteca de pool como <code>piscina</code>.</li>
<li><strong>AsyncLocalStorage</strong> para carregar o contexto da requisição (ID de correlação, usuário) através dos <code>await</code>.</li>
</ul>
`,
  code: [
    {
      t: "Condição de corrida entre awaits e correção no banco",
      src: `// ❌ Inseguro: entre o findUnique e o update, outra requisição pode atribuir a tarefa
async function pegarTarefa(tarefaId: string, usuarioId: string) {
  const t = await prisma.tarefa.findUnique({ where: { id: tarefaId } });
  if (t?.responsavelId) throw new RegraViolada("ja-atribuida", "Tarefa já tem responsável");
  await prisma.tarefa.update({ where: { id: tarefaId }, data: { responsavelId: usuarioId } });
}

// ✅ Seguro: a condição vai junto com a escrita, numa operação atômica do banco
async function pegarTarefaSeguro(tarefaId: string, usuarioId: string) {
  const r = await prisma.tarefa.updateMany({
    where: { id: tarefaId, responsavelId: null },
    data: { responsavelId: usuarioId },
  });
  if (r.count === 0) throw new RegraViolada("ja-atribuida", "Tarefa já tem responsável");
}
// Teste: dispare 50 chamadas com Promise.all para a mesma tarefa.
// A versão insegura costuma "aceitar" várias; a segura aceita exatamente uma.`,
    },
    {
      t: "Chamadas paralelas com timeout e limite de concorrência",
      src: `import pLimit from "p-limit";

type Painel = { projeto: Projeto; tarefas: Tarefa[]; membros: Membro[] };

async function montarPainel(projetoId: string): Promise<Painel> {
  const signal = AbortSignal.timeout(2_000); // nada espera para sempre
  // Latência total ≈ a chamada mais lenta, não a soma das três
  const [projeto, tarefas, membros] = await Promise.all([
    projetos.buscar(projetoId, { signal }),
    tarefas.abertas(projetoId, { signal }),
    membros.listar(projetoId, { signal }),
  ]);
  return { projeto, tarefas, membros };
}

// Notificar 10.000 pessoas sem derrubar o provedor de e-mail
const limite = pLimit(20); // no máximo 20 envios ao mesmo tempo
await Promise.allSettled(destinatarios.map((d) => limite(() => email.enviar(d))));`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Reproduza a condição de corrida do exemplo com 50 chamadas simultâneas e corrija de três formas: update condicional, locking otimista (coluna <code>version</code>) e <code>SELECT ... FOR UPDATE</code> numa transação. Compare." },
    { lvl: 2, text: "Implemente um <em>rate limiter</em> do tipo token bucket no Redis (para funcionar com várias instâncias) e teste com 10.000 requisições concorrentes." },
    { lvl: 2, text: "Mova uma tarefa de CPU pesada (por exemplo, gerar um hash Argon2 com parâmetros altos ou redimensionar imagens) para worker threads com <code>piscina</code>. Meça o atraso do event loop antes e depois." },
    { lvl: 3, text: "Compare uma API Node com 1, 2 e 4 processos (cluster ou réplicas atrás de um balanceador), chamando um serviço externo lento (200 ms) e fazendo um pouco de CPU. Meça throughput e explique onde o gargalo se moveu." },
  ],
  refs: [
    { t: "Node.js: Don't Block the Event Loop", u: "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" },
    { t: "Node.js: worker_threads", u: "https://nodejs.org/api/worker_threads.html" },
    { t: "Node.js: AsyncLocalStorage", u: "https://nodejs.org/api/async_context.html" },
    { t: "MDN: Promise.all e companhia", u: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise" },
    { t: "p-limit", u: "https://github.com/sindresorhus/p-limit" },
    { t: "Livro: Node.js Design Patterns, 4ª ed.", u: "https://www.nodejsdesignpatterns.com/", note: "capítulos de fluxo assíncrono e escalabilidade" },
  ],
});

/* ---------- Cloud providers e pipelines de CI/CD ---------- */

T({
  id: "cloud-fundamentos",
  phase: "p-cloud",
  title: "Fundamentos de cloud (AWS, Azure, GCP)",
  level: "Intermediário",
  hours: 25,
  summary: "Modelos de serviço, os blocos básicos de computação, armazenamento, rede e banco, e o caminho até o AWS Cloud Practitioner.",
  body: `
<p>Seu roadmap indica o <strong>AWS Certified Cloud Practitioner</strong> neste ponto. É uma certificação de entrada: não aprofunda arquitetura, mas dá o vocabulário de nuvem que toda conversa de arquitetura usa.</p>
<h3>Modelos de serviço</h3>
<ul>
<li><strong>IaaS</strong>: você recebe máquinas virtuais e redes (EC2). Controle total, mais operação.</li>
<li><strong>PaaS / contêineres gerenciados</strong>: você entrega a aplicação ou a imagem (ECS Fargate, Cloud Run, Azure Container Apps, e plataformas como Render e Fly.io).</li>
<li><strong>Serverless / FaaS</strong>: você entrega funções (Lambda).</li>
<li><strong>SaaS</strong>: você usa o produto pronto.</li>
</ul>
<p>Quanto mais gerenciado, menos operação e menos controle. O <strong>modelo de responsabilidade compartilhada</strong> define o que é seu (dados, identidades, configuração) e o que é do provedor (hardware, datacenter).</p>
<h3>Os blocos equivalentes nos três provedores</h3>
<table class="tbl"><thead><tr><th>Serviço</th><th>AWS</th><th>Azure</th><th>Google Cloud</th></tr></thead><tbody>
<tr><td>Máquinas virtuais</td><td>EC2</td><td>Virtual Machines</td><td>Compute Engine</td></tr>
<tr><td>Kubernetes</td><td>EKS</td><td>AKS</td><td>GKE</td></tr>
<tr><td>Funções</td><td>Lambda</td><td>Functions</td><td>Cloud Run functions</td></tr>
<tr><td>Armazenamento de objetos</td><td>S3</td><td>Blob Storage</td><td>Cloud Storage</td></tr>
<tr><td>Banco relacional</td><td>RDS / Aurora</td><td>Azure SQL / PostgreSQL</td><td>Cloud SQL / AlloyDB</td></tr>
<tr><td>NoSQL</td><td>DynamoDB</td><td>Cosmos DB</td><td>Firestore / Bigtable</td></tr>
<tr><td>Filas e eventos</td><td>SQS, SNS, EventBridge</td><td>Service Bus, Event Grid</td><td>Pub/Sub</td></tr>
<tr><td>Rede privada</td><td>VPC</td><td>Virtual Network</td><td>VPC</td></tr>
<tr><td>Identidade</td><td>IAM</td><td>Entra ID</td><td>Cloud IAM</td></tr>
<tr><td>Monitoramento</td><td>CloudWatch</td><td>Monitor</td><td>Cloud Monitoring</td></tr>
</tbody></table>
<h3>Conceitos que caem na prova e no trabalho</h3>
<p>Regiões e zonas de disponibilidade (base da alta disponibilidade), elasticidade, modelos de preço (sob demanda, reservado, spot, savings plans), IAM com menor privilégio, e o <strong>Well-Architected Framework</strong> com seus seis pilares.</p>
<div class="callout"><b>Cuidado com a fatura</b>Crie um alarme de orçamento (AWS Budgets) no primeiro dia da conta e desligue o que não estiver usando. Muita gente paga caro por um NAT Gateway ou um banco esquecido ligado.</div>
`,
  code: [
    {
      t: "Gravando no S3 com o AWS SDK para JavaScript v3",
      src: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Sem credenciais no código: o SDK descobre sozinho (role IAM do contêiner,
// variáveis de ambiente ou o perfil local do AWS CLI)
const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function salvarRelatorio(chave: string, pdf: Buffer): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET_RELATORIOS,
      Key: chave,
      Body: pdf,
      ContentType: "application/pdf",
      ServerSideEncryption: "AES256",
    }),
  );
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Crie uma conta AWS com MFA no root, usuário IAM para o dia a dia e alarme de orçamento de US$ 5." },
    { lvl: 1, text: "Faça o curso gratuito AWS Cloud Practitioner Essentials no AWS Skill Builder e agende a prova CLF-C02." },
    { lvl: 2, text: "Publique sua API NestJS no ECS Fargate (ou numa plataforma como Render ou Fly.io) com banco PostgreSQL gerenciado e arquivos no S3. Documente o custo mensal estimado." },
    { lvl: 3, text: "Desenhe a mesma arquitetura (API, banco, fila, armazenamento de arquivos) nos três provedores e compare custo e serviços gerenciados num ADR." },
  ],
  refs: [
    { t: "AWS Certified Cloud Practitioner", u: "https://aws.amazon.com/certification/certified-cloud-practitioner/", note: "recomendação do seu roadmap" },
    { t: "AWS Skill Builder (cursos gratuitos)", u: "https://skillbuilder.aws/" },
    { t: "AWS Well-Architected Framework", u: "https://aws.amazon.com/architecture/well-architected/" },
    { t: "AWS Shared Responsibility Model", u: "https://aws.amazon.com/compliance/shared-responsibility-model/" },
    { t: "AWS SDK for JavaScript v3", u: "https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/welcome.html" },
    { t: "roadmap.sh: AWS", u: "https://roadmap.sh/aws" },
  ],
});

T({
  id: "cicd-iac",
  phase: "p-cloud",
  title: "CI/CD, infraestrutura como código e cloud",
  level: "Intermediário",
  hours: 25,
  summary: "Pipelines, estratégias de deploy, métricas DORA, Twelve-Factor, Terraform e os pilares Well-Architected.",
  body: `
<h3>Entrega contínua</h3>
<p>Cada commit no trunk passa por um pipeline que verifica tipos, testa, analisa e gera um artefato implantável (a imagem Docker). A meta é que o deploy seja um evento entediante e frequente. As <strong>métricas DORA</strong> medem isso: frequência de deploy, lead time de mudança, taxa de falha de mudança e tempo de recuperação. A pesquisa do DORA mostra que velocidade e estabilidade andam juntas, não em oposição.</p>
<h3>Estratégias de deploy</h3>
<ul>
<li><strong>Rolling</strong>: troca instâncias aos poucos. Padrão do Kubernetes e do ECS.</li>
<li><strong>Blue/green</strong>: dois ambientes completos; troca o tráfego de uma vez; rollback instantâneo.</li>
<li><strong>Canary</strong>: libera para 1%, 5%, 25%... observando métricas. Ferramentas: Argo Rollouts, Flagger.</li>
<li><strong>Feature flags</strong>: separam <em>deploy</em> (código em produção) de <em>release</em> (funcionalidade ligada). OpenFeature é o padrão aberto.</li>
</ul>
<h3>Twelve-Factor App</h3>
<p>Doze práticas para aplicações nativas de nuvem: uma base de código, dependências explícitas, configuração no ambiente, serviços de apoio como recursos anexáveis, build/release/run separados, processos stateless, port binding, concorrência por processos, descartabilidade (startup rápido, shutdown gracioso), paridade entre ambientes, logs como fluxo de eventos, tarefas administrativas como processos pontuais.</p>
<h3>Infraestrutura como código e cloud</h3>
<p>Infraestrutura descrita em código versionado (Terraform/OpenTofu, Pulumi, AWS CDK): revisável, reproduzível e auditável. Pulumi e AWS CDK permitem escrever a infraestrutura em TypeScript, o que pode ser confortável para o seu time; Terraform é o mais difundido. Na nuvem, estude os <strong>pilares Well-Architected</strong> (excelência operacional, segurança, confiabilidade, eficiência de desempenho, otimização de custos, sustentabilidade). As certificações de arquiteto de solução de AWS, Azure ou GCP são um bom roteiro estruturado e têm peso no mercado.</p>
<div class="callout"><b>Custo é característica de arquitetura.</b> O FinOps trata custo de nuvem como responsabilidade de engenharia. Um arquiteto fora da curva sabe quanto sua arquitetura custa por mês e por transação.</div>
`,
  code: [
    {
      t: "Pipeline GitHub Actions",
      src: `name: ci
on: { push: { branches: [main] }, pull_request: {} }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: 24, cache: npm }
      - run: npm ci
      - name: Lint, tipos e regras de arquitetura
        run: npm run lint && npx tsc --noEmit && npx depcruise src
      - name: Testes unitários e de integração (Testcontainers usa o Docker do runner)
        run: npm test
      - name: Vulnerabilidades em dependências
        run: npm audit --omit=dev --audit-level=high
      - name: Imagem
        if: github.ref == 'refs/heads/main'
        run: |
          echo "\${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u \${{ github.actor }} --password-stdin
          docker build -t ghcr.io/\${{ github.repository }}:\${{ github.sha }} .
          docker push ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
    },
    {
      t: "Terraform: banco gerenciado",
      src: `resource "aws_db_instance" "tarefas" {
  identifier              = "tarefas-prod"
  engine                  = "postgres"
  engine_version          = "17"
  instance_class          = "db.t4g.medium"
  allocated_storage       = 50
  multi_az                = true            # disponibilidade
  backup_retention_period = 14              # recuperabilidade
  storage_encrypted       = true            # segurança
  deletion_protection     = true
  username                = "app"
  manage_master_user_password = true        # senha no Secrets Manager
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Crie um pipeline completo no GitHub Actions para seu projeto: lint, verificação de tipos, testes, regras do dependency-cruiser, análise de dependências e publicação de imagem." },
    { lvl: 2, text: "Implemente um canary com Argo Rollouts num cluster kind, com rollback automático baseado em taxa de erro do Prometheus." },
    { lvl: 2, text: "Avalie um projeto seu contra os 12 fatores e corrija os 3 piores." },
    { lvl: 3, text: "Provisione com Terraform (ou Pulumi em TypeScript) a infraestrutura do projeto (rede, ECS, banco, Redis) e estime o custo mensal com a calculadora da AWS. Escreva um ADR com as decisões de custo." },
  ],
  refs: [
    { t: "The Twelve-Factor App", u: "https://12factor.net/pt_br/" },
    { t: "DORA: State of DevOps e métricas", u: "https://dora.dev/" },
    { t: "GitHub Actions: Building and testing Node.js", u: "https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs" },
    { t: "Livro: Accelerate (Forsgren, Humble, Kim)", u: "https://itrevolution.com/product/accelerate/" },
    { t: "Livro: Continuous Delivery (Humble & Farley)", u: "https://continuousdelivery.com/" },
    { t: "AWS Well-Architected Framework", u: "https://aws.amazon.com/architecture/well-architected/" },
    { t: "OpenTofu / Terraform", u: "https://opentofu.org/docs/" },
    { t: "Pulumi: infraestrutura em TypeScript", u: "https://www.pulumi.com/docs/" },
    { t: "OpenFeature", u: "https://openfeature.dev/" },
    { t: "FinOps Foundation", u: "https://www.finops.org/introduction/what-is-finops/" },
  ],
});
