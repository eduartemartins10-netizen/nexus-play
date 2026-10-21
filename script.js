/*
  NEXUS PLAY — melhorias progressivas.
  Os links e as páginas funcionam mesmo sem JavaScript.
*/
(() => {
  // Exibe uma arte de reserva se a capa oficial não carregar.
  document.querySelectorAll('img[data-fallback]').forEach((image) => {
    const onImageError = () => {
      if (image.dataset.failed) return;

      image.dataset.failed = 'true';
      const game = image.alt.replace(
        'Imagem oficial de divulgação do jogo ',
        ''
      );

      image.alt = (
        `Ilustração pixel art de reserva. ` +
        `Capa oficial de ${game} indisponível sem conexão.`
      );
      image.src = image.dataset.fallback;
    };

    image.addEventListener('error', onImageError, { once: true });
    if (image.complete && image.naturalWidth === 0) {
      onImageError();
    }
  });

  // Busca e filtros do catálogo.
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('.game-card')];
  const search = document.getElementById('busca-jogos');
  const empty = document.getElementById('empty-state');
  let filter = 'todos';

  function updateList() {
    let shown = 0;
    const q = (search?.value || '')
      .trim()
      .toLocaleLowerCase('pt-BR');

    cards.forEach((card) => {
      const correctCategory = (
        filter === 'todos' || card.dataset.category === filter
      );
      const correctName = card.textContent
        .toLocaleLowerCase('pt-BR')
        .includes(q);
      const match = correctCategory && correctName;

      card.hidden = !match;
      if (match) shown++;
    });

    if (empty) empty.hidden = shown !== 0;
  }

  filters.forEach((button) => {
    button.addEventListener('click', () => {
      filter = button.dataset.filter;
      filters.forEach((item) => {
        const selected = item === button;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });
      updateList();
    });
  });

  search?.addEventListener('input', updateList);

  // Favoritos temporários: não precisam de conta nem são armazenados.
  document.querySelectorAll('[data-favorite]').forEach((button) => {
    button.addEventListener('click', () => {
      const enabled = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(enabled));
      button.textContent = enabled ? '♥' : '♡';

      const action = enabled ? 'Remover' : 'Adicionar';
      const preposition = enabled ? 'dos' : 'aos';
      const game = button.dataset.favorite;
      button.setAttribute(
        'aria-label',
        `${action} ${game} ${preposition} favoritos`
      );
      button.title = enabled
        ? 'Remover dos favoritos'
        : 'Adicionar aos favoritos';
    });
  });

  // Formulário demonstrativo: valida sem enviar ou salvar dados.
  const form = document.getElementById('player-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const name = form.elements.namedItem('nome').value.trim();
    const feedback = document.getElementById('form-feedback');
    if (feedback) {
      feedback.hidden = false;
      feedback.textContent = (
        `★ FASE CONCLUÍDA! Bem-vindo(a), ${name}. ` +
        `Cadastro demonstrativo validado — ` +
        `nenhuma informação foi enviada ou armazenada.`
      );
      feedback.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  });
})();
