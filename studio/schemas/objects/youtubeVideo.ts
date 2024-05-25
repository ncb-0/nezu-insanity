import {defineType} from 'sanity'

export default defineType({
  name: 'youtubeEmbed',
  type: 'object',
  fields: [
    {
      name: 'video',
      type: 'youtubeVideo',
    },
    {
      name: 'autoplay',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'controls',
      type: 'boolean',
      initialValue: true,
    },
  ],
})
