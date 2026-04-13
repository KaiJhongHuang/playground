/* Daily Quest — History tab render (Phase 2) */
window.DQ = window.DQ || {};

(function (DQ) {
    const U = DQ.Util;
    const { $, escapeHtml, pad, dateStrOf, dateFromStr, addDays, todayStr, WEEKDAYS_TC } = U;

    function renderStats() {
        const el = $('stats-grid');
        if (!el) return;
        const state = DQ.state;
        const { week, month, last30, perfectMonth } = DQ.Game.computeStats(state.tasks, state.logs);
        const pct = (r) => `${Math.round(r.rate * 100)}%`;
        el.innerHTML = `
            <div class="stat-cell">
                <div class="stat-label">本週完成率</div>
                <div class="stat-value">${pct(week)}</div>
                <div class="stat-sub">${week.done} / ${week.total}</div>
            </div>
            <div class="stat-cell">
                <div class="stat-label">本月完成率</div>
                <div class="stat-value">${pct(month)}</div>
                <div class="stat-sub">${month.done} / ${month.total}</div>
            </div>
            <div class="stat-cell">
                <div class="stat-label">本月全勤天數</div>
                <div class="stat-value">${perfectMonth}</div>
                <div class="stat-sub">天</div>
            </div>
            <div class="stat-cell">
                <div class="stat-label">近 30 天完成率</div>
                <div class="stat-value">${pct(last30)}</div>
                <div class="stat-sub">${last30.done} / ${last30.total}</div>
            </div>
        `;
    }

    function renderHeatmap() {
        const container = $('heatmap');
        if (!container) return;
        const state = DQ.state;
        container.innerHTML = '';

        const activeTasks = state.tasks.filter(t => t.active !== false);
        const totalPerDay = activeTasks.length || 1;
        const byDate = DQ.Game.completionsByDate(state.logs);

        const weeks = DQ.HEATMAP_WEEKS;
        const today = new Date();
        const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        // We want the last column to contain today. Columns align to weeks (Sun..Sat).
        // Find the Saturday of this week (or use today's day index).
        const dayOfWeek = todayMid.getDay(); // 0=Sun..6=Sat
        // startDate = totalWeeks back from todayMid, aligned to Sunday
        const start = new Date(todayMid);
        start.setDate(todayMid.getDate() - ((weeks - 1) * 7 + dayOfWeek));

        // header month labels (one per first Sunday of each month in the range)
        const monthLabels = [];
        for (let w = 0; w < weeks; w++) {
            const d = new Date(start);
            d.setDate(start.getDate() + w * 7);
            monthLabels.push(d.getMonth());
        }
        const monthRow = document.createElement('div');
        monthRow.className = 'heatmap-months';
        let lastMonth = -1;
        for (let w = 0; w < weeks; w++) {
            const m = monthLabels[w];
            const cell = document.createElement('span');
            cell.className = 'heatmap-month-cell';
            if (m !== lastMonth) {
                cell.textContent = (m + 1) + '月';
                lastMonth = m;
            }
            monthRow.appendChild(cell);
        }
        container.appendChild(monthRow);

        const grid = document.createElement('div');
        grid.className = 'heatmap-cells';

        // Column-major: for each week, for each weekday (Sun..Sat)
        for (let w = 0; w < weeks; w++) {
            for (let dow = 0; dow < 7; dow++) {
                const d = new Date(start);
                d.setDate(start.getDate() + w * 7 + dow);
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';
                if (d > todayMid) {
                    cell.classList.add('future');
                } else {
                    const dstr = dateStrOf(d);
                    const s = byDate.get(dstr);
                    const done = s ? [...s].filter(id => activeTasks.find(t => t.id === id)).length : 0;
                    const ratio = done / totalPerDay;
                    let level = 0;
                    if (ratio >= 1) level = 4;
                    else if (ratio >= 0.66) level = 3;
                    else if (ratio >= 0.34) level = 2;
                    else if (ratio > 0) level = 1;
                    cell.classList.add('lvl-' + level);
                    cell.title = `${dstr}（週${WEEKDAYS_TC[d.getDay()]}）· ${done}/${totalPerDay} 完成`;
                }
                grid.appendChild(cell);
            }
        }
        container.appendChild(grid);
    }

    function renderTaskSelect() {
        const sel = $('task-select');
        if (!sel) return;
        const state = DQ.state;
        const activeTasks = state.tasks.filter(t => t.active !== false);
        const prev = state.selectedTaskId;
        sel.innerHTML = '';
        for (const t of activeTasks) {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = `${t.icon || ''} ${t.name}`.trim();
            sel.appendChild(opt);
        }
        if (prev && activeTasks.find(t => t.id === prev)) {
            sel.value = prev;
        } else if (activeTasks[0]) {
            state.selectedTaskId = activeTasks[0].id;
        }
        sel.onchange = () => {
            state.selectedTaskId = sel.value;
            renderTaskHistory();
        };
    }

    function renderTaskHistory() {
        const el = $('task-history-chart');
        if (!el) return;
        const state = DQ.state;
        const activeTasks = state.tasks.filter(t => t.active !== false);
        const taskId = state.selectedTaskId || (activeTasks[0] && activeTasks[0].id);
        if (!taskId) { el.innerHTML = '<p class="history-empty">無資料</p>'; return; }
        const task = state.tasks.find(t => t.id === taskId);
        const days = DQ.TASK_CHART_DAYS;
        const result = DQ.Game.taskHistory(taskId, state.logs, days);

        el.innerHTML = `
            <div class="task-history-header">
                <span class="task-history-title">${escapeHtml(task ? (task.icon || '') + ' ' + task.name : '')}</span>
                <span class="task-history-rate">近 ${days} 天完成率 ${Math.round(result.rate * 100)}%</span>
            </div>
            <div class="task-history-row">
                ${result.days.map(d => {
                    const [y, m, day] = d.date.split('-');
                    return `<span class="th-cell ${d.done ? 'done' : ''}" title="${d.date}"></span>`;
                }).join('')}
            </div>
            <div class="task-history-axis">
                <span>${result.days[0] ? result.days[0].date.slice(5) : ''}</span>
                <span>今天</span>
            </div>
        `;
    }

    function renderHistoryTable() {
        const container = $('history-table');
        if (!container) return;
        const state = DQ.state;
        container.innerHTML = '';
        const activeTasks = state.tasks.filter(t => t.active !== false);
        if (activeTasks.length === 0) {
            container.innerHTML = '<p class="history-empty">目前沒有任務</p>';
            return;
        }

        const rangeEl = $('history-range');
        if (rangeEl) rangeEl.textContent = `近 ${DQ.HISTORY_DAYS} 天`;

        const byDate = new Map();
        for (const log of state.logs) {
            if (!byDate.has(log.date)) byDate.set(log.date, new Map());
            const row = byDate.get(log.date);
            const existing = row.get(log.task_id);
            if (!existing || String(log.completed_at) < String(existing)) {
                row.set(log.task_id, log.completed_at);
            }
        }

        const days = [];
        for (let i = 0; i < DQ.HISTORY_DAYS; i++) {
            const d = addDays(new Date(), -i);
            days.push(dateStrOf(d));
        }

        const todayStrVal = todayStr();
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const headRow = document.createElement('tr');
        headRow.appendChild(makeCell('th', '日期', 'date-col'));
        for (const t of activeTasks) {
            headRow.appendChild(makeCell('th', `${t.icon || ''} ${t.name}`.trim()));
        }
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (const dateStr of days) {
            const tr = document.createElement('tr');
            const dayLogs = byDate.get(dateStr);
            const full = dayLogs && DQ.Game.isDayFull(new Set(dayLogs.keys()), activeTasks);
            if (full) tr.className = 'full-day';

            const [y, m, d] = dateStr.split('-').map(Number);
            const wd = new Date(y, m - 1, d).getDay();
            const dateTd = document.createElement('td');
            dateTd.className = 'date-col' + (dateStr === todayStrVal ? ' today' : '');
            dateTd.innerHTML = `${m}/${d}<span class="weekday">週${WEEKDAYS_TC[wd]}</span>`;
            tr.appendChild(dateTd);

            for (const t of activeTasks) {
                const td = document.createElement('td');
                const iso = dayLogs && dayLogs.get(t.id);
                td.innerHTML = iso
                    ? `<span class="cell-done">✅ ${U.formatTime(iso)}</span>`
                    : `<span class="cell-none">—</span>`;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        container.appendChild(table);
    }

    function makeCell(tag, text, cls) {
        const el = document.createElement(tag);
        if (cls) el.className = cls;
        el.textContent = text;
        return el;
    }

    DQ.renderHistoryTab = function () {
        renderStats();
        renderHeatmap();
        renderTaskSelect();
        renderTaskHistory();
        renderHistoryTable();
    };
})(window.DQ);
