import { createClient } from "@sanity/client";
const dataset = "production";
const projectId = "npvamhe5";
const apiVersion = "2024-05-23";
const studioUrl = "http://localhost:3333";
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl
  }
});
export {
  client as c
};
