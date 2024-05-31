import {defineType} from 'sanity'

export default defineType({
  title: 'button',
  name: 'Button',
  type: 'object',
  fields: [
    {
      title: 'URL',
      name: 'href',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    },
    {
      title: 'Button Text',
      name: 'buttonText',
      type: 'string',
    },
    {
      title: 'Inline?',
      name: 'inline',
      type: 'boolean',
    },
  ],
})
