// 引用链接: https://raw.githubusercontent.com/kingreevice/my_xptv/main/js/yunchao.js
//昊
//2025-3
//需要-主站-登入食用
const cheerio = createCheerio()
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2 like Mac OS X) AppleWebKit/604.1.14 (KHTML, like Gecko)'

const appConfig = {
	ver: 1,
	title: '云巢',
	site: 'https://www.pecc.xin',
	tabs: [
		{
			name: '最新',
			ext: {
				id: '/index',
			},
		},
		{
			name: '电影',
			ext: {
				id: '/forum-1',
			},
		},
		{
			name: '电视剧',
			ext: {
				id: '/forum-12',
			},
		},
		{
			name: '动漫',
			ext: {
				id: '/forum-13',
			},
		},
		{
			name: '综艺',
			ext: {
				id: '/forum-14',
			},
		}

	],
}
async function getConfig() {

	return jsonify(appConfig)
}

async function getCards(ext) {
	ext = argsify(ext)
	let cards = []
	let { page = 1, id } = ext


	const url = `${appConfig.site}${id}-${page}.htm?orderby=lastpid`

	const { data } = await $fetch.get(url, {
		headers: {
			"User-Agent": UA,
		},
	});
	const $ = cheerio.load(data)

	const videos = $('li.media.thread.tap')

	videos.each((index, e) => {
		let pan_list = ''
		const href = $(e).find('a').attr('href') || 'N/A'
		const img = `${appConfig.site}/${$(e).find('a img').attr('src')}`
		const pan_name = $(e).find('a.badge.badge-dark')

		pan_name.each((_, el) => {

			if ($(el).text().includes('123') || $(el).text().includes('115')) {
				pan_list = pan_list + $(el).text().slice(0, 3) + ''
			} else {

				pan_list = pan_list + $(el).text().slice(0, 2) + ''
			}

		})


		cards.push({
			vod_id: href,
			vod_name: $(e).find('div.subject a').text().replace(/\t|\n/g, '').split(' ')[0],
			vod_pic: img,
			vod_remarks: pan_list,
			ext: {
				url: `${appConfig.site}/${href}`,
			},
		})




	})


	return jsonify({
		list: cards,
	})
}





async function getTracks(ext) {
	let on
	ext = argsify(ext)
	let tracks = []
	let url = ext.url

	do {

		const { data } = await $fetch.get(url, {
			headers: {
				'User-Agent': UA,
			},
		})
		const $ = cheerio.load(data)









		const links = [];
		const div = $('div.alert.alert-success');
		const as = div.find('a');

		as.each((index, element) => {
			const href = $(element).attr('href').replace(/115cdn\.com/, "115.com");
			//const text = $(element).text();


			tracks.push({
				name: '',
				pan: href,
			})
		})

		if (tracks.length == 0) {
			on = await reply(url)

		}
	} while (tracks.length == 0 && on);

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
	const url = ext.url

	return jsonify({ urls: [url] })
}







async function search(ext) {
	ext = argsify(ext)

	let cards = []
	let text = encodeURIComponent(ext.text).replace(/%/g, '_')
	let page = ext.page || 1
	let url = `${appConfig.site}/search-${text}-${page}.htm`

	const { data } = await $fetch.get(url, {
		headers: {
			"User-Agent": UA,
		},
	})

	const $ = cheerio.load(data)

	const videos = $('li.media.thread.tap')

	videos.each((index, e) => {

		const href = $(e).find('a').attr('href') || 'N/A'
		const img = `${appConfig.site}/${$(e).find('a img').attr('src')}`


		cards.push({
			vod_id: href,
			vod_name: $(e).find('a').text().trim(),
			vod_pic: img,
			vod_remarks: '',
			ext: {
				url: `${appConfig.site}/${href}`,
			},
		})




	})


	return jsonify({
		list: cards,
	})
}

function getRandomText(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
async function reply(url) {
	const change = ['给楼主磕头了', '终于找到资源了', '太棒了', '好好好', '好资源', 'thank you!', '楼主辛苦了'];
	const id = url.match(/thread-(\d+).htm/)
	const newurl = `https://www.pecc.xin/post-create-${id[1]}-1.htm`
	const { data } = await $fetch.post(newurl, {
		doctype: 1,
		return_html: 1,
		quotepid: 0,
		message: `${getRandomText(change)}`,
		quick_reply_message: 0

	});
	const $ = cheerio.load(data)

	const errorMessage = $('.row .col-lg-8.mx-auto .card .card-body h4').text().trim() || $('i.icon-ok').text().trim() || $('a.btn.jb-blue').text().trim();

	if (errorMessage.includes("登录")) {
		$utils.toastError("请在主站注册登入");
		$utils.openSafari(appConfig.site, UA);
		return false
	} else if (errorMessage.includes("60")) {
		$utils.toastError("60s保护无法获取连接")
		return false
	}

	return true
}

