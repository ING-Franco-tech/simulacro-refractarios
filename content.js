/* Contenido del simulacro: sistema CaO–Al2O3–SiO2, preguntas de teoría y pasos de los puntos 2 y 3.
   Las composiciones van como [CaO, Al2O3, SiO2] en % en masa. */

const SYS = {
  img: "img/cas.png", w: 1455, h: 1367,
  // vértices calibrados sobre la imagen (px)
  V: { C: [59.5, 1189.3], A: [1359.8, 1186.7], S: [710.1, 60.0] },
  // zonas con texto impreso en la imagen (para no tapar con rótulos nuevos)
  cmp: {
    C:     { c: [100, 0, 0],          ab: "Cal",   name: "Cal (CaO)",                        dx: 30, dy: -18 },
    C3S:   { c: [73.7, 0, 26.3],      ab: "C3S",   name: "Silicato tricálcico (3CaO·SiO<sub>2</sub>)", dx: 34, dy: 4 },
    C2S:   { c: [65.1, 0, 34.9],      ab: "C2S",   name: "Silicato dicálcico (2CaO·SiO<sub>2</sub>)", dx: 34, dy: 4 },
    C3S2:  { c: [58.3, 0, 41.7],      ab: "Rk",    name: "Rankinita (3CaO·2SiO<sub>2</sub>)",  dx: 30, dy: 4 },
    CS:    { c: [48.28, 0, 51.72],    ab: "PsW",   name: "Pseudowollastonita (CaO·SiO<sub>2</sub>)", dx: 36, dy: -6 },
    S:     { c: [0, 0, 100],          ab: "S",     name: "Sílice (cristobalita / tridimita)", dx: -30, dy: 6 },
    A3S2:  { c: [0, 71.8, 28.2],      ab: "Mu",    name: "Mullita (3Al<sub>2</sub>O<sub>3</sub>·2SiO<sub>2</sub>)", dx: -34, dy: -10 },
    A:     { c: [0, 100, 0],          ab: "Cor",   name: "Corindón (Al<sub>2</sub>O<sub>3</sub>)", dx: -30, dy: -20 },
    CA6:   { c: [8.4, 91.6, 0],       ab: "CA6",   name: "CaO·6Al<sub>2</sub>O<sub>3</sub> (CaAl<sub>12</sub>O<sub>19</sub>)", dx: 0, dy: -24 },
    CA2:   { c: [21.6, 78.4, 0],      ab: "CA2",   name: "CaO·2Al<sub>2</sub>O<sub>3</sub> (CaAl<sub>4</sub>O<sub>7</sub>)", dx: 0, dy: -24 },
    CA:    { c: [35.4, 64.6, 0],      ab: "CA",    name: "CaO·Al<sub>2</sub>O<sub>3</sub>", dx: 0, dy: -24 },
    C12A7: { c: [48.5, 51.5, 0],      ab: "C12A7", name: "12CaO·7Al<sub>2</sub>O<sub>3</sub>", dx: 0, dy: -24 },
    C3A:   { c: [62.3, 37.7, 0],      ab: "C3A",   name: "3CaO·Al<sub>2</sub>O<sub>3</sub>", dx: 0, dy: -24 },
    CAS2:  { c: [20.15, 36.65, 43.2], ab: "An",    name: "Anortita (CaO·Al<sub>2</sub>O<sub>3</sub>·2SiO<sub>2</sub>)", dx: 0, dy: -24 },
    C2AS:  { c: [40.9, 37.2, 21.9],   ab: "Geh",   name: "Gehlenita (2CaO·Al<sub>2</sub>O<sub>3</sub>·SiO<sub>2</sub>)", dx: 0, dy: 30 }
  },
  // triángulos de composición (compatibilidad) y temperatura del punto invariante asociado
  tris: [
    { id: "t1",  v: ["S", "CS", "CAS2"],     T: 1170, n: "Sílice – Pseudowollastonita – Anortita" },
    { id: "t2",  v: ["CS", "CAS2", "C2AS"],  T: 1265, n: "Pseudowollastonita – Anortita – Gehlenita" },
    { id: "t3",  v: ["CS", "C3S2", "C2AS"],  T: 1310, n: "Pseudowollastonita – Rankinita – Gehlenita" },
    { id: "t4",  v: ["C3S2", "C2S", "C2AS"], T: 1315, n: "Rankinita – C<sub>2</sub>S – Gehlenita" },
    { id: "t5",  v: ["S", "CAS2", "A3S2"],   T: 1345, n: "Sílice – Anortita – Mullita" },
    { id: "t6",  v: ["CAS2", "A3S2", "A"],   T: 1512, n: "Anortita – Mullita – Corindón" },
    { id: "t7",  v: ["CAS2", "A", "CA6"],    T: 1495, n: "Anortita – Corindón – CA<sub>6</sub>" },
    { id: "t8",  v: ["CAS2", "CA6", "C2AS"], T: 1380, n: "Anortita – CA<sub>6</sub> – Gehlenita" },
    { id: "t9",  v: ["C2AS", "CA6", "CA2"],  T: 1475, n: "Gehlenita – CA<sub>6</sub> – CA<sub>2</sub>" },
    { id: "t10", v: ["C2AS", "CA2", "CA"],   T: 1500, n: "Gehlenita – CA<sub>2</sub> – CA" },
    { id: "t11", v: ["C2AS", "CA", "C2S"],   T: 1380, n: "Gehlenita – CA – C<sub>2</sub>S" },
    { id: "t12", v: ["C2S", "CA", "C12A7"],  T: 1335, n: "C<sub>2</sub>S – CA – C<sub>12</sub>A<sub>7</sub>" },
    { id: "t13", v: ["C2S", "C12A7", "C3A"], T: 1335, n: "C<sub>2</sub>S – C<sub>12</sub>A<sub>7</sub> – C<sub>3</sub>A" },
    { id: "t14", v: ["C2S", "C3A", "C3S"],   T: 1455, n: "C<sub>2</sub>S – C<sub>3</sub>A – C<sub>3</sub>S" },
    { id: "t15", v: ["C3S", "C3A", "C"],     T: 1470, n: "C<sub>3</sub>S – C<sub>3</sub>A – Cal" }
  ]
};

/* Colores del trazo */
const K = { ref: "#e6427a", esc: "#0b8f84", line: "#6b4fd8", aux: "#b77900", ink: "#2b2140", join: "#6b4fd8",
  t: ["#ffb81f", "#19b8a6", "#6b4fd8", "#e6427a", "#f0562e", "#3b82f6"] };

/* ============================== PUNTO 1 ============================== */
const P1 = {
  title: "Punto 1 · Teoría para completar",
  intro: "Así suele venir la primera parte: frases de las diapositivas con espacios en blanco. Elige o escribe la respuesta de cada espacio y pulsa <b>Revisar</b>. Cada frase vale un punto si todos sus espacios quedan bien al primer intento; después de revisar verás la explicación.",
  items: [
    { q: "En la industria, un refractario es un cerámico usado como revestimiento de hornos cuya temperatura de reblandecimiento es mayor o igual a {0} °C.",
      b: [{ num: 1500, tol: 0 }],
      exp: "Definición industrial de las diapositivas: T<sub>reblandecimiento</sub> ≥ 1500 °C («refractariedad»). La temperatura de reblandecimiento es aquella a la que el cerámico empieza a deformarse plásticamente." },
    { q: "Según su porosidad, un refractario con porosidad ≤ 45 % (vol.) es {0}, y uno con porosidad > 45 % es {1}.",
      b: [{ sel: ["denso", "aislante", "monolítico", "conformado"], ans: 0 }, { sel: ["denso", "aislante", "monolítico", "conformado"], ans: 1 }],
      exp: "Densos: porosidad ≤ 45 %; resisten altas temperaturas, ataque químico, abrasión y esfuerzos; van en la cara caliente, en contacto con escoria, metal y vapores. Aislantes: porosidad > 45 %; son barrera térmica (minimizan pérdidas de calor), no resisten el ataque químico ni la abrasión y tienen malas propiedades mecánicas." },
    { q: "Los refractarios aislantes {0} resistentes al ataque químico y se colocan {1} de los refractarios densos.",
      b: [{ sel: ["sí son", "no son"], ans: 1 }, { sel: ["como primera capa, antes", "en la cara caliente, delante", "mezclados dentro"], ans: 0 }],
      exp: "El aislante va detrás (del lado frío), como primera capa sobre la carcasa; el denso protege la cara que ve la escoria. Si el aislante viera la escoria, su alta porosidad dejaría que la escoria lo penetrara y lo destruyera." },
    { q: "Por su comportamiento ácido-básico: SiO<sub>2</sub>, B<sub>2</sub>O<sub>3</sub> y P<sub>2</sub>O<sub>5</sub> son óxidos {0}; CaO, MgO y FeO son {1}; Al<sub>2</sub>O<sub>3</sub> y TiO<sub>2</sub> son {2}; el C y la cromita (FeO·Cr<sub>2</sub>O<sub>3</sub>) son {3}.",
      b: [{ sel: ["ácidos", "básicos", "anfóteros", "neutros"], ans: 0 }, { sel: ["ácidos", "básicos", "anfóteros", "neutros"], ans: 1 }, { sel: ["ácidos", "básicos", "anfóteros", "neutros"], ans: 2 }, { sel: ["ácidos", "básicos", "anfóteros", "neutros"], ans: 3 }],
      exp: "Ácidos: enlaces elemento-oxígeno fuertes. Básicos: enlaces metal-oxígeno débiles. Anfóteros: pueden actuar como ácido o como base. Inertes o neutros: C, cromita." },
    { q: "Cuando la alúmina está con un óxido ácido (Al<sub>2</sub>O<sub>3</sub> + SiO<sub>2</sub> → Al<sub>2</sub>SiO<sub>5</sub>) actúa como {0}; cuando está con un óxido básico (Al<sub>2</sub>O<sub>3</sub> + CaO → CaAl<sub>2</sub>O<sub>4</sub>) actúa como {1}.",
      b: [{ sel: ["ácido", "base", "neutro"], ans: 1 }, { sel: ["ácido", "base", "neutro"], ans: 0 }],
      exp: "Es la pregunta «bobita» que comentaron: el anfótero hace lo contrario de su compañero. Regla general de la lista de óxidos: cada óxido actúa como <b>ácido</b> frente a los que están <b>debajo</b> de él (más básicos) y como <b>base</b> frente a los que están <b>encima</b> (más ácidos)." },
    { q: "En la lista B<sub>2</sub>O<sub>3</sub> – SiO<sub>2</sub> – P<sub>2</sub>O<sub>5</sub> – Al<sub>2</sub>O<sub>3</sub> – TiO<sub>2</sub> – BeO – FeO – MgO – MnO – Li<sub>2</sub>O – CaO – Na<sub>2</sub>O, el carácter básico {0} hacia abajo. Frente al CaO, el MgO actúa como {1}.",
      b: [{ sel: ["aumenta", "disminuye"], ans: 0 }, { sel: ["ácido", "base"], ans: 0 }],
      exp: "El carácter básico aumenta hacia abajo de la lista. El MgO está por encima del CaO, así que frente al CaO se comporta como ácido (y frente al SiO<sub>2</sub>, como base)." },
    { q: "La refractariedad se determina por el método del {0} (ASTM C24, NTC 706), comparando la deformación de la muestra con la de conos estándar. La velocidad de calentamiento del ensayo es de unos {1} °C/h.",
      b: [{ sel: ["cono pirométrico equivalente", "módulo de ruptura", "microscopio de calentamiento", "dilatómetro"], ans: 0 }, { num: 150, tol: 0 }],
      exp: "Cono pirométrico equivalente: la muestra (100 % pasante malla 70) se moldea como cono y se compara con conos estándar al calentar a ~150 °C/h (2,5 °C/min) en atmósfera oxidante. No se toma la temperatura del horno directamente porque el resultado depende de la velocidad de calentamiento, el tamaño de partícula y la atmósfera." },
    { q: "En el ensayo de refractariedad bajo carga (ISO 1893), T<sub>a</sub> es la temperatura a la que la probeta alcanza {0} % de contracción; la carga aplicada es de {1} N/mm<sup>2</sup>.",
      b: [{ sel: ["0,5", "0,6", "4,1", "1,0"], ans: 1 }, { sel: ["0,2", "2", "0,02", "20"], ans: 0 }],
      exp: "T<sub>0,5</sub>: 0,5 % de contracción; T<sub>a</sub>: 0,6 % (la refractariedad bajo carga); T<sub>b</sub>: ruptura. Probeta de 50 mm × 50 mm, carga 0,2 N/mm<sup>2</sup>, calentamiento a 5 °C/min." },
    { q: "La resistencia al choque térmico (desconchado o <i>spalling</i>) aumenta con una {0} conductividad térmica, un {1} coeficiente de expansión y una mayor resistencia a la propagación de grietas (límites de grano y poros).",
      b: [{ sel: ["alta", "baja"], ans: 0 }, { sel: ["alto", "bajo"], ans: 1 }],
      exp: "Ecuación de Hasselman: ΔT<sub>f</sub> = σ<sub>mr</sub>(1 − ν)/(E·α). Más resistencia a la flexión, menor módulo E y menor α dan más ΔT soportable; la alta conductividad reduce los gradientes térmicos. Por eso el SiC (230 °C) aguanta más que la alúmina (96 °C)." },
    { q: "Los refractarios de sílice tienen SiO<sub>2</sub> ≥ {0} %; para facilitar su sinterización se agrega 1–3 % de {1}, que forma un líquido muy viscoso.",
      b: [{ num: 93, tol: 0 }, { sel: ["CaO (lima)", "MgO", "Na<sub>2</sub>O", "Al<sub>2</sub>O<sub>3</sub>"], ans: 0 }],
      exp: "Sílice ≥ 93 % SiO<sub>2</sub>. Con 3 % CaO apenas se forma 8,5 % de líquido a 1470 °C y 11 % a 1705 °C (diagrama CaO–SiO<sub>2</sub>), y ese líquido es muy viscoso, así que casi no baja el punto de reblandecimiento." },
    { q: "La transformación cuarzo → tridimita ocurre a {0} °C con una expansión de ≈16 % en volumen; por eso la cocción de los ladrillos de sílice es muy lenta (≤ 10 °C/h).",
      b: [{ sel: ["573", "870", "1470", "1723"], ans: 1 }],
      exp: "573 °C: cuarzo β → α (desplazativa, rápida y reversible). 870 °C: cuarzo → tridimita (reconstructiva, lenta, ΔV ≈ 16,5 %). 1470 °C: tridimita → cristobalita. 1723 °C: fusión de la sílice." },
    { q: "Clasificación de los refractarios de SiO<sub>2</sub>–Al<sub>2</sub>O<sub>3</sub> por su contenido de alúmina: sílice < 7 %; arcilla refractaria 7–50 %; sillimanita 50–65 %; mullita {0} %; corindón {1} %.",
      b: [{ sel: ["38–50", "65–75", "75–98", "50–65"], ans: 1 }, { sel: ["38–50", "65–75", "75–98", "50–65"], ans: 2 }],
      exp: "Arcilla refractaria: silíceos 7–22 %, ladrillos refractarios 22–38 %, aluminosos 38–50 %. Alta alúmina: sillimanita 50–65 %, mullita 65–75 %, corindón 75–98 %. Cuanto más se aleja del eutéctico cristobalita + mullita (1595 °C), más refractario es." },
    { q: "Los refractarios ácidos son compatibles con escorias {0}; los refractarios básicos son atacados por escorias {1}.",
      b: [{ sel: ["ácidas", "básicas"], ans: 0 }, { sel: ["ácidas", "básicas"], ans: 0 }],
      exp: "Requisito fundamental: el refractario debe tener el mismo carácter ácido-básico que la escoria para minimizar la reacción. Como siempre hay impurezas, lo que se evalúa es qué tan agresiva es la escoria." },
    { q: "Grado de silicato: G.S. = moles de O en óxidos ácidos / moles de O en óxidos básicos. Si G.S. > 1 la escoria es {0}; si G.S. < 1 es {1}. La alúmina generalmente {2} se tiene en cuenta.",
      b: [{ sel: ["ácida", "básica", "neutra"], ans: 0 }, { sel: ["ácida", "básica", "neutra"], ans: 1 }, { sel: ["sí", "no"], ans: 1 }],
      exp: "G.S. > 1 ácida, = 1 neutra, < 1 básica. La alúmina no se cuenta por su carácter anfótero. Se cuentan moles de oxígeno: el SiO<sub>2</sub> aporta 2 O por mol, el P<sub>2</sub>O<sub>5</sub> aporta 5, y CaO, MgO, FeO y MnO aportan 1 cada uno." },
    { q: "La resistencia de un refractario a la escoria depende de la reactividad química escoria-refractario, de la {0} del refractario y de la velocidad de {1} de la escoria (es preferible el flujo laminar).",
      b: [{ sel: ["porosidad", "densidad teórica", "conductividad"], ans: 0 }, { sel: ["flujo", "enfriamiento", "solidificación"], ans: 0 }],
      exp: "Por los poros abiertos la escoria penetra 40–75 mm (más de 150 mm si es muy fluida). Un flujo más rápido renueva la escoria en la superficie y acelera la reacción." },
    { q: "El MgO obtenido por calcinación es muy reactivo y reabsorbe CO<sub>2</sub> y H<sub>2</sub>O; por eso se quema «a muerte» a {0} °C. En un refractario de MgO conviene una relación molar CaO/SiO<sub>2</sub> ≥ {1}.",
      b: [{ sel: ["750–900", "1100", "1500–1700", "2800"], ans: 2 }, { num: 2, tol: 0 }],
      exp: "Quemado a muerte (1500–1700 °C): el MgO crece a 3–4 µm y deja de hidratarse. Con CaO/SiO<sub>2</sub> ≥ 2 las impurezas forman 2CaO·SiO<sub>2</sub> (funde a ~2130 °C) en vez de silicatos de bajo punto de fusión." },
    { q: "La cocción de la caolinita da {0} por encima de 1050 °C; la sílice amorfa liberada cristaliza a {1} a más de 1200 °C. Para disminuir la contracción se añade {2}.",
      b: [{ sel: ["mullita", "corindón", "espinela"], ans: 0 }, { sel: ["cristobalita", "cuarzo", "tridimita"], ans: 0 }, { sel: ["chamota", "cal", "grafito"], ans: 0 }],
      exp: "Caolinita → metacaolinita (550–600 °C) → espinela + sílice amorfa (925–1050 °C) → mullita (≥ 1050 °C); la sílice amorfa → cristobalita (≥ 1200 °C). La chamota es arcilla ya quemada, que no se contrae de nuevo." },
    { q: "Los refractarios de magnesia-cromo tienen menor expansión que los de MgO, pero en presencia de calcio pueden formar compuestos de cromo {0}, muy tóxicos.",
      b: [{ sel: ["hexavalente", "trivalente", "metálico"], ans: 0 }],
      exp: "Desventajas del MgO–Cr<sub>2</sub>O<sub>3</sub>: poca resistencia al óxido de hierro y formación de Cr(VI) (p. ej., CaCr<sub>2</sub>O<sub>7</sub>), cancerígeno bronco-pulmonar." }
  ]
};

/* ============================== PUNTO 2 ============================== */
const R2 = [0, 72, 28], E2 = [40, 15, 45], M2 = [12, 54.9, 33.1];
const P2 = {
  title: "Punto 2 · Refractario y escoria en el diagrama ternario",
  statement: "<b class='lead'>Enunciado</b>Un horno está revestido con ladrillos de <b>mullita (72 % Al<sub>2</sub>O<sub>3</sub> – 28 % SiO<sub>2</sub>)</b>. La escoria tiene como constituyentes principales <b>40 % CaO, 15 % Al<sub>2</sub>O<sub>3</sub> y 45 % SiO<sub>2</sub></b>. Con el diagrama CaO–Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>: a) ubique las composiciones; b) determine los triángulos de composición que atraviesa la línea refractario–escoria y la temperatura más baja a la que puede formarse líquido; c) calcule el % de CaO en la interfase con el que desaparece la mullita; d) para una zona de reacción con 70 % de refractario y 30 % de escoria, determine las fases en equilibrio por debajo del solidus y sus proporciones (regla de la palanca).",
  steps: [
    { title: "Cómo se lee el diagrama", kind: "Explicación",
      body: "<p>Cada vértice es un componente puro (100 %): <b>CaO</b> abajo a la izquierda, <b>Al<sub>2</sub>O<sub>3</sub></b> abajo a la derecha y <b>SiO<sub>2</sub></b> arriba. El lado opuesto a un vértice es el 0 % de ese componente.</p><p>Las líneas de igual porcentaje de un componente son <b>paralelas al lado opuesto a su vértice</b>, y el porcentaje crece hacia el vértice. Activa la <b>retícula del 10 %</b> (botón bajo el diagrama) para contar líneas.</p><div class='note'><b class='h'>Truco</b>Los tres porcentajes suman 100: basta con trazar dos líneas; la tercera sirve para comprobar.</div>",
      draw: [{ t: "vtx" }, { t: "iso", k: 0, v: 50, col: K.aux, lab: "50 % CaO", dash: 1 }],
      q: { type: "mcq", prompt: "¿A qué lado son paralelas las líneas de igual % de CaO?",
        opts: [{ t: "Al lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub> (el opuesto al vértice CaO)", ok: 1 },
               { t: "Al lado CaO–SiO<sub>2</sub>", fb: "Sobre ese lado el %CaO cambia de 0 a 100: no puede ser una línea de CaO constante." },
               { t: "Al lado CaO–Al<sub>2</sub>O<sub>3</sub>", fb: "Ese lado también va de 0 a 100 % CaO. La línea de CaO constante es paralela al lado donde CaO = 0 en todos sus puntos." }],
        explain: "En el lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub> todos los puntos tienen 0 % CaO; al trasladarlo paralelamente hacia el vértice CaO, el %CaO sube de 10 en 10. La línea amarilla punteada es la de 50 % CaO." } },

    { title: "Ubica la escoria (40 % CaO, 15 % Al₂O₃, 45 % SiO₂)", kind: "Ubicar punto",
      body: "<p>Haz clic en el diagrama donde crees que queda la escoria. Abajo verás la composición del punto que señala el cursor.</p>",
      draw: [{ t: "grid" }],
      q: { type: "click", target: E2, tol: 3, prompt: "Haz clic sobre la composición de la escoria.",
        hint: "Primero cuenta 4 líneas desde el lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub> hacia el vértice CaO (40 % CaO). Luego busca 15 % Al<sub>2</sub>O<sub>3</sub>: línea paralela al lado CaO–SiO<sub>2</sub>, una y media rayas hacia el vértice Al<sub>2</sub>O<sub>3</sub>.",
        explain: "Construcción: 1) la línea de <b>40 % CaO</b> (paralela al lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>); 2) la de <b>15 % Al<sub>2</sub>O<sub>3</sub></b> (paralela al lado CaO–SiO<sub>2</sub>); 3) su cruce es la escoria <b>E</b>. La línea de 45 % SiO<sub>2</sub> pasa por el mismo punto: es la comprobación. Fíjate que E cae en el campo primario de la <b>pseudowollastonita</b> (CaO·SiO<sub>2</sub>), con liquidus cercano a 1400 °C." },
      after: [{ t: "iso", k: 0, v: 40, col: K.esc, lab: "40 % CaO" }, { t: "iso", k: 1, v: 15, col: K.esc, lab: "15 % Al₂O₃" }, { t: "iso", k: 2, v: 45, col: K.esc, lab: "45 % SiO₂", dash: 1 }, { t: "pt", at: E2, col: K.esc, lab: "E", sub: "Escoria" }] },

    { title: "Ubica el refractario (72 % Al₂O₃, 28 % SiO₂)", kind: "Ubicar punto",
      body: "<p>El ladrillo no tiene CaO. Haz clic donde va su composición.</p>",
      q: { type: "click", target: R2, tol: 3, prompt: "Haz clic sobre la composición del refractario.",
        hint: "0 % CaO significa que el punto está sobre el lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub> (el lado derecho). Recórrelo desde SiO<sub>2</sub> (0 % Al<sub>2</sub>O<sub>3</sub>) hasta 72 % Al<sub>2</sub>O<sub>3</sub>: un poco por encima de 7 rayas.",
        explain: "Un refractario de dos componentes cae sobre un <b>lado</b> del triángulo (es un punto del binario Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>). Con 72 % Al<sub>2</sub>O<sub>3</sub> queda prácticamente sobre la <b>mullita</b> 3Al<sub>2</sub>O<sub>3</sub>·2SiO<sub>2</sub> (71,8 % Al<sub>2</sub>O<sub>3</sub>), que el diagrama marca con un círculo («3Al<sub>2</sub>O<sub>3</sub>·2SiO<sub>2</sub> ~1850°»). Lo llamamos <b>R</b>." },
      after: [{ t: "pt", at: R2, col: K.ref, lab: "R", sub: "Refractario" }] },

    { title: "Traza la línea refractario–escoria", kind: "Explicación",
      body: "<p>Paso 2 del procedimiento de las diapositivas: <b>se traza una línea que una los dos puntos</b>.</p><p>Cada punto de la línea R–E es una mezcla de refractario y escoria. Partiendo de R, a medida que la escoria penetra y reacciona, la composición de la interfase avanza hacia E. Por eso <b>los productos de reacción se sitúan sobre esta línea, partiendo de la composición del refractario</b>.</p><div class='reaction'><small>Regla de la palanca sobre la línea</small>fracción de escoria en una mezcla M = RM / RE &nbsp;·&nbsp; M = (1 − f)·R + f·E</div>",
      draw: [{ t: "ln", a: R2, b: E2, col: K.line, w: 5 }] },

    { title: "Triángulos de composición (líneas de unión)", kind: "Explicación",
      body: "<p>Se unen los compuestos que pueden coexistir en equilibrio en estado sólido. Cada triángulo así formado tiene un <b>punto invariante</b>: la temperatura a la que aparece el primer líquido en cualquier mezcla que caiga dentro de él.</p><p>Compuestos que importan aquí: <b>Mu</b> mullita, <b>Cor</b> corindón, <b>An</b> anortita (CaO·Al<sub>2</sub>O<sub>3</sub>·2SiO<sub>2</sub>), <b>Geh</b> gehlenita (2CaO·Al<sub>2</sub>O<sub>3</sub>·SiO<sub>2</sub>), <b>PsW</b> pseudowollastonita (CaO·SiO<sub>2</sub>), <b>CA6</b> (CaAl<sub>12</sub>O<sub>19</sub>) y <b>S</b> sílice. En morado van todas las líneas de unión del sistema.</p><div class='note'><b class='h'>Ojo</b>Las líneas de unión unen <b>compuestos</b> (puntos marcados con círculo), no los puntos invariantes. Los límites gruesos del diagrama separan campos primarios; no son las líneas de unión.</div>",
      draw: [{ t: "joins" }, { t: "cmps" }] },

    { title: "¿Qué triángulos atraviesa la línea?", kind: "Pregunta",
      body: "<p>Recorre la línea desde R hacia E y fíjate en cada línea de unión que cruza.</p>",
      q: { type: "multi", prompt: "Marca <b>todos</b> los triángulos de composición que atraviesa la línea R–E.",
        opts: [{ t: "Anortita – Mullita – Corindón", ok: 1 }, { t: "Anortita – Corindón – CA<sub>6</sub>", ok: 1 },
               { t: "Anortita – CA<sub>6</sub> – Gehlenita", ok: 1 }, { t: "Pseudowollastonita – Anortita – Gehlenita", ok: 1 },
               { t: "Sílice – Anortita – Mullita" }, { t: "Sílice – Pseudowollastonita – Anortita" }, { t: "Gehlenita – CA<sub>6</sub> – CA<sub>2</sub>" }],
        hint: "La línea sale de R casi sobre la mullita y baja hacia la izquierda. Corta primero la unión An–Cor, luego An–CA6 y por último An–Geh antes de llegar a E.",
        explain: "En orden, desde el refractario: <b>An–Mu–Cor</b> (1512 °C) → cruza la unión An–Cor → <b>An–Cor–CA<sub>6</sub></b> (1495 °C) → cruza An–CA<sub>6</sub> → <b>An–CA<sub>6</sub>–Geh</b> (1380 °C) → cruza An–Geh → <b>PsW–An–Geh</b> (1265 °C), donde está la escoria. La línea pasa muy cerca de la anortita, pero por debajo de ella: no toca los triángulos con sílice." },
      after: [{ t: "tri", id: "t6", col: K.t[0] }, { t: "tri", id: "t7", col: K.t[1] }, { t: "tri", id: "t8", col: K.t[2] }, { t: "tri", id: "t2", col: K.t[3] }, { t: "ln", a: R2, b: E2, col: K.line, w: 5 }] },

    { title: "Temperatura mínima de formación de líquido", kind: "Pregunta",
      body: "<p>Paso 4 del procedimiento: los puntos invariantes de los triángulos atravesados predicen las temperaturas más bajas a las que se puede producir líquido.</p><div class='tablewrap'><table class='t'><tr><th>Triángulo atravesado</th><th class='num'>Invariante</th></tr><tr><td>Anortita – Mullita – Corindón</td><td class='num'>1512 °C</td></tr><tr><td>Anortita – Corindón – CA<sub>6</sub></td><td class='num'>1495 °C</td></tr><tr><td>Anortita – CA<sub>6</sub> – Gehlenita</td><td class='num'>1380 °C</td></tr><tr><td>Pseudowollastonita – Anortita – Gehlenita</td><td class='num'>1265 °C</td></tr></table></div>",
      q: { type: "mcq", prompt: "¿Cuál es la temperatura más baja a la que puede formarse fase líquida en la interfase?",
        opts: [{ t: "1512 °C", fb: "Esa es la del triángulo donde está el refractario solo con un poco de CaO. Hay que mirar todos los triángulos que corta la línea." },
               { t: "1380 °C", fb: "Es un invariante atravesado, pero no el más bajo." },
               { t: "1265 °C", ok: 1 },
               { t: "1170 °C", fb: "1170 °C es el eutéctico Sílice–PsW–An, pero la línea no entra en ese triángulo." }],
        explain: "<b>1265 °C</b>, eutéctico Pseudowollastonita + Anortita + Gehlenita → Líquido. Es el mismo resultado de la diapositiva 152 para el refractario de 70 % Al<sub>2</sub>O<sub>3</sub> con escoria CaO/SiO<sub>2</sub> = 1. Si el horno opera por encima de 1265 °C, en la interfase habrá líquido y el refractario se corroe." } },

    { title: "% de CaO con el que desaparece la mullita", kind: "Cálculo",
      body: "<p>El CaO de la interfase disuelve la mullita. La mullita existe mientras la mezcla esté en el triángulo An–Mu–Cor; deja de existir cuando la línea cruza la unión <b>An–Cor</b> (punto X).</p>",
      draw: [{ t: "xpt", a: R2, b: E2, j: ["CAS2", "A"], col: K.aux, lab: "X", sub: "", hidden: 1 }],
      q: { type: "num", prompt: "¿Qué % de CaO tiene la interfase en el punto X?", ans: 16.3, tol: 1.5, unit: "% CaO",
        hint: "Lee el %CaO de X con la retícula (está entre 10 y 20 %), o usa la palanca: f = RX/RE ≈ 0,41 y CaO = f·40.",
        explain: "X está en la intersección de la línea R–E con la unión An–Cor: <b>X ≈ 16 % CaO – 49 % Al<sub>2</sub>O<sub>3</sub> – 35 % SiO<sub>2</sub></b>. Por la palanca, RX/RE = 0,41 → CaO = 0,41 × 40 % = <b>16,3 %</b>. Con más de ~16 % de CaO en la interfase la mullita se disuelve por completo (las diapositivas dan ≈ 18 % para 70 % Al<sub>2</sub>O<sub>3</sub> y ≈ 8 % para 90 % Al<sub>2</sub>O<sub>3</sub> con escoria CaO/SiO<sub>2</sub> = 1)." },
      after: [{ t: "xpt", a: R2, b: E2, j: ["CAS2", "A"], col: K.aux, lab: "X", sub: "16 % CaO" }, { t: "iso", k: 0, v: 16.3, col: K.aux, lab: "16,3 % CaO", dash: 1 }] },

    { title: "Palanca en la línea: mezcla 70 % R + 30 % E", kind: "Cálculo",
      body: "<p>Una zona de reacción con 70 % de refractario y 30 % de escoria cae sobre la línea, a 30 % del camino de R hacia E.</p><div class='reaction'><small>Balance de masa</small>M = 0,70·R + 0,30·E</div>",
      q: { type: "num", prompt: "¿Cuál es el % de CaO de la mezcla M?", ans: 12, tol: 0.6, unit: "% CaO",
        hint: "El refractario no aporta CaO: solo cuenta 0,30 × 40 %.",
        explain: "CaO = 0,70·0 + 0,30·40 = <b>12 %</b>; Al<sub>2</sub>O<sub>3</sub> = 0,70·72 + 0,30·15 = <b>54,9 %</b>; SiO<sub>2</sub> = 0,70·28 + 0,30·45 = <b>33,1 %</b>. En el diagrama, RM/RE = 0,30: M está a menos de un tercio del camino. Como 12 % < 16,3 %, M queda antes de X." },
      after: [{ t: "pt", at: M2, col: K.ink, lab: "M", sub: "70 % R + 30 % E" }] },

    { title: "¿Qué fases hay en M?", kind: "Pregunta",
      body: "<p>Por debajo del solidus, las fases en equilibrio son los tres compuestos del triángulo donde cae la mezcla.</p>",
      q: { type: "mcq", prompt: "¿Qué fases hay en equilibrio en M por debajo del solidus?",
        opts: [{ t: "Anortita + Mullita + Corindón", ok: 1 },
               { t: "Anortita + Corindón + CA<sub>6</sub>", fb: "M (12 % CaO) todavía no ha cruzado la unión An–Cor, que está en 16,3 % CaO." },
               { t: "Sílice + Anortita + Mullita", fb: "Ese triángulo está al otro lado de la unión An–Mu; la línea R–E no pasa por él." },
               { t: "Solo mullita y líquido", fb: "Por debajo del solidus no hay líquido; las fases son los vértices del triángulo de composición." }],
        explain: "M está en el triángulo <b>An–Mu–Cor</b>: por debajo de 1512 °C es una mezcla de anortita, mullita y corindón. A 1512 °C aparece el primer líquido (invariante de ese triángulo)." },
      after: [{ t: "tri", id: "t6", col: "#b77900", hl: 1 }] },

    { title: "Palanca ternaria: proporción de cada fase", kind: "Cálculo",
      body: "<p>Regla de la palanca en el triángulo: se traza una recta desde el vértice de la fase (An) que pase por M hasta el lado opuesto (Mu–Cor), punto Q. Entonces</p><div class='reaction'><small>Palanca ternaria</small>% An = MQ / (An–Q) × 100</div><p>Hay un atajo con balance de masa: el <b>único</b> compuesto con CaO del triángulo es la anortita (20,15 % CaO).</p>",
      draw: [{ t: "lever", from: "CAS2", thru: M2, to: ["A3S2", "A"], col: K.aux }],
      q: { type: "num", prompt: "¿Qué porcentaje de anortita hay en M?", ans: 59.6, tol: 2.5, unit: "% An",
        hint: "Balance de CaO: x<sub>An</sub> × 20,15 % = 12 % (todo el CaO de M está en la anortita).",
        explain: "<b>Anortita:</b> x<sub>An</sub> = 12 / 20,15 = <b>59,6 %</b>.<br><b>Mullita:</b> balance de SiO<sub>2</sub> (el corindón no tiene SiO<sub>2</sub>): 0,596 × 43,2 + x<sub>Mu</sub> × 28,2 = 33,1 → x<sub>Mu</sub> = (33,1 − 25,7)/28,2 = <b>26,1 %</b>.<br><b>Corindón:</b> 100 − 59,6 − 26,1 = <b>14,3 %</b>.<br>Comprobación con Al<sub>2</sub>O<sub>3</sub>: 0,596·36,65 + 0,261·71,8 + 0,143·100 = 21,8 + 18,7 + 14,3 = 54,8 % ≈ 54,9 % ✓. En el gráfico, MQ es casi el 60 % de la recta An–Q." } },

    { title: "Conclusión del punto 2", kind: "Conclusión",
      body: "<div class='qpp'><p><b class='h'>a) Ubicación</b>E (40/15/45) en el campo de la pseudowollastonita; R sobre el lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>, prácticamente en la mullita.</p><p><b class='h'>b) Triángulos y temperatura</b>An–Mu–Cor (1512) → An–Cor–CA<sub>6</sub> (1495) → An–CA<sub>6</sub>–Geh (1380) → PsW–An–Geh (1265). Puede formarse líquido desde <b>1265 °C</b>.</p><p class='w'><b class='h'>c) Disolución de la mullita</b>Con ≈ 16 % de CaO en la interfase desaparece la mullita.</p><p class='f'><b class='h'>d) Palanca (70 % R + 30 % E)</b>M = 12 % CaO, 54,9 % Al<sub>2</sub>O<sub>3</sub>, 33,1 % SiO<sub>2</sub> → 59,6 % anortita + 26,1 % mullita + 14,3 % corindón.</p></div>",
      q: { type: "mcq", prompt: "Si se aumenta la relación CaO/SiO<sub>2</sub> de la escoria, la temperatura de formación de líquido en la interfase…",
        opts: [{ t: "aumenta", ok: 1 }, { t: "disminuye", fb: "Al revés: con más CaO la línea se aleja de los eutécticos ricos en sílice (1170, 1265 °C)." }, { t: "no cambia", fb: "Sí cambia, porque la línea R–E atraviesa otros triángulos." }],
        explain: "Lo dice la diapositiva 152: <b>al aumentar CaO/SiO<sub>2</sub> de la escoria aumenta la temperatura de formación de fase líquida</b>, porque la línea se desplaza hacia triángulos con gehlenita, C<sub>2</sub>S y aluminatos, que tienen invariantes más altos." } }
  ]
};

/* ============================== PUNTO 3 ============================== */
const R3 = [0, 40, 60], E3 = [60, 10, 30], M3 = [24, 28, 48], R9 = [0, 90, 10], RC = [100, 0, 0];
const P3 = {
  title: "Punto 3 · Caso de ingeniería: corrosión del refractario",
  statement: "<b class='lead'>Caso</b>El operario de un horno de tratamiento de escorias reporta que, a las pocas semanas de servicio, el revestimiento de <b>ladrillos de arcilla refractaria (40 % Al<sub>2</sub>O<sub>3</sub> – 60 % SiO<sub>2</sub>)</b> se está corroyendo en la línea de escoria. Allí la temperatura de trabajo es ≈ <b>1400 °C</b>. Análisis de la escoria: <b>CaO 48 %, SiO<sub>2</sub> 24 %, Al<sub>2</sub>O<sub>3</sub> 8 %, FeO 12 %, MgO 8 %</b>. Como ingeniero: a) determine el carácter ácido-básico de la escoria (grado de silicato) y del refractario; b) con el diagrama CaO–Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub> explique por qué se corroe el ladrillo; c) proponga y justifique una solución.",
  steps: [
    { title: "Carácter del refractario", kind: "Pregunta",
      body: "<p>Antes de calcular, clasifica el ladrillo según la tabla de óxidos.</p>",
      q: { type: "mcq", prompt: "Un ladrillo de arcilla refractaria (40 % Al<sub>2</sub>O<sub>3</sub> – 60 % SiO<sub>2</sub>) es un refractario…",
        opts: [{ t: "ácido", ok: 1 }, { t: "básico", fb: "No tiene CaO, MgO ni FeO: no puede ser básico." }, { t: "neutro", fb: "Neutros son C y cromita. La alúmina es anfótera, pero junto a SiO<sub>2</sub> actúa como base y el conjunto es ácido." }, { t: "aislante", fb: "Aislante es una clasificación por porosidad, no por química." }],
        explain: "En las diapositivas, los <b>refractarios ácidos</b> son los de SiO<sub>2</sub> y SiO<sub>2</sub>–Al<sub>2</sub>O<sub>3</sub> (sílice, arcilla refractaria y alta alúmina). Con grado de silicato: solo tiene óxidos ácidos (la alúmina no se cuenta), así que G.S. → ∞ ≫ 1." } },

    { title: "Grado de silicato: oxígeno en óxidos ácidos", kind: "Cálculo",
      body: "<div class='reaction'><small>Grado de silicato (diapositiva 144)</small>G.S. = moles de O en SiO<sub>2</sub> y demás óxidos ácidos (B<sub>2</sub>O<sub>3</sub>, P<sub>2</sub>O<sub>5</sub>) / moles de O en óxidos básicos</div><p>Base de cálculo: 100 g de escoria. Pesos moleculares: SiO<sub>2</sub> 60, CaO 56, FeO 72, MgO 40 g/mol. <b>La alúmina no se tiene en cuenta</b> (anfótera).</p>",
      q: { type: "num", prompt: "¿Cuántos moles de oxígeno aportan los óxidos ácidos en 100 g de escoria?", ans: 0.8, tol: 0.03, unit: "mol O",
        hint: "Solo hay SiO<sub>2</sub>: (24 g / 60 g/mol) × 2 átomos de O por molécula.",
        explain: "SiO<sub>2</sub>: 24/60 = 0,400 mol × 2 O = <b>0,800 mol O</b>. No hay B<sub>2</sub>O<sub>3</sub> ni P<sub>2</sub>O<sub>5</sub> en esta escoria." } },

    { title: "Grado de silicato: oxígeno en óxidos básicos", kind: "Cálculo",
      body: "<p>CaO, FeO y MgO aportan <b>un</b> oxígeno por molécula.</p>",
      q: { type: "num", prompt: "¿Cuántos moles de oxígeno aportan los óxidos básicos?", ans: 1.224, tol: 0.03, unit: "mol O",
        hint: "48/56 + 12/72 + 8/40.",
        explain: "CaO: 48/56 = 0,857 · FeO: 12/72 = 0,167 · MgO: 8/40 = 0,200 → <b>1,224 mol O</b>." } },

    { title: "Grado de silicato y carácter de la escoria", kind: "Cálculo",
      q: { type: "num", prompt: "Calcula el G.S. de la escoria.", ans: 0.654, tol: 0.03, unit: "",
        hint: "G.S. = 0,800 / 1,224.",
        explain: "G.S. = 0,800 / 1,224 = <b>0,65 &lt; 1 → escoria BÁSICA</b>.<br>Refractario <b>ácido</b> frente a escoria <b>básica</b>: son <b>incompatibles</b>. Los refractarios ácidos son atacados por las escorias básicas. Esa es la primera explicación de la corrosión." },
      body: "<p>Recuerda: G.S. &gt; 1 ácida · G.S. = 1 neutra · G.S. &lt; 1 básica.</p>" },

    { title: "Normaliza la escoria para el diagrama", kind: "Cálculo",
      body: "<p>El diagrama solo tiene tres componentes. Como en las diapositivas, se toman los <b>constituyentes principales</b> (CaO, Al<sub>2</sub>O<sub>3</sub>, SiO<sub>2</sub>) y se llevan a 100 %. El FeO y el MgO actúan como fundentes: bajan aún más las temperaturas que vamos a leer, así que el resultado del diagrama es optimista.</p>",
      q: { type: "num", prompt: "¿Qué % de CaO tiene la escoria normalizada?", ans: 60, tol: 0.5, unit: "% CaO",
        hint: "CaO + Al<sub>2</sub>O<sub>3</sub> + SiO<sub>2</sub> = 48 + 8 + 24 = 80. Divide cada uno entre 80.",
        explain: "Suma = 80 %. CaO = 48/80 = <b>60 %</b>; Al<sub>2</sub>O<sub>3</sub> = 8/80 = <b>10 %</b>; SiO<sub>2</sub> = 24/80 = <b>30 %</b>. CaO/SiO<sub>2</sub> = 2 (escoria muy básica)." } },

    { title: "Ubica la escoria (60 % CaO, 10 % Al₂O₃, 30 % SiO₂)", kind: "Ubicar punto",
      body: "<p>Haz clic en la composición normalizada de la escoria.</p>",
      draw: [{ t: "grid" }],
      q: { type: "click", target: E3, tol: 3, prompt: "Haz clic sobre la escoria normalizada.",
        hint: "60 % CaO: 6 rayas desde el lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub> hacia el vértice CaO. 10 % Al<sub>2</sub>O<sub>3</sub>: la primera raya paralela al lado CaO–SiO<sub>2</sub>.",
        explain: "Cruce de 60 % CaO y 10 % Al<sub>2</sub>O<sub>3</sub>; comprobación con 30 % SiO<sub>2</sub>. La escoria E queda en la zona del C<sub>2</sub>S (silicato dicálcico), muy cerca del lado CaO–SiO<sub>2</sub>." },
      after: [{ t: "iso", k: 0, v: 60, col: K.esc, lab: "60 % CaO" }, { t: "iso", k: 1, v: 10, col: K.esc, lab: "10 % Al₂O₃" }, { t: "iso", k: 2, v: 30, col: K.esc, lab: "30 % SiO₂", dash: 1 }, { t: "pt", at: E3, col: K.esc, lab: "E", sub: "Escoria" }] },

    { title: "Ubica el refractario (40 % Al₂O₃, 60 % SiO₂)", kind: "Ubicar punto",
      q: { type: "click", target: R3, tol: 3, prompt: "Haz clic sobre la composición del ladrillo de arcilla refractaria.",
        hint: "Sin CaO → lado derecho (Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>). 40 % Al<sub>2</sub>O<sub>3</sub> = 4 rayas desde el vértice SiO<sub>2</sub>.",
        explain: "R está sobre el lado Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>, entre la sílice y la mullita: el ladrillo solo tiene <b>mullita + sílice (cristobalita)</b>. Por sí solo no forma líquido hasta el eutéctico cristobalita + mullita, <b>1595 °C</b>: aguantaría los 1400 °C. <b>El problema lo trae la escoria.</b>" },
      body: "<p>Ladrillo de arcilla refractaria del grupo de los aluminosos (38–50 % Al<sub>2</sub>O<sub>3</sub>).</p>",
      after: [{ t: "pt", at: R3, col: K.ref, lab: "R", sub: "Arcilla refractaria" }] },

    { title: "Línea de reacción y triángulos de composición", kind: "Explicación",
      body: "<p>Se unen R y E. Los productos de la reacción ladrillo-escoria están sobre esta línea, empezando en R. Encima van las líneas de unión del sistema.</p>",
      draw: [{ t: "joins" }, { t: "cmps" }, { t: "ln", a: R3, b: E3, col: K.line, w: 5 }] },

    { title: "¿Qué triángulos atraviesa la línea?", kind: "Pregunta",
      body: "<p>Ve desde R (lado derecho, arriba) hacia E (izquierda, abajo) y cuenta las uniones que corta.</p>",
      q: { type: "multi", prompt: "Marca <b>todos</b> los triángulos que atraviesa la línea R–E.",
        opts: [{ t: "Sílice – Anortita – Mullita", ok: 1 }, { t: "Sílice – Pseudowollastonita – Anortita", ok: 1 }, { t: "Pseudowollastonita – Anortita – Gehlenita", ok: 1 },
               { t: "Pseudowollastonita – Rankinita – Gehlenita", ok: 1 }, { t: "Rankinita – C<sub>2</sub>S – Gehlenita", ok: 1 }, { t: "Gehlenita – CA – C<sub>2</sub>S", ok: 1 },
               { t: "Anortita – Mullita – Corindón" }, { t: "Anortita – CA<sub>6</sub> – Gehlenita" }],
        hint: "Son seis. La línea pasa por encima de la anortita (no por debajo como en el punto 2) y termina en el triángulo Geh–CA–C<sub>2</sub>S, donde está la escoria.",
        explain: "Desde R: <b>S–An–Mu</b> (1345 °C) → cruza S–An → <b>S–PsW–An</b> (1170 °C) → cruza PsW–An → <b>PsW–An–Geh</b> (1265 °C) → cruza PsW–Geh → <b>PsW–Rk–Geh</b> (1310 °C) → cruza Rk–Geh → <b>Rk–C<sub>2</sub>S–Geh</b> (1315 °C) → cruza C<sub>2</sub>S–Geh → <b>Geh–CA–C<sub>2</sub>S</b> (1380 °C)." },
      after: [{ t: "tri", id: "t5", col: K.t[0] }, { t: "tri", id: "t1", col: K.t[3] }, { t: "tri", id: "t2", col: K.t[1] }, { t: "tri", id: "t3", col: K.t[2] }, { t: "tri", id: "t4", col: K.t[4] }, { t: "tri", id: "t11", col: K.t[5] }, { t: "ln", a: R3, b: E3, col: K.line, w: 5 }] },

    { title: "¿Por qué se corroe el ladrillo?", kind: "Pregunta",
      body: "<div class='tablewrap'><table class='t'><tr><th>Triángulo</th><th class='num'>Invariante</th></tr><tr><td>Sílice – Anortita – Mullita</td><td class='num'>1345 °C</td></tr><tr><td>Sílice – Pseudowollastonita – Anortita</td><td class='num'>1170 °C</td></tr><tr><td>Pseudowollastonita – Anortita – Gehlenita</td><td class='num'>1265 °C</td></tr><tr><td>Pseudowollastonita – Rankinita – Gehlenita</td><td class='num'>1310 °C</td></tr><tr><td>Rankinita – C<sub>2</sub>S – Gehlenita</td><td class='num'>1315 °C</td></tr><tr><td>Gehlenita – CA – C<sub>2</sub>S</td><td class='num'>1380 °C</td></tr></table></div>",
      q: { type: "mcq", prompt: "¿Desde qué temperatura puede formarse líquido en la interfase ladrillo-escoria?",
        opts: [{ t: "1595 °C (eutéctico cristobalita + mullita)", fb: "Eso vale para el ladrillo solo. Con la escoria, la interfase entra en triángulos que contienen CaO." },
               { t: "1380 °C", fb: "Ese es el triángulo donde está la escoria, pero no el más bajo." },
               { t: "1170 °C", ok: 1 }, { t: "1265 °C", fb: "Se atraviesa, pero hay uno más bajo." }],
        explain: "<b>1170 °C</b>, eutéctico Sílice + Pseudowollastonita + Anortita → Líquido. Es ≈ 230 °C por debajo de la temperatura de trabajo (1400 °C). En cuanto el CaO de la escoria entra en el ladrillo, la interfase pasa al triángulo S–PsW–An y se forma <b>abundante líquido</b>: la escoria disuelve la sílice y la mullita, el líquido se lleva el material y el ladrillo pierde espesor. Además, el FeO y el MgO de la escoria bajan todavía más esa temperatura." } },

    { title: "% de CaO que destruye la mullita del ladrillo", kind: "Cálculo",
      body: "<p>La mullita (la fase que le da resistencia al ladrillo) desaparece cuando la línea sale del triángulo S–An–Mu, al cruzar la unión <b>S–An</b> (punto X).</p>",
      draw: [{ t: "xpt", a: R3, b: E3, j: ["S", "CAS2"], col: K.aux, lab: "X", hidden: 1 }],
      q: { type: "num", prompt: "¿Qué % de CaO hay en la interfase en el punto X?", ans: 17.3, tol: 1.5, unit: "% CaO",
        hint: "Palanca: RX/RE ≈ 0,29; la escoria normalizada tiene 60 % CaO.",
        explain: "X ≈ <b>17 % CaO – 31 % Al<sub>2</sub>O<sub>3</sub> – 51 % SiO<sub>2</sub></b> (RX/RE = 0,29 → 0,29 × 60 = 17,3 % CaO). Con apenas ~17 % de CaO en la interfase ya no queda mullita, y desde ese punto el líquido aparece a 1170 °C." },
      after: [{ t: "xpt", a: R3, b: E3, j: ["S", "CAS2"], col: K.aux, lab: "X", sub: "17 % CaO" }] },

    { title: "Palanca: interfase con 60 % ladrillo y 40 % escoria", kind: "Pregunta",
      body: "<p>M = 0,60·R + 0,40·E = <b>24 % CaO, 28 % Al<sub>2</sub>O<sub>3</sub>, 48 % SiO<sub>2</sub></b>.</p>",
      q: { type: "mcq", prompt: "¿En qué triángulo cae M y qué pasa a 1400 °C?",
        opts: [{ t: "S–PsW–An: sílice + pseudowollastonita + anortita; a 1400 °C ya hay líquido (invariante 1170 °C)", ok: 1 },
               { t: "S–An–Mu: todavía hay mullita y no hay líquido hasta 1345 °C", fb: "Con 24 % CaO la mezcla ya pasó X (17,3 % CaO): la mullita desapareció." },
               { t: "PsW–An–Geh: no hay líquido hasta 1265 °C", fb: "M (24 % CaO) aún no llega a la unión PsW–An, que la línea cruza en 28,5 % CaO." }],
        explain: "M está entre X (17,3 % CaO) y la unión PsW–An (28,5 % CaO): triángulo <b>S–PsW–An</b>. Por debajo de 1170 °C sería 5,8 % sílice + 17,8 % pseudowollastonita + 76,4 % anortita (palanca con balances de CaO y Al<sub>2</sub>O<sub>3</sub>). Pero a 1400 °C está muy por encima del invariante: hay <b>fase líquida</b>, y la interfase se funde." },
      after: [{ t: "pt", at: M3, col: K.ink, lab: "M", sub: "60 % R + 40 % E" }, { t: "tri", id: "t1", col: "#e6427a", hl: 1 }] },

    { title: "Evalúa alternativas de refractario", kind: "Pregunta",
      body: "<p>Compara tres opciones con la misma escoria (líneas nuevas):</p><ul><li><b>Alta alúmina</b> (corindón, 90 % Al<sub>2</sub>O<sub>3</sub>): línea naranja. Su línea pasa por An–Mu–Cor (1512), An–Cor–CA<sub>6</sub> (1495), An–CA<sub>6</sub>–Geh (1380), <b>PsW–An–Geh (1265 °C)</b> y luego los triángulos cercanos a la escoria (1310–1380 °C). Mínimo: <b>1265 °C</b>.</li><li><b>Refractario básico</b> (doloma CaO·MgO / magnesia), representado aquí por el vértice CaO: línea verde. Junto al ladrillo atraviesa <b>C<sub>3</sub>S–C<sub>3</sub>A–Cal (1470 °C)</b> y <b>C<sub>2</sub>S–C<sub>3</sub>A–C<sub>3</sub>S (1455 °C)</b>; los triángulos de 1335 °C aparecen solo cuando la mezcla es casi pura escoria (&gt; 89 % escoria).</li></ul>",
      draw: [{ t: "ln", a: R9, b: E3, col: "#f0562e", w: 4 }, { t: "pt", at: R9, col: "#f0562e", lab: "R₉₀", sub: "90 % Al₂O₃" }, { t: "ln", a: RC, b: E3, col: "#19b8a6", w: 4 }, { t: "pt", at: RC, col: "#19b8a6", lab: "Rb", sub: "Básico", r: 9 }],
      q: { type: "mcq", prompt: "¿Qué refractario le recomiendas al operario para la línea de escoria?",
        opts: [{ t: "Ladrillo de sílice (> 93 % SiO<sub>2</sub>)", fb: "Es todavía más ácido: su línea entra directo al triángulo de 1170 °C. Empeora el problema." },
               { t: "Ladrillo de alta alúmina (90 % Al<sub>2</sub>O<sub>3</sub>)", fb: "Mejora (1265 °C en vez de 1170 °C), pero 1265 °C sigue por debajo de 1400 °C: seguiría formándose líquido. Sirve como solución intermedia, no como la definitiva." },
               { t: "Refractario básico de magnesia o doloma, denso", ok: 1 },
               { t: "Ladrillo aislante de alta porosidad", fb: "Un aislante (> 45 % de porosidad) no resiste el ataque químico y la escoria lo penetraría por los poros." }],
        explain: "La escoria es básica (G.S. = 0,65, CaO/SiO<sub>2</sub> = 2): el refractario compatible es <b>básico</b>. En el diagrama, los productos que se forman junto al ladrillo (C<sub>3</sub>S, C<sub>2</sub>S, C<sub>3</sub>A, cal) no funden hasta 1455–1470 °C, por encima de los 1400 °C de trabajo. En vez de fundirse, forman una capa sólida que frena la difusión de la escoria (recristalización de CaO y Ca<sub>2</sub>SiO<sub>4</sub>, como en la doloma de las diapositivas)." } },

    { title: "Respuesta al operario (conclusión del caso)", kind: "Conclusión",
      body: "<div class='qpp'><p><b class='h'>Diagnóstico</b>La escoria es <b>básica</b> (G.S. = 0,65 &lt; 1) y el ladrillo de arcilla refractaria es <b>ácido</b>: son incompatibles. En el diagrama CaO–Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub>, la línea ladrillo-escoria atraviesa el triángulo Sílice–Pseudowollastonita–Anortita, cuyo eutéctico está en <b>1170 °C</b>, unos 230 °C por debajo de la temperatura de trabajo. Con apenas ~17 % de CaO en la interfase desaparece la mullita y se forma líquido, que disuelve y arrastra el ladrillo.</p><p class='w'><b class='h'>Solución principal</b>Cambiar el revestimiento de la línea de escoria por <b>refractario básico (magnesia, doloma o MgO–C), denso y de baja porosidad</b>. Sus productos de reacción con la escoria (silicatos y aluminatos cálcicos ricos en CaO) no funden hasta ~1455–1470 °C.</p><p class='f'><b class='h'>Medidas complementarias</b>Si el cambio no es inmediato, usar alta alúmina (líquido desde 1265 °C, mejor que 1170 °C) como transición. Saturar la escoria en MgO (adición de dolomita) para que disuelva menos el refractario. No subir la temperatura de la línea de escoria. Controlar la basicidad. Evitar el flujo turbulento de escoria sobre la pared. Revisar la porosidad del ladrillo, porque la escoria penetra por los poros abiertos.</p></div>" }
  ]
};

/* ============================== REPASO ============================== */
const REPASO = `
<div class="rgrid">
<section class="card"><h3>Procedimiento para predecir la corrosión</h3><ol>
<li>Ubicar la composición del refractario y la de la escoria en el diagrama.</li>
<li>Trazar la línea que une los dos puntos.</li>
<li>Los productos de reacción están sobre esa línea, partiendo del refractario.</li>
<li>Los puntos invariantes de los triángulos de composición que atraviesa la línea dan las temperaturas más bajas a las que se puede formar líquido.</li></ol>
<div class="note"><b class="h">Extra</b>El %CaO en el que la línea sale del triángulo que contiene la mullita es el contenido de CaO que la disuelve por completo (palanca: CaO = f·%CaO<sub>escoria</sub>).</div></section>
<section class="card"><h3>Grado de silicato</h3>
<div class="reaction"><small>G.S.</small>moles de O en óxidos ácidos (SiO<sub>2</sub>, B<sub>2</sub>O<sub>3</sub>, P<sub>2</sub>O<sub>5</sub>) / moles de O en óxidos básicos (CaO, MgO, FeO, MnO…)</div>
<p>&gt; 1 ácida · = 1 neutra · &lt; 1 básica. La Al<sub>2</sub>O<sub>3</sub> no se cuenta. O por mol: SiO<sub>2</sub> 2, P<sub>2</sub>O<sub>5</sub> 5, B<sub>2</sub>O<sub>3</sub> 3, MO 1.</p>
<p>PM (g/mol): SiO<sub>2</sub> 60 · CaO 56 · FeO 72 · MnO 71 · MgO 40 · P<sub>2</sub>O<sub>5</sub> 142.</p>
<p>Ejemplos de las diapositivas: escoria de alto horno ≈ 1,3 (ácida); escoria de afino ≈ 0,52 (básica).</p></section>
<section class="card"><h3>Clasificación</h3><ul>
<li><b>Química:</b> ácidos (SiO<sub>2</sub>, B<sub>2</sub>O<sub>3</sub>, P<sub>2</sub>O<sub>5</sub>), básicos (CaO, MgO, FeO), anfóteros (Al<sub>2</sub>O<sub>3</sub>, TiO<sub>2</sub>), neutros (C, cromita).</li>
<li><b>Forma:</b> conformados (ladrillos) y monolíticos (morteros, concretos).</li>
<li><b>Porosidad:</b> densos ≤ 45 % y aislantes &gt; 45 %.</li>
<li><b>Tipos:</b> ácidos, básicos, anfóteros, neutros, aislantes y especiales (ZrO<sub>2</sub>, SiC, Si<sub>3</sub>N<sub>4</sub>).</li></ul></section>
<section class="card"><h3>Propiedades a controlar</h3><ul>
<li>Refractariedad: cono pirométrico (ASTM C24, NTC 706), microscopio de calentamiento, dilatometría.</li>
<li>Resistencia mecánica en caliente: módulo de ruptura (ASTM C583, NTC 5277) y refractariedad bajo carga (ISO 1893: T<sub>a</sub> = 0,6 %).</li>
<li>Cambios de volumen: cambio dimensional permanente (NTC 688 densos, NTC 859 aislantes).</li>
<li>Choque térmico: NTC 1432 (ciclos) y ASTM C1171 (% de pérdida del MOR).</li>
<li>Ataque por escorias: NTC 1416 y ASTM C874 (crisol de 44 mm × 35 mm, 50 g de escoria, 2 h).</li></ul></section>
<section class="card"><h3>Alúmina–sílice</h3><ul>
<li>Eutécticos: cristobalita + mullita a 1595 °C; mullita + corindón a 1840 °C.</li>
<li>Sílice &lt; 7 % Al<sub>2</sub>O<sub>3</sub> · arcilla 7–50 % · sillimanita 50–65 % · mullita 65–75 % · corindón 75–98 %.</li>
<li>Los silíceos (7–22 %) son los de menor refractariedad (1595 °C).</li>
<li>Sillimanita, andalucita y cianita se expanden 5–15 % al cocerse; por eso se pre-calcinan a 1400 °C.</li></ul></section>
<section class="card"><h3>Básicos</h3><ul>
<li>Magnesia: funde a 2800 °C, sin polimorfismo; quemado a muerte a 1500–1700 °C; CaO/SiO<sub>2</sub> ≥ 2.</li>
<li>Doloma (CaO + MgO): eutéctico a 2370 °C, muy estable; la cal recristaliza y hace de barrera.</li>
<li>Forsterita: funde a 1890 °C (refractariedad 1750 °C), expansión alta.</li>
<li>Magnesia-cromo: espinela MgCr<sub>2</sub>O<sub>4</sub> (funde a 2350 °C), SiO<sub>2</sub> &lt; 3 %; riesgo de Cr(VI) con calcio.</li>
<li>LD y horno de arco: escoria básica → magnesita y dolomita.</li></ul></section>
</div>
<section class="card"><h3>Triángulos de composición del sistema CaO–Al<sub>2</sub>O<sub>3</sub>–SiO<sub>2</sub></h3>
<div class="tablewrap"><table class="t" id="tritable"><tr><th>Triángulo (fases en equilibrio sólido)</th><th class="num">Invariante</th></tr></table></div></section>`;
