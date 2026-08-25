// Window chrome, icons and timeline helpers shared by the mockup pages.
(function (g) {
  const ICONS = {
    drive: '<path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M6 16h.01M10 16h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    games: '<path d="M6 11h4M8 9v4"/><path d="M15 12h.01M18 10h.01"/><path d="M17.32 5H6.68a4 4 0 0 0-3.98 3.59l-.69 6.28A3 3 0 0 0 5 18c1 0 1.6-.5 2.1-1.1L8.5 15h7l1.4 1.9c.5.6 1.1 1.1 2.1 1.1a3 3 0 0 0 3-3.13l-.7-6.28A4 4 0 0 0 17.32 5z"/>',
    code: '<path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/>',
    windows: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
    hold: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"/><path d="M10 13h4"/>',
    map: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M11 3v18M11 12h10M16 12v9"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8"/><path d="M21 3v5h-5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    up: '<path d="m6 11 6-6 6 6"/><path d="M12 5v14"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    folder: '<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
  };
  const icon = (name, size = 16, sw = 1.75) => `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;

  const NAV = { Drive: [['Disk map', 'map'], ['Since Tuesday', 'clock']], Packs: [['Games', 'games'], ['Dev and AI', 'code'], ['Windows', 'windows']], Undo: [['Hold', 'hold', '3']] };
  const sidebar = (active, freeGB) => {
    const { DRIVE, free, gb } = g.Kit;
    const f = freeGB ?? free(), used = DRIVE.total - f;
    return `<aside class="side">
      <div class="lights"><i></i><i></i><i></i></div>
      ${Object.entries(NAV).map(([grp, items]) => `<h4>${grp}</h4>${items.map(([label, ic, n]) => `<div class="nav ${label === active ? 'on' : ''}">${icon(ic)}<span>${label}</span>${n ? `<em>${n}</em>` : ''}</div>`).join('')}`).join('')}
      <div class="drive"><b>${icon('drive', 15)}Local Disk (C:)</b><div class="dbar"><i style="width:${(used / DRIVE.total) * 100}%"></i></div><span>${gb(f)} free of ${DRIVE.total} GB</span></div>
    </aside>`;
  };
  const badge = (kind) => { const [label, ic] = g.Kit.BADGE[kind]; return `<span class="badge ${kind}">${icon(ic, 12, 2.2)}${label}</span>`; };

  const cursorSVG = `<svg class="cursor" id="cursor" width="22" height="28" viewBox="0 0 22 28"><path d="M2 1.8 V22.6 L7.4 17.6 L11 26 L14.6 24.4 L11 16.2 H18.4 Z" fill="#000" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
  const ease = (v) => { const t = Math.max(0, Math.min(1, v)); return 1 - (1 - t) ** 3; };
  const easeIO = (v) => { const t = Math.max(0, Math.min(1, v)); return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; };
  const span = (t, a, b) => Math.max(0, Math.min(1, (t - a) / (b - a)));

  g.UI = { icon, sidebar, badge, cursorSVG, ease, easeIO, span };
})(globalThis);
