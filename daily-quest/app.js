/* Daily Quest — Phase 1 frontend */

const LS_URL_KEY = 'daily-quest:api-url';
const HISTORY_DAYS = 30;

const $ = (id) => document.getElementById(id);

const state = {
    apiUrl: '',
    tasks: [],
    logs: [],
    meta: {},
    loading: false,
    completing: new Set(), // task ids currently being POSTed
};

/* ---------- util: dates / time ---------- */

function pad(n) { return String(n).padStart(2, '0'); }

function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nowIso() {
    const d = new Date();
    const offMin = -d.getTimezoneOffset();
    const sign = offMin >= 0 ? '+' : '-';
    const offH = pad(Math.floor(Math.abs(offMin) / 60));
    const offM = pad(Math.abs(offMin) % 60);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
           `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
           `${sign}${offH}:${offM}`;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function formatDateHeader(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return `${m}/${d}（週${WEEKDAYS[date.getDay()]}）`;
}

function formatHeaderToday() {
    const d = new Date();
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}（週${WEEKDAYS[d.getDay()]}）`;
}

function formatTime(isoStr) {
    // prefer extracting HH:MM from ISO string directly (respects original timezone)
    const m = /T(\d{2}):(\d{2})/.exec(isoStr);
    if (m) return `${m[1]}:${m[2]}`;
    const d = new Date(isoStr);
    if (isNaN(d)) return '';
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/* ---------- API ---------- */

async function api(action, params = {}) {
    if (typeof window.__DEMO_API__ === 'function') {
        return await window.__DEMO_API__(action, params);
    }
    if (!state.apiUrl) throw new Error('Apps Script URL 未設定');
    const url = new URL(state.apiUrl);
    url.searchParams.set('action', action);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), { method: 'GET' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data;
}

/* ---------- boot ---------- */

function init() {
    const isDemo = window.DEMO_MODE === true;
    state.apiUrl = isDemo ? '__demo__' : (localStorage.getItem(LS_URL_KEY) || '');
    $('today-date').textContent = formatHeaderToday();

    const saveBtn = $('save-url');
    if (saveBtn) saveBtn.addEventListener('click', onSaveUrl);
    const urlInput = $('url-input');
    if (urlInput) urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') onSaveUrl();
    });
    const changeBtn = $('change-url');
    if (changeBtn) {
        if (isDemo) changeBtn.classList.add('hidden');
        else changeBtn.addEventListener('click', onChangeUrl);
    }
    $('refresh').addEventListener('click', loadBootstrap);
    $('error-retry').addEventListener('click', loadBootstrap);

    if (!state.apiUrl) {
        showSetup();
    } else {
        loadBootstrap();
    }
}

function showSetup() {
    hideAll();
    const s = $('setup'); if (s) s.classList.remove('hidden');
    const ui = $('url-input');
    if (ui) { ui.value = state.apiUrl || ''; ui.focus(); }
}

function hideAll() {
    ['setup', 'loading', 'today-section', 'history-section', 'footer-actions', 'error-box']
        .forEach(id => { const el = $(id); if (el) el.classList.add('hidden'); });
}

function show(id) {
    const el = $(id); if (el) el.classList.remove('hidden');
}

function showLoading() {
    hideAll();
    show('loading');
}

function showMain() {
    hideAll();
    show('today-section');
    show('history-section');
    show('footer-actions');
}

function showError(msg) {
    hideAll();
    const m = $('error-msg'); if (m) m.textContent = msg;
    show('error-box');
    show('footer-actions');
}

function onSaveUrl() {
    const v = $('url-input').value.trim();
    const err = $('setup-error');
    err.classList.add('hidden');
    if (!/^https?:\/\//.test(v)) {
        err.textContent = '請貼上以 https:// 開頭的完整 URL';
        err.classList.remove('hidden');
        return;
    }
    state.apiUrl = v;
    localStorage.setItem(LS_URL_KEY, v);
    loadBootstrap();
}

function onChangeUrl() {
    showSetup();
}

async function loadBootstrap() {
    showLoading();
    try {
        const data = await api('bootstrap');
        state.tasks = data.tasks || [];
        state.logs = data.logs || [];
        state.meta = data.meta || {};
        render();
        showMain();
    } catch (err) {
        showError(err.message || String(err));
    }
}

/* ---------- render ---------- */

function render() {
    renderToday();
    renderHistory();
}

function todayLogsByTask() {
    const today = todayStr();
    const map = new Map();
    for (const log of state.logs) {
        if (log.date !== today) continue;
        if (!map.has(log.task_id)) map.set(log.task_id, []);
        map.get(log.task_id).push(log);
    }
    for (const arr of map.values()) {
        arr.sort((a, b) => a.completed_at.localeCompare(b.completed_at));
    }
    return map;
}

function renderToday() {
    const list = $('task-list');
    const logsByTask = todayLogsByTask();

    let done = 0;
    list.innerHTML = '';
    for (const t of state.tasks) {
        const logs = logsByTask.get(t.id) || [];
        const isDone = logs.length > 0;
        const isPending = state.completing.has(t.id);
        if (isDone) done++;

        const li = document.createElement('li');
        li.className = 'task-item' + (isDone ? ' done' : '') + (isPending ? ' pending-sync' : '');
        li.innerHTML = `
            <div class="task-icon">${escapeHtml(t.icon || '•')}</div>
            <div class="task-main">
                <div class="task-name">${escapeHtml(t.name)}</div>
                <div class="task-meta">${isDone ? '已完成 ' + formatTime(logs[0].completed_at) : (isPending ? '送出中…' : '尚未完成')}</div>
            </div>
            <div class="task-action">${isDone ? '✅' : (isPending ? '⏳' : '○')}</div>
        `;
        if (!isDone && !isPending) {
            li.addEventListener('click', () => completeTask(t));
        }
        list.appendChild(li);
    }

    const total = state.tasks.length;
    const badge = $('today-progress');
    badge.textContent = `${done} / ${total}`;
    badge.classList.toggle('full', total > 0 && done === total);
}

function renderHistory() {
    const container = $('history-table');
    container.innerHTML = '';

    const days = [];
    const today = new Date();
    for (let i = 0; i < HISTORY_DAYS; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
    }

    $('history-range').textContent = `近 ${HISTORY_DAYS} 天`;

    if (state.tasks.length === 0) {
        container.innerHTML = '<p class="history-empty">目前沒有任務</p>';
        return;
    }

    // index: date -> task_id -> earliest completed_at
    const idx = new Map();
    for (const log of state.logs) {
        if (!idx.has(log.date)) idx.set(log.date, new Map());
        const row = idx.get(log.date);
        const existing = row.get(log.task_id);
        if (!existing || log.completed_at < existing) row.set(log.task_id, log.completed_at);
    }

    const todayStrVal = todayStr();
    const table = document.createElement('table');

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.appendChild(thCell('日期', 'date-col'));
    for (const t of state.tasks) {
        headRow.appendChild(thCell(`${t.icon || ''} ${t.name}`.trim()));
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (const dateStr of days) {
        const tr = document.createElement('tr');
        const dayLogs = idx.get(dateStr);
        const isFullDay = dayLogs && state.tasks.every(t => dayLogs.has(t.id));
        if (isFullDay) tr.className = 'full-day';

        const dateTd = document.createElement('td');
        dateTd.className = 'date-col' + (dateStr === todayStrVal ? ' today' : '');
        const [y, m, d] = dateStr.split('-').map(Number);
        const wd = new Date(y, m - 1, d).getDay();
        dateTd.innerHTML = `${m}/${d}<span class="weekday">週${WEEKDAYS[wd]}</span>`;
        tr.appendChild(dateTd);

        for (const t of state.tasks) {
            const td = document.createElement('td');
            const iso = dayLogs && dayLogs.get(t.id);
            if (iso) {
                td.innerHTML = `<span class="cell-done">✅ ${formatTime(iso)}</span>`;
            } else {
                td.innerHTML = `<span class="cell-none">—</span>`;
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    container.appendChild(table);
}

function thCell(text, cls) {
    const th = document.createElement('th');
    if (cls) th.className = cls;
    th.textContent = text;
    return th;
}

/* ---------- actions ---------- */

async function completeTask(task) {
    if (state.completing.has(task.id)) return;
    state.completing.add(task.id);
    renderToday();

    const completedAt = nowIso();
    const date = todayStr();

    try {
        const data = await api('complete', {
            task_id: task.id,
            completed_at: completedAt,
            date,
        });
        if (data.log) {
            state.logs.push(data.log);
        } else {
            // fallback: synthesize log locally
            state.logs.push({
                id: 'local-' + Date.now(),
                task_id: task.id,
                date,
                completed_at: completedAt,
                note: '',
            });
        }
    } catch (err) {
        alert('打卡失敗：' + (err.message || err));
    } finally {
        state.completing.delete(task.id);
        render();
    }
}

/* ---------- misc ---------- */

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
}

init();
