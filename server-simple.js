// 简化版Node.js服务端 - 无需额外依赖
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const DATA_FILE = path.join(__dirname, 'guestbook.json');
const PORT = process.env.PORT || 3000;

// 处理CORS
function handleCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// 读取请求体
function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

// 读取留言数据
function readMessages() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (error) {
        return [];
    }
}

// 保存留言数据
function saveMessages(messages) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

// 创建服务器
const server = http.createServer(async (req, res) => {
    handleCORS(res);
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // API路由
    if (pathname === '/api/messages' && req.method === 'GET') {
        const messages = readMessages();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(messages));
        return;
    }
    
    if (pathname === '/api/messages' && req.method === 'POST') {
        try {
            const body = await readBody(req);
            const data = JSON.parse(body);
            
            if (!data.name || !data.content || !data.ip) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '缺少必要字段' }));
                return;
            }
            
            const messages = readMessages();
            const newMessage = {
                name: data.name.trim(),
                content: data.content.trim(),
                ip: data.ip,
                timestamp: new Date().toISOString()
            };
            
            messages.push(newMessage);
            saveMessages(messages);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: newMessage }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '保存失败' }));
        }
        return;
    }
    
    if (pathname.startsWith('/api/messages/') && req.method === 'DELETE') {
        try {
            const index = parseInt(pathname.split('/')[3]);
            const body = await readBody(req);
            const data = JSON.parse(body);
            
            const messages = readMessages();
            
            if (index < 0 || index >= messages.length) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '留言不存在' }));
                return;
            }
            
            if (messages[index].ip !== data.ip) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: '无权限删除此留言' }));
                return;
            }
            
            messages.splice(index, 1);
            saveMessages(messages);
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: '删除失败' }));
        }
        return;
    }
    
    // 静态文件服务
    let filePath = path.join(__dirname, pathname);
    
    // 默认文件
    if (pathname === '/') {
        filePath = path.join(__dirname, 'navigation.html');
    }
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('文件未找到');
        return;
    }
    
    // 读取文件内容
    try {
        const content = fs.readFileSync(filePath);
        const ext = path.extname(filePath).toLowerCase();
        
        let contentType = 'text/plain';
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'application/javascript';
        else if (ext === '.json') contentType = 'application/json';
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('服务器错误');
    }
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`\n🚀 留言板服务端已启动！`);
    console.log(`📱 访问地址: http://localhost:${PORT}/navigation.html`);
    console.log(`📊 API文档: http://localhost:${PORT}/api/messages`);
    console.log(`\n💡 提示: 按 Ctrl+C 停止服务`);
});