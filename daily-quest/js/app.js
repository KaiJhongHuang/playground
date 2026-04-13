/* Daily Quest — main controller */
window.DQ = window.DQ || {};

(function (DQ) {
    const U = DQ.Util;
    const { $, show, hide, todayStr } = U;
    const state = DQ.state;

    /* ---------- view management ---------- */

    function hideAll() {
        ['setup', 'loading', 'main-view', 'footer-actions', 'error-box']
            .forEach(id => hide(id));
    }
    function showLoading() { hideAll(); show('loading'); }
    function showMain() { hideAll(); show('main-view'); show('footer-actions'); }
    function showError(msg) {
        hideAll();
        const m = $('error-msg'); if (m) m.textContent = msg;
        show('error-box'); show('footer-actions');
    }
    function showSetup() {
        hideAll();
        show('setup');
        const ui = $('url-input');
        if (ui) { ui.value = state.apiUrl || ''; ui.focus(); }
    }

    /* ---------- tabs ---------- */

    function switchTab(name) {
        state.activeTab = name;
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === name);
        });
        document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('hidden', p.id !== `tab-${name}`);
        });
    }

    /* ---------- render ---------- */

    function render() {
        if (DQ.renderTodayTab) DQ.renderTodayTab();
        if (DQ.renderHistoryTab) DQ.renderHistoryTab();
        if (DQ.renderStatsTab) DQ.renderStatsTab();
    }
    DQ.render = render;

    /* ---------- data loading ---------- */

    async function loadBootstrap() {
        showLoading();
        try {
            const data = await DQ.api('bootstrap');
            state.tasks = (data.tasks || []).sort((a, b) => (a.order || 0) - (b.order || 0));
            state.logs = data.logs || [];
            state.meta = data.meta || {};
            if (!state.selectedTaskId && state.tasks[0]) {
                const active = state.tasks.filter(t => t.active !== false);
                state.selectedTaskId = active[0] && active[0].id;
            }
            render();
            showMain();
        } catch (err) {
            showError(err.message || String(err));
        }
    }

    /* ---------- actions ---------- */

    async function completeTask(task) {
        if (state.completing.has(task.id)) return;
        state.completing.add(task.id);
        if (DQ.renderTodayTab) DQ.renderTodayTab();

        const completedAt = U.nowIso();
        const date = todayStr();
        const preDone = countFullToday();

        try {
            const data = await DQ.api('complete', { task_id: task.id, completed_at: completedAt, date });
            state.logs.push(data.log || {
                id: 'local-' + Date.now(), task_id: task.id, date, completed_at: completedAt, note: '',
            });
            // if this completion made the day full, celebrate
            if (!preDone && countFullToday()) celebrate();
        } catch (err) {
            alert('打卡失敗：' + (err.message || err));
        } finally {
            state.completing.delete(task.id);
            render();
        }
    }

    function countFullToday() {
        const today = todayStr();
        const activeTasks = state.tasks.filter(t => t.active !== false);
        const doneIds = new Set(state.logs.filter(l => l.date === today).map(l => l.task_id));
        return activeTasks.length > 0 && activeTasks.every(t => doneIds.has(t.id));
    }

    function celebrate() {
        const el = $('celebrate');
        if (!el) return;
        el.innerHTML = '';
        const emojis = ['🎉', '✨', '⭐', '🔥', '💪', '🏆'];
        for (let i = 0; i < 24; i++) {
            const s = document.createElement('span');
            s.className = 'confetti';
            s.textContent = emojis[i % emojis.length];
            s.style.left = Math.random() * 100 + '%';
            s.style.animationDelay = (Math.random() * 0.6) + 's';
            s.style.animationDuration = (1.2 + Math.random() * 1.5) + 's';
            el.appendChild(s);
        }
        el.classList.remove('hidden');
        setTimeout(() => { el.classList.add('hidden'); el.innerHTML = ''; }, 2500);
    }

    async function startChallenge(hardcore) {
        try {
            await DQ.api('update_meta', {
                challenge_start: todayStr(), challenge_length: 75, hardcore: !!hardcore,
            });
            state.meta = { ...state.meta, challenge_start: todayStr(), challenge_length: 75, hardcore: !!hardcore };
            render();
        } catch (err) { alert('開始挑戰失敗：' + (err.message || err)); }
    }

    async function restartChallenge() {
        try {
            await DQ.api('update_meta', { challenge_start: todayStr() });
            state.meta = { ...state.meta, challenge_start: todayStr() };
            render();
        } catch (err) { alert('重啟挑戰失敗：' + (err.message || err)); }
    }

    async function stopChallenge() {
        if (!confirm('結束目前挑戰？')) return;
        try {
            await DQ.api('update_meta', { challenge_start: '' });
            state.meta = { ...state.meta, challenge_start: '' };
            render();
        } catch (err) { alert('結束挑戰失敗：' + (err.message || err)); }
    }

    function changeUrl() { showSetup(); }

    DQ.actions = { completeTask, startChallenge, restartChallenge, stopChallenge, changeUrl };

    /* ---------- setup URL handlers ---------- */

    function onSaveUrl() {
        const input = $('url-input');
        if (!input) return;
        const v = input.value.trim();
        const err = $('setup-error');
        if (err) err.classList.add('hidden');
        if (!/^https?:\/\//.test(v)) {
            if (err) { err.textContent = '請貼上以 https:// 開頭的完整 URL'; err.classList.remove('hidden'); }
            return;
        }
        state.apiUrl = v;
        localStorage.setItem(DQ.LS_URL_KEY, v);
        loadBootstrap();
    }

    /* ---------- init ---------- */

    function init() {
        const isDemo = window.DEMO_MODE === true;
        state.apiUrl = isDemo ? '__demo__' : (localStorage.getItem(DQ.LS_URL_KEY) || '');

        const td = $('today-date');
        if (td) td.textContent = U.formatHeaderToday();

        const saveBtn = $('save-url');
        if (saveBtn) saveBtn.addEventListener('click', onSaveUrl);
        const urlInput = $('url-input');
        if (urlInput) urlInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSaveUrl(); });

        const changeBtn = $('change-url');
        if (changeBtn) {
            if (isDemo) changeBtn.classList.add('hidden');
            else changeBtn.addEventListener('click', changeUrl);
        }
        const refreshBtn = $('refresh');
        if (refreshBtn) refreshBtn.addEventListener('click', loadBootstrap);
        const retryBtn = $('error-retry');
        if (retryBtn) retryBtn.addEventListener('click', loadBootstrap);

        const openSettingsBtn = $('open-settings');
        if (openSettingsBtn) openSettingsBtn.addEventListener('click', () => DQ.Settings && DQ.Settings.open());
        const closeSettingsBtn = $('close-settings');
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => DQ.Settings && DQ.Settings.close());
        const modal = $('settings-modal');
        if (modal) {
            const backdrop = modal.querySelector('.modal-backdrop');
            if (backdrop) backdrop.addEventListener('click', () => DQ.Settings && DQ.Settings.close());
        }

        document.querySelectorAll('.tab').forEach(t => {
            t.addEventListener('click', () => switchTab(t.dataset.tab));
        });

        if (!state.apiUrl) showSetup();
        else loadBootstrap();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window.DQ);
