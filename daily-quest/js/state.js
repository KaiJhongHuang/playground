/* Daily Quest — shared state */
window.DQ = window.DQ || {};

DQ.state = {
    apiUrl: '',
    tasks: [],
    logs: [],
    meta: {},
    completing: new Set(),
    activeTab: 'today',
    selectedTaskId: null,
};

DQ.LS_URL_KEY = 'daily-quest:api-url';
DQ.HISTORY_DAYS = 30;
DQ.HEATMAP_WEEKS = 26;
DQ.TASK_CHART_DAYS = 60;
