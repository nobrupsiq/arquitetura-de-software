/* Arquiteto de Software */

/* ---------- Arquitetura de Software ---------- */

T({
  id: "o-que-e",
  phase: "p-arq",
  title: "Arquitetura de Software: níveis, tipos de arquiteto e papéis",
  level: "Base",
  hours: 12,
  summary: "Definições, as leis da arquitetura de software, expectativas do papel e a diferença entre arquitetura e design.",
  body: `
<p>Não existe uma definição única. As três mais úteis se complementam:</p>
<ul>
<li><strong>Estrutural</strong> (Richards &amp; Ford): arquitetura é a combinação de <em>estrutura</em> (o estilo), <em>características</em> (os "-ilities" que o sistema precisa suportar), <em>decisões</em> (regras que restringem como o sistema é construído) e <em>princípios de design</em> (orientações, não regras).</li>
<li><strong>Econômica</strong> (Martin Fowler, citando Ralph Johnson): arquitetura é "a parte importante", aquilo que é difícil de mudar depois.</li>
<li><strong>Formal</strong> (ISO/IEC/IEEE 42010): os conceitos fundamentais de um sistema, incorporados em seus elementos, relações e nos princípios do seu desenho e evolução.</li>
</ul>
<h3>As leis da arquitetura de software</h3>
<p>Richards e Ford resumem o ofício em duas leis que você deve repetir até virar reflexo:</p>
<ol>
<li><strong>Tudo em arquitetura de software é um trade-off.</strong> Se você acha que encontrou algo sem trade-off, ainda não o identificou.</li>
<li><strong>O porquê é mais importante que o como.</strong> Um diagrama mostra o como; só a justificativa permite que outros avaliem e evoluam a decisão.</li>
</ol>
<h3>O que se espera de um arquiteto</h3>
<p>Tomar decisões de arquitetura; analisar continuamente a arquitetura existente; acompanhar tendências; garantir conformidade com as decisões; ter exposição a tecnologias diversas; conhecer o domínio de negócio; ter habilidades interpessoais; navegar pela política da organização. Note que só metade disso é técnica.</p>
<h3>Largura vs. profundidade</h3>
<p>Um desenvolvedor sênior aprofunda em poucas tecnologias. Um arquiteto troca parte dessa profundidade por <strong>largura</strong>: saber que dez soluções existem e seus trade-offs vale mais do que ser especialista em uma. Isso não significa parar de programar. Arquitetos que param de programar perdem a noção de custo das próprias decisões. Mantenha código no dia a dia: provas de conceito, ferramentas internas, correções de dívida técnica, revisão de código.</p>
<div class="callout"><b>Antipadrão do arquiteto de torre de marfim:</b> desenha, entrega o diagrama e some. O time descobre os problemas sozinho e passa a ignorar a arquitetura. O arquiteto eficaz trabalha junto, explica o porquê e ajusta a decisão quando a realidade mostra que estava errada.</div>

<h3>Níveis de arquitetura e tipos de arquiteto</h3>
<table class="tbl"><thead><tr><th>Nível</th><th>Escopo</th><th>Quem cuida</th></tr></thead><tbody>
<tr><td>Arquitetura de aplicação</td><td>A estrutura interna de um sistema: módulos, camadas, padrões (<em>low-level design</em>, LLD)</td><td>Arquiteto de Software</td></tr>
<tr><td>Arquitetura de solução</td><td>Como vários sistemas, serviços de nuvem e integrações resolvem um problema de negócio (<em>high-level design</em>, HLD)</td><td>Arquiteto de Soluções</td></tr>
<tr><td>Arquitetura corporativa</td><td>O portfólio de sistemas da empresa inteira, padrões, governança e alinhamento à estratégia (TOGAF)</td><td>Arquiteto Corporativo</td></tr>
</tbody></table>
<h3>Papéis e responsabilidades: requisitos funcionais e não funcionais</h3>
<p><strong>Requisitos funcionais</strong> dizem o que o sistema faz: "o sistema deve enviar um e-mail de confirmação após o cadastro", "o usuário deve fazer login com e-mail e senha". <strong>Requisitos não funcionais</strong> dizem como ele precisa se comportar: "disponível 99,9% do tempo", "suportar 1 milhão de usuários", "responder em até 200 ms". O arquiteto garante que os não funcionais sejam explícitos, mensuráveis e guiem as decisões, porque são eles que definem a arquitetura.</p>`,
  code: [
  ],
  exercises: [
    { lvl: 1, text: "Escreva com suas palavras a diferença entre arquitetura e design, com 3 exemplos de decisões de cada lado da linha." },
    { lvl: 2, text: "Escolha um sistema que você usa (Spotify, iFood, Nubank). Liste 10 decisões de arquitetura que provavelmente foram tomadas e o trade-off de cada uma." },
    { lvl: 2, text: "Monte sua <em>matriz de conhecimento técnico</em>: o que você sabe, o que sabe que não sabe, e o que não sabe que não sabe. Atualize a cada trimestre." },
    { lvl: 3, text: "Entreviste (ou leia entrevistas de) dois arquitetos sobre o dia a dia deles. Compare com a lista de expectativas acima e escreva o que mais surpreendeu." },
  ],
  refs: [
    { t: "Livro: Fundamentals of Software Architecture, 2ª ed. (Richards & Ford, 2025)", u: "https://www.oreilly.com/library/view/-/9781098175504", note: "o livro-base desta trilha" },
    { t: "Martin Fowler: Software Architecture Guide", u: "https://martinfowler.com/architecture/" },
    { t: "Martin Fowler: Who Needs an Architect?", u: "https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf" },
    { t: "ISO/IEC/IEEE 42010", u: "https://www.iso.org/standard/74393.html" },
    { t: "roadmap.sh: Software Architect", u: "https://roadmap.sh/software-architect" },
    { t: "Mark Richards: Software Architecture Monday (vídeos curtos semanais)", u: "https://www.developertoarchitect.com/lessons/" },
  ],
});

T({
  id: "caracteristicas",
  phase: "p-arq",
  title: "Características de arquitetura",
  level: "Intermediário",
  hours: 15,
  summary: "Atributos de qualidade, como extraí-los dos requisitos, cenários mensuráveis e a ISO/IEC 25010.",
  body: `
<p>Requisitos funcionais dizem <em>o que</em> o sistema faz. Características de arquitetura (também chamadas de atributos de qualidade ou requisitos não funcionais) dizem <em>quão bem</em> ele precisa fazer. Elas, mais do que as funcionalidades, determinam o estilo de arquitetura.</p>
<h3>Categorias</h3>
<ul>
<li><strong>Operacionais</strong>: disponibilidade, desempenho, escalabilidade, elasticidade, recuperabilidade, confiabilidade.</li>
<li><strong>Estruturais</strong>: manutenibilidade, extensibilidade, testabilidade, implantabilidade, portabilidade.</li>
<li><strong>Transversais</strong>: segurança, privacidade, acessibilidade, conformidade legal (LGPD), usabilidade.</li>
</ul>
<h3>Como extrair do negócio</h3>
<p>Stakeholders raramente dizem "precisamos de elasticidade". Eles dizem coisas que você precisa traduzir:</p>
<table class="tbl"><thead><tr><th>O negócio diz</th><th>Característica provável</th></tr></thead><tbody>
<tr><td>"Na Black Friday o tráfego multiplica por 20"</td><td>Elasticidade, escalabilidade</td></tr>
<tr><td>"Vamos fundir com outra empresa ano que vem"</td><td>Interoperabilidade, extensibilidade</td></tr>
<tr><td>"Precisamos lançar rápido e testar o mercado"</td><td>Agilidade, implantabilidade, simplicidade</td></tr>
<tr><td>"Cada minuto fora do ar custa R$ 50 mil"</td><td>Disponibilidade, recuperabilidade</td></tr>
<tr><td>"Tratamos dados de saúde"</td><td>Segurança, privacidade, auditabilidade</td></tr>
</tbody></table>
<h3>Escolha poucas</h3>
<p>Cada característica tem custo e várias brigam entre si (segurança vs. desempenho, consistência vs. disponibilidade). Richards e Ford recomendam identificar as <strong>sete mais importantes</strong> e, delas, as <strong>três principais</strong>. O objetivo não é a melhor arquitetura possível, mas a <em>menos pior</em> para o conjunto de restrições.</p>
<h3>Torne mensurável com cenários</h3>
<p>"O sistema deve ser rápido" não é verificável. Use cenários de atributo de qualidade (do SEI): <em>fonte do estímulo, estímulo, ambiente, artefato, resposta, medida da resposta</em>. Exemplo: "Com 5.000 usuários simultâneos em operação normal, a listagem de tarefas de um projeto responde em até 300 ms no percentil 99."</p>
`,
  code: [
    {
      t: "Característica virando teste: fitness function de latência com k6",
      src: `// busca.k6.js — o k6 encerra com erro se algum threshold falhar, e o pipeline para
import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    listagem: { executor: "constant-arrival-rate", rate: 500, timeUnit: "1s",
                duration: "5m", preAllocatedVUs: 200 },
  },
  thresholds: {
    http_req_duration: ["p(99)<300"], // p99 abaixo de 300 ms
    http_req_failed: ["rate<0.001"],  // menos de 0,1% de erros
  },
};

export default function () {
  const r = http.get(__ENV.BASE_URL + "/projetos/p-42/tarefas?status=aberta", {
    headers: { Authorization: "Bearer " + __ENV.TOKEN },
  });
  check(r, { "status 200": (res) => res.status === 200 });
}
// k6 run -e BASE_URL=https://staging.tarefas.exemplo -e TOKEN=... busca.k6.js`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Para um app de delivery de comida, liste as 7 características mais importantes e escolha as 3 principais. Justifique cada uma com uma frase do negócio." },
    { lvl: 2, text: "Escreva 5 cenários de atributo de qualidade completos (seis partes) para um sistema de vendas de ingressos de shows." },
    { lvl: 2, text: "Pratique com os <strong>Architectural Katas</strong> (Ted Neward): resolva 3 katas identificando características antes de escolher qualquer tecnologia." },
    { lvl: 3, text: "Transforme 3 características de um projeto seu em fitness functions automatizadas (latência com k6, dependências com dependency-cruiser, vulnerabilidades com <code>npm audit</code>) rodando no CI." },
  ],
  refs: [
    { t: "ISO/IEC 25010: modelo de qualidade de produto", u: "https://iso25000.com/index.php/en/iso-25000-standards/iso-25010" },
    { t: "Architectural Katas (Neal Ford)", u: "https://nealford.com/katas/" },
    { t: "Livro: Software Architecture in Practice, 4ª ed. (Bass, Clements, Kazman)", u: "https://www.oreilly.com/library/view/software-architecture-in/9780136885979/" },
    { t: "Grafana k6: documentação", u: "https://grafana.com/docs/k6/latest/" },
    { t: "arc42: modelo de qualidade Q42", u: "https://quality.arc42.org/" },
  ],
});

T({
  id: "decisoes",
  phase: "p-arq",
  title: "Decisões e trade-offs: ADRs e ATAM",
  level: "Intermediário",
  hours: 12,
  summary: "Como analisar alternativas, registrar decisões com ADRs e avaliar uma arquitetura de forma estruturada.",
  body: `
<p>O produto do trabalho de um arquiteto não é o diagrama: é a <strong>decisão bem fundamentada</strong>. Decisões não registradas se perdem quando as pessoas saem, e o time seguinte as desfaz sem saber por que foram tomadas, ou as mantém por medo sem saber se ainda fazem sentido.</p>
<h3>Architecture Decision Records (ADRs)</h3>
<p>Proposto por Michael Nygard em 2011, o ADR é um documento curto, versionado junto com o código, para cada decisão significativa. Estrutura mínima:</p>
<ol>
<li><strong>Título</strong> numerado: "ADR-007: Usar PostgreSQL como banco principal"</li>
<li><strong>Status</strong>: proposto, aceito, substituído por ADR-0xx, depreciado</li>
<li><strong>Contexto</strong>: as forças em jogo, incluindo restrições técnicas, políticas e de prazo</li>
<li><strong>Decisão</strong>: em voz ativa e afirmativa ("Vamos usar…")</li>
<li><strong>Consequências</strong>: boas <em>e</em> ruins. Se só tem consequências boas, faltou análise</li>
</ol>
<p>ADRs são imutáveis: quando a decisão muda, escreve-se um novo ADR que substitui o antigo. O histórico conta a evolução do sistema.</p>
<h3>Analisando trade-offs</h3>
<ul>
<li>Liste as alternativas reais (inclusive "não fazer nada").</li>
<li>Avalie cada uma contra as características prioritárias, não contra uma lista genérica.</li>
<li>Para decisões caras de reverter, faça uma <strong>prova de conceito</strong> curta e com critério de sucesso definido antes.</li>
<li>Diferencie decisões de "porta de mão única" (caras de reverter, decida com cuidado) e de "porta de mão dupla" (baratas, decida rápido), como descreve Jeff Bezos.</li>
</ul>
<h3>ATAM e avaliações leves</h3>
<p>O <strong>ATAM</strong> (Architecture Tradeoff Analysis Method, do SEI) avalia uma arquitetura com stakeholders a partir de cenários priorizados, identificando pontos de sensibilidade, trade-offs e riscos. É pesado; na prática, times usam versões leves como <em>risk storming</em>: cada pessoa marca riscos num diagrama C4, e o grupo discute onde as marcações se concentram.</p>
`,
  code: [
    {
      t: "Um ADR completo (docs/adr/0005-fila-de-jobs.md)",
      src: `# ADR-0005: Usar BullMQ (Redis) para jobs assíncronos

Status: Aceito (2026-10-22). Substitui o ADR-0002.

## Contexto
Hoje os e-mails de convite e os lembretes de prazo são enviados dentro da requisição.
Quando o provedor de e-mail fica lento, o cadastro de membros leva até 8 segundos.
Os resumos gerados por IA (planejados) podem levar 20 segundos e custam dinheiro por chamada.
Já usamos Redis para cache; o time nunca operou RabbitMQ nem Kafka.

## Decisão
Vamos processar trabalho assíncrono com BullMQ sobre o Redis existente,
num processo worker separado da API.

## Alternativas consideradas
- pg-boss (fila no PostgreSQL): nenhuma infraestrutura nova, mas menos recursos
  (prioridades, limites por fila, painel) e carga extra no banco principal.
- RabbitMQ/SQS: mais robustos para alto volume, mas é mais um sistema para operar.
- Promise sem await: simples, mas o trabalho se perde se o processo cair.

## Consequências
+ Requisições de cadastro voltam a responder em < 200 ms.
+ Retries com backoff e limite de concorrência por fila (protege o provedor de IA).
- O Redis passa a guardar dados que importam: precisa de persistência (AOF) e backup.
- Jobs precisam ser idempotentes; revisão de código passa a checar isso.
- Mais um processo para implantar e monitorar (o worker).`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Adicione a pasta <code>docs/adr</code> a um projeto seu e escreva 3 ADRs sobre decisões que você já tomou sem registrar (banco, framework, estrutura de pastas)." },
    { lvl: 2, text: "Use a ferramenta <code>adr-tools</code> ou <code>log4brains</code> para gerar e publicar o histórico de decisões como site." },
    { lvl: 2, text: "Escolha uma decisão polêmica (ex.: monolito vs. microsserviços para uma startup) e escreva dois ADRs opostos, cada um defendendo bem um lado." },
    { lvl: 3, text: "Conduza uma sessão de risk storming com 2–3 colegas sobre um sistema real e registre os riscos com plano de mitigação." },
  ],
  refs: [
    { t: "Michael Nygard: Documenting Architecture Decisions", u: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions" },
    { t: "adr.github.io: modelos e ferramentas", u: "https://adr.github.io/" },
    { t: "log4brains", u: "https://github.com/thomvaill/log4brains" },
    { t: "SEI: ATAM", u: "https://insights.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/" },
    { t: "Risk Storming (Simon Brown)", u: "https://riskstorming.com/" },
    { t: "Livro: Software Architecture: The Hard Parts (Ford, Richards, Sadalage, Dehghani)", u: "https://www.oreilly.com/library/view/software-architecture-the/9781492086888/" },
  ],
});

T({
  id: "documentacao",
  phase: "p-arq",
  title: "Comunicar arquitetura: C4, arc42 e diagramas como código",
  level: "Intermediário",
  hours: 15,
  summary: "O modelo C4 em quatro níveis de zoom, o template arc42 e como manter diagramas vivos no repositório.",
  body: `
<p>Um diagrama que ninguém entende não comunica nada. Caixas e setas sem legenda, sem nível de abstração consistente, são a regra nas empresas. O <strong>modelo C4</strong>, criado por Simon Brown, resolve isso com quatro níveis de zoom, como num mapa:</p>
<ol>
<li><strong>Contexto</strong>: o sistema como uma caixa, os usuários e os sistemas externos. Para qualquer público, inclusive não técnico.</li>
<li><strong>Contêineres</strong>: as unidades executáveis ou de armazenamento (API, front-end, worker, banco, fila). Não confunda com Docker: é "algo que roda ou guarda dados".</li>
<li><strong>Componentes</strong>: os principais blocos dentro de um contêiner (no NestJS, costumam ser os módulos).</li>
<li><strong>Código</strong>: classes. Raramente vale desenhar à mão; deixe para o editor.</li>
</ol>
<p>Além dos quatro, existem diagramas suplementares: dinâmico (sequência de um fluxo) e de implantação (onde cada contêiner roda).</p>
<h3>Diagramas como código</h3>
<p>Diagramas em ferramentas de desenho envelhecem e divergem do sistema. Escrevê-los como texto no repositório permite revisão em pull request e geração automática. Opções: <strong>Structurizr DSL</strong> (um modelo, várias visões), <strong>PlantUML com C4-PlantUML</strong>, <strong>Mermaid</strong> (renderiza direto no GitHub). Para o nível de código e de módulos, o <strong>dependency-cruiser</strong> gera o grafo real de dependências a partir dos imports, o que é ótimo para comparar o desenho com a realidade.</p>
<h3>arc42</h3>
<p>Template de documentação em 12 seções (objetivos, restrições, contexto, estratégia de solução, visão de blocos, visão de runtime, implantação, conceitos transversais, decisões, requisitos de qualidade, riscos, glossário). Use como checklist do que documentar, não como formulário a preencher inteiro.</p>
`,
  code: [
    {
      t: "Structurizr DSL: um modelo, várias visões",
      src: `workspace "Tarefas" {
  model {
    usuario = person "Usuário"
    tarefas = softwareSystem "Plataforma de Tarefas" {
      web    = container "Web App" "Interface" "React"
      api    = container "API" "Projetos, tarefas e membros" "TypeScript, NestJS"
      worker = container "Worker" "E-mails, lembretes, resumos com IA" "TypeScript, BullMQ"
      banco  = container "Banco" "" "PostgreSQL" "Database"
      redis  = container "Redis" "Cache e filas" "Redis" "Queue"
    }
    ia = softwareSystem "API de modelo de IA" "Externo"

    usuario -> web "Organiza o trabalho pelo navegador"
    web -> api "JSON/HTTPS"
    api -> banco "Lê e grava" "SQL (Prisma)"
    api -> redis "Cache e enfileira jobs"
    worker -> redis "Consome jobs"
    worker -> banco "Lê atividades"
    worker -> ia "Pede resumos" "HTTPS"
  }
  views {
    systemContext tarefas { include * autolayout lr }
    container tarefas     { include * autolayout lr }
  }
}`,
    },
    {
      t: "Mermaid C4 (renderiza no GitHub)",
      src: `C4Context
  title Contexto: Plataforma de Tarefas
  Person(usuario, "Usuário")
  System(tarefas, "Plataforma de Tarefas", "Projetos, tarefas e resumos com IA")
  System_Ext(ia, "API de modelo de IA")
  System_Ext(email, "Provedor de e-mail")
  Rel(usuario, tarefas, "Organiza o trabalho")
  Rel(tarefas, ia, "Pede resumos via HTTPS")
  Rel(tarefas, email, "Envia convites e lembretes")`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Desenhe os níveis 1 e 2 do C4 de um sistema que você conhece bem usando Structurizr DSL. Mostre para alguém não técnico o nível 1 e veja se ele entende sem explicação." },
    { lvl: 2, text: "Documente um projeto seu com arc42 em formato leve (no máximo 6 páginas), em Markdown no repositório." },
    { lvl: 2, text: "Gere o grafo de dependências entre módulos com <code>depcruise --output-type dot</code> e compare com o diagrama de componentes que você desenhou à mão. O que divergiu?" },
    { lvl: 3, text: "Apresente uma arquitetura em 10 minutos para três públicos diferentes (diretoria, time de produto, desenvolvedores) usando níveis C4 diferentes. Grave e assista criticamente." },
  ],
  refs: [
    { t: "c4model.com", u: "https://c4model.com/" },
    { t: "Structurizr", u: "https://structurizr.com/" },
    { t: "C4-PlantUML", u: "https://github.com/plantuml-stdlib/C4-PlantUML" },
    { t: "Mermaid: diagramas C4", u: "https://mermaid.js.org/syntax/c4.html" },
    { t: "arc42", u: "https://arc42.org/" },
    { t: "Livro: The C4 Model for Visualising Software Architecture (Simon Brown)", u: "https://leanpub.com/visualising-software-architecture" },
  ],
});

/* ---------- Domain-Driven Design ---------- */

T({
  id: "ddd-estrategico",
  phase: "p-ddd",
  title: "DDD estratégico",
  level: "Avançado",
  hours: 25,
  summary: "Linguagem ubíqua, subdomínios, bounded contexts e context mapping: as fronteiras que importam.",
  body: `
<p>Domain-Driven Design, de Eric Evans (2003), é a abordagem mais influente para lidar com complexidade de negócio. A parte <strong>estratégica</strong> é a mais valiosa para arquitetos, e a mais negligenciada: times aprendem entidades e repositórios e pulam o que realmente define fronteiras.</p>
<h3>Linguagem ubíqua</h3>
<p>Desenvolvedores e especialistas do negócio usam as <strong>mesmas palavras</strong> com o mesmo significado, no código, nas conversas e nos documentos. Se o negócio diz "apólice" e o código diz <code>Contract</code>, há uma tradução silenciosa em cada conversa, e traduções geram bugs.</p>
<h3>Subdomínios</h3>
<ul>
<li><strong>Core</strong>: o que diferencia a empresa no mercado. Merece os melhores desenvolvedores, o modelo mais cuidadoso, código próprio.</li>
<li><strong>Supporting</strong>: necessário, específico do negócio, mas não diferencia. Faça simples.</li>
<li><strong>Generic</strong>: problema resolvido (autenticação, faturamento, e-mail). Compre ou use SaaS.</li>
</ul>
<p>Essa classificação orienta onde investir esforço de arquitetura e é uma das decisões mais estratégicas que você vai ajudar a tomar.</p>
<h3>Bounded contexts</h3>
<p>Um modelo só é consistente dentro de uma fronteira. "Produto" no catálogo tem descrição, fotos e categorias; no estoque tem localização e quantidade; no faturamento tem NCM e alíquota. Tentar um único modelo de "Produto" para tudo gera uma classe gigante que ninguém consegue mudar. Cada <strong>bounded context</strong> tem seu próprio modelo e sua linguagem. Bounded contexts são candidatos naturais a módulos ou serviços.</p>
<h3>Context mapping</h3>
<p>Como os contextos se relacionam: <em>Partnership, Shared Kernel, Customer/Supplier, Conformist, Anticorruption Layer (ACL), Open Host Service, Published Language, Separate Ways</em>. A ACL é a mais usada na prática: uma camada que traduz o modelo de um sistema externo (ou legado) para o seu, impedindo que o modelo alheio contamine o seu domínio.</p>
`,
  code: [
    {
      t: "Anticorruption Layer para um ERP legado",
      src: `// Modelo do legado: nomes estranhos, códigos mágicos
type ErpClienteDto = { CD_CLI: string; NM_RAZAO: string; TP_PES: string; FL_ATIVO: string };

// Nosso modelo, na nossa linguagem
type Cliente = { id: ClienteId; nome: string; tipo: "fisica" | "juridica"; ativo: boolean };

export interface ClientesPort {
  buscar(id: ClienteId): Promise<Cliente | null>;
}

// A ACL é o único lugar que conhece os dois
@Injectable()
export class ClientesErpAcl implements ClientesPort {
  constructor(private readonly erp: ErpHttpClient) {}

  async buscar(id: ClienteId): Promise<Cliente | null> {
    const dto = await this.erp.consultarCliente(id);
    return dto ? traduzir(dto) : null;
  }
}

function traduzir(d: ErpClienteDto): Cliente {
  const tipos: Record<string, Cliente["tipo"]> = { F: "fisica", J: "juridica" };
  const tipo = tipos[d.TP_PES];
  if (!tipo) throw new DadoLegadoInvalido("TP_PES=" + d.TP_PES);
  return { id: d.CD_CLI.trim() as ClienteId, nome: d.NM_RAZAO.trim(), tipo, ativo: d.FL_ATIVO === "S" };
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Para uma clínica veterinária, liste subdomínios e classifique em core, supporting e generic. Diga o que você compraria pronto." },
    { lvl: 2, text: "Desenhe o context map de um e-commerce com pelo menos 6 bounded contexts, nomeando o tipo de relacionamento entre cada par." },
    { lvl: 2, text: "Escreva um glossário de linguagem ubíqua de 20 termos para um domínio que você conhece, incluindo termos que mudam de significado entre contextos." },
    { lvl: 3, text: "Use o <strong>Bounded Context Canvas</strong> (DDD Crew) para documentar 3 contextos do seu e-commerce, incluindo mensagens de entrada e saída." },
  ],
  refs: [
    { t: "Livro: Domain-Driven Design (Eric Evans), o \"livro azul\"", u: "https://www.domainlanguage.com/ddd/" },
    { t: "Livro: Learning Domain-Driven Design (Vlad Khononov)", u: "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/", note: "a melhor porta de entrada hoje" },
    { t: "Livro: Implementing Domain-Driven Design (Vaughn Vernon), o \"livro vermelho\"", u: "https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/" },
    { t: "DDD Crew: canvases e guias gratuitos", u: "https://github.com/ddd-crew" },
    { t: "DDD Reference (Evans, gratuito)", u: "https://www.domainlanguage.com/ddd/reference/" },
    { t: "Martin Fowler: Bounded Context", u: "https://martinfowler.com/bliki/BoundedContext.html" },
  ],
});

T({
  id: "event-storming",
  phase: "p-ddd",
  title: "Ferramentas de descoberta: EventStorming e outras",
  level: "Intermediário",
  hours: 10,
  summary: "EventStorming, Business Model Canvas, User Story Mapping e Domain Storytelling para descobrir o domínio com o negócio.",
  body: `
<p>Criado por Alberto Brandolini, o <strong>Event Storming</strong> é um workshop com post-its numa parede longa (ou num quadro como o Miro) em que especialistas de negócio e técnicos mapeiam um processo a partir dos <strong>eventos de domínio</strong>, sempre no passado: "Tarefa criada", "Membro convidado", "Prazo vencido".</p>
<h3>Os três níveis</h3>
<ol>
<li><strong>Big Picture</strong>: o negócio inteiro, caótico de propósito. Revela gargalos, conflitos de entendimento e hotspots (dúvidas, problemas).</li>
<li><strong>Process Level</strong>: um processo detalhado com a gramática completa: ator → comando → agregado/sistema → evento → política → novo comando, mais read models.</li>
<li><strong>Design Level</strong>: o desenho que vira código, com agregados e suas regras.</li>
</ol>
<h3>As cores convencionais</h3>
<p>Laranja: evento. Azul: comando. Amarelo claro: agregado. Amarelo pequeno: ator. Lilás: política ("sempre que X, então Y"). Rosa: sistema externo. Verde: read model. Vermelho/rosa forte: hotspot.</p>
<h3>Por que arquitetos precisam disso</h3>
<p>As fronteiras de bounded contexts aparecem naturalmente onde a linguagem muda, onde os atores mudam e onde eventos pivotais dividem o fluxo. É a forma mais confiável de achar fronteiras de serviços <em>antes</em> de escrever código. Complementos úteis: <strong>Domain Storytelling</strong> (narrativas com pictogramas) e <strong>Example Mapping</strong> (regras e exemplos para uma história).</p>

<h3>As outras ferramentas do seu roadmap</h3>
<dl class="defs">
<dt>Business Model Canvas</dt><dd>Nove blocos (segmentos de clientes, proposta de valor, canais, relacionamento, receitas, recursos, atividades, parcerias, custos) numa página. Ajuda a entender o negócio e a identificar o subdomínio core: onde está a vantagem competitiva.</dd>
<dt>User Story Mapping</dt><dd>De Jeff Patton: as atividades do usuário em ordem na horizontal, as histórias detalhadas abaixo, fatiadas em releases. Mostra o fluxo inteiro e ajuda a definir o MVP sem perder a visão do todo.</dd>
<dt>Domain Storytelling</dt><dd>Especialistas contam como trabalham e alguém desenha a história com pictogramas (atores, objetos de trabalho, atividades numeradas). Ótimo para processos com muitas pessoas e documentos.</dd>
</dl>`,
  code: [
  ],
  exercises: [
    { lvl: 1, text: "Sozinho, faça um Big Picture do processo de matrícula numa faculdade, com pelo menos 30 eventos. Use o Miro, já que você já trabalha nele." },
    { lvl: 2, text: "Conduza um Event Storming de 2 horas com 3 pessoas (amigos, colegas) sobre um processo que uma delas conhece bem. Registre os hotspots." },
    { lvl: 3, text: "A partir do seu Event Storming, identifique os bounded contexts, desenhe o context map e implemente um dos agregados em TypeScript com testes." },
  ],
  refs: [
    { t: "Livro: Introducing EventStorming (Alberto Brandolini)", u: "https://leanpub.com/introducing_eventstorming" },
    { t: "eventstorming.com", u: "https://www.eventstorming.com/" },
    { t: "DDD Crew: EventStorming Glossary & Cheat Sheet", u: "https://github.com/ddd-crew/eventstorming-glossary-cheat-sheet" },
    { t: "Domain Storytelling", u: "https://domainstorytelling.org/" },
    { t: "DDD Crew: DDD Starter Modelling Process", u: "https://github.com/ddd-crew/ddd-starter-modelling-process" },
    { t: "Strategyzer: Business Model Canvas", u: "https://www.strategyzer.com/library/the-business-model-canvas" },
    { t: "Jeff Patton: User Story Mapping", u: "https://jpattonassociates.com/story-mapping/" },
  ],
});

T({
  id: "ddd-tatico",
  phase: "p-ddd",
  title: "DDD tático em TypeScript",
  level: "Avançado",
  hours: 25,
  summary: "Entidades, value objects, agregados, eventos de domínio, repositórios e serviços de domínio.",
  body: `
<p>Os padrões táticos são as ferramentas para implementar um modelo rico <em>dentro</em> de um bounded context.</p>
<dl class="defs">
<dt>Value Object</dt><dd>Definido pelos atributos, imutável, sem identidade: <code>Dinheiro</code>, <code>Email</code>, <code>Periodo</code>. Em TypeScript, use classes com campos <code>readonly</code> e construtor privado com uma função de criação que valida, ou tipos com marca (<em>branded</em>). Concentre regras neles: um <code>Dinheiro</code> que não soma moedas diferentes elimina uma categoria inteira de bug.</dd>
<dt>Entidade</dt><dd>Tem identidade que persiste ao longo do tempo, mesmo que atributos mudem: <code>Usuario</code>, <code>Tarefa</code>.</dd>
<dt>Agregado</dt><dd>Grupo de entidades e value objects tratados como unidade de consistência, com uma <strong>raiz</strong> que é o único ponto de entrada. Regras: (1) proteja invariantes dentro do agregado; (2) mantenha agregados pequenos; (3) referencie outros agregados por ID, não por objeto; (4) altere um agregado por transação; consistência entre agregados é eventual.</dd>
<dt>Evento de domínio</dt><dd>Algo significativo que aconteceu, no passado: <code>TarefaConcluida</code>. Conecta agregados e contextos sem acoplá-los.</dd>
<dt>Repositório</dt><dd>Abstração de coleção para agregados. Um repositório por agregado (raiz), nunca por tabela.</dd>
<dt>Serviço de domínio</dt><dd>Lógica de domínio que não pertence naturalmente a nenhuma entidade (ex.: mover uma tarefa entre dois projetos com regras diferentes).</dd>
</dl>
<h3>Modelo anêmico: o antipadrão mais comum</h3>
<p>Objetos só com dados, e toda a lógica em <code>Services</code>. É ainda mais tentador em TypeScript, onde o modelo gerado pelo Prisma já é um tipo pronto. As regras se espalham, invariantes não são protegidas e qualquer código pode deixar uma tarefa em estado inválido. Fowler chama isso de <em>Anemic Domain Model</em>. A correção: métodos de comportamento com nomes do negócio (<code>tarefa.concluir()</code>) em vez de <code>prisma.tarefa.update({ data: { status: "concluida" } })</code> espalhado pelo código.</p>

<h3>Factory</h3>
<p>Quando criar um agregado exige regras ou montar várias partes, a criação vai para uma <strong>Factory</strong> (método estático no próprio agregado, como <code>Projeto.criar(...)</code>, ou classe dedicada). Assim o construtor não vira um labirinto e o objeto nunca nasce em estado inválido. Uma segunda factory, <code>reconstituir(...)</code>, recria o objeto a partir do banco sem repetir as validações de criação nem disparar eventos.</p>`,
  code: [
    {
      t: "Agregado Projeto protegendo invariantes",
      src: `type Papel = "dono" | "editor" | "leitor";
type Membro = { readonly usuarioId: UserId; readonly papel: Papel };

export class Projeto {
  static readonly MAX_MEMBROS = 50;
  #eventos: EventoDominio[] = [];

  private constructor(
    readonly id: ProjectId,
    private nome: string,
    private membros: Membro[],
    private arquivado: boolean,
  ) {}

  static criar(id: ProjectId, nome: string, donoId: UserId): Projeto {
    const p = new Projeto(id, nomeValido(nome), [{ usuarioId: donoId, papel: "dono" }], false);
    p.#eventos.push({ tipo: "ProjetoCriado", projetoId: id, donoId });
    return p;
  }

  convidar(quem: UserId, novo: UserId, papel: Exclude<Papel, "dono">): void {
    this.exigirAtivo();
    if (this.papelDe(quem) !== "dono") throw new RegraViolada("sem-permissao", "Só o dono convida");
    if (this.membros.length >= Projeto.MAX_MEMBROS) throw new RegraViolada("limite-membros", "Limite de membros atingido");
    if (this.papelDe(novo)) return; // já é membro: idempotente
    this.membros.push({ usuarioId: novo, papel });
    this.#eventos.push({ tipo: "MembroConvidado", projetoId: this.id, usuarioId: novo });
  }

  papelDe(usuarioId: UserId): Papel | undefined {
    return this.membros.find((m) => m.usuarioId === usuarioId)?.papel;
  }

  listarMembros(): readonly Membro[] { return [...this.membros]; } // sem vazar o array interno

  retirarEventos(): EventoDominio[] {
    const e = this.#eventos;
    this.#eventos = [];
    return e;
  }

  private exigirAtivo(): void {
    if (this.arquivado) throw new RegraViolada("projeto-arquivado", "Projeto arquivado");
  }
}`,
    },
    {
      t: "Value Object Dinheiro",
      src: `export class Dinheiro {
  // centavos inteiros: nada de 0.1 + 0.2 = 0.30000000000000004
  private constructor(readonly centavos: number, readonly moeda: "BRL" | "USD") {}

  static de(centavos: number, moeda: "BRL" | "USD" = "BRL"): Dinheiro {
    if (!Number.isSafeInteger(centavos)) throw new Error("Valor em centavos deve ser inteiro");
    return new Dinheiro(centavos, moeda);
  }

  mais(outro: Dinheiro): Dinheiro {
    if (outro.moeda !== this.moeda) throw new Error("Moedas diferentes");
    return Dinheiro.de(this.centavos + outro.centavos, this.moeda);
  }

  vezes(n: number): Dinheiro {
    return Dinheiro.de(Math.round(this.centavos * n), this.moeda);
  }

  igual(outro: Dinheiro): boolean {
    return this.centavos === outro.centavos && this.moeda === outro.moeda;
  }
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Modele o agregado <code>Reserva</code> de um hotel (quartos, período, hóspedes) com invariantes: sem sobreposição de datas para o mesmo quarto dentro da reserva, máximo de hóspedes por quarto." },
    { lvl: 2, text: "Pegue um projeto com modelo anêmico e mova 5 regras dos services para dentro das entidades. Escreva testes de domínio para cada regra." },
    { lvl: 2, text: "Publique os eventos de domínio do agregado <code>Projeto</code> depois que a transação confirmar, usando uma tabela de outbox e um worker." },
    { lvl: 3, text: "Resolva o problema clássico: um agregado <code>Turma</code> com 10.000 alunos fica lento. Redesenhe as fronteiras do agregado e justifique a mudança de invariante para consistência eventual." },
  ],
  refs: [
    { t: "Vaughn Vernon: Effective Aggregate Design (3 partes, PDF)", u: "https://www.dddcommunity.org/library/vernon_2011/" },
    { t: "Martin Fowler: Anemic Domain Model", u: "https://martinfowler.com/bliki/AnemicDomainModel.html" },
    { t: "domain-driven-hexagon: DDD e hexagonal com NestJS (repositório de referência)", u: "https://github.com/Sairyss/domain-driven-hexagon" },
    { t: "Khalil Stemmler: DDD e arquitetura com TypeScript", u: "https://khalilstemmler.com/" },
    { t: "Livro: Domain-Driven Design Distilled (Vaughn Vernon)", u: "https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/" },
    { t: "Livro: Aprenda Domain-Driven Design (Vlad Khononov)", u: "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/", note: "indicado no seu quadro" },
  ],
});

/* ---------- Estilos de arquitetura ---------- */

T({
  id: "camadas-monolito",
  phase: "p-estilos",
  title: "Arquitetura em camadas e monolito",
  level: "Base",
  hours: 10,
  summary: "Arquitetura em camadas, particionamento técnico vs. por domínio e por que monolitos não são o vilão.",
  body: `
<p>A arquitetura em camadas (apresentação, aplicação/negócio, persistência, banco) é o padrão de fato de muitos sistemas. É simples, conhecida por todos e barata. Seu problema não é existir, mas o tipo de particionamento que ela favorece.</p>
<h3>Particionamento técnico vs. por domínio</h3>
<p>Camadas organizam o código por <strong>tipo técnico</strong>: todos os controllers juntos, todos os repositórios juntos. Mas mudanças de negócio são por <strong>domínio</strong>: "adicionar etiquetas às tarefas" toca controller, serviço, repositório e banco, ou seja, todas as camadas. A alternativa é particionar primeiro por domínio (projetos, tarefas, identidade) e só dentro de cada módulo organizar camadas. Essa é a lógica da <em>Lei de Conway</em> aplicada ao código: times de domínio trabalham em módulos de domínio. O NestJS já empurra você nessa direção com os <code>@Module</code>.</p>
<h3>Camadas abertas e fechadas</h3>
<p>Numa camada fechada, a requisição precisa passar por ela; numa aberta, pode pular. Pular camadas parece economia, mas cria acoplamento: a apresentação passa a depender da persistência. O antipadrão <em>architecture sinkhole</em> acontece quando a maioria das requisições atravessa camadas que nada fazem além de repassar.</p>
<h3>Quando um monolito é a escolha certa</h3>
<p>Times pequenos, domínio ainda incerto, produto novo, orçamento de operação limitado. Martin Fowler argumenta pelo <em>Monolith First</em>: quase todas as histórias de microsserviços bem-sucedidas começaram como um monolito que ficou grande demais. Começar com microsserviços exige acertar as fronteiras de primeira, e isso quase nunca acontece.</p>
`,
  code: [
    {
      t: "Organização por domínio dentro de um monolito NestJS",
      src: `src/
├── modules/
│   ├── tarefas/              ← módulo de domínio
│   │   ├── api/              (controllers, schemas zod)
│   │   ├── aplicacao/        (casos de uso)
│   │   ├── dominio/          (entidades, regras)
│   │   ├── infra/            (Prisma, clientes externos)
│   │   ├── tarefas.module.ts
│   │   └── index.ts          (o que o módulo expõe para os outros)
│   ├── projetos/
│   └── identidade/
├── app.module.ts
└── main.ts

// Em vez de:
src/controllers/ · src/services/ · src/repositories/`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Pegue um projeto organizado por camadas técnicas e reorganize por domínio. Conte quantos arquivos você precisa tocar para uma mudança típica antes e depois." },
    { lvl: 2, text: "Escreva um ADR justificando um monolito para uma startup de 4 desenvolvedores, incluindo os sinais que indicariam a hora de reconsiderar." },
  ],
  refs: [
    { t: "Martin Fowler: Monolith First", u: "https://martinfowler.com/bliki/MonolithFirst.html" },
    { t: "Martin Fowler: Presentation Domain Data Layering", u: "https://martinfowler.com/bliki/PresentationDomainDataLayering.html" },
    { t: "NestJS: Modules", u: "https://docs.nestjs.com/modules" },
    { t: "Mark Richards: Developer to Architect (lições, livros e vídeos)", u: "https://www.developertoarchitect.com/" },
  ],
});

T({
  id: "hexagonal",
  phase: "p-estilos",
  title: "Clean Architecture, Hexagonal e Onion",
  level: "Intermediário",
  hours: 20,
  summary: "Ports and adapters: o domínio no centro, frameworks e infraestrutura na borda.",
  body: `
<p>Alistair Cockburn propôs a arquitetura hexagonal (<em>Ports and Adapters</em>) em 2005. Onion (Jeffrey Palermo) e Clean Architecture (Robert Martin) são variações da mesma ideia: <strong>o núcleo de negócio não conhece o mundo externo</strong>. Banco, HTTP, mensageria e frameworks são detalhes plugáveis.</p>
<h3>Os elementos</h3>
<ul>
<li><strong>Domínio</strong>: entidades, value objects, regras. TypeScript puro: nenhum import de <code>@nestjs</code> ou <code>@prisma</code>.</li>
<li><strong>Portas de entrada</strong> (driving ports): os casos de uso que o mundo externo pode chamar.</li>
<li><strong>Portas de saída</strong> (driven ports): abstrações que o domínio precisa (persistir, notificar, pedir um resumo à IA).</li>
<li><strong>Adaptadores de entrada</strong>: controller REST, processor de fila, CLI, teste. Chamam as portas de entrada.</li>
<li><strong>Adaptadores de saída</strong>: repositório Prisma, cliente HTTP, publicador de eventos. Implementam as portas de saída.</li>
</ul>
<p>A regra de dependência: <strong>setas sempre apontam para dentro</strong>. O adaptador Prisma depende do domínio; nunca o contrário.</p>
<h3>Quando vale e quando é exagero</h3>
<p>Vale quando o domínio é rico, as regras mudam muito e você quer testar regras sem infraestrutura. É exagero num CRUD simples: mapear modelo do Prisma ↔ entidade de domínio ↔ DTO para um cadastro de 5 campos triplica o código sem benefício. Arquitetos experientes aplicam hexagonal nos módulos complexos e mantêm os simples simples.</p>
<div class="callout"><b>Ponto de discordância conhecido:</b> separar o modelo do Prisma da entidade de domínio é o mais "puro", mas custa mapeamento. Usar os tipos gerados pelo Prisma direto nos casos de uso é pragmático e comum. Os dois são defensáveis; escolha conscientemente, por módulo, e registre num ADR.</div>
`,
  code: [
    {
      t: "Estrutura de pastas hexagonal num módulo NestJS",
      src: `src/modules/tarefas/
├── dominio/
│   ├── tarefa.ts                    (agregado, regras)
│   ├── etiqueta.ts                  (value object)
│   └── portas/
│       ├── tarefas.repository.ts    (abstract class: porta de saída)
│       └── notificador.ts
├── aplicacao/
│   ├── criar-tarefa.ts              (caso de uso: porta de entrada)
│   └── concluir-tarefa.ts
├── adaptadores/
│   ├── entrada/http/tarefas.controller.ts
│   ├── entrada/fila/prazo-vencido.processor.ts
│   ├── saida/prisma/tarefas.prisma.ts
│   └── saida/email/notificador-smtp.ts
└── tarefas.module.ts                (liga portas a adaptadores)`,
    },
    {
      t: "Caso de uso testável sem NestJS",
      src: `export class ConcluirTarefa {
  constructor(
    private readonly tarefas: TarefasRepository,
    private readonly notificador: Notificador,
    private readonly relogio: () => Date = () => new Date(),
  ) {}

  async executar(cmd: { tarefaId: TarefaId; usuarioId: UserId }): Promise<void> {
    const tarefa = await this.tarefas.porId(cmd.tarefaId);
    if (!tarefa) throw new TarefaNaoEncontrada(cmd.tarefaId);
    tarefa.concluir(cmd.usuarioId, this.relogio());
    await this.tarefas.salvar(tarefa);
    await this.notificador.tarefaConcluida(tarefa);
  }
}

// Teste: adaptadores falsos em memória, roda em milissegundos
const repo = new TarefasEmMemoria([umaTarefa({ id: "t1" })]);
const enviados: string[] = [];
const caso = new ConcluirTarefa(repo, { tarefaConcluida: async (t) => { enviados.push(t.id); } },
                                () => new Date("2026-10-22"));
await caso.executar({ tarefaId: "t1" as TarefaId, usuarioId: "u1" as UserId });`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Implemente o módulo de tarefas acima com dois adaptadores de persistência intercambiáveis (Prisma e em memória) e prove a troca nos testes." },
    { lvl: 2, text: "Adicione um segundo adaptador de entrada (um processor de fila ou uma CLI) que chama o mesmo caso de uso, sem alterar uma linha do domínio." },
    { lvl: 2, text: "Escreva regras no dependency-cruiser que garantam: domínio não depende de nada externo; aplicação depende só do domínio; adaptadores não se conhecem entre si." },
    { lvl: 3, text: "Estude o repositório <strong>domain-driven-hexagon</strong> e escreva uma crítica: onde você faria diferente e por quê." },
  ],
  refs: [
    { t: "Alistair Cockburn: Hexagonal Architecture", u: "https://alistair.cockburn.us/hexagonal-architecture/" },
    { t: "Robert C. Martin: The Clean Architecture", u: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html" },
    { t: "domain-driven-hexagon: hexagonal com NestJS", u: "https://github.com/Sairyss/domain-driven-hexagon" },
    { t: "Livro: Get Your Hands Dirty on Clean Architecture, 2ª ed. (Tom Hombergs)", u: "https://reflectoring.io/book/", note: "exemplos em Java, conceitos universais" },
    { t: "Herberto Graça: Explicit Architecture", u: "https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/" },
  ],
});

T({
  id: "modulith",
  phase: "p-estilos",
  title: "Monolito modular com NestJS",
  level: "Intermediário",
  hours: 20,
  summary: "Fronteiras de módulos verificadas no CI, comunicação por eventos e o caminho para extrair serviços quando preciso.",
  body: `
<p>O monolito modular é hoje uma das escolhas mais recomendadas para a maioria dos sistemas: <strong>fronteiras claras entre módulos de domínio, em um único deploy</strong>. Você ganha a organização dos microsserviços sem a complexidade operacional de um sistema distribuído.</p>
<h3>O problema que ele resolve</h3>
<p>Um monolito comum vira uma "grande bola de lama" porque nada impede que o módulo de tarefas consulte a tabela de usuários diretamente. Com o tempo, tudo depende de tudo. O monolito modular coloca regras explícitas: cada módulo tem uma API pública e internals escondidos, e a comunicação entre módulos acontece por chamadas a essa API ou, preferencialmente, por eventos.</p>
<h3>Como montar em NestJS</h3>
<p>O NestJS dá metade do caminho e você completa a outra metade com convenções e ferramentas:</p>
<ul>
<li>Cada pasta em <code>src/modules</code> é um <strong>módulo de domínio</strong> com seu <code>@Module</code>. Só o que está em <code>exports</code> pode ser injetado por outros módulos.</li>
<li>Um arquivo <code>index.ts</code> por módulo é a <strong>API pública</strong>: tipos e serviços que os outros podem importar. Todo o resto é interno.</li>
<li>O <strong>dependency-cruiser</strong> no CI garante a regra: importar um arquivo interno de outro módulo, ou criar um ciclo entre módulos, quebra o build. O Nest sozinho não impede imports diretos de arquivos.</li>
<li><strong>Dados por módulo</strong>: cada módulo é dono das suas tabelas (no PostgreSQL, um <em>schema</em> por módulo ajuda). Outro módulo não faz JOIN nelas; pede pela API ou mantém uma cópia a partir de eventos.</li>
<li><strong>Eventos entre módulos</strong>: <code>@nestjs/event-emitter</code> para eventos em memória. Para que nenhum evento se perca se o processo cair, grave-os numa tabela de <em>outbox</em> na mesma transação e entregue com um worker.</li>
<li>Quando um módulo precisar escalar ou ser implantado à parte, troque o transporte do evento (memória → fila) e extraia: as fronteiras já estão prontas.</li>
</ul>
<div class="callout"><b>Sinal de maturidade:</b> se você não consegue manter fronteiras limpas num monolito, microsserviços não vão salvar você. Vão só transformar acoplamento de código em acoplamento de rede, que é mais lento e mais difícil de depurar.</div>
`,
  code: [
    {
      t: "A API pública de um módulo",
      src: `// src/modules/projetos/index.ts — o único arquivo que outros módulos podem importar
export { ProjetosModule } from "./projetos.module.js";
export { ConsultaDeAcesso } from "./aplicacao/consulta-de-acesso.js";
export type { Papel } from "./dominio/papel.js";
export type { ProjetoArquivado, MembroRemovido } from "./dominio/eventos.js";

// src/modules/tarefas/aplicacao/criar-tarefa.ts
import { ConsultaDeAcesso } from "../../projetos/index.js";            // ✅ API pública
// import { ProjetosPrisma } from "../../projetos/infra/projetos.prisma.js"; // ❌ quebra o CI`,
    },
    {
      t: "Comunicação entre módulos por eventos",
      src: `// módulo projetos: publica
@Injectable()
export class ArquivarProjeto {
  constructor(private readonly projetos: ProjetosRepository, private readonly eventos: EventEmitter2) {}

  async executar(id: ProjectId, quem: UserId) {
    const projeto = await this.projetos.porId(id);
    projeto.arquivar(quem);
    await this.projetos.salvar(projeto);
    this.eventos.emit("projeto.arquivado", { projetoId: id } satisfies ProjetoArquivado);
  }
}

// módulo tarefas: reage, sem conhecer nada interno de projetos
@Injectable()
export class AoArquivarProjeto {
  constructor(private readonly tarefas: TarefasRepository) {}

  @OnEvent("projeto.arquivado", { async: true })
  async handle(e: ProjetoArquivado) {
    await this.tarefas.arquivarTodasDoProjeto(e.projetoId);
  }
}`,
    },
    {
      t: "Teste de um módulo isolado",
      src: `import { Test } from "@nestjs/testing";
import { EventEmitterModule, EventEmitter2 } from "@nestjs/event-emitter";

it("arquiva as tarefas quando o projeto é arquivado", async () => {
  const repo = new TarefasEmMemoria([umaTarefa({ projetoId: "p1" })]);
  const app = await Test.createTestingModule({
    imports: [EventEmitterModule.forRoot(), TarefasModule],   // só o módulo de tarefas
  })
    .overrideProvider(TarefasRepository).useValue(repo)
    .compile();
  await app.init();

  await app.get(EventEmitter2).emitAsync("projeto.arquivado", { projetoId: "p1" });

  expect(repo.todas().every((t) => t.arquivada)).toBe(true);
});`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Crie um monolito com os módulos identidade, projetos, tarefas e notificações. Introduza propositalmente um import interno entre módulos e veja o dependency-cruiser falhar." },
    { lvl: 2, text: "Implemente uma tabela de outbox: grave o evento na mesma transação da mudança, derrube a aplicação antes da entrega e prove que o worker entrega o evento ao reiniciar." },
    { lvl: 2, text: "Coloque cada módulo num schema próprio do PostgreSQL e elimine todos os JOINs entre schemas. Anote o que precisou mudar." },
    { lvl: 3, text: "Extraia o módulo de notificações para um processo independente, mantendo o resto como monolito. Escreva um ADR com os critérios que justificaram extrair este e não outro." },
  ],
  refs: [
    { t: "Kamil Grzybek: Modular Monolith Primer", u: "https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer" },
    { t: "Shopify: Deconstructing the Monolith", u: "https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity" },
    { t: "NestJS: Shared modules e exports", u: "https://docs.nestjs.com/modules" },
    { t: "NestJS: Events", u: "https://docs.nestjs.com/techniques/events" },
    { t: "dependency-cruiser", u: "https://github.com/sverweij/dependency-cruiser" },
    { t: "microservices.io: Transactional Outbox", u: "https://microservices.io/patterns/data/transactional-outbox.html" },
  ],
});

T({
  id: "microsservicos",
  phase: "p-estilos",
  title: "Arquitetura de Microsserviços",
  level: "Avançado",
  hours: 30,
  summary: "Granularidade, banco por serviço, comunicação, decomposição a partir de um monolito e os antipadrões mais caros.",
  body: `
<p>Microsserviços são serviços pequenos, implantáveis de forma independente, organizados em torno de capacidades de negócio, cada um dono dos seus dados. O benefício principal não é técnico: é <strong>organizacional</strong>. Permitem que muitos times entreguem de forma independente.</p>
<h3>O preço</h3>
<p>Cada chamada de rede pode falhar ou demorar. Transações entre serviços não existem. Depurar exige tracing distribuído. Cada serviço precisa de pipeline, monitoramento, alertas, segurança. A lista de "falácias da computação distribuída" (a rede é confiável, latência é zero, largura de banda é infinita...) passa a ser seu problema diário.</p>
<h3>Granularidade: integradores e desintegradores</h3>
<p>Em <em>Software Architecture: The Hard Parts</em>, Ford e Richards propõem pesar forças:</p>
<ul>
<li><strong>Separe quando</strong>: escopo e função diferentes, volatilidade de código diferente, escalabilidade diferente, tolerância a falhas diferente, requisitos de segurança diferentes.</li>
<li><strong>Junte quando</strong>: precisam de transação ACID entre si, compartilham muito código, há workflow síncrono intenso entre eles, há relacionamento de dados forte.</li>
</ul>
<h3>Antipadrões caros</h3>
<ul>
<li><strong>Monolito distribuído</strong>: serviços que precisam ser implantados juntos. Tem todo o custo e nenhum benefício.</li>
<li><strong>Banco compartilhado</strong>: dois serviços escrevendo na mesma tabela acabam acoplados pelo schema.</li>
<li><strong>Cadeias síncronas longas</strong>: A chama B que chama C que chama D. Disponibilidade total = produto das disponibilidades (0,99⁴ ≈ 0,96).</li>
<li><strong>Nanoserviços</strong>: serviços tão pequenos que todo caso de uso atravessa cinco deles.</li>
<li><strong>Pacote npm "comum" gigante</strong> compartilhado por todos os serviços: qualquer mudança nele obriga a atualizar e implantar todos juntos.</li>
</ul>
<h3>Migrando de um monolito: Strangler Fig</h3>
<p>Coloque um roteador na frente do monolito, extraia uma capacidade por vez para um serviço novo e redirecione o tráfego dela. O monolito vai encolhendo até poder ser desligado. Nunca reescreva tudo de uma vez.</p>
`,
  code: [
    {
      t: "Cliente HTTP tipado com timeout e validação da resposta",
      src: `import { z } from "zod";

const Disponibilidade = z.object({ usuarioId: z.string(), livreAPartirDe: z.coerce.date() });
type Disponibilidade = z.infer<typeof Disponibilidade>;

export class AgendaClient {
  constructor(private readonly baseUrl: string) {}

  async consultar(usuarioId: string): Promise<Disponibilidade> {
    const r = await fetch(this.baseUrl + "/disponibilidade/" + encodeURIComponent(usuarioId), {
      signal: AbortSignal.timeout(800), // NUNCA deixe sem timeout
      headers: { accept: "application/json" },
    });
    if (!r.ok) throw new FalhaRemota("agenda", r.status);
    // A resposta de outro serviço é unknown até ser validada: contratos mudam
    return Disponibilidade.parse(await r.json());
  }
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Leia o artigo <em>Microservices</em> de Lewis e Fowler e liste as 9 características com um exemplo de violação de cada." },
    { lvl: 2, text: "Pegue o monolito modular da fase anterior e extraia 2 serviços com Strangler Fig, usando Nginx ou Traefik como roteador. Mantenha o sistema funcionando a cada passo." },
    { lvl: 2, text: "Calcule a disponibilidade de um fluxo que passa por 6 serviços com 99,9% cada. Redesenhe para reduzir chamadas síncronas e recalcule." },
    { lvl: 3, text: "Para um sistema de streaming de vídeo, decida a granularidade dos serviços usando integradores e desintegradores. Apresente como uma tabela de forças e um ADR." },
  ],
  refs: [
    { t: "James Lewis & Martin Fowler: Microservices", u: "https://martinfowler.com/articles/microservices.html" },
    { t: "microservices.io (Chris Richardson): catálogo de padrões", u: "https://microservices.io/patterns/" },
    { t: "Livro: Building Microservices, 2ª ed. (Sam Newman)", u: "https://samnewman.io/books/building_microservices_2nd_edition/" },
    { t: "Livro: Monolith to Microservices (Sam Newman)", u: "https://samnewman.io/books/monolith-to-microservices/" },
    { t: "Livro: Microservices Patterns (Chris Richardson)", u: "https://microservices.io/book" },
    { t: "Martin Fowler: Strangler Fig Application", u: "https://martinfowler.com/bliki/StranglerFigApplication.html" },
    { t: "Fallacies of Distributed Computing", u: "https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing" },
    { t: "Livro: Criando Microsserviços, 2ª ed. (Sam Newman)", u: "https://samnewman.io/books/building_microservices_2nd_edition/", note: "indicado no seu quadro" },
  ],
});

T({
  id: "eda",
  phase: "p-estilos",
  title: "Arquitetura Orientada a Eventos (EDA)",
  level: "Avançado",
  hours: 20,
  summary: "Broker vs. mediator, tipos de evento, coreografia vs. orquestração e os problemas reais de sistemas assíncronos.",
  body: `
<p>Em arquitetura orientada a eventos (EDA), componentes reagem a fatos que aconteceram, em vez de serem chamados diretamente. O produtor não sabe quem consome. Isso dá desacoplamento, escala e extensibilidade, ao preço de consistência eventual e fluxos mais difíceis de enxergar.</p>
<h3>Tipos de evento</h3>
<ul>
<li><strong>Notificação de evento</strong>: "Tarefa 123 foi concluída". Pequeno; quem precisa de detalhes consulta a origem.</li>
<li><strong>Event-carried state transfer</strong>: o evento leva os dados necessários. Consumidores mantêm sua própria cópia e não chamam o produtor.</li>
<li><strong>Event sourcing</strong>: eventos são a fonte da verdade do estado (etapa de Arquiteto de Soluções).</li>
</ul>
<h3>Topologias</h3>
<table class="tbl"><thead><tr><th></th><th>Broker (coreografia)</th><th>Mediator (orquestração)</th></tr></thead><tbody>
<tr><td>Controle</td><td>Distribuído: cada serviço reage e publica</td><td>Central: um orquestrador comanda os passos</td></tr>
<tr><td>Vantagem</td><td>Desacoplamento, escala, fácil adicionar consumidores</td><td>Fluxo visível, tratamento de erro centralizado</td></tr>
<tr><td>Risco</td><td>Ninguém enxerga o fluxo inteiro; erro difícil de compensar</td><td>Orquestrador vira gargalo e ponto de acoplamento</td></tr>
<tr><td>Ferramentas</td><td>Kafka, RabbitMQ, SNS/SQS, Redis Streams</td><td>Temporal (tem SDK em TypeScript), AWS Step Functions</td></tr>
</tbody></table>
<h3>Problemas que você vai enfrentar</h3>
<ul>
<li><strong>Entrega pelo menos uma vez</strong>: o mesmo evento pode chegar duas vezes. Consumidores precisam ser <strong>idempotentes</strong>.</li>
<li><strong>Ordenação</strong>: garantida só dentro de uma partição. Use a chave do agregado como chave da mensagem.</li>
<li><strong>Evolução de schema</strong>: versione os eventos, só adicione campos opcionais e valide na entrada (zod, Avro ou Protobuf com Schema Registry).</li>
<li><strong>Mensagens envenenadas</strong>: uma mensagem que sempre falha trava a partição. Use retry com backoff e <em>dead letter queue</em>.</li>
<li><strong>Dual write</strong>: gravar no banco e publicar no broker não é atômico. Solução: Transactional Outbox (etapa de Arquiteto de Soluções).</li>
</ul>
`,
  code: [
    {
      t: "Consumidor idempotente com validação do evento",
      src: `import { z } from "zod";

const TarefaConcluida = z.object({
  eventoId: z.uuid(),
  versao: z.literal(1),
  tarefaId: z.string(),
  projetoId: z.string(),
  concluidaEm: z.coerce.date(),
});

export async function aoReceber(mensagemCrua: unknown): Promise<void> {
  const evento = TarefaConcluida.safeParse(mensagemCrua);
  if (!evento.success) throw new MensagemInvalida(evento.error); // vai para a DLQ, sem retry

  await prisma.$transaction(async (tx) => {
    // UNIQUE(evento_id): a segunda entrega do mesmo evento cai aqui e é ignorada
    const novo = await tx.$executeRaw\`
      INSERT INTO eventos_processados (evento_id) VALUES (\${evento.data.eventoId}::uuid)
      ON CONFLICT DO NOTHING\`;
    if (novo === 0) return;
    await tx.metricaProjeto.update({
      where: { projetoId: evento.data.projetoId },
      data: { concluidas: { increment: 1 } },
    });
  });
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Suba Kafka com Docker Compose (modo KRaft), crie um produtor e dois grupos de consumidores em TypeScript e observe como as partições se distribuem." },
    { lvl: 2, text: "Envie o mesmo evento 3 vezes de propósito e prove que o consumidor processa só uma. Depois envie uma mensagem malformada e verifique que ela chega à DLQ." },
    { lvl: 2, text: "Modele um fluxo de onboarding (convite, aceite, criação de projeto exemplo, e-mail de boas-vindas) duas vezes: com coreografia e com orquestração (Temporal). Compare legibilidade e tratamento de falhas." },
    { lvl: 3, text: "Evolua o schema de um evento para a versão 2 sem quebrar consumidores antigos. Documente quais mudanças são permitidas e como consumidores lidam com as duas versões." },
  ],
  refs: [
    { t: "Martin Fowler: What do you mean by Event-Driven?", u: "https://martinfowler.com/articles/201701-event-driven.html" },
    { t: "Apache Kafka: documentação", u: "https://kafka.apache.org/documentation/" },
    { t: "Confluent: cliente JavaScript para Kafka", u: "https://github.com/confluentinc/confluent-kafka-javascript" },
    { t: "Temporal: TypeScript SDK", u: "https://docs.temporal.io/develop/typescript" },
    { t: "Livro: Kafka: The Definitive Guide, 2ª ed.", u: "https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/" },
    { t: "Livro: Building Event-Driven Microservices (Adam Bellemare)", u: "https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/" },
  ],
});

T({
  id: "outros-estilos",
  phase: "p-estilos",
  title: "Arquitetura Serverless e outros estilos",
  level: "Avançado",
  hours: 12,
  summary: "Estilos menos comuns que resolvem problemas específicos muito bem, e a matriz de comparação entre todos.",
  body: `
<h3>Microkernel (plug-in)</h3>
<p>Um núcleo mínimo e plug-ins que adicionam funcionalidades. Exemplos: o VS Code e suas extensões, navegadores, motores de regras de seguradoras com uma regra por estado. Em TypeScript: uma interface de plug-in e carregamento com <code>import()</code> dinâmico de uma pasta ou de pacotes npm. Ótimo para produtos customizáveis por cliente.</p>
<h3>Space-based</h3>
<p>Remove o banco do caminho crítico: dados ficam em grids de memória replicados (Hazelcast, Apache Ignite), e a escrita no banco acontece de forma assíncrona. Para picos extremos e imprevisíveis, como venda de ingressos ou leilões. Caro e complexo.</p>
<h3>Serverless</h3>
<p>Funções executadas sob demanda (AWS Lambda, Google Cloud Run). Escala até zero e cobra por uso. Node.js é um dos runtimes mais usados em Lambda: o cold start é curto, desde que o pacote seja pequeno (empacote com esbuild e evite dependências pesadas). Bom para cargas esporádicas e integrações; ruim para tráfego constante alto (o custo inverte), conexões persistentes com banco (use um proxy de conexões) e processamento longo.</p>
<h3>Arquitetura baseada em células</h3>
<p>O sistema inteiro é replicado em "células" independentes, cada uma atendendo um subconjunto de clientes. Uma falha afeta só a sua célula: o raio de explosão (blast radius) fica limitado. Usada pela AWS internamente e por empresas como Slack e DoorDash.</p>
<h3>Matriz de comparação (simplificada)</h3>
<table class="tbl"><thead><tr><th>Estilo</th><th>Custo</th><th>Simplicidade</th><th>Escalabilidade</th><th>Implantação independente</th></tr></thead><tbody>
<tr><td>Camadas</td><td>★★★★★</td><td>★★★★★</td><td>★</td><td>★</td></tr>
<tr><td>Monolito modular</td><td>★★★★★</td><td>★★★★</td><td>★</td><td>★</td></tr>
<tr><td>Microkernel</td><td>★★★★★</td><td>★★★★</td><td>★</td><td>★★★</td></tr>
<tr><td>Orientada a serviços</td><td>★★★★</td><td>★★★</td><td>★★★</td><td>★★★★</td></tr>
<tr><td>Eventos</td><td>★★★</td><td>★</td><td>★★★★★</td><td>★★★</td></tr>
<tr><td>Space-based</td><td>★★</td><td>★</td><td>★★★★★</td><td>★★★</td></tr>
<tr><td>Microsserviços</td><td>★</td><td>★</td><td>★★★★★</td><td>★★★★★</td></tr>
</tbody></table>
<p class="muted">Adaptado das tabelas de avaliação de Richards &amp; Ford. Mais estrelas = melhor naquele critério (custo: mais estrelas = mais barato).</p>
`,
  code: [
    {
      t: "Microkernel com import dinâmico",
      src: `// Contrato do plug-in (no núcleo)
export interface RegraSeguro {
  uf: string;
  ajustarPremio(apolice: Apolice, premioBaseCentavos: number): number;
}

// Núcleo carrega todos os plug-ins de uma pasta
import { readdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

export async function carregarRegras(pasta: string): Promise<Map<string, RegraSeguro>> {
  const regras = new Map<string, RegraSeguro>();
  for (const arquivo of await readdir(pasta)) {
    if (!arquivo.endsWith(".js")) continue;
    const mod = (await import(pathToFileURL(join(pasta, arquivo)).href)) as { default: RegraSeguro };
    regras.set(mod.default.uf, mod.default);
  }
  return regras;
}

// Plug-in: plugins/sp.js →  export default { uf: "SP", ajustarPremio: (a, base) => ... }`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Implemente um sistema de cálculo de impostos com microkernel: um plug-in por estado, carregados por <code>import()</code> dinâmico." },
    { lvl: 2, text: "Publique uma função em TypeScript no AWS Lambda empacotada com esbuild. Meça o cold start com e sem uma dependência pesada no pacote." },
    { lvl: 3, text: "Para 4 cenários (ERP de PME, venda de ingressos, editor de código, marketplace com 30 times), escolha o estilo com a matriz e justifique em um parágrafo cada." },
  ],
  refs: [
    { t: "AWS: Guidance for Cell-Based Architecture", u: "https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html" },
    { t: "AWS Lambda: Building with TypeScript", u: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-typescript.html" },
    { t: "VS Code: arquitetura de extensões (exemplo de microkernel)", u: "https://code.visualstudio.com/api" },
    { t: "Hazelcast", u: "https://docs.hazelcast.com/" },
  ],
});
