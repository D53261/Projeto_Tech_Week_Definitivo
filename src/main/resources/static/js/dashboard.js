const API_BASE = 'https://techweek-5idz.onrender.com';

let dadosParticipantes = [];
let dadosProjetos = [];

function atualizarRelogio() {

  const el = document.getElementById('data-hora');

  function tick() {

    const agora = new Date();

    el.textContent = agora.toLocaleString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  tick();

  setInterval(tick, 60000);
}

function esc(str) {

  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function possuiCoffeBreak(valor) {

  return (
    valor === true ||
    valor === 1 ||
    valor === '1' ||
    valor === 'true' ||
    valor === 'TRUE' ||
    valor === 'Sim' ||
    valor === 'SIM'
  );
}

async function apiFetch(endpoint) {

  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  return response.json();
}

async function carregarTudo() {

  try {

    await Promise.all([
      carregarParticipantes(),
      carregarProjetos()
    ]);

  } catch (e) {

    console.error(e);
  }
}

async function carregarParticipantes() {

  try {

    dadosParticipantes =
      await apiFetch('/participantes');

    console.log(dadosParticipantes);

    document.getElementById('m-inscritos').textContent =
      dadosParticipantes.length;

    const coffe =
      dadosParticipantes.filter(p =>
        possuiCoffeBreak(p.coffe)
      ).length;

    document.getElementById('m-coffe').textContent =
      coffe;

    renderParticipantes(dadosParticipantes);

    renderUltimosInscritos(
      dadosParticipantes.slice(-5).reverse()
    );

    renderCursos(dadosParticipantes);

  } catch (e) {

    console.error(
      'Erro ao carregar participantes:',
      e
    );
  }
}

async function carregarProjetos() {

  try {

    dadosProjetos =
      await apiFetch('/projeto');

    document.getElementById('m-projetos').textContent =
      dadosProjetos.length;

    renderProjetos(dadosProjetos);

    renderUltimosProjetos(
      dadosProjetos.slice(-5).reverse()
    );

  } catch (e) {

    console.error(
      'Erro ao carregar projetos:',
      e
    );
  }
}

function renderParticipantes(lista) {

  const tbody =
    document.getElementById('tbody-participantes');

  document.getElementById('count-participantes')
    .textContent = `${lista.length} registros`;

  if (!lista.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          Nenhum participante encontrado
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = lista.map((p, i) => `

    <tr>

      <td>${i + 1}</td>

      <td>${esc(p.nome)}</td>

      <td>${esc(p.ra)}</td>

      <td>${esc(p.curso || 'Não informado')}</td>

      <td>${esc(p.serie || 'Não informado')}</td>

      <td>
        ${possuiCoffeBreak(p.coffe)
          ? '<span class="badge badge-green">☕ Sim</span>'
          : '<span class="badge badge-gray">Não</span>'
        }
      </td>

    </tr>

  `).join('');
}

function renderProjetos(lista) {

  const tbody =
    document.getElementById('tbody-projetos');

  document.getElementById('count-projetos')
    .textContent = `${lista.length} registros`;

  if (!lista.length) {

    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          Nenhum projeto encontrado
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML = lista.map((p, i) => `

    <tr>

      <td>${i + 1}</td>

      <td>${esc(p.nomeProjeto)}</td>

      <td>${esc(p.nomeResponsavel)}</td>

      <td>${esc(p.ra)}</td>

      <td>
        ${esc(p.descricao)}
      </td>

    </tr>

  `).join('');
}

function renderUltimosInscritos(lista) {

  const el =
    document.getElementById(
      'lista-ultimos-inscritos'
    );

  if (!lista.length) {

    el.innerHTML = `
      <div class="empty-state">
        Nenhum inscrito ainda
      </div>
    `;

    return;
  }

  el.innerHTML = lista.map(p => `

    <div class="mini-card">

      <div class="mini-avatar">
        ${esc(p.nome.charAt(0).toUpperCase())}
      </div>

      <div class="mini-content">

        <div class="mini-title">
          ${esc(p.nome)}
        </div>

        <div class="mini-sub">
          ${esc(p.curso || 'Sem curso')}
        </div>

      </div>

      ${
        possuiCoffeBreak(p.coffe)
          ? '<span class="mini-badge coffe">☕</span>'
          : ''
      }

    </div>

  `).join('');
}

function renderUltimosProjetos(lista) {

  const el =
    document.getElementById(
      'lista-ultimos-projetos'
    );

  if (!lista.length) {

    el.innerHTML = `
      <div class="empty-state">
        Nenhum projeto ainda
      </div>
    `;

    return;
  }

  el.innerHTML = lista.map(p => `

    <div class="mini-card projeto">

      <div class="mini-avatar blue">
        ◧
      </div>

      <div class="mini-content">

        <div class="mini-title">
          ${esc(p.nomeProjeto)}
        </div>

        <div class="mini-sub">
          ${esc(p.nomeResponsavel)}
        </div>

      </div>

      <span class="mini-badge projeto">
        Projeto
      </span>

    </div>

  `).join('');
}

function renderCursos(lista) {

  const el =
    document.getElementById('lista-cursos');

  const cursos = {};

  lista.forEach(p => {

    const curso =
      p.curso || 'Não informado';

    cursos[curso] =
      (cursos[curso] || 0) + 1;
  });

  const ordenado =
    Object.entries(cursos)
      .sort((a, b) => b[1] - a[1]);

  if (!ordenado.length) {

    el.innerHTML = `
      <div class="empty-state">
        Sem dados
      </div>
    `;

    return;
  }

  const total = lista.length;

  el.innerHTML = ordenado.map(([curso, qtd]) => `

    <div class="curso-card">

      <div class="curso-top">

        <span class="curso-nome">
          ${esc(curso)}
        </span>

        <span class="curso-qtd">
          ${qtd}
        </span>

      </div>

      <div class="curso-bar">

        <div
          class="curso-fill"
          style="width:${(qtd / total) * 100}%"
        ></div>

      </div>

    </div>

  `).join('');
}

function filtrarParticipantes() {

  const busca =
    document.getElementById(
      'busca-participantes'
    )
    .value
    .toLowerCase();

  const filtrados =
    dadosParticipantes.filter(p =>

      p.nome.toLowerCase().includes(busca) ||

      p.ra.toLowerCase().includes(busca)
    );

  renderParticipantes(filtrados);
}

function filtrarProjetos() {

  const busca =
    document.getElementById(
      'busca-projetos'
    )
    .value
    .toLowerCase();

  const filtrados =
    dadosProjetos.filter(p =>

      p.nomeProjeto
        .toLowerCase()
        .includes(busca)

      ||

      p.nomeResponsavel
        .toLowerCase()
        .includes(busca)

      ||

      p.ra
        .toLowerCase()
        .includes(busca)
    );

  renderProjetos(filtrados);
}

function mostrarAba(nome) {

  document
    .querySelectorAll('.tab-content')
    .forEach(el =>
      el.classList.remove('active')
    );

  document
    .querySelectorAll('.sidebar-link')
    .forEach(el =>
      el.classList.remove('active')
    );

  document
    .getElementById(`aba-${nome}`)
    ?.classList.add('active');

  document
    .querySelector(
      `[onclick="mostrarAba('${nome}')"]`
    )
    ?.classList.add('active');
}

function exportarCSV(tipo) {

  let rows = [];
  let nomeArquivo = '';

  if (tipo === 'participantes') {

    nomeArquivo =
      'participantes.csv';

    rows = [

      ['Nome', 'RA', 'Curso', 'Período', 'Coffe Break'],

      ...dadosParticipantes.map(p => [
        p.nome,
        p.ra,
        p.curso,
        p.serie,
        possuiCoffeBreak(p.coffe)
          ? 'Sim'
          : 'Não'
      ])
    ];
  }

  if (tipo === 'projetos') {

    nomeArquivo =
      'projetos.csv';

    rows = [

      ['Projeto', 'Responsável', 'RA', 'Descrição'],

      ...dadosProjetos.map(p => [
        p.nomeProjeto,
        p.nomeResponsavel,
        p.ra,
        p.descricao
      ])
    ];
  }

  const csv =
    rows.map(r =>
      r.map(v => `"${v ?? ''}"`).join(',')
    ).join('\n');

  const blob = new Blob(
    [csv],
    { type: 'text/csv;charset=utf-8;' }
  );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement('a');

  a.href = url;

  a.download = nomeArquivo;

  a.click();

  URL.revokeObjectURL(url);
}

function logout() {

  window.location.href = '/logout';
}

window.addEventListener('DOMContentLoaded', () => {

  atualizarRelogio();

  carregarTudo();

  console.log(dadosParticipantes);
});
