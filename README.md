# FluentU Clone — Master Architecture Context

## Objetivo do Projeto

Criar uma plataforma frontend inspirada no FluentU utilizando:

- HTML
- CSS modular
- JavaScript puro
- JSON
- Arquitetura componentizada
- Media-driven UI
- Transcript engine
- Vocabulary engine

O projeto foi desenvolvido passo a passo para aprendizado profissional de frontend moderno.

---

# Filosofia do Projeto

## NÃO reinventar layout

Objetivo:

- preservar visual do FluentU
- preservar UX
- preservar navegação
- preservar comportamento visual

Mas:

- reorganizar arquitetura
- modularizar
- limpar código
- preparar para escala futura

---

# Estrutura Atual do Projeto

```txt
project/
│
├── index.html
│
├── assets/
│   │
│   ├── css/
│   │   ├── style.css
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── sidebar.css
│   │   ├── topbar.css
│   │   └── cards.css
│   │
│   ├── js/
│   │   └── main.js
│   │
│   ├── data/
│   │   ├── videos.json
│   │   ├── vocabulary.json
│   │   └── subtitles/
│   │       └── friends.json
│   │
│   ├── images/
│   │   └── thumbnails/
│   │
│   └── videos/
│
└── pages/
```

---

# Arquitetura CSS

## style.css

Arquivo central.

Responsável apenas pelos imports:

```css
@import url('./base.css');
@import url('./layout.css');
@import url('./sidebar.css');
@import url('./topbar.css');
@import url('./cards.css');
```

---

## base.css

Responsável por:

- reset CSS
- font-family
- cores globais
- box-sizing

---

## layout.css

Responsável por:

- .app
- .main-content
- .content
- estrutura geral
- widths
- overflow
- layout principal

---

## sidebar.css

Responsável por:

- sidebar fixa
- menu
- logo
- menu-item
- estados hover
- active menu

---

## topbar.css

Responsável por:

- topbar
- search-area
- avatar
- upgrade-button
- input search

---

## cards.css

Responsável por:

- video cards
- categories
- thumbnails
- hover preview
- modal
- transcript
- vocabulary popup
- subtitles

---

# Estrutura JavaScript

## main.js

Responsável por:

- renderização dinâmica
- busca
- hover preview
- modal
- subtitles
- transcript
- vocabulary popup
- sync engine
- replay engine

---

# Variáveis Globais

```js
let allData = {};
let currentSubtitles = [];
let vocabularyData = {};
```

---

# Sistema de Dados

## videos.json

Responsável por catálogo.

Cada vídeo possui:

```json
{
  "title": "",
  "level": "",
  "words": 0,
  "duration": "",
  "image": "",
  "video": "",
  "subtitles": ""
}
```

---

## vocabulary.json

Responsável pelo mini dicionário.

Estrutura:

```json
{
  "word": {
    "translation": "",
    "ipa": "",
    "definition": ""
  }
}
```

---

## subtitles/*.json

Responsável pelas subtitles.

Estrutura:

```json
[
  {
    "start": 0,
    "end": 3,
    "text": "Hello world"
  }
]
```

---

# Funcionalidades Implementadas

# 1. Layout Base

Implementado:

- sidebar fixa
- topbar
- área principal
- categories
- scroll horizontal
- cards

---

# 2. Sistema de Cards Dinâmicos

Implementado:

- renderização JS
- renderVideos()
- createVideoCard()
- cards via JSON

---

# 3. Sistema de Busca

Implementado:

- searchInput
- filter()
- renderização dinâmica
- atualização automática

Importante:

Sempre que renderVideos() executa:

```js
setupPreviewVideos();
setupVideoClicks();
```

precisam ser reexecutados.

Conceito:

- rebind events
- DOM recreation

---

# 4. Hover Preview System

Implementado:

- preview-video
- autoplay muted
- mouseenter
- mouseleave
- reset currentTime

Importante:

```css
pointer-events: none;
```

no preview-video.

---

# 5. Modal Player

Implementado:

- video modal
- overlay
- autoplay
- controls
- close button
- click outside close

Funções:

```js
openModal(video)
closeModal()
```

---

# 6. Local Media System

Implementado:

## Vídeos locais

```txt
assets/videos/
```

## Imagens locais

```txt
assets/images/thumbnails/
```

---

# 7. Transcript Engine

Implementado:

- transcript render
- subtitles dinâmicas
- scroll transcript
- subtitle-line

Função principal:

```js
loadSubtitles(video)
```

---

# 8. Subtitle Sync Engine

Implementado:

- timeupdate
- currentTime
- subtitle ativa
- auto scroll
- highlight active

Função:

```js
setupSubtitleSync()
```

---

# 9. Segment Replay System

Implementado:

- replay da frase
- stop automático
- jump to subtitle
- segment playback

Conceito:

- media engineering
- playback control

---

# 10. Vocabulary System

Implementado:

- split words
- spans individuais
- click words
- vocabulary lookup
- popup
- IPA
- translation
- definition

Função:

```js
openVocabularyPopup(word)
```

---

# 11. Popup Management

Implementado:

- open popup
- close popup
- click outside
- invalid word close
- modal close cleanup

Função:

```js
closeVocabularyPopup()
```

---

# 12. Word Cleaning Engine

Implementado:

```js
.trim()
.toLowerCase()
.replace(/[^a-zA-Z']/g, '')
```

Conceito:

- text normalization
- NLP preprocessing
- subtitle cleaning

---

# Conceitos Frontend Aprendidos

## DOM Lifecycle

Elementos criados via:

```js
innerHTML
```

precisam:

- rebind events
- render antes dos listeners

---

## Event Architecture

Utilizado:

```js
addEventListener()
```

Nunca usar:

```html
onclick=""
```

---

## Media-driven UI

O vídeo controla:

- transcript
- active states
- replay
- sync

---

## State Management

Estados controlados:

- modal active
- popup active
- current subtitles
- vocabulary loaded
- video currentTime

---

# Fluxo Geral da Aplicação

```txt
JSON
↓
loadVideos()
↓
renderVideos()
↓
setup events
↓
click video
↓
openModal()
↓
loadSubtitles()
↓
setup sync
↓
interactive transcript
↓
vocabulary popup
```

---

# Bugs Resolvidos Durante Desenvolvimento

## Layout

- sidebar overlap
- flex overflow
- video row escaping
- section closing incorrectly

---

## Events

- lost events after render
- hover blocking clicks
- popup persistent state
- dynamic DOM events

---

## Vocabulary

- invalid word cleanup
- punctuation issues
- lowercase mismatch
- hidden whitespace

---

# Tecnologias Utilizadas

## Frontend

- HTML5
- CSS3
- JavaScript ES6+

---

## Media

- HTML5 Video API
- timeupdate
- currentTime
- autoplay
- pause/play

---

## Estrutura

- JSON driven UI
- modular CSS
- dynamic rendering

---

# Estado Atual do Projeto

O projeto atualmente já possui:

✅ arquitetura organizada
✅ frontend modular
✅ catálogo dinâmico
✅ busca
✅ preview estilo Netflix
✅ modal player
✅ transcript
✅ subtitle sync
✅ replay engine
✅ vocabulary popup
✅ media synchronization

---

# Próximas Implementações Planejadas

# 1. Word Replay

Ao clicar palavra:

- replay da frase
- highlight contextual
- learning context

---

# 2. Save Vocabulary

Implementar:

- save word
- my vocabulary
- favorites
- revisão futura

---

# 3. localStorage

Persistência:

- progresso
- palavras salvas
- histórico

---

# 4. Progress System

Implementar:

- vídeos assistidos
- percentual
- histórico
- continue watching

---

# 5. Advanced Player

Implementar:

- speed control
- keyboard shortcuts
- fullscreen custom
- mini player
- next subtitle

---

# 6. Subtitle Timeline

Implementar:

- visual timeline
- subtitle markers
- clickable timeline

---

# 7. Vocabulary Analytics

Implementar:

- most frequent words
- learned words
- review system
- statistics

---

# 8. Flashcard System

Implementar:

- spaced repetition
- automatic flashcards
- review queue

---

# 9. Subtitle Import Engine

Importar:

- .srt
- .vtt
- YouTube captions

---

# 10. Backend Future

Futuro:

- Django
- database
- login
- online sync
- API

---

# 11. React Migration

Arquitetura já preparada para:

- React
- Vite
- SPA
- components
- state management

---

# Nível Atual do Projeto

O projeto já deixou de ser:

```txt
HTML/CSS básico
```

E virou:

```txt
Frontend Media Application
```

com:

- transcript engine
- media sync
- vocabulary engine
- dynamic rendering
- interactive learning system
- media-driven UI

Arquitetura próxima de:

- FluentU
- Language Reactor
- Netflix Learning
- LMS modernos

