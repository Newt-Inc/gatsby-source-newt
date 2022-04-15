import { GetContentsQuery, Client } from 'newt-client-js'

export const fetchAll = async (
  client: Client,
  appUid: string,
  modelUid: string,
  query: GetContentsQuery
) => {
  const MAX_LIMIT = 1000
  const limit = query.limit

  if (limit && limit <= MAX_LIMIT) {
    const { items } = await client.getContents({
      appUid,
      modelUid,
      query,
    })
    return items
  }

  query.limit = MAX_LIMIT
  const { skip, total, items } = await client.getContents({
    appUid,
    modelUid,
    query,
  })
  let allItems = items

  let allCount = total
  if (limit && skip + limit < total) allCount = skip + limit
  query.skip = skip + MAX_LIMIT

  while (query.skip < allCount) {
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
