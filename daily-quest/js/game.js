/* Daily Quest — gamification pure logic (Phase 3/4) */
window.DQ = window.DQ || {};

(function (DQ) {
    const { todayStr, dateStrOf, dateFromStr, addDays, diffDays } = DQ.Util;

    // XP required to reach level N (level 1 at 0 XP).
    //  xpForLevel(1) = 0, xpForLevel(2) = 100, xpForLevel(3) = 300, xpForLevel(4) = 600, ...
    //  formula: 50 * n * (n-1)
    function xpForLevel(n) { return 50 * n * (n - 1); }

    function levelFromXp(xp) {
        let n = 1;
        while (xpForLevel(n + 1) <= xp) n++;
        return n;
    }

    function titleForLevel(n) {
        if (n >= 30) return '傳說';
        if (n >= 20) return '宗師';
        if (n >= 10) return '武者';
        if (n >= 5) return '修行者';
        return '新手';
    }

    function totalXp(tasks, logs) {
        const xpOf = new Map(tasks.map(t => [t.id, t.xp || 0]));
        let s = 0;
        for (const l of logs) s += xpOf.get(l.task_id) || 0;
        return s;
    }

    /** Returns Map<date, Set<task_id>> */
    function completionsByDate(logs) {
        const m = new Map();
        for (const l of logs) {
            if (!m.has(l.date)) m.set(l.date, new Set());
            m.get(l.date).add(l.task_id);
        }
        return m;
    }

    function isDayFull(dayLogs, activeTasks) {
        if (!dayLogs) return false;
        for (const t of activeTasks) if (!dayLogs.has(t.id)) return false;
        return activeTasks.length > 0;
    }

    /**
     * 連勝（包含今日；若今日尚未達標則從昨天起算）
     * 回傳 { current, longest }
     */
    function computeStreak(tasks, logs) {
        const activeTasks = tasks.filter(t => t.active !== false);
        if (activeTasks.length === 0) return { current: 0, longest: 0 };
        const byDate = completionsByDate(logs);
        const today = todayStr();
        const todayFull = isDayFull(byDate.get(today), activeTasks);
        let cursor = today;
        if (!todayFull) cursor = dateStrOf(addDays(dateFromStr(today), -1));

        let current = 0;
        while (isDayFull(byDate.get(cursor), activeTasks)) {
            current++;
            cursor = dateStrOf(addDays(dateFromStr(cursor), -1));
        }

        // longest: scan all dates in byDate + check consecutive runs
        const allDates = Array.from(byDate.keys()).filter(d => isDayFull(byDate.get(d), activeTasks)).sort();
        let longest = 0;
        let run = 0;
        let prev = null;
        for (const d of allDates) {
            if (prev && diffDays(prev, d) === 1) run++;
            else run = 1;
            if (run > longest) longest = d > today ? longest : run;
            prev = d;
        }
        if (current > longest) longest = current;
        return { current, longest };
    }

    /**
     * 75 Hard 狀態
     * @returns {day, length, failedDate|null, hardcore, startStr}
     */
    function challengeStatus(tasks, logs, meta) {
        const activeTasks = tasks.filter(t => t.active !== false);
        const startStr = meta.challenge_start ? String(meta.challenge_start).slice(0, 10) : null;
        const length = Number(meta.challenge_length) || 75;
        const hardcore = meta.hardcore === true || String(meta.hardcore).toLowerCase() === 'true';

        if (!startStr) return { startStr: null, day: 0, length, failedDate: null, hardcore, completed: false };

        const today = todayStr();
        const byDate = completionsByDate(logs);
        const dayNum = diffDays(startStr, today) + 1; // 1-based

        let failedDate = null;
        // iterate every day from start to yesterday; today is ongoing until end of day
        let cursor = startStr;
        while (cursor < today) {
            if (!isDayFull(byDate.get(cursor), activeTasks)) { failedDate = cursor; break; }
            cursor = dateStrOf(addDays(dateFromStr(cursor), 1));
        }

        const completed = dayNum > length && !failedDate;
        return { startStr, day: Math.max(1, Math.min(dayNum, length + 1)), length, failedDate, hardcore, completed };
    }

    /** 本週 / 本月 / 近 30 天統計 */
    function computeStats(tasks, logs) {
        const activeTasks = tasks.filter(t => t.active !== false);
        const totalPerDay = activeTasks.length || 1;
        const byDate = completionsByDate(logs);
        const today = todayStr();

        function completionRate(fromStr, toStr) {
            let done = 0, total = 0;
            let cur = fromStr;
            while (cur <= toStr) {
                total += totalPerDay;
                const s = byDate.get(cur);
                if (s) {
                    for (const t of activeTasks) if (s.has(t.id)) done++;
                }
                cur = dateStrOf(addDays(dateFromStr(cur), 1));
            }
            return { done, total, rate: total ? done / total : 0 };
        }

        const wStart = DQ.Util.weekStart(today);
        const mStart = DQ.Util.monthStart(today);
        const t30Start = dateStrOf(addDays(dateFromStr(today), -29));

        const week = completionRate(wStart, today);
        const month = completionRate(mStart, today);
        const last30 = completionRate(t30Start, today);

        let perfectMonth = 0;
        let cur = mStart;
        while (cur <= today) {
            if (isDayFull(byDate.get(cur), activeTasks)) perfectMonth++;
            cur = dateStrOf(addDays(dateFromStr(cur), 1));
        }

        return { week, month, last30, perfectMonth };
    }

    /** 單一任務的近 N 天完成比例 */
    function taskHistory(taskId, logs, days) {
        const today = todayStr();
        const out = [];
        const byDate = completionsByDate(logs);
        for (let i = days - 1; i >= 0; i--) {
            const d = dateStrOf(addDays(dateFromStr(today), -i));
            const s = byDate.get(d);
            out.push({ date: d, done: !!(s && s.has(taskId)) });
        }
        const done = out.filter(x => x.done).length;
        return { days: out, rate: out.length ? done / out.length : 0 };
    }

    /** 成就定義與解鎖判斷 */
    const ACHIEVEMENTS = [
        { id: 'first',       icon: '✨', name: '第一步',           desc: '完成第一次打卡' },
        { id: 'streak_3',    icon: '🔥', name: '三日連勝',         desc: '連續 3 天全勤' },
        { id: 'streak_7',    icon: '🔥', name: '七日連勝',         desc: '連續 7 天全勤' },
        { id: 'streak_30',   icon: '🌟', name: '三十日連勝',       desc: '連續 30 天全勤' },
        { id: 'streak_75',   icon: '🏆', name: '75 Hard 鐵人',     desc: '連續 75 天全勤' },
        { id: 'count_10',    icon: '🎯', name: '累積 10 次',       desc: '累計打卡 10 次' },
        { id: 'count_100',   icon: '💯', name: '累積 100 次',      desc: '累計打卡 100 次' },
        { id: 'count_500',   icon: '🚀', name: '累積 500 次',      desc: '累計打卡 500 次' },
        { id: 'early_bird',  icon: '🌅', name: '早起鳥',           desc: '在 06:00 前打卡' },
        { id: 'night_owl',   icon: '🌙', name: '夜貓子',           desc: '在 23:00 後打卡' },
        { id: 'perfect_wk',  icon: '📅', name: '完美週',           desc: '單週每天全勤' },
    ];

    function computeAchievements(tasks, logs) {
        const activeTasks = tasks.filter(t => t.active !== false);
        const byDate = completionsByDate(logs);
        const { current, longest } = computeStreak(tasks, logs);
        const count = logs.length;
        const early = logs.some(l => {
            const m = /T(\d{2}):/.exec(l.completed_at || '');
            return m && Number(m[1]) < 6;
        });
        const night = logs.some(l => {
            const m = /T(\d{2}):/.exec(l.completed_at || '');
            return m && Number(m[1]) >= 23;
        });

        // perfect week: any 7-consecutive-day window of full days
        let perfectWeek = false;
        const allDates = Array.from(byDate.keys()).sort();
        for (let i = 0; i + 6 < allDates.length; i++) {
            const startD = allDates[i];
            // check 7 consecutive days from startD
            let ok = true;
            for (let k = 0; k < 7; k++) {
                const d = dateStrOf(addDays(dateFromStr(startD), k));
                if (!isDayFull(byDate.get(d), activeTasks)) { ok = false; break; }
            }
            if (ok) { perfectWeek = true; break; }
        }

        const unlocked = new Set();
        if (count >= 1) unlocked.add('first');
        if (longest >= 3) unlocked.add('streak_3');
        if (longest >= 7) unlocked.add('streak_7');
        if (longest >= 30) unlocked.add('streak_30');
        if (longest >= 75) unlocked.add('streak_75');
        if (count >= 10) unlocked.add('count_10');
        if (count >= 100) unlocked.add('count_100');
        if (count >= 500) unlocked.add('count_500');
        if (early) unlocked.add('early_bird');
        if (night) unlocked.add('night_owl');
        if (perfectWeek) unlocked.add('perfect_wk');

        return ACHIEVEMENTS.map(a => ({ ...a, unlocked: unlocked.has(a.id) }));
    }

    DQ.Game = {
        xpForLevel, levelFromXp, titleForLevel, totalXp,
        completionsByDate, isDayFull,
        computeStreak, challengeStatus, computeStats, taskHistory,
        ACHIEVEMENTS, computeAchievements,
    };
})(window.DQ);
