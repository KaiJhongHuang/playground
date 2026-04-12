/* Daily Quest — Demo mock
 * 在 app.js 之前載入。啟用 DEMO_MODE 並接管 api() 呼叫。
 * 資料存在 sessionStorage，重新整理還在；關掉分頁就消失。
 */
(function () {
    window.DEMO_MODE = true;
    const SS_KEY = 'daily-quest:demo-state';

    const defaultTasks = [
        { id: 't1', name: '練功', icon: '🧘', xp: 10, active: true, order: 1 },
        { id: 't2', name: '慢跑', icon: '🏃', xp: 15, active: true, order: 2 },
        { id: 't3', name: '重訓', icon: '🏋️', xp: 20, active: true, order: 3 },
    ];

    function pad(n) { return String(n).padStart(2, '0'); }

    function dateStrOf(d) {
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function isoOf(d, hour, minute) {
        const dt = new Date(d);
        dt.setHours(hour, minute, 0, 0);
        const offMin = -dt.getTimezoneOffset();
        const sign = offMin >= 0 ? '+' : '-';
        const offH = pad(Math.floor(Math.abs(offMin) / 60));
        const offM = pad(Math.abs(offMin) % 60);
        return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
               `T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00${sign}${offH}:${offM}`;
    }

    function rid() { return 'demo-' + Math.random().toString(36).slice(2, 10); }

    function seedLogs() {
        // 策略：最近 7 天出現率較高（營造連勝感）、再往前較參差
        const logs = [];
        const today = new Date();
        for (let i = 1; i <= 29; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const recent = i <= 7;
            for (const t of defaultTasks) {
                const p = recent ? 0.9 : 0.6;
                if (Math.random() < p) {
                    // 各任務常見時段：練功早上、慢跑傍晚、重訓晚上
                    let base = 7;
                    if (t.id === 't2') base = 18;
                    if (t.id === 't3') base = 20;
                    const hour = Math.max(5, Math.min(23, base + Math.floor((Math.random() - 0.5) * 4)));
                    const minute = Math.floor(Math.random() * 60);
                    logs.push({
                        id: rid(),
                        task_id: t.id,
                        date: dateStrOf(d),
                        completed_at: isoOf(d, hour, minute),
                        note: '',
                    });
                }
            }
        }
        return logs;
    }

    function freshState() {
        const today = new Date();
        return {
            tasks: defaultTasks,
            logs: seedLogs(),
            meta: {
                challenge_start: dateStrOf(today),
                challenge_length: 75,
                hardcore: false,
            },
        };
    }

    function loadState() {
        const raw = sessionStorage.getItem(SS_KEY);
        if (raw) {
            try { return JSON.parse(raw); } catch (_) { /* fall through */ }
        }
        const s = freshState();
        saveState(s);
        return s;
    }

    function saveState(s) {
        sessionStorage.setItem(SS_KEY, JSON.stringify(s));
    }

    window.resetDemoState = function () {
        sessionStorage.removeItem(SS_KEY);
        location.reload();
    };

    window.__DEMO_API__ = async function (action, params) {
        // 假的 50ms 延遲，模擬網路
        await new Promise(r => setTimeout(r, 50));
        const s = loadState();
        if (action === 'bootstrap') {
            return { tasks: s.tasks, logs: s.logs, meta: s.meta };
        }
        if (action === 'complete') {
            const log = {
                id: rid(),
                task_id: params.task_id,
                date: params.date,
                completed_at: params.completed_at,
                note: params.note || '',
            };
            s.logs.push(log);
            saveState(s);
            return { ok: true, log };
        }
        if (action === 'logs') {
            const from = params.from || '0000-00-00';
            const to = params.to || '9999-99-99';
            return { logs: s.logs.filter(l => l.date >= from && l.date <= to) };
        }
        throw new Error('demo: unknown action ' + action);
    };
})();
