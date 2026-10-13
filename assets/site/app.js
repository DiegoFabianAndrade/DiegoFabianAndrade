const USER = 'DiegoFabianAndrade';
const $ = (selector) => document.querySelector(selector);

$('#year').textContent = new Date().getFullYear();

const motionButton = $('.motion-toggle');
function setMotion(paused) {
  document.body.classList.toggle('motion-paused', paused);
  motionButton.setAttribute('aria-pressed', String(paused));
  motionButton.title = paused ? 'Reanudar animaciones' : 'Pausar animaciones';
  $('.motion-icon').textContent = paused ? '▶' : 'Ⅱ';
  $('.motion-label').textContent = paused ? 'Reanudar' : 'Pausar';
}
motionButton.addEventListener('click', () => setMotion(!document.body.classList.contains('motion-paused')));

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


// Open clean links at the start; keep intentional section anchors working.
const pageNavigation = performance.getEntriesByType('navigation')[0];
const navigationType = pageNavigation ? pageNavigation.type : 'navigate';
history.scrollRestoration = 'manual';
window.addEventListener('pageshow', (event) => {
  if (!window.location.hash && !event.persisted && navigationType !== 'back_forward') {
    window.scrollTo(0, 0);
  }
});


// Live GitHub analytics and Pokémon badge case
(function enhanceTrainerProfile(){
  const layout=document.querySelector('.medal-layout');
  if(!layout)return;
  const user='DiegoFabianAndrade';
  const theme='&theme=github_dark&title_color=df4b55&icon_color=d94343&text_color=e6edf3&bg_color=101d2d';
  const stats='https://github-readme-stats.vercel.app/api?username='+user+'&show_icons=true&include_all_commits=true'+theme;
  const langs='https://github-readme-stats.vercel.app/api/top-langs/?username='+user+'&layout=compact'+theme;
  const streak='https://github-readme-streak-stats.herokuapp.com/?user='+user+'&theme=dark&background=101d2d&ring=d94343&fire=df4b55&currStreakLabel=df4b55&sideLabels=e6edf3&border=33495e';
  layout.classList.add('analytics-layout');
  layout.innerHTML=
    '<div class="analytics-top">'+
      '<article class="analytics-card"><header class="analytics-card-head"><div><p class="eyebrow">PERFIL · ACTIVIDAD</p><h3>GitHub Stats</h3></div><img class="analytics-emblem" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medal-box.png" alt="Caja de medallas Pokémon"></header><img class="stats-widget-img" src="'+stats+'" alt="Estadísticas públicas de GitHub: estrellas, commits, pull requests, issues y contribuciones del último año" loading="lazy"></article>'+
      '<article class="analytics-card languages-summary"><header class="analytics-card-head"><div><p class="eyebrow">CÓDIGO PÚBLICO</p><h3>Lenguajes más usados</h3></div><span class="pokeball-mark" aria-hidden="true"></span></header><img class="stats-widget-img" src="'+langs+'" alt="Distribución de lenguajes en repositorios públicos" loading="lazy"></article>'+
    '</div>'+
    '<article class="analytics-card streak-panel"><header class="analytics-card-head"><div><p class="eyebrow">CONSTANCIA · ÚLTIMO AÑO</p><h3>Racha de contribuciones</h3></div><span class="live-pill"><i></i>DATOS PÚBLICOS</span></header><img class="streak-widget-img" src="'+streak+'" alt="Contribuciones totales, racha actual y racha más larga" loading="lazy"><div class="heatmap-wrap"><p class="eyebrow">MAPA DE ACTIVIDAD · ÚLTIMOS 12 MESES</p><img class="heatmap-img" src="https://ghchart.rshah.org/d94343/'+user+'" alt="Mapa anual de contribuciones de GitHub" loading="lazy"></div></article>'+
    '<article class="analytics-card themed-medals"><header class="analytics-card-head"><div><p class="eyebrow">INSIGNIAS DE ENTRENADOR</p><h3>Medallas por actividad</h3></div><span class="pokeball-mark" aria-hidden="true"></span></header><p class="medal-intro">Cada medalla representa una señal real de tu actividad pública en GitHub.</p><div class="badge-metrics">'+
      [['Commits','commits'],['Pull requests','prs'],['Repos públicos','repos'],['Seguidores','followers'],['Estrellas','stars'],['Issues','issues'],['Lenguajes','languages'],['Aportes / año','year']].map((item,i)=>'<div class="badge-metric"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/'+(i+1)+'.png" alt="Medalla Pokémon '+(i+1)+'" loading="lazy"><span>'+item[0]+'</span><b id="metric-'+item[1]+'">…</b></div>').join('')+
    '</div><div class="trophy-shelf"><div class="trophy-title"><span>LOGROS VERIFICADOS</span><a href="https://github.com/'+user+'?tab=achievements">VER EN GITHUB ↗</a></div><a class="profile-trophy" href="https://github.com/'+user+'?tab=achievements"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medal-box.png" alt="Caja de medallas de Pokémon"><span><b>Pull Shark ×2</b><small>Dos pull requests aceptados</small></span></a><a class="profile-trophy" href="https://github.com/'+user+'?tab=achievements"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/medal-box.png" alt="Caja de medallas de Pokémon"><span><b>Quickdraw</b><small>Respuesta rápida en una discusión</small></span></a></div><p class="stats-source">Estadísticas públicas · pueden tardar en actualizarse · <a href="https://github.com/'+user+'">GitHub ↗</a></p></article>';
  const hidden=document.createElement('div');hidden.hidden=true;hidden.innerHTML='<span id="stats-state"></span><span id="stat-stars"></span><span id="stat-repos"></span><span id="stat-followers"></span><span id="stat-languages"></span>';layout.append(hidden);
  const set=(id,value)=>{const node=document.getElementById('metric-'+id);if(node)node.textContent=value};
  const api='https://api.github.com/users/'+user;
  Promise.allSettled([fetch(api).then(r=>r.json()),fetch(api+'/repos?per_page=100&sort=updated').then(r=>r.json()),fetch('https://api.github.com/search/commits?q=author:'+user+'&per_page=1',{headers:{Accept:'application/vnd.github+json'}}).then(r=>r.json()),fetch('https://api.github.com/search/issues?q=author:'+user+'+type:pr&per_page=1').then(r=>r.json()),fetch('https://api.github.com/search/issues?q=author:'+user+'+type:issue&per_page=1').then(r=>r.json())]).then(results=>{
    const [profile,repos,commits,prs,issues]=results.map(r=>r.status==='fulfilled'?r.value:null);
    if(profile&&profile.login){set('followers',profile.followers);document.getElementById('stat-followers').textContent=profile.followers}
    if(Array.isArray(repos)){const stars=repos.reduce((sum,r)=>sum+(r.stargazers_count||0),0);set('repos',profile?.public_repos??repos.length);set('stars',stars);document.getElementById('stat-stars').textContent=stars;const languages=[...new Set(repos.map(r=>r.language).filter(Boolean))];set('languages',languages.length);document.getElementById('stat-languages').textContent=languages.length}
    if(commits&&Number.isFinite(commits.total_count))set('commits',commits.total_count);
    if(prs&&Number.isFinite(prs.total_count))set('prs',prs.total_count);
    if(issues&&Number.isFinite(issues.total_count))set('issues',issues.total_count);
    set('year','↗');
  }).catch(()=>document.querySelectorAll('.badge-metric b').forEach(n=>{if(n.textContent==='…')n.textContent='↗'}));
  const gear=document.querySelector('.contact-gear');
  if(gear&&!gear.querySelector('.contact-badge'))gear.insertAdjacentHTML('beforeend','<img class="contact-badge badge-float-a" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/1.png" alt="Medalla Pokémon flotante"><img class="contact-badge badge-float-b" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/badges/8.png" alt="Medalla Pokémon flotante"><span class="contact-pixel-star pixel-star-a" aria-hidden="true">✦</span><span class="contact-pixel-star pixel-star-b" aria-hidden="true">✧</span><span class="contact-beam" aria-hidden="true"></span>');
})();

// The annual contribution total is already shown by the live stats card; keep the badge shelf to concrete profile metrics.
const annualBadge=document.getElementById('metric-year');if(annualBadge)annualBadge.closest('.badge-metric').remove();


// Use meaningful artwork for the analytics header and verified achievements.
const analyticsEmblem = document.querySelector('.analytics-emblem');
if (analyticsEmblem) {
  analyticsEmblem.src = 'assets/site/pokeball.svg';
  analyticsEmblem.alt = 'Poké Ball';
}
const achievementArt = [
  ['https://github.githubassets.com/images/modules/profile/achievements/pull-shark-default.png', 'Insignia Pull Shark de GitHub'],
  ['https://github.githubassets.com/images/modules/profile/achievements/quickdraw-default.png', 'Insignia Quickdraw de GitHub']
];
document.querySelectorAll('.profile-trophy img').forEach((image, index) => {
  if (!achievementArt[index]) return;
  image.src = achievementArt[index][0];
  image.alt = achievementArt[index][1];
});

// Keep the badge art crisp and remove the white circular backplates.
const badgeStyle = document.createElement('style');
badgeStyle.textContent = `.badge-metric:before{content:none!important;display:none!important}.badge-metric img{position:relative;z-index:1;width:48px;height:48px;object-fit:contain;border:0;border-radius:0;background:transparent;box-shadow:none;mix-blend-mode:normal;filter:drop-shadow(0 2px 2px #0008);image-rendering:pixelated}.analytics-emblem{object-fit:contain;filter:drop-shadow(0 2px 3px #0007)!important;mix-blend-mode:normal!important}.profile-trophy img{object-fit:contain;mix-blend-mode:normal;filter:drop-shadow(0 2px 3px #0007)!important}@media(max-width:600px){.badge-metric img{width:40px;height:40px}}`;
document.head.append(badgeStyle);


const badgeBlendStyle = document.createElement('style');
badgeBlendStyle.textContent = '.badge-metric img{mix-blend-mode:multiply!important;filter:contrast(1.08) saturate(1.08)!important}';
document.head.append(badgeBlendStyle);


const badgeBrightnessStyle = document.createElement('style');badgeBrightnessStyle.textContent = '.badge-metric img{filter:brightness(1.48) saturate(1.14)!important}';
document.head.append(badgeBrightnessStyle);
