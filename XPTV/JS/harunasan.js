// 引用链接: https://gist.githubusercontent.com/Yswag/d9f072b75dab5b1b107c523dd148eea3/raw/harunasan.js
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0.1 Mobile/15E148 Safari/604.1'

let appConfig = {
    ver: 1,
    title: '聚合直播',
    site: 'http://api.maiyoux.com:81',
}

async function getConfig() {
    let config = appConfig
    config.tabs = await getTabs()
    return jsonify(config)
}

async function getTabs() {
    let list = []
    let ignore = ['卫视直播', '龙珠', '映客']
    function isIgnoreClassName(className) {
        return ignore.some((element) => className.includes(element))
    }

    const jsonurl = appConfig.site + '/mf/json.txt'
    const { data } = await $fetch.get(jsonurl, {
        headers: {
            'User-Agent': UA,
        },
    })

    argsify(data).pingtai.forEach((e) => {
        const name = `${e.title} (${e.Number})`
        const href = e.address
        const isIgnore = isIgnoreClassName(name)
        if (isIgnore) return

        list.push({
            name,
            ext: {
                url: encodeURI(href),
            },
        })
    })

    return list
}

async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    let jsonurl = ext.url
    let page = ext.page
    let url
    if (page === 1) {
        url = `${appConfig.site}/mf/${jsonurl}`
    }
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    argsify(data).zhubo.forEach((e) => {
        const cover = e.img
        const time = e.duration
        const addtime = e.createAt
        const address = e.address
        if (address.startsWith('rtmp')) return
        cards.push({
            vod_id: address,
            vod_name: e.title,
            vod_pic: cover,
            vod_remarks: 'live',
            ext: {
                url: address,
            },
        })
    })
    return jsonify({
        list: cards,
    })
}

async function getTracks(ext) {
    ext = argsify(ext)
    let tracks = []
    let url = ext.url
    tracks.push({
        name: '播放',
        ext: {
            playurl: url,
        },
    })
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
    let playurl = ext.playurl
    return jsonify({ urls: [playurl] })
}
