// 产品库存管理系统 v3 - 含登录认证 + 权限控制 + 员工管理
// 零依赖：仅用 Node.js 内置 http/fs/crypto 模块
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const HTML_FILE = path.join(__dirname, '产品库存管理系统.html');

// ============================
// 初始数据
// ============================
const INITIAL_PRODUCTS = [
  [1,"BAS造型粉50ml",100,"50ml",58,"BAS-护肤"],
  [2,"BAS海盐喷雾170ml",100,"170ml",221,"BAS-造型"],
  [3,"BAS海盐喷雾200ml",100,"200ml",250,"BAS-造型"],
  [4,"BAS发泥白色",100,"90ml",148,"BAS-造型"],
  [5,"BAS发泥黑色",100,"90ml",145,"BAS-造型"],
  [6,"BAS牛脂乳100ML",100,"100ML",148,"BAS-护肤"],
  [7,"BAS头发精华液",100,"50ml",230,"BAS-护肤"],
  [8,"BAS卷发霜200ml",100,"200ml",237,"BAS-造型"],
  [9,"BAS护发素200ml",100,"200ml",231,"BAS-洗护"],
  [10,"BAS洗发水250ml",100,"250ml",307,"BAS-洗护"],
  [11,"BAS护发素250ml",100,"250ml",307,"BAS-洗护"],
  [12,"BAS沐浴露250ml",100,"250ml",309,"BAS-洗护"],
  [13,"BAS洗面奶200ml",100,"200ml",256,"BAS-洗护"],
  [14,"BAS保湿霜200ml",100,"200ml",253,"BAS-护肤"],
  [15,"BAS香体膏Guava Nectar",100,"75g",153,"香体止汗"],
  [16,"BAS香体膏Santal Sandwood",100,"75g",157,"香体止汗"],
  [17,"BAS眼部精华15ml",100,"15ml",90,"眼部/精华"],
  [18,"BAS卷发喷雾200ml(杏色)",100,"200ml",254,"BAS-造型"],
  [19,"BAS护发素200ml(杏色)",100,"200ml",231,"BAS-洗护"],
  [20,"BAS卷发霜200ml（软管）",100,"200ml",247,"BAS-造型"],
  [21,"BAS卷发慕斯200ml",100,"200ml",268,"BAS-造型"],
  [22,"BAS卷发啫喱200ml",100,"200ml",282,"BAS-造型"],
  [23,"BAS洗发水355ml",100,"355ml",413,"BAS-洗护"],
  [24,"BAS护发素355ml",100,"355ml",380,"BAS-洗护"],
  [25,"N眼霜40ml（白盖）",100,"40ml",53,"眼部/精华"],
  [26,"N眼霜40ml（透明盖）",100,"40ml",53,"眼部/精华"],
  [27,"眼部啫喱10ml（G）",100,"10ml",38,"眼部/精华"],
  [28,"眼部啫喱10ml（无标）",100,"10ml",38,"眼部/精华"],
  [29,"DR.EFF眼部啫喱10ml",100,"10ml",38,"眼部/精华"],
  [30,"姜黄撕拉面膜（M）",100,"75ml",107,"面膜系列"],
  [31,"姜黄撕拉面膜（无标）",100,"75ml",107,"面膜系列"],
  [32,"撕拉面膜（C）",100,"75ml",107,"面膜系列"],
  [33,"粉色撕拉面膜（M）",100,"75ml",98,"面膜系列"],
  [34,"粉色撕拉面膜（无标）",100,"75ml",110,"面膜系列"],
  [35,"防晒乳LN110",100,"50ml",78,"防晒系列"],
  [36,"防晒乳LP110",100,"50ml",78,"防晒系列"],
  [37,"防晒乳MY210",100,"50ml",78,"防晒系列"],
  [38,"2N遮瑕膏100ml",100,"100ml",116.8,"彩妆/防晒"],
  [39,"M防晒霜55ml",100,"55ml",80,"防晒系列"],
  [40,"L防晒霜55ml",100,"55ml",80,"防晒系列"],
  [41,"F防晒霜55ml",100,"55ml",80,"防晒系列"],
  [42,"M防晒霜55ml（无标）",100,"55ml",80,"防晒系列"],
  [43,"L防晒霜55ml（无标）",100,"55ml",80,"防晒系列"],
  [44,"黄色防晒棒",100,"19g",0,"防晒系列"],
  [45,"润肤膏（M)",100,"10g","39g","护肤膏霜"],
  [46,"润肤膏（无标)",100,"10g","39g","护肤膏霜"],
  [47,"N防晒霜50ml",100,"50ml","70g","N系列"],
  [48,"眼膜（M）",100,"85g","178.6g","眼部/精华"],
  [49,"红色精华液（M）",100,"30ml","140g","眼部/精华"],
  [50,"粉色精华液（M)",100,"30ml","140g","眼部/精华"],
  [51,"3H精华液（M）",100,"20ml","92g","眼部/精华"],
  [52,"DA护发素250ml",100,"250ml","267g","DA系列"],
  [53,"DA洗发水200ml",100,"280ml","362g","DA系列"],
  [54,"Y香水50ml",100,"50ml","217g","香水"],
  [55,"HIS漱口水237ml",100,"237ml","289g","口腔护理"],
  [56,"防晒霜50ml（M）",100,"50ml","67g","防晒系列"],
  [57,"黄色止汗膏（M）",100,"83g","173g","香体止汗"],
  [58,"YU撕拉面膜",100,"75ml","110g","面膜系列"],
  [59,"RO护足霜50g",100,"50g","69g","护肤膏霜"],
  [60,"DE白色打底液8ml",100,"8ml",23,"DE/DM系列"],
  [61,"DE黑色睫毛膏",100,"8ml",23,"DE/DM系列"],
  [62,"大豆面霜（M）",100,"50ml",70,"大豆系列"],
  [63,"大豆面霜（无标）",100,"50ml",70,"大豆系列"],
  [64,"DM精华液30ml",100,"30ml",148.7,"DE/DM系列"],
  [65,"DM眼霜膏",100,"9g",36.5,"DE/DM系列"],
  [66,"DE眼霜膏",100,"9g",36.5,"DE/DM系列"],
  [67,"疤痕膏",100,"50ml",154.7,"护肤膏霜"],
  [68,"MDP太阳棒",100,"15g",56,"防晒系列"],
  [69,"DR.EFFECTIVE 太阳棒",100,"15g",56,"防晒系列"],
];

// 默认员工账号（密码为密码+用户名做简单哈希，初始密码见 README）
function hashPwd(pwd, salt) {
  return crypto.createHash('sha256').update(pwd + salt).digest('hex');
}

function defaultEmployees() {
  return [
    {
      id: 1, username: 'admin', password: hashPwd('admin123', 'admin'),
      name: '系统管理员', role: 'admin',
      permissions: { viewColumns: ['*'], actions: ['*'], tabs: ['*'] },
      active: true, createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 2, username: 'manager', password: hashPwd('manager123', 'manager'),
      name: '仓库主管', role: 'manager',
      permissions: { viewColumns: ['*'], actions: ['*'], tabs: ['*'] },
      active: true, createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 3, username: 'staff01', password: hashPwd('staff123', 'staff01'),
      name: '仓库员工A', role: 'staff',
      permissions: {
        viewColumns: ['id','name','category','stock','capacity','out','in','alertLine'], // 看不到单重
        actions: ['out','in'], // 只能出入库
        tabs: ['inventory','alerts','activity'] // 看不到分类统计、流水管理
      },
      active: true, createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 4, username: 'viewer', password: hashPwd('view123', 'viewer'),
      name: '查看员', role: 'viewer',
      permissions: {
        viewColumns: ['id','name','category','stock','capacity'],
        actions: [], // 不能操作
        tabs: ['inventory']
      },
      active: true, createdAt: '2026-01-01T00:00:00Z'
    },
  ];
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const products = INITIAL_PRODUCTS.map(p => ({
      id: p[0], name: p[1], stock: p[2], capacity: String(p[3]),
      weight: p[4], category: p[5],
      alertLine: 1000, todayOut: 0, todayIn: 0
    }));
    const data = {
      products, logs: [], nextId: 70, alertThreshold: 1000,
      lastUpdated: new Date().toISOString(),
      employees: defaultEmployees(),
      nextEmpId: 5,
      sessions: {}
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
  catch(e) { fs.unlinkSync(DATA_FILE); return loadData(); }
}

function saveData(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = loadData();

// ============================
// Session 管理（简易 token）
// ============================
function createSession(empId) {
  const token = crypto.randomBytes(16).toString('hex');
  db.sessions[token] = { empId, createdAt: Date.now() };
  // 清理过期session (24h)
  const now = Date.now();
  Object.keys(db.sessions).forEach(t => { if (now - db.sessions[t].createdAt > 86400000) delete db.sessions[t]; });
  saveData(db);
  return token;
}

function getSessionEmp(token) {
  if (!token || !db.sessions[token]) return null;
  const s = db.sessions[token];
  if (Date.now() - s.createdAt > 86400000) { delete db.sessions[token]; return null; }
  return db.employees.find(e => e.id === s.empId) || null;
}

function authRequired(req, res) {
  const token = (req.headers.authorization || '').replace('Bearer ', '') ||
                (req.url.includes('token=') ? new URLSearchParams(req.url.split('?')[1]||'').get('token') : null);
  const emp = getSessionEmp(token);
  if (!emp || !emp.active) return null;
  return emp;
}

// ============================
// HTTP 服务器
// ============================
const MIME = { '.html':'text/html; charset=utf-8', '.js':'application/javascript', '.json':'application/json', '.css':'text/css', '.csv':'text/csv; charset=utf-8' };

const server = http.createServer((req, res) => {
  const [pathOnly, queryStr] = req.url.split('?');
  console.log(`${new Date().toISOString().slice(11,19)} ${req.method} ${pathOnly}`);

  // API 路由
  if (pathOnly.startsWith('/api/')) return handleAPI(req, res, pathOnly, queryStr || '');

  // 静态文件
  if (pathOnly === '/' || pathOnly === '/index.html') return serveFile(res, HTML_FILE, '.html');
  const safePath = path.join(__dirname, pathOnly);
  if (safePath.startsWith(__dirname) && fs.existsSync(safePath)) return serveFile(res, safePath, path.extname(safePath));
  return serveFile(res, HTML_FILE, '.html'); // SPA fallback
});

function serveFile(res, filepath, ext) {
  try {
    const content = fs.readFileSync(filepath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch(e) { res.writeHead(404); res.end('Not Found'); }
}

// ============================
// API 处理
// ============================
function handleAPI(req, res, url, queryStr) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const data = body ? JSON.parse(body || '{}') : {};
    const params = new URLSearchParams(queryStr);
    const token = params.get('token') || (req.headers.authorization || '').replace('Bearer ', '');
    const emp = getSessionEmp(token);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }

    try {
      // ===== 认证 =====
      // POST /api/login
      if (url === '/api/login' && req.method === 'POST') {
        const { username, password } = data;
        if (!username || !password) return errorRes(res, 400, '请输入用户名和密码');
        const emp_ = db.employees.find(e => e.username === username && e.active);
        if (!emp_) return errorRes(res, 401, '账号不存在或已停用');
        const pwdHash = hashPwd(password, username);
        if (emp_.password !== pwdHash) return errorRes(res, 401, '密码错误');
        const t = createSession(emp_.id);
        return jsonRes(res, 200, {
          token: t, user: { id: emp_.id, name: emp_.name, username: emp_.username, role: emp_.role, permissions: emp_.permissions }
        });
      }

      // POST /api/logout
      if (url === '/api/logout' && req.method === 'POST') {
        if (token && db.sessions[token]) delete db.sessions[token];
        saveData(db);
        return jsonRes(res, 200, { success: true });
      }

      // GET /api/me
      if (url === '/api/me' && req.method === 'GET') {
        if (!emp) return errorRes(res, 401, '未登录');
        return jsonRes(res, 200, { user: { id: emp.id, name: emp.name, username: emp.username, role: emp.role, permissions: emp.permissions } });
      }

      // 以下接口需要登录
      if (!emp) return errorRes(res, 401, '请先登录');

      // ===== 数据读取（受权限控制）=====
      // GET /api/data
      if (url === '/api/data' && req.method === 'GET') {
        const perms = emp.permissions;
        const allowedCols = perms.viewColumns.includes('*') ? null : new Set(perms.viewColumns);
        let prods = db.products;
        // 按权限过滤列（前端也会做二次过滤）
        const filtered = prods.map(p => {
          if (allowedCols) {
            const o = { id: p.id, name: p.name };
            if (allowedCols.has('category')) o.category = p.category;
            if (allowedCols.has('stock')) o.stock = p.stock;
            if (allowedCols.has('capacity')) o.capacity = p.capacity;
            if (allowedCols.has('weight')) o.weight = p.weight;
            if (allowedCols.has('alertLine')) o.alertLine = p.alertLine;
            return o;
          }
          return p;
        });
        return jsonRes(res, 200, {
          products: filtered,
          logs: (perms.tabs.includes('*') || perms.tabs.includes('logs')) ? db.logs.slice(-200) : [],
          alertThreshold: db.alertThreshold,
          lastUpdated: db.lastUpdated,
          user: { id: emp.id, name: emp.name, role: emp.role, permissions: emp.permissions }
        });
      }

      // GET /api/version
      if (url === '/api/version' && req.method === 'GET') {
        return jsonRes(res, 200, { lastUpdated: db.lastUpdated, count: db.products.length });
      }

      // ===== 出入库（需权限）=====
      const canOut = emp.permissions.actions.includes('*') || emp.permissions.actions.includes('out');
      const canIn = emp.permissions.actions.includes('*') || emp.permissions.actions.includes('in');

      // POST /api/transaction
      if (url === '/api/transaction' && req.method === 'POST') {
        const { productId, type, qty, note } = data;
        if (!productId || !type || !qty) return errorRes(res, 400, '参数不完整');
        if (qty <= 0) return errorRes(res, 400, '数量必须大于0');
        if (type === 'out' && !canOut) return errorRes(res, 403, '你没有出库权限');
        if (type === 'in' && !canIn) return errorRes(res, 403, '你没有入库权限');
        const p = db.products.find(x => x.id === productId);
        if (!p) return errorRes(res, 404, '产品不存在');
        const before = p.stock;
        if (type === 'out') {
          if (qty > p.stock) return errorRes(res, 400, `库存不足，当前 ${p.stock}`);
          p.stock -= qty; p.todayOut += qty;
        } else if (type === 'in') { p.stock += qty; p.todayIn += qty; }
        db.logs.push({ id: Date.now(), time: new Date().toISOString(), productId, productName: p.name, type, qty: type==='out'?-qty:qty, before, after: p.stock, operator: emp.name, note: note||'' });
        if (db.logs.length > 5000) db.logs = db.logs.slice(-5000);
        saveData(db);
        return jsonRes(res, 200, { success: true, product: p });
      }

      // POST /api/batch
      if (url === '/api/batch' && req.method === 'POST') {
        const { type, productIds, qty, note } = data;
        if (!canOut && type === 'out') return errorRes(res, 403, '你没有出库权限');
        if (!canIn && type === 'in') return errorRes(res, 403, '你没有入库权限');
        if (!type || !productIds || !qty) return errorRes(res, 400, '参数不完整');
        const results = [];
        for (const pid of productIds) {
          const p = db.products.find(x => x.id === pid);
          if (!p) { results.push({ id: pid, error: '产品不存在' }); continue; }
          const before = p.stock;
          if (type === 'out') {
            if (qty > p.stock) { results.push({ id: pid, name: p.name, error: '库存不足' }); continue; }
            p.stock -= qty; p.todayOut += qty;
          } else { p.stock += qty; p.todayIn += qty; }
          db.logs.push({ id: Date.now()+pid, time: new Date().toISOString(), productId: pid, productName: p.name, type, qty: type==='out'?-qty:qty, before, after: p.stock, operator: emp.name, note: note||'批量' });
          results.push({ id: pid, name: p.name, success: true, stock: p.stock });
        }
        saveData(db);
        return jsonRes(res, 200, { success: true, results });
      }

      // ===== 管理员专属 =====
      const isAdmin = emp.role === 'admin';

      // PUT /api/product/:id
      const putMatch = url.match(/^\/api\/product\/(\d+)$/);
      if (putMatch && req.method === 'PUT') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可修改产品');
        const id = parseInt(putMatch[1]);
        const p = db.products.find(x => x.id === id);
        if (!p) return errorRes(res, 404, '产品不存在');
        if (data.name !== undefined) p.name = data.name;
        if (data.stock !== undefined) p.stock = data.stock;
        if (data.capacity !== undefined) p.capacity = String(data.capacity);
        if (data.weight !== undefined) p.weight = data.weight;
        if (data.category !== undefined) p.category = data.category;
        if (data.alertLine !== undefined) p.alertLine = data.alertLine;
        saveData(db);
        return jsonRes(res, 200, { success: true, product: p });
      }

      // POST /api/product
      if (url === '/api/product' && req.method === 'POST') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可新增产品');
        if (!data.name) return errorRes(res, 400, '产品名称必填');
        const p = { id: db.nextId++, name: data.name, stock: data.stock||0, capacity: String(data.capacity||''), weight: data.weight||'', category: data.category||'其他', alertLine: data.alertLine||db.alertThreshold, todayOut:0, todayIn:0 };
        db.products.push(p);
        saveData(db);
        return jsonRes(res, 200, { success: true, product: p });
      }

      // DELETE /api/product/:id
      const delMatch = url.match(/^\/api\/product\/(\d+)$/);
      if (delMatch && req.method === 'DELETE') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可删除产品');
        const id = parseInt(delMatch[1]);
        const idx = db.products.findIndex(x => x.id === id);
        if (idx === -1) return errorRes(res, 404, '产品不存在');
        const removed = db.products.splice(idx, 1)[0];
        saveData(db);
        return jsonRes(res, 200, { success: true, removed });
      }

      // PUT /api/threshold
      if (url === '/api/threshold' && req.method === 'PUT') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可修改阈值');
        if (!data.threshold || data.threshold < 0) return errorRes(res, 400, '无效阈值');
        db.alertThreshold = parseInt(data.threshold);
        db.products.forEach(p => { p.alertLine = db.alertThreshold; });
        saveData(db);
        return jsonRes(res, 200, { success: true, threshold: db.alertThreshold });
      }

      // ===== 员工管理（仅 admin）=====
      // GET /api/employees
      if (url === '/api/employees' && req.method === 'GET') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可查看员工');
        const list = db.employees.map(e => ({ id: e.id, username: e.username, name: e.name, role: e.role, permissions: e.permissions, active: e.active, createdAt: e.createdAt }));
        return jsonRes(res, 200, { employees: list });
      }

      // POST /api/employees
      if (url === '/api/employees' && req.method === 'POST') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可添加员工');
        const { username, password, name, role, permissions } = data;
        if (!username || !password || !name) return errorRes(res, 400, '用户名/密码/姓名必填');
        if (db.employees.find(e => e.username === username)) return errorRes(res, 400, '用户名已存在');
        const emp_ = {
          id: db.nextEmpId++, username,
          password: hashPwd(password, username),
          name, role: role || 'staff',
          permissions: permissions || { viewColumns: ['*'], actions: ['out','in'], tabs: ['inventory','alerts','activity'] },
          active: true, createdAt: new Date().toISOString()
        };
        db.employees.push(emp_);
        saveData(db);
        return jsonRes(res, 200, { success: true, employee: { id: emp_.id, username, name, role } });
      }

      // PUT /api/employees/:id
      const empPutMatch = url.match(/^\/api\/employees\/(\d+)$/);
      if (empPutMatch && req.method === 'PUT') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可修改员工');
        const id = parseInt(empPutMatch[1]);
        const e = db.employees.find(x => x.id === id);
        if (!e) return errorRes(res, 404, '员工不存在');
        if (data.name !== undefined) e.name = data.name;
        if (data.role !== undefined) e.role = data.role;
        if (data.permissions !== undefined) e.permissions = data.permissions;
        if (data.active !== undefined) e.active = data.active;
        if (data.password) e.password = hashPwd(data.password, e.username);
        saveData(db);
        return jsonRes(res, 200, { success: true });
      }

      // DELETE /api/employees/:id
      const empDelMatch = url.match(/^\/api\/employees\/(\d+)$/);
      if (empDelMatch && req.method === 'DELETE') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可删除员工');
        const id = parseInt(empDelMatch[1]);
        if (id === emp.id) return errorRes(res, 400, '不能删除自己');
        const idx = db.employees.findIndex(x => x.id === id);
        if (idx === -1) return errorRes(res, 404, '员工不存在');
        db.employees[idx].active = false;
        saveData(db);
        return jsonRes(res, 200, { success: true });
      }

      // POST /api/reset
      if (url === '/api/reset' && req.method === 'POST') {
        if (!isAdmin) return errorRes(res, 403, '仅管理员可重置');
        if (data.confirm !== 'YES') return errorRes(res, 400, '需要确认');
        if (fs.existsSync(DATA_FILE)) fs.unlinkSync(DATA_FILE);
        db = loadData();
        return jsonRes(res, 200, { success: true, message: '已重置' });
      }

      // GET /api/export
      if (url === '/api/export' && req.method === 'GET') {
        const lines = [
          '\uFEFF序号,产品名称,库存,容量,单重(g),分类,预警值,是否预警,状态,今日出库,今日入库',
          ...db.products.map(p => {
            const isA = p.stock <= db.alertThreshold;
            let st = '充足';
            if (p.stock <= db.alertThreshold*0.1) st = '紧急补货';
            else if (p.stock <= db.alertThreshold*0.3) st = '严重偏低';
            else if (p.stock <= db.alertThreshold) st = '预警';
            return `${p.id},"${p.name}",${p.stock},"${p.capacity}",${p.weight},"${p.category}",${p.alertLine},"${isA?'是':'否'}","${st}",${p.todayOut},${p.todayIn}`;
          })
        ].join('\n');
        res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="inventory_${Date.now()}.csv"` });
        return res.end(lines);
      }

      return errorRes(res, 404, 'API 不存在');
    } catch(e) {
      console.error('API Error:', e);
      return errorRes(res, 500, '服务器内部错误');
    }
  });
}

function jsonRes(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); }
function errorRes(res, code, msg) { jsonRes(res, code, { error: msg }); }

// 启动
server.listen(PORT, () => {
  console.log(`📦 库存管理系统 v3 已启动 (端口 ${PORT})`);
  console.log(`👤 默认管理员: admin / admin123`);
});
