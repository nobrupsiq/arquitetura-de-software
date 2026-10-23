/* Etapas e fases do "Mapa do Arquiteto", na ordem do quadro. */
const STAGES = [
  {
    id: "s1",
    title: "Largada → Programador Júnior",
    short: "Júnior",
    milestone: "Programador Júnior"
  },
  {
    id: "s2",
    title: "Programador Pleno / Sênior",
    short: "Pleno/Sênior",
    milestone: "Programador Completo"
  },
  {
    id: "s3",
    title: "Arquiteto de Software",
    short: "Arquiteto de Software",
    milestone: "Arquiteto de Software"
  },
  {
    id: "s4",
    title: "Arquiteto de Soluções",
    short: "Arquiteto de Soluções",
    milestone: "Parabéns!"
  },
  {
    id: "s5",
    title: "Além do mapa: fora da curva",
    short: "Fora da curva",
    milestone: null
  }
];

const PHASES = [
  {
    id: "p-fund",
    stage: "s1",
    title: "Fundamentos",
    weeks: "3–4 sem",
    goal: "Entender a máquina onde seu código roda: hardware, memória, SO, compilação e Linux."
  },
  {
    id: "p-ling",
    stage: "s1",
    title: "Escolha uma linguagem: TypeScript",
    weeks: "8–10 sem",
    goal: "Lógica, algoritmos e estruturas de dados, paradigmas, POO, o TypeScript moderno e o runtime do Node.js."
  },
  {
    id: "p-sql",
    stage: "s1",
    title: "SQL e bancos relacionais",
    weeks: "3–4 sem",
    goal: "CRUD, relacionamentos, ACID e transações no PostgreSQL."
  },
  {
    id: "p-git",
    stage: "s1",
    title: "Versionamento de código",
    weeks: "1–2 sem",
    goal: "Git, repositórios remotos (GitHub, GitLab, Bitbucket) e build com npm."
  },
  {
    id: "p-web",
    stage: "s1",
    title: "Redes e Internet",
    weeks: "5–6 sem",
    goal: "Fundamentos da Web, segurança web e APIs & integrações."
  },
  {
    id: "p-mvc",
    stage: "s1",
    title: "Model-View-Controller (MVC)",
    weeks: "5–6 sem",
    goal: "O padrão MVC e o framework escolhido: NestJS."
  },
  {
    id: "p-docker",
    stage: "s1",
    title: "Docker",
    weeks: "2–3 sem",
    goal: "Conteinerização, comandos, imagens, volumes, redes, Dockerfile e Compose."
  },
  {
    id: "p-nosql",
    stage: "s2",
    title: "Mais sobre bancos de dados",
    weeks: "2–3 sem",
    goal: "Bancos não relacionais: documentos, chave-valor, grafos e busca."
  },
  {
    id: "p-qual",
    stage: "s2",
    title: "Clean Code e Orientação a Objetos avançada",
    weeks: "4–5 sem",
    goal: "Clean Code, DRY/KISS/YAGNI, SOLID e Object Calisthenics."
  },
  {
    id: "p-testes",
    stage: "s2",
    title: "Testes automatizados",
    weeks: "3–4 sem",
    goal: "Pirâmide de testes (80/15/5), TDD e testes de arquitetura."
  },
  {
    id: "p-patterns",
    stage: "s2",
    title: "Design Patterns",
    weeks: "3–4 sem",
    goal: "Padrões estruturais, comportamentais e criacionais do GoF."
  },
  {
    id: "p-refac",
    stage: "s2",
    title: "Técnicas de refactoring",
    weeks: "2–3 sem",
    goal: "Débito técnico, code smells e o catálogo de refatorações."
  },
  {
    id: "p-perf",
    stage: "s2",
    title: "Otimização e performance",
    weeks: "4–5 sem",
    goal: "Cache aside, jobs assíncronos, concorrência e paralelismo, SQL e CDN."
  },
  {
    id: "p-cloud",
    stage: "s2",
    title: "Cloud providers e pipelines de CI/CD",
    weeks: "4–5 sem",
    goal: "Básico de AWS/Azure/GCP (Cloud Practitioner) e pipelines de entrega."
  },
  {
    id: "p-arq",
    stage: "s3",
    title: "Arquitetura de Software",
    weeks: "4–5 sem",
    goal: "Níveis, tipos de arquiteto, requisitos, decisões (ADRs) e documentação (C4)."
  },
  {
    id: "p-ddd",
    stage: "s3",
    title: "Domain-Driven Design",
    weeks: "6–8 sem",
    goal: "Modelagem estratégica, ferramentas de descoberta e modelagem tática."
  },
  {
    id: "p-estilos",
    stage: "s3",
    title: "Estilos de arquitetura",
    weeks: "8–10 sem",
    goal: "Camadas (Clean, Hexagonal, Onion), monolito modular, microsserviços, EDA e serverless."
  },
  {
    id: "p-nfr",
    stage: "s4",
    title: "Requisitos não funcionais: capacidade e escala",
    weeks: "6–8 sem",
    goal: "Planejamento de capacidade, escalabilidade, estratégia de dados e anti-padrões de performance."
  },
  {
    id: "p-consist",
    stage: "s4",
    title: "Consistência de dados",
    weeks: "4–5 sem",
    goal: "Tipos de consistência, CAP, idempotência, ACID vs BASE, sagas e CQRS."
  },
  {
    id: "p-disp",
    stage: "s4",
    title: "Disponibilidade e resiliência",
    weeks: "4–5 sem",
    goal: "Redundância, failover, zero downtime, graceful degradation, chaos e tracing."
  },
  {
    id: "p-seg",
    stage: "s4",
    title: "Segurança como requisito arquitetural",
    weeks: "3–4 sem",
    goal: "VPN, WAF, DDoS, SQL injection, criptografia, identidade e modelagem de ameaças."
  },
  {
    id: "p-final",
    stage: "s4",
    title: "AWS Solutions Architect e System Design",
    weeks: "10–12 sem",
    goal: "As certificações recomendadas e a prática de system design que fecha o mapa."
  },
  {
    id: "p-extra",
    stage: "s5",
    title: "Diferenciais do arquiteto",
    weeks: "contínuo",
    goal: "Arquitetura evolutiva, times e Conway, liderança técnica e IA na arquitetura."
  }
];
PHASES.forEach((p, i) => (p.n = i + 1));

const TOPICS = [];
function T(o) {
  TOPICS.push(o);
}
