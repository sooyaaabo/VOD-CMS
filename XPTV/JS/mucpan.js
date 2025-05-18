// 引用链接: https://raw.githubusercontent.com/kingreevice/my_xptv/main/js/mucpan.js
//昊
const cheerio = createCheerio()

// 預先定義請求使用的 user-agent
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'

const appConfig = {
    ver: 1,
    title: '小米UC资源站|昊',
    site: 'http://www.mucpan.cc',
    tabs: [
        {
            name: '全部小米电影',
            ext: {
                id: 20,
            },
        },
        {
            name: '小米电影片库',
            ext: {
                id: 21,
            },
        },
        {
            name: '小米动漫片库',
            ext: {
                id: 22,
            },
        },
        {
            name: '小米综艺片库',
            ext: {
                id: 23,
            },
        }, 
      {
            name: '小米少儿片库',
            ext: {
                id: 24,
            },
        },
    ],
}
async function getConfig() {
    return jsonify(appConfig)
}
async function getCards(ext) {
    ext = argsify(ext)
    let cards = []
    // let page = ext.page
    // let id = ext.id
    let { page = 1, id } = ext
    const url = appConfig.site + `/index.php/vod/show/id/${id}/page/${page}.html`
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })
    const $ = cheerio.load(data)
    const videos = $('.module-item')
    videos.each((_, e) => {
        const href = $(e).find('.module-item-cover a').attr('href')
        const title = $(e).find('.module-item-cover a').attr('title')
        const cover = $(e).find('img').attr('src')
        const remarks = $(e).find('.module-item-text').text()
        cards.push({
            vod_id: href,
            vod_name: title,
            vod_pic: cover,
            vod_remarks: remarks,
            ext: {
                url: `${appConfig.site}${href}`,
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
    const { data } = await $fetch.get(url, {
        headers: {
            'User-Agent': UA,
        },
    })

    const $ = cheerio.load(data)

    const playlist = $('.module-row-one .module-row-info .module-row-text')
    playlist.each((_, e) => {
        const name = $(e).attr('title').replace('复制', '').replace('第1集下载地址', '')
        const ShareUrl = $(e).attr('data-clipboard-text')   
        tracks.push({
            name:name.trim(),
            pan: ShareUrl ,
           ext: {
                        url: '',
                    }, 
        })
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
	return jsonify({ urls: [] })
}

async function search(ext) {
	ext = argsify(ext)
	let cards = []

	let text = encodeURIComponent(ext.text)
	//let page = ext.page || 1
	let url = `${appConfig.site}/index.php/vod/search.html?wd=${text}`

	const { data } = await $fetch.get(url, {
		headers: {
			'User-Agent': UA,
		},
	})

const $ = cheerio.load(data);

const videos = $('div.module-search-item');
videos.each((_, e) => {
    const img = $(e).find('div.module-item-pic img');
    const title = img.attr('alt'); // 提取标题
    const cover = img.attr('data-src') || img.attr('src'); // 提取封面地址

    const serialLink = $(e).find('div.video-info div.video-info-header a.video-serial');
    const href = serialLink.attr('href'); // 提取链接
    const remarks = serialLink.text().trim(); // 提取更新信息

    cards.push({
        vod_id: href,
        vod_name: title,
        vod_pic: cover,
        vod_remarks: remarks,
        ext: {
            url: href.startsWith('http') ? href : `${appConfig.site}${href}`, // 拼接完整链接
        },
    });
});


	
	return jsonify({
		list: cards,
	})
}
