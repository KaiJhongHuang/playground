/**
 * Daily Quest — Google Apps Script 後端
 *
 * 使用方式：
 *   1. 建立一個 Google Sheet
 *   2. 選單「擴充功能」→「Apps Script」
 *   3. 把本檔案內容整份貼上，儲存
 *   4. 點「部署」→「新增部署作業」→類型「網頁應用程式」
 *      - 執行身分：我
 *      - 存取權：「任何人」
 *   5. 複製「Web App URL」，貼到 Daily Quest 網頁的設定欄位
 *
 * 初次部署會跳權限請求，接受即可（僅存取此 Sheet）。
 */

const SHEETS = {
  TASKS: 'Tasks',
  LOGS: 'Logs',
  META: 'Meta',
};

const TASKS_HEADER = ['id', 'name', 'icon', 'xp', 'active', 'order'];
const LOGS_HEADER = ['id', 'task_id', 'date', 'completed_at', 'note'];
const META_HEADER = ['key', 'value'];

function doGet(e) {
  try {
    ensureSheets_();
    const action = (e && e.parameter && e.parameter.action) || 'bootstrap';

    if (action === 'bootstrap') {
      return json_(bootstrap_());
    }
    if (action === 'complete') {
      return json_(complete_({
        task_id: e.parameter.task_id,
        completed_at: e.parameter.completed_at,
        date: e.parameter.date,
        note: e.parameter.note || '',
      }));
    }
    if (action === 'logs') {
      return json_({ logs: logsBetween_(e.parameter.from, e.parameter.to) });
    }
    return json_({ error: 'unknown action: ' + action });
  } catch (err) {
    return json_({ error: String((err && err.message) || err) });
  }
}

// POST 也轉到 doGet，身分待 Phase 5 時再分開
function doPost(e) {
  return doGet(e);
}

/* ---------- sheet helpers ---------- */

function ensureSheets_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let tasks = ss.getSheetByName(SHEETS.TASKS);
  if (!tasks) {
    tasks = ss.insertSheet(SHEETS.TASKS);
    tasks.appendRow(TASKS_HEADER);
    tasks.appendRow(['t1', '練功',  '🧘', 10, true, 1]);
    tasks.appendRow(['t2', '慢跑',  '🏃', 15, true, 2]);
    tasks.appendRow(['t3', '重訓',  '🏋️', 20, true, 3]);
  }

  let logs = ss.getSheetByName(SHEETS.LOGS);
  if (!logs) {
    logs = ss.insertSheet(SHEETS.LOGS);
    logs.appendRow(LOGS_HEADER);
    // 強制 date / completed_at 欄為純文字，避免 Sheets 自動轉 Date
    logs.getRange(1, 3, logs.getMaxRows(), 2).setNumberFormat('@');
  }

  let meta = ss.getSheetByName(SHEETS.META);
  if (!meta) {
    meta = ss.insertSheet(SHEETS.META);
    meta.appendRow(META_HEADER);
    meta.appendRow(['challenge_start', todayStr_()]);
    meta.appendRow(['challenge_length', 75]);
    meta.appendRow(['hardcore', false]);
  }
}

function readSheet_(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(name);
  if (!sh) return [];
  const data = sh.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).filter(row => row.some(c => c !== '' && c !== null)).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
  });
}

function normalizeLogRow_(r) {
  return {
    id: String(r.id),
    task_id: String(r.task_id),
    date: toDateStr_(r.date),
    completed_at: toIsoStr_(r.completed_at),
    note: r.note || '',
  };
}

function normalizeTaskRow_(r) {
  return {
    id: String(r.id),
    name: String(r.name),
    icon: String(r.icon || ''),
    xp: Number(r.xp) || 0,
    active: r.active === true || String(r.active).toLowerCase() === 'true',
    order: Number(r.order) || 0,
  };
}

function bootstrap_() {
  const tasks = readSheet_(SHEETS.TASKS)
    .map(normalizeTaskRow_)
    .filter(t => t.active)
    .sort((a, b) => a.order - b.order);

  const ninety = new Date();
  ninety.setDate(ninety.getDate() - 90);
  const fromStr = formatDate_(ninety);

  const logs = readSheet_(SHEETS.LOGS)
    .map(normalizeLogRow_)
    .filter(l => l.date >= fromStr);

  const meta = {};
  readSheet_(SHEETS.META).forEach(r => { meta[String(r.key)] = r.value; });

  return { tasks, logs, meta };
}

function complete_(body) {
  if (!body.task_id) throw new Error('task_id required');
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEETS.LOGS);
  const id = Utilities.getUuid();
  const completedAt = body.completed_at || new Date().toISOString();
  const date = body.date || completedAt.slice(0, 10);
  sh.appendRow([id, body.task_id, date, completedAt, body.note || '']);
  return {
    ok: true,
    log: { id, task_id: body.task_id, date, completed_at: completedAt, note: body.note || '' },
  };
}

function logsBetween_(from, to) {
  const f = from || '0000-00-00';
  const t = to || '9999-99-99';
  return readSheet_(SHEETS.LOGS).map(normalizeLogRow_).filter(l => l.date >= f && l.date <= t);
}

/* ---------- util ---------- */

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function todayStr_() {
  return formatDate_(new Date());
}

function formatDate_(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function toDateStr_(v) {
  if (v instanceof Date) return formatDate_(v);
  return String(v);
}

function toIsoStr_(v) {
  if (v instanceof Date) return v.toISOString();
  return String(v);
}
