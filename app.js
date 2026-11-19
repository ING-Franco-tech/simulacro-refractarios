/* Motor del simulacro: pestañas, pasos con trazos animados sobre el diagrama, preguntas con retroalimentación y puntaje. */
(function () {
  "use strict";
  const NS = "http://www.w3.org/2000/svg";
  const $ = (s, r) => (r || document).querySelector(s);
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const sv = (tag, a, p) => { const e = document.createElementNS(NS, tag); for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
  const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString("es-CO", { minimumFractionDigits: 0, maximumFractionDigits: d });
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const svgLabel = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/([A-Za-z\)])(\d+)/g, "$1<tspan baseline-shift='sub' font-size='70%'>$2</tspan>");

  /* ---------- geometría ternaria ---------- */
  const V = SYS.V;
  const toPx = (c) => { const s = c[0] + c[1] + c[2]; const a = c[0] / s, b = c[1] / s, g = c[2] / s; return [a * V.C[0] + b * V.A[0] + g * V.S[0], a * V.C[1] + b * V.A[1] + g * V.S[1]]; };
  function fromPx(x, y) {
    const [x1, y1] = V.C, [x2, y2] = V.A, [x3, y3] = V.S;
    const d = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
    const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / d;
    const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / d;
    return [a * 100, b * 100, (1 - a - b) * 100];
  }
  const cp = (id) => SYS.cmp[id].c;
  function interLL(p1, p2, p3, p4) { // intersección de rectas p1p2 y p3p4 (px)
    const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
    const t = ((p1[0] - p3[0]) * (p3[1] - p4[1]) - (p1[1] - p3[1]) * (p3[0] - p4[0])) / d;
    return [p1[0] + t * (p2[0] - p1[0]), p1[1] + t * (p2[1] - p1[1])];
  }
  const CENT = toPx([33.3, 33.3, 33.4]);
  const triById = (id) => SYS.tris.find((t) => t.id === id);

  /* ---------- estado y puntaje ---------- */
  const QS = []; // todas las preguntas puntuables
  P1.items.forEach((it, i) => QS.push({ id: "p1-" + i, p: "p1" }));
  [["p2", P2], ["p3", P3]].forEach(([k, P]) => P.steps.forEach((s, i) => { if (s.q) QS.push({ id: k + "-" + i, p: k }); }));
  const W = { p1: 0.25, p2: 0.35, p3: 0.40 };
  let ST = { first: {}, done: {}, p1v: {}, cur: { p2: 0, p3: 0 }, tab: "p1" };
  try { const s = JSON.parse(localStorage.getItem("simref-v1")); if (s && s.first) ST = Object.assign(ST, s); } catch (e) {}
  const save = () => { try { localStorage.setItem("simref-v1", JSON.stringify(ST)); } catch (e) {} };
  function recordFirst(id, ok) { if (!(id in ST.first)) ST.first[id] = !!ok; save(); updateScore(); }
  function parts() {
    const r = {};
    ["p1", "p2", "p3"].forEach((p) => { const q = QS.filter((x) => x.p === p); r[p] = { n: q.length, ok: q.filter((x) => ST.first[x.id]).length, ans: q.filter((x) => x.id in ST.first).length }; });
    return r;
  }
  const nota = (r) => 5 * (W.p1 * r.p1.ok / r.p1.n + W.p2 * r.p2.ok / r.p2.n + W.p3 * r.p3.ok / r.p3.n);
  function updateScore() {
    const r = parts(); const ok = r.p1.ok + r.p2.ok + r.p3.ok, an = r.p1.ans + r.p2.ans + r.p3.ans;
    $("#scorebox").innerHTML = `<span class="sb-k">Aciertos al primer intento</span><span class="sb-v">${ok}<small>/${QS.length}</small></span><span class="sb-n">Nota parcial ${fmt(nota(r), 2)}</span>`;
    $("#readbar").style.width = (100 * an / QS.length) + "%";
    if (ST.tab === "res") renderRes();
  }

  /* ---------- pestañas ---------- */
  const TABS = [["p1", "Punto 1 · Teoría"], ["p2", "Punto 2 · Diagrama"], ["p3", "Punto 3 · Caso"], ["rep", "Repaso"], ["res", "Resultados"]];
  const docs = $("#docs"), views = $("#views");
  const VIEWS = {};
  TABS.forEach(([k, t]) => {
    const b = h("button", null, t); b.setAttribute("role", "tab"); b.id = "tab-" + k;
    b.onclick = () => show(k); docs.appendChild(b);
    const v = h("div", "view"); v.id = "view-" + k; v.hidden = true; views.appendChild(v); VIEWS[k] = v;
  });
  function show(k) {
    ST.tab = k; save();
    TABS.forEach(([kk]) => { $("#tab-" + kk).setAttribute("aria-selected", kk === k ? "true" : "false"); VIEWS[kk].hidden = kk !== k; });
    if (k === "p2" || k === "p3") STAGES[k].render(false);
    if (k === "res") renderRes();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ================= PUNTO 1 ================= */
  function buildP1() {
    const v = VIEWS.p1;
    v.appendChild(h("div", "statement", "<b class='lead'>" + P1.title + "</b>" + P1.intro));
    const list = h("ol", "fill");
    P1.items.forEach((it, i) => {
      const li = h("li", "fcard"); const id = "p1-" + i;
      let html = it.q.replace(/\{(\d)\}/g, (m, n) => {
        const b = it.b[+n];
        if (b.sel) return `<select data-b="${n}" aria-label="Espacio ${+n + 1}"><option value="">— elige —</option>${b.sel.map((o, j) => `<option value="${j}">${o.replace(/<[^>]+>/g, "")}</option>`).join("")}</select>`;
        return `<input data-b="${n}" inputmode="decimal" autocomplete="off" aria-label="Espacio ${+n + 1}" placeholder="…">`;
      });
      li.innerHTML = `<p class="fq">${html}</p><div class="frow"><button class="navbtn next sm" type="button">Revisar</button><span class="fres"></span></div><div class="fexp" hidden></div>`;
      const saved = ST.p1v[id] || {};
      li.querySelectorAll("[data-b]").forEach((e) => { if (saved[e.dataset.b] != null) e.value = saved[e.dataset.b]; e.addEventListener("change", () => { (ST.p1v[id] = ST.p1v[id] || {})[e.dataset.b] = e.value; save(); }); });
      li.querySelector("button").onclick = () => checkP1(li, it, id);
      if (id in ST.first) checkP1(li, it, id, true);
      list.appendChild(li);
    });
    v.appendChild(list);
    const all = h("div", "navrow"); const b = h("button", "navbtn next", "Revisar todas"); b.type = "button";
    b.onclick = () => list.querySelectorAll(".fcard").forEach((li, i) => { if (!("p1-" + i in ST.first)) checkP1(li, P1.items[i], "p1-" + i); });
    const go = h("button", "navbtn prev", "Ir al punto 2 →"); go.type = "button"; go.onclick = () => show("p2");
    all.append(b, go); v.appendChild(all);
  }
  function checkP1(li, it, id, silent) {
    let allOk = true, empty = false;
    li.querySelectorAll("[data-b]").forEach((e) => {
      const b = it.b[+e.dataset.b]; let ok;
      if (e.value === "") empty = true;
      if (b.sel) ok = e.value !== "" && +e.value === b.ans;
      else { const x = parseFloat(String(e.value).replace(",", ".")); ok = !isNaN(x) && Math.abs(x - b.num) <= (b.tol || 0) + 1e-9; }
      e.classList.toggle("ok", ok); e.classList.toggle("bad", !ok); allOk = allOk && ok;
    });
    if (empty && !silent && !(id in ST.first)) { li.querySelector(".fres").textContent = "Completa todos los espacios antes de revisar."; li.querySelector(".fres").className = "fres warn"; return; }
    if (!silent) recordFirst(id, allOk);
    const ans = it.b.map((b) => (b.sel ? b.sel[b.ans] : String(b.num))).join(" · ");
    const r = li.querySelector(".fres");
    r.className = "fres " + (allOk ? "ok" : "bad");
    r.innerHTML = allOk ? "✓ Correcto" : "✗ Respuesta: <b>" + ans + "</b>";
    const first = ST.first[id];
    li.classList.toggle("was-ok", first === true); li.classList.toggle("was-bad", first === false);
    const ex = li.querySelector(".fexp"); ex.hidden = false; ex.innerHTML = "<b>Por qué:</b> " + it.exp;
  }

  /* ================= PUNTOS 2 Y 3 (escenario con diagrama) ================= */
  let SPEED = 1;
  const STAGES = {};
  function makeStage(key, P) {
    const v = VIEWS[key];
    v.appendChild(h("div", "statement", P.statement));
    const stage = h("div", "stage");
    stage.innerHTML = `
      <figure class="plate">
        <svg viewBox="0 0 ${SYS.w} ${SYS.h}" role="img" aria-label="Diagrama CaO–Al2O3–SiO2 con los trazos del paso actual">
          <rect x="0" y="0" width="${SYS.w}" height="${SYS.h}" fill="#fff"/>
          <image href="${SYS.img}" x="0" y="0" width="${SYS.w}" height="${SYS.h}"/>
          <g class="g-grid" style="display:none"></g><g class="g-lay"></g><g class="g-lab"></g><g class="g-user"></g><g class="g-cur"></g>
        </svg>
        <div class="nowdraw"><span class="k">Cursor</span><span class="rd">Mueve el cursor sobre el diagrama para leer la composición.</span></div>
        <figcaption class="legend">
          <button type="button" class="chip gridbtn" aria-pressed="false">Retícula 10 %</button>
          <button type="button" class="chip replay">Repetir trazos</button>
          <button type="button" class="chip widebtn" aria-pressed="false">Ampliar diagrama</button>
          <label class="speed">Velocidad <select><option value="0.5">lenta</option><option value="1" selected>normal</option><option value="2">rápida</option><option value="0">sin animación</option></select></label>
        </figcaption>
      </figure>
      <section class="panel">
        <div class="stepcount"><span class="sc"></span><span class="tag sk"></span></div>
        <h2 class="st"></h2>
        <div class="stepbody"></div>
        <div class="qbox"></div>
        <div class="navrow">
          <button class="navbtn prev" type="button">Anterior</button>
          <button class="navbtn next" type="button">Siguiente</button>
        </div>
        <div class="progress"><div></div></div>
        <details class="index"><summary>Índice de pasos</summary><ol class="steplist"></ol></details>
      </section>`;
    v.appendChild(stage);
    const svg = $("svg", stage), gGrid = $(".g-grid", stage), gLay = $(".g-lay", stage), gLab = $(".g-lab", stage), gUser = $(".g-user", stage), gCur = $(".g-cur", stage);
    const rd = $(".rd", stage), qbox = $(".qbox", stage), body = $(".stepbody", stage);
    const btnPrev = $(".navbtn.prev", stage), btnNext = $(".navbtn.next", stage);
    const steplist = $(".steplist", stage);
    let token = 0;
    const S = { key, P, stage };
    STAGES[key] = S;

    /* retícula */
    (function grid() {
      for (let v = 10; v < 100; v += 10) {
        [[0, [v, 100 - v, 0], [v, 0, 100 - v]], [1, [100 - v, v, 0], [0, v, 100 - v]], [2, [100 - v, 0, v], [0, 100 - v, v]]].forEach(([k, a, b]) => {
          const A = toPx(a), B = toPx(b);
          sv("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: ["#0b8f84", "#e6427a", "#6b4fd8"][k], "stroke-width": 1.6, opacity: 0.42 }, gGrid);
        });
        // marcas de lectura en los bordes
        const tCa = toPx([v, 0, 100 - v]), tAl = toPx([100 - v, v, 0]), tSi = toPx([0, 100 - v, v]);
        sv("text", { x: tCa[0] - 16, y: tCa[1] + 6, "text-anchor": "end", "font-size": 22, fill: "#0b8f84", class: "halo", "font-weight": 700 }, gGrid).textContent = v;
        sv("text", { x: tAl[0] - 4, y: tAl[1] + 30, "text-anchor": "middle", "font-size": 22, fill: "#e6427a", class: "halo", "font-weight": 700 }, gGrid).textContent = v;
        sv("text", { x: tSi[0] + 16, y: tSi[1] + 6, "text-anchor": "start", "font-size": 22, fill: "#6b4fd8", class: "halo", "font-weight": 700 }, gGrid).textContent = v;
      }
    })();
    const gridBtn = $(".gridbtn", stage);
    const setGrid = (on) => { gGrid.style.display = on ? "" : "none"; gridBtn.setAttribute("aria-pressed", on ? "true" : "false"); };
    gridBtn.onclick = () => setGrid(gGrid.style.display === "none");
    $(".replay", stage).onclick = () => S.render(true);
    const wideBtn = $(".widebtn", stage);
    const setWide = (on) => { stage.classList.toggle("wide", on); wideBtn.setAttribute("aria-pressed", on ? "true" : "false"); wideBtn.textContent = on ? "Reducir diagrama" : (window.innerWidth < 920 ? "Ampliar (deslizar)" : "Ampliar diagrama"); };
    wideBtn.onclick = () => { ST.wide = !stage.classList.contains("wide"); save(); Object.values(STAGES).forEach((x) => x.setWide && x.setWide(ST.wide)); stage.querySelector("figure").scrollIntoView({ behavior: "smooth", block: "start" }); };
    S.setWide = setWide; setWide(!!ST.wide);
    $(".speed select", stage).onchange = (e) => { SPEED = +e.target.value; document.querySelectorAll(".speed select").forEach((s) => (s.value = e.target.value)); };

    /* lectura del cursor */
    function evPx(ev) { const pt = svg.createSVGPoint(); const t = ev.touches ? ev.touches[0] : ev; pt.x = t.clientX; pt.y = t.clientY; const m = svg.getScreenCTM().inverse(); const p = pt.matrixTransform(m); return [p.x, p.y]; }
    const inside = (c) => c.every((x) => x >= -0.6);
    svg.addEventListener("mousemove", (ev) => {
      const p = evPx(ev), c = fromPx(p[0], p[1]); gCur.innerHTML = "";
      if (!inside(c)) { rd.textContent = "Fuera del diagrama."; return; }
      rd.innerHTML = `CaO <b>${fmt(Math.max(0, c[0]))} %</b> · Al<sub>2</sub>O<sub>3</sub> <b>${fmt(Math.max(0, c[1]))} %</b> · SiO<sub>2</sub> <b>${fmt(Math.max(0, c[2]))} %</b>`;
      sv("circle", { cx: p[0], cy: p[1], r: 6, fill: "#ffb81f", "fill-opacity": .9, stroke: "#2b2140", "stroke-width": 1.5 }, gCur);
    });
    svg.addEventListener("mouseleave", () => { gCur.innerHTML = ""; });
    svg.addEventListener("click", (ev) => { const st = P.steps[ST.cur[key]]; if (st.q && st.q.type === "click" && !ST.done[qid()]) clickAnswer(evPx(ev)); });

    /* ---------- primitivas de dibujo ---------- */
    const dur = (len) => (SPEED === 0 ? 0 : Math.max(220, Math.min(1300, len * 1.25)) / SPEED);
    function animLine(e, len, my) {
      if (SPEED === 0 || !my) return Promise.resolve();
      e.style.strokeDasharray = len + " " + len; e.style.strokeDashoffset = len;
      e.getBoundingClientRect();
      const d = dur(len);
      e.style.transition = `stroke-dashoffset ${d}ms cubic-bezier(.4,0,.2,1)`; e.style.strokeDashoffset = 0;
      return sleep(d).then(() => { if (e.getAttribute("data-dash")) { e.style.strokeDasharray = e.getAttribute("data-dash"); } else e.style.strokeDasharray = ""; e.style.transition = ""; });
    }
    function fadeIn(e, my, d = 380) {
      if (SPEED === 0 || !my) return Promise.resolve();
      e.style.opacity = 0; e.getBoundingClientRect(); e.style.transition = `opacity ${d / SPEED}ms`; e.style.opacity = "";
      return sleep(d / SPEED);
    }
    function label(at, text, o = {}) {
      const g = sv("g", { class: "lbl" }, gLab);
      const t = sv("text", { x: at[0], y: at[1], "font-size": o.size || 30, "font-weight": o.w || 700, fill: o.col || "#2b2140", "text-anchor": o.anchor || "middle", class: "halo" }, g);
      t.innerHTML = svgLabel(text); return g;
    }
    function chip(at, text, col) {
      const g = sv("g", {}, gLab);
      const w = 14 * String(text).length + 22;
      sv("rect", { x: at[0] - w / 2, y: at[1] - 20, width: w, height: 36, rx: 18, fill: "#fff", stroke: col, "stroke-width": 3 }, g);
      sv("text", { x: at[0], y: at[1] + 7, "font-size": 22, "font-weight": 700, fill: col, "text-anchor": "middle" }, g).textContent = text;
      return g;
    }
    const L = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);
    async function drawOp(o, my) {
      if (o.hidden) return;
      const ok = () => my === token;
      switch (o.t) {
        case "grid": return; // la retícula se enciende solo en el paso que la pide
        case "vtx": {
          const tags = [["C", "100 % CaO", [70, 70]], ["A", "100 % Al₂O₃", [-90, 70]], ["S", "100 % SiO₂", [170, 30]]];
          for (const [k, tx, off] of tags) {
            const p = V[k];
            const c = sv("circle", { cx: p[0], cy: p[1], r: 22, fill: "none", stroke: "#e6427a", "stroke-width": 5 }, gLay);
            const g = chip([p[0] + off[0], p[1] - off[1] + 40], tx, "#e6427a");
            await Promise.all([fadeIn(c, ok() && my), fadeIn(g, ok() && my)]);
          }
          return;
        }
        case "iso": {
          const v = o.v, k = o.k;
          const a = k === 0 ? [v, 100 - v, 0] : k === 1 ? [100 - v, v, 0] : [100 - v, 0, v];
          const b = k === 0 ? [v, 0, 100 - v] : k === 1 ? [0, v, 100 - v] : [0, 100 - v, v];
          const A = toPx(a), B = toPx(b);
          const e = sv("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: o.col, "stroke-width": 4, "stroke-linecap": "round", "stroke-dasharray": o.dash ? "14 10" : null, "data-dash": o.dash ? "14 10" : null }, gLay);
          await animLine(e, L(A, B), ok() && my);
          const end = k === 1 ? B : k === 2 ? B : B; // extremo de lectura
          const dir = [end[0] - CENT[0], end[1] - CENT[1]], n = Math.hypot(dir[0], dir[1]);
          const lp = [end[0] + dir[0] / n * 70, end[1] + dir[1] / n * 40 + 8];
          const g = label(lp, o.lab, { col: o.col, size: 25 });
          await fadeIn(g, ok() && my, 250);
          return;
        }
        case "ln": {
          const A = toPx(o.a), B = toPx(o.b);
          const e = sv("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: o.col, "stroke-width": o.w || 4, "stroke-linecap": "round", "stroke-dasharray": o.dash ? "14 10" : null, "data-dash": o.dash ? "14 10" : null }, gLay);
          await animLine(e, L(A, B), ok() && my); return;
        }
        case "pt": {
          const A = toPx(o.at);
          const g = sv("g", {}, gLab);
          sv("circle", { cx: A[0], cy: A[1], r: o.r || 12, fill: o.col, stroke: "#fff", "stroke-width": 4 }, g);
          const t = sv("text", { x: A[0] + 22, y: A[1] - 16, "font-size": 34, "font-weight": 800, fill: o.col, class: "halo" }, g); t.innerHTML = svgLabel(o.lab);
          if (o.sub) { const s = sv("text", { x: A[0] + 22, y: A[1] + 16, "font-size": 21, "font-weight": 600, fill: o.col, class: "halo" }, g); s.innerHTML = svgLabel(o.sub); }
          await fadeIn(g, ok() && my, 300); return;
        }
        case "joins": {
          const seen = {}, els = [];
          SYS.tris.forEach((t) => { for (let i = 0; i < 3; i++) { const a = t.v[i], b = t.v[(i + 1) % 3]; const kk = [a, b].sort().join("|"); if (seen[kk]) continue; seen[kk] = 1; const onEdge = (cp(a)[0] === 0 && cp(b)[0] === 0) || (cp(a)[1] === 0 && cp(b)[1] === 0) || (cp(a)[2] === 0 && cp(b)[2] === 0); if (onEdge) continue; const A = toPx(cp(a)), B = toPx(cp(b)); const e = sv("line", { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: K.join, "stroke-width": 3, opacity: .85, "stroke-linecap": "round" }, gLay); els.push([e, L(A, B)]); } });
          await Promise.all(els.map(([e, l]) => animLine(e, l, ok() && my))); return;
        }
        case "cmps": {
          const g = sv("g", {}, gLab);
          Object.keys(SYS.cmp).forEach((id) => { if (["C", "A", "S"].includes(id)) return; const c = SYS.cmp[id], A = toPx(c.c);
            sv("circle", { cx: A[0], cy: A[1], r: 9, fill: "#fff", stroke: K.join, "stroke-width": 4 }, g);
            const t = sv("text", { x: A[0] + c.dx, y: A[1] + c.dy, "font-size": 24, "font-weight": 800, fill: K.join, "text-anchor": "middle", class: "halo" }, g); t.innerHTML = svgLabel(c.ab); });
          await fadeIn(g, ok() && my); return;
        }
        case "tri": {
          const t = triById(o.id); const ps = t.v.map((id) => toPx(cp(id)));
          if (o.hl) { const e = sv("polygon", { points: ps.map((p) => p.join(",")).join(" "), fill: "none", stroke: o.col, "stroke-width": 9, "stroke-linejoin": "round", "stroke-dasharray": "18 10", "data-dash": "18 10" }, gLay); const per = L(ps[0], ps[1]) + L(ps[1], ps[2]) + L(ps[2], ps[0]); await animLine(e, per, ok() && my); return; }
          const e = sv("polygon", { points: ps.map((p) => p.join(",")).join(" "), fill: o.col, "fill-opacity": o.fop || 0.22, stroke: o.col, "stroke-width": 3, "stroke-linejoin": "round" }, gLay);
          const c = [(ps[0][0] + ps[1][0] + ps[2][0]) / 3, (ps[0][1] + ps[1][1] + ps[2][1]) / 3];
          const g = chip(c, t.T + " °C", o.col === "#ffb81f" ? "#b77900" : o.col);
          await Promise.all([fadeIn(e, ok() && my, 450), fadeIn(g, ok() && my, 450)]);
          return;
        }
        case "xpt": {
          const X = interLL(toPx(o.a), toPx(o.b), toPx(cp(o.j[0])), toPx(cp(o.j[1])));
          const J1 = toPx(cp(o.j[0])), J2 = toPx(cp(o.j[1]));
          const e = sv("line", { x1: J1[0], y1: J1[1], x2: J2[0], y2: J2[1], stroke: o.col, "stroke-width": 6, opacity: .9, "stroke-linecap": "round" }, gLay);
          await animLine(e, L(J1, J2), ok() && my);
          const g = sv("g", {}, gLab);
          sv("circle", { cx: X[0], cy: X[1], r: 11, fill: o.col, stroke: "#fff", "stroke-width": 4 }, g);
          sv("text", { x: X[0] - 22, y: X[1] - 18, "font-size": 32, "font-weight": 800, fill: o.col, "text-anchor": "end", class: "halo" }, g).textContent = o.lab;
          if (o.sub) sv("text", { x: X[0] - 22, y: X[1] + 14, "font-size": 21, "font-weight": 700, fill: o.col, "text-anchor": "end", class: "halo" }, g).textContent = o.sub;
          await fadeIn(g, ok() && my, 300); return;
        }
        case "lever": {
          const F = toPx(cp(o.from)), M = toPx(o.thru), T1 = toPx(cp(o.to[0])), T2 = toPx(cp(o.to[1]));
          const Q = interLL(F, M, T1, T2);
          const e1 = sv("line", { x1: F[0], y1: F[1], x2: Q[0], y2: Q[1], stroke: o.col, "stroke-width": 4, "stroke-dasharray": "12 9", "data-dash": "12 9" }, gLay);
          await animLine(e1, L(F, Q), ok() && my);
          const e2 = sv("line", { x1: M[0], y1: M[1], x2: Q[0], y2: Q[1], stroke: "#e6427a", "stroke-width": 9, "stroke-linecap": "round", opacity: .85 }, gLay);
          await animLine(e2, L(M, Q), ok() && my);
          const g = sv("g", {}, gLab);
          sv("circle", { cx: Q[0], cy: Q[1], r: 10, fill: o.col, stroke: "#fff", "stroke-width": 3 }, g);
          sv("text", { x: Q[0] + 18, y: Q[1] + 34, "font-size": 30, "font-weight": 800, fill: o.col, class: "halo" }, g).textContent = "Q";
          const mid = [(M[0] + Q[0]) / 2, (M[1] + Q[1]) / 2];
          sv("text", { x: mid[0] + 16, y: mid[1] - 12, "font-size": 22, "font-weight": 800, fill: "#e6427a", class: "halo" }, g).textContent = "MQ";
          await fadeIn(g, ok() && my, 300); return;
        }
      }
    }

    /* ---------- render de un paso ---------- */
    const qid = () => key + "-" + ST.cur[key];
    S.render = async function (animate) {
      const my = ++token; const i = ST.cur[key], st = P.steps[i];
      gLay.innerHTML = ""; gLab.innerHTML = ""; gUser.innerHTML = ""; setGrid(false);
      // pasos anteriores, sin animación
      for (let j = 0; j < i; j++) { const s = P.steps[j]; for (const o of (s.draw || [])) await drawOp(o, -1); for (const o of (s.after || [])) await drawOp(o, -1); }
      $(".sc", stage).textContent = `Paso ${i + 1} de ${P.steps.length}`;
      const sk = $(".sk", stage); sk.textContent = st.kind; sk.className = "tag sk " + ({ "Pregunta": "e", "Ubicar punto": "e", "Cálculo": "p", "Explicación": "d", "Conclusión": "b" }[st.kind] || "b");
      $(".st", stage).innerHTML = st.title.replace(/([A-Za-z])([₀-₉]+)/g, "$1$2");
      body.innerHTML = st.body || "";
      $(".progress div", stage).style.width = (100 * (i + 1) / P.steps.length) + "%";
      buildIndex();
      buildQ(st);
      if ((st.draw || []).some((o) => o.t === "grid")) setGrid(true);
      btnPrev.disabled = i === 0;
      updateNext();
      // trazos del paso actual
      for (const o of (st.draw || [])) { if (my !== token) return; await drawOp(o, animate === false ? -1 : my); }
      if (st.q && ST.done[qid()]) for (const o of (st.after || [])) { if (my !== token) return; await drawOp(o, animate === false ? -1 : my); }
      if (!st.q) for (const o of (st.after || [])) { if (my !== token) return; await drawOp(o, animate === false ? -1 : my); }
    };
    function updateNext() {
      const i = ST.cur[key], st = P.steps[i];
      const last = i === P.steps.length - 1;
      btnNext.textContent = last ? (key === "p2" ? "Ir al punto 3 →" : "Ver resultados →") : "Siguiente";
      btnNext.disabled = !!(st.q && !ST.done[qid()]);
      btnNext.title = btnNext.disabled ? "Responde o pulsa «Ver solución» para continuar" : "";
    }
    function go(d) {
      const n = ST.cur[key] + d;
      if (n < 0) return;
      if (n >= P.steps.length) { show(key === "p2" ? "p3" : "res"); return; }
      ST.cur[key] = n; save(); S.render(true);
      if (window.innerWidth < 920) stage.querySelector(".panel").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    btnPrev.onclick = () => go(-1); btnNext.onclick = () => { if (!btnNext.disabled) go(1); };
    S.key = (ev) => { if (ev.key === "ArrowRight" && !btnNext.disabled) go(1); if (ev.key === "ArrowLeft" && !btnPrev.disabled) go(-1); };
    function buildIndex() {
      steplist.innerHTML = "";
      P.steps.forEach((s, j) => { const li = h("li"); const b = h("button", null, s.title + (s.q ? (ST.done[key + "-" + j] ? (ST.first[key + "-" + j] ? " ✓" : " ·") : "") : ""));
        b.type = "button"; if (j === ST.cur[key]) b.setAttribute("aria-current", "step"); b.onclick = () => { ST.cur[key] = j; save(); S.render(true); }; li.appendChild(b); steplist.appendChild(li); });
    }

    /* ---------- preguntas ---------- */
    function buildQ(st) {
      qbox.innerHTML = "";
      if (!st.q) return;
      const q = st.q, id = qid(), done = !!ST.done[id];
      const box = h("div", "qcard");
      box.appendChild(h("p", "qprompt", "<span class='qk'>Tu turno</span>" + q.prompt));
      const fb = h("div", "pfb"); fb.setAttribute("aria-live", "polite");
      const hints = h("ol", "phints");
      const ctrls = h("div", "qctrl");
      if (q.type === "mcq") {
        const ch = h("div", "choices");
        q.opts.forEach((o, j) => { const b = h("button", "choice", `<span class="lt">${"ABCDEFG"[j]}</span><span class="tx">${o.t}</span>`); b.type = "button";
          if (done && o.ok) b.classList.add("ok");
          b.onclick = () => { if (ST.done[id]) return; if (o.ok) { b.classList.add("ok"); solved(true); } else { b.classList.add("bad"); recordFirst(id, false); fb.className = "pfb bad"; fb.innerHTML = "✗ " + (o.fb || "No es esa. Inténtalo de nuevo."); } };
          ch.appendChild(b); });
        box.appendChild(ch);
      } else if (q.type === "multi") {
        const ch = h("div", "choices"); const sel = new Set();
        q.opts.forEach((o, j) => { const b = h("button", "choice", `<span class="lt">${"ABCDEFGH"[j]}</span><span class="tx">${o.t}</span>`); b.type = "button";
          if (done && o.ok) b.classList.add("ok");
          b.onclick = () => { if (ST.done[id]) return; b.classList.remove("bad"); if (sel.has(j)) { sel.delete(j); b.classList.remove("sel"); } else { sel.add(j); b.classList.add("sel"); } };
          ch.appendChild(b); });
        box.appendChild(ch);
        const chk = h("button", "navbtn next sm", "Revisar selección"); chk.type = "button";
        chk.onclick = () => { if (ST.done[id]) return; const good = q.opts.map((o, j) => !!o.ok === sel.has(j));
          if (good.every(Boolean)) { ch.querySelectorAll(".choice").forEach((b, j) => b.classList.toggle("ok", !!q.opts[j].ok)); solved(true); return; }
          recordFirst(id, false);
          const miss = q.opts.filter((o, j) => o.ok && !sel.has(j)).length, extra = q.opts.filter((o, j) => !o.ok && sel.has(j)).length;
          ch.querySelectorAll(".choice").forEach((b, j) => { if (sel.has(j) && !q.opts[j].ok) b.classList.add("bad"); });
          fb.className = "pfb bad"; fb.innerHTML = "✗ " + (miss ? `Te falta${miss > 1 ? "n" : ""} ${miss} triángulo${miss > 1 ? "s" : ""}. ` : "") + (extra ? `Marcaste ${extra} que la línea no atraviesa (en rojo).` : ""); };
        if (!done) ctrls.appendChild(chk);
      } else if (q.type === "num") {
        const w = h("label", "numin", `<input inputmode="decimal" autocomplete="off" placeholder="valor"> <span>${q.unit || ""}</span>`);
        const inp = $("input", w);
        const chk = h("button", "navbtn next sm", "Comprobar"); chk.type = "button";
        const doCheck = () => { if (ST.done[id]) return; const x = parseFloat(inp.value.replace(",", ".")); if (isNaN(x)) { fb.className = "pfb"; fb.textContent = "Escribe un número (puedes usar coma decimal)."; return; }
          if (Math.abs(x - q.ans) <= q.tol) { inp.classList.remove("bad"); solved(true); }
          else { recordFirst(id, false); inp.classList.add("bad"); fb.className = "pfb bad"; fb.innerHTML = "✗ " + (x > q.ans ? "Te pasaste" : "Te quedaste corto") + ". Revisa el cálculo o pide una pista."; } };
        chk.onclick = doCheck; inp.addEventListener("keydown", (e) => { if (e.key === "Enter") doCheck(); });
        if (done) { inp.value = fmt(q.ans, 3); inp.disabled = true; }
        box.appendChild(w); if (!done) ctrls.appendChild(chk);
      } else if (q.type === "click") {
        box.appendChild(h("p", "pnote", "Haz clic directamente sobre el diagrama. Tolerancia: ±" + q.tol + " % en cada componente."));
        S.clickFb = fb;
      }
      const tools = h("div", "navrow tight");
      if (q.hint && !done) { const hb = h("button", "navbtn ghost sm", "Dame una pista"); hb.type = "button"; hb.onclick = () => { hints.innerHTML = "<li>" + q.hint + "</li>"; hb.disabled = true; }; tools.appendChild(hb); }
      if (!done) { const rv = h("button", "navbtn ghost sm", "Ver solución"); rv.type = "button"; rv.onclick = () => { recordFirst(id, false); solved(false); }; tools.appendChild(rv); }
      ctrls.appendChild(tools);
      box.append(ctrls, hints, fb);
      const ex = h("div", "qexp"); ex.hidden = !done; ex.innerHTML = "<b class='h'>Explicación</b>" + q.explain; box.appendChild(ex);
      if (done) { fb.className = "pfb " + (ST.first[id] ? "ok" : ""); fb.innerHTML = ST.first[id] ? "✓ Acertaste al primer intento." : "Resuelto (no cuenta como acierto al primer intento)."; }
      qbox.appendChild(box);

      async function solved(ok) {
        if (ok) recordFirst(id, true);
        ST.done[id] = true; save();
        fb.className = "pfb " + (ok ? "ok" : "");
        fb.innerHTML = ok ? (ST.first[id] ? "✓ ¡Correcto!" : "✓ Correcto (no al primer intento).") : "Esta es la solución:";
        if (!ok && q.type === "mcq") box.querySelectorAll(".choice").forEach((b, j) => { if (q.opts[j].ok) b.classList.add("ok"); });
        if (!ok && q.type === "multi") box.querySelectorAll(".choice").forEach((b, j) => { b.classList.remove("bad", "sel"); if (q.opts[j].ok) b.classList.add("ok"); });
        if (!ok && q.type === "num") { const inp = $("input", box); inp.value = fmt(q.ans, 3); inp.classList.remove("bad"); }
        ctrls.innerHTML = ""; hints.innerHTML = "";
        ex.hidden = false;
        updateNext(); buildIndex();
        const my = token;
        for (const o of (st.after || [])) { if (my !== token) return; await drawOp(o, my); }
      }
      S.solved = solved;
    }
    function clickAnswer(p) {
      const st = P.steps[ST.cur[key]], q = st.q, id = qid();
      const c = fromPx(p[0], p[1]);
      if (!inside(c)) return;
      gUser.innerHTML = "";
      const g = sv("g", {}, gUser);
      sv("path", { d: `M${p[0] - 14},${p[1] - 14} L${p[0] + 14},${p[1] + 14} M${p[0] + 14},${p[1] - 14} L${p[0] - 14},${p[1] + 14}`, stroke: "#2b2140", "stroke-width": 5, "stroke-linecap": "round" }, g);
      const d = c.map((x, k) => x - q.target[k]);
      const dist = Math.max(...d.map(Math.abs));
      const fb = S.clickFb;
      const yours = `Tu punto: CaO ${fmt(c[0])} %, Al<sub>2</sub>O<sub>3</sub> ${fmt(c[1])} %, SiO<sub>2</sub> ${fmt(c[2])} %.`;
      if (dist <= q.tol) { fb.className = "pfb ok"; S.solved(true).then(() => {}); fb.innerHTML = "✓ ¡Bien ubicado! " + yours; return; }
      recordFirst(id, false);
      const names = ["CaO", "Al<sub>2</sub>O<sub>3</sub>", "SiO<sub>2</sub>"];
      const k = d.map(Math.abs).indexOf(dist);
      fb.className = "pfb bad";
      fb.innerHTML = `✗ ${yours} El componente que más se aleja es ${names[k]}: tienes ${d[k] > 0 ? "de más" : "de menos"} ${fmt(Math.abs(d[k]))} puntos. Recuerda: las líneas de ${names[k]} constante son paralelas al lado opuesto a su vértice.`;
    }
    return S;
  }

  /* ================= REPASO ================= */
  function buildRep() {
    VIEWS.rep.innerHTML = REPASO;
    const tb = $("#tritable");
    SYS.tris.slice().sort((a, b) => a.T - b.T).forEach((t) => { const tr = h("tr", null, `<td>${t.n}</td><td class="num">${t.T} °C</td>`); tb.appendChild(tr); });
  }

  /* ================= RESULTADOS ================= */
  function renderRes() {
    const r = parts(), n = nota(r), v = VIEWS.res;
    const row = (k, t) => `<li><span>${t} <small>(${Math.round(W[k] * 100)} %)</small></span><span class="bar"><i style="width:${100 * r[k].ok / r[k].n}%"></i></span><b>${r[k].ok}/${r[k].n}</b></li>`;
    const pend = QS.length - (r.p1.ans + r.p2.ans + r.p3.ans);
    v.innerHTML = `<div class="panel res"><div class="nota"><span class="big">${fmt(n, 2)}</span><span>Nota estimada sobre 5,0 con los aciertos al primer intento, ponderando punto 1 (25 %), punto 2 (35 %) y punto 3 (40 %).${pend ? ` Te faltan <b>${pend}</b> preguntas por responder.` : " Respondiste todo."}</span></div>
      <p class="rh">Por punto</p><ul class="rcats">${row("p1", "Teoría")}${row("p2", "Diagrama ternario")}${row("p3", "Caso de corrosión")}</ul>
      <p class="rh">Qué repasar</p><div id="tips"></div>
      <div class="navrow"><button class="navbtn ghost" type="button" id="reset">Reiniciar simulacro</button></div></div>`;
    const tips = [];
    if (r.p1.ok < r.p1.n) tips.push("Repasa en la pestaña <b>Repaso</b> la clasificación, las normas y los números de las diapositivas que fallaste en el punto 1 (las explicaciones quedan abiertas debajo de cada frase).");
    if (r.p2.ok < r.p2.n) tips.push("Practica ubicar puntos con la <b>retícula del 10 %</b> y recuerda que las líneas de unión unen compuestos, no puntos invariantes.");
    if (r.p3.ok < r.p3.n) tips.push("Revisa el <b>grado de silicato</b>: moles de O (SiO<sub>2</sub> aporta 2), sin contar la alúmina; G.S. &lt; 1 es básica.");
    if (!tips.length) tips.push("¡Todo al primer intento! Vuelve a hacerlo sin pistas cambiando mentalmente las composiciones.");
    $("#tips", v).innerHTML = "<ul>" + tips.map((t) => "<li>" + t + "</li>").join("") + "</ul>";
    $("#reset", v).onclick = () => { if (!confirm("¿Borrar todas tus respuestas y empezar de nuevo?")) return; try { localStorage.removeItem("simref-v1"); } catch (e) {} location.reload(); };
  }

  /* ================= arranque ================= */
  buildP1();
  makeStage("p2", P2);
  makeStage("p3", P3);
  buildRep();
  updateScore();
  document.addEventListener("keydown", (ev) => { if (ev.target.closest("input,select,textarea")) return; const s = STAGES[ST.tab]; if (s && s.key) s.key(ev); });
  show(TABS.some(([k]) => k === ST.tab) ? ST.tab : "p1");
})();
