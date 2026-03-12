# 妹妹作品集网页（静态版）

## 1. 本地先完善（推荐）

先在本地把文案和图片全部改好，再上传 GitHub。

直接双击打开 `index.html` 也可以预览。

如果你想用本地服务打开（推荐，避免部分浏览器限制）：

```bash
cd /Users/shiningkimm/Documents/codex/sister-portfolio
python3 -m http.server 8080
```

然后访问：`http://localhost:8080`

## 2. 替换内容

- 基本信息：编辑 `index.html`
  - 姓名、求职方向、邮箱、微信、简历链接、平台链接
- 作品项目：编辑 `projects-data.js` 里的 `projects` 数组
  - 现在项目数据已拆到 `projects-data.js`
  - 首页 `index.html` 点击卡片会进入 `project.html?slug=...` 子页面
  - `preview` 是首页预览图（只显示 1 张）
  - `images` 数组是子页面展示的全部图片

已内置简历文件：`assets/resume-he-jinbao.pdf`，顶部“简历 PDF”按钮会直接打开。
已内置真实作品图：`assets/images/`（原图）。
网页当前使用轻量封面图：`assets/covers/`（建议继续用这个目录，加载更快）。
当前已改为每个项目使用 `assets/images/` 对应文件夹里的全部图片，并在独立项目子页面中展示。

## 3. 图片建议

- 封面建议统一比例（16:10）
- 单图宽度建议 1200px 左右
- 优先使用 WebP/JPG 压缩图，保证加载速度

## 4. 上传 GitHub（本地完成后）

```bash
cd /Users/shiningkimm/Documents/codex/sister-portfolio
git init
git add .
git commit -m "feat: portfolio site"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

## 5. 上线（Vercel）

- 用 GitHub 账号登录 Vercel
- 选择这个仓库，直接 Deploy
- 得到公网链接后发给用人单位

## 6. 后续升级（可选）

- 项目页增加“上一张/下一张”翻图和全屏预览
- 接入自定义域名（如姓名拼音）
- 部署到 Vercel / Netlify / GitHub Pages
