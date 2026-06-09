import {defineField, defineType} from "sanity";

export default defineType({
  name: "project",
  title: "作品项目",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "项目标题",
      type: "string",
      description: "网站上显示的中文作品名，例如：寻常古音。",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "项目链接代号",
      type: "slug",
      description: "点 Generate 自动生成即可；这是网址里的代号，不是展示给访客看的标题。",
      options: {
        source: "title",
        maxLength: 96
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "category",
      title: "分类",
      type: "string",
      description: "首页筛选按钮会按这里的分类显示。",
      options: {
        list: [
          {title: "毕设", value: "毕设"},
          {title: "插画", value: "插画"},
          {title: "绘本", value: "绘本"},
          {title: "儿插", value: "儿插"},
          {title: "视觉设计", value: "视觉设计"},
          {title: "作品", value: "作品"}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "year",
      title: "年份",
      type: "string",
      description: "例如：2026，或 2024-2025。",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "sortOrder",
      title: "排序",
      type: "number",
      description: "数字越小越靠前，例如 10、20、30。",
      initialValue: 10
    }),
    defineField({
      name: "description",
      title: "首页简介",
      type: "text",
      description: "首页卡片上的一句话简介，建议 30-80 字。",
      rows: 3,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "tags",
      title: "标签",
      type: "array",
      description: "可选。用于展示关键词，比如 Illustration、Character、Picture Book。",
      of: [{type: "string"}],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "challenge",
      title: "项目背景",
      type: "text",
      description: "可选。这个项目想解决什么、灵感或主题是什么。",
      rows: 4
    }),
    defineField({
      name: "role",
      title: "我的角色",
      type: "text",
      description: "可选。写自己负责了哪些部分，例如调研、构图、绘制、后期。",
      rows: 4
    }),
    defineField({
      name: "process",
      title: "过程拆解",
      type: "array",
      description: "可选。逐条写创作过程，详情页会显示成列表。",
      of: [{type: "string"}]
    }),
    defineField({
      name: "outcome",
      title: "结果与复盘",
      type: "text",
      description: "可选。写最终成果、收获或适合投递的方向。",
      rows: 4
    }),
    defineField({
      name: "preview",
      title: "首页封面图",
      type: "image",
      description: "首页卡片显示的封面图。建议横图或构图完整的代表作。",
      options: {
        hotspot: true,
        accept: "image/jpeg,image/png,image/webp"
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "images",
      title: "项目图片",
      type: "array",
      description: "详情页展示的全部图片，按上传顺序显示。",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
            accept: "image/jpeg,image/png,image/webp"
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1)
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "preview"
    }
  }
});
