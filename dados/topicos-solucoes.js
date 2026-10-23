/* Arquiteto de Soluções */

/* ---------- Requisitos não funcionais: capacidade e escala ---------- */

T({
  id: "capacidade",
  phase: "p-nfr",
  title: "Planejamento de capacidade",
  level: "Avançado",
  hours: 15,
  summary: "Latência vs. throughput, cálculo de carga (RPS), concorrência simultânea, utilização e saturação de recursos e taxa de erros.",
  body: `
<p>É o primeiro bloco dos Requisitos Não Funcionais no seu mapa. Planejar capacidade é responder com números: quantos usuários, quantas requisições, quanta máquina, quanto custa, e com que margem.</p>
<h3>Latência vs. throughput</h3>
<p><strong>Latência</strong>: quanto tempo uma requisição leva (meça em percentis: p50, p95, p99). <strong>Throughput</strong>: quantas requisições por segundo o sistema processa. Os dois se relacionam: perto da saturação, aumentar o throughput faz a latência explodir, porque as filas crescem de forma não linear.</p>
<h3>Calcular a carga (RPS)</h3>
<p>Parta do negócio: 2 milhões de usuários ativos por dia × 15 requisições cada = 30 milhões/dia. Dia ≈ 86.400 s → ~350 RPS em média. O tráfego não é uniforme: aplique um fator de pico (3x a 10x conforme o negócio; Black Friday pode ser 20x) → planeje para ~3.500 RPS.</p>
<h3>Calcular a concorrência simultânea</h3>
<p><strong>Lei de Little</strong>: concorrência = RPS × tempo de resposta. 3.500 RPS × 0,2 s = 700 requisições em andamento. Isso dimensiona conexões de banco, instâncias e, no Node, quantas requisições cada processo segura ao mesmo tempo esperando E/S.</p>
<h3>Utilização e saturação de recursos (método USE)</h3>
<p>Para cada recurso (CPU, memória, disco, rede, pool de conexões, event loop): <strong>U</strong>tilização (quanto está ocupado), <strong>S</strong>aturação (quanto trabalho está esperando na fila), <strong>E</strong>rros. Mire em até ~60–70% de utilização no pico para ter folga para falhas de instância e crescimento. No Node, o atraso do event loop é o melhor sinal de saturação da CPU de um processo.</p>
<h3>Taxa de erros</h3>
<p>Parte do SLO: "menos de 0,1% de respostas 5xx". Sob sobrecarga, erros aumentam antes da queda total; monitorar a taxa de erro junto com a latência mostra a saturação chegando.</p>
`,
  code: [
    {
      t: "Planilha de capacidade em código",
      src: `type Premissas = {
  usuariosDia: number;
  reqPorUsuario: number;
  fatorPico: number;
  latenciaSeg: number;
  rpsPorInstancia: number; // medido com teste de carga, não chutado
  utilizacaoAlvo: number;
};

function planejar(p: Premissas) {
  const rpsMedio = (p.usuariosDia * p.reqPorUsuario) / 86_400;
  const rpsPico = rpsMedio * p.fatorPico;
  const concorrencia = rpsPico * p.latenciaSeg;                            // lei de Little
  const instancias = Math.ceil(rpsPico / (p.rpsPorInstancia * p.utilizacaoAlvo));
  const comRedundancia = instancias + 1;                                   // N+1: suporta perder uma
  console.table({ rpsMedio, rpsPico, concorrencia, instancias, comRedundancia });
}

planejar({ usuariosDia: 2_000_000, reqPorUsuario: 15, fatorPico: 10,
           latenciaSeg: 0.2, rpsPorInstancia: 400, utilizacaoAlvo: 0.65 });
// rpsMedio: 347 | rpsPico: 3472 | concorrencia: 694 | instancias: 14 | comRedundancia: 15`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Calcule RPS médio, de pico e concorrência para 3 sistemas: app de banco (5 mi usuários), venda de ingressos (200 mil pessoas em 10 min) e intranet (2 mil funcionários)." },
    { lvl: 2, text: "Descubra o <code>rpsPorInstancia</code> real da sua API com k6 (o ponto em que o p99 passa do SLO) e refaça o plano com o número medido." },
    { lvl: 3, text: "Escreva um documento de capacidade para o projeto da trilha: premissas, cálculos, recursos (API, worker, banco, Redis), custo mensal e gatilhos para revisar o plano." },
  ],
  refs: [
    { t: "Brendan Gregg: The USE Method", u: "https://www.brendangregg.com/usemethod.html" },
    { t: "Google SRE Book: Handling Overload", u: "https://sre.google/sre-book/handling-overload/" },
    { t: "Little's Law (explicação)", u: "https://en.wikipedia.org/wiki/Little%27s_law" },
    { t: "k6: tipos de teste de carga", u: "https://grafana.com/docs/k6/latest/testing-guides/test-types/" },
    { t: "Livro: The Art of Capacity Planning, 2ª ed. (Arun Kejariwal, John Allspaw)", u: "https://www.oreilly.com/library/view/the-art-of/9781491939154/" },
  ],
});

T({
  id: "escalabilidade",
  phase: "p-nfr",
  title: "Escalabilidade: vertical, horizontal e elasticidade",
  level: "Avançado",
  hours: 20,
  summary: "Escala vertical e horizontal, serviços stateless, balanceamento, filas, rate limiting e lei de Little.",
  body: `
<h3>Os dois eixos</h3>
<p><strong>Vertical</strong>: máquina maior. Simples, tem teto e ponto único de falha. E no Node há um detalhe: um processo usa um núcleo para o seu JavaScript, então uma máquina com 8 núcleos e um processo só desperdiça 7. <strong>Horizontal</strong>: mais instâncias (ou mais processos por máquina). Exige que o serviço seja <strong>stateless</strong>: sessão, uploads, caches compartilhados e contadores ficam fora da instância (Redis, S3, banco).</p>
<h3>Ferramentas de escala</h3>
<ul>
<li><strong>Balanceamento de carga</strong>: round robin, least connections, consistent hashing (para afinidade de cache). Camada 4 vs. camada 7.</li>
<li><strong>Filas para nivelar picos</strong>: aceite a requisição, enfileire e processe no ritmo que o sistema aguenta (queue-based load leveling).</li>
<li><strong>Rate limiting</strong>: token bucket, sliding window. Protege o sistema de abuso e de clientes defeituosos. Responda 429 com <code>Retry-After</code>. Com várias instâncias, o contador precisa ficar no Redis.</li>
<li><strong>Backpressure</strong>: o consumidor sinaliza que está sobrecarregado em vez de aceitar tudo e cair. Os streams do Node têm backpressure embutido.</li>
<li><strong>CDN</strong> para conteúdo estático e até respostas de API cacheáveis.</li>
<li><strong>Autoscaling</strong> por CPU, latência ou tamanho de fila (KEDA no Kubernetes, políticas de target tracking no ECS).</li>
</ul>
<h3>Lei de Little: a conta que todo arquiteto deve saber</h3>
<p><strong>L = λ × W</strong>. Itens no sistema = taxa de chegada × tempo no sistema. Se chegam 1.000 req/s e cada uma leva 200 ms, há em média 200 requisições em andamento. Daí sai o tamanho de pools de conexões. Se o banco começar a demorar 2 s, você passa a ter 2.000 requisições penduradas, consumindo memória e conexões: é assim que uma lentidão vira uma queda.</p>
<h3>Desempenho: meça, não adivinhe</h3>
<p>Olhe percentis (p50, p95, p99), nunca a média: a média esconde os usuários que estão sofrendo. Use testes de carga (k6, autocannon) com cenários realistas e perfis de CPU (<code>--cpu-prof</code>, Chrome DevTools) para achar gargalos.</p>

<h3>Gargalos (bottlenecks)</h3>
<p>Escalar uma parte só move o gargalo para a próxima. Antes de adicionar instâncias, descubra o recurso saturado (CPU, event loop, banco, pool de conexões, serviço externo) com métricas USE. Muitas vezes o gargalo é o banco, e a resposta é cache, réplicas de leitura ou filas, não mais servidores de aplicação.</p>`,
  code: [
    {
      t: "Rate limiting distribuído com Redis num guard do NestJS",
      src: `@Injectable()
export class LimitePorUsuario implements CanActivate {
  constructor(private readonly redis: Redis) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { usuarioId?: string }>();
    const res = ctx.switchToHttp().getResponse<Response>();
    const janela = Math.floor(Date.now() / 60_000);            // janela fixa de 1 minuto
    const chave = "rl:" + (req.usuarioId ?? req.ip) + ":" + janela;

    const [[, usadas]] = (await this.redis.multi().incr(chave).expire(chave, 60).exec()) as [[null, number], unknown];
    const limite = 100;
    res.setHeader("X-RateLimit-Remaining", Math.max(0, limite - usadas));
    if (usadas <= limite) return true;

    res.setHeader("Retry-After", 60 - Math.floor((Date.now() / 1000) % 60));
    throw new HttpException("Muitas requisições", 429);
  }
}
// Vale para o usuário mesmo com 10 instâncias da API, porque o contador está no Redis.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Rode 3 instâncias da sua API atrás de um Nginx e prove que ela é stateless (derrube uma no meio de um teste de carga)." },
    { lvl: 2, text: "Use a lei de Little para dimensionar o pool de conexões do banco de um serviço com 800 req/s e consultas de 15 ms, somando todas as instâncias. Valide com teste de carga." },
    { lvl: 2, text: "Troque a janela fixa do exemplo por uma janela deslizante (sorted set no Redis ou um script Lua) e prove que o limite vale para o usuário mesmo com 3 instâncias." },
    { lvl: 3, text: "Faça um teste de carga com k6 que encontre o ponto de saturação do seu sistema. Identifique o gargalo com perfis de CPU e métricas USE e escreva um relatório de capacidade." },
  ],
  refs: [
    { t: "The System Design Primer (Donne Martin)", u: "https://github.com/donnemartin/system-design-primer" },
    { t: "NestJS: Rate limiting", u: "https://docs.nestjs.com/security/rate-limiting" },
    { t: "k6", u: "https://grafana.com/docs/k6/latest/" },
    { t: "Node.js: profiling de aplicações", u: "https://nodejs.org/en/learn/getting-started/profiling" },
    { t: "Brendan Gregg: USE Method", u: "https://www.brendangregg.com/usemethod.html" },
    { t: "Livro: Systems Performance, 2ª ed. (Brendan Gregg)", u: "https://www.brendangregg.com/systems-performance-2nd-edition-book.html" },
  ],
});

T({
  id: "dados-escala",
  phase: "p-nfr",
  title: "Banco de dados e estratégia de leitura: replicação e sharding",
  level: "Avançado",
  hours: 25,
  summary: "Líder-seguidor, multi-líder, sem líder, sharding, NoSQL vs. relacional e persistência poliglota.",
  body: `
<h3>Replicação</h3>
<table class="tbl"><thead><tr><th>Modelo</th><th>Como funciona</th><th>Trade-off</th></tr></thead><tbody>
<tr><td>Líder único</td><td>Escritas no líder, réplicas seguem (PostgreSQL, MySQL)</td><td>Simples; réplicas atrasam (replication lag) e o líder limita a escrita</td></tr>
<tr><td>Multi-líder</td><td>Vários aceitam escrita (multi-região, offline-first)</td><td>Conflitos de escrita precisam ser resolvidos</td></tr>
<tr><td>Sem líder</td><td>Escritas e leituras com quórum (Cassandra, DynamoDB)</td><td>Alta disponibilidade; consistência ajustável por W + R &gt; N</td></tr>
</tbody></table>
<p><strong>Replication lag na prática:</strong> o usuário renomeia o projeto, a página recarrega lendo de uma réplica atrasada e mostra o nome antigo. Soluções: ler do líder logo após escrever, ou rotear leituras do próprio usuário para o líder por alguns segundos.</p>
<h3>Particionamento (sharding)</h3>
<p>Divide os dados entre nós. Por <strong>faixa de chave</strong> (bom para consultas por intervalo, risco de hot spots) ou por <strong>hash</strong> (distribui bem, perde ordenação). O problema difícil é escolher a chave: tudo que precisa ser consultado junto deve ficar na mesma partição. Num SaaS como o do projeto, a chave natural é a organização (tenant). Rebalancear depois é caro.</p>
<h3>Escolhendo o banco</h3>
<table class="tbl"><thead><tr><th>Tipo</th><th>Exemplos</th><th>Quando</th></tr></thead><tbody>
<tr><td>Relacional</td><td>PostgreSQL, MySQL</td><td>Padrão. Transações, joins, integridade. Comece aqui.</td></tr>
<tr><td>Documento</td><td>MongoDB</td><td>Agregados lidos inteiros, schema variável</td></tr>
<tr><td>Chave-valor</td><td>Redis, DynamoDB</td><td>Acesso por chave, cache, sessão, latência mínima</td></tr>
<tr><td>Wide-column</td><td>Cassandra, ScyllaDB</td><td>Escrita massiva, séries, multi-região</td></tr>
<tr><td>Grafo</td><td>Neo4j</td><td>Relacionamentos são a consulta (fraude, recomendação)</td></tr>
<tr><td>Busca</td><td>OpenSearch, Elasticsearch</td><td>Texto livre, facetas, relevância</td></tr>
<tr><td>Séries temporais</td><td>TimescaleDB, InfluxDB</td><td>Métricas, IoT</td></tr>
</tbody></table>
<div class="callout"><b>Regra prática:</b> PostgreSQL resolve muito mais do que parece (JSONB, busca textual, filas com SKIP LOCKED, extensões como pgvector para busca semântica e TimescaleDB). Adicionar um banco novo é adicionar um sistema para operar, monitorar, fazer backup e ensinar ao time. Exija um motivo forte.</div>
`,
  code: [
    {
      t: "Roteamento de leitura e escrita com dois clientes",
      src: `// db.ts — um cliente para o primário, outro para a réplica
export const primario = criarPrisma(process.env.DATABASE_URL!);
export const replica = criarPrisma(process.env.DATABASE_REPLICA_URL ?? process.env.DATABASE_URL!);

// Consultas que toleram alguns segundos de atraso vão para a réplica
export function listarProjetos(organizacaoId: string) {
  return replica.projeto.findMany({ where: { organizacaoId }, orderBy: { nome: "asc" } });
}

// Depois de uma escrita, leia do primário (read-your-writes)
export async function renomear(id: string, nome: string) {
  await primario.projeto.update({ where: { id }, data: { nome } });
  return primario.projeto.findUniqueOrThrow({ where: { id } });
}
// Cuidado: transações SEMPRE no primário; a réplica é só leitura.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Suba PostgreSQL com uma réplica via Docker Compose (replicação por streaming). Escreva no primário e meça o atraso de leitura na réplica." },
    { lvl: 2, text: "Modele as tabelas de um chat (mensagens por conversa) para Cassandra, escolhendo partition key e clustering key. Explique o que acontece com conversas muito ativas." },
    { lvl: 3, text: "Projete o particionamento de um sistema multi-tenant com 10.000 clientes, sendo 5 deles responsáveis por 60% do volume. Compare shard por tenant, por hash e híbrido." },
  ],
  refs: [
    { t: "Livro: Designing Data-Intensive Applications, 2ª ed., capítulos de replicação e particionamento", u: "https://dataintensive.net/" },
    { t: "Livro: NoSQL Distilled (Sadalage & Fowler)", u: "https://martinfowler.com/books/nosql.html" },
    { t: "Amazon DynamoDB paper (2007)", u: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" },
    { t: "PostgreSQL: High Availability, Load Balancing, and Replication", u: "https://www.postgresql.org/docs/current/high-availability.html" },
    { t: "Livro: Database Internals (Alex Petrov)", u: "https://www.databass.dev/" },
  ],
});

T({
  id: "antipatterns",
  phase: "p-nfr",
  title: "Anti-padrões de performance",
  level: "Avançado",
  hours: 12,
  summary: "Busy Database, Instanciação Imprópria, Persistência Monolítica, Noisy Neighbor, Retry Storm e No Caching: como reconhecer e corrigir.",
  body: `
<p>Seu roadmap lista seis anti-padrões que vêm do catálogo do Azure Architecture Center. Eles aparecem em qualquer nuvem e em qualquer linguagem; reconhecê-los num incidente economiza horas.</p>
<dl class="defs">
<dt>Busy Database</dt><dd>Lógica de negócio pesada dentro do banco (procedures enormes, formatação de dados, cálculos) num recurso que é caro de escalar. <em>Correção</em>: mova o processamento para a camada de aplicação, que escala horizontalmente; deixe o banco fazer o que faz bem.</dd>
<dt>Instanciação imprópria (Improper Instantiation)</dt><dd>Criar a cada requisição objetos feitos para serem reutilizados: <code>PrismaClient</code>, <code>pg.Pool</code>, conexões Redis, clientes do SDK da AWS ou de IA. Esgota conexões, sockets e memória. <em>Correção</em>: uma instância por processo, criada na inicialização e injetada (providers singleton do NestJS).</dd>
<dt>Persistência monolítica (Monolithic Persistence)</dt><dd>Um único banco para dados com padrões de acesso muito diferentes (transações, logs, sessões, arquivos, busca). Um tipo de carga derruba os outros. <em>Correção</em>: separe por padrão de uso (relacional, cache, object storage, busca).</dd>
<dt>Noisy Neighbor</dt><dd>Em sistemas compartilhados, um cliente (tenant) ou processo consome recursos demais e prejudica todos. <em>Correção</em>: limites e cotas por tenant, rate limiting, bulkheads, isolar tenants grandes.</dd>
<dt>Retry Storm</dt><dd>Clientes repetindo imediatamente chamadas a um serviço que já está sobrecarregado, multiplicando a carga e impedindo a recuperação. <em>Correção</em>: backoff exponencial com jitter, limite de tentativas, circuit breaker, orçamento de retries.</dd>
<dt>No Caching</dt><dd>Buscar repetidamente na origem dados que mudam pouco. <em>Correção</em>: cache-aside com TTL adequado, cache HTTP e CDN.</dd>
</dl>
<p>O catálogo completo inclui outros, como <em>Chatty I/O</em>, <em>Extraneous Fetching</em> e <em>Synchronous I/O</em>. No Node, o equivalente do Synchronous I/O é usar as versões <code>Sync</code> (<code>readFileSync</code>, <code>execSync</code>) dentro de uma requisição: bloqueia o event loop inteiro.</p>
`,
  code: [
    {
      t: "Instanciação imprópria e a correção",
      src: `// ERRADO: um pool de conexões novo a cada requisição
@Get("projetos/:id")
async buscar(@Param("id") id: string) {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  return prisma.projeto.findUnique({ where: { id } });
  // e ninguém chama $disconnect: as conexões vazam até o banco recusar novas
}

// CERTO: um cliente por processo, criado uma vez e injetado
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({ adapter: new PrismaPg({ connectionString: config.getOrThrow("DATABASE_URL") }) });
  }
  onModuleInit() { return this.$connect(); }
  onModuleDestroy() { return this.$disconnect(); }
}`,
    },
    {
      t: "Evitando retry storm com cockatiel",
      src: `import {
  ExponentialBackoff, ConsecutiveBreaker, handleWhen, retry, circuitBreaker, wrap,
} from "cockatiel";

const transitorio = handleWhen((e) => e instanceof FalhaRemota && e.status >= 500);

// backoff exponencial com jitter (o padrão do ExponentialBackoff), no máximo 3 tentativas
const comRetry = retry(transitorio, { maxAttempts: 3, backoff: new ExponentialBackoff() });

// se o serviço está doente, pare de insistir por 10 s
const disjuntor = circuitBreaker(transitorio, {
  halfOpenAfter: 10_000,
  breaker: new ConsecutiveBreaker(5),
});

const politica = wrap(comRetry, disjuntor);
const cotacao = await politica.execute(() => cotacoes.buscar("USD"));`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Para cada anti-padrão, escreva um exemplo em TypeScript ou SQL que o causa e a versão corrigida." },
    { lvl: 2, text: "Reproduza um retry storm: 3 instâncias chamando um serviço lento com retry imediato. Meça a carga no serviço e repita com backoff, jitter e circuit breaker." },
    { lvl: 3, text: "Analise um sistema que você conhece procurando os seis anti-padrões e escreva um relatório priorizado com evidências e correções." },
  ],
  refs: [
    { t: "Azure Architecture Center: Performance antipatterns", u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/", note: "a origem dos itens do seu roadmap" },
    { t: "Busy Database antipattern", u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/busy-database/" },
    { t: "Retry Storm antipattern", u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/retry-storm/" },
    { t: "Noisy Neighbor antipattern", u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/noisy-neighbor/noisy-neighbor" },
    { t: "AWS Builders' Library: Timeouts, retries and backoff with jitter", u: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" },
    { t: "cockatiel: políticas de resiliência para JS/TS", u: "https://github.com/connor4312/cockatiel" },
  ],
});

/* ---------- Consistência de dados ---------- */

T({
  id: "distribuidos",
  phase: "p-consist",
  title: "Consistência de dados: CAP, PACELC e ACID vs BASE",
  level: "Avançado",
  hours: 30,
  summary: "CAP, PACELC, modelos de consistência, relógios, falhas parciais e consenso.",
  body: `
<p>Um sistema distribuído é aquele em que a falha de um computador que você nem sabia que existia pode tornar o seu computador inutilizável (Leslie Lamport). Tudo que você aprendeu sobre concorrência continua valendo, mais um problema novo: <strong>falhas parciais</strong>. Uma chamada sem resposta pode ter falhado, ter sucedido, ou ainda estar em andamento. Você não sabe.</p>
<h3>CAP e PACELC</h3>
<p>O teorema CAP diz que, durante uma <strong>partição de rede</strong>, um sistema precisa escolher entre <strong>consistência</strong> (todos veem o mesmo dado) e <strong>disponibilidade</strong> (todos recebem resposta). O PACELC completa: se há Partição, escolha entre A e C; <strong>senão (Else)</strong>, escolha entre <strong>Latência</strong> e <strong>Consistência</strong>. Essa segunda metade é a decisão que você toma todos os dias, porque partições são raras e latência é constante.</p>
<h3>Modelos de consistência (do mais forte ao mais fraco)</h3>
<ul>
<li><strong>Linearizabilidade</strong>: o sistema se comporta como uma única cópia. Caro.</li>
<li><strong>Serializabilidade</strong>: transações parecem executar uma após a outra.</li>
<li><strong>Consistência causal</strong>: efeitos nunca aparecem antes das causas.</li>
<li><strong>Read-your-writes</strong>: você sempre vê o que você mesmo escreveu.</li>
<li><strong>Eventual</strong>: se as escritas pararem, as réplicas convergem. Sem prazo garantido.</li>
</ul>
<h3>Tempo é uma ilusão</h3>
<p>Relógios de máquinas diferentes divergem. Nunca use o timestamp do relógio de parede para decidir qual escrita é a mais recente entre máquinas (last-write-wins perde dados silenciosamente). Use relógios lógicos (Lamport), vector clocks, ou números de versão gerados por uma fonte única.</p>
<h3>Consenso</h3>
<p>Como várias máquinas concordam sobre um valor (quem é o líder, qual é a ordem das operações) mesmo com falhas? Algoritmos como <strong>Raft</strong> e Paxos. Você não vai implementá-los em produção, mas eles estão dentro do etcd (Kubernetes), do Kafka (KRaft) e do ZooKeeper. Entendê-los explica por que esses sistemas precisam de número ímpar de nós e maioria (quórum) para funcionar.</p>

<h3>ACID vs BASE</h3>
<p><strong>ACID</strong> (Atomicidade, Consistência, Isolamento, Durabilidade) é o modelo dos bancos relacionais: transações corretas, ao custo de coordenação. <strong>BASE</strong> (Basically Available, Soft state, Eventual consistency) é o modelo de muitos sistemas distribuídos e NoSQL: disponível e escalável, aceitando que as réplicas fiquem temporariamente diferentes. Sistemas reais misturam os dois: ACID dentro de um serviço, BASE entre serviços.</p>`,
  code: [
    {
      t: "Relógio de Lamport",
      src: `export class RelogioLamport {
  #tempo = 0;

  // evento local ou envio de mensagem
  tick(): number {
    return ++this.#tempo;
  }

  // ao receber uma mensagem com o carimbo do remetente
  receber(carimboRemoto: number): number {
    this.#tempo = Math.max(this.#tempo, carimboRemoto) + 1;
    return this.#tempo;
  }
}
// Garante: se A causou B, então L(A) < L(B).
// Não garante o inverso: L(A) < L(B) não implica causalidade.
// (Numa thread só não precisa de atomics; entre processos, cada um tem o seu relógio.)`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Para 5 sistemas (banco, rede social, carrinho de compras, DNS, placar de jogo ao vivo), diga qual escolha PACELC você faria e por quê." },
    { lvl: 2, text: "Implemente vector clocks em TypeScript e simule três réplicas trocando mensagens. Detecte escritas concorrentes." },
    { lvl: 2, text: "Faça os laboratórios do <strong>Gossip Glomers</strong> (Fly.io + Jepsen Maelstrom) em TypeScript: echo, unique IDs, broadcast e contador grow-only." },
    { lvl: 3, text: "Leia o paper do Raft e implemente eleição de líder (sem replicação de log) com 5 nós simulados, injetando falhas e partições." },
  ],
  refs: [
    { t: "Livro: Designing Data-Intensive Applications, 2ª ed. (Kleppmann & Riccomini, 2026)", u: "https://www.oreilly.com/library/view/-/9781098119058", note: "o livro mais importante desta fase; prefira a 2ª edição" },
    { t: "Martin Kleppmann: curso de Sistemas Distribuídos de Cambridge (vídeos gratuitos)", u: "https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB" },
    { t: "The Raft Consensus Algorithm (visualização interativa)", u: "https://raft.github.io/" },
    { t: "Fly.io Gossip Glomers", u: "https://fly.io/dist-sys/" },
    { t: "Jepsen: análises de bancos sob falha", u: "https://jepsen.io/analyses" },
    { t: "Daniel Abadi: Consistency Tradeoffs in Modern Distributed Database System Design (PACELC)", u: "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf" },
  ],
});

T({
  id: "saga-outbox",
  phase: "p-consist",
  title: "Idempotência, Sagas e Outbox",
  level: "Avançado",
  hours: 25,
  summary: "Como manter dados corretos sem transação distribuída: Transactional Outbox, CDC, sagas e compensações.",
  body: `
<p>Cada serviço tem seu banco. Então como fazer "reservar estoque, cobrar e criar o envio" de forma confiável? Transações distribuídas (2PC) existem, mas bloqueiam recursos, não escalam e muitos brokers nem suportam. A resposta da indústria são <strong>sagas</strong>.</p>
<h3>Transactional Outbox</h3>
<p>Primeiro, resolva o <em>dual write</em>: salvar no banco e publicar na fila são duas operações; se a segunda falhar, o sistema fica inconsistente. Com o outbox, você grava o evento numa tabela <code>outbox</code> <strong>na mesma transação</strong> do dado de negócio. Um processo separado lê essa tabela e publica no broker. Duas formas de ler:</p>
<ul>
<li><strong>Polling</strong>: um job consulta a tabela periodicamente com <code>FOR UPDATE SKIP LOCKED</code>. Simples.</li>
<li><strong>CDC (Change Data Capture)</strong>: o <strong>Debezium</strong> lê o write-ahead log do banco e publica. Menor latência, sem carga de consulta.</li>
</ul>
<h3>Sagas</h3>
<p>Uma saga é uma sequência de transações locais. Se uma etapa falha, executam-se <strong>transações de compensação</strong> para desfazer as anteriores (estornar o pagamento, liberar o estoque). Compensação não é rollback: o pagamento aconteceu e o estorno é um novo fato visível.</p>
<ul>
<li><strong>Coreografada</strong>: cada serviço reage a eventos e publica o próximo. Boa para fluxos curtos.</li>
<li><strong>Orquestrada</strong>: um orquestrador envia comandos e decide os próximos passos. Melhor para fluxos longos e com muitos caminhos de erro.</li>
</ul>
<h3>Desenhe pensando em falhas</h3>
<p>Classifique as etapas: <em>compensáveis</em> (podem ser desfeitas), o <em>pivô</em> (ponto sem volta) e <em>repetíveis</em> (depois do pivô, precisam eventualmente ter sucesso). Coloque o que mais falha antes do pivô. Considere também o isolamento: outras transações podem ver estados intermediários; use estados semânticos como <code>PENDENTE</code>.</p>
`,
  code: [
    {
      t: "Gravando no outbox na mesma transação",
      src: `async function convidarMembro(cmd: ConviteCmd) {
  return prisma.$transaction(async (tx) => {
    const convite = await tx.convite.create({
      data: { projetoId: cmd.projetoId, email: cmd.email, papel: cmd.papel },
    });
    await tx.outbox.create({
      data: {
        id: randomUUID(),
        agregado: "Projeto",
        agregadoId: cmd.projetoId,          // vira a chave da mensagem (ordenação)
        tipo: "MembroConvidado",
        payload: { conviteId: convite.id, email: cmd.email },
      },
    });
    return convite;
  });
  // COMMIT: ou os dois existem, ou nenhum.
}

// Worker: publica o que está pendente, em lotes
const pendentes = await prisma.$queryRaw<OutboxRow[]>\`
  SELECT * FROM outbox WHERE publicado_em IS NULL
  ORDER BY criado_em LIMIT 100 FOR UPDATE SKIP LOCKED\`;`,
    },
    {
      t: "Saga orquestrada com Temporal (TypeScript SDK)",
      src: `// workflows.ts — o Temporal persiste cada passo e retoma de onde parou se o worker cair
import { proxyActivities } from "@temporalio/workflow";
import type * as atividades from "./atividades.js";

const atv = proxyActivities<typeof atividades>({ startToCloseTimeout: "30 seconds" });

export async function checkout(c: Checkout): Promise<void> {
  const compensacoes: Array<() => Promise<void>> = [];
  try {
    await atv.reservarEstoque(c);
    compensacoes.unshift(() => atv.liberarEstoque(c));

    await atv.cobrar(c);                       // pivô
    compensacoes.unshift(() => atv.estornar(c));

    await atv.criarEnvio(c);                   // repetível: o Temporal faz retry
  } catch (erro) {
    for (const compensar of compensacoes) await compensar(); // ordem inversa
    throw erro;
  }
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Implemente outbox com polling (um job repetido do BullMQ + <code>SKIP LOCKED</code>) publicando numa fila. Derrube a fila e prove que nenhum evento se perde." },
    { lvl: 2, text: "Substitua o polling por Debezium (Kafka Connect) lendo o WAL do PostgreSQL. Compare latência e complexidade operacional." },
    { lvl: 2, text: "Implemente a saga de checkout coreografada com 3 serviços e simule falha em cada etapa. Desenhe o diagrama de estados de cada caso." },
    { lvl: 3, text: "Implemente a mesma saga orquestrada com Temporal. Escreva um ADR comparando as duas implementações com base no que você viveu." },
  ],
  refs: [
    { t: "microservices.io: Saga", u: "https://microservices.io/patterns/data/saga.html" },
    { t: "microservices.io: Transactional Outbox", u: "https://microservices.io/patterns/data/transactional-outbox.html" },
    { t: "Debezium: Outbox Event Router", u: "https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html" },
    { t: "Paper original: Sagas (Garcia-Molina & Salem, 1987)", u: "https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf" },
    { t: "Temporal: TypeScript SDK", u: "https://docs.temporal.io/develop/typescript" },
    { t: "Pat Helland: Life Beyond Distributed Transactions", u: "https://queue.acm.org/detail.cfm?id=3025012" },
  ],
});

T({
  id: "cqrs-es",
  phase: "p-consist",
  title: "CQRS e Event Sourcing",
  level: "Avançado",
  hours: 20,
  summary: "Separar leitura de escrita, guardar o histórico como fonte da verdade, projeções e quando não usar.",
  body: `
<h3>CQRS</h3>
<p><strong>Command Query Responsibility Segregation</strong>: o modelo que processa comandos (escrita, com regras e invariantes) é separado do modelo que atende consultas (leitura, otimizado para cada tela). Em níveis crescentes:</p>
<ol>
<li>Classes separadas no mesmo banco (comandos usam agregados; consultas usam SQL ou <code>select</code> direto, sem passar pelo domínio).</li>
<li>Tabelas de leitura desnormalizadas atualizadas por eventos.</li>
<li>Bancos diferentes (PostgreSQL para escrita, OpenSearch para busca).</li>
</ol>
<p>O nível 1 é barato e quase sempre vale a pena. Os níveis 2 e 3 trazem consistência eventual entre escrita e leitura.</p>
<h3>Event Sourcing</h3>
<p>Em vez de guardar o estado atual, guarda-se a <strong>sequência de eventos</strong> que levou a ele. O estado é recalculado aplicando os eventos. Um extrato bancário é event sourcing: o saldo é a soma das transações.</p>
<p><strong>Ganhos:</strong> auditoria completa, reconstruir o estado em qualquer momento do passado, criar novas projeções retroativamente, depurar reproduzindo eventos.</p>
<p><strong>Custos:</strong> evolução de eventos (o evento de 2024 precisa ser legível em 2030), snapshots para agregados longos, consultas exigem projeções, curva de aprendizado alta, e GDPR/LGPD (como apagar dados pessoais de um log imutável? Técnica: <em>crypto-shredding</em>).</p>
<div class="callout"><b>Use com critério:</b> Greg Young, que popularizou o padrão, insiste que event sourcing deve ser aplicado em partes específicas do sistema onde o histórico tem valor de negócio, nunca no sistema inteiro.</div>
`,
  code: [
    {
      t: "Agregado event-sourced",
      src: `type EventoConta =
  | { tipo: "Aberta"; contaId: string; titular: string }
  | { tipo: "Depositado"; centavos: number }
  | { tipo: "Sacado"; centavos: number };

export class Conta {
  #id = "";
  #saldo = 0;
  #versao = 0;
  #novos: EventoConta[] = [];

  static reconstruir(historico: EventoConta[]): Conta {
    const c = new Conta();
    for (const e of historico) c.#aplicar(e);
    c.#versao = historico.length;
    return c;
  }

  sacar(centavos: number): void {
    if (this.#saldo < centavos) throw new SaldoInsuficiente(this.#id);
    this.#registrar({ tipo: "Sacado", centavos });
  }

  #registrar(e: EventoConta) { this.#aplicar(e); this.#novos.push(e); }

  #aplicar(e: EventoConta) {
    switch (e.tipo) {
      case "Aberta": this.#id = e.contaId; break;
      case "Depositado": this.#saldo += e.centavos; break;
      case "Sacado": this.#saldo -= e.centavos; break;
    }
  }
}
// Persistência: INSERT dos novos eventos com versão esperada
// (UNIQUE(conta_id, versao) → conflito = escrita concorrente)`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Aplique CQRS nível 1 num projeto: comandos via agregados, consultas via <code>$queryRaw</code> ou Kysely retornando exatamente o formato da tela." },
    { lvl: 2, text: "Implemente a conta bancária event-sourced com event store em PostgreSQL, controle de concorrência otimista e snapshot a cada 100 eventos." },
    { lvl: 2, text: "Crie duas projeções a partir dos mesmos eventos: saldo atual e extrato mensal. Adicione uma terceira projeção nova e reconstrua do início." },
    { lvl: 3, text: "Experimente a biblioteca Emmett ou o KurrentDB (antigo EventStoreDB) com um domínio de sua escolha e escreva um comparativo com a sua implementação manual." },
  ],
  refs: [
    { t: "Martin Fowler: CQRS", u: "https://martinfowler.com/bliki/CQRS.html" },
    { t: "Martin Fowler: Event Sourcing", u: "https://martinfowler.com/eaaDev/EventSourcing.html" },
    { t: "Greg Young: Versioning in an Event Sourced System (livro gratuito)", u: "https://leanpub.com/esversioning/read" },
    { t: "Emmett: event sourcing em TypeScript (Oskar Dudycz)", u: "https://github.com/event-driven-io/emmett" },
    { t: "EventStoreDB / Kurrent", u: "https://www.kurrent.io/" },
    { t: "Microsoft: CQRS pattern", u: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs" },
  ],
});

/* ---------- Disponibilidade e resiliência ---------- */

T({
  id: "resiliencia",
  phase: "p-disp",
  title: "Disponibilidade, resiliência e tolerância a falhas",
  level: "Avançado",
  hours: 20,
  summary: "Timeouts, retries com backoff e jitter, circuit breaker, bulkhead, fallback e chaos engineering.",
  body: `
<p>Em sistemas distribuídos, falhas não são exceção: são o estado normal de alguma parte. O objetivo é impedir que a falha de um componente se espalhe em cascata. Michael Nygard, em <em>Release It!</em>, chama isso de construir sistemas que sobrevivem à produção.</p>
<h3>Os padrões essenciais</h3>
<dl class="defs">
<dt>Timeout</dt><dd>Toda chamada remota precisa de timeout. Sem ele, requisições ficam penduradas para sempre esperando um serviço morto, acumulando memória e conexões. É a causa número um de quedas em cascata. No Node: <code>AbortSignal.timeout(ms)</code>.</dd>
<dt>Retry com backoff exponencial e jitter</dt><dd>Repita só erros transitórios e só operações idempotentes. Espere cada vez mais, com aleatoriedade, para não criar ondas sincronizadas de tráfego (thundering herd). Limite o total de tentativas e use orçamento de retries.</dd>
<dt>Circuit breaker</dt><dd>Depois de N falhas, "abre o circuito" e falha imediatamente por um tempo, dando fôlego ao serviço doente. Depois testa com poucas chamadas (meio aberto) antes de fechar.</dd>
<dt>Bulkhead</dt><dd>Compartimentos estanques, como num navio: limites de concorrência separados por dependência. Se o provedor de IA travar, ele esgota só o seu compartimento, não a memória e as conexões do processo inteiro.</dd>
<dt>Fallback / degradação graciosa</dt><dd>Se o resumo por IA falha, mostre a lista de atividades recentes sem resumo. O usuário quase não nota.</dd>
<dt>Load shedding</dt><dd>Sob sobrecarga, recuse parte do tráfego cedo e barato em vez de atender tudo mal. No Node, um bom gatilho é o atraso do event loop.</dd>
</dl>
<h3>Chaos engineering</h3>
<p>Injete falhas de propósito, de forma controlada, para descobrir fraquezas antes que a produção as revele. Comece em ambiente de teste com ferramentas como Toxiproxy (latência, quedas de conexão) e derrubando contêineres no meio de testes de carga.</p>

<h3>Redundância, failover e zero downtime</h3>
<p><strong>Redundância</strong>: nenhum ponto único de falha (instâncias em várias zonas, banco Multi-AZ). <strong>Failover</strong>: troca automática para a réplica quando a principal falha; teste de verdade, porque failover nunca testado costuma falhar. <strong>Zero downtime deployment</strong>: rolling, blue/green ou canary, com migrações de banco compatíveis (expand/contract) e desligamento gracioso (ao receber <code>SIGTERM</code>, pare de aceitar conexões, termine as requisições em andamento, feche o banco). <strong>Graceful degradation</strong>: perder uma função secundária sem perder o fluxo principal.</p>`,
  code: [
    {
      t: "Timeout, circuit breaker, bulkhead e fallback com cockatiel",
      src: `import {
  bulkhead, circuitBreaker, ConsecutiveBreaker, fallback, handleAll, timeout, TimeoutStrategy, wrap,
} from "cockatiel";

const politicaIa = wrap(
  fallback(handleAll, () => ({ resumo: null, motivo: "indisponivel" as const })), // degrada
  bulkhead(10, 20),                       // no máximo 10 chamadas ao mesmo tempo, 20 na fila
  circuitBreaker(handleAll, { halfOpenAfter: 30_000, breaker: new ConsecutiveBreaker(5) }),
  timeout(15_000, TimeoutStrategy.Aggressive), // desiste e aborta a chamada
);

export async function resumoDoProjeto(projetoId: string) {
  return politicaIa.execute(({ signal }) => ia.resumir(projetoId, { signal }));
}`,
    },
    {
      t: "Desligamento gracioso no NestJS",
      src: `// main.ts
const app = await NestFactory.create(AppModule);
app.enableShutdownHooks();   // SIGTERM → onModuleDestroy/onApplicationShutdown em todos os providers
await app.listen(3000);

// health.controller.ts — a readiness passa a falhar assim que o desligamento começa,
// e o balanceador para de mandar tráfego antes de o processo fechar
@Controller("health")
export class HealthController implements BeforeApplicationShutdown {
  #desligando = false;
  beforeApplicationShutdown() { this.#desligando = true; }

  @Get("live") live() { return { ok: true }; }

  @Get("ready") ready() {
    if (this.#desligando) throw new ServiceUnavailableException();
    return { ok: true };
  }
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Coloque Toxiproxy entre sua API e uma dependência. Injete 5 s de latência e observe sua API acumular requisições sem timeout. Corrija." },
    { lvl: 2, text: "Configure circuit breaker e exponha as mudanças de estado (fechado, aberto, meio aberto) como métrica no Grafana." },
    { lvl: 2, text: "Demonstre o efeito do bulkhead: com e sem ele, uma dependência lenta afeta ou não endpoints que não a usam?" },
    { lvl: 3, text: "Planeje e execute um <em>game day</em>: 3 hipóteses de falha, experimentos, métricas observadas e um relatório de aprendizados." },
  ],
  refs: [
    { t: "Livro: Release It!, 2ª ed. (Michael Nygard)", u: "https://pragprog.com/titles/mnee2/release-it-second-edition/", note: "leitura obrigatória" },
    { t: "cockatiel", u: "https://github.com/connor4312/cockatiel" },
    { t: "NestJS: Lifecycle events", u: "https://docs.nestjs.com/fundamentals/lifecycle-events" },
    { t: "AWS Builders' Library: Timeouts, retries, and backoff with jitter", u: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/" },
    { t: "AWS Builders' Library: Using load shedding to avoid overload", u: "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/" },
    { t: "Toxiproxy", u: "https://github.com/Shopify/toxiproxy" },
    { t: "Principles of Chaos Engineering", u: "https://principlesofchaos.org/" },
  ],
});

T({
  id: "observabilidade",
  phase: "p-disp",
  title: "Tracing, monitoramento e SRE",
  level: "Avançado",
  hours: 20,
  summary: "Logs, métricas e traces com OpenTelemetry, SLIs, SLOs, error budgets e alertas que importam.",
  body: `
<p>Monitoramento responde perguntas que você já sabia fazer ("a CPU está alta?"). Observabilidade permite responder perguntas novas sobre um comportamento que você nunca viu, a partir dos dados que o sistema emite. Em sistemas distribuídos, é a diferença entre resolver um incidente em 10 minutos ou em 10 horas.</p>
<h3>Os três sinais</h3>
<ul>
<li><strong>Logs estruturados</strong> (JSON) com <code>traceId</code> em cada linha. No Node, use <strong>pino</strong> (rápido e estruturado; no NestJS, <code>nestjs-pino</code>). Nunca <code>console.log</code> de objetos em produção, e nunca logue tokens ou senhas.</li>
<li><strong>Métricas</strong>: use os métodos <strong>RED</strong> para serviços (Rate, Errors, Duration) e <strong>USE</strong> para recursos (Utilization, Saturation, Errors). No Node, inclua o atraso do event loop e o uso de heap.</li>
<li><strong>Traces distribuídos</strong>: mostram o caminho de uma requisição por todos os serviços, filas e consultas ao banco, com o tempo de cada trecho. Padrão aberto: <strong>OpenTelemetry</strong>, com instrumentação automática para HTTP, Express, NestJS, pg, Redis e outros.</li>
</ul>
<p>O NestJS 12 oferece, ao criar o projeto, um SDK oficial de observabilidade (NestJS Observe). O OpenTelemetry continua sendo o padrão aberto que funciona com qualquer backend (Grafana, Datadog, Honeycomb, AWS X-Ray), e é o que esta trilha usa.</p>
<h3>SLI, SLO e error budget</h3>
<p>Do livro de SRE do Google:</p>
<ul>
<li><strong>SLI</strong>: um indicador medido do ponto de vista do usuário. "Porcentagem de requisições de criação de tarefa respondidas com sucesso em menos de 500 ms."</li>
<li><strong>SLO</strong>: a meta para o SLI. "99,5% em janelas de 28 dias."</li>
<li><strong>Error budget</strong>: o que sobra. 99,5% significa que 0,5% pode falhar (cerca de 3h20min em 28 dias). Se o orçamento acabou, o time prioriza confiabilidade em vez de features. Isso transforma uma briga política (velocidade vs. estabilidade) num acordo baseado em dados.</li>
</ul>
<p>Alerte sobre <strong>sintomas</strong> que afetam usuários (taxa de consumo do error budget), não sobre causas (CPU a 80%). Alertas que não exigem ação geram fadiga e são ignorados.</p>
`,
  code: [
    {
      t: "OpenTelemetry no Node: instrumentação carregada antes da aplicação",
      src: `// src/instrumentation.ts
import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";

const sdk = new NodeSDK({
  serviceName: "tarefas-api",
  traceExporter: new OTLPTraceExporter(),   // usa OTEL_EXPORTER_OTLP_ENDPOINT
  metricReader: new PeriodicExportingMetricReader({ exporter: new OTLPMetricExporter() }),
  instrumentations: [getNodeAutoInstrumentations()], // http, express, nestjs, pg, ioredis...
});
sdk.start();
process.on("SIGTERM", () => void sdk.shutdown());

// Rode com: node --import ./dist/instrumentation.js dist/main.js
// (precisa carregar ANTES dos módulos que serão instrumentados)`,
    },
    {
      t: "Métrica de negócio e span customizado",
      src: `import { metrics, trace, SpanStatusCode } from "@opentelemetry/api";

const meter = metrics.getMeter("tarefas");
const concluidas = meter.createCounter("tarefas.concluidas", {
  description: "Tarefas concluídas com sucesso",
});
const tracer = trace.getTracer("tarefas");

export async function concluir(tarefa: Tarefa) {
  return tracer.startActiveSpan("tarefas.concluir", async (span) => {
    span.setAttribute("tarefa.prioridade", tarefa.prioridade); // baixa cardinalidade: nada de IDs em métricas
    try {
      await processar(tarefa);
      concluidas.add(1, { prioridade: tarefa.prioridade });
    } catch (e) {
      span.recordException(e as Error);
      span.setStatus({ code: SpanStatusCode.ERROR });
      throw e;
    } finally {
      span.end();
    }
  });
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Suba a stack Grafana LGTM (docker <code>grafana/otel-lgtm</code>) e envie logs, métricas e traces da API e do worker. Siga um traceId do controller até o job na fila." },
    { lvl: 2, text: "Defina 3 SLOs para a API de tarefas, implemente as queries PromQL e crie alertas de burn rate em múltiplas janelas." },
    { lvl: 2, text: "Crie um dashboard RED para cada serviço e um painel de negócio (tarefas criadas por minuto, concluídas, atrasadas, custo de IA por dia)." },
    { lvl: 3, text: "Simule um incidente (dependência lenta), investigue só pela observabilidade e escreva um postmortem sem culpados no formato do Google SRE." },
  ],
  refs: [
    { t: "Livro: Site Reliability Engineering (Google, gratuito)", u: "https://sre.google/sre-book/table-of-contents/" },
    { t: "Livro: The Site Reliability Workbook (Google, gratuito)", u: "https://sre.google/workbook/table-of-contents/" },
    { t: "OpenTelemetry: JavaScript", u: "https://opentelemetry.io/docs/languages/js/" },
    { t: "pino: logger para Node.js", u: "https://getpino.io/" },
    { t: "Livro: Observability Engineering (Majors, Fong-Jones, Miranda)", u: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/" },
    { t: "grafana/otel-lgtm: stack local completa", u: "https://github.com/grafana/docker-otel-lgtm" },
  ],
});

/* ---------- Segurança como requisito arquitetural ---------- */

T({
  id: "seguranca",
  phase: "p-seg",
  title: "Segurança como requisito arquitetural",
  level: "Avançado",
  hours: 25,
  summary: "OWASP Top 10, modelagem de ameaças, OAuth 2.1/OIDC no NestJS, segredos, cadeia de suprimentos npm, zero trust e LGPD.",
  body: `
<p>Segurança não se adiciona no final: ela nasce no desenho. Uma decisão de arquitetura (onde ficam os dados sensíveis, quem confia em quem, por onde entra o tráfego) define a superfície de ataque muito mais do que qualquer biblioteca.</p>
<h3>Fundamentos</h3>
<ul>
<li><strong>OWASP Top 10</strong>: controle de acesso quebrado (o mais comum), falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, falhas de integridade, falhas de logging, SSRF. Conheça cada um com exemplo em TypeScript.</li>
<li><strong>Defesa em profundidade</strong>: várias camadas; nenhuma é suficiente sozinha.</li>
<li><strong>Menor privilégio</strong>: cada serviço, usuário e credencial com o mínimo necessário.</li>
<li><strong>Zero trust</strong>: estar na rede interna não dá confiança; toda chamada é autenticada e autorizada (mTLS entre serviços, tokens com escopo).</li>
<li><strong>Cadeia de suprimentos</strong>: um projeto Node típico tem centenas de dependências transitivas. Lockfile no Git, <code>npm ci</code>, revisão de dependências novas, Dependabot, <code>npm audit</code> e, de preferência, scripts de instalação desligados (<code>ignore-scripts</code>) onde der.</li>
</ul>
<h3>Modelagem de ameaças</h3>
<p>Antes de construir, pergunte: o que estamos construindo? O que pode dar errado? O que vamos fazer a respeito? Fizemos um bom trabalho? Use <strong>STRIDE</strong> (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) sobre o diagrama C4 de contêineres.</p>
<h3>Identidade: OAuth 2.1 e OpenID Connect</h3>
<p>Para produtos sérios, não construa autenticação do zero: use um provedor de identidade (Keycloak, Auth0, Cognito, Entra ID). Fluxos: <em>Authorization Code + PKCE</em> para apps de usuário; <em>Client Credentials</em> para serviço a serviço. Sua API é um <em>resource server</em> que valida JWTs contra as chaves públicas (JWKS) do provedor. Para SPAs, considere o padrão <strong>BFF</strong>: tokens ficam no servidor, o navegador só tem um cookie de sessão seguro.</p>
<h3>Dados e conformidade</h3>
<p>Criptografia em trânsito (TLS) e em repouso; segredos num cofre (Vault, AWS Secrets Manager), nunca no Git nem no <code>.env</code> commitado; mascaramento em logs. A <strong>LGPD</strong> exige base legal, minimização de dados, direitos do titular (acesso, exclusão) e registro de operações: isso afeta modelagem de dados e retenção desde o primeiro dia. Ao enviar dados para uma API de IA, isso também é tratamento de dados pessoais.</p>

<h3>Proteções de borda do seu roadmap</h3>
<ul>
<li><strong>VPN</strong> para acesso administrativo a redes privadas; bancos e serviços internos nunca expostos à internet.</li>
<li><strong>WAF</strong> (Web Application Firewall: AWS WAF, Cloudflare): bloqueia padrões de ataque conhecidos (injeção SQL, XSS, bots) antes de chegarem à aplicação.</li>
<li><strong>DDoS</strong>: mitigação na borda (AWS Shield, Cloudflare), CDN absorvendo tráfego, rate limiting e autoscaling com limites de custo.</li>
<li><strong>SQL Injection</strong>: sempre consultas parametrizadas. No Prisma, use os métodos normais ou <code>$queryRaw</code> com template (que parametriza); nunca <code>$queryRawUnsafe</code> com concatenação de strings.</li>
<li><strong>Criptografia de dados</strong>: TLS em trânsito, criptografia em repouso com chaves gerenciadas (KMS), e criptografia de campo para dados muito sensíveis.</li>
</ul>`,
  code: [
    {
      t: "Resource server: guard que valida JWT de um provedor OIDC",
      src: `import { createRemoteJWKSet, jwtVerify } from "jose";

const emissor = process.env.OIDC_ISSUER!;              // ex.: https://auth.tarefas.exemplo/realms/tarefas
const chaves = createRemoteJWKSet(new URL(emissor + "/protocol/openid-connect/certs"));

@Injectable()
export class JwtGuard implements CanActivate {
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { usuario?: Usuario }>();
    const token = req.headers.authorization?.replace(/^Bearer /, "");
    if (!token) throw new UnauthorizedException();
    try {
      const { payload } = await jwtVerify(token, chaves, {
        issuer: emissor,
        audience: "tarefas-api",   // token emitido para OUTRA API não serve aqui
      });
      req.usuario = { id: payload.sub!, escopos: String(payload.scope ?? "").split(" ") };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}`,
    },
    {
      t: "Autorização no nível do objeto (evita o erro nº 1 do OWASP)",
      src: `@Injectable()
export class MembroDoProjetoGuard implements CanActivate {
  constructor(private readonly acesso: ConsultaDeAcesso) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<Request & { usuario: Usuario }>();
    const papel = await this.acesso.papelNoProjeto(req.params.projetoId, req.usuario.id);
    // Sem isso, qualquer usuário logado lê o projeto de outro trocando o ID (IDOR).
    // 404 em vez de 403: não confirma que o projeto existe.
    if (!papel) throw new NotFoundException();
    return true;
  }
}

@Controller("projetos/:projetoId/tarefas")
@UseGuards(JwtGuard, MembroDoProjetoGuard)
export class TarefasController { /* ... */ }`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Resolva os desafios do <strong>OWASP Juice Shop</strong> (uma loja vulnerável feita em Node e TypeScript) de 1 e 2 estrelas: injeção, controle de acesso, XSS e JWT." },
    { lvl: 2, text: "Suba Keycloak, proteja sua API como resource server com o guard acima e crie um BFF simples para um front-end, guardando os tokens no servidor." },
    { lvl: 2, text: "Faça modelagem de ameaças STRIDE do projeto da trilha sobre o diagrama C4 de contêineres. Liste 10 ameaças e mitigações, incluindo prompt injection na funcionalidade de IA." },
    { lvl: 3, text: "Adicione ao pipeline: SAST (Semgrep), SCA (<code>npm audit</code> e Dependabot), varredura de imagem (Trivy) e de segredos (Gitleaks). Gere um SBOM com <code>@cyclonedx/cyclonedx-npm</code>." },
  ],
  refs: [
    { t: "OWASP Top 10", u: "https://owasp.org/www-project-top-ten/" },
    { t: "OWASP ASVS", u: "https://owasp.org/www-project-application-security-verification-standard/" },
    { t: "OWASP Juice Shop", u: "https://owasp.org/www-project-juice-shop/" },
    { t: "Node.js: Security Best Practices", u: "https://nodejs.org/en/learn/getting-started/security-best-practices" },
    { t: "NestJS: Authorization", u: "https://docs.nestjs.com/security/authorization" },
    { t: "jose: JWT, JWS e JWKS para JavaScript", u: "https://github.com/panva/jose" },
    { t: "OAuth 2.1 (draft)", u: "https://oauth.net/2.1/" },
    { t: "Threat Modeling Manifesto", u: "https://www.threatmodelingmanifesto.org/" },
    { t: "Livro: Secure by Design (Johnsson, Deogun, Sawano)", u: "https://www.manning.com/books/secure-by-design", note: "une DDD e segurança" },
    { t: "LGPD: Lei nº 13.709/2018", u: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm" },
  ],
});

/* ---------- AWS Solutions Architect e System Design ---------- */

T({
  id: "aws-sa",
  phase: "p-final",
  title: "Certificações AWS Solutions Architect",
  level: "Avançado",
  hours: 80,
  summary: "Plano de estudo para Associate e Professional, alinhado ao Well-Architected e ao que você já estudou na trilha.",
  body: `
<p>Seu roadmap recomenda as duas certificações de arquiteto da AWS antes do System Design. Elas validam o que você estudou nas etapas anteriores aplicado a serviços reais e têm peso forte no mercado para vagas de arquiteto de soluções.</p>
<h3>Solutions Architect – Associate (SAA-C03)</h3>
<p>Quatro domínios: arquiteturas seguras, resilientes, de alto desempenho e com custo otimizado. Na prática: VPC (subnets públicas e privadas, NAT, security groups), IAM, EC2 e Auto Scaling, ELB, S3 e classes de armazenamento, RDS/Aurora (Multi-AZ vs. réplicas de leitura), DynamoDB, ElastiCache, SQS/SNS/EventBridge, Lambda, ECS, CloudFront, Route 53, CloudWatch, KMS.</p>
<h3>Solutions Architect – Professional (SAP-C02)</h3>
<p>Cenários longos e ambíguos de organizações grandes: múltiplas contas (Organizations, Control Tower), redes híbridas (Transit Gateway, Direct Connect), migração (os "7 Rs"), recuperação de desastres (backup/restore, pilot light, warm standby, multi-site ativo-ativo) e otimização de custos em escala.</p>
<h3>Como estudar sem decorar</h3>
<ol>
<li>Para cada serviço, responda: que problema resolve, qual característica de arquitetura atende, qual o trade-off, quanto custa.</li>
<li>Construa: cada domínio da prova vira um laboratório (com Terraform, para destruir no fim do dia).</li>
<li>Leia os whitepapers do Well-Architected e os casos da AWS Architecture Blog.</li>
<li>Faça simulados com explicação de cada alternativa. As erradas ensinam tanto quanto as certas.</li>
</ol>
<table class="tbl"><thead><tr><th>Estratégia de DR</th><th>RTO / RPO típicos</th><th>Custo</th></tr></thead><tbody>
<tr><td>Backup &amp; restore</td><td>Horas</td><td>$</td></tr>
<tr><td>Pilot light</td><td>Dezenas de minutos</td><td>$$</td></tr>
<tr><td>Warm standby</td><td>Minutos</td><td>$$$</td></tr>
<tr><td>Multi-site ativo-ativo</td><td>Próximo de zero</td><td>$$$$</td></tr>
</tbody></table>
`,
  code: [
    {
      t: "Laboratório: aplicação em duas AZs com Terraform (trecho)",
      src: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  name    = "tarefas"
  cidr    = "10.0.0.0/16"
  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]   # ALB
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24"] # API, worker e banco
  enable_nat_gateway = true
  single_nat_gateway = true    # economia em laboratório; em produção, um por AZ
}

resource "aws_db_instance" "tarefas" {
  engine            = "postgres"
  instance_class    = "db.t4g.micro"
  allocated_storage = 20
  multi_az          = true     # failover automático entre AZs
  db_subnet_group_name = aws_db_subnet_group.privadas.name
  vpc_security_group_ids = [aws_security_group.banco.id]  # só a app acessa
  skip_final_snapshot = true   # apenas em laboratório
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Monte um plano de 10 semanas para a SAA-C03 cruzando cada domínio da prova com os tópicos desta trilha que você já estudou." },
    { lvl: 2, text: "Construa com Terraform: VPC em 2 AZs, ALB, ECS Fargate com a sua API e o worker, RDS Multi-AZ, ElastiCache e CloudFront. Derrube uma AZ simulada e observe o failover." },
    { lvl: 2, text: "Implemente e teste uma estratégia pilot light para o projeto em outra região. Meça o RTO real." },
    { lvl: 3, text: "Depois da Associate, escolha um cenário multi-conta (3 times, ambientes dev/prod, rede compartilhada) e desenhe a solução no nível exigido pela Professional, com ADRs." },
  ],
  refs: [
    { t: "AWS Certified Solutions Architect – Associate", u: "https://aws.amazon.com/certification/certified-solutions-architect-associate/" },
    { t: "AWS Certified Solutions Architect – Professional", u: "https://aws.amazon.com/certification/certified-solutions-architect-professional/" },
    { t: "AWS Architecture Center", u: "https://aws.amazon.com/architecture/" },
    { t: "AWS: Disaster Recovery of Workloads on AWS (whitepaper)", u: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html" },
    { t: "AWS Skill Builder", u: "https://skillbuilder.aws/" },
    { t: "Terraform AWS modules", u: "https://registry.terraform.io/namespaces/terraform-aws-modules" },
  ],
});

T({
  id: "system-design",
  phase: "p-final",
  title: "System design na prática",
  level: "Avançado",
  hours: 40,
  summary: "O último passo do seu roadmap: um método para desenhar sistemas do zero, estimativas e estudos de caso clássicos.",
  body: `
<p>System design é onde todas as fases se encontram. É também o formato das entrevistas para cargos de arquitetura e Staff. Pratique como um esporte: com método, repetição e revisão.</p>
<h3>Um método em 6 passos</h3>
<ol>
<li><strong>Requisitos</strong>: funcionais (o que faz) e não funcionais (escala, latência, disponibilidade, consistência). Pergunte; não assuma.</li>
<li><strong>Estimativas</strong>: usuários ativos, requisições por segundo (média e pico), volume de dados por dia e em 5 anos, banda.</li>
<li><strong>API</strong>: os endpoints ou eventos principais.</li>
<li><strong>Modelo de dados</strong> e escolha de armazenamento.</li>
<li><strong>Desenho de alto nível</strong>: contêineres C4 nível 2.</li>
<li><strong>Aprofundamento</strong>: gargalos, pontos únicos de falha, escala, consistência, trade-offs. É aqui que se separa o sênior do arquiteto.</li>
</ol>
<h3>Estimativa rápida (back-of-the-envelope)</h3>
<p>Um dia tem ~86.400 s; use 100.000 para conta rápida. 10 milhões de usuários ativos/dia × 20 ações = 200 milhões/dia ≈ 2.000 req/s em média; pico de 3 a 5x ≈ 10.000 req/s. Se cada ação grava 1 KB: 200 GB/dia ≈ 73 TB/ano. Esses números decidem a arquitetura antes de qualquer tecnologia.</p>
<h3>Estudos de caso para praticar (em ordem de dificuldade)</h3>
<ol>
<li>Encurtador de URL</li>
<li>Rate limiter distribuído</li>
<li>Sistema de notificações (push, e-mail, SMS) com prioridades</li>
<li>Feed de rede social (fan-out na escrita vs. na leitura)</li>
<li>Chat em tempo real (WebSocket, presença, entrega)</li>
<li>Sistema de pagamentos com idempotência e conciliação (como Pix)</li>
<li>Venda de ingressos com pico extremo e sem overbooking</li>
<li>Aplicativo de corridas (geolocalização, matching motorista-passageiro)</li>
<li>Busca com autocompletar</li>
<li>Streaming de vídeo (upload, transcodificação, CDN)</li>
</ol>
<h3>Leia como as empresas fazem</h3>
<p>Blogs de engenharia mostram decisões reais com números reais: Netflix, Uber, Discord, Shopify, Stripe, Mercado Livre, Nubank, iFood. Leia um artigo por semana e escreva um resumo de uma página: problema, restrições, solução, trade-offs.</p>
`,
  code: [
    {
      t: "Encurtador de URL: geração de IDs curtos e únicos",
      src: `/** Base62 sobre um ID numérico único (Snowflake ou sequence do banco). */
const ALFABETO = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function codificar(n: bigint): string {
  if (n === 0n) return "0";
  let s = "";
  while (n > 0n) {
    s = ALFABETO[Number(n % 62n)] + s;
    n /= 62n;
  }
  return s;
}
// bigint porque IDs de 64 bits não cabem com precisão num number (limite: 2^53).
// 62^7 ≈ 3,5 trilhões de URLs com 7 caracteres.
// Trade-off: IDs sequenciais são previsíveis (alguém pode enumerar links).
// Alternativa: embaralhar o ID com uma permutação reversível (ex.: Feistel) antes de codificar.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Resolva os 3 primeiros estudos de caso no papel com o método de 6 passos, 45 minutos cada. Depois compare com soluções publicadas." },
    { lvl: 2, text: "Implemente o encurtador de URL de verdade: NestJS, PostgreSQL, Redis de cache, rate limiting, métricas. Faça teste de carga a 2.000 req/s." },
    { lvl: 2, text: "Leia 10 artigos de blogs de engenharia (lista nas referências) e escreva um resumo de uma página para cada um." },
    { lvl: 3, text: "Faça 10 simulações de entrevista de system design com outra pessoa (ou grave-se), alternando os papéis. Use os casos 4 a 10." },
  ],
  refs: [
    { t: "The System Design Primer", u: "https://github.com/donnemartin/system-design-primer" },
    { t: "Livro: System Design Interview, vol. 1 e 2 (Alex Xu)", u: "https://bytebytego.com/" },
    { t: "ByteByteGo (newsletter e diagramas)", u: "https://blog.bytebytego.com/" },
    { t: "High Scalability: arquiteturas reais", u: "https://highscalability.com/" },
    { t: "Netflix Tech Blog", u: "https://netflixtechblog.com/" },
    { t: "Uber Engineering", u: "https://www.uber.com/blog/engineering/" },
    { t: "Discord: How Discord Stores Trillions of Messages", u: "https://discord.com/blog/how-discord-stores-trillions-of-messages" },
    { t: "Building Nubank (blog de engenharia)", u: "https://building.nubank.com/" },
    { t: "InfoQ: palestras e artigos de arquitetura", u: "https://www.infoq.com/architecture-design/" },
    { t: "Azure Architecture Center: estilos e padrões de nuvem", u: "https://learn.microsoft.com/en-us/azure/architecture/" },
    { t: "ByteByteGo: Technical Interview Prep", u: "https://bytebytego.com/", note: "indicado no seu quadro" },
  ],
});
