/* Daily Quest — Stats tab render (Phase 3-4) */
window.DQ = window.DQ || {};

(function (DQ) {
    const U = DQ.Util;
    const { $, escapeHtml } = U;

    function renderCharacter() {
        const el = $('character-card');
        if (!el) return;
        const state = DQ.state;
        const xp = DQ.Game.totalXp(state.tasks, state.logs);
        const level = DQ.Game.levelFromXp(xp);
        const title = DQ.Game.titleForLevel(level);
        const xpThis = DQ.Game.xpForLevel(level);
        const xpNext = DQ.Game.xpForLevel(level + 1);
        const progress = xpNext > xpThis ? ((xp - xpThis) / (xpNext - xpThis)) : 0;
        const { current, longest } = DQ.Game.computeStreak(state.tasks, state.logs);

        const avatar = level >= 30 ? '👑' : level >= 20 ? '🧙' : level >= 10 ? '⚔️' : level >= 5 ? '🥋' : '🌱';

        el.innerHTML = `
            <div class="char-row">
                <div class="char-avatar">${avatar}</div>
                <div class="char-info">
                    <div class="char-title">${escapeHtml(title)}</div>
                    <div class="char-level">Lv ${level}</div>
                    <div class="xp-bar"><div class="xp-fill" style="width:${Math.round(U.clamp(progress, 0, 1) * 100)}%"></div></div>
                    <div class="char-xp muted">${xp} XP · 下一級還需 ${Math.max(0, xpNext - xp)} XP</div>
                </div>
            </div>
            <div class="char-stats">
                <div class="char-stat"><span class="muted">連勝</span><b>🔥 ${current}</b></div>
                <div class="char-stat"><span class="muted">最長連勝</span><b>${longest}</b></div>
                <div class="char-stat"><span class="muted">累計打卡</span><b>${state.logs.length}</b></div>
            </div>
        `;
    }

    function renderChallenge() {
        const card = $('challenge-card');
        const body = $('challenge-body');
        const badge = $('challenge-badge');
        const title = $('challenge-title');
        if (!card || !body || !badge || !title) return;
        const state = DQ.state;
        const ch = DQ.Game.challengeStatus(state.tasks, state.logs, state.meta);

        if (!ch.startStr) {
            card.classList.remove('hidden');
            title.textContent = '挑戰';
            badge.textContent = '尚未開始';
            body.innerHTML = `
                <p class="muted">開啟 ${ch.length} 天挑戰，每天全勤才算達標。</p>
                <button id="challenge-start" class="primary">從今天開始挑戰</button>
                <label class="inline-check">
                    <input type="checkbox" id="challenge-hardcore"> 硬核模式（任一天未全勤就重來）
                </label>
            `;
            const btn = $('challenge-start');
            const chk = $('challenge-hardcore');
            if (btn) btn.onclick = () => DQ.actions.startChallenge(chk && chk.checked);
            return;
        }

        card.classList.remove('hidden');
        title.textContent = ch.hardcore ? `${ch.length} Hard · 硬核` : `${ch.length} 天挑戰 · 軟核`;
        badge.textContent = ch.completed ? '🏆 完成！' : (ch.failedDate && ch.hardcore ? '✗ 失敗' : `Day ${ch.day}/${ch.length}`);
        badge.classList.toggle('full', ch.completed);

        const pct = Math.min(100, Math.round((ch.day / ch.length) * 100));
        const failedNotice = ch.failedDate
            ? `<p class="error">${ch.hardcore ? '硬核模式' : '軟核模式'}：${ch.failedDate} 未全勤${ch.hardcore ? '，挑戰失敗' : '（僅提示，不重置）'}</p>`
            : '';

        body.innerHTML = `
            <div class="challenge-progress">
                <div class="challenge-bar"><div class="challenge-fill" style="width:${pct}%"></div></div>
                <div class="muted">開始於 ${ch.startStr} · 還剩 ${Math.max(0, ch.length - ch.day + 1)} 天</div>
            </div>
            ${failedNotice}
            <div class="challenge-actions">
                ${ch.failedDate && ch.hardcore ? `<button id="challenge-restart" class="primary">從今天重新開始</button>` : ''}
                <button id="challenge-stop" class="ghost">結束挑戰</button>
            </div>
        `;
        const restartBtn = $('challenge-restart');
        if (restartBtn) restartBtn.onclick = () => DQ.actions.restartChallenge();
        const stopBtn = $('challenge-stop');
        if (stopBtn) stopBtn.onclick = () => DQ.actions.stopChallenge();
    }

    function renderAchievements() {
        const grid = $('achievements-grid');
        const count = $('achievements-count');
        if (!grid) return;
        const state = DQ.state;
        const list = DQ.Game.computeAchievements(state.tasks, state.logs);
        const unlocked = list.filter(a => a.unlocked).length;
        if (count) count.textContent = `${unlocked} / ${list.length}`;
        grid.innerHTML = list.map(a => `
            <div class="achievement ${a.unlocked ? 'unlocked' : ''}" title="${escapeHtml(a.desc)}">
                <div class="ach-icon">${a.icon}</div>
                <div class="ach-name">${escapeHtml(a.name)}</div>
                <div class="ach-desc">${escapeHtml(a.desc)}</div>
            </div>
        `).join('');
    }

    DQ.renderStatsTab = function () {
        renderCharacter();
        renderChallenge();
        renderAchievements();
    };
})(window.DQ);
