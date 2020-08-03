// const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const createGraphResource = () => {
  const feeds = new Map<string, any[] | null | undefined>()
  return {
    getFeeds: (urls: string[]) => {
      return urls.map((url) => {
        if (!feeds.has(url)) {
          throw fetch(url).then(
            async (response) => {
              try {
                feeds.set(url, await response.json())
              } catch (error) {
                console.error(`Failed to read graph data from url ${url}`, error)
                feeds.set(url, null)
              }
            },
            (error: any) => {
              console.error(`Failed to read graph data from url ${url}`, error)
              feeds.set(url, null)
            }
          )
        }
        return feeds.get(url)
      })
    },
    invalidate: (urls: string[]) => urls.forEach((url) => feeds.delete(url)),
    update: async (urls: string[]) =>
      urls.forEach((url) => {
        fetch(url).then(
          async (response) => {
            feeds.set(url, await response.json())
          },
          (error: any) => {
            console.error(`Failed to read graph data from url ${url}`, error)
          }
        )
      }),
  }
}
