// 示例服务端实现 - 用于留言板数据存储
// 这是一个Node.js + Express的服务端示例
// 实际部署时需要根据你的服务器环境进行调整

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const DATA_FILE = path.join(__dirname, 'guestbook.json');

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 获取所有留言
app.get('/api/messages', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const messages = JSON.parse(data || '[]');
        res.json(messages);
    } catch (error) {
        console.error('读取留言失败:', error);
        res.json([]);
    }
});

// 添加新留言
app.post('/api/messages', async (req, res) => {
    try {
        const { name, content, ip } = req.body;
        
        // 验证数据
        if (!name || !content || !ip) {
            return res.status(400).json({ error: '缺少必要字段' });
        }
        
        // 读取现有数据
        let messages = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            messages = JSON.parse(data || '[]');
        } catch (error) {
            messages = [];
        }
        
        // 创建新留言
        const newMessage = {
            name: name.trim(),
            content: content.trim(),
            ip: ip,
            timestamp: new Date().toISOString()
        };
        
        // 添加并保存
        messages.push(newMessage);
        await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2));
        
        res.json({ success: true, message: newMessage });
    } catch (error) {
        console.error('保存留言失败:', error);
        res.status(500).json({ error: '保存失败' });
    }
});

// 删除留言
app.delete('/api/messages/:index', async (req, res) => {
    try {
        const index = parseInt(req.params.index);
        const { ip } = req.body;
        
        let messages = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            messages = JSON.parse(data || '[]');
        } catch (error) {
            messages = [];
        }
        
        if (index < 0 || index >= messages.length) {
            return res.status(404).json({ error: '留言不存在' });
        }
        
        // 检查IP是否匹配（只允许删除自己的留言）
        if (messages[index].ip !== ip) {
            return res.status(403).json({ error: '无权限删除此留言' });
        }
        
        messages.splice(index, 1);
        await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('删除留言失败:', error);
        res.status(500).json({ error: '删除失败' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
});