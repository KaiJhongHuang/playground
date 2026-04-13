/* Daily Quest — util */
window.DQ = window.DQ || {};

(function (DQ) {
    const WEEKDAYS_TC = ['日', '一', '二', '三', '四', '五', '六'];

    function pad(n) { return String(n).padStart(2, '0'); }

    function dateStrOf(d) {
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }

    function todayStr() { return dateStrOf(new Date()); }

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

    function formatHeaderToday() {
        const d = new Date();
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}（週${WEEKDAYS_TC[d.getDay()]}）`;
    }

    function formatTime(isoStr) {
        if (!isoStr) return '';
        const m = /T(\d{2}):(\d{2})/.exec(String(isoStr));
        if (m) return `${m[1]}:${m[2]}`;
        const d = new Date(isoStr);
        return isNaN(d) ? '' : `${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    function dateFromStr(dstr) {
        const [y, m, d] = dstr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function addDays(d, n) {
        const nd = new Date(d);
        nd.setDate(nd.getDate() + n);
        return nd;
    }

    function diffDays(aStr, bStr) {
        // days from a to b (b - a) using local dates
        const a = dateFromStr(aStr);
        const b = dateFromStr(bStr);
        return Math.round((b - a) / 86400000);
    }

    // Monday as start-of-week (ISO). Returns YYYY-MM-DD of the Monday.
    function weekStart(dstr) {
        const d = dateFromStr(dstr);
        const wd = (d.getDay() + 6) % 7; // Mon=0..Sun=6
        return dateStrOf(addDays(d, -wd));
    }

    function monthStart(dstr) {
        const d = dateFromStr(dstr);
        return dateStrOf(new Date(d.getFullYear(), d.getMonth(), 1));
    }

    function $(id) { return document.getElementById(id); }

    function show(id) { const el = $(id); if (el) el.classList.remove('hidden'); }
    function hide(id) { const el = $(id); if (el) el.classList.add('hidden'); }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
        }[c]));
    }

    function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

    DQ.Util = {
        WEEKDAYS_TC,
        pad, dateStrOf, todayStr, nowIso, formatHeaderToday, formatTime,
        dateFromStr, addDays, diffDays, weekStart, monthStart,
        $, show, hide, escapeHtml, clamp,
    };
})(window.DQ);
