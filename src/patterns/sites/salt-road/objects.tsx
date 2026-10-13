import type { ReactElement } from 'react'

/* Six objects drawn as SVG silhouettes with a little shading. Nothing here is a photograph; they stand in for one. */

export type Item = {
  n: number
  title: string
  maker: string
  dates: string
  medium: string
  size: string
  acc: string
  text: string
  guide: string
  credit: string
  draw: () => ReactElement
}

const shade = (id: string, a: string, b: string) => (
  <linearGradient id={id} x1="0" x2="1">
    <stop offset="0" stopColor={a} />
    <stop offset="0.55" stopColor={b} />
    <stop offset="1" stopColor={a} />
  </linearGradient>
)

export const ITEMS: Item[] = [
  {
    n: 1,
    title: 'Amphora with pointed foot',
    maker: 'Workshop on the south coast, unrecorded',
    dates: 'about 140 to 90 BCE',
    medium: 'Fired clay, traces of pitch lining',
    size: 'Height 71 cm',
    acc: 'SR.1984.12',
    text: 'Wine and fish sauce travelled in jars like this one, stacked in the holds of coastal ships. The pointed foot is not an error: it let the jar be wedged upright in sand or in a bed of other jars.',
    guide: 'Stop one. Run a thumb down the neck of this jar, in your mind. The two handles were made to be gripped with wet hands.',
    credit: 'Purchased with the help of the Friends of the Collection',
    draw: () => (
      <svg viewBox="0 0 240 320" role="img" aria-label="Tall clay jar with two handles and a pointed base">
        <defs>{shade('g1', '#a8693e', '#d09a68')}</defs>
        <path d="M95 30 h50 l-4 26 c38 12 58 52 50 100 c-8 48 -40 82 -71 130 c-31 -48 -63 -82 -71 -130 c-8 -48 12 -88 50 -100 z" fill="url(#g1)" stroke="#5c3a22" strokeWidth="2" />
        <path d="M92 38 c-30 4 -34 36 -10 48 M148 38 c30 4 34 36 10 48" fill="none" stroke="#5c3a22" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="120" cy="30" rx="26" ry="7" fill="#7b4a2b" stroke="#5c3a22" strokeWidth="2" />
        <path d="M70 130 c30 8 70 8 100 0 M64 160 c36 10 76 10 112 0" fill="none" stroke="#5c3a22" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
  },
  {
    n: 2,
    title: 'Pair of balance-pan weights',
    maker: 'Merchants of the river ports',
    dates: 'about 1200 to 1300',
    medium: 'Cast bronze with stamped marks',
    size: 'Largest 4.1 cm across',
    acc: 'SR.1991.3 a-f',
    text: 'A set of nested weights: place the smaller inside the larger and the whole fits in a pouch. Each carries a stamp that guaranteed its mass, because a trader who cheated on weight lost the right to trade.',
    guide: 'Stop two. Weights are the most honest objects in the collection. Each stamp is a promise.',
    credit: 'Bequest of a family of river merchants',
    draw: () => (
      <svg viewBox="0 0 240 320" role="img" aria-label="Three nested bronze weights">
        <defs>{shade('g2', '#6b5320', '#c9a24a')}</defs>
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${42 + i * 56} ${200 - i * 36})`}>
            <path d="M0 80 h56 l-8 -50 h-40 z" fill="url(#g2)" stroke="#3d2f0f" strokeWidth="2" transform={`scale(${1 - i * 0.12})`} />
            <ellipse cx="28" cy="30" rx={16 - i * 2} ry="6" fill="#3d2f0f" opacity="0.45" transform={`scale(${1 - i * 0.12})`} />
          </g>
        ))}
        <circle cx="70" cy="168" r="3" fill="#3d2f0f" />
      </svg>
    ),
  },
  {
    n: 3,
    title: 'Oil lamp with a pierced handle',
    maker: 'Unrecorded',
    dates: 'about 300 to 400',
    medium: 'Moulded clay, soot on the nozzle',
    size: 'Length 11 cm',
    acc: 'SR.1976.88',
    text: 'The soot on the nozzle is the most useful thing on this lamp. It shows that it was lit, and where: the burn pattern leans left, towards a door that was probably open.',
    guide: 'Stop three. The pierced handle is a loop for a finger, or for a cord to hang it from the beam of a ship.',
    credit: 'Gift of an anonymous donor',
    draw: () => (
      <svg viewBox="0 0 240 320" role="img" aria-label="Small clay oil lamp with a handle ring">
        <defs>{shade('g3', '#8a5a36', '#c9936a')}</defs>
        <path d="M40 190 c0 -34 40 -50 90 -50 c40 0 66 12 80 30 l-14 12 c-10 -8 -22 -10 -34 -10 c-20 30 -70 52 -122 18 z" fill="url(#g3)" stroke="#4a2d17" strokeWidth="2" />
        <circle cx="200" cy="166" r="13" fill="none" stroke="#4a2d17" strokeWidth="6" />
        <ellipse cx="120" cy="158" rx="22" ry="6" fill="#4a2d17" opacity="0.55" />
        <path d="M44 184 l-16 -10" stroke="#2a2a28" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
  },
  {
    n: 4,
    title: 'Comb of boxwood',
    maker: 'Unrecorded',
    dates: 'about 1450',
    medium: 'Carved boxwood',
    size: 'Width 9.4 cm',
    acc: 'SR.2003.41',
    text: 'Two sets of teeth: coarse on one side, fine on the other. Worn smooth at the spine by a thumb, and chipped at one end where it was dropped on a stone floor and kept anyway.',
    guide: 'Stop four. This comb was repaired, not replaced. That tells you what it was worth to its owner.',
    credit: 'Acquired with the support of the Heritage Fund',
    draw: () => (
      <svg viewBox="0 0 240 320" role="img" aria-label="Boxwood comb with two rows of teeth">
        <defs>{shade('g4', '#b58b4e', '#e1c18a')}</defs>
        <rect x="40" y="130" width="160" height="38" rx="8" fill="url(#g4)" stroke="#6b4a1d" strokeWidth="2" />
        {Array.from({ length: 16 }, (_, i) => <rect key={'a' + i} x={46 + i * 9.6} y="168" width="5" height={34 - (i % 3)} rx="2" fill="url(#g4)" stroke="#6b4a1d" strokeWidth="1" />)}
        {Array.from({ length: 22 }, (_, i) => <rect key={'b' + i} x={46 + i * 6.9} y="104" width="3" height="28" rx="1.5" fill="url(#g4)" stroke="#6b4a1d" strokeWidth="0.8" />)}
        <circle cx="120" cy="149" r="6" fill="none" stroke="#6b4a1d" strokeWidth="2" />
      </svg>
    ),
  },
  {
    n: 5,
    title: 'Chest key with a bit of three wards',
    maker: 'Locksmith of the port guild',
    dates: 'about 1580',
    medium: 'Wrought iron',
    size: 'Length 14.2 cm',
    acc: 'SR.1968.7',
    text: 'The key to a merchant’s chest, found in a drain below the quay. It opens a lock that no longer exists. The three notches in the bit are the only part of the lock still in the world.',
    guide: 'Stop five. Look at the bow, the loop at the top. It is worn on one side, where a thumb pressed every day.',
    credit: 'Found during dredging, donated by the harbour company',
    draw: () => (
      <svg viewBox="0 0 240 320" role="img" aria-label="Iron key with a round bow and a toothed bit">
        <defs>{shade('g5', '#2f3338', '#6a7077')}</defs>
        <circle cx="120" cy="82" r="30" fill="none" stroke="url(#g5)" strokeWidth="14" />
        <rect x="112" y="108" width="16" height="140" rx="4" fill="url(#g5)" stroke="#17191c" strokeWidth="2" />
        <path d="M128 214 h30 v14 h-12 v10 h12 v14 h-30 z" fill="url(#g5)" stroke="#17191c" strokeWidth="2" />
        <rect x="104" y="136" width="32" height="8" rx="3" fill="url(#g5)" stroke="#17191c" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    n: 6,
    title: 'Salt cellar of green glaze',
    maker: 'Potters of the northern coast',
    dates: 'about 1650',
    medium: 'Glazed earthenware',
    size: 'Height 8.7 cm',
    acc: 'SR.2011.19',
    text: 'The exhibition ends with the thing it began with. Salt was the reason for the road, and this small green dish is where it ended up, on a table, in a hand, in a meal.',
    guide: 'Stop six. Last stop. The glaze has crazed into a net of fine lines. Salt does that to anything it touches for long enough.',
    credit: 'Gift in memory of a fishing family',
    draw: () => (
      <svg viewBox="0 0 240 320" role="img" aria-label="Small green glazed dish on a short foot">
        <defs>{shade('g6', '#2f6b4f', '#5ea683')}</defs>
        <path d="M50 170 c0 60 40 70 70 70 s70 -10 70 -70 z" fill="url(#g6)" stroke="#173a2a" strokeWidth="2" />
        <ellipse cx="120" cy="170" rx="70" ry="14" fill="#173a2a" opacity="0.6" />
        <ellipse cx="120" cy="170" rx="58" ry="9" fill="#e8e4d8" />
        <rect x="92" y="236" width="56" height="12" rx="4" fill="url(#g6)" stroke="#173a2a" strokeWidth="2" />
        <path d="M70 190 l16 20 M150 186 l-10 24 M110 196 l4 26" stroke="#173a2a" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
]
