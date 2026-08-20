// Shed drawing kit: the icon, the sample drive and the disk map every mockup shares.
// Runs as a classic script in pages and through import() in Node, so it only touches globalThis.
(function (g) {
  const paint = (id, stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) =>
    `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;

  function tilePath(cx = 512, cy = 512, half = 448, n = 5) {
    const pts = [];
    for (let i = 0; i < 240; i++) {
      const t = (i / 240) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
      pts.push(`${(cx + half * Math.sign(c) * Math.abs(c) ** (2 / n)).toFixed(1)} ${(cy + half * Math.sign(s) * Math.abs(s) ** (2 / n)).toFixed(1)}`);
    }
    return `M ${pts.join(' L ')} Z`;
  }

  // The mark: a disk map where the bright block is space you got back.
  function iconSVG({ small = false, uid = 'i', size = 1024 } = {}) {
    const T = tilePath();
    const defs = `<defs>${paint(`${uid}tile`, [[0, '#2c2c2e'], [1, '#0a0a0b']])}${paint(`${uid}rim`, [[0, '#fff', 0.34], [0.4, '#fff', 0.06], [1, '#fff', 0.12]])}
      ${paint(`${uid}free`, [[0, '#f1d9ff'], [0.5, '#c58cff'], [1, '#8a4dff']], 0, 0, 1, 1)}
      ${paint(`${uid}b1`, [[0, '#636366'], [1, '#48484a']])}${paint(`${uid}b2`, [[0, '#55555a'], [1, '#3a3a3c']])}
      <filter id="${uid}sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity=".3"/></filter>
      <filter id="${uid}gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter></defs>`;
    const tile = `<g ${small ? '' : `filter="url(#${uid}sh)"`}><path d="${T}" fill="url(#${uid}tile)"/></g>`;
    const edge = small ? '' : `<path d="${T}" fill="none" stroke="url(#${uid}rim)" stroke-width="3"/>`;
    const r = small ? 40 : 30, gap = small ? 40 : 28, X = 214, Y = 214, W = 596;
    const a = 330, b = W - a - gap, c = 250, h = (W - c - 2 * gap) / 2;
    const art = (small ? '' : `<rect x="${X}" y="${Y}" width="${a}" height="${W}" rx="${r}" fill="url(#${uid}free)" filter="url(#${uid}gl)" opacity=".55"/>`) +
      `<rect x="${X}" y="${Y}" width="${a}" height="${W}" rx="${r}" fill="url(#${uid}free)"/>
      <rect x="${X + a + gap}" y="${Y}" width="${b}" height="${c}" rx="${r}" fill="url(#${uid}b1)"/>
      <rect x="${X + a + gap}" y="${Y + c + gap}" width="${b}" height="${h}" rx="${r}" fill="url(#${uid}b2)"/>` +
      (small ? `<rect x="${X + a + gap}" y="${Y + c + 2 * gap + h}" width="${b}" height="${h}" rx="${r}" fill="url(#${uid}b1)"/>` :
        `<rect x="${X + a + gap}" y="${Y + c + 2 * gap + h}" width="${(b - gap) / 2}" height="${h}" rx="${r}" fill="url(#${uid}b1)"/>
      <rect x="${X + a + 2 * gap + (b - gap) / 2}" y="${Y + c + 2 * gap + h}" width="${(b - gap) / 2}" height="${h}" rx="${r}" fill="url(#${uid}b2)"/>`);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${size}" height="${size}">${defs}${tile}${art}${edge}</svg>`;
  }
  const mark = (uid, size = 24) => iconSVG({ small: true, uid, size });

  // A 1 TB gaming and dev PC, sample data. Sizes in GB. grew = GB added since the last scan.
  // kind: rebuilds (a cache the app makes again), safe (leftovers nothing needs), yours (things you made), keep (not junk).
  const DRIVE = { letter: 'C:', total: 931, last: 'Tuesday' };
  const ITEMS = [
    { id: 'steam', name: 'Steam games', group: 'games', size: 340, kind: 'keep' },
    { id: 'docker', name: 'Docker disk', path: '…\\Docker\\wsl\\disk\\docker_data.vhdx', group: 'dev', size: 96, grew: 21.3, kind: 'safe', after: 37.6, shed: true,
      what: 'The virtual disk Docker keeps its images and containers in. It grows as you build and never shrinks on its own, even after you prune.',
      gone: 'Nothing. Shed compacts it. Your images and containers stay.', how: 'Compact' },
    { id: 'apps', name: 'Installed apps', group: 'apps', size: 96, kind: 'keep' },
    { id: 'photos', name: 'Photos and videos', group: 'yours', size: 74, kind: 'keep' },
    { id: 'other', name: 'Everything else', group: 'apps', size: 58, kind: 'keep' },
    { id: 'windows', name: 'Windows', group: 'windows', size: 41, kind: 'keep' },
    { id: 'ollama', name: 'Ollama models', path: '%USERPROFILE%\\.ollama\\models', group: 'dev', size: 33.7, kind: 'yours',
      what: 'Local AI models you pulled. Five are here, and two haven\'t run in three months.', gone: 'You pull them again if you need them.' },
    { id: 'iphone', name: 'iPhone backups', path: '…\\Apple\\MobileSync\\Backup', group: 'yours', size: 31.4, kind: 'yours',
      what: 'Two full backups of an iPhone. The newest is from June.', gone: 'Shed holds them for 7 days, then they\'re gone for good.' },
    { id: 'downloads', name: 'Downloads', group: 'yours', size: 26.2, grew: 0.8, kind: 'yours' },
    { id: 'winold', name: 'Windows.old', path: 'C:\\Windows.old', group: 'windows', size: 24.1, kind: 'safe',
      what: 'Your previous Windows, kept after the last big update so you can go back.', gone: 'You can\'t roll back that update anymore.' },
    { id: 'shader', name: 'Steam shader caches', path: '…\\Steam\\steamapps\\shadercache', group: 'games', size: 22.4, grew: 6.1, kind: 'rebuilds', shed: true,
      what: 'Precompiled shaders for 31 games, listed by game name instead of the app ID folders Steam uses.', gone: 'Each game rebuilds its cache the next time it starts. The first minutes can stutter.' },
    { id: 'target', name: 'Rust target folders', path: '9 projects in D:\\code', group: 'dev', size: 18.2, grew: 3.7, kind: 'rebuilds', shed: true,
      what: 'Build output from 9 Rust projects. Projects you opened this week are skipped.', gone: 'The next cargo build takes longer.' },
    { id: 'hiber', name: 'Hibernation file', path: 'C:\\hiberfil.sys', group: 'windows', size: 12, kind: 'safe',
      what: 'Windows writes your RAM here so it can hibernate. It\'s three quarters of your RAM.', gone: 'Hibernate leaves the power menu. Sleep still works.' },
    { id: 'nodem', name: 'node_modules', path: '14 projects untouched for 90 days', group: 'dev', size: 11.6, kind: 'rebuilds',
      what: 'Packages for 14 JavaScript projects you haven\'t touched in 90 days.', gone: 'Run npm install when you open one again.' },
    { id: 'nvidia', name: 'NVIDIA shader cache', path: '%LOCALAPPDATA%\\NVIDIA\\DXCache', group: 'games', size: 9.8, grew: 2.4, kind: 'rebuilds', shed: true,
      what: 'Shaders your graphics driver compiled for games.', gone: 'Games rebuild it as they run.' },
    { id: 'partial', name: 'Unfinished model downloads', path: '…\\.ollama\\models\\blobs', group: 'dev', size: 7.3, grew: 7.3, kind: 'safe', shed: true,
      what: 'Parts of a model download that stopped halfway on Saturday. No model uses them.', gone: 'Nothing.' },
    { id: 'wu', name: 'Windows Update cache', group: 'windows', size: 4.3, grew: 2.1, kind: 'rebuilds',
      what: 'Update files Windows already installed, and copies it shares with other PCs.', gone: 'Nothing. Windows downloads what it needs next time.' },
    { id: 'browser', name: 'Browser caches', group: 'apps', size: 3.6, kind: 'rebuilds' },
    { id: 'drivers', name: 'Old NVIDIA installers', path: 'C:\\ProgramData\\NVIDIA Corporation\\Downloader', group: 'games', size: 3.2, kind: 'safe',
      what: 'Installers for 6 old drivers. Shed keeps the newest two.', gone: 'Nothing. You can still roll back one driver.' },
    { id: 'discord', name: 'Discord cache', group: 'apps', size: 1.1, kind: 'rebuilds' },
  ];
  const GROUP = { windows: 'var(--map-windows)', games: 'var(--map-games)', dev: 'var(--map-dev)', apps: 'var(--map-apps)', yours: 'var(--map-yours)' };
  const GROUP_NAME = { windows: 'Windows', games: 'Games', dev: 'Dev and AI', apps: 'Apps', yours: 'Your files' };
  const used = () => ITEMS.reduce((s, x) => s + x.size, 0);
  const free = () => DRIVE.total - used();
  const grewTotal = () => ITEMS.reduce((s, x) => s + (x.grew || 0), 0);
  const shedTotal = () => ITEMS.filter((x) => x.shed).reduce((s, x) => s + x.size - (x.after || 0), 0);
  const gb = (v) => `${v >= 100 ? Math.round(v) : v.toFixed(1)} GB`;

  // Squarified treemap (Bruls et al.). Order is kept, so blocks don't jump while they shrink.
  function squarify(nodes, x, y, w, h) {
    const total = nodes.reduce((s, n) => s + n.v, 0);
    const scale = (w * h) / total;
    const items = nodes.map((n) => ({ ...n, a: n.v * scale }));
    const out = [];
    let rx = x, ry = y, rw = w, rh = h, row = [];
    const worst = (r, side) => { const s = r.reduce((t, n) => t + n.a, 0); let m = 0; for (const n of r) { m = Math.max(m, (side * side * n.a) / (s * s), (s * s) / (side * side * n.a)); } return m; };
    const lay = (r) => {
      const s = r.reduce((t, n) => t + n.a, 0);
      if (rw >= rh) { const cw = s / rh; let yy = ry; for (const n of r) { const nh = n.a / cw; out.push({ ...n, x: rx, y: yy, w: cw, h: nh }); yy += nh; } rx += cw; rw -= cw; }
      else { const ch = s / rw; let xx = rx; for (const n of r) { const nw = n.a / ch; out.push({ ...n, x: xx, y: ry, w: nw, h: ch }); xx += nw; } ry += ch; rh -= ch; }
    };
    for (const n of items) {
      const side = Math.min(rw, rh);
      if (!row.length || worst([...row, n], side) <= worst(row, side)) row.push(n);
      else { lay(row); row = [n]; }
    }
    if (row.length) lay(row);
    return out;
  }

  // p runs 0 to 1 as the shed items shrink and free space grows.
  function mapHTML(w, h, { p = 0, chips = 0, sel = '', gap = 3 } = {}) {
    const nodes = ITEMS.map((it) => ({ it, v: it.shed ? it.size + ((it.after || 0) - it.size) * p : it.size }));
    nodes.push({ it: { id: 'free', name: 'Free', kind: 'free' }, v: DRIVE.total - nodes.reduce((s, n) => s + n.v, 0) });
    return squarify(nodes, 0, 0, w, h).map((b) => {
      const { it } = b, bw = b.w - gap, bh = b.h - gap;
      if (bw < 1 || bh < 1) return '';
      const isFree = it.kind === 'free';
      const fade = it.shed && !it.after ? 1 - p : 1;
      const label = bw > 92 && bh > 40 ? `<b>${it.name}</b><span>${gb(b.v)}</span>` : (bw > 46 && bh > 22 ? `<span>${gb(b.v)}</span>` : '');
      const chip = it.grew && chips > 0 && bw > 60 && bh > 30 ? `<i class="chip" style="opacity:${chips}">+${it.grew.toFixed(1)} GB</i>` : '';
      const cls = `blk ${isFree ? 'free' : ''} ${it.id === sel ? 'sel' : ''} ${it.grew && chips > 0.5 ? 'grew' : ''} ${it.shed && p > 0 && !isFree ? 'going' : ''}`;
      return `<div class="${cls}" style="left:${b.x}px;top:${b.y}px;width:${bw}px;height:${bh}px;${isFree ? '' : `background:${GROUP[it.group]};`}opacity:${fade}">${label}${chip}</div>`;
    }).join('');
  }

  const BADGE = { rebuilds: ['Rebuilds itself', 'refresh'], safe: ['Safe to remove', 'check'], yours: ['Your files', 'user'], keep: ['Keep', 'lock'] };

  const BRAND = {
    name: 'Shed',
    headline: 'What ate your C: drive?',
    sub: 'Shed shows what grew, says what it is, and gives it back.',
    ticker: ['No ads', 'No nags', 'No bundled installs', 'No registry cleaner', 'No account', 'Undo for 7 days', '$0'],
    gradientNote: 'Violet is space you got back, and nothing else. Coral marks what grew since the last scan.',
    swatches: [['#000000', 'Page', '#f5f5f7'], ['#1c1c1e', 'Surface', '#f5f5f7'], ['#c58cff', 'Free space', '#000000'], ['#ff7a6b', 'Grew', '#000000'], ['#64d2ff', 'Rebuilds itself', '#000000'], ['#ffd60a', 'Your files', '#000000']],
  };

  g.Kit = { paint, tilePath, iconSVG, mark, DRIVE, ITEMS, GROUP, GROUP_NAME, BADGE, BRAND, used, free, grewTotal, shedTotal, gb, squarify, mapHTML, SMALL_MAX: 48 };
})(globalThis);
