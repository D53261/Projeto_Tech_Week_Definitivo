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
    a: 'Não é necessário estar matriculado em algu curso da faculdade Unicesumar, basta ter interesse em aprender sobre a área de tecnologia.'
  },
  {
    q: 'A inscrição é gratuita?',
    a: 'Sim! A participação no evento é totalmente gratuita. O coffee break é opcional e precisa ser confirmado separadamente pelo site.'
  },
  {
    q: 'Como faço para cadastrar meu projeto?',
    a: 'Você precisa estar inscrito no evento primeiro e matriculado na faculdade. Depois, acesse a página de cadastro de projeto, informe seu nome completo (igual ao da inscrição), seu RA e os dados do projeto. Cada participante pode cadastrar apenas um projeto.'
  },
  {
    q: 'O que acontece se eu errar meu RA ou nome na inscrição?',
    a: 'Entre em contato com a organização pelo e-mail do evento antes do dia. Alterações feitas após o início da Tech Week não poderão ser garantidas.'
  },
  {
    q: 'Preciso estar presente em todos os dias do evento?',
    a: 'Não é obrigatório. Você pode comparecer nos dias e palestras que mais te interessam. Recomendamos, porém, verificar o cronograma com antecedência — algumas atividades têm vagas limitadas.'
  },
  {
    q: 'Vou receber certificado de participação?',
    a: 'Sim. O certificado é emitido digitalmente ao final do evento para todos os participantes com inscrição confirmada e presença registrada.'
  },
  {
    q: 'Como funciona o coffee break?',
    a: 'O coffee break acontece em horário definido no cronograma. Para garantir sua vaga, confirme sua participação na seção "Coffee Break" do site. A confirmação é necessária para controle de quantidade.'
  },
  {
    q: 'Posso apresentar um projeto em grupo?',
    a: 'Sim, projetos em grupo são bem-vindos. No entanto, o cadastro é feito por um único responsável — informe o nome e RA do responsável pelo grupo. Os demais integrantes devem estar inscritos no evento individualmente e matriculados na faculdade para apresentar projetos.'
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
