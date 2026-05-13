async function carregarParticipantes() {

  const container =
    document.getElementById('participantsList');

  try {

    const participantes =
      await API.getParticipantes();

    const statInscritos =
      document.getElementById('statInscritos');

    if (statInscritos) {
      statInscritos.textContent = participantes.length;
    }

    if (!container) return;

    if (!participantes.length) {

      container.innerHTML = `
        <div class="loading-state">
          Nenhum participante inscrito ainda.
        </div>
      `;

      return;
    }

    container.innerHTML =
      participantes.slice(0, 6).map(p => `

        <div class="participant-card">

          <div class="participant-name">
            ${p.nome ?? '—'}
          </div>

          <div class="participant-ra">
            RA: ${p.ra ?? '—'}
          </div>

          <div class="participant-curso">
            ${p.curso ?? 'Não informado'}
          </div>

        </div>

      `).join('');

  } catch (err) {

    console.error(err);

    if (container) {

      container.innerHTML = `
        <div class="loading-state">
          Erro ao carregar participantes.
        </div>
      `;
    }
  }
}


async function carregarProjetos() {

  const container =
    document.getElementById('projectsGrid');

  try {

    const projetos =
      await API.getProjetos();

    const statProjetos =
      document.getElementById('statProjetos');

    if (statProjetos) {
      statProjetos.textContent = projetos.length;
    }

    if (!container) return;

    if (!projetos.length) {

      container.innerHTML = `
        <div class="loading-state">
          Nenhum projeto cadastrado ainda.
          <a
            href="/projeto.html"
            style="color:inherit;text-decoration:underline;"
          >
            Seja o primeiro!
          </a>
        </div>
      `;

      return;
    }

    const recentes =
      [...projetos].reverse().slice(0, 3);

    const temMais =
      projetos.length > 3;

    container.innerHTML =

      recentes.map((p, i) => `

        <div class="project-card">

          <div class="project-badge">
            PROJETO #${projetos.length - i}
          </div>

          <div class="project-name">
            ${p.nomeProjeto ?? p.nome ?? '—'}
          </div>

          <div class="project-responsible">

            <span class="project-label">
              Responsável
            </span>

            ${p.nomeResponsavel ?? p.nome ?? '—'}

            <span class="project-ra">
              · RA ${p.ra ?? '—'}
            </span>

          </div>

          <div class="project-desc">
            ${p.descricao ?? ''}
          </div>

        </div>

      `).join('')

      +

      (temMais ? `

        <div class="projects-more">

          <span>
            +${projetos.length - 3}
            projeto${projetos.length - 3 > 1 ? 's' : ''}
            cadastrado${projetos.length - 3 > 1 ? 's' : ''}
          </span>

          <a
            href="/projeto.html"
            class="btn-outline small"
          >
            Cadastrar Projeto →
          </a>

        </div>

      ` : '');

  } catch (err) {

    console.error(err);

    if (container) {

      container.innerHTML = `
        <div class="loading-state">
          Erro ao carregar projetos.
        </div>
      `;
    }
  }
}

const FAQ_ITEMS = [

  {
    q: 'Quem pode participar da Tech Week?',
    a: 'Qualquer um pode participar normalmente das apresentações.'
  },

  {
    q: 'A inscrição é gratuita?',
    a: 'Sim! A participação no evento é totalmente gratuita.'
  },

  {
    q: 'Como faço para cadastrar meu projeto?',
    a: 'Você precisa estar inscrito primeiro.'
  }

];


function carregarFaq() {

  const container =
    document.getElementById('faqList');

  if (!container) return;

  container.innerHTML = FAQ_ITEMS.map((item, i) => `

    <div class="faq-item" id="faq-${i}">

      <button
        class="faq-question"
        onclick="toggleFaq(${i})"
        aria-expanded="false"
      >

        <span>${item.q}</span>

        <span class="faq-icon">+</span>

      </button>

      <div
        class="faq-answer"
        id="faq-answer-${i}"
      >

        <p>${item.a}</p>

      </div>

    </div>

  `).join('');
}


function toggleFaq(index) {

  const answer =
    document.getElementById('faq-answer-' + index);

  if (!answer) return;

  const btn =
    answer.previousElementSibling;

  const icon =
    btn.querySelector('.faq-icon');

  const isOpen =
    btn.getAttribute('aria-expanded') === 'true';

  FAQ_ITEMS.forEach((_, i) => {

    if (i === index) return;

    const a =
      document.getElementById('faq-answer-' + i);

    if (!a) return;

    const b =
      a.previousElementSibling;

    a.style.maxHeight = null;

    b.setAttribute('aria-expanded', 'false');

    b.querySelector('.faq-icon')
      .textContent = '+';

    document.getElementById('faq-' + i)
      .classList.remove('open');
  });

  if (isOpen) {

    answer.style.maxHeight = null;

    btn.setAttribute('aria-expanded', 'false');

    icon.textContent = '+';

    document.getElementById('faq-' + index)
      .classList.remove('open');

  } else {

    answer.style.maxHeight =
      answer.scrollHeight + 'px';

    btn.setAttribute('aria-expanded', 'true');

    icon.textContent = '×';

    document.getElementById('faq-' + index)
      .classList.add('open');
  }
}

window.addEventListener('scroll', () => {

  const nav =
    document.getElementById('nav');

  if (!nav) return;

  if (window.scrollY > 20) {

    nav.classList.add('scrolled');

  } else {

    nav.classList.remove('scrolled');
  }
});

document.addEventListener('DOMContentLoaded', () => {

  carregarParticipantes();

  carregarProjetos();

  carregarFaq();

});