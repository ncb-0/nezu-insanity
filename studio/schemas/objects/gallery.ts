import {defineType} from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Gallery',
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
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    },
  ],
})
