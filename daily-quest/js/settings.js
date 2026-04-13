/* Daily Quest — Settings modal (Phase 5) */
window.DQ = window.DQ || {};

(function (DQ) {
    const U = DQ.Util;
    const { $, escapeHtml } = U;

    function openSettings() {
        const modal = $('settings-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        renderSettingsBody();
    }
    function closeSettings() {
        const modal = $('settings-modal');
        if (modal) modal.classList.add('hidden');
    }

    function renderSettingsBody() {
        const body = $('settings-body');
        if (!body) return;
        const state = DQ.state;
        const tasks = state.tasks.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        const isDemo = window.DEMO_MODE === true;

        body.innerHTML = `
            <section class="settings-section">
                <h3>任務清單</h3>
                <ul class="settings-tasks" id="settings-tasks"></ul>
                <button class="ghost" id="add-task-btn">+ 新增任務</button>
            </section>
            <section class="settings-section">
                <h3>挑戰設定</h3>
                <label class="field">
                    <span>挑戰開始日</span>
                    <input type="date" id="meta-start" value="${escapeHtml(state.meta.challenge_start || '')}">
                </label>
                <label class="field">
                    <span>挑戰天數</span>
                    <input type="number" id="meta-length" min="1" max="999" value="${Number(state.meta.challenge_length) || 75}">
                </label>
                <label class="inline-check">
                    <input type="checkbox" id="meta-hardcore" ${(state.meta.hardcore === true || String(state.meta.hardcore).toLowerCase() === 'true') ? 'checked' : ''}>
                    硬核模式
                </label>
                <button class="primary" id="save-meta-btn">儲存挑戰設定</button>
            </section>
            <section class="settings-section">
                <h3>資料</h3>
                <button class="ghost" id="export-json-btn">匯出 JSON</button>
                ${isDemo ? '' : '<button class="ghost" id="change-url-btn">更換 Apps Script URL</button>'}
            </section>
            <p class="muted" id="settings-msg"></p>
        `;

        renderSettingsTasks();
        $('add-task-btn').onclick = addTaskRow;
        $('save-meta-btn').onclick = saveMeta;
        $('export-json-btn').onclick = exportJson;
        const urlBtn = $('change-url-btn');
        if (urlBtn) urlBtn.onclick = () => { closeSettings(); DQ.actions.changeUrl(); };
    }

    function renderSettingsTasks() {
        const ul = $('settings-tasks');
        if (!ul) return;
        const tasks = DQ.state.tasks.slice().sort((a, b) => (a.order || 0) - (b.order || 0));
        ul.innerHTML = '';
        for (const t of tasks) {
            const li = document.createElement('li');
            li.className = 'settings-task';
            li.innerHTML = `
                <input class="st-icon" data-id="${escapeHtml(t.id)}" data-field="icon" value="${escapeHtml(t.icon || '')}" maxlength="4">
                <input class="st-name" data-id="${escapeHtml(t.id)}" data-field="name" value="${escapeHtml(t.name)}">
                <input class="st-xp" data-id="${escapeHtml(t.id)}" data-field="xp" type="number" min="0" value="${Number(t.xp) || 0}">
                <label class="inline-check"><input type="checkbox" data-id="${escapeHtml(t.id)}" data-field="active" ${t.active !== false ? 'checked' : ''}> 啟用</label>
                <button class="icon-btn" data-del="${escapeHtml(t.id)}" title="刪除">🗑</button>
            `;
            ul.appendChild(li);
        }
        ul.querySelectorAll('input[data-field]').forEach(inp => {
            inp.addEventListener('change', onTaskFieldChange);
        });
        ul.querySelectorAll('[data-del]').forEach(btn => {
            btn.addEventListener('click', () => deleteTask(btn.dataset.del));
        });
    }

    async function onTaskFieldChange(e) {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (field === 'xp') value = Number(value) || 0;
        await saveTask(id, { [field]: value });
    }

    async function saveTask(id, patch) {
        try {
            showMsg('儲存中…');
            const task = DQ.state.tasks.find(t => t.id === id) || { id };
            const payload = { ...task, ...patch };
            await DQ.api('update_task', {
                id: payload.id,
                name: payload.name || '',
                icon: payload.icon || '',
                xp: payload.xp || 0,
                active: payload.active !== false,
                order: payload.order || 0,
            });
            Object.assign(task, patch);
            if (!DQ.state.tasks.find(t => t.id === id)) DQ.state.tasks.push(task);
            DQ.render();
            showMsg('已儲存');
        } catch (err) {
            showMsg('儲存失敗：' + (err.message || err), true);
        }
    }

    async function deleteTask(id) {
        if (!confirm('停用這個任務？（歷史紀錄會保留，但不再顯示）')) return;
        await saveTask(id, { active: false });
        renderSettingsTasks();
    }

    async function addTaskRow() {
        const nextOrder = Math.max(0, ...DQ.state.tasks.map(t => t.order || 0)) + 1;
        const id = 't' + Math.random().toString(36).slice(2, 8);
        await saveTask(id, { id, name: '新任務', icon: '⭐', xp: 10, active: true, order: nextOrder });
        renderSettingsTasks();
    }

    async function saveMeta() {
        const start = $('meta-start').value || '';
        const length = Number($('meta-length').value) || 75;
        const hardcore = $('meta-hardcore').checked;
        try {
            showMsg('儲存中…');
            await DQ.api('update_meta', { challenge_start: start, challenge_length: length, hardcore: hardcore });
            DQ.state.meta = { ...DQ.state.meta, challenge_start: start, challenge_length: length, hardcore };
            DQ.render();
            showMsg('已儲存');
        } catch (err) {
            showMsg('儲存失敗：' + (err.message || err), true);
        }
    }

    function exportJson() {
        const data = { tasks: DQ.state.tasks, logs: DQ.state.logs, meta: DQ.state.meta, exported_at: DQ.Util.nowIso() };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-quest-${DQ.Util.todayStr()}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function showMsg(text, isError) {
        const el = $('settings-msg');
        if (!el) return;
        el.textContent = text;
        el.classList.toggle('error', !!isError);
    }

    DQ.Settings = { open: openSettings, close: closeSettings };
})(window.DQ);
