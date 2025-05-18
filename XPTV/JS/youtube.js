// 引用链接: https://gist.githubusercontent.com/Yswag/98b86b68755f698e2f601962f76c036a/raw/you.js
const cheerio = createCheerio()
const CryptoJS = createCryptoJS()
/*
{
    "follows": [
        {
            "name": "徐雅",
            "code": "@e_seoa"
        },
        {
            "name": "陈一发儿",
            "code": "@chenyifaer",
            "type": "vod"
        }
    ],
    "headers": {
        "cookie": "",
        "authorization": ""
    }
}
*/
let $config = argsify($config_str)
let UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'

let appConfig = {
    ver: 1,
    title: '油管',
    site: 'https://www.youtube.com',
}

async function getConfig() {
    let tabs = [
        {
            name: '推薦',
            ext: {
                code: '',
                type: 'home',
            },
            ui: 1,
        },
        {
            name: '热门',
            ext: {
                code: '',
                type: 'hot',
            },
            ui: 1,
        },
        {
            name: '订阅',
            ext: {
                code: '',
                type: 'follow',
            },
        },
        {
            name: '最近更新',
            ext: {
                code: '',
                type: 'update',
            },
        },
    ]
    $config.follows?.forEach((each) => {
        tabs.push({
            name: each.name,
            ext: {
                code: each.code,
                type: each?.type || 'vod',
            },
            ui: 1,
        })
    })
    await initSession()
    return jsonify({
        ver: 1,
        title: '油管',
        site: 'https://www.youtube.com',
        tabs,
    })
}

async function initSession() {
    const url = appConfig.site
    const headers = {
        'User-Agent': UA,
    }
    const { data } = await $fetch.get(url, {
        headers,
    })
    const regex = /window.*?ytplayer=\{\};ytcfg\.set\((.*?)\);/
    const match = data.replace(/\n/g, '').match(regex)
    const ytcfg = JSON.parse(match[1])
    const apikey = ytcfg.INNERTUBE_API_KEY
    const context = ytcfg.INNERTUBE_CONTEXT
    $cache.set('youtube_api_key', apikey)
    $cache.set('youtube_context', jsonify(context))
}

async function getCards(ext) {
    ext = argsify(ext)
    let { code, page, type } = ext
    type = type.toLowerCase()

    let cards = []
    switch (type) {
        case 'home':
            cards = await parseHomeVideos(page)
            break
        case 'hot':
            cards = await parseTrendingVideos(page)
            break
        case 'follow':
            if (page > 1) break

            $config.follows.forEach((each) => {
                cards.push({
                    vod_id: each.code,
                    vod_name: each.name,
                    vod_pic: '',
                    ext: {
                        code: each.code,
                        type: 'follow',
                    },
                })
            })
            break
        case 'update':
            break
        case 'vod':
        case 'live':
            cards = await parseChannelVideos(code, page, type)
            break
        default:
            break
    }

    return jsonify({
        list: cards,
    })
}

async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []

    if (ext.type == 'follow') {
        const code = ext.code
        const url = `https://www.youtube.com/${code}/videos`
        const headers = {
            Origin: 'https://www.youtube.com',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        }
        const { data } = await $fetch.get(url, {
            headers,
        })
        let matches = data.match(/var ytInitialData = (.*)}}};/)
        let jsdata = matches[1] + '}}}'
        let parsedResponse = JSON.parse(jsdata)
        let items = parsedResponse.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents
        items.forEach((each) => {
            if (each.richItemRenderer != undefined) {
                tracks.push({
                    name: each.richItemRenderer.content.videoRenderer.title.runs[0].text,
                    pan: '',
                    ext: {
                        id: each.richItemRenderer.content.videoRenderer.videoId,
                    },
                })
            }
        })
    } else {
        tracks.push({
            name: '播放',
            pan: '',
            ext,
        })
    }

    return jsonify({
        list: [
            {
                title: '默认分组',
                tracks,
            },
        ],
    })
}

async function getPlayinfo(ext) {
    ext = argsify(ext)
    let videoId = ext.id
    $print(`***id: ${videoId}`)
    const apiKey = 'AIzaSyB-63vPrdThhKuerbB2N_l7Kwwcxj6yUAc'
    // const apiKey = $cache.get('youtube_api_key')
    // const context = argsify($cache.get('youtube_context'))
    const headers = {
        'X-YouTube-Client-Name': '5',
        'X-YouTube-Client-Version': '19.09.3',
        Origin: 'https://m.youtube.com',
        'User-Agent': 'com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)',
        'content-type': 'application/json',
    }
    if ($config?.headers?.cookie && $config?.headers?.authorization) {
        headers['Cookie'] = $config.headers.cookie
        headers['Authorization'] = $config.headers.authorization
    }

    const b = {
        context: {
            client: {
                clientName: 'IOS',
                clientVersion: '19.09.3',
                deviceModel: 'iPhone14,3',
                userAgent: 'com.google.ios.youtube/19.09.3 (iPhone14,3; U; CPU iOS 15_6 like Mac OS X)',
                hl: 'en',
                timeZone: 'UTC',
                utcOffsetMinutes: 0,
            },
        },
        videoId,
        playbackContext: { contentPlaybackContext: { html5Preference: 'HTML5_PREF_WANTS' } },
        contentCheckOk: true,
        racyCheckOk: true,
    }

    const { data } = await $fetch.post(`https://www.youtube.com/youtubei/v1/player?key=${apiKey}&prettyPrint=false`, JSON.stringify(b), {
        headers,
    })

    let playurl = argsify(data).streamingData.hlsManifestUrl
    $print(`***playurl: ${playurl}`)
    return jsonify({ urls: [playurl] })
}

async function search(ext) {
    ext = argsify(ext)
    let cards = []

    if (ext.page == 1) {
        function getSearchParam() {
            let d = new Uint8Array(50)
            let t = 0
            let c = 0
            d[t] = 0x12
            t++
            c = t
            t++
            d[t] = 0x10
            t++
            d[t] = ['any', 'videos', 'channels', 'playlists', 'movies'].indexOf('videos')
            t++
            d[c] = t - c - 1
            // let n = Buffer.from(d.slice(0, t))
            // let s = n.toString('base64')
            let n = CryptoJS.lib.WordArray.create(d.slice(0, t))
            let s = CryptoJS.enc.Base64.stringify(n)
            return encodeURIComponent(s)
        }

        const text = ext.text
        const apiKey = $cache.get('youtube_api_key')
        const context = argsify($cache.get('youtube_context'))

        const url = `https://www.youtube.com/youtubei/v1/search?key=${apiKey}`
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
        }
        const postData = {
            context: context,
            params: getSearchParam(),
            query: text,
        }
        const { data } = await $fetch.post(url, jsonify(postData), {
            headers,
        })
        const videos = argsify(data).contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
        // $print(videos)
        videos.forEach((e) => {
            if (e.videoRenderer != undefined) {
                const item = e.videoRenderer
                cards.push({
                    vod_id: item.videoId,
                    vod_name: item.title.runs[0].text,
                    vod_pic: item.thumbnail.thumbnails.at(-1).url,
                    vod_remarks: item?.publishedTimeText?.simpleText || '',
                    ext: {
                        id: item.videoId,
                    },
                })
            }
        })
        const token =
            argsify(data).contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[1].continuationItemRenderer.continuationEndpoint
                .continuationCommand.token
        $cache.set('youtube_continuation_token', token)
    } else {
        const url = `https://www.youtube.com/youtubei/v1/search?prettyPrint=false`
        const context = argsify($cache.get('youtube_context'))
        const continuation = $cache.get('youtube_continuation_token')
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
        }
        const postData = {
            context: context,
            continuation,
        }
        const { data } = await $fetch.post(url, jsonify(postData), {
            headers,
        })
        const videos = argsify(data)?.onResponseReceivedCommands[0]?.appendContinuationItemsAction?.continuationItems[0]?.itemSectionRenderer?.contents
        // $print(videos)
        videos.forEach((e) => {
            if (e.videoRenderer != undefined) {
                const item = e.videoRenderer
                cards.push({
                    vod_id: item.videoId,
                    vod_name: item.title.runs[0].text,
                    vod_pic: item.thumbnail.thumbnails.at(-1).url,
                    vod_remarks: item?.publishedTimeText?.simpleText || '',
                    ext: {
                        id: item.videoId,
                    },
                })
            }
        })
        const token =
            argsify(data).onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems[1].continuationItemRenderer.continuationEndpoint
                .continuationCommand.token
        $cache.set('youtube_continuation_token', token)
    }

    return jsonify({
        list: cards,
    })
}

async function parseHomeVideos(page) {
    let cards = []
    if (page == '1') {
        const url = 'https://www.youtube.com/results?search_query=%E6%9C%80%E6%96%B0%7C%E6%8E%A8%E8%96%A6'
        const { data } = await $fetch.get(url, {
            headers: {
                'User-Agent': UA,
            },
        })
        let matches = data.match(/var ytInitialData = (.*?);<\/script>/)
        let jsdata = matches[1]
        let parsedResponse = JSON.parse(jsdata)
        let items = parsedResponse.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents
        // $print(JSON.stringify(items))
        items.forEach((e) => {
            if (e.videoRenderer != undefined) {
                const item = e.videoRenderer
                cards.push({
                    vod_id: item.videoId,
                    vod_name: item.title.runs[0].text,
                    vod_pic: item.thumbnail.thumbnails.at(-1).url,
                    vod_remarks: item?.publishedTimeText?.simpleText || '',
                    ext: {
                        id: item.videoId,
                    },
                })
            }
        })
        const token =
            parsedResponse.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[1].continuationItemRenderer.continuationEndpoint
                .continuationCommand.token
        $cache.set('youtube_continuation_token', token)
    } else {
        const apiKey = $cache.get('youtube_api_key')
        const context = argsify($cache.get('youtube_context'))
        const continuationToken = $cache.get('youtube_continuation_token')

        const url = `https://www.youtube.com/youtubei/v1/search?key=${apiKey}`
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
        }
        const postData = {
            context: context,
            continuation: continuationToken,
        }
        const { data } = await $fetch.post(url, jsonify(postData), {
            headers,
        })
        const videos = argsify(data)?.onResponseReceivedCommands[0]?.appendContinuationItemsAction?.continuationItems[0]?.itemSectionRenderer?.contents
        videos.forEach((e) => {
            if (e.videoRenderer != undefined) {
                const item = e.videoRenderer
                cards.push({
                    vod_id: item.videoId,
                    vod_name: item.title.runs[0].text,
                    vod_pic: item.thumbnail.thumbnails.at(-1).url,
                    vod_remarks: item?.publishedTimeText?.simpleText || '',
                    ext: {
                        id: item.videoId,
                    },
                })
            }
        })
        const token =
            argsify(data).onResponseReceivedCommands[0].appendContinuationItemsAction.continuationItems[1].continuationItemRenderer.continuationEndpoint
                .continuationCommand.token
        $cache.set('youtube_continuation_token', token)
    }

    return cards
}

async function parseTrendingVideos(page) {
    let cards = []
    if (page > 1) return cards

    const url = 'https://www.youtube.com/feed/trending'
    const headers = {
        Origin: 'https://www.youtube.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    }
    const { data } = await $fetch.get(url, {
        headers,
    })
    let matches = data.match(/var ytInitialData = (.*)}}};/)
    let jsdata = matches[1] + '}}}'
    let parsedResponse = JSON.parse(jsdata)
    let items = parsedResponse.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents
    items.forEach((each) => {
        each.itemSectionRenderer?.contents[0]?.shelfRenderer?.content?.expandedShelfContentsRenderer?.items.forEach((one) => {
            cards.push({
                vod_id: one.videoRenderer.videoId,
                vod_name: one.videoRenderer.title.runs[0].text,
                vod_pic: one.videoRenderer.thumbnail.thumbnails.at(-1).url,
                vod_remarks: '',
                ext: {
                    id: one.videoRenderer.videoId,
                },
            })
        })
    })
    return cards
}

async function parseChannelVideos(code, page, type) {
    let cards = []
    let pageSize = 30
    const apiKey = $cache.get('youtube_api_key')
    const context = argsify($cache.get('youtube_context'))
    const params = type === 'vod' ? 'EgZ2aWRlb3MYAyAAMAE%3D' : 'EgdzdHJlYW1z8gYECgJ6AA%3D%3D'

    const url = `https://www.youtube.com/youtubei/v1/browse?key=${apiKey}`
    const headers = {
        'User-Agent': UA,
        'Content-Type': 'application/json',
    }
    let postData = undefined
    if (page === 1) {
        $cache.set('youtube_isLastPage', 'false')
        const channelId = await getChannelId(code)
        postData = {
            context: context,
            browseId: channelId,
            params: params,
        }
    } else {
        let isLastPage = $cache.get('youtube_isLastPage')
        if (isLastPage === 'true') return cards
        const continuationToken = $cache.get('youtube_continuation_token')
        postData = {
            context: context,
            continuation: continuationToken,
        }
    }

    const { data } = await $fetch.post(url, jsonify(postData), {
        headers,
    })

    let videos = argsify(data).contents?.twoColumnBrowseResultsRenderer?.tabs[type === 'vod' ? 1 : 3]?.tabRenderer?.content?.richGridRenderer?.contents
    if (page > 1) {
        videos = argsify(data).onResponseReceivedActions[0].appendContinuationItemsAction.continuationItems
    }
    videos.forEach((e) => {
        if (e.richItemRenderer != undefined) {
            const item = e.richItemRenderer.content.videoRenderer
            cards.push({
                vod_id: item.videoId,
                vod_name: item.title.runs[0].text,
                vod_pic: item.thumbnail.thumbnails.at(-1).url,
                vod_remarks: item?.publishedTimeText?.simpleText || '',
                ext: {
                    id: item.videoId,
                },
            })
        } else if (e.continuationItemRenderer) {
            const token = e.continuationItemRenderer.continuationEndpoint.continuationCommand.token
            $cache.set('youtube_continuation_token', token)
        }
    })
    // $print(`***videos length: ${cards.length}`)
    if (cards.length < pageSize) $cache.set('youtube_isLastPage', 'true')

    return cards

    async function getChannelId(code) {
        const url = `https://www.youtube.com/${encodeURIComponent(code)}`
        const headers = {
            Origin: 'https://www.youtube.com',
            'User-Agent': UA,
        }
        const response = await $fetch.get(url, { headers })
        const $ = cheerio.load(response.data)
        const link = $('link[rel="canonical"]').attr('href')
        const channelId = link.split('/channel/')[1]
        return channelId
    }
}
