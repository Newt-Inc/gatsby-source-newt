import { GetContentsQuery, Client } from 'newt-client-js'

export const fetchAll = async (
  client: Client,
  appUid: string,
  modelUid: string,
  query: GetContentsQuery
) => {
  const MAX_LIMIT = 1000
  query.limit = MAX_LIMIT

  const { total, items } = await client.getContents({
    appUid,
    modelUid,
    query,
  })
  let allItems = items
  query.skip = MAX_LIMIT

  while (query.skip && query.skip < total) {
    const { items } = await client.getContents({
      appUid,
      modelUid,
      query,
    })
    allItems = allItems.concat(items)
    query.skip += MAX_LIMIT
  }

  return allItems
}
