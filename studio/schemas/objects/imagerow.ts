import {defineType} from 'sanity'

export default defineType({
  name: 'imagerow',
  title: 'Image Row',
  type: 'object',
  fields: [
    {
      name: 'images',
      type: 'array', // supports drag'n'drop of multiple files
      options: {
        layout: 'grid',
      },
      of: [
        {
          type: 'image',
        },
      ],
    },
  ],
})
