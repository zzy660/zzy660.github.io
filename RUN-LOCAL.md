# 本地运行指南

## 问题原因
你遇到的404错误是因为：
1. Supabase依赖包未安装（已解决）
2. 需要使用Netlify CLI来正确运行Netlify函数

## 解决方案

### 方法1：使用Netlify CLI（推荐）

1. **安装Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **启动本地开发服务器**
   ```bash
   netlify dev
   ```

3. **访问测试**
   - 打开 http://localhost:8888
   - 函数路径：http://localhost:8888/.netlify/functions/getGuestbook

### 方法2：使用Netlify部署

1. **提交到GitHub**
2. **连接到Netlify**
3. **自动部署**

### 方法3：使用替代方案

如果无法安装Netlify CLI，可以：

1. **使用在线部署**
   - 直接部署到Netlify
   - 使用GitHub集成

2. **测试函数**
   - 访问 `test.html` 文件进行测试

## 已完成的修复
- ✅ 安装了@supabase/supabase-js依赖
- ✅ 配置了正确的Supabase密钥
- ✅ 验证了模块加载成功

## 注意事项
- 本地开发必须使用Netlify CLI才能正确运行函数
- 直接打开HTML文件会导致404错误，因为函数需要通过Netlify运行时执行