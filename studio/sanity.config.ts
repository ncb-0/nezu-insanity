import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {youtubeInput} from 'sanity-plugin-youtube-input'
import {tags} from 'sanity-plugin-tags'
import {schemaTypes} from './schemas'

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
export const dataset = process.env.SANITY_STUDIO_DATASET!

export default defineConfig({
  name: 'nezu-insanity',
  title: 'nezu.world 2.0',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:1337',
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
    }),
    visionTool(),
    tags({}),
    youtubeInput({apiKey: 'AIzaSyCAXCnVt-qXxinyVqAPIzaO8aY4ow5b53Q'}),
  ],
  schema: {
    types: schemaTypes,
  },
})
