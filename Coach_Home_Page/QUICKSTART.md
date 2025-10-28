# 快速启动指南

## 预览页面

### 方法一：直接在浏览器中打开

1. 找到 `Coach_Home_Page` 文件夹
2. 双击 `index.html` 文件
3. 页面将在默认浏览器中打开

### 方法二：使用本地服务器（推荐）

**为什么推荐？** 
- 避免浏览器跨域限制
- 更接近真实部署环境
- 支持热更新（部分服务器）

#### 使用 Python

```bash
# Python 3
cd Coach_Home_Page
python -m http.server 8000

# 访问: http://localhost:8000
```

#### 使用 Node.js

```bash
# 需先安装 http-server
npm install -g http-server

cd Coach_Home_Page
http-server -p 8000

# 访问: http://localhost:8000
```

#### 使用 VS Code Live Server

1. 安装 Live Server 扩展
2. 右键 `index.html`
3. 选择 "Open with Live Server"

## 文件结构

```
Coach_Home_Page/
│
├── index.html              # 主页面（从这里开始）
│
├── styles/                 # 样式文件
│   ├── main.css            # 全局样式、设计系统变量
│   ├── navigation.css      # 导航栏样式
│   └── dashboard.css       # 工作台内容样式
│
├── scripts/                # 交互脚本
│   └── main.js             # 页面交互逻辑
│
├── assets/                 # 资源文件
│   └── icon/               # 图标文件（预留）
│
├── README.md               # 详细设计文档
└── QUICKSTART.md           # 本文件
```

## 功能测试清单

### 导航栏
- [ ] 点击导航项查看高亮效果
- [ ] 悬停导航项查看过渡动画
- [ ] 点击搜索按钮（控制台输出）
- [ ] 点击通知按钮（未读数量减少）
- [ ] 点击用户头像（箭头动画）

### 关键指标
- [ ] 悬停指标卡片查看上浮效果
- [ ] 观察趋势标识（上升/下降箭头）

### 提醒区域
- [ ] 点击"处理"按钮（提醒消失，数量更新）
- [ ] 点击"提醒"按钮（控制台输出）
- [ ] 点击"查看"按钮（控制台输出）
- [ ] 观察紧急提醒的脉动动画

### 运动员卡片
- [ ] 悬停卡片查看上浮效果
- [ ] 点击卡片查看详情（控制台输出）
- [ ] 点击"查看"图标按钮
- [ ] 点击"消息"图标按钮
- [ ] 点击"编辑"图标按钮
- [ ] 观察进度条渐变效果

### 筛选功能
- [ ] 点击"全部"按钮
- [ ] 点击"进行中"按钮（仅显示"训练中"卡片）
- [ ] 点击"需关注"按钮（仅显示"需关注"卡片）
- [ ] 点击"优秀表现"按钮（仅显示"表现优异"卡片）

### 键盘快捷键
- [ ] `Ctrl/Cmd + K` - 聚焦搜索
- [ ] `Ctrl/Cmd + N` - 添加运动员

### 响应式设计
- [ ] 调整浏览器宽度至 1200px（观察布局变化）
- [ ] 调整浏览器宽度至 768px（平板视图）
- [ ] 调整浏览器宽度至 480px（移动视图）

## 浏览器兼容性

| 浏览器 | 版本要求 | 测试状态 |
|--------|---------|---------|
| Chrome | 90+ | ✅ 推荐 |
| Edge | 90+ | ✅ 推荐 |
| Firefox | 88+ | ✅ 支持 |
| Safari | 14+ | ✅ 支持 |
| IE 11 | - | ❌ 不支持 |

**注意**：页面使用了 CSS Grid、Flexbox、CSS Variables 等现代特性，不支持 IE 11。

## 开发者工具

### 查看控制台
按 `F12` 或右键 → "检查"，切换到 Console 标签页。

所有交互操作都会在控制台输出，例如：
```
 X_ASCENT 教练工作台 
页面交互已加载
可用接口: X_ASCENT.updateAthleteData(), X_ASCENT.addNotification(), X_ASCENT.filterAthletes()
```

### JavaScript API

在控制台中可以调用以下接口：

```javascript
// 筛选运动员
X_ASCENT.filterAthletes('需关注');

// 添加通知
X_ASCENT.addNotification('新消息', 'info');

// 更新运动员数据
X_ASCENT.updateAthleteData('athlete-001', { ftp: 290 });
```

## 自定义配置

### 修改配色

编辑 `styles/main.css`，在 `:root` 部分修改颜色变量：

```css
:root {
    --cyan-50: #1e7d8a;  /* 主色调 */
    --success: #4caf50;  /* 成功色 */
    --warning: #ff9800;  /* 警告色 */
    --error: #f44336;    /* 错误色 */
}
```

### 修改运动员数据

编辑 `index.html`，找到 `.athlete-card` 部分，修改其中的：
- 姓名（`.athlete-name`）
- FTP 数值（`.metric-item-value`）
- 训练完成度（`.progress-value` 和 `.progress-fill` 的 `width`）

### 添加新运动员卡片

复制任意 `.athlete-card` 的完整HTML代码，粘贴到 `.athletes-grid` 中，然后修改其中的数据。

## 常见问题

### Q: 页面样式显示不正常？
**A:** 检查是否所有 CSS 文件都在正确路径下。使用浏览器开发者工具的 Network 标签页查看是否有文件加载失败。

### Q: JavaScript 功能不工作？
**A:** 
1. 按 `F12` 打开控制台，查看是否有错误信息
2. 确认 `scripts/main.js` 文件存在
3. 检查浏览器版本是否过低

### Q: 在移动端预览效果不好？
**A:** 
1. 确保 HTML 中包含 viewport meta 标签：
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. 使用 Chrome DevTools 的设备模式（按 `Ctrl+Shift+M`）进行模拟

### Q: 如何部署到生产环境？
**A:** 
1. 将整个 `Coach_Home_Page` 文件夹上传到服务器
2. 配置 Web 服务器（Nginx/Apache）指向该目录
3. 确保所有静态资源路径正确
4. 后续对接后端 API，替换示例数据

## 下一步开发建议

### 后端集成
1. 使用 Fetch API 或 Axios 获取真实数据
2. 实现 WebSocket 推送实时更新
3. 添加身份认证和权限控制

### 功能增强
1. 添加运动员详情页面
2. 实现课程编辑器
3. 添加数据图表可视化（推荐使用 Chart.js 或 ECharts）
4. 实现消息通知系统

### 性能优化
1. 图片/头像懒加载
2. 虚拟滚动（大量运动员时）
3. 代码分割和按需加载
4. PWA 支持（离线可用）

## 反馈与支持

如有问题或建议，请查看 `README.md` 获取更详细的设计说明。

---

**开始探索吧！** 🚀

祝您使用愉快！

