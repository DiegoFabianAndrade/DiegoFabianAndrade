const USER = 'DiegoFabianAndrade';
const $ = (selector) => document.querySelector(selector);

$('#year').textContent = new Date().getFullYear();

const motionButton = $('.motion-toggle');
const sprites = [...document.querySelectorAll('.battle-mon, .project-pokemon, .party-sprites img, .field-note img')];
function setMotion(paused) {
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.title = paused ? 'Reanudar animaciones' : 'Pausar animaciones';
  $('.motion-icon').textContent = paused ? '▶' : 'Ⅱ';
  $('.motion-label').textContent = paused ? 'Reanudar' : 'Pausar';
  sprites.forEach((sprite) => {
    if (!sprite.dataset.animatedSrc) sprite.dataset.animatedSrc = sprite.src;
    sprite.src = paused
      ? sprite.dataset.animatedSrc.replace('/animated/shiny/', '/shiny/').replace('/animated/back-shiny/', '/back-shiny/').replace(/\.gif(?:\?.*)?$/, '.png')
      : sprite.dataset.animatedSrc;
  });
}
motionButton.addEventListener('click', () => setMotion(!document.body.classList.contains('motion-paused')));
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setMotion(true);

const battleLines = [
  '¡Un nuevo proyecto salvaje apareció!',
  '¡Rayquaza variocolor está listo para colaborar!',
  '¡La Pokédex registró una nueva tecnología!',
  '¡Cada repositorio cuenta una historia distinta!'
];
let lineIndex = 0;
window.setInterval(() => {
  if (document.body.classList.contains('motion-paused')) return;
  lineIndex = (lineIndex + 1) % battleLines.length;
  const message = $('#battle-message');
  message.animate([{ opacity: .25, transform: 'translateY(3px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 320, easing: 'ease-out' });
  message.textContent = battleLines[lineIndex];
}, 4200);

document.querySelectorAll('.filter-button').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter-button').forEach((item) => item.classList.toggle('active', item === button));
    document.querySelectorAll('.project-card').forEach((card) => {
      card.classList.toggle('is-hidden', button.dataset.filter !== 'all' && card.dataset.kind !== button.dataset.filter);
    });
  });
});

async function loadGitHubStats() {
  const state = $('#stats-state');
  try {
    const [userResponse, reposResponse] = await Promise.all([
      fetch(`https://api.github.com/users/${USER}`),
      fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=updated`)
    ]);
    if (!userResponse.ok || !reposResponse.ok) throw new Error('GitHub API unavailable');
    const [user, repos] = await Promise.all([userResponse.json(), reposResponse.json()]);
    const stars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const languages = new Set(repos.map((repo) => repo.language).filter(Boolean));
    $('#stat-stars').textContent = stars.toLocaleString('es-CO');
    $('#stat-repos').textContent = user.public_repos.toLocaleString('es-CO');
    $('#stat-followers').textContent = user.followers.toLocaleString('es-CO');
    $('#stat-languages').textContent = languages.size.toLocaleString('es-CO');
    $('#dex-count').textContent = `${String(document.querySelectorAll('.tech-chip').length).padStart(3, '0')} / ${String(document.querySelectorAll('.tech-chip').length).padStart(3, '0')}`;
    state.textContent = `Actualizado desde la API pública de GitHub · ${new Date().toLocaleDateString('es-CO')}`;
  } catch {
    state.textContent = 'Estadísticas no disponibles ahora · consulta el perfil público de GitHub.';
    $('#stat-stars').textContent = '↗';
    $('#stat-repos').textContent = '↗';
    $('#stat-followers').textContent = '↗';
    $('#stat-languages').textContent = '↗';
  }
}

loadGitHubStats();
