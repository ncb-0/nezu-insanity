import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset} from './sanity.config'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost: process.env.SANITY_STUDIO_HOSTNAME,
  autoUpdates: true,

  // project: {
  //   basePath: '/studio',
  // },
})
