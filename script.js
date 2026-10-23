(function () {
  const LV = { 1: "Aquecimento", 2: "Prática", 3: "Desafio" };
  const KEY = "trilha-arquiteto-v1";
  let state = { done: {}, ex: {}, proj: {} };
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
  const n2 = (n) => String(n).padStart(2, "0");
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
    if (/^\s*(SELECT|WITH|UPDATE|INSERT|CREATE|--)/i.test(src)) return "sql";
    if (/^\s*(workspace|C4Context)\b/.test(src)) return "plaintext";
    if (/^\s*#\s*ADR/.test(src)) return "markdown";
    if (/^\s*(resource|module)\s+"/.test(src)) return "plaintext";
    if (/^\s*(generator|datasource|model)\s+\w+\s*\{/.test(src))
      return "plaintext";
    if (/^\s*\{/.test(src)) return "json";
    if (/^\s*(apiVersion|name:|services:|version:|openapi:|#\s*docs\/)/.test(src))
      return "yaml";
    if (/[├└]──/.test(src)) return "plaintext";
    if (/^\s*(npm|npx|pnpm|docker|git|curl|node|dig|nest|cd|psql)\b/.test(src))
      return "bash";
    return "typescript";
  }

  /* ---------- projeto ---------- */
  const PARTES = PROJETO.partes;
  PARTES.forEach((p, i) => (p.n = i + 1));
  const parteDa = (faseId) => PARTES.find((p) => p.fase === faseId);
  const feitasDa = (p) =>
    p.entregas.filter((_, i) => state.proj[p.fase + ":" + i]).length;
  function parteStatus(p) {
    const f = feitasDa(p);
    return f === p.entregas.length ? "done" : f ? "part" : "";
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
      .map((p) => {
        const pt = parteDa(p.id);
        return `
    <div class="phase"><div class="phase-h"><span class="n">${n2(p.n)}</span><span>${esc(p.title)}</span></div>
    ${byPhase(p.id)
      .map(
        (t) =>
          `<a class="tlink${cur === t.id ? " on" : ""}" href="#${t.id}"><span class="dot ${topicStatus(t)}"></span>${esc(t.title)}</a>`,
      )
      .join("")}
    ${pt ? `<a class="tlink proj${cur === "projeto/" + p.id ? " on" : ""}" href="#projeto/${p.id}"><span class="dot ${parteStatus(pt)}"></span>Projeto · parte ${pt.n}</a>` : ""}
    </div>`;
      })
      .join("")}
    ${s.milestone ? `<div class="mile">🏆 ${esc(s.milestone)}</div>` : ""}`,
    ).join("");
    document
      .querySelectorAll(".navx a")
      .forEach((a) =>
        a.classList.toggle(
          "on",
          a.dataset.v === cur || (a.dataset.v === "projeto" && cur.startsWith("projeto/")),
        ),
      );
    const total = TOPICS.length,
      feitos = TOPICS.filter((t) => state.done[t.id]).length;
    const pct = Math.round((100 * feitos) / total);
    $("#progFill").style.width = pct + "%";
    $("#progTxt").textContent = `${feitos} de ${total} tópicos`;
    $("#progPct").textContent = pct + "%";
  }

  /* ---------- visões ---------- */
  function codeBlocks(lista) {
    codigos = lista.map((c) => c.src);
    return lista;
  }
  function codeFigure(titulo, src, k) {
    return `<figure class="code" style="margin:0 0 18px"><div class="code-h"><span>${esc(titulo)}</span><button class="copy" data-k="${k}">copiar</button></div><pre><code class="language-${guessLang(src)}">${esc(src)}</code></pre></figure>`;
  }
  const tabelas = (html) =>
    html
      .replace(/<table class="tbl">/g, '<div class="tblwrap"><table class="tbl">')
      .replace(/<\/table>/g, "</table></div>");

  function home() {
    const horas = TOPICS.reduce((a, t) => a + t.hours, 0);
    const exs = TOPICS.reduce((a, t) => a + t.exercises.length, 0);
    const prox = TOPICS.find((t) => !state.done[t.id]) || TOPICS[0];
    return `
  <section class="hero">
    <div class="eyebrow">De desenvolvedor TypeScript a arquiteto de software</div>
    <h2>Uma trilha para pensar em <em>trade-offs</em>, não em modismos.</h2>
    <p class="lede">A trilha segue o seu <b>Mapa do Arquiteto</b>, na mesma ordem: da largada até Programador Júnior, Pleno/Sênior, Arquiteto de Software e Arquiteto de Soluções. Cada tópico traz explicação, código TypeScript real, exercícios em três níveis e as referências que a área respeita. E cada fase acrescenta uma parte ao projeto que você vai construir do começo ao fim.</p>
    <div class="stats">
      <div><b>${STAGES.length - 1}</b><span>etapas do mapa</span></div>
      <div><b>${TOPICS.length}</b><span>tópicos</span></div>
      <div><b>${PARTES.length}</b><span>partes do projeto</span></div>
      <div><b>${exs}</b><span>exercícios</span></div>
      <div><b>~${horas}h</b><span>de estudo focado</span></div>
    </div>
    <a class="cta" href="#${prox.id}">${state.done[TOPICS[0].id] ? "Continuar" : "Começar"}: ${esc(prox.title)} →</a>
    <a class="cta-2" href="#projeto">Veja o projeto que você vai construir: ${esc(PROJETO.title)} →</a>
    <p class="note"><b>Fiel ao seu quadro:</b> etapas, marcos, ordem e nomes vêm do "Mapa do Arquiteto: ROADMAP" no Miro. Itens que o mapa só cita (como a linguagem, os frameworks MVC ou os bancos) foram resolvidos para TypeScript, Node.js, NestJS e PostgreSQL. A última etapa, "Fora da curva", é um extra além do mapa.</p>
  </section>

  <h3 class="sec-h">Como estudar</h3>
  <p class="sec-sub">O ritmo sugerido assume cerca de 10 horas por semana. Ajuste ao seu, mas mantenha a ordem: cada fase usa a anterior.</p>
  <div class="how">
    <div><b>Leia e reproduza</b><p>Digite os exemplos em vez de copiar. Rode, quebre de propósito, observe o erro.</p></div>
    <div><b>Faça os três níveis</b><p>Aquecimento fixa o conceito, Prática aplica num cenário real, Desafio força você a decidir sozinho.</p></div>
    <div><b>Construa a parte da fase</b><p>Ao fim de cada fase, implemente a parte correspondente do projeto. É ali que o conteúdo vira habilidade.</p></div>
    <div><b>Registre decisões</b><p>Desde o começo, anote o porquê de cada escolha. Na etapa de Arquiteto, as anotações viram ADRs.</p></div>
  </div>

  <h3 class="sec-h">O caminho</h3>
  <p class="sec-sub">Marque tópicos e entregas do projeto como concluídos; o progresso fica salvo neste navegador.</p>
  ${STAGES.map(
    (
      s,
    ) => `<div class="stage-block"><div class="stage-title">${esc(s.title)}</div>
  <ol class="map">${PHASES.filter((p) => p.stage === s.id)
    .map((p) => {
      const ts = byPhase(p.id),
        pt = parteDa(p.id),
        ok = ts.every((t) => state.done[t.id]);
      return `<li class="${ok ? "ok" : ""}"><span class="num">${n2(p.n)}</span>
      <h4><a href="#${ts[0].id}">${esc(p.title)}</a><span class="wk">${esc(p.weeks)}</span></h4>
      <p>${esc(p.goal)}</p>
      <div class="chips">${ts.map((t) => `<a class="chip${state.done[t.id] ? " done" : ""}" href="#${t.id}">${esc(t.title)}</a>`).join("")}${pt ? `<a class="chip proj${parteStatus(pt) === "done" ? " done" : ""}" href="#projeto/${p.id}">Projeto · ${esc(pt.t)}</a>` : ""}</div></li>`;
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
    const pt = parteDa(ph.id);
    const ultimoDaFase = !next || next.phase !== t.phase;
    return `
  <div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>${esc(STAGES.find((s) => s.id === ph.stage).short)}</span><span>/</span><span>${n2(ph.n)} · ${esc(ph.title)}</span></div>
  <h2 class="t-title">${esc(t.title)}</h2>
  <div class="meta"><span class="tag lv">${esc(t.level)}</span><span class="tag">~${t.hours}h</span><span class="tag">${t.exercises.length} exercícios</span><span class="tag">${t.refs.length} referências</span></div>
  <p class="summary">${esc(t.summary)}</p>
  <div class="prose">${tabelas(t.body)}</div>

  ${
    t.code.length
      ? `<div class="block-h"><h3>Exemplos práticos</h3><span>${t.code.length} trecho${t.code.length > 1 ? "s" : ""}</span></div>
  ${codeBlocks(t.code).map((c, k) => codeFigure(c.t, c.src, k)).join("")}`
      : codeBlocks([]) && ""
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

  ${
    pt
      ? `<a class="proj-box" href="#projeto/${ph.id}"><span class="k">${ultimoDaFase ? "Agora, no projeto" : "No projeto desta fase"} · parte ${pt.n} de ${PARTES.length}</span><b>${esc(pt.t)}</b><p>${pt.objetivo}</p><span class="go">Abrir o passo a passo →</span></a>`
      : ""
  }

  <div class="done-bar"><span>${state.done[t.id] ? "Tópico concluído. Bom trabalho." : "Terminou a leitura e os exercícios?"}</span>
    <button class="mark${state.done[t.id] ? " is" : ""}" id="markBtn">${state.done[t.id] ? "Desmarcar" : "Marcar como concluído"}</button></div>
  <nav class="pager">
    ${prev ? `<a href="#${prev.id}"><small>← Anterior</small><b>${esc(prev.title)}</b></a>` : ""}
    ${
      ultimoDaFase && pt
        ? `<a class="nx" href="#projeto/${ph.id}"><small>Próximo →</small><b>Projeto · parte ${pt.n}: ${esc(pt.t)}</b></a>`
        : next
          ? `<a class="nx" href="#${next.id}"><small>Próximo →</small><b>${esc(next.title)}</b></a>`
          : `<a class="nx" href="#projeto"><small>Próximo →</small><b>O projeto</b></a>`
    }
  </nav>`;
  }

  function projeto() {
    codeBlocks([]);
    const total = PARTES.reduce((a, p) => a + p.entregas.length, 0),
      feitas = PARTES.reduce((a, p) => a + feitasDa(p), 0),
      pct = Math.round((100 * feitas) / total);
    const prox = PARTES.find((p) => parteStatus(p) !== "done") || PARTES[0];
    return `<div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>Projeto</span></div>
  <h2 class="t-title">Projeto: ${esc(PROJETO.title)}</h2>
  <div class="meta"><span class="tag lv">${PARTES.length} partes</span><span class="tag">${total} entregas</span><span class="tag">uma parte por fase</span></div>
  <p class="summary">${esc(PROJETO.intro)}</p>
  <div class="prog proj-prog"><div class="prog-bar"><i style="width:${pct}%"></i></div>
    <small><span>${feitas} de ${total} entregas concluídas</span><span>${pct}%</span></small></div>
  <a class="cta" href="#projeto/${prox.fase}">${feitas ? "Continuar" : "Começar"}: parte ${prox.n} · ${esc(prox.t)} →</a>

  <h3 class="sec-h">A stack</h3>
  <div class="chips stack">${PROJETO.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
  <div class="callout"><b>A regra de ouro do projeto</b>${esc(PROJETO.regra)}</div>

  <h3 class="sec-h">Como o projeto evolui</h3>
  <p class="sec-sub">As grandes versões do sistema e as partes que constroem cada uma.</p>
  <ul class="steps">${PROJETO.evolucao
    .map(
      (v, i) => `<li><span class="f">Versão ${i + 1}</span><div><b>${esc(v.t)}</b><p>${esc(v.d)}</p>
      <div class="chips">${v.fases
        .map((f) => {
          const p = parteDa(f);
          return `<a class="chip${parteStatus(p) === "done" ? " done" : ""}" href="#projeto/${f}">${p.n}. ${esc(p.t)}</a>`;
        })
        .join("")}</div></div></li>`,
    )
    .join("")}</ul>

  <h3 class="sec-h">As ${PARTES.length} partes</h3>
  <p class="sec-sub">Na ordem da trilha. Estude os tópicos da fase e depois implemente a parte.</p>
  ${STAGES.map((s) => {
    const ps = PARTES.filter((p) => phaseOf(p.fase).stage === s.id);
    return ps.length
      ? `<div class="stage-block"><div class="stage-title">${esc(s.title)}</div>
  <ol class="map">${ps
    .map((p) => {
      const f = feitasDa(p);
      return `<li class="${f === p.entregas.length ? "ok" : ""}"><span class="num">${n2(p.n)}</span>
      <h4><a href="#projeto/${p.fase}">${esc(p.t)}</a><span class="wk">${f}/${p.entregas.length}</span></h4>
      <p>${p.objetivo}</p></li>`;
    })
    .join("")}</ol></div>`
      : "";
  }).join("")}

  <div class="callout" style="margin-top:28px"><b>Como apresentar no fim</b>Um README que conta a história: o problema, as características priorizadas, a evolução do monolito modular, os ADRs mais importantes, os números dos testes de carga, o custo da IA e o que você faria diferente. Esse texto vale tanto quanto o código.</div>`;
  }

  function parte(p) {
    const ph = phaseOf(p.fase);
    const prev = PARTES[p.n - 2],
      next = PARTES[p.n];
    const f = feitasDa(p);
    const comCodigo = p.passos.filter((s) => s.code);
    codeBlocks(comCodigo.map((s) => ({ src: s.code })));
    return `<div class="crumb"><a href="#inicio">Trilha</a><span>/</span><a href="#projeto">Projeto</a><span>/</span><span>Parte ${p.n} de ${PARTES.length}</span></div>
  <h2 class="t-title">${esc(p.t)}</h2>
  <div class="meta"><span class="tag lv">Parte ${p.n}</span><span class="tag">fase ${n2(ph.n)} · ${esc(ph.title)}</span><span class="tag" id="projCount">${f}/${p.entregas.length} entregas</span></div>
  <p class="summary">${p.objetivo}</p>
  <p class="sec-sub">Estude antes: ${byPhase(ph.id)
    .map((t) => `<a class="chip${state.done[t.id] ? " done" : ""}" href="#${t.id}">${esc(t.title)}</a>`)
    .join(" ")}</p>

  <div class="block-h"><h3>O que implementar</h3><span>marque ao concluir</span></div>
  <ul class="ex">${p.entregas
    .map((e, k) => {
      const id = p.fase + ":" + k,
        on = !!state.proj[id];
      return `<li class="${on ? "done" : ""}"><input type="checkbox" id="pj-${p.fase}-${k}" data-proj="${id}" ${on ? "checked" : ""}>
      <label for="pj-${p.fase}-${k}"><p>${e}</p></label></li>`;
    })
    .join("")}</ul>

  <div class="block-h"><h3>Passo a passo</h3><span>${p.passos.length} passos</span></div>
  <ol class="passos">${p.passos
    .map(
      (s) => `<li><h4>${esc(s.t)}</h4>${s.d ? `<div class="prose">${tabelas(s.d)}</div>` : ""}${
        s.code ? codeFigure("código", s.code, comCodigo.indexOf(s)) : ""
      }</li>`,
    )
    .join("")}</ol>

  <div class="callout pronto"><b>Pronto quando</b>${p.pronto}</div>

  <nav class="pager">
    ${prev ? `<a href="#projeto/${prev.fase}"><small>← Parte ${prev.n}</small><b>${esc(prev.t)}</b></a>` : `<a href="#projeto"><small>← Visão geral</small><b>O projeto</b></a>`}
    ${
      next
        ? `<a class="nx" href="#${byPhase(next.fase)[0].id}"><small>Próxima fase →</small><b>${esc(phaseOf(next.fase).title)}</b></a>`
        : `<a class="nx" href="#projeto"><small>Fim →</small><b>Visão geral do projeto</b></a>`
    }
  </nav>`;
  }

  function biblioteca() {
    codeBlocks([]);
    return `<div class="crumb"><a href="#inicio">Trilha</a><span>/</span><span>Leituras</span></div>
  <h2 class="t-title">Biblioteca essencial</h2>
  <p class="summary">Os livros que arquitetos experientes citam com mais frequência, na fase em que fazem mais sentido. Não leia tudo de uma vez: leia junto com a fase.</p>
  <div class="books">${BOOKS.map((b) => {
    const p = phaseOf(b.f);
    return `<div class="book"><span class="ph">${n2(p.n)} · ${esc(p.title)}</span><b>${esc(b.t)}</b><i>${esc(b.a)}</i><p>${esc(b.why)}</p></div>`;
  }).join("")}</div>`;
  }

  /* ---------- roteamento ---------- */
  let current = null;
  let codigos = [];
  function route() {
    const h = (location.hash || "#inicio").slice(1);
    const t = TOPICS.find((x) => x.id === h);
    const pt = h.startsWith("projeto/") && parteDa(h.slice(8));
    const v = $("#view");
    current = null;
    if (t) {
      v.innerHTML = topic(t);
      current = t;
      $("#topTitle").textContent = t.title;
    } else if (pt) {
      v.innerHTML = parte(pt);
      $("#topTitle").textContent = "Projeto · parte " + pt.n;
    } else if (h === "projeto") {
      v.innerHTML = projeto();
      $("#topTitle").textContent = "Projeto";
    } else if (h === "biblioteca") {
      v.innerHTML = biblioteca();
      $("#topTitle").textContent = "Biblioteca essencial";
    } else {
      codeBlocks([]);
      v.innerHTML = home();
      $("#topTitle").textContent = "Trilha do Arquiteto";
    }
    renderNav(
      t ? t.id : pt ? h : ["projeto", "biblioteca"].includes(h) ? h : "inicio",
    );
    highlight(v);
    closeNav();
    window.scrollTo(0, 0);
  }
  function highlight(v) {
    if (window.hljs)
      v.querySelectorAll("pre code").forEach((el) => {
        try {
          hljs.highlightElement(el);
        } catch (e) {}
      });
  }

  document.addEventListener("click", (e) => {
    const c = e.target.closest(".copy");
    if (c) {
      const src = codigos[+c.dataset.k];
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
      highlight($("#view"));
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
    const d = e.target.dataset || {};
    if (d.proj) {
      state.proj[d.proj] = e.target.checked;
      save();
      e.target.closest("li").classList.toggle("done", e.target.checked);
      const p = parteDa(d.proj.split(":")[0]);
      $("#projCount").textContent = `${feitasDa(p)}/${p.entregas.length} entregas`;
      renderNav("projeto/" + p.fase);
      return;
    }
    if (!d.ex) return;
    state.ex[d.ex] = e.target.checked;
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
