# 妹妹作品集网页

## 1. 当前结构

网站可以作为静态站部署到 Vercel。当前推荐只用 GitHub 仓库管理作品：

- 妹妹在 GitHub 里上传/删除作品图片和 `项目说明.txt`
- Vercel 部署时运行 `npm run build`
- 构建脚本扫描 `assets/images/*`，自动生成 `projects-data.js`
- 网站读取 `projects-data.js`，显示最新作品

详细操作看：`作品上传说明.md`

## 2. 新增作品

新建一个作品文件夹，文件夹名可以用中文：

```text
assets/images/006-森林里的小房子/
```

放入：

```text
assets/images/006-森林里的小房子/项目说明.txt
assets/images/006-森林里的小房子/cover.jpg
assets/images/006-森林里的小房子/01.jpg
assets/images/006-森林里的小房子/02.jpg
```

`项目说明.txt` 可以复制 `assets/images/项目说明模板.txt`。

然后本地或 Vercel 运行：

```bash
npm run build
```

## 3. 本地预览网站

```bash
cd "/Users/shiningkimm/Local Projects/codex/projects/20260313-sister-portfolio"
npm run build
python3 -m http.server 8080
```

然后访问：`http://localhost:8080`

## 4. GitHub / Vercel 自动更新

如果部署在 Vercel：

- Build Command 填：`npm run build`
- Output Directory 填：`.` 或保持默认
- 对方往 GitHub 上传/删除作品文件后，Vercel 会重新构建，网站会自动更新

如果只是 GitHub Pages 静态托管，没有配置构建流程，就需要先在本地运行 `npm run build`，把生成后的 `projects-data.js` 一起提交。

## 5. 仍保留的旧结构

旧项目目前仍然使用：

```text
assets/covers/项目名/cover.jpg
assets/images/项目名/01.jpg
```

新项目建议直接使用一个文件夹：

```text
assets/images/006-森林里的小房子/cover.jpg
assets/images/006-森林里的小房子/01.jpg
```

## 6. 图片策略

- 封面建议统一比例（16:10）
- 首页封面文件名建议叫 `cover.jpg`
- 详情图建议叫 `01.jpg`、`02.jpg`、`03.jpg`
- 数字命名会按顺序显示

## 7. 上线（Vercel）

- 用 GitHub 账号登录 Vercel
- 选择这个仓库，直接 Deploy
- Build Command 填：`npm run build`
- 之后妹妹在 GitHub 上传/删除作品，网站会自动更新

## 8. 后续升级（可选）

- 项目页增加“上一张/下一张”翻图和全屏预览
- 接入自定义域名（如姓名拼音）
- 做上传前压缩，避免图片太大导致网页加载慢
