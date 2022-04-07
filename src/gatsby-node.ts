import {
  ParentSpanPluginArgs,
  PluginOptions,
  Reporter,
  SourceNodesArgs,
} from 'gatsby'
import { createClient, GetContentsQuery } from 'newt-client-js'
import camelCase from 'camelcase'

interface PluginConfig extends PluginOptions {
  spaceUid: string
  token: string
  appUid: string
  models: {
    uid: string
    type?: string
    query?: GetContentsQuery
  }[]
  apiType?: 'cdn' | 'api'
}

const validateConfig = (config: Partial<PluginConfig>, reporter: Reporter) => {
  const { spaceUid, token, appUid, models, apiType = 'cdn' } = config
  if (!spaceUid) {
    reporter.panic('spaceUid parameter is required.')
  }
  if (!token) {
    reporter.panic('token parameter is required.')
  }
  if (!appUid) {
    reporter.panic('appUid parameter is required.')
  }
  if (!models) {
    reporter.panic('models parameter is required.')
  }
  models.forEach((model) => {
    const { uid } = model
    if (!uid) {
      reporter.panic('uid parameter is required for model.')
    }
  })
  if (!['cdn', 'api'].includes(apiType)) {
    reporter.panic(
      `apiType parameter should be set to "cdn" or "api". apiType: ${apiType}`
    )
  }
}

export const onPreBootstrap = async (
  { reporter }: ParentSpanPluginArgs,
  pluginOptions: PluginConfig
) => {
  validateConfig(pluginOptions, reporter)
}

export const sourceNodes = async (
  { actions, createContentDigest, createNodeId }: SourceNodesArgs,
  pluginOptions: PluginConfig
) => {
  const { createNode } = actions
  const { spaceUid, token, appUid, models, apiType = 'cdn' } = pluginOptions

  const client = createClient({
    spaceUid,
    token,
    apiType,
  })

  await Promise.all(
    models.map(async (model) => {
      const { items } = await client.getContents({
        appUid,
        modelUid: model.uid,
        query: model.query,
      })

      const type = model.type || model.uid
      const internalType = camelCase(['Newt', type], {
        pascalCase: true,
      })

      // eslint-disable-next-line
      items.forEach((item: any) =>
        createNode({
          ...item,
          id: createNodeId(
            `${spaceUid}-${appUid}-${model.uid}-${item._id}-${apiType}`
          ),
          parent: null,
          children: [],
          internal: {
            type: internalType,
            content: JSON.stringify(item),
            contentDigest: createContentDigest(item),
          },
        })
      )
    })
  )
  return
}
