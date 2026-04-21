const imagemHero    = document.getElementById('hero__bg');
const tituloHero    = document.getElementById('hero__title');
const badgeHero     = document.getElementById('hero__badge');
const descricaoHero = document.getElementById('hero__desc');
const miniCards     = document.querySelectorAll('.hero__mini-card');

const heros = [
  {
    titulo: "GTA 6",
    badge: "EM BREVE",
    desc: "O mundo aberto mais icônico dos games está de volta. Prepare-se para a maior aventura da história.",
    img: "../imgHero/gta6_capa.jpg",
    alt: "GTA 6"
  },
  {
    titulo: "Red Dead Redemption 2",
    badge: "CLÁSSICO",
    desc: "Uma história épica no velho oeste. Explore um mundo aberto cheio de vida e consequências.",
    img: "../imgHero/reddeadr2_capa.webp",
    alt: "Red Dead Redemption 2"
  },
  {
    titulo: "Mario Kart World",
    badge: "LANÇAMENTO",
    desc: "O kart mais famoso do mundo chega com novas pistas, novos personagens e muita diversão.",
    img: "../imgHero/mariokartworld_capa.jpg",
    alt: "Mario Kart World"
  },
  {
    titulo: "EA FC 22",
    badge: "MAIS VENDIDO",
    desc: "O futebol mais realista dos games. Jogue com os melhores clubes e jogadores do mundo.",
    img: "../imgHero/mbappefifa22_capa.webp",
    alt: "EA FC 22"
  },
  {
    titulo: "Need for Speed",
    badge: "PROMOÇÃO",
    desc: "Velocidade, adrenalina e perseguições épicas. O melhor jogo de corrida está com preço imperdível.",
    img: "../imgHero/needforspeedpb_capa.jpg",
    alt: "Need for Speed"
  }
];

let indiceAtual  = 0;
let intervaloAuto;

/* Animação */
imagemHero.style.transition    = 'opacity 0.6s ease'
tituloHero.style.transition    = 'opacity 0.6s ease'
badgeHero.style.transition     = 'opacity 0.6s ease'
descricaoHero.style.transition = 'opacity 0.6s ease'

function irParaHero(indice) {
/* FadeOut */
  imagemHero.style.opacity    = '0'
  tituloHero.style.opacity    = '0'
  badgeHero.style.opacity     = '0'
  descricaoHero.style.opacity = '0'

  setTimeout(() => {
    indiceAtual = indice

    const hero = heros[indiceAtual]

    imagemHero.src              = hero.img
    imagemHero.alt              = hero.alt
    tituloHero.textContent      = hero.titulo
    badgeHero.textContent       = hero.badge
    descricaoHero.textContent   = hero.desc

    miniCards.forEach((card, i) => {
      card.classList.toggle('hero__mini-card--active', i === indiceAtual)
    })

/* Fade In */
    imagemHero.style.opacity    = '1'
    tituloHero.style.opacity    = '1'
    badgeHero.style.opacity     = '1'
    descricaoHero.style.opacity = '1'
  }, 600)
}

function mudarHeroAuto() {
  irParaHero((indiceAtual + 1) % heros.length)
}

function iniciarIntervalo() {
  intervaloAuto = setInterval(mudarHeroAuto, 5000)
}

function reiniciarIntervalo() {
  cancelarIntervalo(intervaloAuto)
  iniciarIntervalo()
}

// ── Hover nos mini cards ────────────────────────────────────
miniCards.forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    irParaHero(i)
    reiniciarIntervalo() // evita troca automática logo após o hover
  })
})

// ── Inicia tudo ─────────────────────────────────────────────
iniciarIntervalo()

irParaHero(0)