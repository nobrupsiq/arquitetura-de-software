/* Largada → Programador Júnior */

/* ---------- Fundamentos ---------- */

T({
  id: "fundamentos-computacao",
  phase: "p-fund",
  title: "Como o computador funciona (e o Linux)",
  level: "Base",
  hours: 25,
  summary: "Hardware, memória, processadores, sistemas operacionais, compilação vs. interpretação e o Linux como ambiente de trabalho.",
  body: `
<p>Todo sistema que você vai desenhar roda, no fim, em CPUs, memória, discos e redes. Arquitetos que entendem a máquina estimam custos com precisão e reconhecem gargalos que outros só descobrem em produção. Este é o ponto de largada do seu roadmap.</p>
<h3>Como funciona um computador</h3>
<p>O modelo de von Neumann: <strong>CPU</strong> executa instruções, <strong>memória</strong> guarda dados e programas, <strong>dispositivos de E/S</strong> trocam dados com o mundo (disco, rede, teclado). Tudo conversa por barramentos. Programas são sequências de instruções de máquina que manipulam bytes.</p>
<h3>Como os programas rodam na memória</h3>
<ul>
<li>Um <strong>processo</strong> é um programa em execução, com espaço de endereçamento próprio: código, dados globais, <strong>heap</strong> (alocação dinâmica) e uma <strong>stack</strong> por thread.</li>
<li><strong>Memória virtual</strong>: cada processo enxerga endereços próprios; o sistema operacional mapeia para a RAM física em páginas. Quando a RAM acaba, páginas vão para o disco (swap) e tudo fica ordens de grandeza mais lento.</li>
<li><strong>Threads</strong> compartilham o heap do processo, o que permite paralelismo e também cria condições de corrida. O Node.js roda o seu JavaScript numa thread principal só e usa outras threads por baixo para E/S: você vai entender o porquê no tópico sobre o runtime.</li>
</ul>
<h3>Como os processadores funcionam</h3>
<p>Ciclo buscar → decodificar → executar. CPUs modernas têm vários <strong>núcleos</strong>, executam instruções fora de ordem, preveem desvios e usam <strong>caches</strong> (L1 ~1 ns, L2 ~4 ns, L3 ~10 ns, RAM ~100 ns). Acesso sequencial à memória é muito mais rápido que acesso aleatório porque aproveita o cache: é por isso que percorrer um array costuma ganhar de seguir ponteiros de uma lista ligada, mesmo onde a teoria diz o contrário.</p>
<h3>Sistemas operacionais</h3>
<p>O SO gerencia processos (escalonamento), memória, sistema de arquivos, rede e permissões. Programas pedem coisas ao SO via <strong>system calls</strong>. Cada troca de contexto entre threads tem custo; é um dos motivos pelos quais o Node.js aposta em E/S assíncrona numa thread só (o <em>event loop</em>) em vez de uma thread por requisição.</p>
<h3>Linguagem compilada x interpretada (e onde fica o TypeScript)</h3>
<table class="tbl"><thead><tr><th></th><th>Como executa</th><th>Exemplos</th></tr></thead><tbody>
<tr><td>Compilada (AOT)</td><td>Código-fonte vira código de máquina antes de rodar</td><td>C, C++, Go, Rust</td></tr>
<tr><td>Interpretada</td><td>Um interpretador lê e executa o fonte em tempo de execução</td><td>Python (CPython), Ruby, PHP</td></tr>
<tr><td>Interpretada + JIT</td><td>Começa interpretando; os trechos quentes são compilados para código nativo durante a execução</td><td><strong>JavaScript (V8)</strong>, Java, C#</td></tr>
</tbody></table>
<p>O <strong>TypeScript</strong> é JavaScript com tipos. Os tipos existem só antes de rodar: o compilador <code>tsc</code> verifica e depois os <strong>apaga</strong>, gerando JavaScript comum. Quem executa é o motor <strong>V8</strong> (dentro do Node.js e do Chrome), que interpreta o JavaScript e compila as funções quentes para código de máquina. O Node.js atual consegue rodar arquivos <code>.ts</code> direto, removendo os tipos na hora, mas a verificação de tipos continua sendo trabalho do <code>tsc</code>.</p>
<h3>Linux (Ubuntu ou Debian)</h3>
<p>Praticamente todo servidor e contêiner roda Linux. Você precisa ser fluente no terminal: navegação e arquivos (<code>ls, cd, cp, mv, find</code>), permissões (<code>chmod, chown</code>), processos (<code>ps, top, htop, kill</code>), rede (<code>curl, ss, dig, ping</code>), logs (<code>journalctl, tail -f, grep, less</code>), pacotes (<code>apt</code>), serviços (<code>systemctl</code>) e SSH. No Windows, instale o <strong>WSL2</strong> com Ubuntu e passe a programar nele.</p>
`,
  code: [
    {
      t: "Vendo o efeito do cache da CPU em TypeScript",
      src: `// cache-da-cpu.ts  →  rode com: node cache-da-cpu.ts
const n = 4_000;
const m = new Int32Array(n * n); // matriz n×n num bloco contínuo de memória

let soma = 0;
const t0 = performance.now();
for (let i = 0; i < n; i++)          // linha a linha: acesso sequencial
  for (let j = 0; j < n; j++) soma += m[i * n + j];
const t1 = performance.now();
for (let j = 0; j < n; j++)          // coluna a coluna: salta n posições a cada passo
  for (let i = 0; i < n; i++) soma += m[i * n + j];
const t2 = performance.now();

console.log("linhas:", Math.round(t1 - t0), "ms | colunas:", Math.round(t2 - t1), "ms");
// Mesma quantidade de operações; a ordem por colunas costuma ser várias vezes mais lenta.`,
    },
    {
      t: "Do TypeScript ao código que a máquina executa",
      src: `# Os tipos somem: compare o .ts com o .js gerado
npx tsc ola.ts && cat ola.js

# Veja o bytecode que o V8 gera para uma função
node --print-bytecode --print-bytecode-filter=somar ola.js

# Observe o Node como processo do sistema operacional
ps -o pid,rss,nlwp,cmd -p $(pgrep -f ola.js)   # memória residente e nº de threads
# Repare que nlwp > 1: o Node usa threads auxiliares (GC, E/S) mesmo com o seu código numa só`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Rode o programa <code>cache-da-cpu.ts</code> e explique a diferença de tempo usando o conceito de linha de cache." },
    { lvl: 1, text: "Instale Ubuntu (ou WSL2) e faça todos os níveis do jogo <strong>OverTheWire Bandit</strong> até o nível 15." },
    { lvl: 2, text: "Escreva um script Bash que monitora um processo Node a cada 5 s (CPU, memória, número de threads) e grava em CSV." },
    { lvl: 2, text: "Compile um arquivo TypeScript com <code>tsc</code> e compare com o JavaScript gerado. Liste o que desapareceu e explique por que nenhuma verificação de tipo existe em tempo de execução." },
    { lvl: 3, text: "Leia os capítulos de processos, memória virtual e concorrência do livro OSTEP (gratuito) e escreva um resumo de 2 páginas ligando cada conceito a um problema real de servidores Node.js." },
  ],
  refs: [
    { t: "Livro: Operating Systems: Three Easy Pieces (OSTEP, gratuito)", u: "https://pages.cs.wisc.edu/~remzi/OSTEP/" },
    { t: "CS50x (Harvard, gratuito)", u: "https://cs50.harvard.edu/x/", note: "está indicado no seu próprio quadro" },
    { t: "Livro: Code (Charles Petzold), 2ª ed.", u: "https://www.charlespetzold.com/code/" },
    { t: "OverTheWire Bandit: prática de terminal Linux", u: "https://overthewire.org/wargames/bandit/" },
    { t: "The Linux Command Line (William Shotts, gratuito)", u: "https://linuxcommand.org/tlcl.php" },
    { t: "Microsoft: instalar o WSL", u: "https://learn.microsoft.com/pt-br/windows/wsl/install" },
    { t: "roadmap.sh: Linux", u: "https://roadmap.sh/linux" },
  ],
});

/* ---------- Escolha uma linguagem: TypeScript ---------- */

T({
  id: "poo",
  phase: "p-ling",
  title: "Lógica, paradigmas e POO em TypeScript",
  level: "Base",
  hours: 30,
  summary: "Lógica de programação, paradigmas procedural e funcional, e os quatro pilares da orientação a objetos.",
  body: `
<p>Seu roadmap escolhe uma linguagem e passa por lógica, algoritmos e paradigmas. A escolha aqui é <strong>TypeScript</strong>: você já programa em JavaScript, e o TypeScript é JavaScript com um sistema de tipos que ajuda a modelar o domínio, exatamente o que um arquiteto precisa. O foco deste tópico é a base que tudo o mais usa: pensar em passos, e depois organizar esses passos em funções e objetos.</p>
<h3>Lógica de programação</h3>
<p>Variáveis, tipos, condicionais, laços, funções, entrada e saída. Experimente no REPL do Node (<code>node</code> no terminal) ou rode arquivos <code>.ts</code> direto com <code>node arquivo.ts</code>. O objetivo é traduzir um problema em passos precisos, e testar cada passo.</p>
<h3>Paradigmas</h3>
<ul>
<li><strong>Procedural</strong>: o programa é uma sequência de procedimentos que transformam dados. Simples e direto.</li>
<li><strong>Funcional</strong>: funções puras (mesma entrada, mesma saída, sem efeito colateral), imutabilidade, funções como valores. Em TypeScript: <code>map</code>, <code>filter</code>, <code>reduce</code>, <code>readonly</code>, funções de ordem superior.</li>
<li><strong>Orientado a objetos</strong>: dados e comportamento juntos em objetos que colaboram por mensagens. TypeScript tem classes, interfaces, modificadores de acesso (<code>private</code>, campos <code>#privados</code>) e herança.</li>
</ul>
<p>TypeScript é multiparadigma. Bons projetos usam OO (ou tipos bem modelados) para o domínio e estilo funcional para transformar dados.</p>
<h3>Os quatro pilares da POO</h3>
<dl class="defs">
<dt>Abstração</dt><dd>Expor só o essencial. Uma interface <code>MeioPagamento</code> com <code>autorizar()</code> abstrai se é cartão, Pix ou boleto.</dd>
<dt>Encapsulamento</dt><dd>Esconder o estado e proteger as regras. O limite de um cartão só muda por <code>autorizar</code>, que valida; nunca por atribuição direta de fora da classe.</dd>
<dt>Herança</dt><dd>Reaproveitar e especializar comportamento (<code>extends</code>). Poderosa e perigosa: cria acoplamento forte. Regra prática: <em>prefira composição a herança</em>.</dd>
<dt>Polimorfismo</dt><dd>O mesmo código trabalha com tipos diferentes. Quem chama <code>meio.autorizar()</code> não sabe qual implementação vai rodar, e não precisa saber.</dd>
</dl>
<div class="callout"><b>Tipagem estrutural</b>Em TypeScript, um objeto satisfaz uma interface se tiver o formato certo, mesmo sem declarar <code>implements</code>. Isso deixa testes e adaptadores simples (qualquer objeto literal com os métodos certos serve), mas significa que dois tipos com o mesmo formato são intercambiáveis. Quando isso for um problema, como confundir um <code>UserId</code> com um <code>ProjectId</code>, use <em>branded types</em> (veja o tópico de TypeScript moderno).</div>
`,
  code: [
    {
      t: "Os quatro pilares num exemplo só",
      src: `type Autorizacao =
  | { aprovada: true }
  | { aprovada: false; motivo: string };

// Abstração: o que todo meio de pagamento sabe fazer
interface MeioPagamento {
  autorizar(centavos: number): Autorizacao;
}

// Encapsulamento: o limite só muda por regras
class CartaoCredito implements MeioPagamento {
  #limiteDisponivel: number; // campo privado de verdade, invisível fora da classe

  constructor(limiteCentavos: number) {
    this.#limiteDisponivel = limiteCentavos;
  }

  autorizar(centavos: number): Autorizacao {
    if (centavos > this.#limiteDisponivel) return { aprovada: false, motivo: "Limite insuficiente" };
    this.#limiteDisponivel -= centavos;
    return { aprovada: true };
  }
}

class Pix implements MeioPagamento {
  autorizar(): Autorizacao {
    return { aprovada: true };
  }
}

// Polimorfismo: o checkout não conhece os tipos concretos
function pagar(meio: MeioPagamento, totalCentavos: number): Autorizacao {
  return meio.autorizar(totalCentavos);
}`,
    },
    {
      t: "O mesmo problema em três paradigmas",
      src: `type Pedido = { readonly valorCentavos: number; readonly pago: boolean };
const pedidos: Pedido[] = [/* ... */];

// Procedural
let total = 0;
for (const p of pedidos) {
  if (p.pago) total += p.valorCentavos;
}

// Funcional
const total2 = pedidos
  .filter((p) => p.pago)
  .reduce((soma, p) => soma + p.valorCentavos, 0);

// Orientado a objetos: a coleção sabe responder
class Carteira {
  constructor(private readonly pedidos: readonly Pedido[]) {}

  totalPago(): number {
    return this.pedidos.filter((p) => p.pago).reduce((s, p) => s + p.valorCentavos, 0);
  }
}
// Dinheiro em centavos inteiros: 0.1 + 0.2 !== 0.3 em ponto flutuante.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Resolva os 30 primeiros exercícios da trilha de TypeScript do <strong>Exercism</strong>, recebendo mentoria nas soluções." },
    { lvl: 1, text: "Modele uma biblioteca (Livro, Usuario, Emprestimo) usando os quatro pilares. Escreva por que cada classe ou tipo existe." },
    { lvl: 2, text: "Reescreva uma hierarquia com herança (<code>Funcionario → Gerente → Diretor</code>) usando composição e interfaces. Compare a facilidade de adicionar um novo tipo." },
    { lvl: 3, text: "Implemente o mesmo relatório de vendas nos três paradigmas e escreva qual você usaria em produção e por quê." },
  ],
  refs: [
    { t: "TypeScript Handbook (oficial)", u: "https://www.typescriptlang.org/docs/handbook/intro.html" },
    { t: "javascript.info: o tutorial moderno de JavaScript", u: "https://javascript.info/", note: "para revisar a base de JavaScript" },
    { t: "Exercism: trilha de TypeScript", u: "https://exercism.org/tracks/typescript" },
    { t: "Total TypeScript: tutoriais gratuitos", u: "https://www.totaltypescript.com/tutorials" },
    { t: "roadmap.sh: TypeScript", u: "https://roadmap.sh/typescript" },
  ],
});

T({
  id: "estruturas",
  phase: "p-ling",
  title: "Estruturas de dados, algoritmos e complexidade",
  level: "Base",
  hours: 30,
  summary: "Big-O, as coleções do JavaScript, estruturas que aparecem em bancos e caches, e como elas determinam o desempenho.",
  body: `
<p>Arquitetos raramente implementam uma árvore B, mas precisam saber que um índice de banco é uma árvore B para entender por que <code>LIKE '%texto'</code> não usa índice. Estruturas de dados explicam o comportamento de toda a infraestrutura.</p>
<h3>O que estudar e onde aparece em arquitetura</h3>
<table class="tbl"><thead><tr><th>Estrutura</th><th>Onde você encontra no mundo real</th></tr></thead><tbody>
<tr><td>Hash table</td><td><code>Map</code> e <code>Set</code> do JavaScript, Redis, particionamento por hash, sharding</td></tr>
<tr><td>Árvore B / B+</td><td>Índices do PostgreSQL e MySQL</td></tr>
<tr><td>LSM tree</td><td>Cassandra, RocksDB, bancos otimizados para escrita</td></tr>
<tr><td>Fila / log append-only</td><td>Kafka, write-ahead log de bancos, event sourcing</td></tr>
<tr><td>Heap (prioridade)</td><td>Agendadores, top-K, timeouts, filas com prioridade (BullMQ)</td></tr>
<tr><td>Grafo</td><td>Dependências entre serviços e pacotes npm, recomendações, rotas</td></tr>
<tr><td>Bloom filter</td><td>Evitar leituras desnecessárias em disco/cache</td></tr>
<tr><td>Consistent hashing</td><td>Balanceamento de cache distribuído, Dynamo, Cassandra</td></tr>
</tbody></table>
<h3>As coleções do JavaScript</h3>
<p><code>Array</code> (acesso por índice O(1), busca O(n)), <code>Map</code> e <code>Set</code> (busca por chave O(1) médio, e mantêm a ordem de inserção). Não existe árvore ordenada na biblioteca padrão: para busca por faixa, mantenha um array ordenado com busca binária ou use uma biblioteca. Evite usar objetos comuns (<code>{}</code>) como dicionário com chaves vindas do usuário: prefira <code>Map</code>.</p>
<h3>Complexidade com números reais</h3>
<p>Com 10 milhões de registros: O(n) = 10 milhões de operações; O(log n) ≈ 23. Essa diferença é a distância entre uma consulta de 5 segundos e uma de 1 milissegundo. Pense sempre em <strong>ordem de grandeza</strong>, e decore os números de latência que todo engenheiro deveria saber (acesso à memória ~100 ns, SSD ~100 µs, ida e volta no mesmo datacenter ~0,5 ms, entre continentes ~150 ms).</p>
`,
  code: [
    {
      t: "Escolhendo a coleção certa",
      src: `// Precisa de busca por chave? Map: O(1) médio
const porSku = new Map<string, Produto>();

// Precisa de busca por faixa? Array ordenado + busca binária: O(log n)
function primeiroIndiceMaiorOuIgual(ordenado: number[], alvo: number): number {
  let ini = 0, fim = ordenado.length;
  while (ini < fim) {
    const meio = (ini + fim) >>> 1;
    if (ordenado[meio] < alvo) ini = meio + 1;
    else fim = meio;
  }
  return ini;
}

// Precisa de um LRU cache simples? Map guarda a ordem de inserção
class LruCache<K, V> {
  #itens = new Map<K, V>();
  constructor(private readonly max: number) {}

  get(chave: K): V | undefined {
    const v = this.#itens.get(chave);
    if (v === undefined) return undefined;
    this.#itens.delete(chave); // reinsere no fim: vira o mais recente
    this.#itens.set(chave, v);
    return v;
  }

  set(chave: K, valor: V): void {
    this.#itens.delete(chave);
    this.#itens.set(chave, valor);
    if (this.#itens.size > this.max) {
      const maisAntigo = this.#itens.keys().next().value as K;
      this.#itens.delete(maisAntigo);
    }
  }
}`,
    },
    {
      t: "Consistent hashing em ~30 linhas",
      src: `import { createHash } from "node:crypto";

class AnelHash {
  #anel: { pos: number; no: string }[] = []; // sempre ordenado por pos

  constructor(private readonly replicasVirtuais = 100) {}

  adicionar(no: string): void {
    for (let i = 0; i < this.replicasVirtuais; i++)
      this.#anel.push({ pos: hash(no + "#" + i), no });
    this.#anel.sort((a, b) => a.pos - b.pos);
  }

  remover(no: string): void {
    this.#anel = this.#anel.filter((v) => v.no !== no);
  }

  noPara(chave: string): string {
    const h = hash(chave);
    const v = this.#anel.find((x) => x.pos >= h) ?? this.#anel[0]; // dá a volta no anel
    return v.no;
  }
}

function hash(s: string): number {
  return createHash("md5").update(s).digest().readUInt32BE(0);
}
// Exercício: troque o find (O(n)) por busca binária (O(log n)).`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Implemente o LRU cache acima e escreva testes (com Vitest ou <code>node --test</code>) que provem a política de despejo." },
    { lvl: 2, text: "Com o <code>AnelHash</code>, distribua 100.000 chaves entre 5 nós. Remova um nó e meça quantas chaves mudaram de lugar. Compare com <code>hash % n</code>." },
    { lvl: 2, text: "Implemente um Bloom filter e calcule experimentalmente a taxa de falsos positivos para diferentes tamanhos." },
    { lvl: 3, text: "Resolva 40 problemas do NeetCode 150 em TypeScript, focando em hashing, two pointers, heaps e grafos. Para cada um, anote a complexidade." },
  ],
  refs: [
    { t: "NeetCode 150", u: "https://neetcode.io/practice" },
    { t: "Latency Numbers Every Programmer Should Know", u: "https://gist.github.com/jboner/2841832" },
    { t: "MDN: Map", u: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map" },
    { t: "Livro: Grokking Algorithms, 2ª ed. (Bhargava)", u: "https://www.manning.com/books/grokking-algorithms-second-edition" },
    { t: "Use The Index, Luke: índices de banco explicados", u: "https://use-the-index-luke.com/" },
  ],
});

T({
  id: "typescript",
  phase: "p-ling",
  title: "TypeScript moderno: tipos que modelam o domínio",
  level: "Base",
  hours: 30,
  summary: "Modo estrito, uniões discriminadas, narrowing, generics, branded types e validação na fronteira com zod.",
  body: `
<p>Muita gente usa TypeScript como "JavaScript com <code>: string</code> espalhado" e desliga o compilador com <code>any</code> quando ele reclama. Assim, o ganho é quase nenhum. O TypeScript que vale a pena é o que usa o sistema de tipos para <strong>modelar o domínio com precisão</strong>: um tipo que só pode ter três formas, um ID que não se confunde com outro, um <code>switch</code> que o compilador garante ser completo.</p>
<p>O ecossistema mudou bastante: o <strong>TypeScript 7</strong> trouxe um compilador nativo, reescrito em Go, muitas vezes mais rápido; o 6.0 foi a versão de transição. E o Node.js atual executa arquivos <code>.ts</code> direto, apagando os tipos na hora (<em>type stripping</em>). Os tipos continuam sendo verificados só pelo <code>tsc</code> (ou pelo editor), então rode <code>tsc --noEmit</code> no CI.</p>
<h3>Os recursos que você precisa dominar</h3>
<ul>
<li><strong><code>"strict": true</code></strong> no <code>tsconfig.json</code>, sempre. Ele liga, entre outras coisas, a checagem de <code>null</code>/<code>undefined</code>. Considere também <code>noUncheckedIndexedAccess</code>.</li>
<li><strong>Uniões e uniões discriminadas</strong>: <code>type Status = "aberta" | "em_andamento" | "concluida"</code>, e objetos com um campo <code>tipo</code> que diz qual variante é.</li>
<li><strong>Narrowing</strong>: <code>typeof</code>, <code>in</code>, <code>instanceof</code>, campo discriminante e funções <em>type guard</em> estreitam o tipo dentro de cada ramo.</li>
<li><strong>Checagem de exaustividade</strong> com <code>never</code>: se alguém criar uma variante nova, o código que não a trata para de compilar.</li>
<li><strong>Generics</strong> com restrições (<code>&lt;T extends { id: string }&gt;</code>), tipos utilitários (<code>Pick</code>, <code>Omit</code>, <code>Partial</code>, <code>Readonly</code>), <code>satisfies</code> e <code>as const</code>.</li>
<li><strong><code>unknown</code> em vez de <code>any</code></strong>: tudo o que vem de fora (JSON, corpo de requisição, variável de ambiente) é <code>unknown</code> até ser validado.</li>
<li><strong>async/await</strong> e Promises (o modelo de concorrência tem tópico próprio).</li>
</ul>
<h3>Tipos algébricos: a ideia mais poderosa</h3>
<p>Uniões discriminadas dão ao TypeScript o que linguagens funcionais chamam de <em>tipos algébricos de dados</em>. Em vez de representar uma tarefa com <code>status: string</code> e um <code>concluidaEm</code> que às vezes é nulo, você declara cada estado como uma variante com os campos que fazem sentido nele. Estados inválidos deixam de ser representáveis. Essa frase, "tornar estados ilegais irrepresentáveis", é um princípio de design que você vai usar a carreira toda.</p>
<h3>Tipos não existem em tempo de execução</h3>
<p>Como os tipos são apagados, um <code>req.body as NovaTarefa</code> não verifica nada: é só uma promessa sua ao compilador. Na <strong>fronteira</strong> do sistema (HTTP, filas, arquivos, variáveis de ambiente), valide com uma biblioteca de schema como o <strong>zod</strong> e derive o tipo do schema. Dentro do sistema, confie nos tipos.</p>
<div class="callout"><b>Por que isso é arquitetura e não só sintaxe?</b> Porque a forma como você modela dados define o que pode dar errado. Um modelo frouxo empurra validação para todos os lugares do sistema; um modelo preciso concentra regras num lugar só.</div>
`,
  code: [
    {
      t: "Estado de uma tarefa como união discriminada",
      src: `type Tarefa =
  | { status: "aberta"; id: string; titulo: string }
  | { status: "em_andamento"; id: string; titulo: string; responsavelId: string }
  | { status: "concluida"; id: string; titulo: string; concluidaEm: Date };

function rotulo(t: Tarefa): string {
  switch (t.status) {
    case "aberta":
      return t.titulo + " (sem responsável)";
    case "em_andamento":
      return t.titulo + " → " + t.responsavelId; // aqui o TS sabe que responsavelId existe
    case "concluida":
      return t.titulo + " ✓ " + t.concluidaEm.toLocaleDateString("pt-BR");
    default:
      return naoDeveriaAcontecer(t);
  }
}

// Se alguém criar um 4º status, a linha acima para de compilar:
// o erro aparece antes de produção.
function naoDeveriaAcontecer(x: never): never {
  throw new Error("Variante não tratada: " + JSON.stringify(x));
}`,
    },
    {
      t: "Branded types e validação na fronteira com zod",
      src: `import { z } from "zod";

// IDs com "marca": um UserId não pode ser passado onde se espera um ProjectId
type UserId = string & { readonly __marca: "UserId" };
type ProjectId = string & { readonly __marca: "ProjectId" };

declare function arquivarProjeto(id: ProjectId): void;
declare const usuario: UserId;
// arquivarProjeto(usuario);  // ❌ erro de compilação

// Value Object: se existe um Email, ele é válido. Ponto.
const Email = z.email().transform((s) => s.toLowerCase()).brand<"Email">();
type Email = z.infer<typeof Email>;

// Na fronteira: o corpo da requisição é unknown até passar pelo schema
const NovaTarefa = z.object({
  titulo: z.string().trim().min(3).max(120),
  prazo: z.coerce.date().optional(),
});
type NovaTarefa = z.infer<typeof NovaTarefa>; // o tipo nasce do schema

const resultado = NovaTarefa.safeParse(JSON.parse('{"titulo":"  Revisar PR "}'));
if (resultado.success) console.log(resultado.data.titulo); // "Revisar PR"
else console.log(resultado.error.issues);`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Modele as formas geométricas <code>Circulo</code>, <code>Retangulo</code> e <code>Triangulo</code> como uma união discriminada <code>Forma</code> e escreva <code>area(f: Forma): number</code> com checagem de exaustividade via <code>never</code>." },
    { lvl: 1, text: "Crie os Value Objects <code>Cpf</code>, <code>Dinheiro</code> (centavos + moeda, sem permitir somar moedas diferentes) e <code>Periodo</code> (início antes do fim), cada um com uma função que valida e devolve o tipo com marca." },
    { lvl: 2, text: "Pegue um código com <code>status: string</code> e campos opcionais (ex.: pedido com status PENDENTE/PAGO/CANCELADO e <code>dataCancelamento</code> que às vezes é nula). Refatore para uma união discriminada e liste quais bugs se tornaram impossíveis." },
    { lvl: 3, text: "Implemente um avaliador de expressões aritméticas (<code>Num</code>, <code>Soma</code>, <code>Mult</code>, <code>Neg</code>) com uniões discriminadas e recursão, incluindo uma função de simplificação (<code>x*1 → x</code>, <code>x+0 → x</code>)." },
  ],
  refs: [
    { t: "TypeScript Handbook: Narrowing", u: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
    { t: "TypeScript: TSConfig Reference (strict)", u: "https://www.typescriptlang.org/tsconfig/#strict" },
    { t: "Node.js: executando TypeScript nativamente", u: "https://nodejs.org/api/typescript.html" },
    { t: "Zod: documentação", u: "https://zod.dev/" },
    { t: "Livro: Effective TypeScript, 2ª ed. (Dan Vanderkam)", u: "https://effectivetypescript.com/", note: "o livro mais útil para escrever TypeScript bem" },
  ],
});

T({
  id: "node-runtime",
  phase: "p-ling",
  title: "Node.js por dentro: V8, event loop e memória",
  level: "Base",
  hours: 20,
  summary: "Como o Node executa seu código: V8 e JIT, event loop, libuv, heap e garbage collection, e como medir em produção.",
  body: `
<p>Arquitetos tomam decisões de capacidade: quanta memória um serviço precisa, quantas instâncias, que latência é aceitável. Sem entender o runtime, esses números são chute. E no Node há uma regra que muda tudo: <strong>o seu JavaScript roda numa thread só</strong>.</p>
<h3>O modelo mental</h3>
<ul>
<li><strong>V8</strong>: o motor de JavaScript. Interpreta o código (Ignition) e compila funções quentes para código nativo otimizado (Maglev, TurboFan). Por isso um serviço Node "aquece" e as primeiras requisições são mais lentas.</li>
<li><strong>Event loop</strong>: um laço que pega a próxima tarefa pronta (um callback de timer, uma resposta de rede, uma Promise resolvida) e a executa até o fim. Enquanto uma tarefa roda, nenhuma outra roda.</li>
<li><strong>libuv</strong>: a biblioteca em C por baixo do Node. Usa os mecanismos assíncronos do sistema operacional para rede e um <em>pool de threads</em> (4 por padrão) para operações que não têm versão assíncrona, como parte do sistema de arquivos, DNS e criptografia pesada.</li>
<li><strong>Stack e heap</strong>: a stack guarda as chamadas em andamento; todos os objetos vivem no heap do V8, administrado pelo garbage collector.</li>
</ul>
<h3>Não bloqueie o event loop</h3>
<p>Como tudo passa pela mesma thread, uma única operação síncrona pesada (um <code>JSON.parse</code> de 50 MB, um laço de criptografia, uma expressão regular catastrófica) congela <strong>todas</strong> as requisições do processo. O Node é ótimo para E/S (milhares de requisições esperando banco e rede ao mesmo tempo) e ruim para CPU pesada na thread principal. Para CPU, use <em>worker threads</em>, outro processo ou outro serviço.</p>
<h3>Memória e garbage collection</h3>
<table class="tbl"><thead><tr><th>Região</th><th>O que guarda</th><th>Como é coletada</th></tr></thead><tbody>
<tr><td>Young generation</td><td>Objetos recém-criados (a maioria morre jovem)</td><td>Coletas pequenas e frequentes (scavenge)</td></tr>
<tr><td>Old generation</td><td>Objetos que sobreviveram a algumas coletas</td><td>Mark-sweep-compact, em grande parte concorrente</td></tr>
<tr><td>Fora do heap</td><td><code>Buffer</code>s, memória nativa de bibliotecas</td><td>Liberada quando o objeto JS dono é coletado</td></tr>
</tbody></table>
<h3>Node em contêiner</h3>
<p>O tamanho máximo do heap (<code>--max-old-space-size</code>, em MB) tem um padrão que pode não combinar com o limite do contêiner. Defina explicitamente, deixando folga para a memória fora do heap: num contêiner de 1 GB, algo como 700 a 750 MB. Um erro clássico de produção é o contêiner ser morto por falta de memória (OOMKilled) sem nenhum erro no log: o heap estava ok, mas buffers e memória nativa passaram do limite.</p>
<div class="callout"><b>Regra prática:</b> antes de otimizar, meça. O Node traz ferramentas embutidas: <code>--inspect</code> com o Chrome DevTools (perfis de CPU e heap snapshots), <code>--cpu-prof</code>, <code>--heap-prof</code> e o <code>monitorEventLoopDelay</code> para medir quanto o event loop está atrasando.</div>
`,
  code: [
    {
      t: "Medindo o atraso do event loop",
      src: `import { monitorEventLoopDelay } from "node:perf_hooks";
import { createServer } from "node:http";

const atraso = monitorEventLoopDelay({ resolution: 20 });
atraso.enable();
setInterval(() => {
  // p99 em milissegundos: acima de ~50 ms, as requisições já sentem
  console.log("event loop p99:", (atraso.percentile(99) / 1e6).toFixed(1), "ms");
  atraso.reset();
}, 5_000);

createServer((req, res) => {
  if (req.url === "/bloqueia") {
    const fim = Date.now() + 2_000;
    while (Date.now() < fim) {} // CPU pura na thread principal: congela TODAS as requisições
  }
  res.end("ok\\n");
}).listen(3000);
// Teste: em um terminal, curl localhost:3000/bloqueia; em outro, curl localhost:3000/
// A segunda requisição, que não faz nada, também espera 2 segundos.`,
    },
    {
      t: "Provocando e observando um vazamento",
      src: `// vazamento.ts: cache sem limite, o vazamento de memória mais comum em Node
const cache = new Map<string, Buffer>();

let i = 0;
setInterval(() => {
  for (let k = 0; k < 1_000; k++) cache.set("k" + i++, Buffer.alloc(10_000));
  const { heapUsed, rss } = process.memoryUsage();
  console.log("heap:", Math.round(heapUsed / 1e6), "MB | rss:", Math.round(rss / 1e6), "MB");
}, 100);

// Rode com: node --inspect --max-old-space-size=256 vazamento.ts
// Abra chrome://inspect, tire dois heap snapshots com alguns segundos de intervalo
// e compare: o Map "cache" aparece retendo a memória que só cresce.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Rode o servidor do exemplo, chame <code>/bloqueia</code> e outra rota ao mesmo tempo. Explique o resultado com o modelo do event loop e reescreva a rota usando um <code>Worker</code> de <code>node:worker_threads</code>." },
    { lvl: 1, text: "Rode o programa <code>vazamento.ts</code>, tire dois heap snapshots no Chrome DevTools e identifique qual objeto retém a memória." },
    { lvl: 2, text: "Crie uma API simples, gere carga com <code>k6</code> ou <code>autocannon</code> e grave um perfil com <code>--cpu-prof</code>. Encontre as 3 funções que mais consomem CPU." },
    { lvl: 3, text: "Escreva um mini-relatório de capacidade: dado 2.000 req/s com 5 ms de CPU e 40 ms esperando o banco por requisição, quantas instâncias de 1 vCPU/1 GB você precisa? Justifique com medições." },
  ],
  refs: [
    { t: "Node.js: The Node.js Event Loop", u: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick" },
    { t: "Node.js: Don't Block the Event Loop (or the Worker Pool)", u: "https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop" },
    { t: "Node.js: guia de diagnóstico", u: "https://nodejs.org/en/learn/diagnostics/user-journey" },
    { t: "V8 blog: como o motor funciona por dentro", u: "https://v8.dev/blog" },
    { t: "Livro: Node.js Design Patterns, 4ª ed. (Casciaro, Mammino)", u: "https://www.nodejsdesignpatterns.com/" },
  ],
});

/* ---------- SQL e bancos relacionais ---------- */

T({
  id: "sql",
  phase: "p-sql",
  title: "SQL e bancos relacionais",
  level: "Intermediário",
  hours: 30,
  summary: "PostgreSQL, normalização, índices, planos de execução, transações e níveis de isolamento.",
  body: `
<p>O banco é quase sempre a parte mais difícil de mudar e o gargalo mais comum. Arquitetos que entendem banco tomam decisões melhores sobre consistência, desempenho e custo. Use <strong>PostgreSQL</strong> como padrão de estudo: é o banco relacional open source mais completo e o mais usado em projetos novos.</p>
<h3>Roteiro</h3>
<ol>
<li><strong>SQL de verdade</strong>: JOINs, agregações, subconsultas, CTEs, <em>window functions</em> (<code>ROW_NUMBER</code>, <code>LAG</code>, <code>SUM OVER</code>).</li>
<li><strong>Modelagem</strong>: normalização até 3FN, quando desnormalizar, chaves naturais vs. surrogate, UUIDv7 vs. bigserial.</li>
<li><strong>Índices</strong>: B-tree, composto (a ordem das colunas importa), parcial, cobertura (<code>INCLUDE</code>), GIN para JSONB e texto.</li>
<li><strong>EXPLAIN ANALYZE</strong>: ler planos, Seq Scan vs. Index Scan, estimativas erradas.</li>
<li><strong>Transações e isolamento</strong>: Read Committed (padrão do PostgreSQL), Repeatable Read, Serializable; anomalias como <em>lost update</em> e <em>write skew</em>.</li>
<li><strong>Concorrência</strong>: locking otimista (coluna <code>version</code>) vs. pessimista (<code>SELECT ... FOR UPDATE</code>), <code>SKIP LOCKED</code> para filas.</li>
<li><strong>Migrações</strong>: versionadas junto com o código (Prisma Migrate, node-pg-migrate ou SQL puro); migrações compatíveis para deploy sem downtime (expand/contract).</li>
</ol>
<h3>Do TypeScript ao banco</h3>
<p>Você vai encontrar três formas de acessar o banco: o driver puro (<code>pg</code>, você escreve o SQL), um <em>query builder</em> (Kysely, Drizzle: SQL com tipos) e um ORM (Prisma, TypeORM: você descreve modelos e ele gera o SQL). O projeto desta trilha usa Prisma pela produtividade, mas aprenda SQL antes: todo ORM vira SQL, e é o SQL gerado que aparece no <code>EXPLAIN</code>.</p>
<div class="callout"><b>Padrão expand/contract:</b> para renomear uma coluna sem derrubar o sistema, (1) adicione a nova, (2) escreva nas duas, (3) migre os dados, (4) leia da nova, (5) remova a antiga. Cinco deploys pequenos em vez de uma janela de manutenção.</div>

<h3>Escolha um banco</h3>
<p>Seu roadmap lista MySQL, SQLite, PostgreSQL, MariaDB e Oracle. Para esta trilha, use <strong>PostgreSQL</strong>: é open source, o mais completo, muito usado em projetos novos e disponível gerenciado em todas as nuvens. O SQL que você aprender vale para os outros com pequenas diferenças de dialeto.</p>`,
  code: [
    {
      t: "Window function: tarefas mais atrasadas por projeto",
      src: `WITH atrasadas AS (
  SELECT p.nome AS projeto, t.titulo, now() - t.prazo AS atraso
  FROM tarefas t JOIN projetos p ON p.id = t.projeto_id
  WHERE t.status <> 'concluida' AND t.prazo < now()
), ranqueadas AS (
  SELECT *, RANK() OVER (PARTITION BY projeto ORDER BY atraso DESC) AS posicao
  FROM atrasadas
)
SELECT * FROM ranqueadas WHERE posicao <= 3;   -- top 3 de cada projeto`,
    },
    {
      t: "Fila de trabalho segura com SKIP LOCKED",
      src: `-- Vários workers pegam trabalhos sem disputar a mesma linha
WITH proxima AS (
  SELECT id FROM trabalhos
  WHERE status = 'PENDENTE'
  ORDER BY criado_em
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
UPDATE trabalhos t SET status = 'EM_PROCESSAMENTO', pego_em = now()
FROM proxima WHERE t.id = proxima.id
RETURNING t.*;`,
    },
    {
      t: "Locking otimista com uma coluna de versão",
      src: `import pg from "pg";
const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// UPDATE ... WHERE version = $n: se outra requisição mudou a linha antes, nada é atualizado
async function renomearTarefa(id: string, titulo: string, versaoLida: number) {
  const r = await db.query(
    \`UPDATE tarefas SET titulo = $1, version = version + 1
     WHERE id = $2 AND version = $3\`,
    [titulo, id, versaoLida],
  );
  if (r.rowCount === 0) throw new ConflitoDeVersao(id); // vira HTTP 409 na API
}

class ConflitoDeVersao extends Error {
  constructor(id: string) {
    super("A tarefa " + id + " foi alterada por outra pessoa. Recarregue e tente de novo.");
  }
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Resolva os exercícios do <strong>pgexercises.com</strong> até a seção de window functions." },
    { lvl: 2, text: "Crie uma tabela com 5 milhões de tarefas (use <code>generate_series</code>), escreva 5 consultas lentas e otimize cada uma com índices, mostrando o <code>EXPLAIN ANALYZE</code> antes e depois." },
    { lvl: 2, text: "Reproduza a anomalia <em>write skew</em> (dois médicos de plantão saindo ao mesmo tempo) em Read Committed e mostre como Serializable a evita." },
    { lvl: 3, text: "Planeje e execute uma migração expand/contract que divide a coluna <code>nome_completo</code> em <code>nome</code> e <code>sobrenome</code> com a aplicação rodando e recebendo escrita contínua." },
  ],
  refs: [
    { t: "Documentação do PostgreSQL", u: "https://www.postgresql.org/docs/current/" },
    { t: "Tutorial oficial do PostgreSQL", u: "https://www.postgresql.org/docs/current/tutorial.html" },
    { t: "PostgreSQL Exercises", u: "https://pgexercises.com/" },
    { t: "Use The Index, Luke", u: "https://use-the-index-luke.com/" },
    { t: "node-postgres (pg)", u: "https://node-postgres.com/" },
    { t: "Livro: SQL Antipatterns, vol. 1 (Bill Karwin)", u: "https://pragprog.com/titles/bksap1/sql-antipatterns-volume-1/" },
  ],
});

/* ---------- Versionamento de código ---------- */

T({
  id: "build-git",
  phase: "p-git",
  title: "Git, repositórios remotos e build",
  level: "Base",
  hours: 12,
  summary: "npm e package.json, lockfile, monorepo com workspaces, gestão de dependências, Git e trunk-based development.",
  body: `
<p>A estrutura do build é a primeira materialização da arquitetura. Num monorepo com <em>workspaces</em>, cada pacote declara suas dependências no próprio <code>package.json</code>: o pacote <code>dominio</code> não deveria conseguir importar o pacote <code>infra</code> se a dependência não estiver declarada. Com o <strong>pnpm</strong>, isso é garantido de verdade, porque ele não deixa um pacote enxergar dependências que não declarou.</p>
<h3>O que dominar</h3>
<ul>
<li><strong>npm e package.json</strong>: <code>dependencies</code> vs. <code>devDependencies</code>, <em>scripts</em> (<code>npm run build</code>, <code>test</code>, <code>lint</code>), versionamento semântico (<code>^1.2.3</code> aceita 1.x), <code>"type": "module"</code> para ESM.</li>
<li><strong>Lockfile</strong> (<code>package-lock.json</code> ou <code>pnpm-lock.yaml</code>): sempre no Git. Em CI e Docker use <code>npm ci</code>, que instala exatamente o que está no lockfile.</li>
<li><strong>Build de TypeScript</strong>: <code>tsc</code> para verificar e compilar; em projetos NestJS o CLI cuida disso. <code>tsconfig.json</code> com <code>strict</code> ligado.</li>
<li><strong>Monorepo</strong>: separar <code>dominio</code>, <code>aplicacao</code>, <code>infra</code>, <code>api</code> em pacotes de um workspace, quando o projeto crescer a ponto de precisar.</li>
<li><strong>Dependências</strong>: <code>npm ls</code> para ver a árvore, <code>npm audit</code> e Dependabot ou Renovate para vulnerabilidades. Cada pacote a mais é código de terceiros rodando com as permissões do seu servidor: ataques à cadeia de suprimentos no npm são reais.</li>
<li><strong>Git</strong>: rebase interativo, bisect para achar o commit que quebrou, commits pequenos e com mensagem que explica o porquê (<em>Conventional Commits</em> ajudam).</li>
<li><strong>Trunk-based development</strong>: branches curtos (horas, não semanas), integração contínua de verdade, feature flags para esconder trabalho incompleto. É o que as pesquisas do DORA associam a times de alto desempenho.</li>
</ul>

<h3>Repositórios remotos</h3>
<p><strong>GitHub</strong>, <strong>GitLab</strong> e <strong>Bitbucket</strong> hospedam o repositório e o fluxo de colaboração: pull/merge requests, revisão de código, proteção de branch, issues e CI. Aprenda o fluxo completo: fork ou branch, commit, push, pull request, revisão, merge. O GitHub também é o seu portfólio: mantenha o projeto da trilha público e bem documentado.</p>`,
  code: [
    {
      t: "Monorepo com pnpm workspaces",
      src: `tarefas/
├── pnpm-workspace.yaml        # packages: ["packages/*"]
├── package.json               # scripts de raiz: lint, test, build
└── packages/
    ├── dominio/               # TypeScript puro, zero dependência de framework
    ├── aplicacao/             # casos de uso; depende de dominio
    ├── infra/                 # Prisma, Redis, clientes HTTP; depende de aplicacao
    └── api/                   # NestJS: controllers e main.ts; junta tudo

# packages/aplicacao/package.json (trecho)
{
  "name": "@tarefas/aplicacao",
  "type": "module",
  "dependencies": {
    "@tarefas/dominio": "workspace:*"
  }
}
# Repare: aplicacao não declara @tarefas/infra, então não consegue importá-la.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Crie o monorepo acima com pnpm e prove que <code>dominio</code> não consegue importar nada de <code>infra</code>. Depois repita com npm workspaces e compare o comportamento." },
    { lvl: 2, text: "Use <code>git bisect run</code> com um teste automatizado para achar o commit que introduziu um bug num histórico de 50 commits (crie o histórico com um script)." },
    { lvl: 2, text: "Configure Renovate ou Dependabot num repositório seu e escreva uma política de atualização de dependências." },
  ],
  refs: [
    { t: "npm Docs: package.json", u: "https://docs.npmjs.com/cli/configuring-npm/package-json" },
    { t: "pnpm: Workspaces", u: "https://pnpm.io/workspaces" },
    { t: "Pro Git (livro gratuito)", u: "https://git-scm.com/book/pt-br/v2" },
    { t: "Conventional Commits", u: "https://www.conventionalcommits.org/pt-br/v1.0.0/" },
    { t: "trunkbaseddevelopment.com", u: "https://trunkbaseddevelopment.com/" },
    { t: "DORA: capacidades técnicas", u: "https://dora.dev/capabilities/" },
  ],
});

/* ---------- Redes e Internet ---------- */

T({
  id: "web-fundamentos",
  phase: "p-web",
  title: "Fundamentos da Web e redes",
  level: "Base",
  hours: 20,
  summary: "Como a internet funciona, DNS, URLs, HTTP, cliente-servidor, servidores web e cache HTTP.",
  body: `
<p>Quase todo sistema que um arquiteto desenha conversa pela rede. Latência, DNS, TLS e cache HTTP aparecem em toda decisão de desempenho e disponibilidade.</p>
<h3>Como a internet funciona</h3>
<p>Redes interligadas trocando <strong>pacotes</strong> IP. Em camadas (modelo TCP/IP): <em>enlace</em> (Ethernet, Wi-Fi) → <em>rede</em> (IP, roteamento) → <em>transporte</em> (TCP confiável e ordenado; UDP rápido e sem garantias) → <em>aplicação</em> (HTTP, DNS, SMTP).</p>
<h3>Nome de domínio e DNS</h3>
<p>O DNS traduz <code>tarefas.com.br</code> em endereço IP. A resolução passa por resolvedor recursivo, servidores raiz, TLD (<code>.br</code>) e servidor autoritativo. Registros comuns: <code>A</code>/<code>AAAA</code> (IP), <code>CNAME</code> (apelido), <code>MX</code> (e-mail), <code>TXT</code>. O <strong>TTL</strong> diz quanto tempo a resposta pode ficar em cache: TTL alto dificulta trocar de servidor rápido num incidente.</p>
<h3>Estrutura de uma URL</h3>
<p><code>https://api.tarefas.com.br:443/v1/projetos/42?status=aberta#detalhes</code> → esquema, host, porta, caminho, query string, fragmento (o fragmento nunca vai ao servidor).</p>
<h3>Protocolo HTTP</h3>
<p>Requisição (método, caminho, headers, corpo) e resposta (status, headers, corpo). Stateless: cada requisição é independente. HTTP/1.1 (texto, uma requisição por vez por conexão), HTTP/2 (binário, multiplexado), HTTP/3 (sobre QUIC/UDP, melhor em redes instáveis).</p>
<h3>Arquitetura cliente-servidor e servidor web</h3>
<p>O cliente pede, o servidor responde. Servidores web (Nginx, Caddy) servem arquivos estáticos, terminam TLS e fazem proxy reverso para aplicações. No Node, a sua aplicação <em>é</em> o servidor HTTP (o módulo <code>node:http</code>, que Express, Fastify e NestJS usam por baixo); em produção, ela costuma ficar atrás de um proxy ou load balancer.</p>
<h3>Cache HTTP</h3>
<p>Headers <code>Cache-Control</code> (<code>max-age</code>, <code>no-store</code>, <code>private</code>), <code>ETag</code> + <code>If-None-Match</code> (resposta 304 sem corpo). Cache bem configurado é desempenho de graça e base do funcionamento de CDNs.</p>
`,
  code: [
    {
      t: "Investigando com o terminal",
      src: `dig +trace tarefas.exemplo.com       # caminho completo da resolução DNS
curl -v https://example.com           # handshake TLS, headers da requisição e da resposta
curl -I https://example.com           # só os headers (veja Cache-Control e ETag)
curl -w "dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} total:%{time_total}\\n" \\
     -o /dev/null -s https://example.com   # onde o tempo foi gasto`,
    },
    {
      t: "ETag e cache HTTP com node:http, sem framework",
      src: `import { createServer } from "node:http";
import { createHash } from "node:crypto";

const projetos = [{ id: 1, nome: "Site novo" }];

createServer((req, res) => {
  if (req.method === "GET" && req.url === "/projetos") {
    const corpo = JSON.stringify(projetos);
    const etag = '"' + createHash("sha1").update(corpo).digest("base64url") + '"';

    if (req.headers["if-none-match"] === etag) {
      res.writeHead(304, { ETag: etag }).end();     // nada mudou: resposta sem corpo
      return;
    }
    res.writeHead(200, {
      "Content-Type": "application/json",
      ETag: etag,
      "Cache-Control": "private, max-age=60",
    }).end(corpo);
    return;
  }
  res.writeHead(404).end();
}).listen(3000);
// curl -i localhost:3000/projetos, copie o ETag e repita com -H 'If-None-Match: "..."'`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Com <code>curl -w</code>, meça o tempo de DNS, TCP, TLS e total para 5 sites. Explique por que sites em outro continente são mais lentos." },
    { lvl: 1, text: "Abra o DevTools do navegador numa página grande e classifique as requisições por tipo, tamanho e se vieram do cache." },
    { lvl: 2, text: "Escreva um servidor HTTP mínimo com <code>node:net</code> (TCP puro, sem <code>node:http</code>) que entende GET e devolve arquivos estáticos. Você vai ver o HTTP como texto." },
    { lvl: 3, text: "Configure Nginx como proxy reverso com TLS na frente de 2 instâncias de uma API Node, com cache de respostas GET por 60 s. Mostre os headers de acerto de cache." },
  ],
  refs: [
    { t: "MDN: An overview of HTTP", u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview" },
    { t: "MDN: HTTP caching", u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" },
    { t: "Node.js: Anatomy of an HTTP Transaction", u: "https://nodejs.org/en/learn/modules/anatomy-of-an-http-transaction" },
    { t: "How DNS Works (quadrinho)", u: "https://howdns.works/" },
    { t: "Cloudflare Learning Center", u: "https://www.cloudflare.com/learning/" },
    { t: "Livro: High Performance Browser Networking (Ilya Grigorik, gratuito)", u: "https://hpbn.co/" },
  ],
});

T({
  id: "seguranca-web",
  phase: "p-web",
  title: "Segurança web: login, sessões e proteções",
  level: "Intermediário",
  hours: 20,
  summary: "HTTPS, como um sistema de login funciona, autenticação vs. autorização, CORS, cookies, sessão, VPN e firewall.",
  body: `
<p>Antes de pensar em segurança como requisito de arquitetura (etapa de Arquiteto de Soluções), você precisa dominar os mecanismos que todo sistema web usa.</p>
<h3>HTTP vs HTTPS</h3>
<p>HTTPS é HTTP dentro de <strong>TLS</strong>: criptografia, integridade e autenticidade do servidor via certificado. O handshake negocia chaves; o certificado é assinado por uma autoridade confiável (Let's Encrypt emite de graça). Sem HTTPS, qualquer um no caminho lê e altera o tráfego. Use HSTS para impedir que o navegador volte para HTTP.</p>
<h3>Como funciona um sistema de login</h3>
<ol>
<li>Senhas nunca são guardadas; guarda-se um <strong>hash lento com salt</strong> (Argon2id ou bcrypt). No Node, use a biblioteca <code>argon2</code>; nunca SHA-256 puro.</li>
<li>No login, o servidor compara o hash e cria uma <strong>sessão</strong> (ID aleatório guardado no servidor, enviado ao navegador como cookie) ou emite um <strong>token</strong> (JWT assinado, de vida curta, mais um refresh token).</li>
<li>Proteções: limite de tentativas, MFA, mensagens de erro genéricas ("e-mail ou senha inválidos").</li>
</ol>
<h3>Autenticação x autorização</h3>
<p><strong>Autenticação</strong>: quem é você? <strong>Autorização</strong>: o que você pode fazer? Um usuário autenticado ainda pode não ter permissão para ver o projeto de outra pessoa: a falha de autorização mais comum (IDOR, <em>Insecure Direct Object Reference</em>). Toda consulta por ID precisa checar se o usuário tem acesso àquele recurso.</p>
<h3>Cookies e sessão</h3>
<p>Atributos que importam: <code>HttpOnly</code> (JavaScript não lê, protege contra XSS), <code>Secure</code> (só HTTPS), <code>SameSite=Lax/Strict</code> (protege contra CSRF), <code>Max-Age</code>. Sessão no servidor é simples de revogar; em várias instâncias, guarde-a no Redis. JWT não precisa de armazenamento, mas é difícil de revogar antes de expirar: por isso tokens de acesso duram minutos.</p>
<h3>CORS</h3>
<p>Por padrão, o navegador bloqueia que JavaScript de <code>app.tarefas.com</code> leia respostas de <code>api.outra.com</code> (same-origin policy). CORS é o servidor dizendo quais origens podem. Nunca use <code>*</code> com credenciais. CORS protege o usuário no navegador; não é controle de acesso da sua API.</p>
<h3>VPN e firewall</h3>
<p><strong>Firewall</strong> filtra tráfego por regras (IP, porta, protocolo); na nuvem, são os security groups. <strong>VPN</strong> cria um túnel criptografado para acessar uma rede privada. Bancos de dados nunca devem ficar expostos à internet.</p>
`,
  code: [
    {
      t: "Cadastro e login com Argon2 e JWT no NestJS",
      src: `import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import argon2 from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarios: UsuariosRepository,
    private readonly jwt: JwtService,
  ) {}

  async cadastrar(email: string, senha: string) {
    const hash = await argon2.hash(senha); // Argon2id com salt aleatório embutido no hash
    return this.usuarios.criar({ email, hashSenha: hash });
  }

  async entrar(email: string, senha: string) {
    const u = await this.usuarios.porEmail(email);
    // Mesma mensagem nos dois casos: não revela quais e-mails existem
    if (!u || !(await argon2.verify(u.hashSenha, senha)))
      throw new UnauthorizedException("E-mail ou senha inválidos");
    return { accessToken: await this.jwt.signAsync({ sub: u.id }, { expiresIn: "15m" }) };
  }
}`,
    },
    {
      t: "CORS restrito, cookies seguros e headers de proteção",
      src: `// main.ts
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { AppModule } from "./app.module.js";

const app = await NestFactory.create(AppModule);
app.use(helmet()); // HSTS, X-Content-Type-Options, e outros headers seguros
app.enableCors({
  origin: ["https://app.tarefas.com.br"], // nunca "*" com credenciais
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true,
});
await app.listen(process.env.PORT ?? 3000);

// Ao emitir um refresh token em cookie (no controller):
// res.cookie("refresh", token, { httpOnly: true, secure: true, sameSite: "lax",
//                                path: "/auth/refresh", maxAge: 7 * 24 * 3600 * 1000 });`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Implemente cadastro e login com Argon2 e uma rota protegida por JWT. Inspecione o token em jwt.io e explique por que ele não deve conter dados sensíveis." },
    { lvl: 2, text: "Crie um front-end em outra porta chamando sua API. Veja o erro de CORS, entenda a requisição preflight (OPTIONS) e corrija liberando só a origem certa." },
    { lvl: 2, text: "Escreva um teste que tenta ler um recurso de outro usuário (IDOR) e garanta que a API responde 404 ou 403." },
    { lvl: 3, text: "Explore a sua própria aplicação com OWASP ZAP e corrija os alertas de severidade média ou alta." },
  ],
  refs: [
    { t: "OWASP Cheat Sheet: Authentication", u: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" },
    { t: "OWASP Cheat Sheet: Session Management", u: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" },
    { t: "OWASP Cheat Sheet: Password Storage", u: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" },
    { t: "MDN: Cross-Origin Resource Sharing (CORS)", u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" },
    { t: "MDN: Using HTTP cookies", u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" },
    { t: "NestJS: Authentication", u: "https://docs.nestjs.com/security/authentication" },
    { t: "OWASP ZAP", u: "https://www.zaproxy.org/" },
  ],
});

T({
  id: "apis",
  phase: "p-web",
  title: "APIs & Integrações: REST, HATEOAS, gRPC, GraphQL e HTTP/3",
  level: "Intermediário",
  hours: 25,
  summary: "Recursos, verbos, códigos HTTP, versionamento, idempotência, paginação, OpenAPI e quando usar gRPC ou GraphQL.",
  body: `
<p>APIs são contratos públicos, e contratos são caros de mudar. Uma API mal desenhada amarra todos os consumidores por anos. Desenhar APIs é uma das responsabilidades mais visíveis de um arquiteto.</p>
<h3>REST bem feito</h3>
<ul>
<li><strong>Recursos são substantivos</strong>: <code>POST /tarefas</code>, <code>GET /tarefas/{id}</code>. Ações de negócio que não cabem em CRUD viram sub-recursos: <code>POST /tarefas/{id}/conclusao</code>.</li>
<li><strong>Códigos HTTP corretos</strong>: 201 com <code>Location</code> ao criar, 204 sem corpo, 400 entrada inválida, 404, 409 conflito de estado, 422 regra de negócio, 429 limite.</li>
<li><strong>Erros padronizados</strong> com <strong>RFC 9457 (Problem Details)</strong>: <code>type</code>, <code>title</code>, <code>status</code>, <code>detail</code>. No NestJS, um <em>exception filter</em> global formata todos os erros assim.</li>
<li><strong>Idempotência</strong>: GET, PUT e DELETE são idempotentes por definição. Para POST em operações críticas (pagamento, criação que não pode duplicar), exija um header <code>Idempotency-Key</code>.</li>
<li><strong>Paginação por cursor</strong> em listas grandes, em vez de <code>offset</code>, que fica lento e instável quando dados mudam.</li>
<li><strong>Versionamento</strong>: evite quebrar; adicione campos opcionais. Quando quebrar, versione (<code>/v2</code> ou header) e tenha política de depreciação.</li>
<li><strong>Design-first</strong> com OpenAPI: o contrato é revisado antes do código. No NestJS, o <code>@nestjs/swagger</code> gera a documentação a partir do código.</li>
</ul>
<h3>Quando não usar REST</h3>
<table class="tbl"><thead><tr><th>Estilo</th><th>Bom para</th><th>Cuidado</th></tr></thead><tbody>
<tr><td>REST/JSON</td><td>APIs públicas, integração ampla, cache HTTP</td><td>Verborragia, múltiplas idas e voltas</td></tr>
<tr><td>gRPC/Protobuf</td><td>Comunicação interna entre serviços, streaming, baixa latência</td><td>Difícil de usar direto do navegador</td></tr>
<tr><td>GraphQL</td><td>Front-ends com necessidades variadas de dados (BFF)</td><td>Cache, N+1 no servidor, controle de custo de consulta</td></tr>
<tr><td>Eventos assíncronos</td><td>Desacoplar no tempo, notificar muitos interessados</td><td>Consistência eventual, rastreabilidade (documente com AsyncAPI)</td></tr>
</tbody></table>

<h3>HATEOAS e HTTP/3</h3>
<p><strong>HATEOAS</strong> (Hypermedia as the Engine of Application State) é o nível mais alto de maturidade REST: a resposta traz links para as próximas ações possíveis, e o cliente navega por eles em vez de montar URLs. É raro em APIs públicas, mas útil em fluxos com estados: uma tarefa só expõe o link de conclusão quando pode ser concluída. Em TypeScript, basta montar os links na resposta; não precisa de biblioteca.</p>
<p><strong>HTTP/3</strong> roda sobre <strong>QUIC</strong> (UDP): conexões mais rápidas, sem bloqueio entre fluxos quando um pacote se perde, e troca de rede (Wi-Fi para 4G) sem perder a conexão. Normalmente é habilitado na borda (CDN, load balancer), não na sua aplicação.</p>`,
  code: [
    {
      t: "Controller com validação, 201 e Location",
      src: `import { Body, Controller, Headers, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { z } from "zod";

const NovaTarefa = z.object({
  titulo: z.string().trim().min(3).max(120),
  prazo: z.coerce.date().optional(),
});
type NovaTarefa = z.infer<typeof NovaTarefa>;

@Controller("projetos/:projetoId/tarefas")
export class TarefasController {
  constructor(private readonly criarTarefa: CriarTarefa) {}

  @Post()
  async criar(
    @Body({ schema: NovaTarefa }) dados: NovaTarefa,  // validado pelo StandardSchemaValidationPipe
    @Headers("idempotency-key") chave: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tarefa = await this.criarTarefa.executar(dados, chave);
    res.status(201).location("/tarefas/" + tarefa.id);
    return tarefa;
  }
}`,
    },
    {
      t: "Erros no formato Problem Details (RFC 9457)",
      src: `import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import type { Response } from "express";

export class RegraViolada extends Error {
  constructor(readonly codigo: string, mensagem: string) {
    super(mensagem);
  }
}

@Catch(RegraViolada)
export class RegraVioladaFilter implements ExceptionFilter {
  catch(e: RegraViolada, host: ArgumentsHost) {
    host.switchToHttp().getResponse<Response>()
      .status(422)
      .type("application/problem+json")
      .json({
        type: "https://api.tarefas.exemplo/erros/" + e.codigo,
        title: "Regra de negócio violada",
        status: 422,
        detail: e.message,
      });
  }
}
// main.ts: app.useGlobalFilters(new RegraVioladaFilter());`,
    },
    {
      t: "Idempotência no servidor",
      src: `// A chave é única no banco: duas requisições iguais nunca criam duas tarefas
async executar(dados: NovaTarefa, chave: string) {
  return this.prisma.$transaction(async (tx) => {
    const anterior = await tx.idempotencia.findUnique({ where: { chave } });
    if (anterior) return tx.tarefa.findUniqueOrThrow({ where: { id: anterior.tarefaId } });

    const tarefa = await tx.tarefa.create({ data: { titulo: dados.titulo, prazo: dados.prazo } });
    await tx.idempotencia.create({ data: { chave, tarefaId: tarefa.id } }); // UNIQUE(chave)
    return tarefa;
  });
}
// Se duas chegarem juntas, a segunda falha no UNIQUE; trate como "já processada".`,
    },
    {
      t: "HATEOAS sem biblioteca: links conforme o estado",
      src: `function comLinks(t: Tarefa) {
  const links: Record<string, { href: string; method?: string }> = {
    self: { href: "/tarefas/" + t.id },
  };
  if (t.status !== "concluida")
    links.concluir = { href: "/tarefas/" + t.id + "/conclusao", method: "POST" };
  if (t.status === "aberta")
    links.atribuir = { href: "/tarefas/" + t.id + "/responsavel", method: "PUT" };
  return { ...t, _links: links };
}`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Escreva primeiro o contrato OpenAPI de uma API de agendamento de consultas médicas; só depois implemente. Gere a documentação com <code>@nestjs/swagger</code> e compare com o contrato." },
    { lvl: 2, text: "Implemente paginação por cursor numa tabela de 1 milhão de linhas e compare o tempo da página 5.000 com paginação por offset." },
    { lvl: 2, text: "Exponha o mesmo caso de uso via REST e via gRPC (<code>@grpc/grpc-js</code>). Compare tamanho de payload e latência com um teste de carga." },
    { lvl: 3, text: "Revise a API pública de pagamentos da Stripe e escreva um guia de estilo de APIs de 2 páginas para um time fictício, com 10 regras e exemplos certos e errados." },
  ],
  refs: [
    { t: "RFC 9457: Problem Details for HTTP APIs", u: "https://www.rfc-editor.org/rfc/rfc9457" },
    { t: "Microsoft REST API Guidelines", u: "https://github.com/microsoft/api-guidelines" },
    { t: "Google API Design Guide", u: "https://cloud.google.com/apis/design" },
    { t: "Stripe: idempotent requests", u: "https://docs.stripe.com/api/idempotent_requests" },
    { t: "OpenAPI Specification", u: "https://spec.openapis.org/oas/latest.html" },
    { t: "NestJS: OpenAPI", u: "https://docs.nestjs.com/openapi/introduction" },
    { t: "AsyncAPI", u: "https://www.asyncapi.com/" },
    { t: "Livro: API Design Patterns (JJ Geewax)", u: "https://www.manning.com/books/api-design-patterns" },
    { t: "Martin Fowler: Richardson Maturity Model", u: "https://martinfowler.com/articles/richardsonMaturityModel.html" },
  ],
});

/* ---------- Model-View-Controller (MVC) ---------- */

T({
  id: "nestjs",
  phase: "p-mvc",
  title: "Model-View-Controller com NestJS",
  level: "Intermediário",
  hours: 40,
  summary: "O padrão MVC, por que escolher NestJS entre os frameworks do seu mapa, e NestJS em profundidade.",
  body: `
<h3>O padrão Model-View-Controller</h3>
<p>MVC separa a aplicação em três papéis: <strong>Model</strong> (dados e regras), <strong>View</strong> (apresentação) e <strong>Controller</strong> (recebe a requisição, aciona o model e escolhe a resposta). Em APIs REST, a "view" é a representação JSON. O ganho é separar o que muda por motivos diferentes: tela, fluxo e regra.</p>
<p>Seu roadmap lista vários frameworks MVC (NestJS, Laravel, Spring Boot, Flask, Symfony, Ruby on Rails, ASP.NET, Django). Como sua linguagem é TypeScript, o caminho é <strong>NestJS</strong>: o framework de backend Node.js mais estruturado, com módulos, injeção de dependência e camadas bem definidas. Ele se inspira no Angular e no Spring, então o que você aprender aqui transfere para outras stacks. Controllers são classes com <code>@Controller</code>, serviços e entidades formam o model, e a view é JSON (ou templates, raramente).</p>
<div class="callout"><b>Limite do MVC</b>MVC organiza a camada de entrada, não o sistema inteiro. Controllers gordos com regra de negócio são o problema mais comum. Mais adiante, na etapa de Arquiteto, você vai ver como hexagonal e DDD organizam o que fica atrás do controller.</div>

<p>A versão <strong>12</strong> do NestJS saiu em agosto de 2026. O <code>nest new</code> agora pergunta se o projeto é ESM (o padrão) ou CommonJS; projetos ESM vêm com <strong>Vitest</strong> para testes e <strong>oxlint</strong> como linter, e o TypeScript já vem em modo estrito. Os decorators <code>@Body</code>, <code>@Query</code> e <code>@Param</code> aceitam um <code>schema</code> no padrão <em>Standard Schema</em>, então você valida com zod direto na rota, sem precisar de classes de DTO com decorators.</p>
<h3>Entenda por dentro, não só por fora</h3>
<p>A diferença entre quem usa NestJS e um arquiteto que usa NestJS é saber o que acontece por trás dos decorators.</p>
<ul>
<li><strong>Módulos</strong>: cada <code>@Module</code> declara seus <em>providers</em>, o que <em>exporta</em> e o que <em>importa</em>. É a primeira ferramenta de fronteira: um módulo só enxerga o que outro exportou.</li>
<li><strong>Container de injeção de dependência</strong>: o Nest cria os providers e injeta pelo construtor. Dependências explícitas deixam as classes testáveis sem o framework. Conheça os escopos: <em>singleton</em> (padrão), <em>request</em> e <em>transient</em>.</li>
<li><strong>Ciclo de vida da requisição</strong>: middleware → guards (autorização) → interceptors (antes) → pipes (validação e transformação) → handler → interceptors (depois) → exception filters. Saber a ordem evita metade dos bugs.</li>
<li><strong>Configuração</strong>: <code>@nestjs/config</code> com validação das variáveis de ambiente na inicialização. Se faltar <code>DATABASE_URL</code>, a aplicação nem sobe.</li>
<li><strong>Persistência</strong>: Prisma (o ORM usado no projeto), consultas N+1, <code>include</code> e <code>select</code>, transações com <code>$transaction</code>.</li>
<li><strong>Ciclo de vida da aplicação</strong>: <code>onModuleInit</code>, <code>onModuleDestroy</code> e <code>enableShutdownHooks()</code> para fechar conexões ao receber <code>SIGTERM</code>.</li>
<li><strong>Fronteiras</strong>: o Nest não impede que um módulo importe arquivos internos de outro; para isso, use regras de dependência (veja o monolito modular na etapa de Arquiteto).</li>
</ul>
<div class="callout"><b>Cuidado com o escopo REQUEST:</b> se um provider tem escopo de requisição, todo provider que depende dele também passa a ser recriado a cada requisição, em cascata até o controller. Um único <code>Scope.REQUEST</code> mal colocado pode multiplicar alocações e derrubar o desempenho. Prefira passar o contexto da requisição como parâmetro ou usar <code>AsyncLocalStorage</code>.</div>
`,
  code: [
    {
      t: "Configuração validada na inicialização",
      src: `// config.ts
import { z } from "zod";

export const Env = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().int().default(3000),
});
export type Env = z.infer<typeof Env>;

// app.module.ts
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (cru) => Env.parse(cru), // erro claro na subida, não no meio da madrugada
    }),
    TarefasModule,
  ],
})
export class AppModule {}`,
    },
    {
      t: "Resolvendo N+1 com Prisma",
      src: `// Ruim: 1 consulta para os projetos + 1 consulta por projeto = 1 + N
const projetos = await prisma.projeto.findMany({ where: { donoId } });
for (const p of projetos) {
  p.tarefas = await prisma.tarefa.findMany({ where: { projetoId: p.id } });
}

// Bom: o Prisma busca as relações em lote
const comTarefas = await prisma.projeto.findMany({
  where: { donoId },
  include: { tarefas: true },
});

// Para telas de listagem, traga só o que a tela usa:
const resumos = await prisma.projeto.findMany({
  where: { donoId },
  select: { id: true, nome: true, _count: { select: { tarefas: true } } },
});`,
    },
    {
      t: "Módulo com fronteira explícita",
      src: `// tarefas.module.ts
@Module({
  imports: [PrismaModule],
  controllers: [TarefasController],
  providers: [TarefasService, { provide: TarefasRepository, useClass: TarefasPrismaRepository }],
  exports: [TarefasService], // só o serviço é público; o repositório fica interno
})
export class TarefasModule {}

// Em outro módulo, injetar TarefasRepository dá erro na subida:
// "Nest can't resolve dependencies..." — a fronteira funcionando.`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Construa uma API de biblioteca (livros, autores, empréstimos) com NestJS 12, Prisma, PostgreSQL via Docker Compose, migrações e validação com zod." },
    { lvl: 2, text: "Ative o log de consultas do Prisma, encontre um N+1 na sua API e corrija de duas formas diferentes. Conte as consultas antes e depois." },
    { lvl: 2, text: "Escreva um interceptor que mede o tempo de cada requisição e um guard que bloqueia rotas para usuários sem papel de administrador. Desenhe a ordem em que eles rodam." },
    { lvl: 3, text: "Leia o código-fonte do <code>NestFactory</code> e do injetor de dependências e explique num diagrama de sequência o que acontece entre <code>NestFactory.create</code> e a primeira requisição atendida." },
  ],
  refs: [
    { t: "NestJS: documentação oficial", u: "https://docs.nestjs.com/" },
    { t: "NestJS: Request lifecycle", u: "https://docs.nestjs.com/faq/request-lifecycle" },
    { t: "NestJS: Validation", u: "https://docs.nestjs.com/techniques/validation" },
    { t: "NestJS: receita com Prisma", u: "https://docs.nestjs.com/recipes/prisma" },
    { t: "Prisma: documentação", u: "https://www.prisma.io/docs" },
  ],
});

/* ---------- Docker ---------- */

T({
  id: "docker",
  phase: "p-docker",
  title: "Docker na prática",
  level: "Base",
  hours: 15,
  summary: "Conceitos de conteinerização, comandos básicos, imagens, volumes, redes, Dockerfile e Docker Compose.",
  body: `
<p>Docker é o último tópico da etapa Júnior no seu roadmap, e é o que leva seu código do "funciona na minha máquina" para "funciona em qualquer lugar".</p>
<h3>Conceitos de conteinerização</h3>
<p>Um <strong>contêiner</strong> é um processo isolado que usa recursos do kernel Linux (namespaces para isolar, cgroups para limitar CPU e memória). Diferente de uma máquina virtual, não carrega um sistema operacional inteiro: sobe em milissegundos e pesa megabytes. Uma <strong>imagem</strong> é o pacote imutável (sistema de arquivos em camadas + metadados) a partir do qual contêineres são criados.</p>
<h3>Comandos básicos</h3>
<p><code>docker run</code>, <code>ps</code>, <code>logs -f</code>, <code>exec -it</code>, <code>stop</code>, <code>rm</code>, <code>images</code>, <code>build</code>, <code>pull/push</code>, <code>inspect</code>, <code>stats</code>.</p>
<h3>Imagens, volumes e redes</h3>
<ul>
<li><strong>Imagens</strong> são feitas de camadas; cada instrução do Dockerfile gera uma. Ordene do que muda menos para o que muda mais para aproveitar o cache: copie <code>package.json</code> e o lockfile, rode <code>npm ci</code>, e só depois copie o código.</li>
<li><strong>Volumes</strong> guardam dados fora do ciclo de vida do contêiner. Sem volume, o banco perde os dados quando o contêiner é removido.</li>
<li><strong>Redes</strong>: contêineres na mesma rede definida pelo usuário se encontram pelo nome (o serviço <code>api</code> acessa <code>db:5432</code>).</li>
</ul>
<h3>Dockerfile e Compose</h3>
<p>O Dockerfile descreve como construir a imagem (veja o multi-stage para NestJS no tópico seguinte). O <strong>Docker Compose</strong> descreve um ambiente com vários contêineres (API, banco, Redis) num arquivo YAML. Em desenvolvimento, é comum subir só as dependências no Compose (<code>docker compose up -d db redis</code>) e rodar a API direto na máquina com recarga automática.</p>
`,
  code: [
    {
      t: "compose.yaml de um ambiente de desenvolvimento",
      src: `services:
  api:
    build: .
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgresql://tarefas:tarefas@db:5432/tarefas
      REDIS_URL: redis://redis:6379
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:17-alpine
    environment: { POSTGRES_DB: tarefas, POSTGRES_USER: tarefas, POSTGRES_PASSWORD: tarefas }
    ports: ["5432:5432"]
    volumes: [dados-pg:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U tarefas"]
      interval: 5s

  redis:
    image: redis:7-alpine

volumes:
  dados-pg:`,
    },
    {
      t: "Comandos do dia a dia",
      src: `docker compose up -d            # sobe tudo em segundo plano
docker compose ps               # estado dos serviços
docker compose logs -f api      # acompanha os logs da API
docker compose exec db psql -U tarefas   # entra no banco
docker stats                    # CPU e memória de cada contêiner
docker compose down             # derruba (o volume dados-pg continua)`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Rode PostgreSQL com e sem volume. Crie uma tabela, remova o contêiner e mostre a diferença." },
    { lvl: 1, text: "Escreva o Dockerfile da sua API e reduza o tamanho da imagem o máximo que conseguir. Registre os tamanhos de cada tentativa." },
    { lvl: 2, text: "Monte um <code>compose.yaml</code> com API, PostgreSQL, Redis e Adminer, com healthchecks e rede própria." },
    { lvl: 3, text: "Use <code>docker stats</code> e limites (<code>mem_limit</code>, <code>cpus</code>) para descobrir a menor memória com que sua API funciona de forma estável sob carga." },
  ],
  refs: [
    { t: "Docker: Get started", u: "https://docs.docker.com/get-started/" },
    { t: "Docker: guia oficial para Node.js", u: "https://docs.docker.com/guides/nodejs/" },
    { t: "Docker Compose: documentação", u: "https://docs.docker.com/compose/" },
    { t: "Play with Docker (laboratório online)", u: "https://labs.play-with-docker.com/" },
    { t: "roadmap.sh: Docker", u: "https://roadmap.sh/docker" },
  ],
});

T({
  id: "containers-k8s",
  phase: "p-docker",
  title: "Do Docker ao Kubernetes",
  level: "Intermediário",
  hours: 30,
  summary: "Docker para Node.js, imagens enxutas, Kubernetes essencial, probes, recursos e configuração.",
  body: `
<p>Contêineres padronizam como o software é empacotado e executado. Kubernetes é o padrão de fato para orquestrá-los. Arquitetos não precisam ser administradores de cluster, mas precisam entender os conceitos para desenhar sistemas que funcionem bem neles.</p>
<h3>Docker para Node.js</h3>
<ul>
<li>Use imagens oficiais <code>node</code> numa versão LTS fixa (<code>node:24-alpine</code> ou <code>-slim</code>), ou distroless para produção.</li>
<li><strong>Multi-stage</strong>: um estágio instala tudo e compila o TypeScript; o estágio final leva só o JavaScript compilado e as dependências de produção.</li>
<li>Rode como o usuário <code>node</code>, nunca como root.</li>
<li>Inicie com <code>node dist/main.js</code>, não com <code>npm start</code>: o npm não repassa bem os sinais de desligamento (<code>SIGTERM</code>), e o contêiner leva um <code>kill</code> à força depois do tempo limite.</li>
<li>Defina <code>NODE_ENV=production</code> e o limite de heap (<code>--max-old-space-size</code>) de acordo com a memória do contêiner.</li>
</ul>
<h3>Kubernetes essencial</h3>
<table class="tbl"><thead><tr><th>Objeto</th><th>Para quê</th></tr></thead><tbody>
<tr><td>Pod</td><td>Uma ou mais instâncias de contêiner que vivem juntas</td></tr>
<tr><td>Deployment</td><td>Mantém N réplicas e faz rolling update</td></tr>
<tr><td>Service</td><td>Endereço estável e balanceamento entre pods</td></tr>
<tr><td>Ingress / Gateway API</td><td>Entrada HTTP externa, roteamento, TLS</td></tr>
<tr><td>ConfigMap / Secret</td><td>Configuração e segredos fora da imagem</td></tr>
<tr><td>HorizontalPodAutoscaler</td><td>Escala réplicas por métrica</td></tr>
<tr><td>PodDisruptionBudget</td><td>Garante mínimo de réplicas durante manutenção</td></tr>
</tbody></table>
<h3>Probes: o detalhe que derruba sistemas</h3>
<p><strong>Liveness</strong> diz se o processo deve ser reiniciado; <strong>readiness</strong> diz se pode receber tráfego. Erro clássico: liveness que verifica o banco. Se o banco cai, o Kubernetes reinicia todos os pods em loop, o que não ajuda em nada. Liveness verifica só o próprio processo; dependências entram, com cuidado, na readiness. No NestJS, o pacote <code>@nestjs/terminus</code> ajuda a expor <code>/health/live</code> e <code>/health/ready</code> separados.</p>
`,
  code: [
    {
      t: "Dockerfile multi-stage para NestJS",
      src: `FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build && npm prune --omit=dev

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/package.json ./
USER node
EXPOSE 3000
# node direto (sem npm start) para receber o SIGTERM e desligar com calma
CMD ["node", "--max-old-space-size=384", "dist/main.js"]`,
    },
    {
      t: "Deployment com probes e recursos",
      src: `apiVersion: apps/v1
kind: Deployment
metadata: { name: tarefas-api }
spec:
  replicas: 3
  selector: { matchLabels: { app: tarefas-api } }
  template:
    metadata: { labels: { app: tarefas-api } }
    spec:
      containers:
        - name: app
          image: ghcr.io/voce/tarefas-api:1.4.2
          ports: [{ containerPort: 3000 }]
          resources:
            requests: { cpu: "250m", memory: "512Mi" }
            limits:   { memory: "512Mi" }      # sem limit de CPU evita throttling
          readinessProbe:
            httpGet: { path: /health/ready, port: 3000 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /health/live, port: 3000 }
            initialDelaySeconds: 10
          lifecycle:
            preStop: { sleep: { seconds: 10 } }   # drena conexões no rolling update`,
    },
  ],
  exercises: [
    { lvl: 1, text: "Crie a imagem da sua API com Dockerfile multi-stage. Compare o tamanho com uma imagem de um estágio só e com a variante <code>-slim</code>." },
    { lvl: 2, text: "Rode sua aplicação num cluster local (kind ou k3d) com Deployment, Service, Ingress, ConfigMap e Secret. Faça um rolling update sem erros sob carga." },
    { lvl: 2, text: "Configure HPA por CPU e observe o escalonamento durante um teste de carga." },
    { lvl: 3, text: "Empacote a API e o worker do projeto com Helm ou Kustomize, com valores diferentes para dev e produção." },
  ],
  refs: [
    { t: "Kubernetes: documentação", u: "https://kubernetes.io/docs/home/" },
    { t: "Docker Node: boas práticas oficiais", u: "https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md" },
    { t: "NestJS: Health checks (Terminus)", u: "https://docs.nestjs.com/recipes/terminus" },
    { t: "Livro: Kubernetes Patterns, 2ª ed. (Ibryam & Huß)", u: "https://k8spatterns.com/" },
    { t: "kind", u: "https://kind.sigs.k8s.io/" },
    { t: "roadmap.sh: Kubernetes", u: "https://roadmap.sh/kubernetes" },
  ],
});
