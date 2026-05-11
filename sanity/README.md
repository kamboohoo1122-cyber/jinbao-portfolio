# 何金宝作品集 Sanity 后台

## 本地启动后台

```bash
cd sanity
npm install
SANITY_STUDIO_PROJECT_ID=你的ProjectID SANITY_STUDIO_DATASET=production npm run dev
```

启动后打开终端显示的地址，就可以编辑作品项目。

## 部署后台

```bash
cd sanity
SANITY_STUDIO_PROJECT_ID=你的ProjectID SANITY_STUDIO_DATASET=production npm run deploy
```

Sanity 会给后台生成一个独立地址。把妹妹的账号邀请进 Sanity 项目，她就可以在后台新增、删除和调整作品。

## 图片压缩策略

后台保留原图，网站展示时通过 Sanity CDN 自动输出合适尺寸：

- 首页封面：约 900px 宽
- 项目详情图：约 1800px 宽
- 图片质量：82
- 自动格式：浏览器支持时会使用 WebP/AVIF

这些参数在网站根目录的 `sanity-config.js` 里调整。
