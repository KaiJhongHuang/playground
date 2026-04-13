/* Daily Quest — api */
window.DQ = window.DQ || {};

(function (DQ) {
    async function api(action, params = {}) {
        if (typeof window.__DEMO_API__ === 'function') {
            return await window.__DEMO_API__(action, params);
        }
        if (!DQ.state.apiUrl) throw new Error('Apps Script URL 未設定');
        const url = new URL(DQ.state.apiUrl);
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

    DQ.api = api;
})(window.DQ);
