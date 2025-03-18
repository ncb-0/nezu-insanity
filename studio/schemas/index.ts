import blockContent from './blockContent'
import post from './post'
import blogPost from './blogPost'
import artwork from './artwork'
import gallery from './objects/gallery'
import imagerow from './objects/imagerow'
import youtubeEmbed from './objects/youtubeVideo'
import button from './objects/button'
import {localeString} from './localeStringType'

export const schemaTypes = [
  post,
  blogPost,
  artwork,
  blockContent,
  gallery,
  imagerow,
  youtubeEmbed,
  button,
  localeString,
]
