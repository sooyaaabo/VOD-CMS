// 引用链接: https://raw.githubusercontent.com/pack1r/ForwardWidgets/main/widgets/imdb.js
WidgetMetadata = {
  id: "imdb",
  title: "IMDB",
  description: "IMDB",
  author: "pack1r",
  site: "https://github.com/pack1r/ForwardWidgets",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  modules: [
    {
      title: "IMDB 片单",
      description: "IMDB 片单",
      requiresWebView: false,
      functionName: "loadCardItems",
      params: [
        {
          name: "url",
          title: "列表地址",
          type: "input",
          description: "IMDB 片单地址",
          placeholders: [
            {
              title: "IMDb Top 250 Movies",
              value: "https://www.imdb.com/chart/top/?ref_=nv_mv_250",
            },
            {
              title: "IMDb Top 250 TV",
              value: "https://www.imdb.com/chart/toptv/?ref_=nv_tvv_250",
            },
          ],
        },
      ],
    },
    {
      title: "IMDB 推荐",
      description: "IMDB 推荐",
      requiresWebView: false,
      functionName: "loadApiItems",
      params: [
        {
          name: "url",
          title: "API 地址",
          type: "input",
          description: "IMDB API 地址",
          placeholders: [
            {
              title: "用户最爱",
              value:
                "https://api.graphql.imdb.com/?operationName=FanFavorites&variables=%7B%22first%22%3A48,%22includeUserRating%22%3Afalse,%22locale%22%3A%22zh-CN%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22sha256Hash%22%3A%227c01e0d9d8581975bf64701df0c96b02aaec777fdfc75734d68d009bde984b99%22,%22version%22%3A1%7D%7D",
            },
            {
              title: "热门选择",
              value: "https://api.graphql.imdb.com/?operationName=TopPicksTab&variables=%7B%22first%22%3A48%2C%22includeUserRating%22%3Afalse%2C%22locale%22%3A%22zh-CN%22%7D&extensions=%7B%22persistedQuery%22%3A%7B%22sha256Hash%22%3A%222f5671615846a8c1698b904a993e6eace63c5f94293eb7b68d12c105b6f5f319%22%2C%22version%22%3A1%7D%7D"
            },
            {
              title: "最受欢迎",
              value: "https://api.graphql.imdb.com/?operationName=PopularTitles&variables=%7B%22includeUserRating%22%3Afalse%2C%22limit%22%3A48%2C%22locale%22%3A%22zh-CN%22%2C%22queryFilter%22%3A%7B%22releaseDateRange%22%3A%7B%22end%22%3A%222025-04-02%22%7D%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22sha256Hash%22%3A%22f928c4406df23ac79204ff916c3f7429d3a44c9aac069d332a9d7eb6932c4f2f%22%2C%22version%22%3A1%7D%7D"
            }
          ],
        },
      ],
    },
  ],
};

async function loadCardItems(params = {}) {
  const url = params.url;
  if (!url) {
    console.error("缺少片单 URL");
    throw new Error("缺少片单 URL");
  }

  const response = await Widget.http.get(url, {
    headers: {
      Referer: "https://www.imdb.com/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });
  if (!response || !response.data) {
    throw new Error("获取片单数据失败");
  }

  console.log(response.data);
  const videoIds = [];

  //load application/ld+json content
  const ldJson = response.data.match(
    /<script type="application\/ld\+json">(.*?)<\/script>/
  )
  if (ldJson && ldJson[1]) {
    const json = JSON.parse(ldJson[1]);
    console.log(json);
    for (const item of json.itemListElement) {
      //regex ttxxxx id
      const match = item.item.url.match(/tt(\d+)/);
      if (match && match[1]) {
        videoIds.push({
          id: `tt${match[1]}`,
          type: "imdb",
          title: item.name,
          description: item.description,
          coverUrl: item.image,
        });
      }
    }
  } else {
    const docId = Widget.dom.parse(response.data);
    if (docId < 0) {
      throw new Error("解析 HTML 失败");
    }
    const videoElementIds = Widget.dom.select(docId, ".ipc-metadata-list-summary-item .ipc-poster a");
    for (const itemId of videoElementIds) {
      const link = await Widget.dom.attr(itemId, "href");
      const id = link.match(/tt(\d+)/);
      if (id && id[1]) {
        videoIds.push({ id: `tt${id[1]}`, type: "imdb" });
      }
    }
  }

  console.log(videoIds);
  return videoIds;
}

async function loadApiItems(params = {}) {
  const url = params.url;
  if (!url) {
    console.error("缺少 API 地址");
    throw new Error("缺少 API 地址");
  }

  const response = await Widget.http.get(url, {
    headers: {
      "Content-Type": "application/json",
      Referer: "https://www.imdb.com/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    },
  });

  console.log(response.data);
  if (!response || !response.data) {
    throw new Error("获取 API 数据失败");
  }

  const videos = [];
  response.data.data.fanPicksTitles.edges.forEach((edge) => {
    const node = edge.node;
    videos.push({
      id: node.id,
      type: "imdb",
      title: node.titleText["text"],
      coverUrl: node.primaryImage["url"],
    });
  });

  return videos;
}
