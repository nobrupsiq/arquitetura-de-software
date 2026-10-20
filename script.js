var PHASES = [
  {
    id: "f0",
    n: 0,
    title: "Fundação em Java moderno",
    weeks: "6–8 semanas",
    goal: "Dominar a linguagem e a JVM a ponto de ler qualquer código Java e entender o custo de cada linha.",
  },
  {
    id: "f1",
    n: 1,
    title: "Código que dura",
    weeks: "6–8 semanas",
    goal: "Escrever código limpo, testável e bem desenhado: a matéria-prima de qualquer arquitetura.",
  },
  {
    id: "f2",
    n: 2,
    title: "O ecossistema de produção",
    weeks: "8–10 semanas",
    goal: "Construir serviços reais com Spring Boot, banco relacional e APIs bem projetadas.",
  },
  {
    id: "f3",
    n: 3,
    title: "Pensar como arquiteto",
    weeks: "4–6 semanas",
    goal: "Entender o que é arquitetura, identificar características, decidir com trade-offs e documentar.",
  },
  {
    id: "f4",
    n: 4,
    title: "Estilos de arquitetura",
    weeks: "8–10 semanas",
    goal: "Conhecer os estilos clássicos e modernos, saber quando cada um serve e quando atrapalha.",
  },
  {
    id: "f5",
    n: 5,
    title: "Domain-Driven Design",
    weeks: "6–8 semanas",
    goal: "Modelar o negócio de verdade e desenhar fronteiras que fazem sentido para o domínio e para os times.",
  },
  {
    id: "f6",
    n: 6,
    title: "Sistemas distribuídos e dados",
    weeks: "10–12 semanas",
    goal: "Entender consistência, replicação, mensageria e os padrões que mantêm dados corretos entre serviços.",
  },
  {
    id: "f7",
    n: 7,
    title: "Escala, resiliência e observabilidade",
    weeks: "6–8 semanas",
    goal: "Projetar sistemas que aguentam carga, falham bem e explicam o próprio comportamento.",
  },
  {
    id: "f8",
    n: 8,
    title: "Cloud, DevOps e segurança",
    weeks: "8–10 semanas",
    goal: "Levar o sistema até produção com contêineres, pipelines, infraestrutura como código e segurança desde o desenho.",
  },
  {
    id: "f9",
    n: 9,
    title: "O arquiteto fora da curva",
    weeks: "contínuo",
    goal: "Liderança técnica, governança evolutiva, times e organização, system design e IA na arquitetura.",
  },
];

const TOPICS = [];
function T(o) {
  TOPICS.push(o);
}

/* ============================ FASE 0 ============================ */

T({
  id: "java-moderno",
  phase: "f0",
  title: "Java 25: a linguagem moderna",
  level: "Base",
  hours: 30,
  summary:
    "Records, sealed types, pattern matching, switch expressions e o estilo de Java que se escreve hoje.",
  body: `
<p>Muita gente aprende Java como se ainda estivéssemos em 2010: classes cheias de getters, <code>instanceof</code> seguido de cast, <code>if/else</code> em cascata. O Java atual é outra linguagem. A versão de suporte longo (LTS) mais recente é o <strong>Java 25</strong>, lançado em setembro de 2025; o Java 21 é a LTS anterior. Projetos novos devem começar em 25.</p>
<p>Para um arquiteto, isso importa por um motivo concreto: os recursos novos permitem <strong>modelar o domínio com precisão</strong>. Um tipo que só pode ter três formas, um valor imutável que não precisa de 40 linhas, um <code>switch</code> que o compilador garante ser completo. Tudo isso reduz bugs na origem.</p>
<h3>Os recursos que você precisa dominar</h3>
<ul>
<li><strong>Records</strong>: classes imutáveis de dados. Geram construtor, <code>equals</code>, <code>hashCode</code> e <code>toString</code>. Ideais para Value Objects e DTOs.</li>
<li><strong>Sealed interfaces/classes</strong>: você declara exatamente quais tipos podem implementar uma interface. O compilador passa a conhecer todas as variantes.</li>
<li><strong>Pattern matching</strong> em <code>instanceof</code> e <code>switch</code>, incluindo <em>record patterns</em> (desconstruir um record direto no <code>case</code>).</li>
<li><strong>Switch expressions</strong>: <code>switch</code> que retorna valor, sem <code>break</code>, com verificação de exaustividade quando usado com sealed types.</li>
<li><strong>var</strong>, <strong>text blocks</strong> (<code>"""</code>), <strong>Streams</strong> e <strong>Optional</strong> usados com moderação.</li>
<li><strong>Virtual threads</strong> (tópico próprio na fase 0).</li>
</ul>
<h3>Tipos algébricos: a ideia mais poderosa</h3>
<p>A combinação <em>sealed + records + switch com pattern matching</em> dá a Java o que linguagens funcionais chamam de <em>tipos algébricos de dados</em>. Em vez de representar um resultado de pagamento com um <code>String status</code> e campos que às vezes são nulos, você declara cada caso como um tipo. Estados inválidos deixam de ser representáveis. Essa frase, "tornar estados ilegais irrepresentáveis", é um princípio de design que você vai usar a carreira toda.</p>
<div class="callout"><b>Por que isso é arquitetura e não só sintaxe?</b> Porque a forma como você modela dados define o que pode dar errado. Um modelo frouxo empurra validação para todos os lugares do sistema; um modelo preciso concentra regras num lugar só.</div>
`,
  code: [
    {
      t: "Resultado de pagamento como tipo algébrico",
      src: `public sealed interface ResultadoPagamento
    permits Aprovado, Recusado, EmAnalise {}

public record Aprovado(String transacaoId, java.math.BigDecimal valor) implements ResultadoPagamento {}
public record Recusado(String motivo, boolean podeTentarDeNovo) implements ResultadoPagamento {}
public record EmAnalise(java.time.Duration prazoEstimado) implements ResultadoPagamento {}

public class NotificadorCliente {
    // O compilador exige todos os casos. Se alguém criar um 4º tipo,
    // este código para de compilar: o erro aparece antes de produção.
    String mensagem(ResultadoPagamento r) {
        return switch (r) {
            case Aprovado(var id, var valor) ->
                "Pagamento de R$ %s aprovado (%s)".formatted(valor, id);
            case Recusado(var motivo, var retry) when retry ->
                "Recusado: " + motivo + ". Tente novamente.";
            case Recusado(var motivo, var ignored) ->
                "Recusado: " + motivo + ". Use outro cartão.";
            case EmAnalise(var prazo) ->
                "Em análise. Resposta em até " + prazo.toHours() + "h.";
        };
    }
}`,
    },
    {
      t: "Value Object com validação no construtor compacto",
      src: `public record Email(String valor) {
    public Email {
        if (valor == null || !valor.matches("^[^@\\\\s]+@[^@\\\\s]+\\\\.[^@\\\\s]+$"))
            throw new IllegalArgumentException("E-mail inválido: " + valor);
        valor = valor.toLowerCase();   // normaliza antes de atribuir
    }
}

// Uso: se existe um Email, ele é válido. Ponto.
Email e = new Email("Ana@Exemplo.com");   // ana@exemplo.com`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Modele as formas geométricas <code>Circulo</code>, <code>Retangulo</code> e <code>Triangulo</code> como records de uma sealed interface <code>Forma</code> e escreva <code>double area(Forma f)</code> com switch exaustivo.",
    },
    {
      lvl: 1,
      text: "Crie os Value Objects <code>Cpf</code>, <code>Dinheiro</code> (valor + moeda, sem permitir somar moedas diferentes) e <code>Periodo</code> (início antes do fim).",
    },
    {
      lvl: 2,
      text: "Pegue um código legado com <code>String status</code> e campos opcionais (ex.: pedido com status PENDENTE/PAGO/CANCELADO e <code>dataCancelamento</code> nula). Refatore para sealed + records e liste quais bugs se tornaram impossíveis.",
    },
    {
      lvl: 3,
      text: "Implemente um avaliador de expressões aritméticas (<code>Num</code>, <code>Soma</code>, <code>Mult</code>, <code>Neg</code>) com sealed records e pattern matching recursivo, incluindo uma função de simplificação (<code>x*1 → x</code>, <code>x+0 → x</code>).",
    },
  ],
  refs: [
    { t: "JEP 409: Sealed Classes", u: "https://openjdk.org/jeps/409" },
    {
      t: "JEP 440/441: Record Patterns e Pattern Matching for switch",
      u: "https://openjdk.org/jeps/441",
    },
    {
      t: "Dev.java: o tutorial oficial da linguagem",
      u: "https://dev.java/learn/",
    },
    {
      t: "Marco Behler: guia de versões e recursos do Java",
      u: "https://www.marcobehler.com/guides/a-guide-to-java-versions-and-features",
    },
    {
      t: "Livro: Effective Java, 3ª ed. (Joshua Bloch)",
      u: "https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/",
      note: "o livro de Java mais importante já escrito",
    },
  ],
});

T({
  id: "jvm",
  phase: "f0",
  title: "JVM, memória e garbage collection",
  level: "Base",
  hours: 20,
  summary:
    "Heap, stack, JIT, coletores de lixo e como ler o comportamento de uma aplicação em produção.",
  body: `
<p>Arquitetos tomam decisões de capacidade: quanta memória um serviço precisa, quantas instâncias, que latência é aceitável. Sem entender a JVM, esses números são chute.</p>
<h3>O modelo mental</h3>
<ul>
<li><strong>Stack</strong>: uma por thread. Guarda frames de métodos e variáveis locais primitivas e referências. Morre com a chamada.</li>
<li><strong>Heap</strong>: compartilhado. Todo objeto vive aqui. É o que o garbage collector administra.</li>
<li><strong>Metaspace</strong>: metadados de classes. Vazamentos aqui aparecem em apps que recarregam classes.</li>
<li><strong>JIT (C1/C2)</strong>: o bytecode começa interpretado; métodos "quentes" são compilados para código nativo otimizado. Por isso aplicações Java "aquecem" e o primeiro minuto é mais lento.</li>
</ul>
<h3>Garbage collectors e quando usar cada um</h3>
<table class="tbl"><thead><tr><th>Coletor</th><th>Ponto forte</th><th>Quando escolher</th></tr></thead><tbody>
<tr><td>G1 (padrão)</td><td>Equilíbrio entre throughput e pausas</td><td>A maioria dos serviços web</td></tr>
<tr><td>ZGC (geracional)</td><td>Pausas abaixo de 1 ms com heaps grandes</td><td>APIs sensíveis a latência p99</td></tr>
<tr><td>Parallel</td><td>Máximo throughput</td><td>Jobs batch onde pausa não importa</td></tr>
<tr><td>Serial</td><td>Overhead mínimo</td><td>Contêineres muito pequenos, CLIs</td></tr>
</tbody></table>
<h3>JVM em contêiner</h3>
<p>A JVM moderna respeita os limites do cgroup do contêiner. Configure a heap como porcentagem (<code>-XX:MaxRAMPercentage=75</code>) em vez de valor fixo, e deixe espaço para memória fora do heap (threads, buffers diretos, metaspace). Um erro clássico de produção é o contêiner ser morto por OOM do Kubernetes sem nenhum <code>OutOfMemoryError</code> no log: a heap estava ok, mas a memória total passou do limite.</p>
<div class="callout"><b>Regra prática:</b> antes de otimizar, meça. Use JFR (Java Flight Recorder) e JDK Mission Control, ferramentas gratuitas e embutidas, com overhead baixo o bastante para rodar em produção.</div>
`,
  code: [
    {
      t: "Flags de uma JVM em contêiner",
      src: `# Dockerfile (trecho)
ENV JAVA_TOOL_OPTIONS="\\
  -XX:MaxRAMPercentage=75 \\
  -XX:+UseZGC -XX:+ZGenerational \\
  -XX:+ExitOnOutOfMemoryError \\
  -XX:StartFlightRecording=duration=0,filename=/tmp/app.jfr,settings=profile"`,
    },
    {
      t: "Provocando e observando um vazamento",
      src: `public class Vazamento {
    // Cache sem limite: o vazamento de memória mais comum em Java
    private static final Map<String, byte[]> CACHE = new HashMap<>();

    public static void main(String[] args) throws Exception {
        for (long i = 0; ; i++) {
            CACHE.put("k" + i, new byte[10_000]);
            if (i % 10_000 == 0) Thread.sleep(50);
        }
    }
}
// Rode com: java -Xmx256m -XX:+HeapDumpOnOutOfMemoryError Vazamento
// Abra o .hprof no Eclipse MAT e encontre o "dominator" (o HashMap).`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Rode o programa <code>Vazamento</code>, gere o heap dump e identifique no Eclipse MAT qual objeto retém a memória.",
    },
    {
      lvl: 2,
      text: "Crie uma API Spring simples, gere carga com <code>k6</code> ou <code>wrk</code> e compare latência p99 usando G1 e ZGC. Registre os números numa tabela.",
    },
    {
      lvl: 2,
      text: "Grave um JFR de 2 minutos sob carga e encontre os 3 métodos que mais alocam memória.",
    },
    {
      lvl: 3,
      text: "Escreva um mini-relatório de capacidade: dado 2.000 req/s com 50 ms de processamento, quantas instâncias de 1 vCPU/1 GB você precisa? Justifique com medições.",
    },
  ],
  refs: [
    {
      t: "Oracle: HotSpot GC Tuning Guide",
      u: "https://docs.oracle.com/en/java/javase/21/gctuning/",
    },
    {
      t: "JDK Mission Control",
      u: "https://www.oracle.com/java/technologies/jdk-mission-control.html",
    },
    { t: "Eclipse Memory Analyzer (MAT)", u: "https://eclipse.dev/mat/" },
    {
      t: "Livro: Optimizing Java (Evans, Gough, Newland)",
      u: "https://www.oreilly.com/library/view/optimizing-java/9781492039259/",
    },
  ],
});

T({
  id: "concorrencia",
  phase: "f0",
  title: "Concorrência e virtual threads",
  level: "Intermediário",
  hours: 25,
  summary:
    "Threads, memória compartilhada, locks, CompletableFuture e o modelo de virtual threads do Java 21+.",
  body: `
<p>Todo servidor é concorrente. Entender concorrência é entender por que um sistema trava, perde dados ou não escala. É também a base para entender sistemas distribuídos, que são concorrência com rede no meio.</p>
<h3>Os três problemas fundamentais</h3>
<ol>
<li><strong>Atomicidade</strong>: <code>contador++</code> são três operações (ler, somar, escrever). Duas threads podem perder incrementos.</li>
<li><strong>Visibilidade</strong>: uma thread pode não enxergar a escrita de outra sem uma barreira de memória (<code>volatile</code>, <code>synchronized</code>, classes atômicas).</li>
<li><strong>Ordenação</strong>: o compilador e a CPU reordenam instruções. O <em>Java Memory Model</em> define o que é garantido via relação <em>happens-before</em>.</li>
</ol>
<h3>Virtual threads mudaram o jogo</h3>
<p>Antes, cada requisição bloqueante ocupava uma thread do sistema operacional (~1 MB de stack, milhares no máximo). Para escalar, era preciso programação reativa (WebFlux, Reactor), que é poderosa mas difícil de ler e depurar. Com <strong>virtual threads</strong> (estáveis desde o Java 21), a JVM cria milhões de threads leves que são "desmontadas" do carrier thread quando bloqueiam em I/O. Você escreve código simples e bloqueante e ganha escala de código assíncrono.</p>
<p>No Spring Boot basta <code>spring.threads.virtual.enabled=true</code>. Mas atenção: virtual threads ajudam em <strong>I/O</strong>, não em CPU. E pools de conexão com banco continuam sendo o gargalo: 10.000 virtual threads disputando 20 conexões continuam esperando.</p>
<h3>Structured concurrency</h3>
<p>A API de <em>structured concurrency</em> trata um grupo de tarefas paralelas como uma unidade: se uma falha, as outras são canceladas; nada vaza. Ela evoluiu em preview ao longo das versões recentes; acompanhe o JEP correspondente antes de usar em produção.</p>
`,
  code: [
    {
      t: "Condição de corrida e correção",
      src: `class Contador {
    private int valor;                       // inseguro
    void inc() { valor++; }
}

class ContadorSeguro {
    private final AtomicLong valor = new AtomicLong();
    void inc() { valor.incrementAndGet(); }  // CAS, sem lock
    long get() { return valor.get(); }
}

// Teste: 1.000 virtual threads, 1.000 incrementos cada
try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
    var c = new ContadorSeguro();
    for (int i = 0; i < 1_000; i++)
        exec.submit(() -> { for (int j = 0; j < 1_000; j++) c.inc(); });
    exec.shutdown();
    exec.awaitTermination(1, TimeUnit.MINUTES);
    System.out.println(c.get());  // sempre 1_000_000
}`,
    },
    {
      t: "Chamadas paralelas a serviços com virtual threads",
      src: `record Painel(Cliente cliente, List<Pedido> pedidos, Saldo saldo) {}

Painel montarPainel(String clienteId) throws Exception {
    try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
        Future<Cliente> c = exec.submit(() -> clientes.buscar(clienteId));
        Future<List<Pedido>> p = exec.submit(() -> pedidos.ultimos(clienteId, 10));
        Future<Saldo> s = exec.submit(() -> carteira.saldo(clienteId));
        // Latência total ≈ a chamada mais lenta, não a soma das três
        return new Painel(c.get(), p.get(), s.get());
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Demonstre a condição de corrida com a classe <code>Contador</code> insegura e corrija de três formas: <code>synchronized</code>, <code>AtomicInteger</code> e <code>LongAdder</code>. Compare desempenho com JMH.",
    },
    {
      lvl: 2,
      text: "Implemente um <em>rate limiter</em> do tipo token bucket thread-safe e teste com 10.000 virtual threads.",
    },
    {
      lvl: 2,
      text: "Simule um deadlock com duas contas bancárias transferindo uma para a outra. Detecte com <code>jstack</code> e corrija ordenando a aquisição de locks.",
    },
    {
      lvl: 3,
      text: "Compare um endpoint Spring MVC com thread pool tradicional (200 threads) e com virtual threads, chamando um serviço externo lento (200 ms). Meça throughput e explique onde o gargalo se moveu.",
    },
  ],
  refs: [
    { t: "JEP 444: Virtual Threads", u: "https://openjdk.org/jeps/444" },
    {
      t: "Livro: Java Concurrency in Practice (Brian Goetz)",
      u: "https://jcip.net/",
      note: "antigo, mas os fundamentos não mudaram",
    },
    {
      t: "JMH: benchmarks corretos em Java",
      u: "https://github.com/openjdk/jmh",
    },
    {
      t: "Spring Boot: suporte a virtual threads",
      u: "https://docs.spring.io/spring-boot/reference/features/task-execution-and-scheduling.html",
    },
  ],
});

T({
  id: "estruturas",
  phase: "f0",
  title: "Estruturas de dados, algoritmos e complexidade",
  level: "Base",
  hours: 30,
  summary:
    "Big-O, coleções do Java, estruturas que aparecem em bancos e caches, e como elas determinam o desempenho.",
  body: `
<p>Arquitetos raramente implementam uma árvore B, mas precisam saber que um índice de banco é uma árvore B para entender por que <code>LIKE '%texto'</code> não usa índice. Estruturas de dados explicam o comportamento de toda a infraestrutura.</p>
<h3>O que estudar e onde aparece em arquitetura</h3>
<table class="tbl"><thead><tr><th>Estrutura</th><th>Onde você encontra no mundo real</th></tr></thead><tbody>
<tr><td>Hash table</td><td>HashMap, Redis, particionamento por hash, sharding</td></tr>
<tr><td>Árvore B / B+</td><td>Índices do PostgreSQL e MySQL</td></tr>
<tr><td>LSM tree</td><td>Cassandra, RocksDB, Kafka Streams state stores</td></tr>
<tr><td>Fila / log append-only</td><td>Kafka, write-ahead log de bancos, event sourcing</td></tr>
<tr><td>Heap (prioridade)</td><td>Agendadores, top-K, timeouts</td></tr>
<tr><td>Grafo</td><td>Dependências entre serviços, recomendações, rotas</td></tr>
<tr><td>Bloom filter</td><td>Evitar leituras desnecessárias em disco/cache</td></tr>
<tr><td>Consistent hashing</td><td>Balanceamento de cache distribuído, Dynamo, Cassandra</td></tr>
</tbody></table>
<h3>Complexidade com números reais</h3>
<p>Com 10 milhões de registros: O(n) = 10 milhões de operações; O(log n) ≈ 23. Essa diferença é a distância entre uma consulta de 5 segundos e uma de 1 milissegundo. Pense sempre em <strong>ordem de grandeza</strong>, e decore os números de latência que todo engenheiro deveria saber (acesso à memória ~100 ns, SSD ~100 µs, ida e volta no mesmo datacenter ~0,5 ms, entre continentes ~150 ms).</p>
`,
  code: [
    {
      t: "Escolhendo a coleção certa",
      src: `// Precisa de busca por chave? HashMap: O(1) médio
Map<String, Produto> porSku = new HashMap<>();

// Precisa de ordem + busca por faixa? TreeMap: O(log n)
NavigableMap<Instant, Evento> linhaDoTempo = new TreeMap<>();
var ultimaHora = linhaDoTempo.subMap(agora.minus(1, HOURS), true, agora, true);

// Precisa de LRU cache simples? LinkedHashMap com accessOrder
class LruCache<K, V> extends LinkedHashMap<K, V> {
    private final int max;
    LruCache(int max) { super(16, 0.75f, true); this.max = max; }
    @Override protected boolean removeEldestEntry(Map.Entry<K, V> e) {
        return size() > max;
    }
}`,
    },
    {
      t: "Consistent hashing em ~25 linhas",
      src: `public class AnelHash<N> {
    private final NavigableMap<Integer, N> anel = new TreeMap<>();
    private final int replicasVirtuais;

    public AnelHash(int replicasVirtuais) { this.replicasVirtuais = replicasVirtuais; }

    public void adicionar(N no) {
        for (int i = 0; i < replicasVirtuais; i++)
            anel.put(hash(no + "#" + i), no);
    }
    public void remover(N no) {
        for (int i = 0; i < replicasVirtuais; i++)
            anel.remove(hash(no + "#" + i));
    }
    public N noPara(String chave) {
        var e = anel.ceilingEntry(hash(chave));
        return (e != null ? e : anel.firstEntry()).getValue();
    }
    private int hash(String s) {
        return Hashing.murmur3_32_fixed().hashString(s, UTF_8).asInt(); // Guava
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Implemente o LRU cache acima e escreva testes que provem a política de despejo.",
    },
    {
      lvl: 2,
      text: "Com o <code>AnelHash</code>, distribua 100.000 chaves entre 5 nós. Remova um nó e meça quantas chaves mudaram de lugar. Compare com <code>hash % n</code>.",
    },
    {
      lvl: 2,
      text: "Implemente um Bloom filter e calcule experimentalmente a taxa de falsos positivos para diferentes tamanhos.",
    },
    {
      lvl: 3,
      text: "Resolva 40 problemas do NeetCode 150 em Java, focando em hashing, two pointers, heaps e grafos. Para cada um, anote a complexidade.",
    },
  ],
  refs: [
    { t: "NeetCode 150", u: "https://neetcode.io/practice" },
    {
      t: "Latency Numbers Every Programmer Should Know",
      u: "https://gist.github.com/jboner/2841832",
    },
    {
      t: "Livro: Grokking Algorithms, 2ª ed. (Bhargava)",
      u: "https://www.manning.com/books/grokking-algorithms-second-edition",
    },
    {
      t: "Use The Index, Luke: índices de banco explicados",
      u: "https://use-the-index-luke.com/",
    },
  ],
});

/* ============================ FASE 1 ============================ */

T({
  id: "clean-code",
  phase: "f1",
  title: "Código limpo e refatoração",
  level: "Base",
  hours: 25,
  summary:
    "Nomes, funções pequenas, code smells e o catálogo de refatorações de Martin Fowler.",
  body: `
<p>Código é lido muito mais do que escrito. A arquitetura de um sistema se degrada linha por linha, e se recupera do mesmo jeito. Um arquiteto que não sabe refatorar não consegue mostrar ao time como chegar ao desenho que propôs.</p>
<h3>O essencial</h3>
<ul>
<li><strong>Nomes revelam intenção</strong>: <code>diasDesdeUltimoLogin</code> em vez de <code>d</code>; <code>calcularFrete</code> em vez de <code>processar</code>.</li>
<li><strong>Funções fazem uma coisa</strong>, num único nível de abstração.</li>
<li><strong>Sem efeitos colaterais escondidos</strong>: um método chamado <code>validar</code> não deve gravar no banco.</li>
<li><strong>Comentários explicam o porquê</strong>, nunca o quê. Se precisa explicar o quê, renomeie.</li>
<li><strong>Tratamento de erro</strong>: exceções com contexto, nunca <code>catch (Exception e) {}</code>.</li>
</ul>
<h3>Code smells que você deve reconhecer de olhos fechados</h3>
<p><em>Long Method, Large Class, Primitive Obsession, Feature Envy, Shotgun Surgery, Divergent Change, Data Clumps, Switch Statements repetidos, Speculative Generality.</em> Cada um tem refatorações conhecidas: <em>Extract Method, Move Method, Replace Primitive with Object, Replace Conditional with Polymorphism, Introduce Parameter Object</em>.</p>
<div class="callout"><b>Leitura crítica:</b> <em>Clean Code</em> é referência obrigatória, mas algumas recomendações (funções extremamente pequenas, por exemplo) são contestadas. Leia junto com <em>A Philosophy of Software Design</em>, de John Ousterhout, que defende "módulos profundos": interfaces simples escondendo implementações ricas. Saber pesar as duas visões já é pensamento de arquiteto.</div>
`,
  code: [
    {
      t: "Antes: Primitive Obsession e Long Method",
      src: `public double calcular(String tipo, double valor, int qtd, String uf) {
    double t = valor * qtd;
    if (tipo.equals("VIP")) t = t * 0.9;
    else if (tipo.equals("FUNC")) t = t * 0.8;
    if (uf.equals("SP")) t += t * 0.18;
    else if (uf.equals("RJ")) t += t * 0.20;
    else t += t * 0.17;
    if (t > 1000) t -= 50;
    return t;
}`,
    },
    {
      t: "Depois: tipos do domínio e responsabilidades separadas",
      src: `public enum TipoCliente {
    COMUM(BigDecimal.ONE), VIP(new BigDecimal("0.90")), FUNCIONARIO(new BigDecimal("0.80"));
    final BigDecimal fator;
    TipoCliente(BigDecimal fator) { this.fator = fator; }
}

public record ItemPedido(Dinheiro precoUnitario, int quantidade) {
    Dinheiro subtotal() { return precoUnitario.vezes(quantidade); }
}

public class CalculadoraPedido {
    private final TabelaIcms icms;
    private final PoliticaDescontoVolume descontoVolume;

    public Dinheiro total(ItemPedido item, TipoCliente cliente, Uf uf) {
        var comDesconto = item.subtotal().vezes(cliente.fator);
        var comImposto  = comDesconto.mais(icms.sobre(comDesconto, uf));
        return descontoVolume.aplicar(comImposto);
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Faça a kata <strong>Gilded Rose</strong> em Java: primeiro escreva testes de caracterização, depois refatore sem mudar comportamento.",
    },
    {
      lvl: 2,
      text: "Faça a kata <strong>Theatrical Players</strong> (capítulo 1 do livro Refactoring) em Java, commit a cada refatoração.",
    },
    {
      lvl: 2,
      text: "Escolha um projeto open source Java no GitHub, rode SonarQube localmente e escreva uma análise dos 5 smells mais graves com proposta de correção.",
    },
    {
      lvl: 3,
      text: "Escreva um ensaio de uma página comparando <em>Clean Code</em> e <em>A Philosophy of Software Design</em> em três pontos onde discordam, com sua posição e exemplos em Java.",
    },
  ],
  refs: [
    {
      t: "Livro: Refactoring, 2ª ed. (Martin Fowler)",
      u: "https://martinfowler.com/books/refactoring.html",
    },
    { t: "Catálogo de refatorações", u: "https://refactoring.com/catalog/" },
    {
      t: "Refactoring Guru: smells e refatorações ilustrados",
      u: "https://refactoring.guru/refactoring",
    },
    {
      t: "Gilded Rose Kata (Emily Bache)",
      u: "https://github.com/emilybache/GildedRose-Refactoring-Kata",
    },
    {
      t: "Theatrical Players Kata",
      u: "https://github.com/emilybache/Theatrical-Players-Refactoring-Kata",
    },
    {
      t: "Livro: A Philosophy of Software Design (John Ousterhout)",
      u: "https://web.stanford.edu/~ouster/cgi-bin/book.php",
    },
  ],
});

T({
  id: "solid",
  phase: "f1",
  title: "SOLID, coesão e acoplamento",
  level: "Base",
  hours: 20,
  summary:
    "Os cinco princípios explicados com o que eles realmente protegem: a capacidade de mudar o sistema.",
  body: `
<p>SOLID não é um checklist de entrevista. Cada princípio responde a uma pergunta: <em>quando este requisito mudar, quantos lugares do código eu preciso mexer?</em> Arquitetura é a mesma pergunta em escala maior.</p>
<dl class="defs">
<dt>S: Single Responsibility</dt><dd>Um módulo deve ter <em>um único motivo para mudar</em>, ou seja, responder a um único ator do negócio. A regra de cálculo de folha (RH) e o formato do relatório (Financeiro) não devem viver na mesma classe.</dd>
<dt>O: Open/Closed</dt><dd>Aberto para extensão, fechado para modificação. Novos comportamentos entram como novas classes, não como mais um <code>else if</code>.</dd>
<dt>L: Liskov Substitution</dt><dd>Um subtipo deve poder substituir o tipo base sem quebrar quem usa. Se <code>Quadrado extends Retangulo</code> quebra <code>setLargura</code>, a herança está errada.</dd>
<dt>I: Interface Segregation</dt><dd>Clientes não devem depender de métodos que não usam. Interfaces pequenas e focadas.</dd>
<dt>D: Dependency Inversion</dt><dd>Regras de negócio não dependem de detalhes (banco, HTTP, framework). Os detalhes dependem de abstrações definidas pelo negócio. Este princípio é a base da arquitetura hexagonal e da Clean Architecture.</dd>
</dl>
<h3>Coesão e acoplamento: as métricas por trás de tudo</h3>
<p>Alta coesão: coisas que mudam juntas ficam juntas. Baixo acoplamento: coisas que mudam por motivos diferentes ficam separadas. Mark Richards e Neal Ford usam o conceito de <strong>connascence</strong> para medir acoplamento com mais precisão: de nome, de tipo, de significado, de algoritmo, de posição, de tempo. Quanto mais forte o tipo de connascence, mais perto os elementos devem estar.</p>
`,
  code: [
    {
      t: "Dependency Inversion na prática",
      src: `// O domínio define o que precisa (porta)
public interface RepositorioPedidos {
    Optional<Pedido> porId(PedidoId id);
    void salvar(Pedido pedido);
}

// O caso de uso depende só da abstração
public class CancelarPedido {
    private final RepositorioPedidos pedidos;
    private final Relogio relogio;

    public CancelarPedido(RepositorioPedidos pedidos, Relogio relogio) {
        this.pedidos = pedidos; this.relogio = relogio;
    }
    public void executar(PedidoId id, String motivo) {
        var pedido = pedidos.porId(id).orElseThrow(() -> new PedidoNaoEncontrado(id));
        pedido.cancelar(motivo, relogio.agora());
        pedidos.salvar(pedido);
    }
}

// O detalhe (JPA) implementa a abstração, em outro pacote/módulo
@Repository
class RepositorioPedidosJpa implements RepositorioPedidos { /* ... */ }`,
    },
    {
      t: "Open/Closed com estratégia",
      src: `public sealed interface RegraFrete permits FreteFixo, FretePorPeso, FreteGratisAcimaDe {}
// Nova regra = novo record + novo case. Nenhum if espalhado pelo código.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Para cada princípio, escreva um exemplo em Java que o viola e a versão corrigida. Explique em uma frase qual mudança futura ficou mais barata.",
    },
    {
      lvl: 2,
      text: "Pegue uma classe <code>Service</code> de mais de 500 linhas (de um projeto seu ou open source) e divida segundo SRP, identificando os atores de cada responsabilidade.",
    },
    {
      lvl: 3,
      text: "Use o ArchUnit para escrever testes que impeçam o pacote <code>dominio</code> de importar qualquer coisa de <code>org.springframework</code> ou <code>jakarta.persistence</code>.",
    },
  ],
  refs: [
    {
      t: "Livro: Clean Architecture (Robert C. Martin)",
      u: "https://www.oreilly.com/library/view/clean-architecture-a/9780134494272/",
    },
    { t: "connascence.io", u: "https://connascence.io/" },
    {
      t: "ArchUnit: testes de arquitetura em Java",
      u: "https://www.archunit.org/",
    },
  ],
});

T({
  id: "patterns",
  phase: "f1",
  title: "Design patterns (GoF) em Java moderno",
  level: "Intermediário",
  hours: 30,
  summary:
    "Os padrões que de fato aparecem em sistemas reais e no próprio Spring, reescritos com Java atual.",
  body: `
<p>Os 23 padrões do livro da Gang of Four (1994) são um vocabulário. Quando você diz "isso é um Decorator", o time inteiro entende a estrutura sem precisar desenhar. O objetivo não é decorar todos, mas reconhecer os que importam e saber que vários ficaram mais simples com lambdas e sealed types.</p>
<h3>Os mais úteis no dia a dia</h3>
<table class="tbl"><thead><tr><th>Padrão</th><th>Problema que resolve</th><th>Onde você já usa</th></tr></thead><tbody>
<tr><td>Strategy</td><td>Trocar algoritmo em tempo de execução</td><td><code>Comparator</code>, regras de frete/desconto</td></tr>
<tr><td>Decorator</td><td>Adicionar comportamento sem herança</td><td><code>BufferedInputStream</code>, cache e retry em volta de um client</td></tr>
<tr><td>Adapter</td><td>Encaixar uma interface em outra</td><td>Adaptadores da arquitetura hexagonal</td></tr>
<tr><td>Template Method</td><td>Esqueleto fixo, passos variáveis</td><td><code>JdbcTemplate</code>, <code>RestTemplate</code></td></tr>
<tr><td>Observer</td><td>Notificar interessados</td><td><code>ApplicationEventPublisher</code> do Spring</td></tr>
<tr><td>Factory / Builder</td><td>Construção complexa ou condicional</td><td><code>HttpClient.newBuilder()</code></td></tr>
<tr><td>Proxy</td><td>Interceptar chamadas</td><td><code>@Transactional</code>, <code>@Cacheable</code> (AOP do Spring)</td></tr>
<tr><td>Chain of Responsibility</td><td>Pipeline de handlers</td><td>Filtros do Spring Security, servlet filters</td></tr>
<tr><td>State</td><td>Comportamento muda com o estado</td><td>Ciclo de vida de pedido, workflow</td></tr>
<tr><td>Command</td><td>Requisição como objeto</td><td>Filas de tarefas, CQRS</td></tr>
</tbody></table>
<div class="callout"><b>Armadilha:</b> padrão aplicado sem problema real é complexidade gratuita. Antes de usar um, diga em voz alta qual mudança futura ele torna barata. Se não souber dizer, não use.</div>
`,
  code: [
    {
      t: "Decorator: retry e métricas em volta de um gateway",
      src: `public interface GatewayPagamento {
    ResultadoPagamento cobrar(Cobranca c);
}

public final class ComRetry implements GatewayPagamento {
    private final GatewayPagamento alvo;
    private final int tentativas;
    public ComRetry(GatewayPagamento alvo, int tentativas) { this.alvo = alvo; this.tentativas = tentativas; }

    public ResultadoPagamento cobrar(Cobranca c) {
        RuntimeException ultima = null;
        for (int i = 1; i <= tentativas; i++) {
            try { return alvo.cobrar(c); }
            catch (FalhaTransitoria e) { ultima = e; dormir(100L * (1L << i)); }
        }
        throw ultima;
    }
}

public final class ComMetricas implements GatewayPagamento {
    private final GatewayPagamento alvo; private final Timer timer;
    public ComMetricas(GatewayPagamento alvo, MeterRegistry reg) {
        this.alvo = alvo; this.timer = reg.timer("pagamento.cobrar");
    }
    public ResultadoPagamento cobrar(Cobranca c) { return timer.record(() -> alvo.cobrar(c)); }
}

// Composição: cada camada com uma responsabilidade
GatewayPagamento gw = new ComMetricas(new ComRetry(new StripeGateway(cfg), 3), registry);`,
    },
    {
      t: "State com sealed types",
      src: `public sealed interface EstadoPedido {
    record Criado() implements EstadoPedido {}
    record Pago(Instant em) implements EstadoPedido {}
    record Enviado(String rastreio) implements EstadoPedido {}
    record Cancelado(String motivo) implements EstadoPedido {}
}

public EstadoPedido cancelar(EstadoPedido atual, String motivo) {
    return switch (atual) {
        case Criado c, Pago p -> new Cancelado(motivo);
        case Enviado e   -> throw new RegraViolada("Pedido já enviado: use devolução");
        case Cancelado c -> c; // idempotente
    };
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Implemente cada padrão da tabela num exemplo de domínio diferente (loja, banco, logística). Um arquivo por padrão, com teste.",
    },
    {
      lvl: 2,
      text: "Abra o código do Spring Framework no GitHub e encontre 5 padrões GoF reais. Para cada um, anote a classe e o motivo da escolha.",
    },
    {
      lvl: 2,
      text: "Reescreva Strategy, Command e Observer usando apenas lambdas e interfaces funcionais. Discuta o que se perde e o que se ganha.",
    },
    {
      lvl: 3,
      text: "Modele o fluxo de uma reclamação de cliente (aberta, em análise, aguardando cliente, resolvida, reaberta) com o padrão State e garanta via testes que transições inválidas são rejeitadas.",
    },
  ],
  refs: [
    {
      t: "Refactoring Guru: Design Patterns (com exemplos em Java)",
      u: "https://refactoring.guru/design-patterns/java",
    },
    {
      t: "Livro: Design Patterns (Gamma, Helm, Johnson, Vlissides)",
      u: "https://www.oreilly.com/library/view/design-patterns-elements/0201633612/",
    },
    {
      t: "Livro: Head First Design Patterns, 2ª ed.",
      u: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
    },
    {
      t: "java-design-patterns (iluwatar), repositório com 200+ exemplos",
      u: "https://github.com/iluwatar/java-design-patterns",
    },
  ],
});

T({
  id: "testes",
  phase: "f1",
  title: "Testes automatizados e TDD",
  level: "Intermediário",
  hours: 30,
  summary:
    "JUnit 5, AssertJ, Mockito, Testcontainers, pirâmide de testes, TDD e testes de arquitetura.",
  body: `
<p>Testes são a rede de segurança que permite mudar a arquitetura. Sem eles, toda refatoração grande vira aposta. Um arquiteto define a <strong>estratégia de testes</strong>: o que testar em cada camada, com que ferramentas e quanto custa rodar.</p>
<h3>Estratégia em camadas</h3>
<ul>
<li><strong>Unitários</strong> (milissegundos): regras de domínio puras, sem Spring, sem banco. A maioria dos testes.</li>
<li><strong>Integração</strong> (segundos): repositórios contra um PostgreSQL real via <strong>Testcontainers</strong>, clients HTTP contra WireMock.</li>
<li><strong>Contrato</strong>: garantem que produtor e consumidor de uma API concordam (Spring Cloud Contract, Pact).</li>
<li><strong>Ponta a ponta</strong>: poucos, nos fluxos críticos de negócio.</li>
<li><strong>Arquitetura</strong>: ArchUnit verifica regras de dependência; Spring Modulith verifica fronteiras de módulos.</li>
</ul>
<p>Evite mockar o que você não controla e evite banco em memória (H2) fingindo ser PostgreSQL: diferenças de dialeto escondem bugs. Testcontainers sobe o banco real em segundos.</p>
<h3>TDD: vermelho, verde, refatorar</h3>
<p>Escreva um teste que falha, escreva o mínimo para passar, refatore. O ganho não é só cobertura: o teste escrito antes força você a desenhar a API do ponto de vista de quem usa. É design, não só verificação.</p>
<h3>Mutation testing</h3>
<p>Cobertura de linha mente: um teste sem asserção cobre 100%. O <strong>PIT</strong> altera seu código (troca <code>&gt;</code> por <code>&gt;=</code>, remove chamadas) e verifica se algum teste falha. Mutantes sobreviventes revelam testes fracos.</p>
`,
  code: [
    {
      t: "Teste de domínio puro com AssertJ",
      src: `class PedidoTest {
    @Test
    void nao_permite_cancelar_pedido_enviado() {
        var pedido = Pedido.novo(clienteId, itens).pagar(agora).enviar("BR123");

        assertThatThrownBy(() -> pedido.cancelar("desisti", agora))
            .isInstanceOf(RegraViolada.class)
            .hasMessageContaining("já enviado");
    }

    @ParameterizedTest
    @CsvSource({"99.99, 15.00", "100.00, 0.00", "250.00, 0.00"})
    void frete_gratis_a_partir_de_100(BigDecimal total, BigDecimal freteEsperado) {
        assertThat(new FreteGratisAcimaDe(new BigDecimal("100")).calcular(total))
            .isEqualByComparingTo(freteEsperado);
    }
}`,
    },
    {
      t: "Integração com PostgreSQL real (Testcontainers + Spring Boot)",
      src: `@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class RepositorioPedidosJpaIT {

    @Container @ServiceConnection
    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:17-alpine");

    @Autowired RepositorioPedidosJpa repo;

    @Test
    void salva_e_recupera_pedido_com_itens() {
        var pedido = umPedidoComDoisItens();
        repo.salvar(pedido);
        assertThat(repo.porId(pedido.id())).get()
            .extracting(Pedido::itens).asList().hasSize(2);
    }
}`,
    },
    {
      t: "Regra de arquitetura com ArchUnit",
      src: `@AnalyzeClasses(packages = "com.loja")
class ArquiteturaTest {
    @ArchTest
    static final ArchRule dominio_independente =
        noClasses().that().resideInAPackage("..dominio..")
            .should().dependOnClassesThat()
            .resideInAnyPackage("org.springframework..", "jakarta.persistence..");

    @ArchTest
    static final ArchRule camadas = layeredArchitecture().consideringAllDependencies()
        .layer("Web").definedBy("..web..")
        .layer("Aplicacao").definedBy("..aplicacao..")
        .layer("Dominio").definedBy("..dominio..")
        .whereLayer("Web").mayNotBeAccessedByAnyLayer()
        .whereLayer("Aplicacao").mayOnlyBeAccessedByLayers("Web");
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Faça a kata <strong>Bowling Game</strong> com TDD estrito, commitando a cada ciclo vermelho/verde/refatorar.",
    },
    {
      lvl: 2,
      text: "Adicione PIT a um projeto seu, rode e mate pelo menos 80% dos mutantes sobreviventes escrevendo testes melhores.",
    },
    {
      lvl: 2,
      text: "Escreva testes de integração para um client HTTP usando WireMock: sucesso, timeout, 500 e resposta malformada.",
    },
    {
      lvl: 3,
      text: "Defina por escrito a estratégia de testes de um sistema de 3 serviços: o que cada nível cobre, tempo-alvo do pipeline e regras de ArchUnit. Implemente num projeto exemplo.",
    },
  ],
  refs: [
    {
      t: "JUnit 5 User Guide",
      u: "https://junit.org/junit5/docs/current/user-guide/",
    },
    { t: "Testcontainers for Java", u: "https://java.testcontainers.org/" },
    { t: "AssertJ", u: "https://assertj.github.io/doc/" },
    { t: "PIT Mutation Testing", u: "https://pitest.org/" },
    {
      t: "Livro: Test-Driven Development: By Example (Kent Beck)",
      u: "https://www.oreilly.com/library/view/test-driven-development/0321146530/",
    },
    {
      t: "Livro: Growing Object-Oriented Software, Guided by Tests (Freeman, Pryce)",
      u: "http://www.growing-object-oriented-software.com/",
    },
    {
      t: "Martin Fowler: The Practical Test Pyramid",
      u: "https://martinfowler.com/articles/practical-test-pyramid.html",
    },
  ],
});

/* ============================ FASE 2 ============================ */

T({
  id: "build-git",
  phase: "f2",
  title: "Build, Git e fluxo de trabalho",
  level: "Base",
  hours: 12,
  summary:
    "Maven/Gradle, projetos multimódulo, gestão de dependências, Git e trunk-based development.",
  body: `
<p>A estrutura do build é a primeira materialização da arquitetura. Um projeto multimódulo Maven/Gradle torna fronteiras <strong>físicas</strong>: o módulo <code>dominio</code> literalmente não consegue importar o módulo <code>infra</code> se a dependência não estiver declarada.</p>
<h3>O que dominar</h3>
<ul>
<li><strong>Maven ou Gradle</strong>: ciclo de vida, escopos de dependência, BOMs (<code>spring-boot-dependencies</code>), plugins, perfis.</li>
<li><strong>Multimódulo</strong>: separar <code>dominio</code>, <code>aplicacao</code>, <code>infra</code>, <code>api</code>.</li>
<li><strong>Dependências</strong>: conflitos de versão, <code>mvn dependency:tree</code>, vulnerabilidades (OWASP Dependency-Check, Dependabot, Renovate).</li>
<li><strong>Git</strong>: rebase interativo, bisect para achar o commit que quebrou, commits pequenos e com mensagem que explica o porquê.</li>
<li><strong>Trunk-based development</strong>: branches curtos (horas, não semanas), integração contínua de verdade, feature flags para esconder trabalho incompleto. É o que as pesquisas do DORA associam a times de alto desempenho.</li>
</ul>
`,
  code: [
    {
      t: "Estrutura multimódulo Maven",
      src: `loja/
├── pom.xml                  <!-- parent: versões e BOM -->
├── loja-dominio/            <!-- Java puro, zero dependência de framework -->
├── loja-aplicacao/          <!-- casos de uso; depende de dominio -->
├── loja-infra/              <!-- JPA, Kafka, HTTP clients; depende de aplicacao -->
└── loja-app/                <!-- Spring Boot main, controllers; junta tudo -->

<!-- loja-dominio/pom.xml: repare que não há spring aqui -->
<dependencies>
  <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Crie o projeto multimódulo acima e prove que o compilador impede <code>loja-dominio</code> de usar uma classe de <code>loja-infra</code>.",
    },
    {
      lvl: 2,
      text: "Use <code>git bisect run</code> com um teste automatizado para achar o commit que introduziu um bug num histórico de 50 commits (crie o histórico com um script).",
    },
    {
      lvl: 2,
      text: "Configure Renovate ou Dependabot num repositório seu e escreva uma política de atualização de dependências.",
    },
  ],
  refs: [
    {
      t: "Maven: Introduction to the POM",
      u: "https://maven.apache.org/guides/introduction/introduction-to-the-pom.html",
    },
    { t: "Pro Git (livro gratuito)", u: "https://git-scm.com/book/pt-br/v2" },
    { t: "trunkbaseddevelopment.com", u: "https://trunkbaseddevelopment.com/" },
    { t: "DORA: capacidades técnicas", u: "https://dora.dev/capabilities/" },
  ],
});

T({
  id: "sql",
  phase: "f2",
  title: "Bancos relacionais, SQL e modelagem",
  level: "Intermediário",
  hours: 30,
  summary:
    "PostgreSQL, normalização, índices, planos de execução, transações e níveis de isolamento.",
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
<li><strong>Migrações</strong>: Flyway ou Liquibase; migrações compatíveis para deploy sem downtime (expand/contract).</li>
</ol>
<div class="callout"><b>Padrão expand/contract:</b> para renomear uma coluna sem derrubar o sistema, (1) adicione a nova, (2) escreva nas duas, (3) migre os dados, (4) leia da nova, (5) remova a antiga. Cinco deploys pequenos em vez de uma janela de manutenção.</div>
`,
  code: [
    {
      t: "Window function: ranking de vendas por categoria",
      src: `WITH vendas AS (
  SELECT p.categoria, p.nome AS produto, SUM(i.quantidade * i.preco) AS total
  FROM itens_pedido i JOIN produtos p ON p.id = i.produto_id
  WHERE i.criado_em >= now() - interval '30 days'
  GROUP BY p.categoria, p.nome
), ranqueadas AS (
  SELECT *, RANK() OVER (PARTITION BY categoria ORDER BY total DESC) AS posicao
  FROM vendas
)
SELECT * FROM ranqueadas WHERE posicao <= 3;   -- top 3 de cada categoria`,
    },
    {
      t: "Fila de trabalho segura com SKIP LOCKED",
      src: `-- Vários workers pegam tarefas sem disputar a mesma linha
WITH proxima AS (
  SELECT id FROM tarefas
  WHERE status = 'PENDENTE'
  ORDER BY criada_em
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
UPDATE tarefas t SET status = 'EM_PROCESSAMENTO', pega_em = now()
FROM proxima WHERE t.id = proxima.id
RETURNING t.*;`,
    },
    {
      t: "Locking otimista com JPA",
      src: `@Entity
class Estoque {
    @Id Long produtoId;
    int quantidade;
    @Version long versao;   // UPDATE ... WHERE versao = ?  → OptimisticLockException se mudou

    void reservar(int qtd) {
        if (qtd > quantidade) throw new EstoqueInsuficiente(produtoId);
        quantidade -= qtd;
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Resolva os exercícios do <strong>pgexercises.com</strong> até a seção de window functions.",
    },
    {
      lvl: 2,
      text: "Crie uma tabela com 5 milhões de pedidos (use <code>generate_series</code>), escreva 5 consultas lentas e otimize cada uma com índices, mostrando o <code>EXPLAIN ANALYZE</code> antes e depois.",
    },
    {
      lvl: 2,
      text: "Reproduza a anomalia <em>write skew</em> (dois médicos de plantão saindo ao mesmo tempo) em Read Committed e mostre como Serializable a evita.",
    },
    {
      lvl: 3,
      text: "Planeje e execute uma migração expand/contract que divide a coluna <code>nome_completo</code> em <code>nome</code> e <code>sobrenome</code> com a aplicação rodando e recebendo escrita contínua.",
    },
  ],
  refs: [
    {
      t: "Documentação do PostgreSQL",
      u: "https://www.postgresql.org/docs/current/",
    },
    { t: "PostgreSQL Exercises", u: "https://pgexercises.com/" },
    { t: "Use The Index, Luke", u: "https://use-the-index-luke.com/" },
    { t: "Flyway", u: "https://documentation.red-gate.com/flyway" },
    {
      t: "Livro: SQL Antipatterns, vol. 1 (Bill Karwin)",
      u: "https://pragprog.com/titles/bksap1/sql-antipatterns-volume-1/",
    },
    {
      t: "Vlad Mihalcea: High-Performance Java Persistence",
      u: "https://vladmihalcea.com/books/high-performance-java-persistence/",
    },
  ],
});

T({
  id: "spring",
  phase: "f2",
  title: "Spring Boot 4 em profundidade",
  level: "Intermediário",
  hours: 40,
  summary:
    "Injeção de dependência, auto-configuração, perfis, JPA, transações, validação e o que mudou na versão 4.",
  body: `
<p>Spring Boot é a plataforma dominante para backend Java. A versão <strong>4.0</strong> saiu em novembro de 2025, sobre o Spring Framework 7, com Java 17 como mínimo e suporte a Java 25. Entre as mudanças, os starters ficaram modulares (por exemplo, <code>spring-boot-starter-webmvc</code> no lugar de <code>spring-boot-starter-web</code>) e o Jackson 3 passou a ser o padrão.</p>
<h3>Entenda por dentro, não só por fora</h3>
<p>A diferença entre um dev Spring e um arquiteto que usa Spring é saber o que acontece por trás das anotações.</p>
<ul>
<li><strong>Container de IoC</strong>: como beans são criados, escopos, ciclo de vida, <code>@Configuration</code> vs. <code>@Component</code>. Prefira injeção por construtor: dependências explícitas e objetos testáveis sem Spring.</li>
<li><strong>Auto-configuração</strong>: <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code>. Rode com <code>--debug</code> para ver o relatório de condições.</li>
<li><strong>Proxies e AOP</strong>: <code>@Transactional</code> funciona via proxy. Por isso chamar um método transacional da própria classe (<em>self-invocation</em>) ignora a transação. Este é um dos bugs mais comuns em Spring.</li>
<li><strong>Configuração externa</strong>: <code>@ConfigurationProperties</code> com records e validação, perfis, precedência de fontes.</li>
<li><strong>Persistência</strong>: Spring Data JPA, problema N+1, <code>fetch join</code>, projeções, <code>open-in-view</code> (desligue!).</li>
<li><strong>Observabilidade embutida</strong>: Actuator, Micrometer, tracing.</li>
<li><strong>Spring Modulith</strong>: verifica fronteiras de módulos dentro de um monolito (veja a fase 4).</li>
</ul>
<div class="callout"><b>Desligue o Open Session in View:</b> <code>spring.jpa.open-in-view=false</code>. Com ele ligado, consultas lazy acontecem durante a serialização do JSON, longe de qualquer controle, e escondem problemas N+1 até a produção.</div>
`,
  code: [
    {
      t: "Configuração tipada e validada",
      src: `@ConfigurationProperties(prefix = "pagamentos")
@Validated
public record PagamentosProps(
    @NotBlank String urlGateway,
    @NotNull Duration timeout,
    @Min(1) @Max(5) int tentativas
) {}

# application.yml
pagamentos:
  url-gateway: https://api.gateway.exemplo
  timeout: 2s
  tentativas: 3`,
    },
    {
      t: "Resolvendo N+1 com EntityGraph e projeção",
      src: `public interface PedidoRepository extends JpaRepository<PedidoEntity, Long> {

    // Ruim: findAll() + acessar pedido.getItens() em loop = 1 + N consultas

    @EntityGraph(attributePaths = "itens")
    List<PedidoEntity> findByClienteId(Long clienteId);   // 1 consulta com JOIN

    // Para telas de listagem, nem carregue a entidade:
    @Query("""
        select new com.loja.web.ResumoPedido(p.id, p.criadoEm, sum(i.preco * i.quantidade))
        from PedidoEntity p join p.itens i
        where p.clienteId = :clienteId
        group by p.id, p.criadoEm
        """)
    List<ResumoPedido> resumos(Long clienteId);
}`,
    },
    {
      t: "A armadilha do self-invocation",
      src: `@Service
class ServicoPedido {
    public void processarLote(List<Long> ids) {
        ids.forEach(this::processar);   // NÃO passa pelo proxy: sem transação!
    }
    @Transactional
    public void processar(Long id) { /* ... */ }
}
// Correção: mova processar() para outro bean, ou use TransactionTemplate.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Construa uma API de biblioteca (livros, autores, empréstimos) com Spring Boot 4, Spring Data JPA, PostgreSQL via Docker Compose, Flyway e validação.",
    },
    {
      lvl: 2,
      text: "Ative o log de SQL, encontre um N+1 na sua API e corrija de duas formas diferentes. Meça o número de consultas com <code>datasource-proxy</code> ou Hypersistence Utils.",
    },
    {
      lvl: 2,
      text: "Escreva sua própria auto-configuração: um starter <code>auditoria-spring-boot-starter</code> que registra um bean só se uma propriedade estiver ligada.",
    },
    {
      lvl: 3,
      text: "Leia o código-fonte de <code>TransactionInterceptor</code> e explique num diagrama de sequência o que acontece entre a chamada do controller e o COMMIT no banco.",
    },
  ],
  refs: [
    {
      t: "Spring Boot Reference",
      u: "https://docs.spring.io/spring-boot/reference/",
    },
    {
      t: "Spring Boot 4.0 Migration Guide",
      u: "https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide",
    },
    {
      t: "Spring Framework Reference",
      u: "https://docs.spring.io/spring-framework/reference/",
    },
    {
      t: "Baeldung: tutoriais de Spring",
      u: "https://www.baeldung.com/spring-tutorial",
    },
    {
      t: "Livro: Spring in Action, 6ª ed. (Craig Walls)",
      u: "https://www.manning.com/books/spring-in-action-sixth-edition",
    },
    { t: "Dan Vega: canal e blog sobre Spring", u: "https://www.danvega.dev/" },
  ],
});

T({
  id: "apis",
  phase: "f2",
  title: "Design de APIs: REST, gRPC e eventos",
  level: "Intermediário",
  hours: 25,
  summary:
    "Recursos, verbos, códigos HTTP, versionamento, idempotência, paginação, OpenAPI e quando usar gRPC ou GraphQL.",
  body: `
<p>APIs são contratos públicos, e contratos são caros de mudar. Uma API mal desenhada amarra todos os consumidores por anos. Desenhar APIs é uma das responsabilidades mais visíveis de um arquiteto.</p>
<h3>REST bem feito</h3>
<ul>
<li><strong>Recursos são substantivos</strong>: <code>POST /pedidos</code>, <code>GET /pedidos/{id}</code>. Ações de negócio que não cabem em CRUD viram sub-recursos: <code>POST /pedidos/{id}/cancelamento</code>.</li>
<li><strong>Códigos HTTP corretos</strong>: 201 com <code>Location</code> ao criar, 204 sem corpo, 400 entrada inválida, 404, 409 conflito de estado, 422 regra de negócio, 429 limite.</li>
<li><strong>Erros padronizados</strong> com <strong>RFC 9457 (Problem Details)</strong>, suportado nativamente pelo Spring com <code>ProblemDetail</code>.</li>
<li><strong>Idempotência</strong>: GET, PUT e DELETE são idempotentes por definição. Para POST em operações críticas (pagamento), exija um header <code>Idempotency-Key</code>.</li>
<li><strong>Paginação por cursor</strong> em listas grandes, em vez de <code>offset</code>, que fica lento e instável quando dados mudam.</li>
<li><strong>Versionamento</strong>: evite quebrar; adicione campos opcionais. Quando quebrar, versione (<code>/v2</code> ou header) e tenha política de depreciação.</li>
<li><strong>Design-first</strong> com OpenAPI: o contrato é revisado antes do código.</li>
</ul>
<h3>Quando não usar REST</h3>
<table class="tbl"><thead><tr><th>Estilo</th><th>Bom para</th><th>Cuidado</th></tr></thead><tbody>
<tr><td>REST/JSON</td><td>APIs públicas, integração ampla, cache HTTP</td><td>Verborragia, múltiplas idas e voltas</td></tr>
<tr><td>gRPC/Protobuf</td><td>Comunicação interna entre serviços, streaming, baixa latência</td><td>Difícil de usar direto do navegador</td></tr>
<tr><td>GraphQL</td><td>Front-ends com necessidades variadas de dados (BFF)</td><td>Cache, N+1 no servidor, controle de custo de consulta</td></tr>
<tr><td>Eventos assíncronos</td><td>Desacoplar no tempo, notificar muitos interessados</td><td>Consistência eventual, rastreabilidade (documente com AsyncAPI)</td></tr>
</tbody></table>
`,
  code: [
    {
      t: "Controller com Problem Details e Location",
      src: `@RestController
@RequestMapping("/pedidos")
class PedidoController {
    private final CriarPedido criarPedido;

    @PostMapping
    ResponseEntity<PedidoResposta> criar(@Valid @RequestBody NovoPedido req,
                                         @RequestHeader("Idempotency-Key") UUID chave) {
        var pedido = criarPedido.executar(req.paraComando(), chave);
        return ResponseEntity
            .created(URI.create("/pedidos/" + pedido.id()))
            .body(PedidoResposta.de(pedido));
    }
}

@RestControllerAdvice
class TratadorErros {
    @ExceptionHandler(RegraViolada.class)
    ProblemDetail regra(RegraViolada e) {
        var pd = ProblemDetail.forStatusAndDetail(HttpStatus.UNPROCESSABLE_ENTITY, e.getMessage());
        pd.setType(URI.create("https://api.loja.exemplo/erros/regra-de-negocio"));
        pd.setProperty("codigo", e.codigo());
        return pd;
    }
}`,
    },
    {
      t: "Idempotência no servidor",
      src: `@Transactional
public Pedido executar(ComandoCriarPedido cmd, UUID chave) {
    return idempotencia.buscar(chave)                    // já processado? devolve o mesmo
        .map(reg -> pedidos.porId(reg.pedidoId()).orElseThrow())
        .orElseGet(() -> {
            var pedido = Pedido.novo(cmd);
            pedidos.salvar(pedido);
            idempotencia.registrar(chave, pedido.id());  // UNIQUE(chave) no banco
            return pedido;
        });
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Escreva primeiro o contrato OpenAPI de uma API de agendamento de consultas médicas; só depois implemente. Gere a documentação com springdoc.",
    },
    {
      lvl: 2,
      text: "Implemente paginação por cursor numa tabela de 1 milhão de linhas e compare o tempo da página 5.000 com paginação por offset.",
    },
    {
      lvl: 2,
      text: "Exponha o mesmo caso de uso via REST e via gRPC. Compare tamanho de payload e latência com um teste de carga.",
    },
    {
      lvl: 3,
      text: "Revise a API pública de pagamentos da Stripe e escreva um guia de estilo de APIs de 2 páginas para um time fictício, com 10 regras e exemplos certos e errados.",
    },
  ],
  refs: [
    {
      t: "RFC 9457: Problem Details for HTTP APIs",
      u: "https://www.rfc-editor.org/rfc/rfc9457",
    },
    {
      t: "Microsoft REST API Guidelines",
      u: "https://github.com/microsoft/api-guidelines",
    },
    { t: "Google API Design Guide", u: "https://cloud.google.com/apis/design" },
    {
      t: "Stripe: idempotent requests",
      u: "https://docs.stripe.com/api/idempotent_requests",
    },
    {
      t: "OpenAPI Specification",
      u: "https://spec.openapis.org/oas/latest.html",
    },
    { t: "AsyncAPI", u: "https://www.asyncapi.com/" },
    {
      t: "Livro: API Design Patterns (JJ Geewax)",
      u: "https://www.manning.com/books/api-design-patterns",
    },
  ],
});
/* ============================ FASE 3 ============================ */

T({
  id: "o-que-e",
  phase: "f3",
  title: "O que é arquitetura e o papel do arquiteto",
  level: "Base",
  hours: 12,
  summary:
    "Definições, as leis da arquitetura de software, expectativas do papel e a diferença entre arquitetura e design.",
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
`,
  code: [],
  exercises: [
    {
      lvl: 1,
      text: "Escreva com suas palavras a diferença entre arquitetura e design, com 3 exemplos de decisões de cada lado da linha.",
    },
    {
      lvl: 2,
      text: "Escolha um sistema que você usa (Spotify, iFood, Nubank). Liste 10 decisões de arquitetura que provavelmente foram tomadas e o trade-off de cada uma.",
    },
    {
      lvl: 2,
      text: "Monte sua <em>matriz de conhecimento técnico</em>: o que você sabe, o que sabe que não sabe, e o que não sabe que não sabe. Atualize a cada trimestre.",
    },
    {
      lvl: 3,
      text: "Entreviste (ou leia entrevistas de) dois arquitetos sobre o dia a dia deles. Compare com a lista de expectativas acima e escreva o que mais surpreendeu.",
    },
  ],
  refs: [
    {
      t: "Livro: Fundamentals of Software Architecture, 2ª ed. (Richards & Ford, 2025)",
      u: "https://www.oreilly.com/library/view/-/9781098175504",
      note: "o livro-base desta trilha",
    },
    {
      t: "Martin Fowler: Software Architecture Guide",
      u: "https://martinfowler.com/architecture/",
    },
    {
      t: "Martin Fowler: Who Needs an Architect?",
      u: "https://martinfowler.com/ieeeSoftware/whoNeedsArchitect.pdf",
    },
    { t: "ISO/IEC/IEEE 42010", u: "https://www.iso.org/standard/74393.html" },
    {
      t: "roadmap.sh: Software Architect",
      u: "https://roadmap.sh/software-architect",
    },
    {
      t: "Mark Richards: Software Architecture Monday (vídeos curtos semanais)",
      u: "https://www.developertoarchitect.com/lessons/",
    },
  ],
});

T({
  id: "caracteristicas",
  phase: "f3",
  title: "Características de arquitetura",
  level: "Intermediário",
  hours: 15,
  summary:
    "Atributos de qualidade, como extraí-los dos requisitos, cenários mensuráveis e a ISO/IEC 25010.",
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
<p>"O sistema deve ser rápido" não é verificável. Use cenários de atributo de qualidade (do SEI): <em>fonte do estímulo, estímulo, ambiente, artefato, resposta, medida da resposta</em>. Exemplo: "Com 5.000 usuários simultâneos em operação normal, a busca de produtos responde em até 300 ms no percentil 99."</p>
`,
  code: [
    {
      t: "Característica virando teste: fitness function de latência",
      src: `// Gatling em Java: o pipeline falha se o p99 passar do limite
public class BuscaSimulation extends Simulation {
    HttpProtocolBuilder http = http.baseUrl("https://staging.loja.exemplo");

    ScenarioBuilder busca = scenario("Busca de produtos")
        .exec(http("buscar").get("/produtos?q=#{termo}").check(status().is(200)))
        .feed(csv("termos.csv").random());

    {
        setUp(busca.injectOpen(constantUsersPerSec(500).during(Duration.ofMinutes(5))))
            .protocols(http)
            .assertions(
                global().responseTime().percentile(99.0).lt(300),
                global().failedRequests().percent().lt(0.1)
            );
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Para um app de delivery de comida, liste as 7 características mais importantes e escolha as 3 principais. Justifique cada uma com uma frase do negócio.",
    },
    {
      lvl: 2,
      text: "Escreva 5 cenários de atributo de qualidade completos (seis partes) para um sistema de vendas de ingressos de shows.",
    },
    {
      lvl: 2,
      text: "Pratique com os <strong>Architectural Katas</strong> (Ted Neward): resolva 3 katas identificando características antes de escolher qualquer tecnologia.",
    },
    {
      lvl: 3,
      text: "Transforme 3 características de um projeto seu em fitness functions automatizadas (latência com Gatling, dependências com ArchUnit, vulnerabilidades com OWASP Dependency-Check) rodando no CI.",
    },
  ],
  refs: [
    {
      t: "ISO/IEC 25010: modelo de qualidade de produto",
      u: "https://iso25000.com/index.php/en/iso-25000-standards/iso-25010",
    },
    { t: "Architectural Katas (Neal Ford)", u: "https://nealford.com/katas/" },
    {
      t: "Livro: Software Architecture in Practice, 4ª ed. (Bass, Clements, Kazman)",
      u: "https://www.oreilly.com/library/view/software-architecture-in/9780136885979/",
    },
    { t: "Gatling", u: "https://docs.gatling.io/" },
    { t: "arc42: modelo de qualidade Q42", u: "https://quality.arc42.org/" },
  ],
});

T({
  id: "decisoes",
  phase: "f3",
  title: "Decisões e trade-offs: ADRs e ATAM",
  level: "Intermediário",
  hours: 12,
  summary:
    "Como analisar alternativas, registrar decisões com ADRs e avaliar uma arquitetura de forma estruturada.",
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
      t: "Um ADR completo (docs/adr/0007-mensageria.md)",
      src: `# ADR-0007: Usar Kafka para eventos de domínio entre serviços

Status: Aceito (2026-03-14). Substitui o ADR-0003.

## Contexto
Pedidos, Estoque e Faturamento trocam hoje chamadas REST síncronas.
Quedas do Faturamento derrubam a finalização de pedidos (3 incidentes no trimestre).
Precisamos reprocessar eventos dos últimos 7 dias para auditoria fiscal.
O time tem experiência com RabbitMQ; ninguém operou Kafka em produção.

## Decisão
Vamos publicar eventos de domínio em tópicos Kafka (Amazon MSK gerenciado),
com o padrão Transactional Outbox no serviço produtor.

## Alternativas consideradas
- RabbitMQ: o time conhece, mas não oferece retenção e replay nativos.
- Manter REST + retry: não resolve o acoplamento temporal.

## Consequências
+ Faturamento pode cair sem impedir a criação de pedidos.
+ Replay de 7 dias atende à auditoria.
- Consistência eventual: tela de "pedido faturado" pode atrasar segundos.
- Curva de aprendizado: treinamento de 2 semanas e runbook novo.
- Custo mensal estimado de US$ 900 com MSK.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Adicione a pasta <code>docs/adr</code> a um projeto seu e escreva 3 ADRs sobre decisões que você já tomou sem registrar (banco, framework, estrutura de pastas).",
    },
    {
      lvl: 2,
      text: "Use a ferramenta <code>adr-tools</code> ou <code>log4brains</code> para gerar e publicar o histórico de decisões como site.",
    },
    {
      lvl: 2,
      text: "Escolha uma decisão polêmica (ex.: monolito vs. microsserviços para uma startup) e escreva dois ADRs opostos, cada um defendendo bem um lado.",
    },
    {
      lvl: 3,
      text: "Conduza uma sessão de risk storming com 2–3 colegas sobre um sistema real e registre os riscos com plano de mitigação.",
    },
  ],
  refs: [
    {
      t: "Michael Nygard: Documenting Architecture Decisions",
      u: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions",
    },
    { t: "adr.github.io: modelos e ferramentas", u: "https://adr.github.io/" },
    { t: "log4brains", u: "https://github.com/thomvaill/log4brains" },
    {
      t: "SEI: ATAM",
      u: "https://insights.sei.cmu.edu/library/architecture-tradeoff-analysis-method-collection/",
    },
    { t: "Risk Storming (Simon Brown)", u: "https://riskstorming.com/" },
    {
      t: "Livro: Software Architecture: The Hard Parts (Ford, Richards, Sadalage, Dehghani)",
      u: "https://www.oreilly.com/library/view/software-architecture-the/9781492086888/",
    },
  ],
});

T({
  id: "documentacao",
  phase: "f3",
  title: "Comunicar arquitetura: C4, arc42 e diagramas como código",
  level: "Intermediário",
  hours: 15,
  summary:
    "O modelo C4 em quatro níveis de zoom, o template arc42 e como manter diagramas vivos no repositório.",
  body: `
<p>Um diagrama que ninguém entende não comunica nada. Caixas e setas sem legenda, sem nível de abstração consistente, são a regra nas empresas. O <strong>modelo C4</strong>, criado por Simon Brown, resolve isso com quatro níveis de zoom, como num mapa:</p>
<ol>
<li><strong>Contexto</strong>: o sistema como uma caixa, os usuários e os sistemas externos. Para qualquer público, inclusive não técnico.</li>
<li><strong>Contêineres</strong>: as unidades executáveis ou de armazenamento (API, front-end, banco, fila). Não confunda com Docker: é "algo que roda ou guarda dados".</li>
<li><strong>Componentes</strong>: os principais blocos dentro de um contêiner.</li>
<li><strong>Código</strong>: classes. Raramente vale desenhar à mão; deixe para a IDE.</li>
</ol>
<p>Além dos quatro, existem diagramas suplementares: dinâmico (sequência de um fluxo) e de implantação (onde cada contêiner roda).</p>
<h3>Diagramas como código</h3>
<p>Diagramas em ferramentas de desenho envelhecem e divergem do sistema. Escrevê-los como texto no repositório permite revisão em pull request e geração automática. Opções: <strong>Structurizr DSL</strong> (um modelo, várias visões), <strong>PlantUML com C4-PlantUML</strong>, <strong>Mermaid</strong> (renderiza direto no GitHub). O Spring Modulith também gera diagramas C4 dos módulos a partir do próprio código.</p>
<h3>arc42</h3>
<p>Template de documentação em 12 seções (objetivos, restrições, contexto, estratégia de solução, visão de blocos, visão de runtime, implantação, conceitos transversais, decisões, requisitos de qualidade, riscos, glossário). Use como checklist do que documentar, não como formulário a preencher inteiro.</p>
`,
  code: [
    {
      t: "Structurizr DSL: um modelo, várias visões",
      src: `workspace "Loja" {
  model {
    cliente = person "Cliente"
    loja = softwareSystem "Loja Online" {
      web   = container "Web App" "SPA" "React"
      api   = container "API de Pedidos" "Regras de pedidos" "Java 25, Spring Boot 4"
      banco = container "Banco de Pedidos" "" "PostgreSQL" "Database"
      fila  = container "Eventos" "" "Kafka" "Queue"
    }
    pagamentos = softwareSystem "Gateway de Pagamento" "Externo"

    cliente -> web "Compra pelo navegador"
    web -> api "JSON/HTTPS"
    api -> banco "Lê e grava" "JDBC"
    api -> fila "Publica PedidoCriado"
    api -> pagamentos "Cobra" "HTTPS"
  }
  views {
    systemContext loja { include * autolayout lr }
    container loja     { include * autolayout lr }
  }
}`,
    },
    {
      t: "Mermaid C4 (renderiza no GitHub)",
      src: `C4Context
  title Contexto: Loja Online
  Person(cliente, "Cliente")
  System(loja, "Loja Online", "Venda de produtos")
  System_Ext(pag, "Gateway de Pagamento")
  Rel(cliente, loja, "Compra")
  Rel(loja, pag, "Cobra via HTTPS")`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Desenhe os níveis 1 e 2 do C4 de um sistema que você conhece bem usando Structurizr DSL. Mostre para alguém não técnico o nível 1 e veja se ele entende sem explicação.",
    },
    {
      lvl: 2,
      text: "Documente um projeto seu com arc42 em formato leve (no máximo 6 páginas), em Markdown no repositório.",
    },
    {
      lvl: 2,
      text: "Gere a documentação de módulos com Spring Modulith (<code>Documenter</code>) e compare com o diagrama que você desenhou à mão. O que divergiu?",
    },
    {
      lvl: 3,
      text: "Apresente uma arquitetura em 10 minutos para três públicos diferentes (diretoria, time de produto, desenvolvedores) usando níveis C4 diferentes. Grave e assista criticamente.",
    },
  ],
  refs: [
    { t: "c4model.com", u: "https://c4model.com/" },
    { t: "Structurizr", u: "https://structurizr.com/" },
    { t: "C4-PlantUML", u: "https://github.com/plantuml-stdlib/C4-PlantUML" },
    { t: "arc42", u: "https://arc42.org/" },
    {
      t: "Livro: The C4 Model for Visualising Software Architecture (Simon Brown)",
      u: "https://leanpub.com/visualising-software-architecture",
    },
    {
      t: "Spring Modulith: documentação de módulos",
      u: "https://docs.spring.io/spring-modulith/reference/documentation.html",
    },
  ],
});

/* ============================ FASE 4 ============================ */

T({
  id: "camadas-monolito",
  phase: "f4",
  title: "Camadas e o monolito bem feito",
  level: "Base",
  hours: 10,
  summary:
    "Arquitetura em camadas, particionamento técnico vs. por domínio e por que monolitos não são o vilão.",
  body: `
<p>A arquitetura em camadas (apresentação, aplicação/negócio, persistência, banco) é o padrão de fato de muitos sistemas. É simples, conhecida por todos e barata. Seu problema não é existir, mas o tipo de particionamento que ela favorece.</p>
<h3>Particionamento técnico vs. por domínio</h3>
<p>Camadas organizam o código por <strong>tipo técnico</strong>: todos os controllers juntos, todos os repositórios juntos. Mas mudanças de negócio são por <strong>domínio</strong>: "adicionar cupom de desconto" toca controller, serviço, repositório e banco, ou seja, todas as camadas. A alternativa é particionar primeiro por domínio (pedidos, catálogo, pagamentos) e só dentro de cada módulo organizar camadas. Essa é a lógica da <em>Lei de Conway</em> aplicada ao código: times de domínio trabalham em módulos de domínio.</p>
<h3>Camadas abertas e fechadas</h3>
<p>Numa camada fechada, a requisição precisa passar por ela; numa aberta, pode pular. Pular camadas parece economia, mas cria acoplamento: a apresentação passa a depender da persistência. O antipadrão <em>architecture sinkhole</em> acontece quando a maioria das requisições atravessa camadas que nada fazem além de repassar.</p>
<h3>Quando um monolito é a escolha certa</h3>
<p>Times pequenos, domínio ainda incerto, produto novo, orçamento de operação limitado. Martin Fowler argumenta pelo <em>Monolith First</em>: quase todas as histórias de microsserviços bem-sucedidas começaram como um monolito que ficou grande demais. Começar com microsserviços exige acertar as fronteiras de primeira, e isso quase nunca acontece.</p>
`,
  code: [
    {
      t: "Organização por domínio dentro de um monolito",
      src: `com.loja
├── pedidos            ← módulo de domínio
│   ├── api            (controllers, DTOs)
│   ├── aplicacao      (casos de uso)
│   ├── dominio        (entidades, regras)
│   └── infra          (JPA, clients)
├── catalogo
│   └── ...
└── pagamentos
    └── ...

// Em vez de:
com.loja.controllers / com.loja.services / com.loja.repositories`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Pegue um projeto organizado por camadas técnicas e reorganize por domínio. Conte quantos arquivos você precisa tocar para uma mudança típica antes e depois.",
    },
    {
      lvl: 2,
      text: "Escreva um ADR justificando um monolito para uma startup de 4 desenvolvedores, incluindo os sinais que indicariam a hora de reconsiderar.",
    },
  ],
  refs: [
    {
      t: "Martin Fowler: Monolith First",
      u: "https://martinfowler.com/bliki/MonolithFirst.html",
    },
    {
      t: "Martin Fowler: Presentation Domain Data Layering",
      u: "https://martinfowler.com/bliki/PresentationDomainDataLayering.html",
    },
    {
      t: "Mark Richards: Developer to Architect (lições, livros e vídeos)",
      u: "https://www.developertoarchitect.com/",
    },
  ],
});

T({
  id: "hexagonal",
  phase: "f4",
  title: "Hexagonal, Onion e Clean Architecture",
  level: "Intermediário",
  hours: 20,
  summary:
    "Ports and adapters: o domínio no centro, frameworks e infraestrutura na borda.",
  body: `
<p>Alistair Cockburn propôs a arquitetura hexagonal (<em>Ports and Adapters</em>) em 2005. Onion (Jeffrey Palermo) e Clean Architecture (Robert Martin) são variações da mesma ideia: <strong>o núcleo de negócio não conhece o mundo externo</strong>. Banco, HTTP, mensageria e frameworks são detalhes plugáveis.</p>
<h3>Os elementos</h3>
<ul>
<li><strong>Domínio</strong>: entidades, value objects, regras. Java puro.</li>
<li><strong>Portas de entrada</strong> (driving ports): interfaces dos casos de uso que o mundo externo pode chamar.</li>
<li><strong>Portas de saída</strong> (driven ports): interfaces que o domínio precisa (persistir, notificar, cobrar).</li>
<li><strong>Adaptadores de entrada</strong>: controller REST, listener Kafka, CLI, teste. Chamam as portas de entrada.</li>
<li><strong>Adaptadores de saída</strong>: repositório JPA, client HTTP, publicador Kafka. Implementam as portas de saída.</li>
</ul>
<p>A regra de dependência: <strong>setas sempre apontam para dentro</strong>. O adaptador JPA depende do domínio; nunca o contrário.</p>
<h3>Quando vale e quando é exagero</h3>
<p>Vale quando o domínio é rico, as regras mudam muito e você quer testar regras sem infraestrutura. É exagero num CRUD simples: mapear entidade JPA ↔ entidade de domínio ↔ DTO para um cadastro de 5 campos triplica o código sem benefício. Arquitetos experientes aplicam hexagonal nos módulos complexos e mantêm os simples simples.</p>
<div class="callout"><b>Ponto de discordância conhecido:</b> separar a entidade JPA da entidade de domínio é o mais "puro", mas custa mapeamento. Usar a mesma classe com anotações JPA é pragmático e comum. Os dois são defensáveis; escolha conscientemente e registre num ADR.</div>
`,
  code: [
    {
      t: "Estrutura de pacotes hexagonal",
      src: `com.loja.pedidos
├── dominio
│   ├── Pedido.java              (agregado, regras)
│   ├── ItemPedido.java
│   └── porta
│       ├── entrada/RealizarPedido.java      (interface do caso de uso)
│       └── saida/PedidosRepositorio.java    (interface)
│           saida/CobrancaPort.java
├── aplicacao
│   └── RealizarPedidoServico.java   (implementa RealizarPedido)
└── adaptador
    ├── entrada/web/PedidoController.java
    ├── entrada/mensageria/PagamentoConfirmadoListener.java
    ├── saida/persistencia/PedidosJpaAdapter.java
    └── saida/pagamento/StripeCobrancaAdapter.java`,
    },
    {
      t: "Caso de uso testável sem Spring",
      src: `public class RealizarPedidoServico implements RealizarPedido {
    private final PedidosRepositorio pedidos;
    private final CobrancaPort cobranca;
    private final EventosPort eventos;

    // construtor...

    @Override
    public PedidoId executar(ComandoRealizarPedido cmd) {
        var pedido = Pedido.criar(cmd.clienteId(), cmd.itens());
        var resultado = cobranca.cobrar(pedido.total(), cmd.meioPagamento());
        switch (resultado) {
            case Aprovado a -> pedido.confirmarPagamento(a.transacaoId());
            case Recusado r -> throw new PagamentoRecusado(r.motivo());
            case EmAnalise e -> pedido.aguardarAnalise();
        }
        pedidos.salvar(pedido);
        eventos.publicar(pedido.eventosPendentes());
        return pedido.id();
    }
}

// Teste: adaptadores falsos em memória, roda em milissegundos
var repo = new PedidosEmMemoria();
var servico = new RealizarPedidoServico(repo, valor -> new Aprovado("tx1", valor), e -> {});`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Implemente o módulo de pedidos acima com dois adaptadores de persistência intercambiáveis (JPA e em memória) e prove a troca nos testes.",
    },
    {
      lvl: 2,
      text: "Adicione um segundo adaptador de entrada (listener Kafka ou CLI) que chama o mesmo caso de uso, sem alterar uma linha do domínio.",
    },
    {
      lvl: 2,
      text: "Escreva regras ArchUnit que garantam: domínio não depende de nada; aplicação depende só do domínio; adaptadores não se conhecem entre si.",
    },
    {
      lvl: 3,
      text: "Estude o projeto <strong>buckpal</strong> (Tom Hombergs) e escreva uma crítica: onde você faria diferente e por quê.",
    },
  ],
  refs: [
    {
      t: "Alistair Cockburn: Hexagonal Architecture",
      u: "https://alistair.cockburn.us/hexagonal-architecture/",
    },
    {
      t: "Robert C. Martin: The Clean Architecture",
      u: "https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html",
    },
    {
      t: "Livro: Get Your Hands Dirty on Clean Architecture, 2ª ed. (Tom Hombergs)",
      u: "https://reflectoring.io/book/",
    },
    {
      t: "buckpal: exemplo de hexagonal em Java",
      u: "https://github.com/thombergs/buckpal",
    },
    {
      t: "Herberto Graça: Explicit Architecture",
      u: "https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/",
    },
  ],
});

T({
  id: "modulith",
  phase: "f4",
  title: "Monolito modular com Spring Modulith",
  level: "Intermediário",
  hours: 20,
  summary:
    "Fronteiras de módulos verificadas por teste, comunicação por eventos e o caminho para extrair serviços quando preciso.",
  body: `
<p>O monolito modular é hoje uma das escolhas mais recomendadas para a maioria dos sistemas: <strong>fronteiras claras entre módulos de domínio, em um único deploy</strong>. Você ganha a organização dos microsserviços sem a complexidade operacional de um sistema distribuído.</p>
<h3>O problema que ele resolve</h3>
<p>Um monolito comum vira uma "grande bola de lama" porque nada impede que o módulo de pedidos acesse a tabela de estoque diretamente. Com o tempo, tudo depende de tudo. O monolito modular coloca regras explícitas: cada módulo tem uma API pública e internals escondidos, e a comunicação entre módulos acontece por chamadas a essa API ou, preferencialmente, por eventos.</p>
<h3>Spring Modulith</h3>
<p>O Spring Modulith (versão 2.0 acompanha o Spring Boot 4) é um kit estrutural, não um runtime novo:</p>
<ul>
<li>Cada pacote direto abaixo do pacote principal é um <strong>módulo</strong>. Subpacotes são internos por padrão.</li>
<li><code>ApplicationModules.of(App.class).verify()</code> num teste detecta ciclos e acessos a internals de outros módulos.</li>
<li><code>@ApplicationModuleListener</code> processa eventos de outro módulo de forma assíncrona e transacional.</li>
<li>O <strong>Event Publication Registry</strong> grava eventos publicados no banco e reentrega após falha ou reinício: nenhum evento se perde.</li>
<li>Eventos podem ser <strong>externalizados</strong> para Kafka/RabbitMQ, primeiro passo para extrair um módulo como serviço.</li>
<li><code>@ApplicationModuleTest</code> sobe só um módulo nos testes; o <code>Documenter</code> gera diagramas C4.</li>
</ul>
<div class="callout"><b>Sinal de maturidade:</b> se você não consegue manter fronteiras limpas num monolito, microsserviços não vão salvar você. Vão só transformar acoplamento de código em acoplamento de rede, que é mais lento e mais difícil de depurar.</div>
`,
  code: [
    {
      t: "Verificação de módulos num teste",
      src: `class ModulosTest {
    ApplicationModules modulos = ApplicationModules.of(LojaApplication.class);

    @Test
    void verifica_fronteiras() {
        modulos.verify();   // falha se pedidos acessar catalogo.internal.*
    }

    @Test
    void gera_documentacao() {
        new Documenter(modulos).writeModulesAsPlantUml().writeIndividualModulesAsPlantUml();
    }
}`,
    },
    {
      t: "Comunicação entre módulos por eventos",
      src: `// módulo pedidos: publica
@Service
class FinalizarPedido {
    private final ApplicationEventPublisher eventos;
    @Transactional
    public void executar(PedidoId id) {
        var pedido = pedidos.porId(id).orElseThrow();
        pedido.finalizar();
        eventos.publishEvent(new PedidoFinalizado(id, pedido.itens()));
    }
}

// módulo estoque: reage, sem depender de classes internas de pedidos
@Component
class BaixaEstoque {
    @ApplicationModuleListener   // async + nova transação + registro durável
    void on(PedidoFinalizado evento) {
        evento.itens().forEach(i -> estoque.baixar(i.sku(), i.quantidade()));
    }
}`,
    },
    {
      t: "Teste de um módulo isolado com cenário de eventos",
      src: `@ApplicationModuleTest
class EstoqueModuloTest {
    @Test
    void baixa_estoque_quando_pedido_finaliza(Scenario cenario) {
        cenario.publish(new PedidoFinalizado(pedidoId, List.of(new Item("SKU-1", 2))))
               .andWaitForStateChange(() -> estoque.disponivel("SKU-1"))
               .andVerify(qtd -> assertThat(qtd).isEqualTo(8));
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Crie um monolito com os módulos pedidos, catálogo, estoque e notificações. Introduza propositalmente uma violação e veja o teste <code>verify()</code> falhar.",
    },
    {
      lvl: 2,
      text: "Ative o Event Publication Registry com JDBC, derrube a aplicação no meio do processamento de um evento e prove que ele é reentregue ao reiniciar.",
    },
    {
      lvl: 2,
      text: "Externalize o evento <code>PedidoFinalizado</code> para Kafka e consuma de uma aplicação separada.",
    },
    {
      lvl: 3,
      text: "Extraia o módulo de notificações para um serviço independente, mantendo o resto como monolito. Escreva um ADR com os critérios que justificaram extrair este e não outro.",
    },
  ],
  refs: [
    {
      t: "Spring Modulith Reference",
      u: "https://docs.spring.io/spring-modulith/reference/",
    },
    {
      t: "Dan Vega: Introduction to Spring Modulith",
      u: "https://www.danvega.dev/blog/introduction-to-spring-modulith",
    },
    {
      t: "Oliver Drotbohm (criador do Modulith): palestras e exemplos",
      u: "https://github.com/odrotbohm",
    },
    {
      t: "Kamil Grzybek: Modular Monolith Primer",
      u: "https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer",
    },
    {
      t: "Shopify: Deconstructing the Monolith",
      u: "https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity",
    },
  ],
});

T({
  id: "eda",
  phase: "f4",
  title: "Arquitetura orientada a eventos",
  level: "Avançado",
  hours: 20,
  summary:
    "Broker vs. mediator, tipos de evento, coreografia vs. orquestração e os problemas reais de sistemas assíncronos.",
  body: `
<p>Em arquitetura orientada a eventos (EDA), componentes reagem a fatos que aconteceram, em vez de serem chamados diretamente. O produtor não sabe quem consome. Isso dá desacoplamento, escala e extensibilidade, ao preço de consistência eventual e fluxos mais difíceis de enxergar.</p>
<h3>Tipos de evento</h3>
<ul>
<li><strong>Notificação de evento</strong>: "Pedido 123 foi pago". Pequeno; quem precisa de detalhes consulta a origem.</li>
<li><strong>Event-carried state transfer</strong>: o evento leva os dados necessários. Consumidores mantêm sua própria cópia e não chamam o produtor.</li>
<li><strong>Event sourcing</strong>: eventos são a fonte da verdade do estado (fase 6).</li>
</ul>
<h3>Topologias</h3>
<table class="tbl"><thead><tr><th></th><th>Broker (coreografia)</th><th>Mediator (orquestração)</th></tr></thead><tbody>
<tr><td>Controle</td><td>Distribuído: cada serviço reage e publica</td><td>Central: um orquestrador comanda os passos</td></tr>
<tr><td>Vantagem</td><td>Desacoplamento, escala, fácil adicionar consumidores</td><td>Fluxo visível, tratamento de erro centralizado</td></tr>
<tr><td>Risco</td><td>Ninguém enxerga o fluxo inteiro; erro difícil de compensar</td><td>Orquestrador vira gargalo e ponto de acoplamento</td></tr>
<tr><td>Ferramentas</td><td>Kafka, RabbitMQ, SNS/SQS</td><td>Temporal, Camunda, AWS Step Functions</td></tr>
</tbody></table>
<h3>Problemas que você vai enfrentar</h3>
<ul>
<li><strong>Entrega pelo menos uma vez</strong>: o mesmo evento pode chegar duas vezes. Consumidores precisam ser <strong>idempotentes</strong>.</li>
<li><strong>Ordenação</strong>: garantida só dentro de uma partição. Use a chave do agregado como chave da mensagem.</li>
<li><strong>Evolução de schema</strong>: use Avro/Protobuf com Schema Registry e regras de compatibilidade.</li>
<li><strong>Mensagens envenenadas</strong>: uma mensagem que sempre falha trava a partição. Use retry com backoff e <em>dead letter topic</em>.</li>
<li><strong>Dual write</strong>: gravar no banco e publicar no broker não é atômico. Solução: Transactional Outbox (fase 6).</li>
</ul>
`,
  code: [
    {
      t: "Consumidor Kafka idempotente com Spring",
      src: `@Component
class PagamentoConfirmadoConsumer {
    private final ProcessadosRepositorio processados;
    private final LiberarPedido liberarPedido;

    @KafkaListener(topics = "pagamentos.confirmados", groupId = "pedidos")
    @RetryableTopic(attempts = "4", backoff = @Backoff(delay = 1000, multiplier = 2),
                    dltTopicSuffix = ".dlt")
    @Transactional
    public void on(PagamentoConfirmado evento) {
        // UNIQUE(evento_id): segunda entrega cai aqui e é ignorada
        if (!processados.registrarSeNovo(evento.eventoId())) return;
        liberarPedido.executar(evento.pedidoId());
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Suba Kafka com Docker Compose (modo KRaft), crie um produtor e dois grupos de consumidores e observe como as partições se distribuem.",
    },
    {
      lvl: 2,
      text: "Envie o mesmo evento 3 vezes de propósito e prove que o consumidor processa só uma. Depois envie uma mensagem malformada e verifique que ela chega ao DLT.",
    },
    {
      lvl: 2,
      text: "Modele o fluxo de checkout (pedido, pagamento, estoque, envio) duas vezes: com coreografia e com orquestração (Temporal). Compare legibilidade e tratamento de falhas.",
    },
    {
      lvl: 3,
      text: "Evolua o schema Avro de um evento adicionando e removendo campos com Schema Registry em modo BACKWARD. Documente quais mudanças são permitidas.",
    },
  ],
  refs: [
    {
      t: "Martin Fowler: What do you mean by Event-Driven?",
      u: "https://martinfowler.com/articles/201701-event-driven.html",
    },
    {
      t: "Apache Kafka: documentação",
      u: "https://kafka.apache.org/documentation/",
    },
    {
      t: "Spring for Apache Kafka",
      u: "https://docs.spring.io/spring-kafka/reference/",
    },
    { t: "Temporal: Java SDK", u: "https://docs.temporal.io/develop/java" },
    {
      t: "Livro: Kafka: The Definitive Guide, 2ª ed.",
      u: "https://www.oreilly.com/library/view/kafka-the-definitive/9781492043072/",
    },
    {
      t: "Livro: Building Event-Driven Microservices (Adam Bellemare)",
      u: "https://www.oreilly.com/library/view/building-event-driven-microservices/9781492057888/",
    },
  ],
});

T({
  id: "microsservicos",
  phase: "f4",
  title: "Microsserviços: quando, como e o preço",
  level: "Avançado",
  hours: 30,
  summary:
    "Granularidade, banco por serviço, comunicação, decomposição a partir de um monolito e os antipadrões mais caros.",
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
</ul>
<h3>Migrando de um monolito: Strangler Fig</h3>
<p>Coloque um roteador na frente do monolito, extraia uma capacidade por vez para um serviço novo e redirecione o tráfego dela. O monolito vai encolhendo até poder ser desligado. Nunca reescreva tudo de uma vez.</p>
`,
  code: [
    {
      t: "Client HTTP declarativo com timeout (Spring Boot 4)",
      src: `@HttpExchange("/estoque")
public interface EstoqueClient {
    @GetExchange("/{sku}")
    Disponibilidade consultar(@PathVariable String sku);
}

@Configuration
class ClientsConfig {
    @Bean
    EstoqueClient estoqueClient(RestClient.Builder builder) {
        var rf = new SimpleClientHttpRequestFactory();
        rf.setConnectTimeout(Duration.ofMillis(300));
        rf.setReadTimeout(Duration.ofMillis(800));   // NUNCA deixe sem timeout
        var rc = builder.baseUrl("http://estoque").requestFactory(rf).build();
        return HttpServiceProxyFactory.builderFor(RestClientAdapter.create(rc))
                                      .build().createClient(EstoqueClient.class);
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Leia o artigo <em>Microservices</em> de Lewis e Fowler e liste as 9 características com um exemplo de violação de cada.",
    },
    {
      lvl: 2,
      text: "Pegue o monolito modular da fase anterior e extraia 2 serviços com Strangler Fig, usando Spring Cloud Gateway como roteador. Mantenha o sistema funcionando a cada passo.",
    },
    {
      lvl: 2,
      text: "Calcule a disponibilidade de um fluxo que passa por 6 serviços com 99,9% cada. Redesenhe para reduzir chamadas síncronas e recalcule.",
    },
    {
      lvl: 3,
      text: "Para um sistema de streaming de vídeo, decida a granularidade dos serviços usando integradores e desintegradores. Apresente como uma tabela de forças e um ADR.",
    },
  ],
  refs: [
    {
      t: "James Lewis & Martin Fowler: Microservices",
      u: "https://martinfowler.com/articles/microservices.html",
    },
    {
      t: "microservices.io (Chris Richardson): catálogo de padrões",
      u: "https://microservices.io/patterns/",
    },
    {
      t: "Livro: Building Microservices, 2ª ed. (Sam Newman)",
      u: "https://samnewman.io/books/building_microservices_2nd_edition/",
    },
    {
      t: "Livro: Monolith to Microservices (Sam Newman)",
      u: "https://samnewman.io/books/monolith-to-microservices/",
    },
    {
      t: "Livro: Microservices Patterns (Chris Richardson)",
      u: "https://microservices.io/book",
    },
    {
      t: "Martin Fowler: Strangler Fig Application",
      u: "https://martinfowler.com/bliki/StranglerFigApplication.html",
    },
    {
      t: "Fallacies of Distributed Computing",
      u: "https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing",
    },
  ],
});

T({
  id: "outros-estilos",
  phase: "f4",
  title: "Microkernel, space-based, serverless e células",
  level: "Avançado",
  hours: 12,
  summary:
    "Estilos menos comuns que resolvem problemas específicos muito bem, e a matriz de comparação entre todos.",
  body: `
<h3>Microkernel (plug-in)</h3>
<p>Um núcleo mínimo e plug-ins que adicionam funcionalidades. Exemplos: IDEs (IntelliJ, Eclipse), navegadores, motores de regras de seguradoras com uma regra por estado. Em Java: <code>ServiceLoader</code>, módulos JPMS, ou PF4J. Ótimo para produtos customizáveis por cliente.</p>
<h3>Space-based</h3>
<p>Remove o banco do caminho crítico: dados ficam em grids de memória replicados (Hazelcast, Apache Ignite), e a escrita no banco acontece de forma assíncrona. Para picos extremos e imprevisíveis, como venda de ingressos ou leilões. Caro e complexo.</p>
<h3>Serverless</h3>
<p>Funções executadas sob demanda (AWS Lambda, Google Cloud Run). Escala até zero e cobra por uso. Em Java, o cold start é a dificuldade: use GraalVM native image, AWS Lambda SnapStart ou CRaC. Bom para cargas esporádicas e integrações; ruim para tráfego constante alto (o custo inverte) e processamento longo.</p>
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
      t: "Microkernel com ServiceLoader",
      src: `// Contrato do plug-in (no núcleo)
public interface RegraSeguro {
    String uf();
    BigDecimal ajustarPremio(Apolice a, BigDecimal premioBase);
}

// Núcleo carrega todos os plug-ins no classpath
Map<String, RegraSeguro> regras = ServiceLoader.load(RegraSeguro.class).stream()
    .map(ServiceLoader.Provider::get)
    .collect(Collectors.toMap(RegraSeguro::uf, r -> r));

// Plug-in em JAR separado, registrado em
// META-INF/services/com.seguros.RegraSeguro → com.seguros.sp.RegraSaoPaulo`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Implemente um sistema de cálculo de impostos com microkernel: um plug-in por estado, carregados por <code>ServiceLoader</code>.",
    },
    {
      lvl: 2,
      text: "Publique uma função Spring Cloud Function no AWS Lambda com e sem SnapStart e compare o cold start.",
    },
    {
      lvl: 3,
      text: "Para 4 cenários (ERP de PME, venda de ingressos, IDE, marketplace com 30 times), escolha o estilo com a matriz e justifique em um parágrafo cada.",
    },
  ],
  refs: [
    {
      t: "AWS: Guidance for Cell-Based Architecture",
      u: "https://docs.aws.amazon.com/wellarchitected/latest/reducing-scope-of-impact-with-cell-based-architecture/reducing-scope-of-impact-with-cell-based-architecture.html",
    },
    { t: "PF4J: plugin framework para Java", u: "https://pf4j.org/" },
    {
      t: "GraalVM Native Image",
      u: "https://www.graalvm.org/latest/reference-manual/native-image/",
    },
    { t: "Hazelcast", u: "https://docs.hazelcast.com/" },
  ],
});

/* ============================ FASE 5 ============================ */

T({
  id: "ddd-estrategico",
  phase: "f5",
  title: "DDD estratégico",
  level: "Avançado",
  hours: 25,
  summary:
    "Linguagem ubíqua, subdomínios, bounded contexts e context mapping: as fronteiras que importam.",
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
record ErpClienteDto(String CD_CLI, String NM_RAZAO, String TP_PES, String FL_ATIVO) {}

// Nosso modelo, na nossa linguagem
public record Cliente(ClienteId id, String nome, TipoPessoa tipo, boolean ativo) {}

// A ACL é o único lugar que conhece os dois
@Component
class ClientesErpAcl implements ClientesPort {
    private final ErpClient erp;

    public Optional<Cliente> buscar(ClienteId id) {
        return erp.consultarCliente(id.valor()).map(this::traduzir);
    }
    private Cliente traduzir(ErpClienteDto d) {
        return new Cliente(
            new ClienteId(d.CD_CLI().trim()),
            d.NM_RAZAO().trim(),
            switch (d.TP_PES()) {
                case "F" -> TipoPessoa.FISICA;
                case "J" -> TipoPessoa.JURIDICA;
                default  -> throw new DadoLegadoInvalido("TP_PES=" + d.TP_PES());
            },
            "S".equals(d.FL_ATIVO()));
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Para uma clínica veterinária, liste subdomínios e classifique em core, supporting e generic. Diga o que você compraria pronto.",
    },
    {
      lvl: 2,
      text: "Desenhe o context map de um e-commerce com pelo menos 6 bounded contexts, nomeando o tipo de relacionamento entre cada par.",
    },
    {
      lvl: 2,
      text: "Escreva um glossário de linguagem ubíqua de 20 termos para um domínio que você conhece, incluindo termos que mudam de significado entre contextos.",
    },
    {
      lvl: 3,
      text: "Use o <strong>Bounded Context Canvas</strong> (DDD Crew) para documentar 3 contextos do seu e-commerce, incluindo mensagens de entrada e saída.",
    },
  ],
  refs: [
    {
      t: 'Livro: Domain-Driven Design (Eric Evans), o "livro azul"',
      u: "https://www.domainlanguage.com/ddd/",
    },
    {
      t: "Livro: Learning Domain-Driven Design (Vlad Khononov)",
      u: "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/",
      note: "a melhor porta de entrada hoje",
    },
    {
      t: 'Livro: Implementing Domain-Driven Design (Vaughn Vernon), o "livro vermelho"',
      u: "https://www.oreilly.com/library/view/implementing-domain-driven-design/9780133039900/",
    },
    {
      t: "DDD Crew: canvases e guias gratuitos",
      u: "https://github.com/ddd-crew",
    },
    {
      t: "DDD Reference (Evans, gratuito)",
      u: "https://www.domainlanguage.com/ddd/reference/",
    },
    {
      t: "Martin Fowler: Bounded Context",
      u: "https://martinfowler.com/bliki/BoundedContext.html",
    },
  ],
});

T({
  id: "ddd-tatico",
  phase: "f5",
  title: "DDD tático em Java",
  level: "Avançado",
  hours: 25,
  summary:
    "Entidades, value objects, agregados, eventos de domínio, repositórios e serviços de domínio.",
  body: `
<p>Os padrões táticos são as ferramentas para implementar um modelo rico <em>dentro</em> de um bounded context.</p>
<dl class="defs">
<dt>Value Object</dt><dd>Definido pelos atributos, imutável, sem identidade: <code>Dinheiro</code>, <code>Endereco</code>, <code>Periodo</code>. Records do Java são perfeitos. Concentre regras neles: um <code>Dinheiro</code> que não soma moedas diferentes elimina uma categoria inteira de bug.</dd>
<dt>Entidade</dt><dd>Tem identidade que persiste ao longo do tempo, mesmo que atributos mudem: <code>Cliente</code>, <code>Pedido</code>.</dd>
<dt>Agregado</dt><dd>Grupo de entidades e value objects tratados como unidade de consistência, com uma <strong>raiz</strong> que é o único ponto de entrada. Regras: (1) proteja invariantes dentro do agregado; (2) mantenha agregados pequenos; (3) referencie outros agregados por ID, não por objeto; (4) altere um agregado por transação; consistência entre agregados é eventual.</dd>
<dt>Evento de domínio</dt><dd>Algo significativo que aconteceu, no passado: <code>PedidoConfirmado</code>. Conecta agregados e contextos sem acoplá-los.</dd>
<dt>Repositório</dt><dd>Abstração de coleção para agregados. Um repositório por agregado (raiz), nunca por tabela.</dd>
<dt>Serviço de domínio</dt><dd>Lógica de domínio que não pertence naturalmente a nenhuma entidade (ex.: transferência entre duas contas).</dd>
</dl>
<h3>Modelo anêmico: o antipadrão mais comum</h3>
<p>Entidades só com getters e setters, e toda a lógica em <code>Services</code>. As regras se espalham, invariantes não são protegidas e qualquer código pode deixar um pedido em estado inválido. Fowler chama isso de <em>Anemic Domain Model</em>. A correção: métodos de comportamento com nomes do negócio (<code>pedido.confirmar()</code>) em vez de <code>pedido.setStatus(CONFIRMADO)</code>.</p>
`,
  code: [
    {
      t: "Agregado Pedido protegendo invariantes",
      src: `public class Pedido {
    private final PedidoId id;
    private final ClienteId clienteId;          // outro agregado: só o ID
    private final List<ItemPedido> itens = new ArrayList<>();
    private StatusPedido status = StatusPedido.RASCUNHO;
    private final List<EventoDominio> eventos = new ArrayList<>();

    private static final int MAX_ITENS = 50;

    public void adicionarItem(Sku sku, int qtd, Dinheiro precoUnitario) {
        exigirStatus(StatusPedido.RASCUNHO);
        if (itens.size() >= MAX_ITENS) throw new RegraViolada("Limite de itens atingido");
        itens.stream().filter(i -> i.sku().equals(sku)).findFirst()
             .ifPresentOrElse(i -> i.somar(qtd),
                              () -> itens.add(new ItemPedido(sku, qtd, precoUnitario)));
    }

    public void confirmar(Instant quando) {
        exigirStatus(StatusPedido.RASCUNHO);
        if (itens.isEmpty()) throw new RegraViolada("Pedido vazio não pode ser confirmado");
        status = StatusPedido.CONFIRMADO;
        eventos.add(new PedidoConfirmado(id, clienteId, total(), quando));
    }

    public Dinheiro total() {
        return itens.stream().map(ItemPedido::subtotal).reduce(Dinheiro.ZERO, Dinheiro::mais);
    }
    public List<ItemPedido> itens() { return List.copyOf(itens); }  // sem vazar a lista
    public List<EventoDominio> retirarEventos() {
        var copia = List.copyOf(eventos); eventos.clear(); return copia;
    }
    private void exigirStatus(StatusPedido esperado) {
        if (status != esperado) throw new RegraViolada("Status atual: " + status);
    }
}`,
    },
    {
      t: "Value Object Dinheiro",
      src: `public record Dinheiro(BigDecimal valor, Currency moeda) {
    public static final Dinheiro ZERO = new Dinheiro(BigDecimal.ZERO, Currency.getInstance("BRL"));

    public Dinheiro {
        Objects.requireNonNull(moeda);
        valor = valor.setScale(2, RoundingMode.HALF_EVEN);
    }
    public Dinheiro mais(Dinheiro outro) {
        if (!moeda.equals(outro.moeda)) throw new IllegalArgumentException("Moedas diferentes");
        return new Dinheiro(valor.add(outro.valor), moeda);
    }
    public Dinheiro vezes(int n) { return new Dinheiro(valor.multiply(BigDecimal.valueOf(n)), moeda); }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Modele o agregado <code>Reserva</code> de um hotel (quartos, período, hóspedes) com invariantes: sem sobreposição de datas para o mesmo quarto dentro da reserva, máximo de hóspedes por quarto.",
    },
    {
      lvl: 2,
      text: "Pegue um projeto com modelo anêmico e mova 5 regras dos services para dentro das entidades. Escreva testes de domínio para cada regra.",
    },
    {
      lvl: 2,
      text: "Publique os eventos de domínio do agregado <code>Pedido</code> após o commit usando <code>@DomainEvents</code> do Spring Data ou Spring Modulith.",
    },
    {
      lvl: 3,
      text: "Resolva o problema clássico: um agregado <code>Turma</code> com 10.000 alunos fica lento. Redesenhe as fronteiras do agregado e justifique a mudança de invariante para consistência eventual.",
    },
  ],
  refs: [
    {
      t: "Vaughn Vernon: Effective Aggregate Design (3 partes, PDF)",
      u: "https://www.dddcommunity.org/library/vernon_2011/",
    },
    {
      t: "Martin Fowler: Anemic Domain Model",
      u: "https://martinfowler.com/bliki/AnemicDomainModel.html",
    },
    {
      t: "jMolecules: anotações de DDD e arquitetura para Java",
      u: "https://github.com/xmolecules/jmolecules",
    },
    {
      t: "Livro: Domain-Driven Design Distilled (Vaughn Vernon)",
      u: "https://www.oreilly.com/library/view/domain-driven-design-distilled/9780134434964/",
    },
    {
      t: "ddd-by-examples/library: projeto de referência em Java",
      u: "https://github.com/ddd-by-examples/library",
    },
  ],
});

T({
  id: "event-storming",
  phase: "f5",
  title: "Event Storming e descoberta de domínio",
  level: "Intermediário",
  hours: 10,
  summary:
    "Workshops colaborativos para descobrir eventos, comandos, agregados e fronteiras junto com o negócio.",
  body: `
<p>Criado por Alberto Brandolini, o <strong>Event Storming</strong> é um workshop com post-its numa parede longa (ou num quadro como o Miro) em que especialistas de negócio e técnicos mapeiam um processo a partir dos <strong>eventos de domínio</strong>, sempre no passado: "Pedido realizado", "Pagamento recusado", "Mercadoria despachada".</p>
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
`,
  code: [],
  exercises: [
    {
      lvl: 1,
      text: "Sozinho, faça um Big Picture do processo de matrícula numa faculdade, com pelo menos 30 eventos. Use o Miro, já que você já trabalha nele.",
    },
    {
      lvl: 2,
      text: "Conduza um Event Storming de 2 horas com 3 pessoas (amigos, colegas) sobre um processo que uma delas conhece bem. Registre os hotspots.",
    },
    {
      lvl: 3,
      text: "A partir do seu Event Storming, identifique os bounded contexts, desenhe o context map e implemente um dos agregados em Java com testes.",
    },
  ],
  refs: [
    {
      t: "Livro: Introducing EventStorming (Alberto Brandolini)",
      u: "https://leanpub.com/introducing_eventstorming",
    },
    { t: "eventstorming.com", u: "https://www.eventstorming.com/" },
    {
      t: "DDD Crew: EventStorming Glossary & Cheat Sheet",
      u: "https://github.com/ddd-crew/eventstorming-glossary-cheat-sheet",
    },
    { t: "Domain Storytelling", u: "https://domainstorytelling.org/" },
    {
      t: "DDD Crew: DDD Starter Modelling Process",
      u: "https://github.com/ddd-crew/ddd-starter-modelling-process",
    },
  ],
});
/* ============================ FASE 6 ============================ */

T({
  id: "distribuidos",
  phase: "f6",
  title: "Fundamentos de sistemas distribuídos",
  level: "Avançado",
  hours: 30,
  summary:
    "CAP, PACELC, modelos de consistência, relógios, falhas parciais e consenso.",
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
`,
  code: [
    {
      t: "Relógio de Lamport",
      src: `public final class RelogioLamport {
    private final AtomicLong tempo = new AtomicLong();

    // evento local ou envio de mensagem
    public long tick() { return tempo.incrementAndGet(); }

    // ao receber uma mensagem com o carimbo do remetente
    public long receber(long carimboRemoto) {
        return tempo.updateAndGet(local -> Math.max(local, carimboRemoto) + 1);
    }
}
// Garante: se A causou B, então L(A) < L(B).
// Não garante o inverso: L(A) < L(B) não implica causalidade.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Para 5 sistemas (banco, rede social, carrinho de compras, DNS, placar de jogo ao vivo), diga qual escolha PACELC você faria e por quê.",
    },
    {
      lvl: 2,
      text: "Implemente vector clocks em Java e simule três réplicas trocando mensagens. Detecte escritas concorrentes.",
    },
    {
      lvl: 2,
      text: "Faça os laboratórios do <strong>Gossip Glomers</strong> (Fly.io + Jepsen Maelstrom) em Java: echo, unique IDs, broadcast e contador grow-only.",
    },
    {
      lvl: 3,
      text: "Leia o paper do Raft e implemente eleição de líder (sem replicação de log) com 5 nós simulados, injetando falhas e partições.",
    },
  ],
  refs: [
    {
      t: "Livro: Designing Data-Intensive Applications, 2ª ed. (Kleppmann & Riccomini, 2026)",
      u: "https://www.oreilly.com/library/view/-/9781098119058",
      note: "o livro mais importante desta fase; prefira a 2ª edição",
    },
    {
      t: "Martin Kleppmann: curso de Sistemas Distribuídos de Cambridge (vídeos gratuitos)",
      u: "https://www.youtube.com/playlist?list=PLeKd45zvjcDFUEv_ohr_HdUFe97RItdiB",
    },
    {
      t: "The Raft Consensus Algorithm (visualização interativa)",
      u: "https://raft.github.io/",
    },
    { t: "Fly.io Gossip Glomers", u: "https://fly.io/dist-sys/" },
    {
      t: "Jepsen: análises de bancos sob falha",
      u: "https://jepsen.io/analyses",
    },
    {
      t: "Daniel Abadi: Consistency Tradeoffs in Modern Distributed Database System Design (PACELC)",
      u: "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf",
    },
  ],
});

T({
  id: "dados-escala",
  phase: "f6",
  title: "Replicação, particionamento e escolha de banco",
  level: "Avançado",
  hours: 25,
  summary:
    "Líder-seguidor, multi-líder, sem líder, sharding, NoSQL vs. relacional e persistência poliglota.",
  body: `
<h3>Replicação</h3>
<table class="tbl"><thead><tr><th>Modelo</th><th>Como funciona</th><th>Trade-off</th></tr></thead><tbody>
<tr><td>Líder único</td><td>Escritas no líder, réplicas seguem (PostgreSQL, MySQL)</td><td>Simples; réplicas atrasam (replication lag) e o líder limita a escrita</td></tr>
<tr><td>Multi-líder</td><td>Vários aceitam escrita (multi-região, offline-first)</td><td>Conflitos de escrita precisam ser resolvidos</td></tr>
<tr><td>Sem líder</td><td>Escritas e leituras com quórum (Cassandra, DynamoDB)</td><td>Alta disponibilidade; consistência ajustável por W + R &gt; N</td></tr>
</tbody></table>
<p><strong>Replication lag na prática:</strong> o usuário salva o perfil, a página recarrega lendo de uma réplica atrasada e mostra o dado antigo. Soluções: ler do líder logo após escrever, ou rotear leituras do próprio usuário para o líder por alguns segundos.</p>
<h3>Particionamento (sharding)</h3>
<p>Divide os dados entre nós. Por <strong>faixa de chave</strong> (bom para consultas por intervalo, risco de hot spots) ou por <strong>hash</strong> (distribui bem, perde ordenação). O problema difícil é escolher a chave: tudo que precisa ser consultado junto deve ficar na mesma partição. Rebalancear depois é caro.</p>
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
<div class="callout"><b>Regra prática:</b> PostgreSQL resolve muito mais do que parece (JSONB, busca textual, filas com SKIP LOCKED, extensões como pgvector e TimescaleDB). Adicionar um banco novo é adicionar um sistema para operar, monitorar, fazer backup e ensinar ao time. Exija um motivo forte.</div>
`,
  code: [
    {
      t: "Roteamento de leitura/escrita no Spring",
      src: `public class RoteadorDataSource extends AbstractRoutingDataSource {
    @Override
    protected Object determineCurrentLookupKey() {
        return TransactionSynchronizationManager.isCurrentTransactionReadOnly()
            ? "replica" : "primario";
    }
}

@Service
class CatalogoConsulta {
    @Transactional(readOnly = true)   // vai para a réplica
    public List<ProdutoResumo> buscar(String termo) { /* ... */ }
}
// Cuidado: o roteador precisa de LazyConnectionDataSourceProxy para
// decidir depois que a transação já sabe que é readOnly.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Suba PostgreSQL com uma réplica via Docker Compose (replicação por streaming). Escreva no primário e meça o atraso de leitura na réplica.",
    },
    {
      lvl: 2,
      text: "Modele as tabelas de um chat (mensagens por conversa) para Cassandra, escolhendo partition key e clustering key. Explique o que acontece com conversas muito ativas.",
    },
    {
      lvl: 3,
      text: "Projete o particionamento de um sistema multi-tenant com 10.000 clientes, sendo 5 deles responsáveis por 60% do volume. Compare shard por tenant, por hash e híbrido.",
    },
  ],
  refs: [
    {
      t: "Livro: Designing Data-Intensive Applications, 2ª ed., capítulos de replicação e particionamento",
      u: "https://dataintensive.net/",
    },
    {
      t: "Livro: NoSQL Distilled (Sadalage & Fowler)",
      u: "https://martinfowler.com/books/nosql.html",
    },
    {
      t: "Amazon DynamoDB paper (2007)",
      u: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf",
    },
    {
      t: "Livro: Database Internals (Alex Petrov)",
      u: "https://www.databass.dev/",
    },
  ],
});

T({
  id: "cache",
  phase: "f6",
  title: "Cache em todas as camadas",
  level: "Intermediário",
  hours: 12,
  summary:
    "Cache-aside, write-through, invalidação, TTL, stampede e cache distribuído com Redis.",
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
<li><strong>Cache stampede</strong>: uma chave popular expira e mil requisições vão ao banco ao mesmo tempo. Soluções: lock por chave, expiração antecipada probabilística, recálculo em background.</li>
<li><strong>Dado obsoleto</strong>: defina conscientemente quanto atraso o negócio tolera. Preço de produto: minutos. Saldo bancário: zero.</li>
<li><strong>Cache em dois níveis</strong>: local (Caffeine) + distribuído (Redis). Rápido, mas invalidar os locais exige pub/sub.</li>
</ul>
`,
  code: [
    {
      t: "Caffeine local com proteção contra stampede",
      src: `LoadingCache<Sku, Produto> cache = Caffeine.newBuilder()
    .maximumSize(50_000)
    .expireAfterWrite(Duration.ofMinutes(10))
    .refreshAfterWrite(Duration.ofMinutes(8))   // recarrega em background antes de expirar
    .recordStats()
    .build(sku -> repositorio.buscar(sku));     // uma carga por chave, mesmo com N threads

Produto p = cache.get(new Sku("ABC-123"));`,
    },
    {
      t: "Spring Cache com Redis",
      src: `@Service
class CatalogoServico {
    @Cacheable(cacheNames = "produtos", key = "#sku", sync = true)
    public Produto buscar(String sku) { return repo.buscar(sku); }

    @CacheEvict(cacheNames = "produtos", key = "#produto.sku")
    public void atualizar(Produto produto) { repo.salvar(produto); }
}
# application.yml
spring.cache.type: redis
spring.cache.redis.time-to-live: 10m`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Adicione cache a um endpoint lento e meça a melhora com <code>k6</code>. Exponha as métricas de hit ratio pelo Actuator.",
    },
    {
      lvl: 2,
      text: "Provoque um cache stampede (TTL curto + 500 requisições simultâneas) e corrija. Mostre o número de consultas ao banco antes e depois.",
    },
    {
      lvl: 3,
      text: "Implemente cache de dois níveis (Caffeine + Redis) com invalidação via Redis pub/sub entre 3 instâncias da aplicação.",
    },
  ],
  refs: [
    { t: "Caffeine", u: "https://github.com/ben-manes/caffeine" },
    { t: "Redis: documentação", u: "https://redis.io/docs/latest/" },
    {
      t: "Spring Framework: Cache Abstraction",
      u: "https://docs.spring.io/spring-framework/reference/integration/cache.html",
    },
    {
      t: "Facebook: Scaling Memcache (paper)",
      u: "https://www.usenix.org/system/files/conference/nsdi13/nsdi13-final170_update.pdf",
    },
  ],
});

T({
  id: "saga-outbox",
  phase: "f6",
  title: "Sagas, Outbox e consistência entre serviços",
  level: "Avançado",
  hours: 25,
  summary:
    "Como manter dados corretos sem transação distribuída: Transactional Outbox, CDC, sagas e compensações.",
  body: `
<p>Cada serviço tem seu banco. Então como fazer "reservar estoque, cobrar e criar o envio" de forma confiável? Transações distribuídas (2PC) existem, mas bloqueiam recursos, não escalam e muitos brokers nem suportam. A resposta da indústria são <strong>sagas</strong>.</p>
<h3>Transactional Outbox</h3>
<p>Primeiro, resolva o <em>dual write</em>: salvar no banco e publicar no Kafka são duas operações; se a segunda falhar, o sistema fica inconsistente. Com o outbox, você grava o evento numa tabela <code>outbox</code> <strong>na mesma transação</strong> do dado de negócio. Um processo separado lê essa tabela e publica no broker. Duas formas de ler:</p>
<ul>
<li><strong>Polling</strong>: um job consulta a tabela periodicamente. Simples.</li>
<li><strong>CDC (Change Data Capture)</strong>: o <strong>Debezium</strong> lê o write-ahead log do banco e publica. Menor latência, sem carga de consulta.</li>
</ul>
<p>O Event Publication Registry do Spring Modulith é uma implementação desse padrão.</p>
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
      src: `@Transactional
public PedidoId realizar(ComandoRealizarPedido cmd) {
    var pedido = Pedido.criar(cmd);
    pedidos.save(pedido);
    outbox.save(new OutboxEvento(
        UUID.randomUUID(),
        "Pedido", pedido.id().toString(),        // aggregate type/id → chave da mensagem
        "PedidoCriado",
        json.write(PedidoCriado.de(pedido)),
        Instant.now()));
    return pedido.id();
    // COMMIT: ou os dois existem, ou nenhum.
}`,
    },
    {
      t: "Saga orquestrada com Temporal",
      src: `@WorkflowInterface
public interface CheckoutWorkflow {
    @WorkflowMethod void executar(Checkout c);
}

public class CheckoutWorkflowImpl implements CheckoutWorkflow {
    private final Atividades atv = Workflow.newActivityStub(Atividades.class,
        ActivityOptions.newBuilder().setStartToCloseTimeout(Duration.ofSeconds(30)).build());

    public void executar(Checkout c) {
        var saga = new Saga(new Saga.Options.Builder().build());
        try {
            atv.reservarEstoque(c);
            saga.addCompensation(atv::liberarEstoque, c);

            atv.cobrar(c);                       // pivô
            saga.addCompensation(atv::estornar, c);

            atv.criarEnvio(c);                   // repetível: Temporal faz retry
        } catch (ActivityFailure e) {
            saga.compensate();                   // desfaz em ordem inversa
            throw e;
        }
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Implemente outbox com polling (<code>@Scheduled</code> + <code>SKIP LOCKED</code>) publicando no Kafka. Derrube o Kafka e prove que nenhum evento se perde.",
    },
    {
      lvl: 2,
      text: "Substitua o polling por Debezium (Kafka Connect) lendo o WAL do PostgreSQL. Compare latência e complexidade operacional.",
    },
    {
      lvl: 2,
      text: "Implemente a saga de checkout coreografada com 3 serviços e simule falha em cada etapa. Desenhe o diagrama de estados de cada caso.",
    },
    {
      lvl: 3,
      text: "Implemente a mesma saga orquestrada com Temporal. Escreva um ADR comparando as duas implementações com base no que você viveu.",
    },
  ],
  refs: [
    {
      t: "microservices.io: Saga",
      u: "https://microservices.io/patterns/data/saga.html",
    },
    {
      t: "microservices.io: Transactional Outbox",
      u: "https://microservices.io/patterns/data/transactional-outbox.html",
    },
    {
      t: "Debezium: Outbox Event Router",
      u: "https://debezium.io/documentation/reference/stable/transformations/outbox-event-router.html",
    },
    {
      t: "Paper original: Sagas (Garcia-Molina & Salem, 1987)",
      u: "https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf",
    },
    {
      t: "Temporal: Saga pattern",
      u: "https://temporal.io/blog/saga-pattern-made-easy",
    },
    {
      t: "Pat Helland: Life Beyond Distributed Transactions",
      u: "https://queue.acm.org/detail.cfm?id=3025012",
    },
  ],
});

T({
  id: "cqrs-es",
  phase: "f6",
  title: "CQRS e Event Sourcing",
  level: "Avançado",
  hours: 20,
  summary:
    "Separar leitura de escrita, guardar o histórico como fonte da verdade, projeções e quando não usar.",
  body: `
<h3>CQRS</h3>
<p><strong>Command Query Responsibility Segregation</strong>: o modelo que processa comandos (escrita, com regras e invariantes) é separado do modelo que atende consultas (leitura, otimizado para cada tela). Em níveis crescentes:</p>
<ol>
<li>Classes separadas no mesmo banco (comandos usam agregados; consultas usam SQL/projeções direto).</li>
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
      src: `public sealed interface EventoConta {
    record Aberta(ContaId id, String titular) implements EventoConta {}
    record Depositado(BigDecimal valor) implements EventoConta {}
    record Sacado(BigDecimal valor) implements EventoConta {}
}

public class Conta {
    private ContaId id; private BigDecimal saldo = BigDecimal.ZERO;
    private final List<EventoConta> novos = new ArrayList<>();
    private long versao;

    public static Conta reconstruir(List<EventoConta> historico) {
        var c = new Conta();
        historico.forEach(c::aplicar);
        c.versao = historico.size();
        return c;
    }
    public void sacar(BigDecimal valor) {
        if (saldo.compareTo(valor) < 0) throw new SaldoInsuficiente(id);
        registrar(new EventoConta.Sacado(valor));
    }
    private void registrar(EventoConta e) { aplicar(e); novos.add(e); }

    private void aplicar(EventoConta e) {
        switch (e) {
            case EventoConta.Aberta a     -> id = a.id();
            case EventoConta.Depositado d -> saldo = saldo.add(d.valor());
            case EventoConta.Sacado s     -> saldo = saldo.subtract(s.valor());
        }
    }
}
// Persistência: INSERT dos novos eventos com versão esperada
// (UNIQUE(conta_id, versao) → conflito = escrita concorrente)`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Aplique CQRS nível 1 num projeto: comandos via agregados JPA, consultas via JdbcClient com SQL e records.",
    },
    {
      lvl: 2,
      text: "Implemente a conta bancária event-sourced com event store em PostgreSQL, controle de concorrência otimista e snapshot a cada 100 eventos.",
    },
    {
      lvl: 2,
      text: "Crie duas projeções a partir dos mesmos eventos: saldo atual e extrato mensal. Adicione uma terceira projeção nova e reconstrua do início.",
    },
    {
      lvl: 3,
      text: "Experimente o Axon Framework ou o EventStoreDB com um domínio de sua escolha e escreva um comparativo com a sua implementação manual.",
    },
  ],
  refs: [
    { t: "Martin Fowler: CQRS", u: "https://martinfowler.com/bliki/CQRS.html" },
    {
      t: "Martin Fowler: Event Sourcing",
      u: "https://martinfowler.com/eaaDev/EventSourcing.html",
    },
    {
      t: "Greg Young: Versioning in an Event Sourced System (livro gratuito)",
      u: "https://leanpub.com/esversioning/read",
    },
    { t: "Axon Framework", u: "https://www.axoniq.io/products/axon-framework" },
    { t: "EventStoreDB / Kurrent", u: "https://www.kurrent.io/" },
    {
      t: "Microsoft: CQRS pattern",
      u: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs",
    },
  ],
});

/* ============================ FASE 7 ============================ */

T({
  id: "escalabilidade",
  phase: "f7",
  title: "Escalabilidade e desempenho",
  level: "Avançado",
  hours: 20,
  summary:
    "Escala vertical e horizontal, serviços stateless, balanceamento, filas, rate limiting e lei de Little.",
  body: `
<h3>Os dois eixos</h3>
<p><strong>Vertical</strong>: máquina maior. Simples, tem teto e ponto único de falha. <strong>Horizontal</strong>: mais máquinas. Exige que o serviço seja <strong>stateless</strong>: sessão, uploads e caches compartilhados ficam fora da instância (Redis, S3, banco).</p>
<h3>Ferramentas de escala</h3>
<ul>
<li><strong>Balanceamento de carga</strong>: round robin, least connections, consistent hashing (para afinidade de cache). Camada 4 vs. camada 7.</li>
<li><strong>Filas para nivelar picos</strong>: aceite a requisição, enfileire e processe no ritmo que o sistema aguenta (queue-based load leveling).</li>
<li><strong>Rate limiting</strong>: token bucket, sliding window. Protege o sistema de abuso e de clientes defeituosos. Responda 429 com <code>Retry-After</code>.</li>
<li><strong>Backpressure</strong>: o consumidor sinaliza que está sobrecarregado em vez de aceitar tudo e cair.</li>
<li><strong>CDN</strong> para conteúdo estático e até respostas de API cacheáveis.</li>
<li><strong>Autoscaling</strong> por CPU, latência ou tamanho de fila (KEDA no Kubernetes).</li>
</ul>
<h3>Lei de Little: a conta que todo arquiteto deve saber</h3>
<p><strong>L = λ × W</strong>. Itens no sistema = taxa de chegada × tempo no sistema. Se chegam 1.000 req/s e cada uma leva 200 ms, há em média 200 requisições em andamento. Daí sai o tamanho de pools de threads e de conexões. Se o banco começar a demorar 2 s, você passa a precisar de 2.000 slots: é assim que uma lentidão vira uma queda.</p>
<h3>Desempenho: meça, não adivinhe</h3>
<p>Olhe percentis (p50, p95, p99), nunca a média: a média esconde os usuários que estão sofrendo. Use testes de carga (k6, Gatling) com cenários realistas e profilers (JFR, async-profiler) para achar gargalos.</p>
`,
  code: [
    {
      t: "Rate limiting com Bucket4j + Redis",
      src: `@Component
class LimitadorPorCliente implements HandlerInterceptor {
    private final ProxyManager<String> buckets;   // Bucket4j com Redis/Lettuce
    private final BucketConfiguration config = BucketConfiguration.builder()
        .addLimit(Bandwidth.builder().capacity(100).refillGreedy(100, Duration.ofMinutes(1)).build())
        .build();

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object h) {
        var chave = "rl:" + req.getHeader("X-Api-Key");
        var consumo = buckets.builder().build(chave, () -> config).tryConsumeAndReturnRemaining(1);
        if (consumo.isConsumed()) {
            res.setHeader("X-RateLimit-Remaining", String.valueOf(consumo.getRemainingTokens()));
            return true;
        }
        res.setStatus(429);
        res.setHeader("Retry-After", String.valueOf(consumo.getNanosToWaitForRefill() / 1_000_000_000));
        return false;
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Rode 3 instâncias da sua API atrás de um Nginx e prove que ela é stateless (derrube uma no meio de um teste de carga).",
    },
    {
      lvl: 2,
      text: "Use a lei de Little para dimensionar o pool do HikariCP de um serviço com 800 req/s e consultas de 15 ms. Valide com teste de carga.",
    },
    {
      lvl: 2,
      text: "Implemente rate limiting distribuído e prove que o limite vale para o cliente mesmo com 3 instâncias.",
    },
    {
      lvl: 3,
      text: "Faça um teste de carga com k6 que encontre o ponto de saturação do seu sistema. Identifique o gargalo com async-profiler e escreva um relatório de capacidade.",
    },
  ],
  refs: [
    {
      t: "The System Design Primer (Donne Martin)",
      u: "https://github.com/donnemartin/system-design-primer",
    },
    { t: "Bucket4j", u: "https://bucket4j.com/" },
    { t: "k6", u: "https://grafana.com/docs/k6/latest/" },
    {
      t: "async-profiler",
      u: "https://github.com/async-profiler/async-profiler",
    },
    {
      t: "Brendan Gregg: USE Method",
      u: "https://www.brendangregg.com/usemethod.html",
    },
    {
      t: "Livro: Systems Performance, 2ª ed. (Brendan Gregg)",
      u: "https://www.brendangregg.com/systems-performance-2nd-edition-book.html",
    },
  ],
});

T({
  id: "resiliencia",
  phase: "f7",
  title: "Resiliência: projetando para falhar bem",
  level: "Avançado",
  hours: 20,
  summary:
    "Timeouts, retries com backoff e jitter, circuit breaker, bulkhead, fallback e chaos engineering.",
  body: `
<p>Em sistemas distribuídos, falhas não são exceção: são o estado normal de alguma parte. O objetivo é impedir que a falha de um componente se espalhe em cascata. Michael Nygard, em <em>Release It!</em>, chama isso de construir sistemas que sobrevivem à produção.</p>
<h3>Os padrões essenciais</h3>
<dl class="defs">
<dt>Timeout</dt><dd>Toda chamada remota precisa de timeout. Sem ele, threads ficam presas para sempre esperando um serviço morto. É a causa número um de quedas em cascata.</dd>
<dt>Retry com backoff exponencial e jitter</dt><dd>Repita só erros transitórios e só operações idempotentes. Espere cada vez mais, com aleatoriedade, para não criar ondas sincronizadas de tráfego (thundering herd). Limite o total de tentativas e use orçamento de retries.</dd>
<dt>Circuit breaker</dt><dd>Depois de N falhas, "abre o circuito" e falha imediatamente por um tempo, dando fôlego ao serviço doente. Depois testa com poucas chamadas (meio aberto) antes de fechar.</dd>
<dt>Bulkhead</dt><dd>Compartimentos estanques, como num navio: pools de threads ou semáforos separados por dependência. Se o serviço de recomendações travar, ele esgota só o seu compartimento, não o servidor inteiro.</dd>
<dt>Fallback / degradação graciosa</dt><dd>Se recomendações falham, mostre os mais vendidos em cache. O usuário quase não nota.</dd>
<dt>Load shedding</dt><dd>Sob sobrecarga, recuse parte do tráfego cedo e barato em vez de atender tudo mal.</dd>
</dl>
<h3>Chaos engineering</h3>
<p>Injete falhas de propósito, de forma controlada, para descobrir fraquezas antes que a produção as revele. Comece em ambiente de teste com ferramentas como Toxiproxy (latência, quedas de conexão) e Chaos Monkey for Spring Boot.</p>
`,
  code: [
    {
      t: "Resilience4j com anotações no Spring",
      src: `@Service
class RecomendacoesServico {
    private final RecomendacoesClient client;
    private final Cache<ClienteId, List<Produto>> maisVendidos;

    @CircuitBreaker(name = "recomendacoes", fallbackMethod = "fallback")
    @Bulkhead(name = "recomendacoes", type = Bulkhead.Type.SEMAPHORE)
    @Retry(name = "recomendacoes")
    @TimeLimiter(name = "recomendacoes")
    public CompletableFuture<List<Produto>> para(ClienteId id) {
        return CompletableFuture.supplyAsync(() -> client.buscar(id));
    }

    private CompletableFuture<List<Produto>> fallback(ClienteId id, Throwable t) {
        return CompletableFuture.completedFuture(maisVendidos.topo(10));
    }
}`,
    },
    {
      t: "Configuração (application.yml)",
      src: `resilience4j:
  circuitbreaker.instances.recomendacoes:
    sliding-window-size: 50
    failure-rate-threshold: 50
    slow-call-duration-threshold: 500ms
    slow-call-rate-threshold: 80
    wait-duration-in-open-state: 20s
    permitted-number-of-calls-in-half-open-state: 5
  retry.instances.recomendacoes:
    max-attempts: 3
    wait-duration: 100ms
    enable-exponential-backoff: true
    enable-randomized-wait: true          # jitter
    retry-exceptions: [java.io.IOException]
  bulkhead.instances.recomendacoes:
    max-concurrent-calls: 20
  timelimiter.instances.recomendacoes:
    timeout-duration: 800ms`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Coloque Toxiproxy entre sua API e uma dependência. Injete 5 s de latência e observe sua API travar sem timeout. Corrija.",
    },
    {
      lvl: 2,
      text: "Configure circuit breaker e visualize as transições de estado no Grafana via métricas do Micrometer.",
    },
    {
      lvl: 2,
      text: "Demonstre o efeito do bulkhead: com e sem ele, uma dependência lenta afeta ou não endpoints que não a usam?",
    },
    {
      lvl: 3,
      text: "Planeje e execute um <em>game day</em>: 3 hipóteses de falha, experimentos, métricas observadas e um relatório de aprendizados.",
    },
  ],
  refs: [
    {
      t: "Livro: Release It!, 2ª ed. (Michael Nygard)",
      u: "https://pragprog.com/titles/mnee2/release-it-second-edition/",
      note: "leitura obrigatória",
    },
    { t: "Resilience4j", u: "https://resilience4j.readme.io/" },
    {
      t: "AWS Builders' Library: Timeouts, retries, and backoff with jitter",
      u: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
    },
    {
      t: "AWS Builders' Library: Using load shedding to avoid overload",
      u: "https://aws.amazon.com/builders-library/using-load-shedding-to-avoid-overload/",
    },
    { t: "Toxiproxy", u: "https://github.com/Shopify/toxiproxy" },
    {
      t: "Principles of Chaos Engineering",
      u: "https://principlesofchaos.org/",
    },
  ],
});

T({
  id: "observabilidade",
  phase: "f7",
  title: "Observabilidade e SRE",
  level: "Avançado",
  hours: 20,
  summary:
    "Logs, métricas e traces com OpenTelemetry, SLIs, SLOs, error budgets e alertas que importam.",
  body: `
<p>Monitoramento responde perguntas que você já sabia fazer ("a CPU está alta?"). Observabilidade permite responder perguntas novas sobre um comportamento que você nunca viu, a partir dos dados que o sistema emite. Em sistemas distribuídos, é a diferença entre resolver um incidente em 10 minutos ou em 10 horas.</p>
<h3>Os três sinais</h3>
<ul>
<li><strong>Logs estruturados</strong> (JSON) com <code>traceId</code> em cada linha. O Spring Boot tem suporte nativo a logs estruturados (formatos ECS, GELF, Logstash).</li>
<li><strong>Métricas</strong>: Micrometer → Prometheus. Use os métodos <strong>RED</strong> para serviços (Rate, Errors, Duration) e <strong>USE</strong> para recursos (Utilization, Saturation, Errors).</li>
<li><strong>Traces distribuídos</strong>: mostram o caminho de uma requisição por todos os serviços, com o tempo de cada trecho. Padrão aberto: <strong>OpenTelemetry</strong>.</li>
</ul>
<h3>SLI, SLO e error budget</h3>
<p>Do livro de SRE do Google:</p>
<ul>
<li><strong>SLI</strong>: um indicador medido do ponto de vista do usuário. "Porcentagem de requisições de checkout respondidas com sucesso em menos de 500 ms."</li>
<li><strong>SLO</strong>: a meta para o SLI. "99,5% em janelas de 28 dias."</li>
<li><strong>Error budget</strong>: o que sobra. 99,5% significa que 0,5% pode falhar (cerca de 3h20min em 28 dias). Se o orçamento acabou, o time prioriza confiabilidade em vez de features. Isso transforma uma briga política (velocidade vs. estabilidade) num acordo baseado em dados.</li>
</ul>
<p>Alerte sobre <strong>sintomas</strong> que afetam usuários (taxa de consumo do error budget), não sobre causas (CPU a 80%). Alertas que não exigem ação geram fadiga e são ignorados.</p>
`,
  code: [
    {
      t: "Spring Boot 4 + OpenTelemetry",
      src: `<!-- pom.xml -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-opentelemetry</artifactId>
</dependency>

# application.yml
management:
  tracing.sampling.probability: 0.1          # 10% em produção; ajuste ao volume
  otlp:
    tracing.endpoint: http://otel-collector:4318/v1/traces
    metrics.export.url: http://otel-collector:4318/v1/metrics
logging.structured.format.console: ecs`,
    },
    {
      t: "Métrica de negócio e span customizado",
      src: `@Service
class CheckoutServico {
    private final Counter pedidosFinalizados;
    private final ObservationRegistry observations;

    CheckoutServico(MeterRegistry reg, ObservationRegistry obs) {
        this.pedidosFinalizados = Counter.builder("loja.pedidos.finalizados")
            .description("Pedidos finalizados com sucesso").register(reg);
        this.observations = obs;
    }

    public void finalizar(Pedido p) {
        Observation.createNotStarted("checkout.finalizar", observations)
            .lowCardinalityKeyValue("meio_pagamento", p.meioPagamento().name())
            .observe(() -> {
                processar(p);
                pedidosFinalizados.increment();
            });
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Suba a stack Grafana LGTM (docker <code>grafana/otel-lgtm</code>) e envie logs, métricas e traces de duas aplicações Spring que se chamam. Siga um traceId do início ao fim.",
    },
    {
      lvl: 2,
      text: "Defina 3 SLOs para uma API de pedidos, implemente as queries PromQL e crie alertas de burn rate em múltiplas janelas.",
    },
    {
      lvl: 2,
      text: "Crie um dashboard RED para cada serviço e um painel de negócio (pedidos/minuto, ticket médio, taxa de recusa).",
    },
    {
      lvl: 3,
      text: "Simule um incidente (dependência lenta), investigue só pela observabilidade e escreva um postmortem sem culpados no formato do Google SRE.",
    },
  ],
  refs: [
    {
      t: "Livro: Site Reliability Engineering (Google, gratuito)",
      u: "https://sre.google/sre-book/table-of-contents/",
    },
    {
      t: "Livro: The Site Reliability Workbook (Google, gratuito)",
      u: "https://sre.google/workbook/table-of-contents/",
    },
    {
      t: "OpenTelemetry: Java",
      u: "https://opentelemetry.io/docs/languages/java/",
    },
    { t: "Micrometer", u: "https://docs.micrometer.io/micrometer/reference/" },
    {
      t: "Livro: Observability Engineering (Majors, Fong-Jones, Miranda)",
      u: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/",
    },
    {
      t: "grafana/otel-lgtm: stack local completa",
      u: "https://github.com/grafana/docker-otel-lgtm",
    },
  ],
});

/* ============================ FASE 8 ============================ */

T({
  id: "containers-k8s",
  phase: "f8",
  title: "Contêineres e Kubernetes",
  level: "Intermediário",
  hours: 30,
  summary:
    "Docker para Java, imagens enxutas, Kubernetes essencial, probes, recursos e configuração.",
  body: `
<p>Contêineres padronizam como o software é empacotado e executado. Kubernetes é o padrão de fato para orquestrá-los. Arquitetos não precisam ser administradores de cluster, mas precisam entender os conceitos para desenhar sistemas que funcionem bem neles.</p>
<h3>Docker para Java</h3>
<ul>
<li>Use imagens base enxutas e mantidas (Eclipse Temurin, distroless).</li>
<li><strong>Camadas</strong>: dependências mudam pouco, seu código muda muito. Separe-as para aproveitar cache (o Spring Boot gera JARs em camadas; ou use Buildpacks: <code>./mvnw spring-boot:build-image</code>).</li>
<li>Rode como usuário não root.</li>
<li>Considere CDS/AOT cache para acelerar a inicialização, ou GraalVM native image quando startup e memória forem críticos.</li>
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
<p><strong>Liveness</strong> diz se o processo deve ser reiniciado; <strong>readiness</strong> diz se pode receber tráfego. Erro clássico: liveness que verifica o banco. Se o banco cai, o Kubernetes reinicia todos os pods em loop, o que não ajuda em nada. Liveness verifica só o próprio processo; dependências entram, com cuidado, na readiness. O Actuator expõe <code>/actuator/health/liveness</code> e <code>/readiness</code> separados.</p>
`,
  code: [
    {
      t: "Dockerfile multi-stage para Spring Boot",
      src: `FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw -q package -DskipTests && \\
    java -Djarmode=tools -jar target/*.jar extract --layers --launcher --destination extraido

FROM eclipse-temurin:25-jre
RUN useradd -r -u 1001 app
USER app
WORKDIR /app
COPY --from=build /app/extraido/dependencies/ ./
COPY --from=build /app/extraido/spring-boot-loader/ ./
COPY --from=build /app/extraido/snapshot-dependencies/ ./
COPY --from=build /app/extraido/application/ ./
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "org.springframework.boot.loader.launch.JarLauncher"]`,
    },
    {
      t: "Deployment com probes e recursos",
      src: `apiVersion: apps/v1
kind: Deployment
metadata: { name: pedidos }
spec:
  replicas: 3
  selector: { matchLabels: { app: pedidos } }
  template:
    metadata: { labels: { app: pedidos } }
    spec:
      containers:
        - name: app
          image: registry.exemplo/pedidos:1.4.2
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: "500m", memory: "768Mi" }
            limits:   { memory: "768Mi" }      # sem limit de CPU evita throttling
          readinessProbe:
            httpGet: { path: /actuator/health/readiness, port: 8080 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /actuator/health/liveness, port: 8080 }
            initialDelaySeconds: 30
          lifecycle:
            preStop: { sleep: { seconds: 10 } }   # drena conexões no rolling update`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Crie a imagem da sua API com Dockerfile multi-stage e com Buildpacks. Compare tamanho e tempo de build.",
    },
    {
      lvl: 2,
      text: "Rode sua aplicação num cluster local (kind ou k3d) com Deployment, Service, Ingress, ConfigMap e Secret. Faça um rolling update sem erros sob carga.",
    },
    {
      lvl: 2,
      text: "Configure HPA por CPU e observe o escalonamento durante um teste de carga.",
    },
    {
      lvl: 3,
      text: "Empacote os 3 serviços do projeto final com Helm ou Kustomize, com valores diferentes para dev e produção.",
    },
  ],
  refs: [
    { t: "Kubernetes: documentação", u: "https://kubernetes.io/docs/home/" },
    {
      t: "Spring Boot: Kubernetes probes",
      u: "https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.kubernetes-probes",
    },
    {
      t: "Spring Boot: Container Images",
      u: "https://docs.spring.io/spring-boot/reference/packaging/container-images/index.html",
    },
    {
      t: "Livro: Kubernetes Patterns, 2ª ed. (Ibryam & Huß)",
      u: "https://k8spatterns.com/",
    },
    { t: "kind", u: "https://kind.sigs.k8s.io/" },
    { t: "roadmap.sh: Kubernetes", u: "https://roadmap.sh/kubernetes" },
  ],
});

T({
  id: "cicd-iac",
  phase: "f8",
  title: "CI/CD, infraestrutura como código e cloud",
  level: "Intermediário",
  hours: 25,
  summary:
    "Pipelines, estratégias de deploy, métricas DORA, Twelve-Factor, Terraform e os pilares Well-Architected.",
  body: `
<h3>Entrega contínua</h3>
<p>Cada commit no trunk passa por um pipeline que compila, testa, analisa e gera um artefato implantável. A meta é que o deploy seja um evento entediante e frequente. As <strong>métricas DORA</strong> medem isso: frequência de deploy, lead time de mudança, taxa de falha de mudança e tempo de recuperação. A pesquisa do DORA mostra que velocidade e estabilidade andam juntas, não em oposição.</p>
<h3>Estratégias de deploy</h3>
<ul>
<li><strong>Rolling</strong>: troca instâncias aos poucos. Padrão do Kubernetes.</li>
<li><strong>Blue/green</strong>: dois ambientes completos; troca o tráfego de uma vez; rollback instantâneo.</li>
<li><strong>Canary</strong>: libera para 1%, 5%, 25%... observando métricas. Ferramentas: Argo Rollouts, Flagger.</li>
<li><strong>Feature flags</strong>: separam <em>deploy</em> (código em produção) de <em>release</em> (funcionalidade ligada). OpenFeature é o padrão aberto.</li>
</ul>
<h3>Twelve-Factor App</h3>
<p>Doze práticas para aplicações nativas de nuvem: uma base de código, dependências explícitas, configuração no ambiente, serviços de apoio como recursos anexáveis, build/release/run separados, processos stateless, port binding, concorrência por processos, descartabilidade (startup rápido, shutdown gracioso), paridade entre ambientes, logs como fluxo de eventos, tarefas administrativas como processos pontuais.</p>
<h3>Infraestrutura como código e cloud</h3>
<p>Infraestrutura descrita em código versionado (Terraform/OpenTofu, Pulumi, AWS CDK): revisável, reproduzível e auditável. Na nuvem, estude os <strong>pilares Well-Architected</strong> (excelência operacional, segurança, confiabilidade, eficiência de desempenho, otimização de custos, sustentabilidade). As certificações de arquiteto de solução de AWS, Azure ou GCP são um bom roteiro estruturado e têm peso no mercado.</p>
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
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '25', cache: maven }
      - name: Testes unitários, integração (Testcontainers) e arquitetura
        run: ./mvnw -B verify
      - name: Análise de vulnerabilidades em dependências
        run: ./mvnw -B org.owasp:dependency-check-maven:check -DfailBuildOnCVSS=7
      - name: Imagem
        if: github.ref == 'refs/heads/main'
        run: ./mvnw -B spring-boot:build-image -Dspring-boot.build-image.imageName=ghcr.io/\${{ github.repository }}:\${{ github.sha }}`,
    },
    {
      t: "Terraform: banco gerenciado",
      src: `resource "aws_db_instance" "pedidos" {
  identifier              = "pedidos-prod"
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
    {
      lvl: 1,
      text: "Crie um pipeline completo no GitHub Actions para seu projeto: build, testes, ArchUnit, análise de dependências e publicação de imagem.",
    },
    {
      lvl: 2,
      text: "Implemente um canary com Argo Rollouts num cluster kind, com rollback automático baseado em taxa de erro do Prometheus.",
    },
    {
      lvl: 2,
      text: "Avalie um projeto seu contra os 12 fatores e corrija os 3 piores.",
    },
    {
      lvl: 3,
      text: "Provisione com Terraform a infraestrutura do projeto final (rede, cluster ou ECS, banco, fila) e estime o custo mensal com a calculadora da AWS. Escreva um ADR com as decisões de custo.",
    },
  ],
  refs: [
    { t: "The Twelve-Factor App", u: "https://12factor.net/pt_br/" },
    { t: "DORA: State of DevOps e métricas", u: "https://dora.dev/" },
    {
      t: "Livro: Accelerate (Forsgren, Humble, Kim)",
      u: "https://itrevolution.com/product/accelerate/",
    },
    {
      t: "Livro: Continuous Delivery (Humble & Farley)",
      u: "https://continuousdelivery.com/",
    },
    {
      t: "AWS Well-Architected Framework",
      u: "https://aws.amazon.com/architecture/well-architected/",
    },
    { t: "OpenTofu / Terraform", u: "https://opentofu.org/docs/" },
    { t: "OpenFeature", u: "https://openfeature.dev/" },
    {
      t: "FinOps Foundation",
      u: "https://www.finops.org/introduction/what-is-finops/",
    },
  ],
});

T({
  id: "seguranca",
  phase: "f8",
  title: "Segurança por design",
  level: "Avançado",
  hours: 25,
  summary:
    "OWASP Top 10, modelagem de ameaças, OAuth 2.1/OIDC com Spring Security, segredos, zero trust e LGPD.",
  body: `
<p>Segurança não se adiciona no final: ela nasce no desenho. Uma decisão de arquitetura (onde ficam os dados sensíveis, quem confia em quem, por onde entra o tráfego) define a superfície de ataque muito mais do que qualquer biblioteca.</p>
<h3>Fundamentos</h3>
<ul>
<li><strong>OWASP Top 10</strong>: controle de acesso quebrado (o mais comum), falhas criptográficas, injeção, design inseguro, configuração incorreta, componentes vulneráveis, falhas de autenticação, falhas de integridade, falhas de logging, SSRF. Conheça cada um com exemplo em Java.</li>
<li><strong>Defesa em profundidade</strong>: várias camadas; nenhuma é suficiente sozinha.</li>
<li><strong>Menor privilégio</strong>: cada serviço, usuário e credencial com o mínimo necessário.</li>
<li><strong>Zero trust</strong>: estar na rede interna não dá confiança; toda chamada é autenticada e autorizada (mTLS entre serviços, tokens com escopo).</li>
</ul>
<h3>Modelagem de ameaças</h3>
<p>Antes de construir, pergunte: o que estamos construindo? O que pode dar errado? O que vamos fazer a respeito? Fizemos um bom trabalho? Use <strong>STRIDE</strong> (Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege) sobre o diagrama C4 de contêineres.</p>
<h3>Identidade: OAuth 2.1 e OpenID Connect</h3>
<p>Não construa autenticação do zero. Use um provedor de identidade (Keycloak, Auth0, Cognito, Entra ID). Fluxos: <em>Authorization Code + PKCE</em> para apps de usuário; <em>Client Credentials</em> para serviço a serviço. Sua API é um <em>resource server</em> que valida JWTs. Para SPAs, considere o padrão <strong>BFF</strong>: tokens ficam no servidor, o navegador só tem um cookie de sessão seguro.</p>
<h3>Dados e conformidade</h3>
<p>Criptografia em trânsito (TLS) e em repouso; segredos num cofre (Vault, AWS Secrets Manager), nunca no Git; mascaramento em logs. A <strong>LGPD</strong> exige base legal, minimização de dados, direitos do titular (acesso, exclusão) e registro de operações: isso afeta modelagem de dados e retenção desde o primeiro dia.</p>
`,
  code: [
    {
      t: "Resource server com Spring Security",
      src: `@Configuration
@EnableMethodSecurity
class SegurancaConfig {
    @Bean
    SecurityFilterChain api(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/produtos/**").hasAuthority("SCOPE_catalogo:ler")
                .requestMatchers("/pedidos/**").hasAuthority("SCOPE_pedidos")
                .anyRequest().authenticated())
            .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }
}

# application.yml
spring.security.oauth2.resourceserver.jwt.issuer-uri: https://auth.loja.exemplo/realms/loja`,
    },
    {
      t: "Autorização no nível do objeto (evita o erro nº 1 do OWASP)",
      src: `@GetMapping("/pedidos/{id}")
@PreAuthorize("@donoDoPedido.verificar(#id, authentication)")
PedidoResposta buscar(@PathVariable UUID id) { /* ... */ }

@Component("donoDoPedido")
class DonoDoPedido {
    boolean verificar(UUID pedidoId, Authentication auth) {
        // Sem isso, qualquer usuário logado lê o pedido de outro trocando o ID (IDOR)
        return pedidos.clienteDe(pedidoId).map(c -> c.equals(auth.getName())).orElse(false);
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Resolva os módulos de Java do <strong>OWASP WebGoat</strong>: injeção SQL, controle de acesso, XSS e JWT.",
    },
    {
      lvl: 2,
      text: "Suba Keycloak, proteja sua API como resource server e crie um BFF com Spring Cloud Gateway + OAuth2 Client para um front-end.",
    },
    {
      lvl: 2,
      text: "Faça modelagem de ameaças STRIDE do seu projeto final sobre o diagrama C4 de contêineres. Liste 10 ameaças e mitigações.",
    },
    {
      lvl: 3,
      text: "Adicione ao pipeline: SAST (Semgrep ou SpotBugs + FindSecBugs), SCA (Dependency-Check), varredura de imagem (Trivy) e de segredos (Gitleaks). Gere um SBOM com CycloneDX.",
    },
  ],
  refs: [
    { t: "OWASP Top 10", u: "https://owasp.org/www-project-top-ten/" },
    {
      t: "OWASP ASVS",
      u: "https://owasp.org/www-project-application-security-verification-standard/",
    },
    { t: "OWASP WebGoat", u: "https://owasp.org/www-project-webgoat/" },
    {
      t: "Spring Security Reference",
      u: "https://docs.spring.io/spring-security/reference/",
    },
    { t: "OAuth 2.1 (draft)", u: "https://oauth.net/2.1/" },
    {
      t: "Threat Modeling Manifesto",
      u: "https://www.threatmodelingmanifesto.org/",
    },
    {
      t: "Livro: Secure by Design (Johnsson, Deogun, Sawano)",
      u: "https://www.manning.com/books/secure-by-design",
      note: "une DDD e segurança",
    },
    {
      t: "LGPD: Lei nº 13.709/2018",
      u: "https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm",
    },
  ],
});
/* ============================ FASE 9 ============================ */

T({
  id: "evolutiva",
  phase: "f9",
  title: "Arquitetura evolutiva e governança",
  level: "Avançado",
  hours: 15,
  summary:
    "Fitness functions, governança automatizada, dívida técnica e modernização de legados.",
  body: `
<p>Nenhuma arquitetura sobrevive intacta ao contato com a realidade. Requisitos mudam, tecnologias envelhecem, times crescem. A pergunta de um arquiteto maduro não é "qual a arquitetura certa?", mas "como ela vai mudar com segurança?".</p>
<h3>Fitness functions</h3>
<p>Conceito de <em>Building Evolutionary Architectures</em> (Ford, Parsons, Kua, Sadalage): qualquer mecanismo que avalia objetivamente o quanto a arquitetura preserva uma característica. Exemplos:</p>
<ul>
<li>Teste ArchUnit: "o domínio não depende de infraestrutura".</li>
<li>Teste Spring Modulith: "nenhum ciclo entre módulos".</li>
<li>Gatling no pipeline: "p99 do checkout abaixo de 400 ms".</li>
<li>Dependency-Check: "nenhuma dependência com CVSS ≥ 7".</li>
<li>Alerta de produção: "error budget do SLO consumido a menos de 2x".</li>
</ul>
<p>Fitness functions transformam governança de arquitetura, antes feita por comitês e revisões manuais, em <strong>verificação contínua e automática</strong>. O arquiteto deixa de ser fiscal e passa a definir as regras que o pipeline fiscaliza.</p>
<h3>Dívida técnica</h3>
<p>Use o quadrante de Fowler: dívida <em>deliberada</em> ou <em>inadvertida</em>, <em>prudente</em> ou <em>imprudente</em>. "Vamos lançar agora e refatorar depois, sabendo o custo" é prudente e deliberada. Torne a dívida visível (registro, ADRs, impacto em métricas) e negocie com o produto em termos de negócio: tempo de entrega, incidentes, custo.</p>
<h3>Modernização de legados</h3>
<p>Strangler Fig, Branch by Abstraction, Parallel Run (o novo roda em paralelo e compara resultados com o antigo antes de assumir) e Event Interception. Nunca a reescrita total "big bang", que costuma levar o dobro do tempo previsto enquanto o sistema antigo continua mudando.</p>
`,
  code: [
    {
      t: "Fitness function de dependência entre módulos e ciclos",
      src: `@AnalyzeClasses(packages = "com.loja")
class FitnessFunctions {
    @ArchTest
    static final ArchRule sem_ciclos = slices().matching("com.loja.(*)..")
        .should().beFreeOfCycles();

    @ArchTest
    static final ArchRule controllers_nao_usam_repositorios =
        noClasses().that().haveSimpleNameEndingWith("Controller")
            .should().dependOnClassesThat().haveSimpleNameEndingWith("Repository")
            .because("ADR-0004: controllers chamam casos de uso, nunca persistência");
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Escreva 5 fitness functions para o seu projeto final cobrindo estrutura, desempenho e segurança, todas rodando no CI.",
    },
    {
      lvl: 2,
      text: "Use Parallel Run (com a biblioteca Scientist4J ou implementação própria) para comparar um cálculo antigo e um novo em produção simulada.",
    },
    {
      lvl: 3,
      text: "Escreva um plano de modernização de 12 meses para um monolito legado fictício de 10 anos: fases, riscos, fitness functions de cada fase e critérios de sucesso.",
    },
  ],
  refs: [
    {
      t: "Livro: Building Evolutionary Architectures, 2ª ed.",
      u: "https://evolutionaryarchitecture.com/",
    },
    {
      t: "Martin Fowler: Technical Debt Quadrant",
      u: "https://martinfowler.com/bliki/TechnicalDebtQuadrant.html",
    },
    {
      t: "Martin Fowler: Branch By Abstraction",
      u: "https://martinfowler.com/bliki/BranchByAbstraction.html",
    },
    {
      t: "Thoughtworks Technology Radar",
      u: "https://www.thoughtworks.com/radar",
      note: "leia toda edição, duas vezes por ano",
    },
    {
      t: "Livro: Kill It with Fire (Marianne Bellotti)",
      u: "https://nostarch.com/kill-it-fire",
      note: "modernização de legados com pragmatismo",
    },
  ],
});

T({
  id: "times",
  phase: "f9",
  title: "Times, organização e a Lei de Conway",
  level: "Avançado",
  hours: 12,
  summary:
    "Sociotécnica: Team Topologies, carga cognitiva e por que a estrutura dos times molda a arquitetura.",
  body: `
<p><strong>Lei de Conway</strong> (1968): organizações que desenham sistemas produzem desenhos que copiam suas estruturas de comunicação. Se três times constroem um compilador, sai um compilador de três passos. Isso não é opinião: é uma das observações mais confirmadas da engenharia de software.</p>
<p>A consequência prática é a <strong>manobra inversa de Conway</strong>: se você quer uma arquitetura, organize os times de acordo com ela. Arquiteto que desenha microsserviços sem mexer nos times vai ver o desenho ser deformado pela organização real.</p>
<h3>Team Topologies</h3>
<p>Matthew Skelton e Manuel Pais propõem quatro tipos de time e três modos de interação:</p>
<table class="tbl"><thead><tr><th>Tipo de time</th><th>Papel</th></tr></thead><tbody>
<tr><td>Stream-aligned</td><td>Alinhado a um fluxo de valor de negócio, entrega ponta a ponta. A maioria dos times.</td></tr>
<tr><td>Platform</td><td>Oferece serviços internos self-service que reduzem a carga dos stream-aligned.</td></tr>
<tr><td>Enabling</td><td>Especialistas que ajudam outros times a adquirir uma capacidade e depois saem.</td></tr>
<tr><td>Complicated-subsystem</td><td>Cuida de uma parte que exige conhecimento muito especializado (motor de cálculo, vídeo).</td></tr>
</tbody></table>
<p>Modos de interação: <em>colaboração</em> (temporária, para descobrir), <em>X-as-a-Service</em> (consumo com fronteira clara), <em>facilitação</em> (ensinar).</p>
<h3>Carga cognitiva</h3>
<p>O tamanho e as responsabilidades de um serviço devem caber na capacidade cognitiva de um time. Se um time precisa entender 12 serviços, Kafka, Kubernetes e três bancos diferentes para entregar uma feature, a arquitetura falhou, mesmo que o diagrama esteja bonito. Plataformas internas (platform engineering) existem para reduzir essa carga.</p>
`,
  code: [],
  exercises: [
    {
      lvl: 1,
      text: "Desenhe a estrutura de times de uma empresa que você conhece e o sistema que ela produz. Encontre onde a Lei de Conway aparece.",
    },
    {
      lvl: 2,
      text: "Para o e-commerce dos exercícios de DDD, proponha a topologia de times (tipos e interações) alinhada aos bounded contexts.",
    },
    {
      lvl: 3,
      text: "Avalie a carga cognitiva de um time real com o questionário do Team Topologies e proponha mudanças de arquitetura ou de plataforma para reduzi-la.",
    },
  ],
  refs: [
    {
      t: "Livro: Team Topologies (Skelton & Pais)",
      u: "https://teamtopologies.com/book",
    },
    {
      t: "Melvin Conway: How Do Committees Invent? (1968)",
      u: "https://www.melconway.com/Home/Committees_Paper.html",
    },
    {
      t: "Martin Fowler: Conway's Law",
      u: "https://martinfowler.com/bliki/ConwaysLaw.html",
    },
    {
      t: "Livro: Architecture for Flow (Susanne Kaiser)",
      u: "https://www.oreilly.com/library/view/architecture-for-flow/9780137393084/",
      note: "une Wardley Maps, DDD e Team Topologies",
    },
    {
      t: "Wardley Maps (Simon Wardley, livro gratuito)",
      u: "https://medium.com/wardleymaps",
    },
  ],
});

T({
  id: "soft-skills",
  phase: "f9",
  title: "Liderança técnica e comunicação",
  level: "Avançado",
  hours: 15,
  summary:
    "Influência sem autoridade, negociação, apresentação para executivos, mentoria e escrita técnica.",
  body: `
<p>A maior parte dos arquitetos que falham não falha por falta de conhecimento técnico. Falha porque não consegue convencer, alinhar e conduzir pessoas. Arquiteto raramente tem autoridade formal sobre os times: precisa de <strong>influência</strong>.</p>
<h3>Habilidades que diferenciam</h3>
<ul>
<li><strong>Escrita técnica</strong>: ADRs, RFCs e documentos de design claros. Empresas como Amazon e Google tomam decisões por documentos escritos. Escrever bem é pensar bem.</li>
<li><strong>Adaptar a mensagem ao público</strong>: executivos querem risco, custo, prazo e impacto no negócio; desenvolvedores querem o como e o porquê; produto quer o que muda para o usuário. A mesma decisão, três narrativas.</li>
<li><strong>Negociação</strong>: com produto (escopo vs. qualidade), com outros arquitetos (padrões), com desenvolvedores (por que esta restrição existe). Ofereça alternativas com trade-offs explícitos em vez de "sim" ou "não".</li>
<li><strong>Facilitação</strong>: conduzir workshops (Event Storming, risk storming), reuniões de decisão e revisões de design sem dominar a conversa.</li>
<li><strong>Mentoria</strong>: elevar o nível do time é o maior multiplicador de impacto que você tem.</li>
<li><strong>Visão de negócio</strong>: ler um balanço básico, entender modelo de receita, saber de onde vem o dinheiro que paga o sistema.</li>
</ul>
<h3>O caminho Staff/Principal</h3>
<p>Em muitas empresas, a carreira técnica sênior passa por Staff e Principal Engineer, papéis com escopo de arquitetura. Will Larson descreve quatro arquétipos: <em>Tech Lead</em>, <em>Architect</em>, <em>Solver</em> e <em>Right Hand</em>. Entender esses papéis ajuda a escolher onde você quer chegar.</p>
<div class="callout"><b>Elevador do arquiteto</b> (Gregor Hohpe): o arquiteto eficaz transita entre a "cobertura" (executivos, estratégia) e a "sala de máquinas" (código, operação), traduzindo em cada andar. Quem só fica num andar perde a utilidade.</div>
`,
  code: [],
  exercises: [
    {
      lvl: 1,
      text: "Escreva um documento de design (RFC) de 3 páginas para uma mudança real ou fictícia: contexto, objetivos e não objetivos, proposta, alternativas, riscos, plano de rollout.",
    },
    {
      lvl: 2,
      text: "Apresente a mesma decisão (migrar para o monolito modular, por exemplo) em 5 minutos para um executivo e em 15 para desenvolvedores. Peça feedback de cada público.",
    },
    {
      lvl: 2,
      text: "Mentore alguém mais júnior por 4 semanas num tópico desta trilha. Ensinar é a forma mais rápida de descobrir o que você ainda não entendeu.",
    },
    {
      lvl: 3,
      text: "Escreva um artigo técnico público (blog, dev.to, LinkedIn) por mês sobre o que você está estudando. Em um ano, isso vira portfólio e reputação.",
    },
  ],
  refs: [
    {
      t: "Livro: The Software Architect Elevator (Gregor Hohpe)",
      u: "https://architectelevator.com/book/",
    },
    {
      t: "Livro: Staff Engineer (Will Larson)",
      u: "https://staffeng.com/book",
    },
    { t: "staffeng.com: histórias e guias", u: "https://staffeng.com/" },
    {
      t: "Livro: The Staff Engineer's Path (Tanya Reilly)",
      u: "https://www.oreilly.com/library/view/the-staff-engineers/9781098118723/",
    },
    {
      t: "Livro: Head First Software Architecture (Gandhi, Richards, Ford)",
      u: "https://www.oreilly.com/library/view/head-first-software/9781098134341/",
    },
    {
      t: "Gergely Orosz: The Pragmatic Engineer",
      u: "https://newsletter.pragmaticengineer.com/",
    },
  ],
});

T({
  id: "system-design",
  phase: "f9",
  title: "System design na prática",
  level: "Avançado",
  hours: 40,
  summary:
    "Um método para desenhar sistemas do zero, estimativas de capacidade e estudos de caso clássicos.",
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
public final class Base62 {
    private static final char[] ALFABETO =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

    public static String codificar(long n) {
        if (n == 0) return "0";
        var sb = new StringBuilder();
        while (n > 0) { sb.append(ALFABETO[(int) (n % 62)]); n /= 62; }
        return sb.reverse().toString();
    }
}
// 62^7 ≈ 3,5 trilhões de URLs com 7 caracteres.
// Trade-off: IDs sequenciais são previsíveis (alguém pode enumerar links).
// Alternativa: embaralhar o ID com uma permutação reversível (ex.: Feistel) antes de codificar.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Resolva os 3 primeiros estudos de caso no papel com o método de 6 passos, 45 minutos cada. Depois compare com soluções publicadas.",
    },
    {
      lvl: 2,
      text: "Implemente o encurtador de URL de verdade: Spring Boot, PostgreSQL, Redis de cache, rate limiting, métricas. Faça teste de carga a 2.000 req/s.",
    },
    {
      lvl: 2,
      text: "Leia 10 artigos de blogs de engenharia (lista nas referências) e escreva um resumo de uma página para cada um.",
    },
    {
      lvl: 3,
      text: "Faça 10 simulações de entrevista de system design com outra pessoa (ou grave-se), alternando os papéis. Use os casos 4 a 10.",
    },
  ],
  refs: [
    {
      t: "The System Design Primer",
      u: "https://github.com/donnemartin/system-design-primer",
    },
    {
      t: "Livro: System Design Interview, vol. 1 e 2 (Alex Xu)",
      u: "https://bytebytego.com/",
    },
    {
      t: "ByteByteGo (newsletter e diagramas)",
      u: "https://blog.bytebytego.com/",
    },
    {
      t: "High Scalability: arquiteturas reais",
      u: "https://highscalability.com/",
    },
    { t: "Netflix Tech Blog", u: "https://netflixtechblog.com/" },
    { t: "Uber Engineering", u: "https://www.uber.com/blog/engineering/" },
    {
      t: "Discord: How Discord Stores Trillions of Messages",
      u: "https://discord.com/blog/how-discord-stores-trillions-of-messages",
    },
    {
      t: "Building Nubank (blog de engenharia)",
      u: "https://building.nubank.com/",
    },
    {
      t: "InfoQ: palestras e artigos de arquitetura",
      u: "https://www.infoq.com/architecture-design/",
    },
    {
      t: "Azure Architecture Center: estilos e padrões de nuvem",
      u: "https://learn.microsoft.com/en-us/azure/architecture/",
    },
  ],
});

T({
  id: "ia",
  phase: "f9",
  title: "IA na arquitetura de software",
  level: "Avançado",
  hours: 15,
  summary:
    "Arquitetar sistemas com LLMs (RAG, agentes, avaliação) usando Spring AI, e usar IA como ferramenta do arquiteto.",
  body: `
<p>Dois assuntos diferentes, ambos obrigatórios em 2026: <strong>arquitetar sistemas que usam IA</strong> e <strong>usar IA no trabalho de arquitetura</strong>. A 2ª edição de <em>Fundamentals of Software Architecture</em> ganhou material sobre IA generativa justamente por isso.</p>
<h3>Sistemas com LLMs: novas características de arquitetura</h3>
<ul>
<li><strong>Não determinismo</strong>: a mesma entrada pode gerar saídas diferentes. Testes viram <em>avaliações</em> (evals) com conjuntos de casos e critérios.</li>
<li><strong>Custo por requisição</strong> e <strong>latência</strong> altos e variáveis: cache semântico, modelos menores para tarefas simples, roteamento entre modelos.</li>
<li><strong>Qualidade dos dados</strong>: em RAG (Retrieval-Augmented Generation), o resultado depende da busca. Chunking, embeddings, busca híbrida e reranking são decisões de arquitetura.</li>
<li><strong>Segurança</strong>: prompt injection, vazamento de dados, permissões de ferramentas. Veja o OWASP Top 10 para LLMs.</li>
<li><strong>Agentes e ferramentas</strong>: LLMs chamando APIs via function calling ou MCP (Model Context Protocol). Exige autorização cuidadosa e limites de ação.</li>
<li><strong>Observabilidade</strong>: tokens, custo, latência e qualidade por chamada.</li>
</ul>
<h3>No ecossistema Java</h3>
<p><strong>Spring AI</strong> oferece abstrações para modelos de vários provedores, vector stores (inclusive pgvector no PostgreSQL), RAG, function calling, MCP e observabilidade integrada ao Micrometer. <strong>LangChain4j</strong> é a alternativa mais conhecida.</p>
<h3>IA como ferramenta do arquiteto</h3>
<p>Use assistentes para gerar alternativas de desenho, revisar ADRs procurando consequências esquecidas, explicar código legado, escrever provas de conceito rápidas. A responsabilidade pela decisão continua sendo sua: trate as sugestões como de um colega muito rápido que às vezes erra com confiança.</p>
`,
  code: [
    {
      t: "RAG com Spring AI e pgvector",
      src: `@Service
class AssistenteDocumentacao {
    private final ChatClient chat;

    AssistenteDocumentacao(ChatClient.Builder builder, VectorStore vetores) {
        this.chat = builder
            .defaultSystem("""
                Responda só com base nos documentos de arquitetura fornecidos.
                Se a resposta não estiver neles, diga que não sabe.
                Cite o ADR de onde tirou a informação.""")
            .defaultAdvisors(QuestionAnswerAdvisor.builder(vetores)
                .searchRequest(SearchRequest.builder().topK(5).similarityThreshold(0.6).build())
                .build())
            .build();
    }

    public String perguntar(String pergunta) {
        return chat.prompt().user(pergunta).call().content();
    }
}

// Ingestão: ler os ADRs (docs/adr/*.md), dividir em pedaços e indexar
List<Document> docs = new TokenTextSplitter().apply(new MarkdownDocumentReader(adrs).get());
vectorStore.add(docs);`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Construa o assistente acima indexando os ADRs e a documentação arc42 do seu projeto final. Pergunte coisas que estão e que não estão nos documentos.",
    },
    {
      lvl: 2,
      text: "Crie um conjunto de 30 perguntas com respostas esperadas e meça a qualidade do RAG ao mudar tamanho de chunk, topK e modelo. Registre num ADR a configuração escolhida.",
    },
    {
      lvl: 3,
      text: "Exponha um caso de uso do seu sistema como ferramenta MCP com Spring AI. Faça modelagem de ameaças do que pode dar errado quando um agente a chama.",
    },
  ],
  refs: [
    {
      t: "Spring AI Reference",
      u: "https://docs.spring.io/spring-ai/reference/",
    },
    { t: "LangChain4j", u: "https://docs.langchain4j.dev/" },
    {
      t: "OWASP Top 10 for LLM Applications",
      u: "https://genai.owasp.org/llm-top-10/",
    },
    { t: "Model Context Protocol", u: "https://modelcontextprotocol.io/" },
    { t: "pgvector", u: "https://github.com/pgvector/pgvector" },
    {
      t: "Livro: AI Engineering (Chip Huyen)",
      u: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/",
    },
  ],
});

/* ============================ PROJETO FINAL ============================ */

var CAPSTONE = {
  title: "Projeto final: plataforma de marketplace",
  intro:
    "Um único projeto que cresce junto com você, fase após fase. No fim, ele é seu portfólio: código, ADRs, diagramas C4, dashboards e um texto contando a evolução. Recrutadores e bancas de entrevista valorizam muito mais um sistema que evoluiu com decisões registradas do que dez tutoriais.",
  steps: [
    {
      f: "f0–f1",
      t: "Núcleo de domínio",
      d: "Catálogo, carrinho e pedido em Java puro, com sealed types, value objects e 90% de cobertura com mutation testing.",
    },
    {
      f: "f2",
      t: "API e persistência",
      d: "Spring Boot 4, PostgreSQL, Flyway, OpenAPI design-first, Problem Details, idempotência e Testcontainers.",
    },
    {
      f: "f3",
      t: "Documentação viva",
      d: "Pasta docs/adr com os primeiros 5 ADRs, C4 níveis 1 e 2 em Structurizr DSL, arc42 enxuto e 5 cenários de atributo de qualidade.",
    },
    {
      f: "f4",
      t: "Monolito modular",
      d: "Módulos pedidos, catálogo, estoque, pagamentos e notificações com Spring Modulith, eventos duráveis e verificação no CI.",
    },
    {
      f: "f5",
      t: "DDD",
      d: "Event Storming do checkout, context map, agregados redesenhados e uma Anticorruption Layer para um 'ERP' simulado.",
    },
    {
      f: "f6",
      t: "Distribuição",
      d: "Extrair pagamentos e notificações como serviços; outbox com Debezium; saga de checkout com Temporal; projeção de busca em OpenSearch (CQRS).",
    },
    {
      f: "f7",
      t: "Produção de verdade",
      d: "Resilience4j, rate limiting, OpenTelemetry com Grafana, 3 SLOs com alertas de burn rate, teste de carga e um game day documentado.",
    },
    {
      f: "f8",
      t: "Entrega e segurança",
      d: "Kubernetes (kind), Helm, pipeline com SAST/SCA/Trivy, canary com Argo Rollouts, Keycloak com BFF, STRIDE e Terraform para a nuvem.",
    },
    {
      f: "f9",
      t: "Fora da curva",
      d: "Fitness functions completas, assistente de arquitetura com Spring AI sobre os seus ADRs, um artigo público por fase e uma apresentação de 20 minutos da evolução do sistema.",
    },
  ],
};

var BOOKS = [
  {
    t: "Fundamentals of Software Architecture, 2ª ed.",
    a: "Mark Richards, Neal Ford",
    f: "f3",
    why: "A base do papel de arquiteto: características, estilos, decisões e soft skills.",
  },
  {
    t: "Designing Data-Intensive Applications, 2ª ed.",
    a: "Martin Kleppmann, Chris Riccomini",
    f: "f6",
    why: "O livro sobre dados e sistemas distribuídos. A 2ª edição saiu em 2026.",
  },
  {
    t: "Software Architecture: The Hard Parts",
    a: "Ford, Richards, Sadalage, Dehghani",
    f: "f4",
    why: "Granularidade de serviços, dados distribuídos, sagas. Decisões difíceis com trade-offs.",
  },
  {
    t: "Domain-Driven Design",
    a: "Eric Evans",
    f: "f5",
    why: "O clássico que deu nome a tudo. Denso; leia depois do Khononov.",
  },
  {
    t: "Learning Domain-Driven Design",
    a: "Vlad Khononov",
    f: "f5",
    why: "A introdução mais clara e moderna ao DDD estratégico e tático.",
  },
  {
    t: "Effective Java, 3ª ed.",
    a: "Joshua Bloch",
    f: "f0",
    why: "Como escrever Java como quem projetou a linguagem.",
  },
  {
    t: "Refactoring, 2ª ed.",
    a: "Martin Fowler",
    f: "f1",
    why: "O catálogo de refatorações e o hábito de melhorar código continuamente.",
  },
  {
    t: "A Philosophy of Software Design",
    a: "John Ousterhout",
    f: "f1",
    why: "Complexidade, módulos profundos e o contraponto ao Clean Code.",
  },
  {
    t: "Clean Architecture",
    a: "Robert C. Martin",
    f: "f4",
    why: "Regra de dependência, SOLID em nível de componentes.",
  },
  {
    t: "Building Microservices, 2ª ed.",
    a: "Sam Newman",
    f: "f4",
    why: "O guia mais equilibrado sobre microsserviços, incluindo quando não usar.",
  },
  {
    t: "Release It!, 2ª ed.",
    a: "Michael Nygard",
    f: "f7",
    why: "Padrões de estabilidade aprendidos em incidentes reais.",
  },
  {
    t: "Site Reliability Engineering",
    a: "Google",
    f: "f7",
    why: "SLOs, error budgets, postmortems. Gratuito online.",
  },
  {
    t: "Building Evolutionary Architectures, 2ª ed.",
    a: "Ford, Parsons, Kua, Sadalage",
    f: "f9",
    why: "Fitness functions e governança automatizada.",
  },
  {
    t: "Team Topologies",
    a: "Matthew Skelton, Manuel Pais",
    f: "f9",
    why: "Organização de times e a Lei de Conway na prática.",
  },
  {
    t: "The Software Architect Elevator",
    a: "Gregor Hohpe",
    f: "f9",
    why: "O arquiteto entre a estratégia e a sala de máquinas.",
  },
  {
    t: "Accelerate",
    a: "Forsgren, Humble, Kim",
    f: "f8",
    why: "A pesquisa que mostra o que realmente faz times de alto desempenho.",
  },
  {
    t: "Software Architecture in Practice, 4ª ed.",
    a: "Bass, Clements, Kazman",
    f: "f3",
    why: "A visão acadêmica do SEI: atributos de qualidade, táticas e ATAM.",
  },
  {
    t: "Enterprise Integration Patterns",
    a: "Gregor Hohpe, Bobby Woolf",
    f: "f6",
    why: "O vocabulário de mensageria que todo broker moderno ainda usa.",
  },
];
/* =====================================================================
   Tópicos novos que o "Mapa do Arquiteto" pede e a trilha ainda não tinha
   ===================================================================== */

T({
  id: "fundamentos-computacao",
  phase: "p-fund",
  title: "Como o computador funciona (e o Linux)",
  level: "Base",
  hours: 25,
  summary:
    "Hardware, memória, processadores, sistemas operacionais, compilação vs. interpretação e o Linux como ambiente de trabalho.",
  body: `
<p>Todo sistema que você vai desenhar roda, no fim, em CPUs, memória, discos e redes. Arquitetos que entendem a máquina estimam custos com precisão e reconhecem gargalos que outros só descobrem em produção. Este é o ponto de largada do seu roadmap.</p>
<h3>Como funciona um computador</h3>
<p>O modelo de von Neumann: <strong>CPU</strong> executa instruções, <strong>memória</strong> guarda dados e programas, <strong>dispositivos de E/S</strong> trocam dados com o mundo (disco, rede, teclado). Tudo conversa por barramentos. Programas são sequências de instruções de máquina que manipulam bytes.</p>
<h3>Como os programas rodam na memória</h3>
<ul>
<li>Um <strong>processo</strong> é um programa em execução, com espaço de endereçamento próprio: código, dados globais, <strong>heap</strong> (alocação dinâmica) e uma <strong>stack</strong> por thread.</li>
<li><strong>Memória virtual</strong>: cada processo enxerga endereços próprios; o sistema operacional mapeia para a RAM física em páginas. Quando a RAM acaba, páginas vão para o disco (swap) e tudo fica ordens de grandeza mais lento.</li>
<li><strong>Threads</strong> compartilham o heap do processo, o que permite paralelismo e também cria condições de corrida.</li>
</ul>
<h3>Como os processadores funcionam</h3>
<p>Ciclo buscar → decodificar → executar. CPUs modernas têm vários <strong>núcleos</strong>, executam instruções fora de ordem, preveem desvios e usam <strong>caches</strong> (L1 ~1 ns, L2 ~4 ns, L3 ~10 ns, RAM ~100 ns). Acesso sequencial à memória é muito mais rápido que acesso aleatório porque aproveita o cache: é por isso que <code>ArrayList</code> costuma ganhar de <code>LinkedList</code> mesmo onde a teoria diz o contrário.</p>
<h3>Sistemas operacionais</h3>
<p>O SO gerencia processos (escalonamento), memória, sistema de arquivos, rede e permissões. Programas pedem coisas ao SO via <strong>system calls</strong>. Cada troca de contexto entre threads tem custo; é um dos motivos pelos quais as virtual threads do Java existem.</p>
<h3>Linguagem compilada x interpretada (e onde fica o Java)</h3>
<table class="tbl"><thead><tr><th></th><th>Como executa</th><th>Exemplos</th></tr></thead><tbody>
<tr><td>Compilada (AOT)</td><td>Código-fonte vira código de máquina antes de rodar</td><td>C, C++, Go, Rust</td></tr>
<tr><td>Interpretada</td><td>Um interpretador lê e executa o fonte em tempo de execução</td><td>Python (CPython), Ruby, PHP</td></tr>
<tr><td>Híbrida (bytecode + JIT)</td><td>Compila para bytecode portável; a VM interpreta e compila os trechos quentes para nativo</td><td><strong>Java</strong>, C#, Kotlin</td></tr>
</tbody></table>
<p>O Java compila <code>.java</code> para bytecode (<code>.class</code>) com <code>javac</code>; a JVM executa e o JIT otimiza em tempo de execução. Com GraalVM Native Image também é possível compilar Java direto para binário nativo.</p>
<h3>Linux (Ubuntu ou Debian)</h3>
<p>Praticamente todo servidor e contêiner roda Linux. Você precisa ser fluente no terminal: navegação e arquivos (<code>ls, cd, cp, mv, find</code>), permissões (<code>chmod, chown</code>), processos (<code>ps, top, htop, kill</code>), rede (<code>curl, ss, dig, ping</code>), logs (<code>journalctl, tail -f, grep, less</code>), pacotes (<code>apt</code>), serviços (<code>systemctl</code>) e SSH. Instale Ubuntu (ou use WSL2 no Windows) e passe a programar nele.</p>
`,
  code: [
    {
      t: "Vendo o efeito do cache da CPU em Java",
      src: `public class CacheDaCpu {
    public static void main(String[] args) {
        int n = 4_000;
        int[][] m = new int[n][n];

        long t0 = System.nanoTime();
        long soma = 0;
        for (int i = 0; i < n; i++)          // percorre linha a linha: acesso sequencial
            for (int j = 0; j < n; j++) soma += m[i][j];
        long t1 = System.nanoTime();
        for (int j = 0; j < n; j++)          // coluna a coluna: salta na memória
            for (int i = 0; i < n; i++) soma += m[i][j];
        long t2 = System.nanoTime();

        System.out.printf("linhas: %d ms | colunas: %d ms%n",
            (t1 - t0) / 1_000_000, (t2 - t1) / 1_000_000);
        // Mesma quantidade de operações; a ordem por colunas costuma ser várias vezes mais lenta.
    }
}`,
    },
    {
      t: "Do fonte ao bytecode",
      src: `# Compila e inspeciona o bytecode gerado
javac Ola.java
javap -c Ola          # mostra as instruções da JVM (iload, invokevirtual...)
java Ola

# Observe a JVM como processo do sistema operacional
jps -l                # processos Java
ps -o pid,rss,nlwp,cmd -p $(pgrep -f Ola)   # memória residente e nº de threads`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Rode o programa <code>CacheDaCpu</code> e explique a diferença de tempo usando o conceito de linha de cache.",
    },
    {
      lvl: 1,
      text: "Instale Ubuntu (ou WSL2) e faça todos os níveis do jogo <strong>OverTheWire Bandit</strong> até o nível 15.",
    },
    {
      lvl: 2,
      text: "Escreva um script Bash que monitora um processo Java a cada 5 s (CPU, memória, número de threads) e grava em CSV.",
    },
    {
      lvl: 2,
      text: "Compile uma classe simples, rode <code>javap -c</code> e explique o que cada instrução do bytecode faz.",
    },
    {
      lvl: 3,
      text: "Leia os capítulos de processos, memória virtual e concorrência do livro OSTEP (gratuito) e escreva um resumo de 2 páginas ligando cada conceito a um problema real de servidores Java.",
    },
  ],
  refs: [
    {
      t: "Livro: Operating Systems: Three Easy Pieces (OSTEP, gratuito)",
      u: "https://pages.cs.wisc.edu/~remzi/OSTEP/",
    },
    {
      t: "CS50x 2025 (Harvard, gratuito)",
      u: "https://cs50.harvard.edu/x/",
      note: "está indicado no seu próprio quadro",
    },
    {
      t: "Livro: Code (Charles Petzold), 2ª ed.",
      u: "https://www.charlespetzold.com/code/",
    },
    {
      t: "OverTheWire Bandit: prática de terminal Linux",
      u: "https://overthewire.org/wargames/bandit/",
    },
    {
      t: "The Linux Command Line (William Shotts, gratuito)",
      u: "https://linuxcommand.org/tlcl.php",
    },
    { t: "roadmap.sh: Linux", u: "https://roadmap.sh/linux" },
  ],
});

T({
  id: "poo",
  phase: "p-ling",
  title: "Lógica, paradigmas e POO em Java",
  level: "Base",
  hours: 30,
  summary:
    "Lógica de programação, paradigmas procedural e funcional, e os quatro pilares da orientação a objetos.",
  body: `
<p>Seu roadmap escolhe uma linguagem e passa por lógica, algoritmos e paradigmas. Aqui o foco é a base que tudo o mais usa: pensar em passos, e depois organizar esses passos em funções e objetos.</p>
<h3>Lógica de programação</h3>
<p>Variáveis, tipos, condicionais, laços, funções, entrada e saída. Em Java, comece com <code>jshell</code> (REPL que já vem no JDK) para experimentar sem cerimônia. O objetivo é traduzir um problema em passos precisos, e testar cada passo.</p>
<h3>Paradigmas</h3>
<ul>
<li><strong>Procedural</strong>: o programa é uma sequência de procedimentos que transformam dados. Simples e direto.</li>
<li><strong>Funcional</strong>: funções puras (mesma entrada, mesma saída, sem efeito colateral), imutabilidade, funções como valores. Em Java: lambdas, <code>Stream</code>, <code>Optional</code>, records.</li>
<li><strong>Orientado a objetos</strong>: dados e comportamento juntos em objetos que colaboram por mensagens.</li>
</ul>
<p>Java moderno é multiparadigma. Bons projetos usam OO para modelar o domínio e estilo funcional para transformar dados.</p>
<h3>Os quatro pilares da POO</h3>
<dl class="defs">
<dt>Abstração</dt><dd>Expor só o essencial. Uma interface <code>Pagamento</code> com <code>autorizar()</code> abstrai se é cartão, Pix ou boleto.</dd>
<dt>Encapsulamento</dt><dd>Esconder o estado e proteger as regras. O saldo de uma conta só muda por <code>depositar</code> e <code>sacar</code>, que validam; nunca por <code>setSaldo</code>.</dd>
<dt>Herança</dt><dd>Reaproveitar e especializar comportamento (<code>extends</code>). Poderosa e perigosa: cria acoplamento forte. Regra prática: <em>prefira composição a herança</em>.</dd>
<dt>Polimorfismo</dt><dd>O mesmo código trabalha com tipos diferentes. Quem chama <code>pagamento.autorizar()</code> não sabe qual implementação vai rodar, e não precisa saber.</dd>
</dl>
`,
  code: [
    {
      t: "Os quatro pilares num exemplo só",
      src: `// Abstração: o que todo meio de pagamento sabe fazer
public interface MeioPagamento {
    Autorizacao autorizar(BigDecimal valor);
}

// Encapsulamento: o limite só muda por regras
public final class CartaoCredito implements MeioPagamento {
    private BigDecimal limiteDisponivel;
    public CartaoCredito(BigDecimal limite) { this.limiteDisponivel = limite; }

    @Override
    public Autorizacao autorizar(BigDecimal valor) {
        if (valor.compareTo(limiteDisponivel) > 0) return Autorizacao.negada("Limite insuficiente");
        limiteDisponivel = limiteDisponivel.subtract(valor);
        return Autorizacao.aprovada();
    }
}

public final class Pix implements MeioPagamento {
    public Autorizacao autorizar(BigDecimal valor) { return Autorizacao.aprovada(); }
}

// Polimorfismo: o checkout não conhece os tipos concretos
public class Checkout {
    public Autorizacao pagar(MeioPagamento meio, BigDecimal total) {
        return meio.autorizar(total);
    }
}`,
    },
    {
      t: "O mesmo problema em três paradigmas",
      src: `List<Pedido> pedidos = ...;

// Procedural
BigDecimal total = BigDecimal.ZERO;
for (Pedido p : pedidos) {
    if (p.pago()) total = total.add(p.valor());
}

// Funcional
BigDecimal total2 = pedidos.stream()
    .filter(Pedido::pago)
    .map(Pedido::valor)
    .reduce(BigDecimal.ZERO, BigDecimal::add);

// Orientado a objetos: a coleção sabe responder
public record Carteira(List<Pedido> pedidos) {
    public BigDecimal totalPago() { return pedidos.stream().filter(Pedido::pago)
        .map(Pedido::valor).reduce(BigDecimal.ZERO, BigDecimal::add); }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Resolva os 30 primeiros exercícios da trilha de Java do <strong>Exercism</strong>, recebendo mentoria nas soluções.",
    },
    {
      lvl: 1,
      text: "Modele uma biblioteca (Livro, Usuario, Emprestimo) usando os quatro pilares. Escreva por que cada classe existe.",
    },
    {
      lvl: 2,
      text: "Reescreva uma hierarquia com herança (<code>Funcionario → Gerente → Diretor</code>) usando composição e interfaces. Compare a facilidade de adicionar um novo tipo.",
    },
    {
      lvl: 3,
      text: "Implemente o mesmo relatório de vendas nos três paradigmas e escreva qual você usaria em produção e por quê.",
    },
  ],
  refs: [
    { t: "Dev.java: Learn Java (oficial)", u: "https://dev.java/learn/" },
    { t: "Exercism: trilha de Java", u: "https://exercism.org/tracks/java" },
    {
      t: "MOOC.fi: Java Programming (Universidade de Helsinque, gratuito)",
      u: "https://java-programming.mooc.fi/",
    },
    {
      t: "Livro: Use a Cabeça! Java (Head First Java), 3ª ed.",
      u: "https://www.oreilly.com/library/view/head-first-java/9781492091646/",
    },
    { t: "roadmap.sh: Java", u: "https://roadmap.sh/java" },
  ],
});

T({
  id: "web-fundamentos",
  phase: "p-web",
  title: "Fundamentos da Web e redes",
  level: "Base",
  hours: 20,
  summary:
    "Como a internet funciona, DNS, URLs, HTTP, cliente-servidor, servidores web e cache HTTP.",
  body: `
<p>Quase todo sistema que um arquiteto desenha conversa pela rede. Latência, DNS, TLS e cache HTTP aparecem em toda decisão de desempenho e disponibilidade.</p>
<h3>Como a internet funciona</h3>
<p>Redes interligadas trocando <strong>pacotes</strong> IP. Em camadas (modelo TCP/IP): <em>enlace</em> (Ethernet, Wi-Fi) → <em>rede</em> (IP, roteamento) → <em>transporte</em> (TCP confiável e ordenado; UDP rápido e sem garantias) → <em>aplicação</em> (HTTP, DNS, SMTP).</p>
<h3>Nome de domínio e DNS</h3>
<p>O DNS traduz <code>loja.com.br</code> em endereço IP. A resolução passa por resolvedor recursivo, servidores raiz, TLD (<code>.br</code>) e servidor autoritativo. Registros comuns: <code>A</code>/<code>AAAA</code> (IP), <code>CNAME</code> (apelido), <code>MX</code> (e-mail), <code>TXT</code>. O <strong>TTL</strong> diz quanto tempo a resposta pode ficar em cache: TTL alto dificulta trocar de servidor rápido num incidente.</p>
<h3>Estrutura de uma URL</h3>
<p><code>https://api.loja.com.br:443/v1/produtos/42?cor=azul#detalhes</code> → esquema, host, porta, caminho, query string, fragmento (o fragmento nunca vai ao servidor).</p>
<h3>Protocolo HTTP</h3>
<p>Requisição (método, caminho, headers, corpo) e resposta (status, headers, corpo). Stateless: cada requisição é independente. HTTP/1.1 (texto, uma requisição por vez por conexão), HTTP/2 (binário, multiplexado), HTTP/3 (sobre QUIC/UDP, melhor em redes instáveis).</p>
<h3>Arquitetura cliente-servidor e servidor web</h3>
<p>O cliente pede, o servidor responde. Servidores web (Nginx, Apache) servem arquivos estáticos, terminam TLS e fazem proxy reverso para aplicações (no Java, o Tomcat embutido do Spring Boot).</p>
<h3>Cache HTTP</h3>
<p>Headers <code>Cache-Control</code> (<code>max-age</code>, <code>no-store</code>, <code>private</code>), <code>ETag</code> + <code>If-None-Match</code> (resposta 304 sem corpo). Cache bem configurado é desempenho de graça e base do funcionamento de CDNs.</p>
`,
  code: [
    {
      t: "Investigando com o terminal",
      src: `dig +trace loja.exemplo.com          # caminho completo da resolução DNS
curl -v https://example.com           # handshake TLS, headers da requisição e da resposta
curl -I https://example.com           # só os headers (veja Cache-Control e ETag)
curl -w "dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} total:%{time_total}\\n" \\
     -o /dev/null -s https://example.com   # onde o tempo foi gasto`,
    },
    {
      t: "ETag e cache HTTP no Spring",
      src: `@GetMapping("/produtos/{id}")
ResponseEntity<Produto> buscar(@PathVariable long id, WebRequest req) {
    var p = catalogo.buscar(id);
    String etag = "\\"" + p.versao() + "\\"";
    if (req.checkNotModified(etag)) return null;      // responde 304 sem corpo
    return ResponseEntity.ok()
        .eTag(etag)
        .cacheControl(CacheControl.maxAge(Duration.ofMinutes(5)).cachePublic())
        .body(p);
}
// Ou globalmente: new ShallowEtagHeaderFilter() como bean`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Com <code>curl -w</code>, meça o tempo de DNS, TCP, TLS e total para 5 sites. Explique por que sites em outro continente são mais lentos.",
    },
    {
      lvl: 1,
      text: "Abra o DevTools do navegador numa página grande e classifique as requisições por tipo, tamanho e se vieram do cache.",
    },
    {
      lvl: 2,
      text: "Escreva um servidor HTTP mínimo em Java puro com <code>ServerSocket</code> que entende GET e devolve arquivos estáticos. Depois compare com <code>com.sun.net.httpserver</code>.",
    },
    {
      lvl: 3,
      text: "Configure Nginx como proxy reverso com TLS na frente de 2 instâncias de uma API Spring, com cache de respostas GET por 60 s. Mostre os headers de acerto de cache.",
    },
  ],
  refs: [
    {
      t: "MDN: An overview of HTTP",
      u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    },
    {
      t: "MDN: HTTP caching",
      u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching",
    },
    { t: "How DNS Works (quadrinho)", u: "https://howdns.works/" },
    {
      t: "Cloudflare Learning Center",
      u: "https://www.cloudflare.com/learning/",
    },
    {
      t: "Livro: High Performance Browser Networking (Ilya Grigorik, gratuito)",
      u: "https://hpbn.co/",
    },
    {
      t: "Livro: Computer Networking: A Top-Down Approach (Kurose & Ross)",
      u: "https://gaia.cs.umass.edu/kurose_ross/index.php",
    },
  ],
});

T({
  id: "seguranca-web",
  phase: "p-web",
  title: "Segurança web: login, sessões e proteções",
  level: "Intermediário",
  hours: 20,
  summary:
    "HTTPS, como um sistema de login funciona, autenticação vs. autorização, CORS, cookies, sessão, VPN e firewall.",
  body: `
<p>Antes de pensar em segurança como requisito de arquitetura (etapa de Arquiteto de Soluções), você precisa dominar os mecanismos que todo sistema web usa.</p>
<h3>HTTP vs HTTPS</h3>
<p>HTTPS é HTTP dentro de <strong>TLS</strong>: criptografia, integridade e autenticidade do servidor via certificado. O handshake negocia chaves; o certificado é assinado por uma autoridade confiável (Let's Encrypt emite de graça). Sem HTTPS, qualquer um no caminho lê e altera o tráfego. Use HSTS para impedir que o navegador volte para HTTP.</p>
<h3>Como funciona um sistema de login</h3>
<ol>
<li>Senhas nunca são guardadas; guarda-se um <strong>hash lento com salt</strong> (bcrypt, Argon2).</li>
<li>No login, o servidor compara o hash e cria uma <strong>sessão</strong> (ID aleatório guardado no servidor, enviado ao navegador como cookie) ou emite um <strong>token</strong> (JWT assinado).</li>
<li>Proteções: limite de tentativas, MFA, mensagens de erro genéricas ("usuário ou senha inválidos").</li>
</ol>
<h3>Autenticação x autorização</h3>
<p><strong>Autenticação</strong>: quem é você? <strong>Autorização</strong>: o que você pode fazer? Um usuário autenticado ainda pode não ter permissão para ver o pedido de outro: a falha de autorização mais comum (IDOR).</p>
<h3>Cookies e sessão</h3>
<p>Atributos que importam: <code>HttpOnly</code> (JavaScript não lê, protege contra XSS), <code>Secure</code> (só HTTPS), <code>SameSite=Lax/Strict</code> (protege contra CSRF), <code>Max-Age</code>. Sessão no servidor é simples de revogar; em várias instâncias, guarde-a no Redis (Spring Session).</p>
<h3>CORS</h3>
<p>Por padrão, o navegador bloqueia que JavaScript de <code>app.loja.com</code> leia respostas de <code>api.outra.com</code> (same-origin policy). CORS é o servidor dizendo quais origens podem. Nunca use <code>*</code> com credenciais. CORS protege o usuário no navegador; não é controle de acesso da sua API.</p>
<h3>VPN e firewall</h3>
<p><strong>Firewall</strong> filtra tráfego por regras (IP, porta, protocolo); na nuvem, são os security groups. <strong>VPN</strong> cria um túnel criptografado para acessar uma rede privada. Bancos de dados nunca devem ficar expostos à internet.</p>
`,
  code: [
    {
      t: "Login com sessão no Spring Security",
      src: `@Configuration
@EnableWebSecurity
class SegurancaWeb {
    @Bean
    SecurityFilterChain filtros(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(a -> a
                .requestMatchers("/", "/login", "/css/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")   // autorização
                .anyRequest().authenticated())                   // autenticação
            .formLogin(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionFixation(f -> f.migrateSession()))
            .headers(h -> h.httpStrictTransportSecurity(Customizer.withDefaults()))
            .build();
    }

    @Bean
    PasswordEncoder senhas() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); } // bcrypt
}

# application.yml: cookie de sessão seguro
server.servlet.session.cookie:
  http-only: true
  secure: true
  same-site: lax`,
    },
    {
      t: "CORS restrito a uma origem",
      src: `@Bean
CorsConfigurationSource cors() {
    var c = new CorsConfiguration();
    c.setAllowedOrigins(List.of("https://app.loja.com.br"));
    c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    c.setAllowCredentials(true);
    var src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/api/**", c);
    return src;
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Implemente cadastro e login com Spring Security, senhas em bcrypt e página protegida. Inspecione o cookie de sessão no DevTools.",
    },
    {
      lvl: 2,
      text: "Crie uma SPA em outra porta chamando sua API. Veja o erro de CORS, entenda a requisição preflight (OPTIONS) e corrija liberando só a origem certa.",
    },
    {
      lvl: 2,
      text: "Leve a sessão para o Redis com Spring Session e prove que o login sobrevive à troca de instância atrás de um balanceador.",
    },
    {
      lvl: 3,
      text: "Explore a sua própria aplicação com OWASP ZAP e corrija os alertas de severidade média ou alta.",
    },
  ],
  refs: [
    {
      t: "OWASP Cheat Sheet: Authentication",
      u: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html",
    },
    {
      t: "OWASP Cheat Sheet: Session Management",
      u: "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html",
    },
    {
      t: "OWASP Cheat Sheet: Password Storage",
      u: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
    },
    {
      t: "MDN: Cross-Origin Resource Sharing (CORS)",
      u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
    },
    {
      t: "MDN: Using HTTP cookies",
      u: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
    },
    {
      t: "Spring Security Reference",
      u: "https://docs.spring.io/spring-security/reference/",
    },
    { t: "OWASP ZAP", u: "https://www.zaproxy.org/" },
  ],
});

T({
  id: "docker",
  phase: "p-docker",
  title: "Docker na prática",
  level: "Base",
  hours: 15,
  summary:
    "Conceitos de conteinerização, comandos básicos, imagens, volumes, redes, Dockerfile e Docker Compose.",
  body: `
<p>Docker é o último tópico da etapa Júnior no seu roadmap, e é o que leva seu código do "funciona na minha máquina" para "funciona em qualquer lugar".</p>
<h3>Conceitos de conteinerização</h3>
<p>Um <strong>contêiner</strong> é um processo isolado que usa recursos do kernel Linux (namespaces para isolar, cgroups para limitar CPU e memória). Diferente de uma máquina virtual, não carrega um sistema operacional inteiro: sobe em milissegundos e pesa megabytes. Uma <strong>imagem</strong> é o pacote imutável (sistema de arquivos em camadas + metadados) a partir do qual contêineres são criados.</p>
<h3>Comandos básicos</h3>
<p><code>docker run</code>, <code>ps</code>, <code>logs -f</code>, <code>exec -it</code>, <code>stop</code>, <code>rm</code>, <code>images</code>, <code>build</code>, <code>pull/push</code>, <code>inspect</code>, <code>stats</code>.</p>
<h3>Imagens, volumes e redes</h3>
<ul>
<li><strong>Imagens</strong> são feitas de camadas; cada instrução do Dockerfile gera uma. Ordene do que muda menos para o que muda mais para aproveitar o cache.</li>
<li><strong>Volumes</strong> guardam dados fora do ciclo de vida do contêiner. Sem volume, o banco perde os dados quando o contêiner é removido.</li>
<li><strong>Redes</strong>: contêineres na mesma rede definida pelo usuário se encontram pelo nome (o serviço <code>api</code> acessa <code>db:5432</code>).</li>
</ul>
<h3>Dockerfile e Compose</h3>
<p>O Dockerfile descreve como construir a imagem (veja o multi-stage para Spring Boot no tópico seguinte). O <strong>Docker Compose</strong> descreve um ambiente com vários contêineres (API, banco, Redis, Kafka) num arquivo YAML. O Spring Boot tem integração nativa: com <code>spring-boot-docker-compose</code>, ele sobe o <code>compose.yaml</code> sozinho ao iniciar a aplicação em desenvolvimento.</p>
`,
  code: [
    {
      t: "compose.yaml de um ambiente de desenvolvimento",
      src: `services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/loja
      SPRING_DATASOURCE_USERNAME: loja
      SPRING_DATASOURCE_PASSWORD: loja
    depends_on:
      db: { condition: service_healthy }

  db:
    image: postgres:17-alpine
    environment: { POSTGRES_DB: loja, POSTGRES_USER: loja, POSTGRES_PASSWORD: loja }
    volumes: [dados-pg:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U loja"]
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
docker exec -it $(docker compose ps -q db) psql -U loja   # entra no banco
docker stats                    # CPU e memória de cada contêiner
docker compose down             # derruba (o volume dados-pg continua)`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Rode PostgreSQL com e sem volume. Crie uma tabela, remova o contêiner e mostre a diferença.",
    },
    {
      lvl: 1,
      text: "Escreva o Dockerfile da sua API e reduza o tamanho da imagem o máximo que conseguir. Registre os tamanhos de cada tentativa.",
    },
    {
      lvl: 2,
      text: "Monte um <code>compose.yaml</code> com API, PostgreSQL, Redis e Adminer, com healthchecks e rede própria.",
    },
    {
      lvl: 3,
      text: "Use <code>docker stats</code> e limites (<code>mem_limit</code>, <code>cpus</code>) para descobrir a menor memória com que sua API funciona de forma estável sob carga.",
    },
  ],
  refs: [
    { t: "Docker: Get started", u: "https://docs.docker.com/get-started/" },
    {
      t: "Docker Compose: documentação",
      u: "https://docs.docker.com/compose/",
    },
    {
      t: "Spring Boot: Docker Compose support",
      u: "https://docs.spring.io/spring-boot/reference/features/dev-services.html",
    },
    {
      t: "Play with Docker (laboratório online)",
      u: "https://labs.play-with-docker.com/",
    },
    { t: "roadmap.sh: Docker", u: "https://roadmap.sh/docker" },
  ],
});

T({
  id: "nosql",
  phase: "p-nosql",
  title: "Bancos não relacionais (NoSQL)",
  level: "Intermediário",
  hours: 20,
  summary:
    "Document store, key-value, grafos e motores de busca, com MongoDB e Spring Data na prática.",
  body: `
<p>É o primeiro tópico da etapa Pleno/Sênior no seu mapa. NoSQL não substitui o relacional: amplia as opções quando o padrão de acesso, a escala ou o formato dos dados pedem outra coisa.</p>
<table class="tbl"><thead><tr><th>Tipo</th><th>Modelo</th><th>Bom para</th><th>Exemplos</th></tr></thead><tbody>
<tr><td>Document store</td><td>Documentos JSON/BSON aninhados</td><td>Agregados lidos inteiros, schema que varia</td><td>MongoDB, Couchbase</td></tr>
<tr><td>Key-value</td><td>Chave → valor opaco</td><td>Cache, sessão, contadores, latência mínima</td><td>Redis, DynamoDB</td></tr>
<tr><td>Graph database</td><td>Nós e arestas com propriedades</td><td>Relacionamentos como consulta principal: fraude, recomendação, redes</td><td>Neo4j</td></tr>
<tr><td>Search engine</td><td>Índice invertido</td><td>Busca textual, relevância, facetas, logs</td><td>OpenSearch, Elasticsearch</td></tr>
</tbody></table>
<h3>Modelagem orientada a consultas</h3>
<p>No relacional você modela os dados e depois escreve as consultas. Em NoSQL é o contrário: <strong>comece pelas consultas</strong> e modele para que cada uma leia o mínimo de documentos possível. Em MongoDB, a decisão central é <em>embutir</em> (dados lidos juntos ficam no mesmo documento) ou <em>referenciar</em> (dados com ciclo de vida próprio ou listas que crescem sem limite).</p>
<h3>Trade-offs</h3>
<p>Você troca joins, integridade referencial e às vezes transações multi-documento por escala horizontal e flexibilidade. Muitas aplicações acabam com <strong>persistência poliglota</strong>: PostgreSQL como fonte da verdade, Redis para cache e OpenSearch para busca. Cada banco novo é mais um sistema para operar, então exija um motivo concreto.</p>
`,
  code: [
    {
      t: "MongoDB com Spring Data: documento com itens embutidos",
      src: `@Document("pedidos")
public record PedidoDoc(
    @Id String id,
    String clienteId,
    Instant criadoEm,
    String status,
    List<Item> itens,          // embutido: sempre lido junto com o pedido
    Endereco entrega
) {
    public record Item(String sku, String nome, int qtd, BigDecimal preco) {}
    public record Endereco(String cep, String cidade, String uf) {}
}

public interface PedidoDocRepository extends MongoRepository<PedidoDoc, String> {
    List<PedidoDoc> findByClienteIdOrderByCriadoEmDesc(String clienteId, Pageable p);

    @Query("{ 'itens.sku': ?0, 'status': 'PAGO' }")
    List<PedidoDoc> pagosComProduto(String sku);
}

// Índice composto alinhado à consulta mais frequente:
// db.pedidos.createIndex({ clienteId: 1, criadoEm: -1 })`,
    },
    {
      t: "Redis como key-value para contadores",
      src: `@Service
class VisualizacoesProduto {
    private final StringRedisTemplate redis;
    VisualizacoesProduto(StringRedisTemplate redis) { this.redis = redis; }

    long registrar(String sku) {
        var chave = "views:" + LocalDate.now() + ":" + sku;
        Long n = redis.opsForValue().increment(chave);   // atômico
        redis.expire(chave, Duration.ofDays(2));
        return n;
    }
}`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Faça o curso gratuito MongoDB Basics na MongoDB University e modele um catálogo de produtos com atributos variáveis por categoria.",
    },
    {
      lvl: 2,
      text: "Implemente o mesmo histórico de pedidos em PostgreSQL e em MongoDB. Compare consultas, índices e o que acontece quando você precisa de um relatório por produto.",
    },
    {
      lvl: 2,
      text: "Indexe 100 mil produtos no OpenSearch e implemente busca com autocompletar e filtros por categoria e preço.",
    },
    {
      lvl: 3,
      text: "Modele uma detecção simples de fraude em Neo4j (cartões, dispositivos e endereços compartilhados entre contas) e escreva as consultas Cypher.",
    },
  ],
  refs: [
    {
      t: "MongoDB University (cursos gratuitos)",
      u: "https://learn.mongodb.com/",
    },
    {
      t: "MongoDB: Data Modeling",
      u: "https://www.mongodb.com/docs/manual/data-modeling/",
    },
    {
      t: "Spring Data MongoDB",
      u: "https://docs.spring.io/spring-data/mongodb/reference/",
    },
    { t: "Redis: documentação", u: "https://redis.io/docs/latest/" },
    {
      t: "Neo4j GraphAcademy (gratuito)",
      u: "https://graphacademy.neo4j.com/",
    },
    {
      t: "Livro: NoSQL Distilled (Sadalage & Fowler)",
      u: "https://martinfowler.com/books/nosql.html",
    },
  ],
});

T({
  id: "refatoracao",
  phase: "p-refac",
  title: "Técnicas de refactoring e débito técnico",
  level: "Intermediário",
  hours: 20,
  summary:
    "Débito técnico, code smells e as famílias de refatoração do catálogo de Fowler: composição, dados, condicionais e chamadas.",
  body: `
<p>Refatorar é mudar a estrutura do código sem mudar o comportamento, em passos pequenos e seguros, com testes rodando a cada passo. Seu roadmap organiza o tema em seis partes, que seguimos aqui.</p>
<h3>O que é débito técnico</h3>
<p>O custo futuro de atalhos tomados hoje. Como uma dívida financeira, pode ser uma ferramenta (lançar antes do concorrente) desde que seja consciente e paga. O problema é a dívida invisível que acumula juros: cada feature nova fica mais lenta. Torne-a visível: registre, estime e negocie com o produto em termos de impacto no prazo.</p>
<h3>Code smells</h3>
<p>Sinais de que algo pode estar errado: <em>Long Method, Large Class, Long Parameter List, Duplicated Code, Feature Envy, Data Clumps, Primitive Obsession, Switch Statements, Shotgun Surgery, Divergent Change, Message Chains, Comments que explicam código confuso</em>.</p>
<h3>As famílias de refatoração</h3>
<dl class="defs">
<dt>Métodos de composição</dt><dd><em>Extract Method, Inline Method, Extract Variable, Replace Temp with Query, Split Temporary Variable</em>. Quebram métodos longos em partes com nomes que explicam a intenção.</dd>
<dt>Organização de dados</dt><dd><em>Replace Primitive with Object, Encapsulate Collection, Replace Magic Number with Constant, Change Value to Reference</em>. Dão tipos e regras aos dados.</dd>
<dt>Expressões condicionais</dt><dd><em>Decompose Conditional, Consolidate Conditional, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Special Case (Null Object)</em>.</dd>
<dt>Simplificar chamadas de métodos</dt><dd><em>Rename Method, Introduce Parameter Object, Separate Query from Modifier, Remove Flag Argument, Replace Constructor with Factory Function</em>.</dd>
</dl>
<div class="callout"><b>A regra de ouro</b>Nunca refatore e mude comportamento no mesmo commit. Se não há testes, escreva primeiro testes de caracterização que capturam o comportamento atual, mesmo que ele pareça errado.</div>
`,
  code: [
    {
      t: "Guard clauses no lugar de condicionais aninhadas",
      src: `// Antes
double calcularPagamento(Funcionario f) {
    double resultado;
    if (f.afastado()) {
        resultado = valorAfastamento(f);
    } else {
        if (f.aposentado()) {
            resultado = valorAposentadoria(f);
        } else {
            resultado = salarioNormal(f);
        }
    }
    return resultado;
}

// Depois: Replace Nested Conditional with Guard Clauses
double calcularPagamento(Funcionario f) {
    if (f.afastado())   return valorAfastamento(f);
    if (f.aposentado()) return valorAposentadoria(f);
    return salarioNormal(f);
}`,
    },
    {
      t: "Remove Flag Argument + Introduce Parameter Object",
      src: `// Antes: o que significa 'true'? E esses quatro parâmetros soltos?
relatorio.gerar(inicio, fim, clienteId, true);

// Depois
public record FiltroRelatorio(LocalDate inicio, LocalDate fim, ClienteId cliente) {
    public FiltroRelatorio {
        if (fim.isBefore(inicio)) throw new IllegalArgumentException("Período inválido");
    }
}
relatorio.gerarResumido(new FiltroRelatorio(inicio, fim, clienteId));
relatorio.gerarDetalhado(new FiltroRelatorio(inicio, fim, clienteId));`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Faça a kata <strong>Gilded Rose</strong>: testes de caracterização primeiro, depois refatore aplicando pelo menos 5 refatorações nomeadas do catálogo.",
    },
    {
      lvl: 2,
      text: "Faça a kata <strong>Theatrical Players</strong> (capítulo 1 do livro Refactoring) em Java, com um commit por refatoração.",
    },
    {
      lvl: 2,
      text: "Use as refatorações automáticas do IntelliJ (Extract Method, Inline, Change Signature, Introduce Parameter Object) num projeto seu e anote o que a IDE garante e o que não garante.",
    },
    {
      lvl: 3,
      text: "Monte um registro de débito técnico de um projeto real ou open source: 10 itens com impacto, esforço e prioridade, e a justificativa em termos de negócio para os 3 primeiros.",
    },
  ],
  refs: [
    {
      t: "Livro: Refatoração, 2ª ed. (Martin Fowler)",
      u: "https://martinfowler.com/books/refactoring.html",
      note: "está na sua lista de livros",
    },
    {
      t: "Catálogo oficial de refatorações",
      u: "https://refactoring.com/catalog/",
    },
    {
      t: "Refactoring Guru: smells e técnicas",
      u: "https://refactoring.guru/refactoring",
    },
    {
      t: "Gilded Rose Kata",
      u: "https://github.com/emilybache/GildedRose-Refactoring-Kata",
    },
    {
      t: "Theatrical Players Kata",
      u: "https://github.com/emilybache/Theatrical-Players-Refactoring-Kata",
    },
    {
      t: "Livro: Working Effectively with Legacy Code (Michael Feathers)",
      u: "https://www.oreilly.com/library/view/working-effectively-with/0131177052/",
    },
    {
      t: "Martin Fowler: Technical Debt",
      u: "https://martinfowler.com/bliki/TechnicalDebt.html",
    },
  ],
});

T({
  id: "performance-jobs",
  phase: "p-perf",
  title: "Jobs assíncronos e performance de SQL",
  level: "Intermediário",
  hours: 15,
  summary:
    "Tirar trabalho pesado do caminho da requisição e fazer o banco responder rápido: filas de jobs, agendamento e otimização de consultas.",
  body: `
<h3>Jobs assíncronos</h3>
<p>Gerar PDF, enviar e-mail, processar imagem, chamar um parceiro lento: nada disso precisa acontecer enquanto o usuário espera. Responda rápido (<code>202 Accepted</code>), enfileire o trabalho e processe em segundo plano. Opções em Java, da mais simples à mais robusta:</p>
<ul>
<li><code>@Async</code> do Spring: simples, mas o trabalho se perde se a aplicação cair.</li>
<li><strong>Tabela de jobs</strong> no PostgreSQL com <code>FOR UPDATE SKIP LOCKED</code>, ou bibliotecas como <strong>JobRunr</strong> e <strong>db-scheduler</strong>: duráveis, com retry e painel.</li>
<li><strong>Fila de mensagens</strong> (RabbitMQ, SQS, Kafka): quando o volume é alto ou vários serviços consomem.</li>
</ul>
<p>Todo job precisa ser <strong>idempotente</strong> (pode rodar duas vezes sem estragar nada) e ter política de retry com backoff e destino para falhas definitivas.</p>
<h3>Otimização e performance de SQL</h3>
<ol>
<li><strong>Meça primeiro</strong>: <code>pg_stat_statements</code> mostra as consultas que mais consomem tempo total.</li>
<li><strong>Leia o plano</strong> com <code>EXPLAIN (ANALYZE, BUFFERS)</code>.</li>
<li><strong>Índices certos</strong>: compostos na ordem das colunas do filtro, parciais para subconjuntos, cobrindo (<code>INCLUDE</code>) para evitar ir à tabela.</li>
<li><strong>Elimine N+1</strong> e <code>SELECT *</code>; traga só as colunas que a tela usa (projeções).</li>
<li><strong>Paginação por cursor</strong> em listas grandes.</li>
<li><strong>Pool de conexões</strong> (HikariCP) dimensionado pela lei de Little, não "quanto maior melhor".</li>
<li>Operações em lote: <code>hibernate.jdbc.batch_size</code>, <code>COPY</code> para cargas grandes.</li>
</ol>
`,
  code: [
    {
      t: "Job durável com JobRunr",
      src: `@RestController
class RelatorioController {
    private final JobScheduler jobs;

    @PostMapping("/relatorios")
    ResponseEntity<Void> solicitar(@RequestBody PedidoRelatorio req) {
        var jobId = jobs.enqueue(() -> geradorRelatorio.gerar(req.clienteId(), req.periodo()));
        return ResponseEntity.accepted().location(URI.create("/relatorios/" + jobId)).build();
    }
}

@Service
class GeradorRelatorio {
    @Job(name = "Relatório do cliente %0", retries = 5)
    public void gerar(String clienteId, Periodo periodo) {
        if (repositorio.jaGerado(clienteId, periodo)) return;   // idempotente
        var pdf = montarPdf(clienteId, periodo);
        armazenamento.salvar(pdf);
        notificador.avisarPronto(clienteId);
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
SELECT id, total, criado_em FROM pedidos
WHERE cliente_id = 42 AND status = 'PAGO' ORDER BY criado_em DESC LIMIT 20;
-- Seq Scan on pedidos ... rows removed by filter: 4.999.980  → problema

-- 3) Índice alinhado ao filtro e à ordenação, cobrindo as colunas lidas
CREATE INDEX CONCURRENTLY idx_pedidos_cliente_pagos
  ON pedidos (cliente_id, criado_em DESC) INCLUDE (total)
  WHERE status = 'PAGO';
-- Agora: Index Only Scan, de ~900 ms para ~0,3 ms`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Transforme um endpoint que envia e-mail de forma síncrona em assíncrono com JobRunr. Meça o tempo de resposta antes e depois.",
    },
    {
      lvl: 2,
      text: "Ative <code>pg_stat_statements</code>, rode um teste de carga e otimize as 3 consultas mais caras. Documente planos e tempos antes e depois.",
    },
    {
      lvl: 2,
      text: "Implemente uma fila de jobs própria com <code>SKIP LOCKED</code>, retry com backoff exponencial e tabela de falhas definitivas. Rode 3 workers em paralelo.",
    },
    {
      lvl: 3,
      text: "Importe 10 milhões de linhas de um CSV no PostgreSQL de três jeitos (INSERT um a um, batch JDBC, COPY) e compare tempos.",
    },
  ],
  refs: [
    { t: "JobRunr", u: "https://www.jobrunr.io/en/documentation/" },
    { t: "db-scheduler", u: "https://github.com/kagkarlsson/db-scheduler" },
    {
      t: "PostgreSQL: Using EXPLAIN",
      u: "https://www.postgresql.org/docs/current/using-explain.html",
    },
    { t: "Use The Index, Luke", u: "https://use-the-index-luke.com/" },
    {
      t: "HikariCP: About Pool Sizing",
      u: "https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing",
    },
    {
      t: "Vlad Mihalcea: blog de performance JPA/Hibernate",
      u: "https://vladmihalcea.com/tutorials/hibernate/",
    },
  ],
});

T({
  id: "cloud-fundamentos",
  phase: "p-cloud",
  title: "Fundamentos de cloud (AWS, Azure, GCP)",
  level: "Intermediário",
  hours: 25,
  summary:
    "Modelos de serviço, os blocos básicos de computação, armazenamento, rede e banco, e o caminho até o AWS Cloud Practitioner.",
  body: `
<p>Seu roadmap indica o <strong>AWS Certified Cloud Practitioner</strong> neste ponto. É uma certificação de entrada: não aprofunda arquitetura, mas dá o vocabulário de nuvem que toda conversa de arquitetura usa.</p>
<h3>Modelos de serviço</h3>
<ul>
<li><strong>IaaS</strong>: você recebe máquinas virtuais e redes (EC2). Controle total, mais operação.</li>
<li><strong>PaaS / contêineres gerenciados</strong>: você entrega a aplicação ou a imagem (Elastic Beanstalk, ECS Fargate, App Runner, Cloud Run).</li>
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
      t: "Spring Boot lendo e gravando no S3 (AWS SDK v2)",
      src: `@Service
class ArmazenamentoNotas {
    private final S3Client s3;
    private final String bucket;

    ArmazenamentoNotas(S3Client s3, @Value("\${app.bucket}") String bucket) {
        this.s3 = s3; this.bucket = bucket;
    }

    void salvar(String chave, byte[] pdf) {
        s3.putObject(PutObjectRequest.builder()
                .bucket(bucket).key(chave).contentType("application/pdf")
                .serverSideEncryption(ServerSideEncryption.AES256).build(),
            RequestBody.fromBytes(pdf));
    }
}
// Credenciais NUNCA no código: em produção, use a role IAM da instância ou do contêiner.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Crie uma conta AWS com MFA no root, usuário IAM para o dia a dia e alarme de orçamento de US$ 5.",
    },
    {
      lvl: 1,
      text: "Faça o curso gratuito AWS Cloud Practitioner Essentials no AWS Skill Builder e agende a prova CLF-C02.",
    },
    {
      lvl: 2,
      text: "Publique sua API Spring Boot no App Runner ou ECS Fargate com banco RDS PostgreSQL e arquivos no S3. Documente o custo mensal estimado.",
    },
    {
      lvl: 3,
      text: "Desenhe a mesma arquitetura (API, banco, fila, armazenamento de arquivos) nos três provedores e compare custo e serviços gerenciados num ADR.",
    },
  ],
  refs: [
    {
      t: "AWS Certified Cloud Practitioner",
      u: "https://aws.amazon.com/certification/certified-cloud-practitioner/",
      note: "recomendação do seu roadmap",
    },
    {
      t: "AWS Skill Builder (cursos gratuitos)",
      u: "https://skillbuilder.aws/",
    },
    {
      t: "AWS Well-Architected Framework",
      u: "https://aws.amazon.com/architecture/well-architected/",
    },
    {
      t: "AWS Shared Responsibility Model",
      u: "https://aws.amazon.com/compliance/shared-responsibility-model/",
    },
    { t: "Spring Cloud AWS", u: "https://awspring.io/" },
    { t: "roadmap.sh: AWS", u: "https://roadmap.sh/aws" },
  ],
});

T({
  id: "capacidade",
  phase: "p-nfr",
  title: "Planejamento de capacidade",
  level: "Avançado",
  hours: 15,
  summary:
    "Latência vs. throughput, cálculo de carga (RPS), concorrência simultânea, utilização e saturação de recursos e taxa de erros.",
  body: `
<p>É o primeiro bloco dos Requisitos Não Funcionais no seu mapa. Planejar capacidade é responder com números: quantos usuários, quantas requisições, quanta máquina, quanto custa, e com que margem.</p>
<h3>Latência vs. throughput</h3>
<p><strong>Latência</strong>: quanto tempo uma requisição leva (meça em percentis: p50, p95, p99). <strong>Throughput</strong>: quantas requisições por segundo o sistema processa. Os dois se relacionam: perto da saturação, aumentar o throughput faz a latência explodir, porque as filas crescem de forma não linear.</p>
<h3>Calcular a carga (RPS)</h3>
<p>Parta do negócio: 2 milhões de usuários ativos por dia × 15 requisições cada = 30 milhões/dia. Dia ≈ 86.400 s → ~350 RPS em média. O tráfego não é uniforme: aplique um fator de pico (3x a 10x conforme o negócio; Black Friday pode ser 20x) → planeje para ~3.500 RPS.</p>
<h3>Calcular a concorrência simultânea</h3>
<p><strong>Lei de Little</strong>: concorrência = RPS × tempo de resposta. 3.500 RPS × 0,2 s = 700 requisições em andamento. Isso dimensiona threads, conexões de banco e instâncias.</p>
<h3>Utilização e saturação de recursos (método USE)</h3>
<p>Para cada recurso (CPU, memória, disco, rede, pool de conexões): <strong>U</strong>tilização (quanto está ocupado), <strong>S</strong>aturação (quanto trabalho está esperando na fila), <strong>E</strong>rros. Mire em até ~60–70% de utilização no pico para ter folga para falhas de instância e crescimento.</p>
<h3>Taxa de erros</h3>
<p>Parte do SLO: "menos de 0,1% de respostas 5xx". Sob sobrecarga, erros aumentam antes da queda total; monitorar a taxa de erro junto com a latência mostra a saturação chegando.</p>
`,
  code: [
    {
      t: "Planilha de capacidade em código",
      src: `record Premissas(long usuariosDia, int reqPorUsuario, double fatorPico,
                 double latenciaSeg, int rpsPorInstancia, double utilizacaoAlvo) {}

static void planejar(Premissas p) {
    double rpsMedio = p.usuariosDia() * p.reqPorUsuario() / 86_400.0;
    double rpsPico  = rpsMedio * p.fatorPico();
    double concorrencia = rpsPico * p.latenciaSeg();                 // lei de Little
    int instancias = (int) Math.ceil(rpsPico / (p.rpsPorInstancia() * p.utilizacaoAlvo()));
    int comRedundancia = instancias + 1;                             // N+1: suporta perder uma

    System.out.printf("""
        RPS médio: %.0f | RPS pico: %.0f
        Requisições simultâneas no pico: %.0f
        Instâncias: %d (+1 de redundância = %d)%n""",
        rpsMedio, rpsPico, concorrencia, instancias, comRedundancia);
}

planejar(new Premissas(2_000_000, 15, 10, 0.2, 400, 0.65));
// RPS médio: 347 | pico: 3472 | simultâneas: 694 | instâncias: 14 (+1 = 15)`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Calcule RPS médio, de pico e concorrência para 3 sistemas: app de banco (5 mi usuários), venda de ingressos (200 mil pessoas em 10 min) e intranet (2 mil funcionários).",
    },
    {
      lvl: 2,
      text: "Descubra o <code>rpsPorInstancia</code> real da sua API com k6 (o ponto em que o p99 passa do SLO) e refaça o plano com o número medido.",
    },
    {
      lvl: 3,
      text: "Escreva um documento de capacidade para o projeto final: premissas, cálculos, recursos (app, banco, cache), custo mensal e gatilhos para revisar o plano.",
    },
  ],
  refs: [
    {
      t: "Brendan Gregg: The USE Method",
      u: "https://www.brendangregg.com/usemethod.html",
    },
    {
      t: "Google SRE Book: Handling Overload",
      u: "https://sre.google/sre-book/handling-overload/",
    },
    {
      t: "Little's Law (explicação)",
      u: "https://en.wikipedia.org/wiki/Little%27s_law",
    },
    {
      t: "k6: tipos de teste de carga",
      u: "https://grafana.com/docs/k6/latest/testing-guides/test-types/",
    },
    {
      t: "Livro: The Art of Capacity Planning, 2ª ed. (Arun Kejariwal, John Allspaw)",
      u: "https://www.oreilly.com/library/view/the-art-of/9781491939154/",
    },
  ],
});

T({
  id: "antipatterns",
  phase: "p-nfr",
  title: "Anti-padrões de performance",
  level: "Avançado",
  hours: 12,
  summary:
    "Busy Database, Instanciação Imprópria, Persistência Monolítica, Noisy Neighbor, Retry Storm e No Caching: como reconhecer e corrigir.",
  body: `
<p>Seu roadmap lista seis anti-padrões que vêm do catálogo do Azure Architecture Center. Eles aparecem em qualquer nuvem e em qualquer linguagem; reconhecê-los num incidente economiza horas.</p>
<dl class="defs">
<dt>Busy Database</dt><dd>Lógica de negócio pesada dentro do banco (procedures enormes, formatação de dados, cálculos) num recurso que é caro de escalar. <em>Correção</em>: mova o processamento para a camada de aplicação, que escala horizontalmente; deixe o banco fazer o que faz bem.</dd>
<dt>Instanciação imprópria (Improper Instantiation)</dt><dd>Criar a cada requisição objetos feitos para serem reutilizados: <code>HttpClient</code>, <code>ObjectMapper</code>, clients do SDK da AWS, pools de conexão. Esgota sockets e memória. <em>Correção</em>: instâncias únicas e thread-safe como beans do Spring.</dd>
<dt>Persistência monolítica (Monolithic Persistence)</dt><dd>Um único banco para dados com padrões de acesso muito diferentes (transações, logs, sessões, arquivos, busca). Um tipo de carga derruba os outros. <em>Correção</em>: separe por padrão de uso (relacional, cache, object storage, busca).</dd>
<dt>Noisy Neighbor</dt><dd>Em sistemas compartilhados, um cliente (tenant) ou processo consome recursos demais e prejudica todos. <em>Correção</em>: limites e cotas por tenant, rate limiting, bulkheads, isolar tenants grandes.</dd>
<dt>Retry Storm</dt><dd>Clientes repetindo imediatamente chamadas a um serviço que já está sobrecarregado, multiplicando a carga e impedindo a recuperação. <em>Correção</em>: backoff exponencial com jitter, limite de tentativas, circuit breaker, orçamento de retries.</dd>
<dt>No Caching</dt><dd>Buscar repetidamente na origem dados que mudam pouco. <em>Correção</em>: cache-aside com TTL adequado, cache HTTP e CDN.</dd>
</dl>
<p>O catálogo completo inclui outros, como <em>Chatty I/O</em>, <em>Extraneous Fetching</em> e <em>Synchronous I/O</em>. Vale ler todos.</p>
`,
  code: [
    {
      t: "Instanciação imprópria e a correção",
      src: `// ERRADO: novo client (e novo pool de conexões) a cada chamada
public Cotacao cotar(String moeda) {
    var client = HttpClient.newHttpClient();
    var mapper = new ObjectMapper();
    var resp = client.send(HttpRequest.newBuilder(URI.create(url + moeda)).build(),
                           HttpResponse.BodyHandlers.ofString());
    return mapper.readValue(resp.body(), Cotacao.class);
}

// CERTO: um client compartilhado, configurado uma vez, injetado
@Configuration
class Clients {
    @Bean
    RestClient cotacoes(RestClient.Builder b) {
        return b.baseUrl("https://api.cotacoes.exemplo").build();  // pool reutilizado
    }
}`,
    },
    {
      t: "Evitando retry storm",
      src: `RetryConfig config = RetryConfig.custom()
    .maxAttempts(3)
    .intervalFunction(IntervalFunction.ofExponentialRandomBackoff(
        Duration.ofMillis(200), 2.0, 0.5))      // backoff exponencial + jitter
    .retryOnException(e -> e instanceof IOException)  // só erros transitórios
    .build();
// Combine com circuit breaker: se o serviço está doente, pare de insistir.`,
    },
  ],
  exercises: [
    {
      lvl: 1,
      text: "Para cada anti-padrão, escreva um exemplo em Java ou SQL que o causa e a versão corrigida.",
    },
    {
      lvl: 2,
      text: "Reproduza um retry storm: 3 instâncias chamando um serviço lento com retry imediato. Meça a carga no serviço e repita com backoff, jitter e circuit breaker.",
    },
    {
      lvl: 3,
      text: "Analise um sistema que você conhece procurando os seis anti-padrões e escreva um relatório priorizado com evidências e correções.",
    },
  ],
  refs: [
    {
      t: "Azure Architecture Center: Performance antipatterns",
      u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/",
      note: "a origem dos itens do seu roadmap",
    },
    {
      t: "Busy Database antipattern",
      u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/busy-database/",
    },
    {
      t: "Retry Storm antipattern",
      u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/retry-storm/",
    },
    {
      t: "Noisy Neighbor antipattern",
      u: "https://learn.microsoft.com/en-us/azure/architecture/antipatterns/noisy-neighbor/noisy-neighbor",
    },
    {
      t: "AWS Builders' Library: Timeouts, retries and backoff with jitter",
      u: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
    },
  ],
});

T({
  id: "aws-sa",
  phase: "p-final",
  title: "Certificações AWS Solutions Architect",
  level: "Avançado",
  hours: 80,
  summary:
    "Plano de estudo para Associate e Professional, alinhado ao Well-Architected e ao que você já estudou na trilha.",
  body: `
<p>Seu roadmap recomenda as duas certificações de arquiteto da AWS antes do System Design. Elas validam o que você estudou nas etapas anteriores aplicado a serviços reais e têm peso forte no mercado para vagas de arquiteto de soluções.</p>
<h3>Solutions Architect – Associate (SAA-C03)</h3>
<p>Quatro domínios: arquiteturas seguras, resilientes, de alto desempenho e com custo otimizado. Na prática: VPC (subnets públicas e privadas, NAT, security groups), IAM, EC2 e Auto Scaling, ELB, S3 e classes de armazenamento, RDS/Aurora (Multi-AZ vs. réplicas de leitura), DynamoDB, ElastiCache, SQS/SNS/EventBridge, Lambda, CloudFront, Route 53, CloudWatch, KMS.</p>
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
  name    = "loja"
  cidr    = "10.0.0.0/16"
  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]   # ALB
  private_subnets = ["10.0.11.0/24", "10.0.12.0/24"] # app e banco
  enable_nat_gateway = true
  single_nat_gateway = true    # economia em laboratório; em produção, um por AZ
}

resource "aws_db_instance" "loja" {
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
    {
      lvl: 1,
      text: "Monte um plano de 10 semanas para a SAA-C03 cruzando cada domínio da prova com os tópicos desta trilha que você já estudou.",
    },
    {
      lvl: 2,
      text: "Construa com Terraform: VPC em 2 AZs, ALB, Auto Scaling da sua API, RDS Multi-AZ, ElastiCache e CloudFront. Derrube uma AZ simulada e observe o failover.",
    },
    {
      lvl: 2,
      text: "Implemente e teste uma estratégia pilot light para o projeto final em outra região. Meça o RTO real.",
    },
    {
      lvl: 3,
      text: "Depois da Associate, escolha um cenário multi-conta (3 times, ambientes dev/prod, rede compartilhada) e desenhe a solução no nível exigido pela Professional, com ADRs.",
    },
  ],
  refs: [
    {
      t: "AWS Certified Solutions Architect – Associate",
      u: "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
    },
    {
      t: "AWS Certified Solutions Architect – Professional",
      u: "https://aws.amazon.com/certification/certified-solutions-architect-professional/",
    },
    { t: "AWS Architecture Center", u: "https://aws.amazon.com/architecture/" },
    {
      t: "AWS: Disaster Recovery of Workloads on AWS (whitepaper)",
      u: "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html",
    },
    { t: "AWS Skill Builder", u: "https://skillbuilder.aws/" },
    {
      t: "Terraform AWS modules",
      u: "https://registry.terraform.io/namespaces/terraform-aws-modules",
    },
  ],
});

/* =====================================================================
   Complementos nos tópicos que já existiam, para cobrir os itens do mapa
   ===================================================================== */
function patch(id, o) {
  const t = TOPICS.find((x) => x.id === id);
  if (o.title) t.title = o.title;
  if (o.summary) t.summary = o.summary;
  if (o.append) t.body += o.append;
  if (o.code) t.code.push(...o.code);
  if (o.ex) t.exercises.push(...o.ex);
  if (o.refs) t.refs.push(...o.refs);
}

patch("clean-code", {
  title: "Clean Code e princípios de qualidade (DRY, KISS, YAGNI)",
  summary:
    "As regras de Clean Code do seu mapa e os princípios DRY, KISS e YAGNI, com o contraponto de A Philosophy of Software Design.",
  append: `
<h3>As regras do seu roadmap</h3>
<ul>
<li><strong>A regra do escoteiro</strong>: deixe o código um pouco melhor do que encontrou.</li>
<li><strong>Use nomes significativos</strong> e <strong>seja consistente</strong> (o mesmo conceito, o mesmo nome em todo lugar).</li>
<li><strong>Mantenha classes, métodos e arquivos pequenos</strong>, com <strong>formatação e estilo</strong> padronizados (use um formatador automático no build).</li>
<li><strong>Comente apenas o necessário</strong>: o porquê, nunca o quê.</li>
<li><strong>Evite abstrações precipitadas e refatore sempre.</strong></li>
<li><strong>Minimize a complexidade ciclomática</strong>: menos caminhos possíveis, menos testes necessários, menos bugs.</li>
<li><strong>Prefira exceções a códigos de erro</strong>, e <strong>evite passar booleanos e nulos</strong> (use Optional, Null Object ou métodos separados).</li>
<li><strong>Testes de unidade</strong> e <strong>funções puras</strong> (sem efeito colateral) tornam o código previsível e fácil de testar.</li>
</ul>
<h3>Princípios de qualidade de código</h3>
<dl class="defs">
<dt>DRY: Don't Repeat Yourself</dt><dd>Cada <em>conhecimento</em> deve ter uma única representação. Atenção: duplicação de texto não é o mesmo que duplicação de conhecimento. Duas regras iguais hoje que mudam por motivos diferentes não devem ser unificadas.</dd>
<dt>KISS: Keep It Simple, Stupid</dt><dd>A solução mais simples que resolve o problema real. Complexidade precisa justificar o próprio custo.</dd>
<dt>YAGNI: You Aren't Gonna Need It</dt><dd>Não construa hoje o que talvez seja preciso amanhã. Generalidade especulativa é código para manter sem benefício.</dd>
</dl>`,
  ex: [
    {
      lvl: 2,
      text: "Configure Checkstyle ou Spotless e a regra de complexidade ciclomática do SonarQube no build. Corrija os 10 métodos mais complexos de um projeto seu.",
    },
  ],
  refs: [
    {
      t: "Livro: Código Limpo (Robert C. Martin)",
      u: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
      note: "indicado no seu quadro",
    },
    {
      t: "Livro: O Programador Pragmático, 2ª ed. (Hunt & Thomas)",
      u: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      note: "origem do DRY; indicado no seu quadro",
    },
  ],
});

patch("solid", {
  title: "Orientação a Objetos avançada: SOLID e Object Calisthenics",
  append: `
<h3>Object Calisthenics</h3>
<p>Nove regras de Jeff Bay, propositalmente rígidas, para treinar design orientado a objetos. Use como exercício, não como lei:</p>
<ol>
<li>Apenas um nível de indentação por método.</li>
<li>Não use ELSE.</li>
<li>Envolva todos os tipos primitivos e Strings (crie Value Objects).</li>
<li>Coleções de primeira classe (uma classe que só contém a coleção e seu comportamento).</li>
<li>Apenas um ponto por linha (Lei de Demeter).</li>
<li>Não abrevie nomes.</li>
<li>Mantenha as entidades pequenas (classes de até ~50 linhas).</li>
<li>No máximo duas variáveis de instância por classe.</li>
<li>Sem getters e setters: peça ao objeto para fazer, não pergunte pelos dados (Tell, Don't Ask).</li>
</ol>`,
  code: [
    {
      t: "Coleção de primeira classe e Tell, Don't Ask",
      src: `// Antes: quem usa precisa saber como calcular
if (carrinho.getItens().stream().mapToInt(Item::getQtd).sum() > 0) { ... }

// Depois: a coleção tem comportamento próprio
public final class Itens {
    private final List<Item> itens;
    public Itens(List<Item> itens) { this.itens = List.copyOf(itens); }
    public boolean vazio() { return itens.isEmpty(); }
    public Dinheiro total() { return itens.stream().map(Item::subtotal).reduce(Dinheiro.ZERO, Dinheiro::mais); }
    public Itens com(Item novo) { var l = new ArrayList<>(itens); l.add(novo); return new Itens(l); }
}

if (!carrinho.itens().vazio()) { ... }`,
    },
  ],
  ex: [
    {
      lvl: 2,
      text: "Faça uma kata (ex.: Bank Account ou Tennis) seguindo as 9 regras de Object Calisthenics à risca. Depois escreva quais regras você manteria no dia a dia.",
    },
  ],
  refs: [
    {
      t: "William Durand: Object Calisthenics",
      u: "https://williamdurand.fr/2013/06/03/object-calisthenics/",
    },
  ],
});

patch("testes", {
  append: `
<h3>A proporção do seu roadmap</h3>
<p>Seu mapa sugere a pirâmide clássica: cerca de <strong>80% testes unitários</strong>, <strong>15% de integração</strong> e <strong>5% funcionais/ponta a ponta</strong>. Use como ponto de partida: o que importa é que a maior parte do feedback seja rápida e que os testes lentos cubram os fluxos que mais importam ao negócio.</p>`,
});

patch("apis", {
  title: "APIs & Integrações: REST, HATEOAS, gRPC, GraphQL e HTTP/3",
  append: `
<h3>HATEOAS e HTTP/3</h3>
<p><strong>HATEOAS</strong> (Hypermedia as the Engine of Application State) é o nível mais alto de maturidade REST: a resposta traz links para as próximas ações possíveis, e o cliente navega por eles em vez de montar URLs. Em Java, use <strong>Spring HATEOAS</strong>. É raro em APIs públicas, mas útil em fluxos com estados (um pedido só expõe o link de cancelamento quando pode ser cancelado).</p>
<p><strong>HTTP/3</strong> roda sobre <strong>QUIC</strong> (UDP): conexões mais rápidas, sem bloqueio entre fluxos quando um pacote se perde, e troca de rede (Wi-Fi para 4G) sem perder a conexão. Normalmente é habilitado na borda (CDN, load balancer), não na sua aplicação.</p>`,
  code: [
    {
      t: "HATEOAS com Spring: links conforme o estado",
      src: `@GetMapping("/pedidos/{id}")
EntityModel<PedidoResposta> buscar(@PathVariable UUID id) {
    var p = pedidos.buscar(id);
    var model = EntityModel.of(PedidoResposta.de(p),
        linkTo(methodOn(PedidoController.class).buscar(id)).withSelfRel());
    if (p.podeSerCancelado())
        model.add(linkTo(methodOn(PedidoController.class).cancelar(id, null)).withRel("cancelar"));
    if (p.podeSerPago())
        model.add(linkTo(methodOn(PagamentoController.class).pagar(id, null)).withRel("pagar"));
    return model;
}`,
    },
  ],
  refs: [
    {
      t: "Martin Fowler: Richardson Maturity Model",
      u: "https://martinfowler.com/articles/richardsonMaturityModel.html",
    },
    {
      t: "Spring HATEOAS",
      u: "https://docs.spring.io/spring-hateoas/docs/current/reference/html/",
    },
  ],
});

patch("spring", {
  title: "Model-View-Controller com Spring Boot 4",
  summary:
    "O padrão MVC, por que escolher Spring Boot entre os frameworks do seu mapa, e Spring em profundidade.",
  body: undefined,
});
(function () {
  const t = TOPICS.find((x) => x.id === "spring");
  t.body =
    `
<h3>O padrão Model-View-Controller</h3>
<p>MVC separa a aplicação em três papéis: <strong>Model</strong> (dados e regras), <strong>View</strong> (apresentação) e <strong>Controller</strong> (recebe a requisição, aciona o model e escolhe a resposta). Em APIs REST, a "view" é a representação JSON. O ganho é separar o que muda por motivos diferentes: tela, fluxo e regra.</p>
<p>Seu roadmap lista vários frameworks MVC (NestJS, Laravel, Spring Boot, Flask, Symfony, Ruby on Rails, ASP.NET, Django). Como sua linguagem é Java, o caminho é <strong>Spring Boot</strong>, o framework dominante no backend Java. No Spring, <code>@Controller</code>/<code>@RestController</code> são os controllers, entidades e serviços formam o model, e a view é Thymeleaf (páginas) ou JSON.</p>
<div class="callout"><b>Limite do MVC</b>MVC organiza a camada de entrada, não o sistema inteiro. Controllers gordos com regra de negócio são o problema mais comum. Mais adiante, na etapa de Arquiteto, você vai ver como hexagonal e DDD organizam o que fica atrás do controller.</div>
` + t.body;
})();

patch("o-que-e", {
  title: "Arquitetura de Software: níveis, tipos de arquiteto e papéis",
  append: `
<h3>Níveis de arquitetura e tipos de arquiteto</h3>
<table class="tbl"><thead><tr><th>Nível</th><th>Escopo</th><th>Quem cuida</th></tr></thead><tbody>
<tr><td>Arquitetura de aplicação</td><td>A estrutura interna de um sistema: módulos, camadas, padrões (<em>low-level design</em>, LLD)</td><td>Arquiteto de Software</td></tr>
<tr><td>Arquitetura de solução</td><td>Como vários sistemas, serviços de nuvem e integrações resolvem um problema de negócio (<em>high-level design</em>, HLD)</td><td>Arquiteto de Soluções</td></tr>
<tr><td>Arquitetura corporativa</td><td>O portfólio de sistemas da empresa inteira, padrões, governança e alinhamento à estratégia (TOGAF)</td><td>Arquiteto Corporativo</td></tr>
</tbody></table>
<h3>Papéis e responsabilidades: requisitos funcionais e não funcionais</h3>
<p><strong>Requisitos funcionais</strong> dizem o que o sistema faz: "o sistema deve enviar um e-mail de confirmação após o cadastro", "o usuário deve fazer login com e-mail e senha". <strong>Requisitos não funcionais</strong> dizem como ele precisa se comportar: "disponível 99,9% do tempo", "suportar 1 milhão de usuários", "responder em até 200 ms". O arquiteto garante que os não funcionais sejam explícitos, mensuráveis e guiem as decisões, porque são eles que definem a arquitetura.</p>`,
});

patch("event-storming", {
  title: "Ferramentas de descoberta: EventStorming e outras",
  summary:
    "EventStorming, Business Model Canvas, User Story Mapping e Domain Storytelling para descobrir o domínio com o negócio.",
  append: `
<h3>As outras ferramentas do seu roadmap</h3>
<dl class="defs">
<dt>Business Model Canvas</dt><dd>Nove blocos (segmentos de clientes, proposta de valor, canais, relacionamento, receitas, recursos, atividades, parcerias, custos) numa página. Ajuda a entender o negócio e a identificar o subdomínio core: onde está a vantagem competitiva.</dd>
<dt>User Story Mapping</dt><dd>De Jeff Patton: as atividades do usuário em ordem na horizontal, as histórias detalhadas abaixo, fatiadas em releases. Mostra o fluxo inteiro e ajuda a definir o MVP sem perder a visão do todo.</dd>
<dt>Domain Storytelling</dt><dd>Especialistas contam como trabalham e alguém desenha a história com pictogramas (atores, objetos de trabalho, atividades numeradas). Ótimo para processos com muitas pessoas e documentos.</dd>
</dl>`,
  refs: [
    {
      t: "Strategyzer: Business Model Canvas",
      u: "https://www.strategyzer.com/library/the-business-model-canvas",
    },
    {
      t: "Jeff Patton: User Story Mapping",
      u: "https://jpattonassociates.com/story-mapping/",
    },
  ],
});

patch("ddd-tatico", {
  append: `
<h3>Factory</h3>
<p>Quando criar um agregado exige regras ou montar várias partes, a criação vai para uma <strong>Factory</strong> (método estático no próprio agregado, como <code>Pedido.criar(...)</code>, ou classe dedicada). Assim o construtor não vira um labirinto e o objeto nunca nasce em estado inválido.</p>`,
  refs: [
    {
      t: "Livro: Aprenda Domain-Driven Design (Vlad Khononov)",
      u: "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/",
      note: "indicado no seu quadro",
    },
  ],
});

patch("seguranca", {
  title: "Segurança como requisito arquitetural",
  append: `
<h3>Proteções de borda do seu roadmap</h3>
<ul>
<li><strong>VPN</strong> para acesso administrativo a redes privadas; bancos e serviços internos nunca expostos à internet.</li>
<li><strong>WAF</strong> (Web Application Firewall: AWS WAF, Cloudflare): bloqueia padrões de ataque conhecidos (injeção SQL, XSS, bots) antes de chegarem à aplicação.</li>
<li><strong>DDoS</strong>: mitigação na borda (AWS Shield, Cloudflare), CDN absorvendo tráfego, rate limiting e autoscaling com limites de custo.</li>
<li><strong>SQL Injection</strong>: sempre consultas parametrizadas (JPA, <code>JdbcClient</code> com parâmetros); nunca concatenação de strings.</li>
<li><strong>Criptografia de dados</strong>: TLS em trânsito, criptografia em repouso com chaves gerenciadas (KMS), e criptografia de campo para dados muito sensíveis.</li>
</ul>`,
});

patch("cache", { title: "Cache Aside, CDN e cache em todas as camadas" });
patch("concorrencia", { title: "Concorrência, paralelismo e virtual threads" });
patch("escalabilidade", {
  title: "Escalabilidade: vertical, horizontal e elasticidade",
  append: `
<h3>Gargalos (bottlenecks)</h3>
<p>Escalar uma parte só move o gargalo para a próxima. Antes de adicionar instâncias, descubra o recurso saturado (CPU, banco, pool de conexões, serviço externo) com métricas USE. Muitas vezes o gargalo é o banco, e a resposta é cache, réplicas de leitura ou filas, não mais servidores de aplicação.</p>`,
});
patch("dados-escala", {
  title: "Banco de dados e estratégia de leitura: replicação e sharding",
});
patch("distribuidos", {
  title: "Consistência de dados: CAP, PACELC e ACID vs BASE",
  append: `
<h3>ACID vs BASE</h3>
<p><strong>ACID</strong> (Atomicidade, Consistência, Isolamento, Durabilidade) é o modelo dos bancos relacionais: transações corretas, ao custo de coordenação. <strong>BASE</strong> (Basically Available, Soft state, Eventual consistency) é o modelo de muitos sistemas distribuídos e NoSQL: disponível e escalável, aceitando que as réplicas fiquem temporariamente diferentes. Sistemas reais misturam os dois: ACID dentro de um serviço, BASE entre serviços.</p>`,
});
patch("saga-outbox", { title: "Idempotência, Sagas e Outbox" });
patch("resiliencia", {
  title: "Disponibilidade, resiliência e tolerância a falhas",
  append: `
<h3>Redundância, failover e zero downtime</h3>
<p><strong>Redundância</strong>: nenhum ponto único de falha (instâncias em várias zonas, banco Multi-AZ). <strong>Failover</strong>: troca automática para a réplica quando a principal falha; teste de verdade, porque failover nunca testado costuma falhar. <strong>Zero downtime deployment</strong>: rolling, blue/green ou canary, com migrações de banco compatíveis (expand/contract). <strong>Graceful degradation</strong>: perder uma função secundária sem perder o fluxo principal.</p>`,
});
patch("observabilidade", { title: "Tracing, monitoramento e SRE" });
patch("system-design", {
  summary:
    "O último passo do seu roadmap: um método para desenhar sistemas do zero, estimativas e estudos de caso clássicos.",
  refs: [
    {
      t: "ByteByteGo: Technical Interview Prep",
      u: "https://bytebytego.com/",
      note: "indicado no seu quadro",
    },
  ],
});
patch("containers-k8s", { title: "Do Docker ao Kubernetes" });
patch("camadas-monolito", { title: "Arquitetura em camadas e monolito" });
patch("outros-estilos", { title: "Arquitetura Serverless e outros estilos" });
patch("microsservicos", {
  title: "Arquitetura de Microsserviços",
  refs: [
    {
      t: "Livro: Criando Microsserviços, 2ª ed. (Sam Newman)",
      u: "https://samnewman.io/books/building_microservices_2nd_edition/",
      note: "indicado no seu quadro",
    },
  ],
});
patch("eda", { title: "Arquitetura Orientada a Eventos (EDA)" });
patch("modulith", { title: "Monolito modular com Spring Modulith" });
patch("hexagonal", { title: "Clean Architecture, Hexagonal e Onion" });
patch("build-git", {
  title: "Git, repositórios remotos e build",
  append: `
<h3>Repositórios remotos</h3>
<p><strong>GitHub</strong>, <strong>GitLab</strong> e <strong>Bitbucket</strong> hospedam o repositório e o fluxo de colaboração: pull/merge requests, revisão de código, proteção de branch, issues e CI. Aprenda o fluxo completo: fork ou branch, commit, push, pull request, revisão, merge. O GitHub também é o seu portfólio: mantenha o projeto final público e bem documentado.</p>`,
});
patch("sql", {
  title: "SQL e bancos relacionais",
  append: `
<h3>Escolha um banco</h3>
<p>Seu roadmap lista MySQL, SQLite, PostgreSQL, MariaDB e Oracle. Para esta trilha, use <strong>PostgreSQL</strong>: é open source, o mais completo, muito usado em projetos novos e disponível gerenciado em todas as nuvens. O SQL que você aprender vale para os outros com pequenas diferenças de dialeto.</p>`,
});

/* =====================================================================
   Estrutura: as etapas e tópicos exatamente na ordem do "Mapa do Arquiteto"
   ===================================================================== */
var STAGES = [
  {
    id: "s1",
    title: "Largada → Programador Júnior",
    short: "Júnior",
    milestone: "Programador Júnior",
  },
  {
    id: "s2",
    title: "Programador Pleno / Sênior",
    short: "Pleno/Sênior",
    milestone: "Programador Completo",
  },
  {
    id: "s3",
    title: "Arquiteto de Software",
    short: "Arquiteto de Software",
    milestone: "Arquiteto de Software",
  },
  {
    id: "s4",
    title: "Arquiteto de Soluções",
    short: "Arquiteto de Soluções",
    milestone: "Parabéns!",
  },
  {
    id: "s5",
    title: "Além do mapa: fora da curva",
    short: "Fora da curva",
    milestone: null,
  },
];

PHASES = [
  {
    id: "p-fund",
    stage: "s1",
    title: "Fundamentos",
    weeks: "3–4 sem",
    goal: "Entender a máquina onde seu código roda: hardware, memória, SO, compilação e Linux.",
  },
  {
    id: "p-ling",
    stage: "s1",
    title: "Escolha uma linguagem: Java",
    weeks: "8–10 sem",
    goal: "Lógica, algoritmos e estruturas de dados, paradigmas, POO e o Java moderno com a JVM.",
  },
  {
    id: "p-sql",
    stage: "s1",
    title: "SQL e bancos relacionais",
    weeks: "3–4 sem",
    goal: "CRUD, relacionamentos, ACID e transações no PostgreSQL.",
  },
  {
    id: "p-git",
    stage: "s1",
    title: "Versionamento de código",
    weeks: "1–2 sem",
    goal: "Git, repositórios remotos (GitHub, GitLab, Bitbucket) e build com Maven.",
  },
  {
    id: "p-web",
    stage: "s1",
    title: "Redes e Internet",
    weeks: "5–6 sem",
    goal: "Fundamentos da Web, segurança web e APIs & integrações.",
  },
  {
    id: "p-mvc",
    stage: "s1",
    title: "Model-View-Controller (MVC)",
    weeks: "5–6 sem",
    goal: "O padrão MVC e o framework escolhido: Spring Boot.",
  },
  {
    id: "p-docker",
    stage: "s1",
    title: "Docker",
    weeks: "2–3 sem",
    goal: "Conteinerização, comandos, imagens, volumes, redes, Dockerfile e Compose.",
  },

  {
    id: "p-nosql",
    stage: "s2",
    title: "Mais sobre bancos de dados",
    weeks: "2–3 sem",
    goal: "Bancos não relacionais: documentos, chave-valor, grafos e busca.",
  },
  {
    id: "p-qual",
    stage: "s2",
    title: "Clean Code e Orientação a Objetos avançada",
    weeks: "4–5 sem",
    goal: "Clean Code, DRY/KISS/YAGNI, SOLID e Object Calisthenics.",
  },
  {
    id: "p-testes",
    stage: "s2",
    title: "Testes automatizados",
    weeks: "3–4 sem",
    goal: "Pirâmide de testes (80/15/5), TDD e testes de arquitetura.",
  },
  {
    id: "p-patterns",
    stage: "s2",
    title: "Design Patterns",
    weeks: "3–4 sem",
    goal: "Padrões estruturais, comportamentais e criacionais do GoF.",
  },
  {
    id: "p-refac",
    stage: "s2",
    title: "Técnicas de refactoring",
    weeks: "2–3 sem",
    goal: "Débito técnico, code smells e o catálogo de refatorações.",
  },
  {
    id: "p-perf",
    stage: "s2",
    title: "Otimização e performance",
    weeks: "4–5 sem",
    goal: "Cache aside, jobs assíncronos, concorrência e paralelismo, SQL e CDN.",
  },
  {
    id: "p-cloud",
    stage: "s2",
    title: "Cloud providers e pipelines de CI/CD",
    weeks: "4–5 sem",
    goal: "Básico de AWS/Azure/GCP (Cloud Practitioner) e pipelines de entrega.",
  },

  {
    id: "p-arq",
    stage: "s3",
    title: "Arquitetura de Software",
    weeks: "4–5 sem",
    goal: "Níveis, tipos de arquiteto, requisitos, decisões (ADRs) e documentação (C4).",
  },
  {
    id: "p-ddd",
    stage: "s3",
    title: "Domain-Driven Design",
    weeks: "6–8 sem",
    goal: "Modelagem estratégica, ferramentas de descoberta e modelagem tática.",
  },
  {
    id: "p-estilos",
    stage: "s3",
    title: "Estilos de arquitetura",
    weeks: "8–10 sem",
    goal: "Camadas (Clean, Hexagonal, Onion), monolito modular, microsserviços, EDA e serverless.",
  },

  {
    id: "p-nfr",
    stage: "s4",
    title: "Requisitos não funcionais: capacidade e escala",
    weeks: "6–8 sem",
    goal: "Planejamento de capacidade, escalabilidade, estratégia de dados e anti-padrões de performance.",
  },
  {
    id: "p-consist",
    stage: "s4",
    title: "Consistência de dados",
    weeks: "4–5 sem",
    goal: "Tipos de consistência, CAP, idempotência, ACID vs BASE, sagas e CQRS.",
  },
  {
    id: "p-disp",
    stage: "s4",
    title: "Disponibilidade e resiliência",
    weeks: "4–5 sem",
    goal: "Redundância, failover, zero downtime, graceful degradation, chaos e tracing.",
  },
  {
    id: "p-seg",
    stage: "s4",
    title: "Segurança como requisito arquitetural",
    weeks: "3–4 sem",
    goal: "VPN, WAF, DDoS, SQL injection, criptografia, identidade e modelagem de ameaças.",
  },
  {
    id: "p-final",
    stage: "s4",
    title: "AWS Solutions Architect e System Design",
    weeks: "10–12 sem",
    goal: "As certificações recomendadas e a prática de system design que fecha o mapa.",
  },

  {
    id: "p-extra",
    stage: "s5",
    title: "Diferenciais do arquiteto",
    weeks: "contínuo",
    goal: "Arquitetura evolutiva, times e Conway, liderança técnica e IA na arquitetura.",
  },
];
PHASES.forEach((p, i) => (p.n = i + 1));

const ORDEM = {
  "p-fund": ["fundamentos-computacao"],
  "p-ling": ["poo", "estruturas", "java-moderno", "jvm"],
  "p-sql": ["sql"],
  "p-git": ["build-git"],
  "p-web": ["web-fundamentos", "seguranca-web", "apis"],
  "p-mvc": ["spring"],
  "p-docker": ["docker", "containers-k8s"],
  "p-nosql": ["nosql"],
  "p-qual": ["clean-code", "solid"],
  "p-testes": ["testes"],
  "p-patterns": ["patterns"],
  "p-refac": ["refatoracao"],
  "p-perf": ["cache", "performance-jobs", "concorrencia"],
  "p-cloud": ["cloud-fundamentos", "cicd-iac"],
  "p-arq": ["o-que-e", "caracteristicas", "decisoes", "documentacao"],
  "p-ddd": ["ddd-estrategico", "event-storming", "ddd-tatico"],
  "p-estilos": [
    "camadas-monolito",
    "hexagonal",
    "modulith",
    "microsservicos",
    "eda",
    "outros-estilos",
  ],
  "p-nfr": ["capacidade", "escalabilidade", "dados-escala", "antipatterns"],
  "p-consist": ["distribuidos", "saga-outbox", "cqrs-es"],
  "p-disp": ["resiliencia", "observabilidade"],
  "p-seg": ["seguranca"],
  "p-final": ["aws-sa", "system-design"],
  "p-extra": ["evolutiva", "times", "soft-skills", "ia"],
};
(function () {
  const novo = [];
  Object.entries(ORDEM).forEach(([ph, ids]) =>
    ids.forEach((id) => {
      const t = TOPICS.find((x) => x.id === id);
      if (!t) throw new Error("Tópico ausente: " + id);
      t.phase = ph;
      novo.push(t);
    }),
  );
  if (novo.length !== TOPICS.length)
    throw new Error(
      "Tópicos fora da ordem: " +
        TOPICS.filter((t) => !novo.includes(t)).map((t) => t.id),
    );
  TOPICS.length = 0;
  TOPICS.push(...novo);
})();

CAPSTONE = {
  title: "Projeto final: plataforma de marketplace",
  intro:
    "Um único projeto que cresce junto com você, etapa por etapa do seu mapa. No fim, ele é o seu portfólio: código, ADRs, diagramas C4, dashboards e um texto contando a evolução. Um sistema que evoluiu com decisões registradas vale muito mais em entrevista do que dez tutoriais.",
  steps: [
    {
      f: "Júnior",
      t: "Primeira versão",
      d: "Java 25 com POO bem feita, PostgreSQL, Git com histórico limpo no GitHub, API REST com Spring Boot (MVC), login com Spring Security e tudo rodando com Docker Compose.",
    },
    {
      f: "Pleno/Sênior",
      t: "Qualidade e performance",
      d: "Clean Code, SOLID e padrões onde fazem sentido; pirâmide de testes com Testcontainers; refatorações registradas; cache, jobs assíncronos, busca em MongoDB ou OpenSearch; pipeline de CI/CD e deploy na AWS.",
    },
    {
      f: "Arquiteto de Software",
      t: "Arquitetura explícita",
      d: "ADRs, C4, EventStorming do checkout, bounded contexts, monolito modular com Spring Modulith e hexagonal no módulo core; depois, extração de dois módulos como microsserviços orientados a eventos.",
    },
    {
      f: "Arquiteto de Soluções",
      t: "Pronto para escala",
      d: "Plano de capacidade com números medidos, réplicas e CQRS, sagas com outbox, Resilience4j, OpenTelemetry com SLOs, WAF e criptografia, infraestrutura em Terraform multi-AZ e uma estratégia de DR testada.",
    },
    {
      f: "Fora da curva",
      t: "Diferenciais",
      d: "Fitness functions no CI, assistente de arquitetura com Spring AI sobre os seus ADRs, um artigo público por etapa e uma apresentação de 20 minutos da evolução do sistema.",
    },
  ],
};

BOOKS = [
  {
    t: "Código Limpo",
    a: "Robert C. Martin",
    f: "p-qual",
    why: "Indicado no seu quadro. A base de boas práticas de código; leia com senso crítico.",
  },
  {
    t: "O Programador Pragmático, 2ª ed.",
    a: "David Thomas, Andrew Hunt",
    f: "p-qual",
    why: "Indicado no seu quadro. Hábitos e princípios (DRY entre eles) de quem faz software bem.",
  },
  {
    t: "Refatoração, 2ª ed.",
    a: "Martin Fowler",
    f: "p-refac",
    why: "Indicado no seu quadro. O catálogo de refatorações e como aplicá-las com segurança.",
  },
  {
    t: "Arquitetura Limpa",
    a: "Robert C. Martin",
    f: "p-estilos",
    why: "Indicado no seu quadro. Regra de dependência e SOLID em nível de componentes.",
  },
  {
    t: "Domain-Driven Design",
    a: "Eric Evans",
    f: "p-ddd",
    why: "Indicado no seu quadro. O clássico que deu nome a tudo; denso, leia depois do Khononov.",
  },
  {
    t: "Aprenda Domain-Driven Design",
    a: "Vlad Khononov",
    f: "p-ddd",
    why: "Indicado no seu quadro. A introdução mais clara ao DDD estratégico e tático.",
  },
  {
    t: "Criando Microsserviços, 2ª ed.",
    a: "Sam Newman",
    f: "p-estilos",
    why: "Indicado no seu quadro. O guia mais equilibrado, inclusive sobre quando não usar.",
  },
  {
    t: "Migrando Sistemas Monolíticos para Microsserviços",
    a: "Sam Newman",
    f: "p-estilos",
    why: "Indicado no seu quadro. Strangler Fig e padrões de migração incremental.",
  },
  {
    t: "Building Event-Driven Microservices",
    a: "Adam Bellemare",
    f: "p-estilos",
    why: "Indicado no seu quadro. Eventos, Kafka e dados entre serviços.",
  },
  {
    t: "System Design Interview, vol. 1 e 2",
    a: "Alex Xu",
    f: "p-final",
    why: "Indicados no seu quadro. Estudos de caso para treinar system design.",
  },
  {
    t: "Fundamentals of Software Architecture, 2ª ed.",
    a: "Mark Richards, Neal Ford",
    f: "p-arq",
    why: "Complemento. A melhor visão geral do papel do arquiteto: características, estilos e decisões.",
  },
  {
    t: "Designing Data-Intensive Applications, 2ª ed.",
    a: "Martin Kleppmann, Chris Riccomini",
    f: "p-consist",
    why: "Complemento. O livro sobre dados e sistemas distribuídos; 2ª edição de 2026.",
  },
  {
    t: "Software Architecture: The Hard Parts",
    a: "Ford, Richards, Sadalage, Dehghani",
    f: "p-estilos",
    why: "Complemento. Granularidade de serviços, dados distribuídos e trade-offs difíceis.",
  },
  {
    t: "Release It!, 2ª ed.",
    a: "Michael Nygard",
    f: "p-disp",
    why: "Complemento. Padrões de estabilidade aprendidos em incidentes reais.",
  },
  {
    t: "Site Reliability Engineering",
    a: "Google",
    f: "p-disp",
    why: "Complemento. SLOs, error budgets e postmortems. Gratuito online.",
  },
  {
    t: "Effective Java, 3ª ed.",
    a: "Joshua Bloch",
    f: "p-ling",
    why: "Complemento. Como escrever Java como quem projetou a linguagem.",
  },
  {
    t: "Team Topologies",
    a: "Matthew Skelton, Manuel Pais",
    f: "p-extra",
    why: "Complemento. Organização de times e a Lei de Conway na prática.",
  },
  {
    t: "The Software Architect Elevator",
    a: "Gregor Hohpe",
    f: "p-extra",
    why: "Complemento. O arquiteto entre a estratégia e a sala de máquinas.",
  },
];

/* Curso em vídeo: Maratona Java Virado no Jiraya (DevDojo). Cada aula: [id do vídeo, duração, título]. */
var CURSO_JAVA = {
  title: "Curso de Java do zero ao avançado",
  serie: "Maratona Java Virado no Jiraya",
  autor: "William Suane · DevDojo",
  list: "PL62G310vn6nFIsOCC0H-C2infYgwm8SWW",
  modulos: [
    {
      t: "Introdução e ambiente",
      nivel: "Do zero",
      topico: "jvm",
      aulas: [
        ["VKjFuX91G5Q", "6:11", "Bem-vindo"],
        ["ooCqalwSpuE", "7:10", "O que esperar do curso"],
        ["JasmdiTyduI", "10:28", "Como Java Funciona"],
        ["Tsyeybeh968", "9:45", "Fazendo o download da JDK 15"],
        ["xzAESAp_soQ", "8:08", "Configurando variaveis de ambiente"],
        ["E64JTsEyXCM", "11:21", "Executando compilação manualmente"],
        ["uB5Qbm-RMyU", "6:10", "Download da IDE IntelliJ Community"],
        ["ds3t9C2A50U", "11:00", "Conhecendo a IDE IntelliJ Community"],
        ["TnnS-R--WKc", "8:06", "Organizando o código em pacotes"],
        ["2rMT0qRyiYs", "7:56", "Comentários"],
      ],
    },
    {
      t: "Tipos primitivos e operadores",
      nivel: "Do zero",
      aulas: [
        ["RRHGYyJTTpQ", "11:39", "Tipos primitivos pt 01 - convenções de variáveis"],
        ["veDgI_zZ7uk", "12:48", "Tipos primitivos pt 02 - declaração e tamanho em memória"],
        ["74hd4o7V328", "7:42", "Tipos primitivos pt 03 - casting"],
        ["13VfcFXwsjw", "6:10", "Tipos primitivos pt 04 - Strings"],
        ["Q0REhCVBvAg", "10:21", "Tipos primitivos pt 05 - Exercício"],
        ["1Fsvlted69g", "7:41", "Operadores pt 01 - Aritiméticos"],
        ["U390IaCtOUk", "8:49", "Operadores pt 02 - Relacionais"],
        ["cT6sw-Pw4l0", "8:58", "Operadores pt 03 - Lógicos AND"],
        ["ELcO4DN7lxw", "7:13", "Operadores pt 04 - Lógicos OR"],
        ["EFrq1WxsL1k", "10:31", "Operadores pt 05 - Atribuição"],
      ],
    },
    {
      t: "Estruturas condicionais e de repetição",
      nivel: "Do zero",
      aulas: [
        ["gk1_Pn8GZA4", "12:01", "Estruturas Condicionais pt 01 - IF"],
        ["exxeNsgcg3c", "14:11", "Estruturas Condicionais pt 02 - ELSE IF"],
        ["gU-qCpBC5jk", "10:42", "Estruturas Condicionais pt 03 - Operador ternário"],
        ["Y3ODYE3npgo", "5:29", "Estruturas Condicionais pt 04 - Tabela Verdade e exercício"],
        ["W-ng6Dqa-E4", "10:38", "Estruturas Condicionais pt 05 - Resolução do exercícios"],
        ["AYMtqJSrQTU", "11:09", "Estruturas Condicionais pt 06 - Switch"],
        ["GDAgMb9amow", "5:10", "Estruturas Condicionais pt 07 - Switch exercício"],
        ["hEl67ZAU_Hg", "12:59", "Estruturas de Repetição pt 01 - Laços de repetição while, do while, for"],
        ["nvFAe05Ok3g", "4:42", "Estruturas de Repetição pt 02 - Exercício for"],
        ["bcv-cgpw7Ak", "6:04", "Estruturas de Repetição pt 03 - Break"],
        ["RaEO2YsqFII", "7:09", "Estruturas de Repetição pt 04 - Exercício Break"],
        ["f65R-lQ4NpY", "6:16", "Estruturas de Repetição pt 05 - Continue"],
      ],
    },
    {
      t: "Arrays",
      nivel: "Do zero",
      topico: "estruturas",
      aulas: [
        ["fvw4bmihZHA", "11:13", "Arrays pt 01"],
        ["S8Eaq6uxnd8", "4:37", "Arrays pt 02"],
        ["Vsn-CXzzpUc", "8:27", "Arrays pt 03"],
        ["cl47iLWalUw", "9:19", "Arrays pt 04 - Foreach"],
        ["EalQ6X_RtJk", "13:31", "Arrays Multidimensionais pt 01"],
        ["TGq3754CsN4", "5:33", "Arrays Multidimensionais pt 02 - Foreach"],
        ["vp8bQZomKLo", "10:43", "Arrays Multidimensionais pt 03 - Inicialização"],
      ],
    },
    {
      t: "Orientação a objetos: classes, métodos e construtores",
      nivel: "Do zero",
      topico: "poo",
      aulas: [
        ["EyuPFLuvD7Q", "19:14", "Introdução classes pt 01"],
        ["uB7KvSz6WiA", "8:50", "Introdução classes pt 02"],
        ["dJLYPP1ExYY", "8:51", "Coesão"],
        ["JbL4SAFORco", "8:16", "Exercício Classes"],
        ["g_SGuMYHgI0", "5:06", "Referência de objetos"],
        ["ZM0AJhKjLYc", "9:05", "Métodos pt 01"],
        ["op6inGTMBiw", "8:51", "Métodos pt 02 - Parâmetros"],
        ["FCnTsy2EzSw", "8:58", "Métodos pt 03 - Retorno pt 01"],
        ["d0BO5mBBFK8", "8:30", "Métodos pt 04 - Retorno pt 02"],
        ["-izqpkaXKx0", "10:39", "Métodos pt 05 - Parâmetros tipo primitivo"],
        ["C-tmxo4FcKs", "14:34", "Métodos pt 06 - Parâmetros tipo referência"],
        ["OMuzOoHAEpg", "7:12", "Métodos pt 07 - Parâmetros tipo referência pt 02"],
        ["0fVZlarZ-Lg", "8:21", "Métodos pt 08 - Referência this"],
        ["T0E4Ewwz1IY", "8:49", "Métodos pt 09 - Varargs"],
        ["F2Y867f1J8U", "17:37", "Métodos pt 10 - Exercise"],
        ["QDzjgS0r39c", "17:01", "Modificador de acesso private, get e set pt 01"],
        ["hJNlMh9ktQ4", "5:49", "Modificador de acesso private, get e set pt 02"],
        ["kuvg8JixRp4", "6:58", "Modificador de acesso private, get e set pt 03"],
        ["UNPh61FYFrA", "16:36", "Sobrecarga de métodos"],
        ["zErSZzgYY_g", "10:58", "Construtores pt 01"],
        ["rW11EAkxFnc", "8:35", "Construtores pt 02 - Sobrecarga"],
        ["HGB02nLvgKU", "11:32", "Blocos de inicialização"],
        ["WBBbsEdzzmA", "14:55", "Modificador static"],
        ["jowlUssbJmk", "9:16", "Métodos estáticos"],
        ["4YE1ewRK-rk", "8:39", "Bloco de inicialização estático"],
      ],
    },
    {
      t: "Orientação a objetos: associação, herança e enum",
      nivel: "Do zero",
      topico: "poo",
      aulas: [
        ["HOjV9M6pRQQ", "7:53", "Associação pt 01 - Arrays com Objetos"],
        ["LFlZcO9qAh8", "7:51", "Associação pt 02 - Associação unidirecional um para muitos"],
        ["idIGsMoxfO0", "7:25", "Associação pt 03 - Associação unidirecional muitos para um"],
        ["-RtaqvKlH7w", "10:46", "Associação pt 04 - Associação bidirecional"],
        ["9IX94bsa3io", "8:26", "Leitura de dados pelo console"],
        ["pO1rQgpJlkg", "4:26", "Exercício leitura de dados do teclado"],
        ["FYANhUfWTyI", "19:14", "Associação pt 05 - Exercício Associação"],
        ["fOlsHNo1b0k", "14:47", "Herança pt 01"],
        ["mgSz5XSH4dM", "8:02", "Herança pt 02 - Super"],
        ["xoErKNbeG0w", "6:12", "Herança pt 03 - protected"],
        ["64GcJDKN4mI", "11:57", "Herança pt 04 - Construtores"],
        ["raAHfRdld0Y", "9:33", "Herança pt 05 - Sequência de inicialização"],
        ["62qcGF6IVfc", "7:52", "Sobrescrita do método toString"],
        ["EQhYKOBCozE", "8:57", "Modificador final pt 01 - Tipo primitivo"],
        ["PqAZFtNsgn4", "6:37", "Modificador final pt 02 - Tipo referência"],
        ["KWcqFc3X5Is", "5:50", "Modificador final pt 03 - Classes e métodos"],
        ["3xzrprPwS2Q", "13:29", "Enumeração pt 01 - Introdução"],
        ["gsQ1gZYh5Wo", "11:58", "Enumeração pt 02 - Construtores e atributos"],
        ["8Vwf5vgMoDY", "7:53", "Enumeração pt 03 - Sobrescrita de métodos"],
        ["rbqIXJwy6-M", "5:43", "Enumeração pt 04 - Busca por atributos"],
      ],
    },
    {
      t: "Orientação a objetos: abstração, interfaces e polimorfismo",
      nivel: "Do zero",
      topico: "poo",
      aulas: [
        ["ws1NVBGeegs", "9:00", "Classes abstratas pt 01"],
        ["j97OEyzBcKI", "8:15", "Classes abstratas pt 02 - Métodos abstratos"],
        ["xI0xspht6mA", "5:18", "Classes abstratas pt 03 - Métodos abstratos regras"],
        ["AhVd_DzV3DU", "7:29", "Interfaces pt 01 - Introdução"],
        ["QKjFkaagGdk", "8:31", "Interfaces pt 02 - Implementando múltiplas interfaces"],
        ["SYyEyR78dSQ", "6:22", "Interfaces pt 03 - Atributos e métodos estáticos"],
        ["UmReA29kOVw", "15:35", "Polimorfismo pt 01 - Introdução"],
        ["TZt_LYjKLiQ", "11:34", "Polimorfismo pt 02 - Funcionamento"],
        ["1kKS1XV8saE", "7:57", "Polimorfismo pt 03 - Parâmetros polimórficos"],
        ["qpefWJeupV0", "9:25", "Polimorfismo pt 04 - Cast e instanceof"],
        ["lDsO78xFp9Y", "8:24", "Polimorfismo pt 05 - Programação orientada a interface"],
      ],
    },
    {
      t: "Exceções",
      nivel: "Intermediário",
      aulas: [
        ["30D9z8M3eCQ", "9:46", "Exceções pt 01 - Errors"],
        ["S7gLPZO0Jug", "8:57", "Exceções pt 02 - RuntimeException"],
        ["iNlGgh0s_F8", "18:00", "Exceções pt 03 - Exception"],
        ["M7CU5TOOmTc", "13:32", "Exceções pt 04 - Lançando exceção unchecked"],
        ["Gc5SIWgcsYI", "12:45", "Exceções pt 05 - Lançando exceção checked"],
        ["QL1Wz5yrlEw", "10:29", "Exceções pt 06 - Bloco Finally"],
        ["ibrTQmTNHQ0", "10:01", "Exceções pt 07 - Capturando múltiplas exceções"],
        ["0_54_91TDuk", "7:04", "Exceções pt 08 - Multi catch em linha"],
        ["PERQlV7ax2M", "10:39", "Exceções pt 09 - Try with resources"],
        ["3P8imoW60Uo", "6:34", "Exceções pt 10 - Exceção customizada"],
        ["Jf1tZisCx7U", "6:19", "Exceções pt 11 - Exceção e regras de sobrescrita"],
      ],
    },
    {
      t: "Classes utilitárias: wrappers, Strings e datas",
      nivel: "Intermediário",
      topico: "java-moderno",
      aulas: [
        ["F0F0B33Un9M", "11:06", "Wrappers pt 01"],
        ["cAqsHzWy2qI", "9:53", "Wrappers pt 02"],
        ["vH7izlkNewI", "12:54", "Strings pt 01"],
        ["5hfftQx_S8Q", "10:16", "Strings pt 02"],
        ["yx8OJVgVSU8", "12:51", "Strings pt 03 - Desempenho"],
        ["JAKcK93hHHU", "9:31", "Strings pt 04 - StringBuilder"],
        ["IUDT-cW4tcU", "7:09", "Date"],
        ["H92wS2QKLO8", "8:57", "Calendar"],
        ["vmhzhQo_s08", "5:17", "DateFormat"],
        ["zejLPQW96uI", "11:54", "Internacionalização Datas com Locale"],
        ["xaaGxC-G92w", "8:41", "Internacionalização Números com Locale"],
        ["waedzSaWMjo", "9:00", "Internacionalização de moeda com Locale"],
        ["swKXov2xHFM", "6:51", "SimpleDateFormat"],
        ["S7Uc4TxTbb8", "11:52", "LocalDate"],
        ["huyHYTds_xU", "5:00", "LocalTime"],
        ["UXpoRzHOMP4", "6:47", "LocalDateTime"],
        ["mcv5zRtDGag", "8:15", "Instant"],
        ["4vg2lEGYJi4", "8:15", "Duration"],
        ["g9GtolzNlPo", "6:18", "Period"],
        ["YuwLrTwLI88", "5:54", "ChronoUnit"],
        ["81xG_vGIiwg", "7:31", "TemporalAdjusters"],
        ["qL2V3ks3knc", "9:49", "TemporalAdjuster"],
        ["75nO4WZVjq0", "13:04", "ZonedDateTime, ZoneId, OffsetDateTime"],
        ["TyikH6iBUIY", "11:08", "DateTimeFormatter"],
        ["M28gEhYT--o", "13:08", "ResourceBundle"],
      ],
    },
    {
      t: "Regex, Scanner, IO, NIO e serialização",
      nivel: "Intermediário",
      aulas: [
        ["8hhYE4y0iMM", "10:55", "Regex pt 01 - Pattern e Matcher"],
        ["LvLGE9ryafg", "7:17", "Regex pt 02 - Pattern e Matcher - Meta caracteres"],
        ["v_ZsEZLHKjk", "9:15", "Regex pt 03 - Pattern e Matcher - Range"],
        ["9IFY_aHlDl0", "7:33", "Regex pt 04 - Pattern e Matcher - Quantificadores pt 01"],
        ["0PQ45dMLcFo", "13:17", "Regex pt 05 - Pattern e Matcher - Quantificadores pt 02"],
        ["j6aDHj9S-vs", "4:03", "Regex pt 06 - Pattern e Matcher - Anchor"],
        ["Dx5bqoNAW6I", "6:58", "Scanner - Tokens e Delimitadores"],
        ["iBIKREgyF20", "8:52", "IO pt 01 - File"],
        ["4wsysT3OxO4", "7:17", "IO pt 02 - FileWriter"],
        ["9Y8FKrklbMQ", "6:57", "IO pt 03 - FileReader"],
        ["j7cWU9PM7wc", "7:16", "IO pt 04 - BufferedWriter"],
        ["Z-EG0cRvVBQ", "5:16", "IO pt 05 - BufferedReader"],
        ["z30kOkeTM5c", "11:14", "IO pt 06 - File para diretórios"],
        ["PHj0E70bSeg", "7:55", "NIO pt 01 - Path, Paths, Files pt 01"],
        ["0Cw4YlsqIqU", "11:39", "NIO pt 02 - Path, Paths, Files pt 02"],
        ["k6yQvu42sq0", "13:07", "NIO pt 03 - Normalização"],
        ["hNGyzCwLe1g", "9:46", "NIO pt 04 - Resolvendo Paths"],
        ["mbx83oInlGI", "8:06", "NIO pt 05 - Relativize"],
        ["7ccX4cxlWOg", "8:10", "NIO pt 06 - BasicFileAttributes pt 01"],
        ["3dnfUSbp6-4", "11:57", "NIO pt 07 - BasicFileAttributes pt 02"],
        ["4g7JeY-hTP0", "7:36", "NIO pt 08 - DosFileAttribute"],
        ["t8eoFrsMbNc", "8:44", "NIO pt 09 - PosixFileAttributes"],
        ["UHDnO2r4Whc", "7:21", "NIO pt 10 - DirectoryStream"],
        ["1-fBnhNcbmY", "7:38", "NIO pt 11 - SimpleFileVisitor pt 01"],
        ["UiDMz5J-mlg", "8:26", "NIO pt 12 - SimpleFileVisitor pt 02"],
        ["m5jwgf8FEl0", "7:37", "NIO pt 13 - PathMatcher pt 01"],
        ["duwXpnrt4D8", "5:54", "NIO pt 14 - PathMatcher pt 02"],
        ["DuYqgRU--CI", "11:06", "NIO pt 15 - ZipOutputStream"],
        ["9Bkbcn7Dgvc", "13:36", "Serialization pt 01"],
        ["8NA5-GjqKEc", "15:10", "Serialization pt 02"],
      ],
    },
    {
      t: "Coleções",
      nivel: "Intermediário",
      topico: "estruturas",
      aulas: [
        ["YWtGWgTlPwQ", "9:43", "Coleções pt 01 - equals pt 01"],
        ["2t9GDdsVmjg", "10:18", "Coleções pt 02 - equals pt 02"],
        ["Q4fgk7i0GG4", "6:28", "Coleções pt 03 - hashCode pt 01"],
        ["_FnTxETp3BI", "7:42", "Coleções pt 04 - hashCode pt 02"],
        ["NxuGmdGBDdk", "8:26", "Coleções pt 05 - Complexidade Big-O"],
        ["PFuvDDS9_J8", "10:57", "Coleções pt 06 - List pt 01"],
        ["_auUwu21Qqw", "9:26", "Coleções pt 07 - List pt 02"],
        ["fzv-UxjYcmU", "11:09", "Coleções pt 08 - List pt 03"],
        ["WHFr-FzwJGQ", "12:38", "Coleções pt 09 - Sorting lists pt 01"],
        ["OJGQ0lvaKGE", "13:58", "Coleções pt 10 - Sorting lists pt 02 - Comparable"],
        ["ZyI_8ljieUA", "7:28", "Coleções pt 11 - Sorting lists pt 03 - Comparator"],
        ["Ixd1Fib9F9g", "11:57", "Coleções pt 12 - Binary Search"],
        ["meW6F-95yIw", "9:32", "Coleções pt 13 - Conversão de Lista para Arrays e vice versa"],
        ["FlwOWSpYUkA", "8:39", "Coleções pt 14 - Iterator"],
        ["dJ3fhRq-5tM", "6:34", "Coleções pt 15 - Set, HashSet"],
        ["JibYosgdk00", "9:41", "Coleções pt 16 - NavigableSet, TreeSet pt 01"],
        ["8A6W5g9Q3nA", "9:50", "Coleções pt 17 - NavigableSet, TreeSet pt 02"],
        ["kkHyYrfB35s", "10:24", "Coleções pt 18 - Map, HashMap, LinkedHashMap pt 01"],
        ["4jLo3TpiS4k", "8:27", "Coleções pt 19 - Map, HashMap, LinkedHashMap pt 02"],
        ["IvjlvMrwZiI", "7:05", "Coleções pt 20 - Map, HashMap, LinkedHashMap pt 03"],
        ["2EKe7UJLuCQ", "8:07", "Coleções pt 21 - NavigableMap, TreeMap"],
        ["Q6CiTfKsAQc", "12:37", "Coleções pt 22 - Queue, PriorityQueue"],
      ],
    },
    {
      t: "Generics e classes internas",
      nivel: "Intermediário",
      aulas: [
        ["YOHMTPIxRDk", "8:34", "Generics pt 01 - Introdução"],
        ["NfguvWHYbQM", "11:12", "Generics pt 02 - Wildcard pt 01"],
        ["rchsi7CvUBM", "7:15", "Generics pt 03 - Wildcard pt 02"],
        ["ZWhEZ-7PXg8", "12:46", "Generics pt 04 - Classes Genéricas pt 01"],
        ["BjipceG4EH0", "9:31", "Generics pt 05 - Classes Genéricas pt 02"],
        ["_feJhRzYxYk", "8:11", "Generics pt 06 - Métodos Genéricos"],
        ["pAZ_4lxDYNU", "9:36", "Classes Internas pt 01 - Introdução"],
        ["koKwh7YVtx0", "9:12", "Classes Internas pt 02 - Classes Locais"],
        ["44uSWELqd3U", "12:41", "Classes Internas pt 03 - Classes Anônimas"],
        ["jm09LQDoZ5Y", "6:17", "Classes Internas pt 04 - Classes aninhadas estáticas"],
      ],
    },
    {
      t: "Lambdas, method reference e Optional",
      nivel: "Avançado",
      topico: "java-moderno",
      aulas: [
        ["ZmsJPFhmmf0", "12:15", "Parametrizando comportamentos pt 01"],
        ["pSSgo8RAf-A", "12:37", "Parametrizando comportamentos pt 02"],
        ["sF6z6PTqTVo", "9:04", "Lambdas pt 01 - Predicate"],
        ["T5mFXrYBsao", "5:19", "Lambdas pt 02 - Consumer"],
        ["2P6LbYqmz7c", "6:13", "Lambdas pt 03 - Function"],
        ["f7jGNzFMQb4", "12:34", "Method Reference pt 01 - Referência a métodos estáticos"],
        ["E2Ev36YbjDo", "10:33", "Method Reference pt 02 - Referência a métodos não estáticos"],
        ["2dUHGheKl9s", "7:48", "Method Reference pt 03 - Referência a construtor"],
        ["-xxb8LoOiRs", "11:46", "Optional pt 01"],
        ["sOeNRIwhyzg", "15:36", "Optional pt 02"],
      ],
    },
    {
      t: "Streams",
      nivel: "Avançado",
      topico: "java-moderno",
      aulas: [
        ["ID9zo1hSbXw", "11:16", "Streams pt 01 - Introduction pt 01"],
        ["pPjQbbl4iiY", "7:51", "Streams pt 02 - Introduction pt 02"],
        ["ctozCHV5EZY", "7:37", "Streams pt 03 - Introduction pt 03"],
        ["3IyvpB7Ocxw", "7:23", "Streams pt 04 - FlatMap pt 01"],
        ["wCEEhV4Hkio", "6:46", "Streams pt 05 - FlatMap pt 02"],
        ["8KiVd58GBJU", "9:34", "Streams pt 06 - Finding and Matching"],
        ["wTsGajhPCBY", "7:47", "Streams pt 07 - Reduce pt 01"],
        ["-eudNNKAGgM", "6:33", "Streams pt 08 - Reduce pt 02"],
        ["3Ud0CDMdwiY", "10:24", "Streams pt 09 - Gerando streams pt 01"],
        ["AQO2JlZcwaA", "9:50", "Streams pt 10 - Gerando streams pt 02"],
        ["5wDiTtBayU4", "10:26", "Streams pt 11 - Collectors pt 01 Summarizing"],
        ["EH74dqRDCM0", "7:18", "Streams pt 12 - Collectors pt 02 - Grouping by pt 01"],
        ["rO6o654D5hQ", "9:42", "Streams pt 13 - Collectors pt 03 - Grouping by pt 02"],
        ["1FvYGWxmltw", "8:21", "Streams pt 14 - Collectors pt 04 - Grouping by pt 03"],
        ["_lhipah8Anw", "9:47", "Streams pt 15 - Collectors pt 05 - Grouping by pt 04"],
        ["n_8HNFLrMsc", "13:20", "Streams pt 16 - Parallel Streams pt 01"],
        ["ZnkpA5rUq6I", "9:50", "Streams pt 17 - Parallel Streams pt 02"],
      ],
    },
    {
      t: "Threads e concorrência",
      nivel: "Avançado",
      topico: "concorrencia",
      aulas: [
        ["dFPwCqr43Ag", "12:44", "Threads pt 01 - Introduction"],
        ["xyU1c0iJGr8", "5:37", "Threads pt 02 - Estados das threads"],
        ["1TSH83Clt18", "6:53", "Threads pt 03 - Prioridade e Sleep"],
        ["BLM9Q9zdARU", "11:18", "Threads pt 04 - Yield e Join"],
        ["WKx6tEM8LEU", "14:32", "Threads pt 05 - Sincronismo de thread pt 01"],
        ["LVIZJWoHnjs", "8:51", "Threads pt 06 - Sincronismo de thread pt 02"],
        ["WN2bb0RsMyM", "7:44", "Threads pt 07 - Sincronismo de thread pt 03 - Classes thread safe"],
        ["Pm0EfS0Lu4M", "7:17", "Threads pt 08 - Sincronismo de thread pt 04 - Deadlock"],
        ["A4zRkIydFjE", "21:23", "Threads pt 09 - Sincronismo de thread pt 05 - Wait, notify e notifyAll"],
        ["eafDSpZMBbE", "8:23", "Concorrência pt 01 - AtomicInteger"],
        ["4yw1WJUIrwg", "13:52", "Concorrência pt 02 - Lock and ReentrantLock"],
        ["8Gxw4WzYx-w", "13:21", "Concorrência pt 03 - Conditions"],
        ["hsnTg0Y5Iuw", "11:00", "Concorrência pt 04 - ReentrantReadWriteLock"],
        ["6rCcB4EVkm4", "8:30", "Concorrência pt 05 - CopyOnWriteArrayList"],
        ["MkZjut9L6W8", "6:55", "Concorrência pt 06 - ArrayBlockingQueue"],
        ["gZwUdhZBARo", "9:15", "Concorrência pt 07 - LinkedTransferQueue"],
        ["y7PUfmtWIXs", "11:57", "Concorrência pt 08 - Executors pt 01 - Thread Pools"],
        ["oxwUqSAbMLY", "14:22", "Concorrência pt 09 - Executors pt 02 - ScheduledExecutorService"],
        ["ct9KQy16pVE", "8:15", "Concorrência pt 10 - Executors pt 03 - Interface Callable"],
        ["NzXEuBgTHKE", "11:07", "Concorrência pt 11 - Executors pt 04 - Future"],
        ["ZKDgjM_x4bo", "17:25", "Concorrência pt 12 - CompletableFuture pt 01 - get and join"],
        ["iPQNgSnj41o", "6:45", "Concorrência pt 13 - CompletableFuture pt 02 - Streams"],
        ["o7x9PmwKxv0", "7:13", "Concorrência pt 14 - CompletableFuture pt 03 - ThreadFactory"],
        ["Id9RyqFuRiM", "18:36", "Concorrência pt 15 - CompletableFuture pt 04 - Encadeando chamadas pt 01"],
        ["W2j3KzVgiAs", "13:05", "Concorrência pt 16 - CompletableFuture pt 05 - Encadeando chamadas pt 02"],
        ["BdOD7-unrRM", "9:12", "Concorrência pt 17 - CompletableFuture pt 06 - allOf, anyOf"],
      ],
    },
    {
      t: "Padrões de projeto",
      nivel: "Avançado",
      topico: "patterns",
      aulas: [
        ["UL-FdBvthHU", "13:46", "Padrões de Projeto pt 01 - Builder"],
        ["k3BbX3Ysd5o", "6:45", "Padrões de Projeto pt 02 - Factory"],
        ["p4e2YMW3H6k", "10:44", "Padrões de Projeto pt 03 - Singleton pt 01 - Eager Initialization"],
        ["9OvzSW1hAY0", "6:51", "Padrões de Projeto pt 04 - Singleton pt 02 - Lazy Initialization"],
        ["eutGuy74Ccg", "4:46", "Padrões de Projeto pt 05 - Singleton pt 03 - Singleton with enumeration"],
        ["DVtkSOD86Ag", "7:24", "Padrões de Projeto pt 06 - Data Transfer Object"],
      ],
    },
    {
      t: "JDBC com MySQL e Docker",
      nivel: "Avançado",
      topico: "sql",
      aulas: [
        ["Q4UgGZfTgCs", "8:59", "JDBC pt 01 - Instalando Docker"],
        ["VUbrBmiKkeQ", "13:42", "JDBC pt 02 - Criando container MySQL"],
        ["NO8zP0Xyl8Q", "12:35", "JDBC pt 03 - Instalando Workbench, criando schema e tabelas"],
        ["1MPs67lkmuA", "14:16", "JDBC pt 04 - Instalando e adicionando maven ao projeto"],
        ["JatWzzOSGwg", "9:59", "JDBC pt 05 - Adicionando dependência e conectando com banco"],
        ["-1Ctzcf3bFQ", "13:39", "JDBC pt 06 - Inserindo dados com Statement"],
        ["Dpe6f7JpVIk", "19:02", "JDBC pt 07 - Lombok e Log4J2"],
        ["jO0dAZ2CnJY", "11:54", "JDBC pt 08 - Deletando dados com Statement"],
        ["e_qj9ee4cv0", "8:11", "JDBC pt 09 - Atualizando dados com Statement"],
        ["SA88IvP6Wr8", "11:08", "JDBC pt 10 - Buscando dados com ResultSet pt 01 - findAll"],
        ["kAsRdPNp1-E", "7:01", "JDBC pt 11 - Buscando dados com ResultSet pt 02 - findByName"],
        ["l0bMybn4trY", "9:12", "JDBC pt 12 - ResultSetMetaData"],
        ["uaaseJJIhes", "8:28", "JDBC pt 13 - DatabaseMetaData"],
        ["0M4RboYfjP4", "12:09", "JDBC pt 14 - ResultSet TYPE SCROLL INSENSITIVE"],
        ["TIunWd7vVX8", "6:56", "JDBC pt 15 - Atualizando registros com ResultSet"],
        ["xeAYUaI3fbU", "11:34", "JDBC pt 16 - Inserindo e deletando registros com ResultSet"],
        ["uQ2cESUncjM", "14:57", "JDBC pt 17 - PreparedStatement pt 01"],
        ["8gbs3yGJtE8", "5:43", "JDBC pt 18 - PreparedStatement pt 02"],
        ["PRXFwv9p4qI", "9:20", "JDBC pt 19 - CallableStatement"],
        ["wWLEz5wlpiE", "9:55", "JDBC pt 20 - Connected RowSet - JdbcRowSet pt 01"],
        ["tvQcULQvYag", "11:29", "JDBC pt 21 - Connected RowSet - JdbcRowSet pt 02"],
        ["Fau61I3F5CY", "11:29", "JDBC pt 22 - Disconnected RowSet - CachedRowSet"],
        ["ivueCjdK6C0", "13:55", "JDBC pt 23 - Transação"],
        ["pBgOitdJbgY", "18:32", "JDBC pt 24 - CRUD pt 01 - findByName and findAll"],
        ["b-eWIeQ9PnQ", "11:02", "JDBC pt 25 - CRUD pt 02 - delete"],
        ["AlefsI8CiqY", "10:49", "JDBC pt 26 - CRUD pt 03 - save"],
        ["0_-P83Uv_pA", "13:36", "JDBC pt 27 - CRUD pt 04 - update"],
        ["sehuZWtXo-M", "25:25", "JDBC pt 28 - CRUD pt 05 - Anime Crud"],
      ],
    },
    {
      t: "Testes com JUnit e Java moderno",
      nivel: "Avançado",
      topico: "testes",
      aulas: [
        ["jdBsFPF_w9Q", "15:13", "Testes unitários com jUnit pt 01"],
        ["N5iaGF90XGg", "18:19", "Testes unitários com jUnit pt 02"],
        ["K0NNErTM1QU", "6:09", "Atualizando JDK"],
        ["mAioJY5_hFk", "13:11", "Record Class"],
        ["KYN9UfPpJ38", "7:09", "Pattern Matching for instanceof"],
        ["ti-Yb11y_m8", "3:04", "É só correr pro abraço"],
      ],
    },
  ],
};

/* Katas de refatoração ficam no tópico próprio de refactoring */
(function () {
  const t = TOPICS.find((x) => x.id === "clean-code");
  t.exercises = t.exercises.filter(
    (e) => !/Gilded Rose|Theatrical/.test(e.text),
  );
})();
(function () {
  const LV = { 1: "Aquecimento", 2: "Prática", 3: "Desafio" };
  const KEY = "trilha-arquiteto-v1";
  let state = { done: {}, ex: {}, aulas: {} };
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s) state = Object.assign(state, s);
  } catch (e) {}
  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
  }

  const root = document.documentElement;
  function paintTheme() {
    const dark = root.dataset.theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
      b.textContent = dark ? "☀" : "☾";
      b.title = dark ? "Usar tema claro" : "Usar tema escuro";
    });
  }
  document.querySelectorAll("[data-theme-toggle]").forEach((b) =>
    b.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("trilha-tema", root.dataset.theme);
      } catch (e) {}
      paintTheme();
    }),
  );
  paintTheme();

  const $ = (s) => document.querySelector(s);
  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const byPhase = (id) => TOPICS.filter((t) => t.phase === id);
  const phaseOf = (id) => PHASES.find((p) => p.id === id);
  const host = (u) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch (e) {
      return "";
    }
  };

  function guessLang(src) {
    if (/^\s*(FROM|ENV|RUN|COPY)\b/m.test(src) && /^\s*FROM\b/m.test(src))
      return "dockerfile";
    if (/^\s*(SELECT|WITH|UPDATE|INSERT|CREATE)\b/i.test(src)) return "sql";
    if (/^\s*(workspace|C4Context)\b/.test(src)) return "plaintext";
    if (/^\s*#\s*ADR/.test(src)) return "markdown";
    if (/^\s*resource\s+"/.test(src)) return "plaintext";
    if (/^\s*<!--|^\s*<dependency>/.test(src)) return "xml";
    if (/^\s*(apiVersion|name:|resilience4j:|management:)/.test(src))
      return "yaml";
    if (/[├└]──/.test(src)) return "plaintext";
    return "java";
  }

  /* ---------- navegação lateral ---------- */
  function topicStatus(t) {
    if (state.done[t.id]) return "done";
    const n = t.exercises.filter((_, i) => state.ex[t.id + ":" + i]).length;
    return n ? "part" : "";
  }
  function renderNav(cur) {
    $("#phaseNav").innerHTML = STAGES.map(
      (s) => `
    <div class="stage-h">${esc(s.title)}</div>
    ${PHASES.filter((p) => p.stage === s.id)
      .map(
        (p) => `
    <div class="phase"><div class="phase-h"><span class="n">${String(p.n).padStart(2, "0")}</span><span>${esc(p.title)}</span></div>
    ${byPhase(p.id)
      .map(
        (t) =>
          `<a class="tlink${cur === t.id ? " on" : ""}" href="#${t.id}"><span class="dot ${topicStatus(t)}"></span>${esc(t.title)}</a>`,
      )
      .join("")}
    </div>`,
      )
      .join("")}
    ${s.milestone ? `<div class="mile">🏆 ${esc(s.milestone)}</div>` : ""}`,
    ).join("");
    document
      .querySelectorAll(".navx a")
      .forEach((a) => a.classList.toggle("on", a.dataset.v === cur));
    const total = TOPICS.length,
      feitos = TOPICS.filter((t) => state.done[t.id]).length;
    const pct = Math.round((100 * feitos) / total);
    $("#progFill").style.width = pct + "%";
    $("#progTxt").textContent = `${feitos} de ${total} tópicos`;
    $("#progPct").textContent = pct + "%";
  }

  /* ---------- visões ---------- */
  function home() {
    const horas = TOPICS.reduce((a, t) => a + t.hours, 0);
    const exs = TOPICS.reduce((a, t) => a + t.exercises.length, 0);
    const refs = TOPICS.reduce((a, t) => a + t.refs.length, 0);
    const prox = TOPICS.find((t) => !state.done[t.id]) || TOPICS[0];
    return `
  <section class="hero">
    <div class="eyebrow">De desenvolvedor Java a arquiteto de software</div>
    <h2>Uma trilha para pensar em <em>trade-offs</em>, não em modismos.</h2>
    <p class="lede">A trilha segue o seu <b>Mapa do Arquiteto</b>, na mesma ordem: da largada até Programador Júnior, Pleno/Sênior, Arquiteto de Software e Arquiteto de Soluções. Cada tópico traz explicação, código Java real, exercícios em três níveis e as referências que a área respeita.</p>
    <div class="stats">
      <div><b>${STAGES.length - 1}</b><span>etapas do mapa</span></div>
      <div><b>${TOPICS.length}</b><span>tópicos</span></div>
      <div><b>${exs}</b><span>exercícios</span></div>
      <div><b>${refs}</b><span>referências</span></div>
      <div><b>~${horas}h</b><span>de estudo focado</span></div>
    </div>
    <a class="cta" href="#${prox.id}">${state.done[TOPICS[0].id] ? "Continuar" : "Começar"}: ${esc(prox.title)} →</a>
    <a class="cta-2" href="#curso">Começando do zero em Java? Veja o curso em vídeo (${AULAS.length} aulas) →</a>
    <p class="note"><b>Fiel ao seu quadro:</b> etapas, marcos, ordem e nomes vêm do "Mapa do Arquiteto: ROADMAP" no Miro. Itens que o mapa só cita (como os frameworks MVC ou os bancos) foram resolvidos para Java, Spring Boot e PostgreSQL. A última etapa, "Fora da curva", é um extra além do mapa.</p>
  </section>

  <h3 class="sec-h">Como estudar</h3>
  <p class="sec-sub">O ritmo sugerido assume cerca de 10 horas por semana. Ajuste ao seu, mas mantenha a ordem: cada fase usa a anterior.</p>
  <div class="how">
    <div><b>Leia e reproduza</b><p>Digite os exemplos em vez de copiar. Rode, quebre de propósito, observe o erro.</p></div>
    <div><b>Faça os três níveis</b><p>Aquecimento fixa o conceito, Prática aplica num cenário real, Desafio força você a decidir sozinho.</p></div>
    <div><b>Registre decisões</b><p>A partir da fase 3, todo exercício de desenho termina com um ADR curto no seu repositório.</p></div>
    <div><b>Construa um projeto só</b><p>O projeto final cresce fase a fase e vira portfólio, com código, diagramas e decisões.</p></div>
  </div>

  <h3 class="sec-h">O caminho</h3>
  <p class="sec-sub">Marque tópicos como concluídos; o progresso fica salvo neste navegador.</p>
  ${STAGES.map(
    (
      s,
    ) => `<div class="stage-block"><div class="stage-title">${esc(s.title)}</div>
  <ol class="map">${PHASES.filter((p) => p.stage === s.id)
    .map((p) => {
      const ts = byPhase(p.id),
        ok = ts.every((t) => state.done[t.id]);
      return `<li class="${ok ? "ok" : ""}"><span class="num">${String(p.n).padStart(2, "0")}</span>
      <h4><a href="#${ts[0].id}">${esc(p.title)}</a><span class="wk">${esc(p.weeks)}</span></h4>
      <p>${esc(p.goal)}</p>
      <div class="chips">${ts.map((t) => `<a class="chip${state.done[t.id] ? " done" : ""}" href="#${t.id}">${esc(t.title)}</a>`).join("")}</div></li>`;
    })
    .join("")}</ol>
  ${s.milestone ? `<div class="milestone"><span>🏆</span>${esc(s.milestone)}</div>` : ""}</div>`,
  ).join("")}`;
  }

  function topic(t) {
    const ph = phaseOf(t.phase);
    const i = TOPICS.indexOf(t),
      prev = TOPICS[i - 1],
      next = TOPICS[i + 1];
    const body = t.body
      .replace(
        /<table class="tbl">/g,
        '<div class="tblwrap"><table class="tbl">',
      )
      .replace(/<\/table>/g, "</table></div>");
    return `
  <div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>${esc(STAGES.find((s) => s.id === ph.stage).short)}</span><span>/</span><span>${String(ph.n).padStart(2, "0")} · ${esc(ph.title)}</span></div>
  <h2 class="t-title">${esc(t.title)}</h2>
  <div class="meta"><span class="tag lv">${esc(t.level)}</span><span class="tag">~${t.hours}h</span><span class="tag">${t.exercises.length} exercícios</span><span class="tag">${t.refs.length} referências</span></div>
  <p class="summary">${esc(t.summary)}</p>
  ${
    ph.id === "p-ling"
      ? `<div class="callout"><b>Aprendendo Java do zero?</b>Acompanhe esta fase com o <a href="#curso">curso em vídeo</a>: ${AULAS.length} aulas, do primeiro programa até concorrência, JDBC e testes.</div>`
      : ""
  }
  <div class="prose">${body}</div>

  ${
    t.code.length
      ? `<div class="block-h"><h3>Exemplos práticos</h3><span>${t.code.length} trecho${t.code.length > 1 ? "s" : ""}</span></div>
  ${t.code.map((c, k) => `<figure class="code" style="margin:0 0 18px"><div class="code-h"><span>${esc(c.t)}</span><button class="copy" data-k="${k}">copiar</button></div><pre><code class="language-${guessLang(c.src)}">${esc(c.src)}</code></pre></figure>`).join("")}`
      : ""
  }

  <div class="block-h"><h3>Exercícios</h3><span>marque ao concluir</span></div>
  <ul class="ex">${t.exercises
    .map((e, k) => {
      const id = t.id + ":" + k,
        on = !!state.ex[id];
      return `<li class="${on ? "done" : ""}"><input type="checkbox" id="ex-${t.id}-${k}" data-ex="${id}" ${on ? "checked" : ""}>
      <label for="ex-${t.id}-${k}"><span class="lv lv${e.lvl}">${LV[e.lvl]}</span><p>${e.text}</p></label></li>`;
    })
    .join("")}</ul>

  <div class="block-h"><h3>Para ir além</h3><span>fontes reconhecidas</span></div>
  <ul class="refs">${t.refs.map((r) => `<li><a href="${esc(r.u)}" target="_blank" rel="noopener">${esc(r.t)}</a>${r.note ? ` <span class="why">· ${esc(r.note)}</span>` : ""}<span class="host">${esc(host(r.u))}</span></li>`).join("")}</ul>

  <div class="done-bar"><span>${state.done[t.id] ? "Tópico concluído. Bom trabalho." : "Terminou a leitura e os exercícios?"}</span>
    <button class="mark${state.done[t.id] ? " is" : ""}" id="markBtn">${state.done[t.id] ? "Desmarcar" : "Marcar como concluído"}</button></div>
  <nav class="pager">
    ${prev ? `<a href="#${prev.id}"><small>← Anterior</small><b>${esc(prev.title)}</b></a>` : ""}
    ${next ? `<a class="nx" href="#${next.id}"><small>Próximo →</small><b>${esc(next.title)}</b></a>` : `<a class="nx" href="#projeto"><small>Próximo →</small><b>Projeto final</b></a>`}
  </nav>`;
  }

  function projeto() {
    return `<div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>Portfólio</span></div>
  <h2 class="t-title">${esc(CAPSTONE.title)}</h2>
  <p class="summary">${esc(CAPSTONE.intro)}</p>
  <ul class="steps">${CAPSTONE.steps.map((s) => `<li><span class="f">${esc(s.f)}</span><div><b>${esc(s.t)}</b><p>${esc(s.d)}</p></div></li>`).join("")}</ul>
  <div class="callout" style="margin-top:28px"><b>Como apresentar no fim</b>Um README que conta a história: o problema, as características priorizadas, a evolução do monolito aos serviços, os ADRs mais importantes, os números dos testes de carga e o que você faria diferente. Esse texto vale tanto quanto o código.</div>`;
  }

  function biblioteca() {
    return `<div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>Leituras</span></div>
  <h2 class="t-title">Biblioteca essencial</h2>
  <p class="summary">Os livros que arquitetos experientes citam com mais frequência, na fase em que fazem mais sentido. Não leia tudo de uma vez: leia junto com a fase.</p>
  <div class="books">${BOOKS.map((b) => {
    const p = phaseOf(b.f);
    return `<div class="book"><span class="ph">${String(p.n).padStart(2, "0")} · ${esc(p.title)}</span><b>${esc(b.t)}</b><i>${esc(b.a)}</i><p>${esc(b.why)}</p></div>`;
  }).join("")}</div>`;
  }

  /* ---------- curso em vídeo ---------- */
  const AULAS = CURSO_JAVA.modulos.flatMap((m, mi) =>
    m.aulas.map(([id, dur, t]) => ({ id, dur, t, mi })),
  );
  AULAS.forEach((a, i) => (a.n = i));
  const segs = (d) => d.split(":").reduce((a, x) => a * 60 + +x, 0);
  const fmtHoras = (s) => {
    const h = Math.floor(s / 3600),
      m = Math.round((s % 3600) / 60);
    return h ? `${h}h${m ? String(m).padStart(2, "0") : ""}` : `${m}min`;
  };
  const urlAula = (a) =>
    `https://www.youtube.com/watch?v=${a.id}&list=${CURSO_JAVA.list}&index=${a.n + 1}`;
  const feitasDe = (as) => as.filter((a) => state.aulas[a.id]).length;

  function cursoProgHtml() {
    const f = feitasDe(AULAS),
      pct = Math.round((100 * f) / AULAS.length);
    return `<div class="prog-bar"><i style="width:${pct}%"></i></div>
    <small><span>${f} de ${AULAS.length} aulas assistidas</span><span>${pct}%</span></small>`;
  }

  function curso() {
    const total = AULAS.reduce((a, x) => a + segs(x.dur), 0);
    const prox = AULAS.find((a) => !state.aulas[a.id]);
    const niveis = [...new Set(CURSO_JAVA.modulos.map((m) => m.nivel))];
    return `<div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>Curso em vídeo</span></div>
  <h2 class="t-title">${esc(CURSO_JAVA.title)}</h2>
  <div class="meta"><span class="tag lv">${AULAS.length} aulas</span><span class="tag">~${fmtHoras(total)} de vídeo</span><span class="tag">${CURSO_JAVA.modulos.length} módulos</span></div>
  <p class="summary">A ${esc(CURSO_JAVA.serie)}, de ${esc(CURSO_JAVA.autor)}, na ordem da playlist e dividida em módulos. Cada módulo aponta para o tópico da trilha que aprofunda o assunto. Marque as aulas assistidas; o progresso fica salvo neste navegador.</p>
  <div class="prog curso-prog" id="cursoProg">${cursoProgHtml()}</div>
  ${
    prox
      ? `<a class="cta" href="${esc(urlAula(prox))}" target="_blank" rel="noopener">${feitasDe(AULAS) ? "Continuar" : "Começar"}: aula ${String(prox.n).padStart(2, "0")} · ${esc(prox.t)} →</a>`
      : `<p class="note"><b>Curso concluído.</b> Siga para o tópico <a href="#java-moderno">Java 25: a linguagem moderna</a>.</p>`
  }
  <div class="callout"><b>Sobre a versão do Java</b>O curso foi gravado com o JDK 15 e a IntelliJ Community. Instale a LTS atual (Java 25): tudo o que é ensinado continua valendo. O que veio depois, como sealed types, pattern matching no switch e virtual threads, está no tópico <a href="#java-moderno">Java 25: a linguagem moderna</a>.</div>
  ${niveis
    .map(
      (nv) => `<h3 class="sec-h">${esc(nv)}</h3>
  <div class="mods">${CURSO_JAVA.modulos
    .map((m, mi) => ({ m, mi }))
    .filter(({ m }) => m.nivel === nv)
    .map(({ m, mi }) => {
      const as = AULAS.filter((a) => a.mi === mi);
      const dur = as.reduce((a, x) => a + segs(x.dur), 0);
      const f = feitasDe(as);
      const tp = m.topico && TOPICS.find((t) => t.id === m.topico);
      return `<details class="mod${f === as.length ? " ok" : ""}"${prox && prox.mi === mi ? " open" : ""} data-mi="${mi}">
      <summary><span class="num">${String(mi + 1).padStart(2, "0")}</span><b>${esc(m.t)}</b><span class="mc">${f}/${as.length} · ${fmtHoras(dur)}</span></summary>
      ${tp ? `<p class="mod-link">Na trilha: <a href="#${tp.id}">${esc(tp.title)}</a></p>` : ""}
      <ol class="aulas">${as
        .map((a) => {
          const on = !!state.aulas[a.id];
          return `<li class="${on ? "done" : ""}"><input type="checkbox" id="aula-${a.id}" data-aula="${a.id}" ${on ? "checked" : ""} aria-label="Marcar aula ${a.n} como assistida">
        <span class="an">${String(a.n).padStart(2, "0")}</span><a href="${esc(urlAula(a))}" target="_blank" rel="noopener">${esc(a.t)}</a><span class="ad">${esc(a.dur)}</span></li>`;
        })
        .join("")}</ol>
    </details>`;
    })
    .join("")}</div>`,
    )
    .join("")}`;
  }

  /* ---------- roteamento ---------- */
  let current = null;
  function route() {
    const h = (location.hash || "#inicio").slice(1);
    const t = TOPICS.find((x) => x.id === h);
    const v = $("#view");
    if (t) {
      v.innerHTML = topic(t);
      current = t;
      $("#topTitle").textContent = t.title;
    } else if (h === "projeto") {
      v.innerHTML = projeto();
      current = null;
      $("#topTitle").textContent = "Projeto final";
    } else if (h === "biblioteca") {
      v.innerHTML = biblioteca();
      current = null;
      $("#topTitle").textContent = "Biblioteca essencial";
    } else if (h === "curso") {
      v.innerHTML = curso();
      current = null;
      $("#topTitle").textContent = "Curso de Java";
    } else {
      v.innerHTML = home();
      current = null;
      $("#topTitle").textContent = "Trilha do Arquiteto Java";
    }
    renderNav(
      t ? t.id : ["projeto", "biblioteca", "curso"].includes(h) ? h : "inicio",
    );
    if (window.hljs)
      v.querySelectorAll("pre code").forEach((el) => {
        try {
          hljs.highlightElement(el);
        } catch (e) {}
      });
    closeNav();
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest(".copy");
    if (c && current) {
      const src = current.code[+c.dataset.k].src;
      const ok = () => {
        c.textContent = "copiado";
        setTimeout(() => (c.textContent = "copiar"), 1400);
      };
      try {
        navigator.clipboard.writeText(src).then(ok, () => selectPre(c));
      } catch (err) {
        selectPre(c);
      }
    }
    if (e.target.id === "markBtn" && current) {
      state.done[current.id] = !state.done[current.id];
      save();
      const y = window.scrollY;
      $("#view").innerHTML = topic(current);
      if (window.hljs)
        $("#view")
          .querySelectorAll("pre code")
          .forEach((el) => hljs.highlightElement(el));
      renderNav(current.id);
      window.scrollTo(0, y);
    }
  });
  function selectPre(btn) {
    const pre = btn.closest(".code").querySelector("pre");
    const r = document.createRange();
    r.selectNodeContents(pre);
    const s = getSelection();
    s.removeAllRanges();
    s.addRange(r);
    btn.textContent = "selecionado";
  }
  document.addEventListener("change", (e) => {
    const aula = e.target.dataset && e.target.dataset.aula;
    if (aula) {
      state.aulas[aula] = e.target.checked;
      save();
      e.target.closest("li").classList.toggle("done", e.target.checked);
      const mod = e.target.closest(".mod"),
        as = AULAS.filter((a) => a.mi === +mod.dataset.mi),
        f = feitasDe(as);
      mod.classList.toggle("ok", f === as.length);
      const mc = mod.querySelector(".mc");
      mc.textContent = mc.textContent.replace(/^\d+/, f);
      $("#cursoProg").innerHTML = cursoProgHtml();
      return;
    }
    const id = e.target.dataset && e.target.dataset.ex;
    if (!id) return;
    state.ex[id] = e.target.checked;
    save();
    e.target.closest("li").classList.toggle("done", e.target.checked);
    renderNav(current ? current.id : "inicio");
  });

  function closeNav() {
    $("#side").classList.remove("open");
    $("#scrim").classList.remove("open");
    $("#openNav").setAttribute("aria-expanded", "false");
  }
  $("#openNav").addEventListener("click", () => {
    $("#side").classList.add("open");
    $("#scrim").classList.add("open");
    $("#openNav").setAttribute("aria-expanded", "true");
  });
  $("#scrim").addEventListener("click", closeNav);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  window.addEventListener("hashchange", route);
  route();
})();
