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
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "项目链接",
      type: "slug",
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
      options: {
        list: [
          {title: "插画", value: "插画"},
          {title: "绘本", value: "绘本"},
          {title: "儿插", value: "儿插"},
          {title: "视觉设计", value: "视觉设计"}
        ]
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "year",
      title: "年份",
      type: "string",
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
      rows: 3,
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "tags",
      title: "标签",
      type: "array",
      of: [{type: "string"}],
      options: {
        layout: "tags"
      }
    }),
    defineField({
      name: "challenge",
      title: "项目背景",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "role",
      title: "我的角色",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "process",
      title: "过程拆解",
      type: "array",
      of: [{type: "string"}]
    }),
    defineField({
      name: "outcome",
      title: "结果与复盘",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "preview",
      title: "首页封面图",
      type: "image",
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
