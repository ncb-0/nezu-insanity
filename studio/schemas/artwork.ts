import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'artwork',
  title: 'Artwork',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'nsfw',
      title: 'NSFW',
      type: 'boolean',
    }),
    defineField({
      name: 'myTags',
      title: 'Tags',
      type: 'tags',
      options: {
        includeFromRelated: 'myTags',
        onCreate: (value) => ({
          label: value,
          value: value.toLowerCase().replace(/\W/g, '-'),
        }),
      },
    }),
    defineField({
      name: 'media',
      title: 'Media',
      type: 'tags',
      options: {
        includeFromRelated: 'Media',
        onCreate: (value) => ({
          label: value,
          value: value.toLowerCase().replace(/\W/g, '-'),
        }),
      },
    }),
    defineField({
      name: 'characters',
      title: 'Characters',
      type: 'tags',
      options: {
        includeFromRelated: 'Characters',
        onCreate: (value) => ({
          label: value,
          value: value.toLowerCase().replace(/\W/g, '-'),
        }),
      },
    }),
    defineField({
      name: 'cw',
      title: 'CW',
      type: 'tags',
      options: {
        includeFromRelated: 'CW',
        onCreate: (value) => ({
          label: value,
          value: value.toLowerCase().replace(/\W/g, '-'),
        }),
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const {author} = selection
      return {...selection, subtitle: author && `by ${author}`}
    },
  },
})
