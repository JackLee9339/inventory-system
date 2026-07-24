// 产品库存管理系统 - 零依赖版（仅用 Node.js 内置模块）
// 这样部署到 Railway 时不需要 npm install，避免依赖问题
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');
const HTML_FILE = path.join(__dirname, '产品库存管理系统.html');

// ============================
// 初始数据（69种产品）
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

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    const products = INITIAL_PRODUCTS.map(p => ({
      id: p[0], name: p[1], stock: p[2], capacity: String(p[3]),
      weight: p[4], category: p[5],
      alertLine: 1000, todayOut: 0, todayIn: 0
    }));
    const data = { products, logs: [], nextId: 70, alertThreshold: 1000, lastUpdated: new Date().toISOString() };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch(e) {
    fs.unlinkSync(DATA_FILE);
    return loadData();
  }
}

function saveData(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = loadData();

// ============================
// HTTP 服务器
// ============================
const MIME = { '.html':'text/html; charset=utf-8', '.js':'application/javascript', '.json':'application/json', '.css':'text/css', '.csv':'text/csv; charset=utf-8' };

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  console.log(`${new Date().toISOString()} ${req.method} ${url}`);

  // API 路由
  if (url.startsWith('/api/')) return handleAPI(req, res, url);

  // 静态文件 - 默认返回 HTML
  if (url === '/' || url === '/index.html') {
    return serveFile(res, HTML_FILE, '.html');
  }
  // 尝试从磁盘读取其他文件
  const safePath = path.join(__dirname, url);
  if (safePath.startsWith(__dirname) && fs.existsSync(safePath)) {
    return serveFile(res, safePath, path.extname(safePath));
  }
  // fallback: 单页应用，返回 HTML
  return serveFile(res, HTML_FILE, '.html');
});

function serveFile(res, filepath, ext) {
  try {
    const content = fs.readFileSync(filepath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch(e) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

// ============================
// API 处理
// ============================
function handleAPI(req, res, url) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    const data = body ? JSON.parse(body || '{}') : {};

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }

    try {
      // GET /api/data
      if (url === '/api/data' && req.method === 'GET') {
        return jsonRes(res, 200, {
          products: db.products,
          logs: db.logs.slice(-500),
          alertThreshold: db.alertThreshold,
          lastUpdated: db.lastUpdated
        });
      }

      // GET /api/version
      if (url === '/api/version' && req.method === 'GET') {
        return jsonRes(res, 200, { lastUpdated: db.lastUpdated, count: db.products.length });
      }

      // POST /api/transaction
      if (url === '/api/transaction' && req.method === 'POST') {
        const { productId, type, qty, operator, note } = data;
        if (!productId || !type || !qty) return errorRes(res, 400, '参数不完整');
        if (qty <= 0) return errorRes(res, 400, '数量必须大于0');
        const p = db.products.find(x => x.id === productId);
        if (!p) return errorRes(res, 404, '产品不存在');
        const before = p.stock;
        if (type === 'out') {
          if (qty > p.stock) return errorRes(res, 400, `库存不足，当前 ${p.stock}`);
          p.stock -= qty; p.todayOut += qty;
        } else if (type === 'in') {
          p.stock += qty; p.todayIn += qty;
        } else return errorRes(res, 400, '类型错误');
        db.logs.push({ id: Date.now(), time: new Date().toISOString(), productId, productName: p.name, type, qty: type==='out'?-qty:qty, before, after: p.stock, operator: operator||'匿名', note: note||'' });
        if (db.logs.length > 5000) db.logs = db.logs.slice(-5000);
        saveData(db);
        return jsonRes(res, 200, { success: true, product: p });
      }

      // POST /api/batch
      if (url === '/api/batch' && req.method === 'POST') {
        const { type, productIds, qty, operator, note } = data;
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
          db.logs.push({ id: Date.now()+pid, time: new Date().toISOString(), productId: pid, productName: p.name, type, qty: type==='out'?-qty:qty, before, after: p.stock, operator: operator||'匿名', note: note||'批量' });
          results.push({ id: pid, name: p.name, success: true, stock: p.stock });
        }
        saveData(db);
        return jsonRes(res, 200, { success: true, results });
      }

      // PUT /api/product/:id
      const putMatch = url.match(/^\/api\/product\/(\d+)$/);
      if (putMatch && req.method === 'PUT') {
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
        if (!data.name) return errorRes(res, 400, '产品名称必填');
        const p = { id: db.nextId++, name: data.name, stock: data.stock||0, capacity: String(data.capacity||''), weight: data.weight||'', category: data.category||'其他', alertLine: data.alertLine||db.alertThreshold, todayOut:0, todayIn:0 };
        db.products.push(p);
        saveData(db);
        return jsonRes(res, 200, { success: true, product: p });
      }

      // DELETE /api/product/:id
      const delMatch = url.match(/^\/api\/product\/(\d+)$/);
      if (delMatch && req.method === 'DELETE') {
        const id = parseInt(delMatch[1]);
        const idx = db.products.findIndex(x => x.id === id);
        if (idx === -1) return errorRes(res, 404, '产品不存在');
        const removed = db.products.splice(idx, 1)[0];
        saveData(db);
        return jsonRes(res, 200, { success: true, removed });
      }

      // PUT /api/threshold
      if (url === '/api/threshold' && req.method === 'PUT') {
        if (!data.threshold || data.threshold < 0) return errorRes(res, 400, '无效阈值');
        db.alertThreshold = parseInt(data.threshold);
        db.products.forEach(p => { p.alertLine = db.alertThreshold; });
        saveData(db);
        return jsonRes(res, 200, { success: true, threshold: db.alertThreshold });
      }

      // POST /api/reset
      if (url === '/api/reset' && req.method === 'POST') {
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

function jsonRes(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}

function errorRes(res, code, msg) {
  jsonRes(res, code, { error: msg });
}

// 启动
server.listen(PORT, () => {
  console.log(`📦 库存管理系统已启动`);
  console.log(`🌐 端口: ${PORT}`);
  console.log(`📡 健康检查: http://localhost:${PORT}/api/version`);
});
