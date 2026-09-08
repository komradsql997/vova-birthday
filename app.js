const TEST_MODE = true; // Временная тестовая кнопка для перехода без сборки пазла. Перед продом поменять на false.

const FRAMES = [
  {
    id: 1,
    image: 'assets/photos/frame-1.webp',
    orientation: 'portrait',
    lyric: '«I wanna be defined by the things that I love». — Lover',
    messages: [
      {
        text: '«Вова, ты каждый раз поражаешь меня своей любовью к миру, умением замечать красоту вокруг и заботиться о своём саде, и о своем ментальном здоровье) Вдохновляешь своими историями на пабе на эту жизнь)\n\nА еще спасибо за твое креативное чутьё: твои идеи всегда появляются ровно там и тогда, где они нужны)\n\nСпасибо тебе за поддержку, насмотренность и за то, что с тобой любые проекты становятся лучше. Ты правда бести! ❤️»',
        author: 'Аня Новикова'
      }
    ]
  },
  {
    id: 2,
    image: 'assets/photos/frame-2.webp',
    orientation: 'portrait',
    lyric: '“I can go anywhere I want.” — the 1',
    messages: [
      { text: '«Вова — один из самых интересных людей, которых я когда-либо встречала! Рассказы про таро, цветочки — Вову можно слушать вечно»', author: 'Снежа' },
      { text: '«Я считаю, что Вова — офигенный профи с классным вкусом в контенте, эмпатичный и добрый»', author: 'Юля Егорова' }
    ]
  },
  {
    id: 3,
    image: 'assets/photos/frame-3.webp',
    orientation: 'portrait',
    lyric: '“I can go anywhere I want.” — the 1',
    messages: [
      { text: '«Вова не только гуру текстов и креативов, но и человек, который всегда несёт вайб и настроение!\n\nПс: поняла, что попала в нужную команду, когда услышала этот сладкий мат!»', author: 'Маша' }
    ]
  },
  {
    id: 4,
    image: 'assets/photos/frame-4.webp',
    orientation: 'portrait',
    lyric: '“Take the moment and taste it.” — You’re On Your Own, Kid',
    messages: [
      { text: '«Пусть у тебя всегда будет столько идей, сколько растений в твоем саду! И обязательно долларовое дерево»', author: 'команда Сетки' }
    ]
  },
  {
    id: 5,
    image: 'assets/photos/frame-5.webp',
    orientation: 'portrait',
    lyric: '“Long live the magic we made.” — Long Live',
    messages: [
      { text: '«Спасибо Вове за удивительный талант одновременно вести созвон, придумывать классные идеи и опрыскивать цветочки. Так выглядит человек, который умеет делиться добром со всеми»', author: 'Саша' }
    ]
  },
  {
    id: 6,
    image: 'assets/photos/frame-6.webp',
    orientation: 'portrait',
    lyric: '“I had the time of my life fighting dragons with you.” — Long Live',
    messages: [
      { text: '«Вова, ты мой бести примерно с первой встречи в зуме. заботливый друг, внимательный и справедливый руководитель. рядом с тобой я чувствую себя цветочком, который поставили на правильный подоконник: и света хватает, и хочется расти»', author: 'Арина' }
    ]
  },
  {
    id: 7,
    image: 'assets/photos/frame-7.webp',
    orientation: 'landscape',
    lyric: '“Please don’t ever become a stranger.” — New Year’s Day',
    messages: [
      { text: '«с тобой моя душа поет»', author: 'Иришкинс' }
    ]
  },
  {
    id: 8,
    image: 'assets/photos/frame-8.webp',
    orientation: 'landscape',
    lyric: '“Hold on to the memories, they will hold on to you.” — New Year’s Day',
    messages: [
      { text: 'Уважаемый и дорогой Вова! Желаю тебе всегда нести в себе эту искру задора и хранить пламя любви к окружающим. Ты прекрасный человек и пусть таким и остаешься во веки веков! ❤️ Ну и конечно желаю крепкого и качественного сна, все остальное приложится само собой 🤗', author: 'Ваш Ярик!' },
      { text: 'дорогой! пусть у тебя будет все самое дорогое и богатое, но для тебя это будет простым в получении. пусть тебя окружает самый лучший свет, чтобы и фото получались и лучезарные идеи проходили. будь богаче во всем. обнимаю!', author: 'Игорь' }
    ]
  }
];

const EXTRA_VISUALS = [
  'assets/visuals/extra-camera.png',
  'assets/visuals/extra-cake.png',
  'assets/visuals/extra-cat-1.png',
  'assets/visuals/extra-cat-2.png'
];

const STORY_DECOR_SLOTS = [
  { side: 'left', top: 10, r: -8 },
  { side: 'left', top: 67, r: 6 },
  { side: 'right', top: 12, r: 7 },
  { side: 'right', top: 68, r: -6 }
];

const app = document.getElementById('app');
const screen = document.getElementById('screen');
const counter = document.getElementById('frameCounter');
const archiveMark = document.getElementById('archiveMark');
const decorLayer = document.getElementById('decorLayer');
let current = -1;
let draggedTile = null;
let solvedCount = 0;
let currentLayout = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setDecor(mode = 'story') {
  decorLayer.innerHTML = '';
  if (mode !== 'story') return;

  const visuals = shuffle(EXTRA_VISUALS);
  STORY_DECOR_SLOTS.forEach((slot, i) => {
    const img = document.createElement('img');
    img.className = `decor decor-${slot.side}`;
    img.src = visuals[i];
    img.alt = '';
    img.style.top = slot.top + '%';
    img.style.transform = `rotate(${slot.r + Math.floor(Math.random() * 5 - 2)}deg)`;
    decorLayer.appendChild(img);
  });
}

function coverVisualsHtml() {
  return shuffle(EXTRA_VISUALS).map((src, i) =>
    `<img class="cover-extra cover-extra-${i + 1}" src="${src}" alt="" />`
  ).join('');
}

function showCover() {
  current = -1;
  counter.textContent = '';
  archiveMark.style.opacity = '0';
  setDecor('cover');
  screen.innerHTML = `
    <div class="cover">
      <div class="cover-copy">
        <h1>VOVA'S<br>PHOTO<br>ARCHIVE <span class="scribble">Birthday photo puzzle</span></h1>
        <p class="cover-subtitle">Некоторые фотографии стоят того, чтобы собрать их заново. Восстанови архив — и открой сообщения от команды.</p>
      </div>

      <div class="cover-center">
        <p class="cover-teamline">Вове от команды Сетки</p>
        <div class="cover-art">
          <div class="cover-photo-frame">
            <img class="cover-photo" src="assets/photos/frame-0.webp" alt="Вова" />
          </div>
          ${coverVisualsHtml()}
          <span class="cover-confetti confetti-a">✦</span>
          <span class="cover-confetti confetti-b">♡</span>
          <span class="cover-confetti confetti-c">✷</span>
        </div>
        <button class="start-button" id="startButton">НАЧАТЬ →</button>
      </div>

      <div class="cover-note">
        <strong>8 photos<br>8 stories<br>1 very good birthday</strong>
        Нажми «Начать», чтобы увидеть магию
      </div>
    </div>`;
  document.getElementById('startButton').addEventListener('click', () => showFrame(0));
}

function getPuzzleLayout(frame) {
  const portrait = frame.orientation === 'portrait';
  const cols = portrait ? 3 : 4;
  const rows = portrait ? 4 : 3;
  const viewportH = Math.max(680, window.innerHeight);
  const available = viewportH - 210;
  let tile;
  if (portrait) tile = Math.max(82, Math.min(116, Math.floor(available / 4.25)));
  else tile = Math.max(88, Math.min(122, Math.floor(available / 4.05)));
  return { cols, rows, tile, boardW: cols*tile, boardH: rows*tile };
}

function showFrame(index) {
  current = index;
  const frame = FRAMES[index];
  archiveMark.style.opacity = '1';
  counter.textContent = `${String(index+1).padStart(2,'0')} / ${String(FRAMES.length).padStart(2,'0')}`;
  setDecor('story');
  currentLayout = getPuzzleLayout(frame);
  const { cols, rows, tile, boardW, boardH } = currentLayout;
  solvedCount = 0;

  const messagesHtml = frame.messages.map(m => `
    <div class="message-card">
      <p class="message-text">${escapeHtml(m.text).replace(/\n/g,'<br>')}</p>
      ${m.author ? `<span class="message-author">— ${escapeHtml(m.author)}</span>` : ''}
    </div>`).join('');

  screen.innerHTML = `
    <div class="story-screen">
      <div class="puzzle-side">
        <div class="puzzle-wrap" style="--tile:${tile}px">
          <div class="board-column">
            <p class="board-kicker">restore the photo</p>
            <div class="board" id="board" style="width:${boardW}px;height:${boardH}px;grid-template-columns:repeat(${cols},${tile}px);grid-template-rows:repeat(${rows},${tile}px)"></div>
            <div class="board-foot"><span>drag pieces here</span><span id="progress">0 / ${cols*rows}</span></div>
          </div>
          <div class="tray-column">
            <p class="tray-kicker">pieces</p>
            <div class="tray" id="tray"></div>
          </div>
        </div>
      </div>
      <aside class="story-panel">
        <div class="story-meta">FRAME ${String(frame.id).padStart(2,'0')} · PHOTO ARCHIVE</div>
        <div class="lyric-label">soundtrack note ↘</div>
        <p class="lyric">${escapeHtml(frame.lyric)}</p>
        ${TEST_MODE ? `<button class="test-next-button" id="testNextButton">ДАЛЬШЕ БЕЗ СБОРКИ →</button>` : ''}
        <div class="reveal" id="reveal">
          <div class="reveal-rule"></div>
          <p class="reveal-title">Что о тебе говорят коллеги</p>
          ${messagesHtml}
          <button class="next-button" id="nextButton">${index === FRAMES.length-1 ? 'ФИНАЛ →' : 'NEXT →'}</button>
        </div>
      </aside>
    </div>`;

  buildPuzzle(frame, currentLayout);
  document.getElementById('nextButton').addEventListener('click', () => {
    if (current < FRAMES.length - 1) showFrame(current + 1);
    else showFinal();
  });

  if (TEST_MODE) {
    document.getElementById('testNextButton').addEventListener('click', () => {
      if (current < FRAMES.length - 1) showFrame(current + 1);
      else showFinal();
    });
  }
}

function buildPuzzle(frame, layout) {
  const board = document.getElementById('board');
  const tray = document.getElementById('tray');
  const total = layout.cols * layout.rows;

  for (let i=0; i<total; i++) {
    const cell = document.createElement('div');
    cell.className = 'board-cell';
    cell.dataset.index = i;
    cell.addEventListener('dragover', e => { e.preventDefault(); cell.classList.add('drop-hover'); });
    cell.addEventListener('dragleave', () => cell.classList.remove('drop-hover'));
    cell.addEventListener('drop', e => handleDrop(e, cell, total));
    board.appendChild(cell);
  }

  const order = shuffle([...Array(total).keys()]);
  order.forEach(idx => {
    const slot = document.createElement('div');
    slot.className = 'tray-slot';
    const tileEl = createTile(idx, frame, layout);
    slot.appendChild(tileEl);
    tray.appendChild(slot);
  });
}

function createTile(index, frame, layout) {
  const col = index % layout.cols;
  const row = Math.floor(index / layout.cols);
  const tileEl = document.createElement('div');
  tileEl.className = 'tile';
  tileEl.draggable = true;
  tileEl.dataset.index = index;
  tileEl.innerHTML = `<img src="${frame.image}" alt="" draggable="false" style="width:${layout.boardW}px;height:${layout.boardH}px;left:${-col*layout.tile}px;top:${-row*layout.tile}px">`;
  tileEl.addEventListener('dragstart', e => {
    draggedTile = tileEl;
    tileEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  });
  tileEl.addEventListener('dragend', () => {
    tileEl.classList.remove('dragging');
    draggedTile = null;
    document.querySelectorAll('.drop-hover').forEach(el => el.classList.remove('drop-hover'));
  });
  return tileEl;
}

function handleDrop(e, cell, total) {
  e.preventDefault();
  cell.classList.remove('drop-hover');
  if (!draggedTile || cell.children.length) return;
  const tileIndex = Number(draggedTile.dataset.index);
  const cellIndex = Number(cell.dataset.index);
  if (tileIndex !== cellIndex) {
    cell.classList.remove('wrong');
    void cell.offsetWidth;
    cell.classList.add('wrong');
    return;
  }
  draggedTile.classList.remove('dragging');
  draggedTile.classList.add('locked');
  draggedTile.draggable = false;
  cell.appendChild(draggedTile);
  solvedCount += 1;
  document.getElementById('progress').textContent = `${solvedCount} / ${total}`;
  if (solvedCount === total) completePuzzle();
}

function completePuzzle() {
  const board = document.getElementById('board');
  board.classList.add('solved');
  document.getElementById('reveal').classList.add('visible');
  const testNextButton = document.getElementById('testNextButton');
  if (testNextButton) testNextButton.style.display = 'none';
  document.querySelector('.tray-column').style.opacity = '.18';
  document.querySelector('.tray-column').style.transition = 'opacity .5s ease';
  setTimeout(() => {
    document.querySelectorAll('.board-cell').forEach(c => c.style.borderColor = 'transparent');
  }, 180);
}

function showFinal() {
  current = FRAMES.length;
  counter.textContent = 'ARCHIVE RESTORED';
  archiveMark.style.opacity = '1';
  setDecor('cover');
  screen.innerHTML = `
    <div class="final-screen">
      <div class="final-inner">
        <div class="final-kicker">8 / 8 · archive restored</div>
        <h2>Вова,<br>с днём рождения!<span>better together ♡</span></h2>
        <button class="restart-button" id="restartButton">СОБРАТЬ ЕЩЁ РАЗ ↺</button>
      </div>
      ${Array.from({length:16},(_,i)=>`<i class="confetti" style="left:${4+(i*6)%93}%;top:${8+(i*13)%78}%;transform:rotate(${i*23}deg);animation-delay:${(i%6)*.22}s"></i>`).join('')}
    </div>`;
  document.getElementById('restartButton').addEventListener('click', showCover);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
}

window.addEventListener('resize', () => {
  if (current >= 0 && current < FRAMES.length) showFrame(current);
});

showCover();
