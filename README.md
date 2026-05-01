# 🍳 食刻 SKit

> 🤔 为打工人和学生党设计的自炊决策助手 —— 解决「今天吃什么」的选择困难！

## ✨ 主要功能

- 🎲 **随机推荐** — 一键随机推荐一道符合当前食材筛选条件的菜
- 🥬 **按食材筛选** — 勾选你已有的食材，只显示能做的菜（支持混合 AND/OR 逻辑）
- 📖 **详细做法** — 从选材到出锅，完整步骤展示
- 👥 **人数调整** — 自动按比例缩放食材用量（主料线性缩放，调料幂律缩放）
- ❤️ **收藏菜谱** — 收藏喜欢的菜，打造个人专属菜谱库
- 🛒 **购物清单** — 基于当前菜谱生成带数量的购物清单，支持一键复制

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| ⚛️ 框架 | React 18 + Vite + React Router v6 |
| 🎨 样式 | Tailwind CSS v4（响应式，手机/电脑自适应） |
| 💾 数据存储 | localStorage（收藏、历史记录） |
| 📚 数据来源 | [HowToCook](https://github.com/Anduin2017/HowToCook) 开源菜谱仓库 |
| 🧪 测试 | Vitest |

## 🚀 快速开始

### 1️⃣ 克隆项目

```bash
git clone git@github.com:zzzzzy2k/SKIT.git
cd SKIT
```

### 2️⃣ 安装依赖

```bash
npm install
```

### 3️⃣ 准备数据（首次运行）

```bash
node scripts/fetch-recipes.js
```

> 📝 该脚本会从本地 HowToCook 仓库解析菜谱，生成 `public/recipes.json`（约 358 道菜）

### 4️⃣ 启动开发服务器

```bash
npm run dev
```

### 5️⃣ 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
SKIT/
├── 📂 public/
│   └── recipes.json           # 静态菜谱数据（构建时生成）
├── 📂 scripts/
│   └── fetch-recipes.js       # 数据解析脚本（AST 解析 HowToCook Markdown）
├── 📂 src/
│   ├── 📂 components/         # 可复用组件
│   │   ├── Layout.jsx         # 应用壳（浮动毛玻璃导航）
│   │   ├── RecipeCard.jsx     # 菜谱卡片
│   │   ├── IngredientFilter.jsx # 食材筛选器
│   │   ├── ServingSelector.jsx  # 人数选择器
│   │   ├── ShoppingListModal.jsx # 购物清单弹窗
│   │   ├── EmptyState.jsx     # 空状态
│   │   ├── SkeletonCard.jsx   # 加载骨架屏
│   │   └── ErrorBoundary.jsx  # 错误边界
│   ├── 📂 hooks/              # 自定义 Hooks
│   │   ├── useRecipes.js      # 菜谱加载（含内存缓存）
│   │   ├── useFavorites.js    # 收藏管理
│   │   └── useLocalStorage.js # 通用 localStorage
│   ├── 📂 pages/              # 页面
│   │   ├── Home.jsx           # 首页（英雄区 + 筛选 + 菜谱网格）
│   │   ├── RecipeDetail.jsx   # 菜谱详情（缩放 + 购物清单）
│   │   ├── Favorites.jsx      # 收藏页
│   │   └── About.jsx          # 说明页
│   ├── 📂 utils/              # 工具函数
│   │   ├── filterRecipes.js   # 混合筛选逻辑
│   │   ├── scaleIngredient.js # 分类缩放算法
│   │   ├── shoppingList.js    # 购物清单生成
│   │   └── constants.js       # 常量定义
│   ├── App.jsx                # 路由配置
│   └── index.css              # 设计系统（Tailwind v4 @theme）
├── index.html
└── package.json
```

## 📄 数据来源与授权

- 📜 菜谱数据来自 [Anduin2017/HowToCook](https://github.com/Anduin2017/HowToCook)，遵循 **MIT 许可证**。
- 🙏 页面底部保留了原项目署名。

## 🤝 贡献指南

欢迎提交 Issue 或 Pull Request 🎉
如需新增菜谱或修正数据，请直接向 [HowToCook](https://github.com/Anduin2017/HowToCook) 仓库贡献，本项目会定期同步。

## 📝 许可证

本项目代码采用 **MIT 许可证**，详见 [LICENSE](./LICENSE) 文件。

## 💖 致谢

- 🙏 感谢 [HowToCook](https://github.com/Anduin2017/HowToCook) 提供的结构化菜谱数据
- 💡 灵感来源于每一位每天纠结「吃什么」的独立生活者

---

**🍽 食刻 · 知食时刻**
