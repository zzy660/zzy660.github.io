# 留言板系统 - JAMstack架构

基于JAMstack架构的留言板系统，支持服务端数据存储，所有人可见留言内容。

## 功能特性

- ✅ 服务端存储留言数据
- ✅ 所有人可见留言内容
- ✅ 限制称呼只能由汉字构成
- ✅ 限制留言内容不能包含网页链接
- ✅ 限制留言总字数不超过100字
- ✅ 手机端响应式设计
- ✅ 每人只能留言一次（基于IP）
- ✅ 可删除自己的留言

## 文件结构

```
├── navigation.html      # 留言板页面
├── navigation.css       # 样式文件
├── navigation.js        # 前端JavaScript
├── server.js           # Node.js服务端（示例）
├── package.json        # 项目依赖
├── guestbook.json      # 留言数据文件
└── README.md           # 部署说明
```

## 部署方式

### 方式1：Netlify静态部署（当前配置）

本项目已配置为Netlify静态部署，留言功能为演示模式。

1. **直接部署到Netlify**
   - 将项目推送到GitHub
   - 在Netlify中连接GitHub仓库
   - 自动部署

2. **注意事项**
   - 留言功能为模拟操作，数据不会持久保存
   - 刷新页面后留言会恢复为预设数据
   - 如需真实留言功能，请参考下方外部存储方案

### 方式2：传统Node.js部署

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动服务**
   ```bash
   npm start
   # 或使用开发模式
   npm run dev
   ```

3. **访问留言板**
   打开浏览器访问：http://localhost:3000/navigation.html

### 方式2：静态托管 + 无服务器函数（推荐JAMstack）

#### Vercel部署

1. **准备文件**
   - 确保所有文件都在项目根目录
   - 创建 `vercel.json` 配置文件

2. **创建 vercel.json**
   ```json
   {
     "functions": {
       "server.js": {
         "runtime": "nodejs18.x"
       }
     },
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server.js"
       },
       {
         "src": "/(.*)",
         "dest": "/$1"
       }
     ]
   }
   ```

3. **部署到Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

#### Netlify部署

1. **创建 netlify.toml**
   ```toml
   [build]
     functions = "netlify/functions"
   
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/server/:splat"
     status = 200
   
   [[redirects]]
     from = "/*"
     to = "/:splat"
     status = 200
   ```

2. **创建函数目录结构**
   ```
   netlify/functions/server.js
   ```

3. **部署到Netlify**
   - 将代码推送到GitHub
   - 连接Netlify到GitHub仓库
   - 自动部署

### 方式3：使用Supabase（已配置完成）

项目已集成Supabase，使用本地硬编码配置，无需额外设置即可使用。

#### 当前配置信息
- **项目URL**: `https://gwjpldhjelwyslnlydvk.supabase.co`
- **数据库**: PostgreSQL
- **功能**: 完整留言板功能（添加、查看、删除）

#### 数据库表结构
已创建`guestbook`表，包含以下字段：
- `id` - 主键，自增
- `name` - 留言者姓名
- `content` - 留言内容
- `ip` - IP地址（用于权限控制）
- `timestamp` - 创建时间

#### 使用说明
直接部署即可使用，无需配置环境变量。留言数据会永久保存在Supabase数据库中。

#### 其他可选方案

**Netlify Forms（最简单）**
- 无需后端代码，直接在HTML中添加`netlify`属性
- 自动处理表单提交和数据存储
- 支持邮件通知

**Firebase Firestore**
- Google提供的NoSQL数据库
- 实时同步，适合实时聊天应用
- 免费额度充足

**Airtable**
- 类似电子表格的数据库
- REST API接口简单易用
- 免费版每月1200条记录

## API接口说明

### 获取所有留言
```
GET /api/messages
返回：留言数组
```

### 添加新留言
```
POST /api/messages
请求体：
{
  "name": "用户名",
  "content": "留言内容",
  "ip": "用户IP"
}
```

### 删除留言
```
DELETE /api/messages/{index}
请求体：
{
  "ip": "用户IP"
}
```

## 数据格式

留言数据存储格式：
```json
[
  {
    "name": "用户名",
    "content": "留言内容",
    "ip": "192.168.1.100",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
]
```

## 环境变量

可以设置以下环境变量：
- `PORT` - 服务端口号（默认3000）
- `DATA_FILE` - 数据文件路径（默认guestbook.json）

## 安全说明

- IP地址仅用于限制每人留言一次
- 删除留言时验证IP匹配
- 所有用户输入都经过HTML转义
- 支持HTTPS部署

## 手机端优化

- 响应式设计，适配各种屏幕尺寸
- 优化触摸操作体验
- 减小内容卡片大小
- 改善按钮对齐和间距

## 故障排除

### 常见问题

1. **跨域问题**：确保服务端允许CORS
2. **文件权限**：确保guestbook.json可读写
3. **端口占用**：修改PORT环境变量
4. **数据丢失**：定期备份guestbook.json

### 调试模式

在浏览器控制台可以查看详细的API调用日志。

## 更新日志

- v1.0.0 - 初始版本，支持基本功能
- v1.1.0 - 添加服务端存储支持
- v1.2.0 - 优化手机端显示效果