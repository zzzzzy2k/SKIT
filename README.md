# 🍳 食刻 (SKit)

> 为打工人和学生党设计的自炊决策助手 —— 解决「今天吃什么」的选择困难。

## ✨ 主要功能

- 🎲 **随机推荐** – 一键随机推荐一道符合当前食材筛选条件的菜
- 🥬 **按食材筛选** – 勾选你已有的食材，只显示能做的菜
- 📖 **详细做法** – 从选材到出锅，完整步骤展示
- 👥 **人数调整** – 自动按比例缩放食材用量（默认1人份）
- ❤️ **收藏菜谱** – 收藏喜欢的菜，打造个人专属菜谱库
- 🛒 **购物清单** – 基于当前菜谱生成带数量的购物清单，支持复制

## 🛠 技术栈

- **前端**：React 18 + Vite + React Router
- **样式**：Tailwind CSS（响应式，手机/电脑自适应）
- **数据存储**：localStorage（收藏、历史记录）
- **数据来源**：[HowToCook](https://github.com/Anduin2017/HowToCook) 开源菜谱仓库

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-username/skit.git
cd skit
```



### 2. 安装依赖

bash

```
npm install
```



### 3. 准备数据（首次运行）

bash

```
node scripts/fetch-recipes.js
```



该脚本会从 HowToCook 仓库抓取最新菜谱，生成 `public/recipes.json`。

### 4. 启动开发服务器

bash

```
npm run dev
```



### 5. 构建生产版本

bash

```
npm run build
```



## 📁 项目结构

text

```
skit/
├── public/
│   └── recipes.json        # 静态菜谱数据（构建时生成）
├── scripts/
│   └── fetch-recipes.js    # 数据抓取脚本
├── src/
│   ├── components/         # 可复用组件（RecipeCard、Layout等）
│   ├── hooks/              # 自定义 hooks（useRecipes、useFavorites）
│   ├── pages/              # 页面（Home、RecipeDetail、Favorites）
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```



## 📄 数据来源与授权

- 本项目的菜谱数据来自 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook)，遵循 **MIT 许可证**。
- 我们在页面底部保留了原项目署名。

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request。
如需新增菜谱或修正数据，请直接向 [HowToCook](https://github.com/Anduin2017/HowToCook) 仓库贡献，本项目会定期同步。

## 📝 许可证

本项目代码采用 **MIT 许可证**，详见 [LICENSE](https://./LICENSE) 文件。

## 🧑‍🍳 致谢

- 感谢 [HowToCook](https://github.com/Anduin2017/HowToCook) 提供的结构化菜谱数据。
- 灵感来源于每一位每天纠结“吃什么”的独立生活者。

------

**食刻 · 知食时刻**
[在线体验](https://your-deployed-url.com/)（部署后填写）

text