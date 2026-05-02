---
name: howtocook-normalizer
description: 将 HowToCook 项目的菜谱 Markdown 文件规范化为 SKit 系统的 JSON 格式
---

# HowToCook 菜谱规范化工具

将 [HowToCook](https://github.com/Anduin2017/HowToCook) 项目的菜谱 Markdown 文件解析并规范化为 SKit 系统所需的 JSON 格式。

## 何时使用

- 用户要求导入或同步 HowToCook 菜谱数据
- 用户要求刷新 `public/recipes.json`
- 用户提到"更新菜谱"、"同步数据"、"重新解析"

## 功能

- 解析 HowToCook 的 Markdown 菜谱文件
- 从 `必备原料和工具` 提取食材名，从 `计算` 提取数量
- 自动拆分顿号合并的食材：`葱、姜、蒜` → 3 个独立食材
- 处理 or 替代：`白糖 or 冰糖` → 取第一个 `白糖`（括号内的 or 不受影响）
- 去掉 backtick 和分类前缀：`` 主料：`大肉`、`鸡蛋` `` → `大肉` + `鸡蛋`
- 自动归一化单位（克→g，毫升→ml，汤匙→勺 等）
- 清理单位注释（如 "g（一小块）*份数" → "g"）
- 识别调料和工具
- 解析难度星级（★/⭐）
- 输出 SKit 系统标准 JSON 格式

## 导入规范

详见 [IMPORT_SPEC.md](./IMPORT_SPEC.md)，包含菜谱格式要求、常见问题和自动修复说明。

## 使用方法

### 单个文件

```bash
node .claude/skills/howtocook-normalizer/scripts/normalize.js /path/to/recipe.md -o output.json -v
```

### 整个目录

```bash
node .claude/skills/howtocook-normalizer/scripts/normalize.js /path/to/dishes/ -o public/recipes.json -v
```

### 快捷方式（同步到 SKit）

```bash
node scripts/fetch-recipes.js
```

> `scripts/fetch-recipes.js` 包含相同的解析逻辑，是 SKit 项目的标准数据同步脚本。

## 参数

| 参数 | 说明 |
|------|------|
| `input_path` | 单个 .md 文件或包含 .md 的目录 |
| `--output, -o` | 输出 JSON 路径（不指定则输出到 stdout） |
| `--verbose, -v` | 显示每个文件的解析结果 |

## 输出格式

```json
{
  "id": "红烧肉",
  "title": "红烧肉",
  "category": "meat_dish",
  "servings": 1,
  "ingredients": ["五花肉", "葱", "姜"],
  "ingredients_with_quantity": ["五花肉 500g", "葱 2 根", "姜 3 片"],
  "parsed_ingredients": [
    { "name": "五花肉", "qty": 500, "unit": "g", "is_seasoning": false, "raw": "五花肉 500g" },
    { "name": "葱", "qty": 2, "unit": "根", "is_seasoning": true, "raw": "葱 2 根" }
  ],
  "steps": ["五花肉切块...", "..."],
  "tools": ["炒锅"],
  "difficulty": 3
}
```

## 规范化规则

### 单位归一化

| 原始 | 归一化 |
|------|--------|
| 克、千克、公斤 | g、kg |
| 毫升、mL、ML | ml |
| 汤匙、大勺、小勺、茶匙 | 勺 |
| 棵 | 颗 |

### 单位清理

- 去掉括号注释：`g（一小块）` → `g`
- 去掉份数标记：`g *份数` → `g`
- 去掉逗号说明：`g，用于碗汁` → `g`
- 去掉尾部标点：`g。` → `g`

### 数量处理

- 范围取第一个值：`10 ～ 12 只` → `10`
- 无数量标记为 `null`，显示为"适量"
- "少许"、"一些"、"若干" → `null`（适量）

## 食材分类

- **调料**：盐、糖、酱油、醋、料酒、花椒、八角 等（在 `SEASONINGS` 列表中）
- **工具**：锅、刀、砧板、碗、烤箱 等（在 `TOOL_KEYWORDS` 列表中）
- **主料/配料**：其余所有食材

## 注意事项

- 约 60% 的食材有精确数量，其余显示为"适量"
- 食材名与计算行的匹配基于清理后的名称，部分食材可能无法匹配
- 难度解析依赖菜谱中的 ★/⭐ 符号，无符号则默认为 0
