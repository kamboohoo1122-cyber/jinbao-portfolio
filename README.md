# 妹妹作品集网页

## 1. 当前结构

网站仍然可以作为静态站部署到 Vercel，同时已经预留 Sanity CMS：

- 没有填写 Sanity Project ID 时，继续读取 `projects-data.js`
- 填写 Sanity Project ID 后，自动读取 Sanity 后台内容；后台新增作品会叠加到原有本地作品前面
- 图片通过 Sanity CDN 自动压缩、转 WebP/AVIF，并按页面尺寸输出

## 2. 本地预览网站

```bash
cd /Users/shiningkimm/Documents/codex/projects/20260313-sister-portfolio
python3 -m http.server 8080
```

然后访问：`http://localhost:8080`

## 3. 手动新增作品

每个项目单独一个文件夹，封面和详情图分开放：

```text
assets/covers/项目名/cover.jpg
assets/images/项目名/01.jpg
assets/images/项目名/02.jpg
```

现在已有项目：

- `zhujia-garden`
- `yellowflower-book`
- `penguin-series`
- `ordinary-ancient-sounds`
- `other-illustrations`

新增作品时，复制一个 `projects-data.js` 里的项目块，改 `slug`、标题、文案、封面路径和图片路径即可。

## 4. 接入 Sanity

### 4.1 Sanity 项目信息

当前已经接好的项目：

```js
window.SANITY_CONFIG = {
  projectId: "fonl3jav",
  dataset: "production"
};
```

后台地址：`https://jinbao-portfolio-studio.sanity.studio/`

### 4.2 启动 Sanity 后台

```bash
cd /Users/shiningkimm/Documents/codex/projects/20260313-sister-portfolio/sanity
npm install
npm run dev
```

后台模型在 `sanity/schemaTypes/project.js`，支持新增、删除和调整作品项目。

### 4.3 允许网站读取数据

在 Sanity 项目设置里添加 CORS Origin：

- 本地预览：`http://localhost:8080`
- Vercel 域名：`https://jinbao-portfolio.vercel.app`
- 自定义域名：`https://www.shiningkim.top`

公开作品集不需要在前端放 token。

## 5. 图片策略

- 封面建议统一比例（16:10）
- 妹妹可以上传较大的原图
- 网站首页封面默认输出约 900px 宽
- 项目详情图默认输出约 1800px 宽
- 图片质量默认 `82`，清晰度和体积比较均衡
- 浏览器支持时自动使用 WebP/AVIF

这些参数可以在 `sanity-config.js` 里调整：

```js
image: {
  coverWidth: 900,
  galleryWidth: 1800,
  quality: 82
}
```

## 6. 仍可手动维护

如果暂时不接 Sanity，继续编辑 `projects-data.js` 也能正常使用。

## 7. 上线（Vercel）

- 用 GitHub 账号登录 Vercel
- 选择这个仓库，直接 Deploy
- 得到公网链接后，回到 Sanity 添加 CORS Origin
- 之后妹妹在 Sanity 后台改内容，网站会直接读取最新发布内容

## 8. 后续升级（可选）

- 项目页增加“上一张/下一张”翻图和全屏预览
- 接入自定义域名（如姓名拼音）
- 做上传前压缩：如果以后 Sanity 存储体积压力变大，可以加自定义上传入口，在图片进入 Sanity 前先压缩
