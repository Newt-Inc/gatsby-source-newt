import { PluginOptions, SourceNodesArgs } from 'gatsby'
import axios from 'axios'
import camelCase from 'camelcase'

exports.sourceNodes = async (
  { actions, createContentDigest, createNodeId }: SourceNodesArgs,
  pluginOptions: PluginOptions
) => {
  const { createNode } = actions

  const {
    spaceUid,
    appUid,
    modelUid,
    token,
    apiType = 'cdn',
    query,
  } = pluginOptions

  const axiosInstance = axios.create({
    baseURL: `https://${spaceUid}.${apiType}.newt.so/v1`,
    headers: { Authorization: `Bearer ${token}` },
  })

  let url = `/${appUid}/${modelUid}`
  if (query) {
    url = url + '?' + query
  }
  const { data } = await axiosInstance.get(url)

  const type = camelCase(['Newt', modelUid + ''], {
    pascalCase: true,
  })

  // eslint-disable-next-line
  data.items.forEach((item: any) =>
    createNode({
      ...item,
      id: createNodeId(
        `${spaceUid}-${appUid}-${modelUid}-${apiType}-${item._id}`
      ),
      parent: null,
      children: [],
      internal: {
        type,
        content: JSON.stringify(item),
        contentDigest: createContentDigest(item),
      },
    })
  )
  return
}
