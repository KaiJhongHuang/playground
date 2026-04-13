/* Daily Quest — Today tab render */
window.DQ = window.DQ || {};

(function (DQ) {
    const U = DQ.Util;
    const { $, escapeHtml, formatTime, todayStr } = U;

    function renderStatusBar() {
        const el = $('status-bar');
        if (!el) return;
        const state = DQ.state;
        const xp = DQ.Game.totalXp(state.tasks, state.logs);
        const level = DQ.Game.levelFromXp(xp);
        const title = DQ.Game.titleForLevel(level);
        const xpThis = DQ.Game.xpForLevel(level);
        const xpNext = DQ.Game.xpForLevel(level + 1);
        const progress = xpNext > xpThis ? ((xp - xpThis) / (xpNext - xpThis)) : 0;
        const { current, longest } = DQ.Game.computeStreak(state.tasks, state.logs);
        const challenge = DQ.Game.challengeStatus(state.tasks, state.logs, state.meta);

        const challengeHtml = challenge.startStr
            ? `<div class="status-item" title="75 Hard 挑戰">
                   <span class="status-label">挑戰</span>
                   <span class="status-value">${challenge.failedDate && challenge.hardcore ? '✗' : `Day ${challenge.day}/${challenge.length}`}</span>
               </div>`
            : '';

        el.innerHTML = `
            <div class="status-item" title="等級">
                <span class="status-label">Lv ${level} · ${escapeHtml(title)}</span>
                <div class="xp-bar"><div class="xp-fill" style="width:${Math.round(U.clamp(progress, 0, 1) * 100)}%"></div></div>
                <span class="status-value small">${xp} XP · 下一級 ${xpNext - xp}</span>
            </div>
            <div class="status-item" title="連勝">
                <span class="status-label">🔥 連勝</span>
                <span class="status-value">${current}<span class="small"> / 最長 ${longest}</span></span>
            </div>
            ${challengeHtml}
        `;
    }

    function renderToday() {
        const list = $('task-list');
        if (!list) return;
        const state = DQ.state;
        const today = todayStr();
        const logsByTask = new Map();
        for (const log of state.logs) {
            if (log.date !== today) continue;
            if (!logsByTask.has(log.task_id)) logsByTask.set(log.task_id, []);
            logsByTask.get(log.task_id).push(log);
        }
        for (const arr of logsByTask.values()) {
            arr.sort((a, b) => String(a.completed_at).localeCompare(String(b.completed_at)));
        }

        let done = 0;
        list.innerHTML = '';
        const activeTasks = state.tasks.filter(t => t.active !== false);
        for (const t of activeTasks) {
            const logs = logsByTask.get(t.id) || [];
            const isDone = logs.length > 0;
            const isPending = state.completing.has(t.id);
            if (isDone) done++;

            const li = document.createElement('li');
            li.className = 'task-item' + (isDone ? ' done' : '') + (isPending ? ' pending-sync' : '');
            li.innerHTML = `
                <div class="task-icon">${escapeHtml(t.icon || '•')}</div>
                <div class="task-main">
                    <div class="task-name">${escapeHtml(t.name)}${t.xp ? `<span class="task-xp">+${t.xp} XP</span>` : ''}</div>
                    <div class="task-meta">${isDone ? '已完成 ' + formatTime(logs[0].completed_at) : (isPending ? '送出中…' : '尚未完成')}</div>
                </div>
                <div class="task-action">${isDone ? '✅' : (isPending ? '⏳' : '○')}</div>
            `;
            if (!isDone && !isPending) {
                li.addEventListener('click', () => DQ.actions.completeTask(t));
            } else if (isDone) {
                attachLongPress(li, () => DQ.actions.uncompleteTask(t, logs[0]));
            }
            list.appendChild(li);
        }

        if (activeTasks.length === 0) {
            list.innerHTML = '<li class="history-empty">目前沒有啟用的任務。<br>請到設定頁新增或啟用任務。</li>';
        }

        const total = activeTasks.length;
        const badge = $('today-progress');
        if (badge) {
            badge.textContent = `${done} / ${total}`;
            badge.classList.toggle('full', total > 0 && done === total);
        }
    }

    function attachLongPress(el, handler) {
        let timer = null;
        let startX = 0, startY = 0;
        const start = (x, y) => {
            startX = x; startY = y;
            timer = setTimeout(() => { timer = null; handler(); }, 550);
            el.classList.add('pressing');
        };
        const cancel = () => {
            if (timer) clearTimeout(timer);
            timer = null;
            el.classList.remove('pressing');
        };
        el.addEventListener('pointerdown', (e) => {
            if (e.button && e.button !== 0) return;
            start(e.clientX, e.clientY);
        });
        el.addEventListener('pointermove', (e) => {
            if (!timer) return;
            if (Math.abs(e.clientX - startX) > 8 || Math.abs(e.clientY - startY) > 8) cancel();
        });
        el.addEventListener('pointerup', cancel);
        el.addEventListener('pointercancel', cancel);
        el.addEventListener('pointerleave', cancel);
        el.addEventListener('contextmenu', (e) => { e.preventDefault(); handler(); });
    }

    DQ.renderTodayTab = function () {
        renderStatusBar();
        renderToday();
    };
})(window.DQ);
