// 引用链接: https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/main/Widgets/Move_list.js
WidgetMetadata = {
  id: "forward.combined.media.lists",
  title: "影视榜单",
  description: "影视动画榜单",
  author: "阿米诺斯",
  site: "https://github.com/quantumultxx",
  version: "1.0.0",
  requiredVersion: "0.0.1",
  detailCacheDuration: 60,
  modules: [
    // -------------TMDB模块-------------
    // --- 当前与趋势模块 ---
    {
      title: "TMDB 正在热映",
      description: "当前影院或流媒体上映的电影/剧集",
      requiresWebView: false,
      functionName: "tmdbNowPlaying",
      cacheDuration: 3600,
      params: [
        { 
          name: "type", 
          title: "🎭类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], 
          value: "movie" 
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 今日热门",
      description: "今日热门电影与剧集",
      requiresWebView: false,
      functionName: "loadTodayGlobalMedia",
      cacheDuration: 1,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    {
      title: "TMDB 本周热门",
      description: "本周热门电影与剧集",
      requiresWebView: false,
      functionName: "loadWeekGlobalMovies",
      cacheDuration: 1,
      params: [
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // --- 常规发现模块 ---
    {
      title: "TMDB 高分内容",
      description: "高分电影或剧集 (按用户评分排序)",
      requiresWebView: false,
      functionName: "tmdbTopRated",
      cacheDuration: 3600,
      params: [
        { 
          name: "type", 
          title: "🎭类型", 
          type: "enumeration", 
          enumOptions: [
            { title: "电影", value: "movie" },
            { title: "剧集", value: "tv" }
          ], 
          value: "movie" 
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        { name: "page", title: "页码", type: "page" }
      ]
    },
    // --- 播出平台模块 ---
    {
        title: "TMDB 播出平台",
        description: "按播出平台和内容类型筛选剧集内容",
        requiresWebView: false,
        functionName: "tmdbDiscoverByNetwork",
        cacheDuration: 3600,
        params: [
            {
                name: "with_networks",
                title: "播出平台",
                type: "enumeration",
                description: "选择一个平台以查看其剧集内容",
                value: "",
                belongTo: {
                  paramName: "air_status",
                  value: ["released","upcoming"],
                },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Tencent", value: "2007" },
            { title: "iQiyi", value: "1330" },
            { title: "Youku", value: "1419" },
            { title: "Bilibili", value: "1605" },
            { title: "MGTV", value: "1631" },
            { title: "Netflix", value: "213" },
            { title: "Disney+", value: "2739" },
            { title: "HBO", value: "49" },
            { title: "HBO Max", value: "3186" },
            { title: "Apple TV+", value: "2552" },
            { title: "Hulu", value: "453" },
            { title: "Amazon Prime Video", value: "1024" },
            { title: "FOX", value: "19" },
            { title: "Paramount+", value: "4330" },
            { title: "TV Tokyo", value: "94" },
            { title: "BBC One", value: "332" },
            { title: "BBC Two", value: "295" },
            { title: "NBC", value: "6" },
            { title: "AMC+", value: "174" },
            { title: "We TV", value: "3732" },
            { title: "Viu TV", value: "2146" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming"],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "犯罪", value: "80" },
            { title: "动画", value: "16" },
            { title: "喜剧", value: "35" },
            { title: "剧情", value: "18" },
            { title: "家庭", value: "10751" },
            { title: "悬疑", value: "9648" },
            { title: "真人秀", value: "10764" },
            { title: "脱口秀", value: "10767" },
            { title: "纪录片", value: "99" },
            { title: "动作与冒险", value: "10759" },
            { title: "科幻与奇幻", value: "10765" },
            { title: "战争与政治", value: "10768" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "first_air_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "first_air_date.desc" },
            { title: "上映时间↑", value: "first_air_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },
    // --- 出品公司模块 ---
    {
      title: "TMDB 出品公司",
      functionName: "tmdbCompanies",
      cacheDuration: 3600,
      params: [
        {
          name: "with_companies",
          title: "出品公司",
          type: "enumeration",
          value: "",
          description: "选择一个公司以查看其剧集内容",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "Disney", value: "2" },
            { title: "Warner Bros", value: "174" },
            { title: "Columbia", value: "5" },
            { title: "Sony", value: "34" },
            { title: "Universal", value: "33" },
            { title: "Paramount", value: "4" },
            { title: "20th Century", value: "25" },
            { title: "Marvel", value: "420" },
            { title: "Toho", value: "882" },
            { title: "中国电影集团公司", value: "14714" },
            { title: "BBC", value: "3324" },
            { title: "A24", value: "41077" },
            { title: "Blumhouse", value: "3172" },
            { title: "Working Title Films", value: "10163" }
          ]
        },
        {
          name: "with_genres",
          title: "🎭内容类型",
          type: "enumeration",
          description: "选择要筛选的内容类型",
          value: "",
          belongTo: {
            paramName: "air_status",
            value: ["released","upcoming"],
          },
          enumOptions: [
            { title: "全部类型", value: "" },
            { title: "冒险", value: "12" },
            { title: "剧情", value: "18" },
            { title: "动作", value: "28" },
            { title: "动画", value: "16" },
            { title: "历史", value: "36" },
            { title: "喜剧", value: "35" },
            { title: "奇幻", value: "14" },
            { title: "家庭", value: "10751" },
            { title: "恐怖", value: "27" },
            { title: "悬疑", value: "9648" },
            { title: "惊悚", value: "53" },
            { title: "战争", value: "10752" },
            { title: "爱情", value: "10749" },
            { title: "犯罪", value: "80" },
            { title: "科幻", value: "878" },
            { title: "记录", value: "99" },
            { title: "西部", value: "37" },
            { title: "音乐", value: "10402" },
            { title: "电视电影", value: "10770" }
          ]
        },
        {
          name: "air_status",
          title: "上映状态",
          type: "enumeration",
          description: "默认已上映",
          value: "released",
          enumOptions: [
            { title: "已上映", value: "released" },
            { title: "未上映", value: "upcoming" }
          ]
        },
        {
          name: "sort_by",
          title: "🔢 排序方式",
          type: "enumeration",
          description: "选择内容排序方式,默认上映时间↓",
          value: "primary_release_date.desc",
          enumOptions: [
            { title: "上映时间↓", value: "primary_release_date.desc" },
            { title: "上映时间↑", value: "primary_release_date.asc" },
            { title: "人气最高", value: "popularity.desc" },
            { title: "评分最高", value: "vote_average.desc" },
            { title: "最多投票", value: "vote_count.desc" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "language", title: "语言", type: "language", value: "zh-CN" }
      ]
    },

    // -------------豆瓣模块-------------
    // --- 实时热点 ---
    {
      title: "豆瓣电影实时热榜",
      description: "来自豆瓣的当前热门电影榜单",
      requiresWebView: false,
      functionName: "loadDoubanItemsFromApi",
      cacheDuration: 3600,
      params: [
        { name: "url", 
          title: "🔗 列表地址", 
          type: "constant", 
          value: "https://m.douban.com/rexxar/api/v2/subject_collection/movie_real_time_hotest/items" },
        { name: "type", 
          title: "🎭 类型", 
          type: "constant", 
          value: "movie" },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
      ]
    },
    {
      title: "豆瓣剧集实时热榜",
      description: "来自豆瓣的当前热门剧集榜单",
      requiresWebView: false,
      functionName: "loadDoubanItemsFromApi",
      cacheDuration: 3600,
      params: [
        { name: "url", 
          title: "🔗 列表地址", 
          type: "constant", 
          value: "https://m.douban.com/rexxar/api/v2/subject_collection/tv_real_time_hotest/items" },
        { name: "type", 
          title: "🎭 类型", 
          type: "constant", 
          value: "tv" },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
      ]
    },

    // --- 精选榜单 ---
    {
      title: "豆瓣 Top 250 电影",
      description: "豆瓣评分最高的 250 部电影",
      requiresWebView: false,
      functionName: "loadDoubanCardItems",
      cacheDuration: 3600,
      params: [
        { name: "url", 
          title: "🔗 列表地址", 
          type: "constant", 
          value: "https://m.douban.com/subject_collection/movie_top250" },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
      ]
    },
    {
      title: "豆瓣自定义片单",
      description: "加载豆瓣官方榜单或用户豆列 (需输入 URL)",
      requiresWebView: false,
      functionName: "loadDoubanCardItems",
      cacheDuration: 3600,
      params: [
        {
          name: "url", 
          title: "🔗 列表地址", 
          type: "input", 
          description: "输入豆瓣片单或榜单地址 (subject_collection 或 doulist)",
          placeholders: [
            { title: "一周电影口碑榜", 
              value: "https://m.douban.com/subject_collection/movie_weekly_best" },
            { title: "一周华语口碑剧集榜", 
              value: "https://m.douban.com/subject_collection/tv_chinese_best_weekly" },
            { title: "一周全球口碑剧集榜", 
              value: "https://m.douban.com/subject_collection/tv_global_best_weekly" },
            { title: "第97届奥斯卡 (2025)", 
              value: "https://m.douban.com/subject_collection/EC7I7ZDRA?type=rank" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
      ]
    },

    // --- 探索发现 ---
    {
      title: "豆瓣电影推荐",
      description: "按分类、地区、类型标签浏览豆瓣推荐电影",
      requiresWebView: false,
      functionName: "loadDoubanRecommendMovies",
      cacheDuration: 3600,
      params: [
        {
          name: "category", 
          title: "🏷️ 分类", 
          type: "enumeration",
          enumOptions: [ 
            { title: "全部", value: "全部" }, 
            { title: "热门电影", value: "热门" }, 
            { title: "最新电影", value: "最新" }, 
            { title: "豆瓣高分", value: "豆瓣高分" }, 
            { title: "冷门佳片", value: "冷门佳片" } 
          ],
        },
        {
          name: "type", 
          title: "🌍 地区", 
          type: "enumeration",
          value: "全部",
          belongTo: {
            paramName: "category",
            value: ["热门","最新","豆瓣高分","冷门佳片"],
          },
          enumOptions: [ 
            { title: "全部", value: "全部" }, 
            { title: "华语", value: "华语" }, 
            { title: "欧美", value: "欧美" }, 
            { title: "韩国", value: "韩国" }, 
            { title: "日本", value: "日本" } 
          ],
        },
        {
          name: "tags", 
          title: "🎭 类型", 
          type: "enumeration",
          value: "",
          belongTo: {
            paramName: "category",
            value: ["全部"],
          },
          enumOptions: [
            { title: "全部", value: "" },
            { title: "动作", value: "动作" },
            { title: "科幻", value: "科幻" },
            { title: "灾难", value: "灾难" },
            { title: "爱情", value: "爱情" },
            { title: "喜剧", value: "喜剧" },
            { title: "悬疑", value: "悬疑" },
            { title: "犯罪", value: "犯罪" },
            { title: "冒险", value: "冒险" },
            { title: "奇幻", value: "奇幻" },
            { title: "战争", value: "战争" },
            { title: "历史", value: "历史" },
            { title: "武侠", value: "武侠" },
            { title: "惊悚", value: "惊悚" },
            { title: "恐怖", value: "恐怖" },
            { title: "情色", value: "情色" },
            { title: "动画", value: "动画" },
            { title: "剧情", value: "剧情" },
            { title: "西部", value: "西部" },
            { title: "家庭", value: "家庭" },
            { title: "音乐", value: "音乐" },
            { title: "运动", value: "运动" },
            { title: "古装", value: "古装" },
            { title: "歌舞", value: "歌舞" },
            { title: "传记", value: "传记" },
            { title: "短片", value: "短片" },
            { title: "纪录片", value: "纪录片" }
          ]
        },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
      ]
    },
    {
      title: "豆瓣剧集推荐",
      description: "按分类、类型浏览豆瓣推荐剧集",
      requiresWebView: false,
      functionName: "loadDoubanRecommendShows",
      cacheDuration: 3600,
      params: [
        {
          name: "type", 
          title: "🎭 类型", 
          type: "enumeration",
          enumOptions: [
            { title: "综合", value: "tv" }, 
            { title: "国产剧", value: "tv_domestic" }, 
            { title: "欧美剧", value: "tv_american" }, 
            { title: "日剧", value: "tv_japanese" }, 
            { title: "韩剧", value: "tv_korean" }, 
            { title: "动画", value: "tv_animation" }, 
            { title: "纪录片", value: "tv_documentary" } 
          ],
          value: "tv"
        },
        { name: "page", title: "页码", type: "page" },
        { name: "limit", title: "🔢 每页数量", type: "constant", value: "20" }
      ]
    }
  ]
};

// ===============辅助函数===============
let tmdbGenresCache = null;

async function fetchTmdbGenres() {
    if (tmdbGenresCache) return tmdbGenresCache;
    try {
        const [movieGenres, tvGenres] = await Promise.all([
            Widget.tmdb.get('/genre/movie/list', { params: { language: 'zh-CN' } }),
            Widget.tmdb.get('/genre/tv/list', { params: { language: 'zh-CN' } })
        ]);
        
        tmdbGenresCache = {
            movie: movieGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {}),
            tv: tvGenres.genres.reduce((acc, g) => ({ ...acc, [g.id]: g.name }), {})
        };
        return tmdbGenresCache;
    } catch (error) {
        console.error("获取TMDB类型映射失败:", error);
        return { movie: {}, tv: {} };
    }
}

function getTmdbGenreTitles(genreIds, mediaType) {
    const genres = tmdbGenresCache?.[mediaType] || {};
    const topThreeIds = genreIds.slice(0, 3); 
    return topThreeIds
        .map(id => genres[id]?.trim() || `未知类型(${id})`)
        .filter(Boolean)
        .join('•');
}

function getDoubanGenreTitles(genres) {
    if (!genres || genres.length === 0) return "未分类";
    const topThreeGenres = genres.slice(0, 1); 
    return topThreeGenres.join('•');
}


function formatItemDescription(item) {
    let description = item.description || '';
    const hasRating = /评分|rating/i.test(description);
    const hasYear = /年份|year/i.test(description);
    
    if (item.rating && !hasRating) {
        description = `评分: ${item.rating} | ${description}`;
    }
    
    if (item.releaseDate && !hasYear) {
        const year = String(item.releaseDate).substring(0,4);
        if (/^\d{4}$/.test(year)) {
            description = `年份: ${year} | ${description}`;
        }
    }
    
    return description
        .replace(/^\|\s*/, '')
        .replace(/\s*\|$/, '')
        .trim();
}


function createErrorItem(id, title, error) {
    const errorMessage = String(error?.message || error || '未知错误');
    const uniqueId = `error-${id.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;
    return {
        id: uniqueId,
        type: "error",
        title: title || "加载失败",
        description: `错误详情：${errorMessage}`
    };
}


function calculatePagination(params) {
    let page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 20;
    
    if (typeof params.start !== 'undefined') {
        page = Math.floor(parseInt(params.start) / limit) + 1;
    }
    
    if (page < 1) page = 1;
    if (limit > 50) throw new Error("单页数量不能超过50");

    const start = (page - 1) * limit;
    return { page, limit, start };
}


function getBeijingDate() {
    const now = new Date();
    const beijingTime = now.getTime() + (8 * 60 * 60 * 1000);
    const beijingDate = new Date(beijingTime);
    return `${beijingDate.getUTCFullYear()}-${String(beijingDate.getUTCMonth() + 1).padStart(2, '0')}-${String(beijingDate.getUTCDate()).padStart(2, '0')}`;
}

// ================TMDB功能函数===============
async function fetchTmdbData(api, params) {
    try {
        const [data, genres] = await Promise.all([
            Widget.tmdb.get(api, { params: params }),
            fetchTmdbGenres()
        ]);

        if (!data?.results) {
            throw new Error("获取数据失败");
        }

        return data.results
            .filter(item => {
                const hasPoster = item.poster_path;
                const hasTitle = item.title || item.name;
                const hasValidId = Number.isInteger(item.id);
                return hasPoster && hasTitle && hasValidId;
            })
            .map((item) => {
                const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
                const genreIds = item.genre_ids || [];
                const genreTitle = getTmdbGenreTitles(genreIds, mediaType);

                return {
                    id: item.id,
                    type: "tmdb",
                    title: item.title || item.name,
                    description: item.overview,
                    releaseDate: item.release_date || item.first_air_date,
                    backdropPath: item.backdrop_path,
                    posterPath: item.poster_path,
                    rating: item.vote_average,
                    mediaType: mediaType,
                    genreTitle: genreTitle
                };
            });
    } catch (error) {
        console.error("调用 TMDB API 失败:", error);
        return [createErrorItem("tmdb-api", "API调用失败", error)];
    }
}

async function loadTmdbTrendingData() {
    const response = await Widget.http.get("https://raw.githubusercontent.com/quantumultxx/ForwardWidgets/refs/heads/main/data/TMDB_Trending.json");
    return response.data;
}

async function loadTodayGlobalMedia() {
    const data = await loadTmdbTrendingData();
    return data.today_global.map(item => ({
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        genreTitle: item.genreTitle,
        rating: item.rating,
        description: item.overview,
        releaseDate: item.release_date,
        posterPath: item.poster_url,
        backdropPath: item.title_backdrop,
        mediaType: item.type,
    }));
}

async function loadWeekGlobalMovies(params) {
    const data = await loadTmdbTrendingData();
    return data.week_global_all.map(item => ({
        id: item.id.toString(),
        type: "tmdb",
        title: item.title,
        genreTitle: item.genreTitle,
        rating: item.rating,
        description: item.overview,
        releaseDate: item.release_date,
        posterPath: item.poster_url,
        backdropPath: item.title_backdrop,
        mediaType: item.type,
    }));
}


async function tmdbNowPlaying(params) {
    const type = params.type || 'movie';
    const api = type === 'movie' ? "movie/now_playing" : "tv/on_the_air";
    return await fetchTmdbData(api, params);
}


async function tmdbTopRated(params) {
    const type = params.type || 'movie';
    const api = type === 'movie' ? `movie/top_rated` : `tv/top_rated`;
    return await fetchTmdbData(api, params);
}


async function tmdbDiscoverByNetwork(params = {}) {
    const api = "discover/tv";
    const beijingDate = getBeijingDate();
    const discoverParams = {
        language: params.language || 'zh-CN',
        page: params.page || 1,
        with_networks: params.with_networks,
        sort_by: params.sort_by || "first_air_date.desc",
    };
    
    if (params.air_status === 'released') {
        discoverParams['first_air_date.lte'] = beijingDate;
    } else if (params.air_status === 'upcoming') {
        discoverParams['first_air_date.gte'] = beijingDate;
    }
    
    if (params.with_genres) {
        discoverParams.with_genres = params.with_genres;
    }
    
    return await fetchTmdbData(api, discoverParams);
}


async function tmdbCompanies(params = {}) {
    try {
        const api = "discover/movie";
        const beijingDate = getBeijingDate();
        const withCompanies = String(params.with_companies || '').trim();

        const cleanParams = {
            page: params.page || 1,
            language: params.language || "zh-CN",
            sort_by: params.sort_by || "primary_release_date.desc",
            include_adult: false,
            include_video: false
        };

        if (withCompanies) {
            cleanParams.with_companies = withCompanies;
        }

        if (params.air_status === 'released') {
            cleanParams['primary_release_date.lte'] = beijingDate;
        } else if (params.air_status === 'upcoming') {
            cleanParams['primary_release_date.gte'] = beijingDate;
        }

        if (params.with_genres) {
            cleanParams.with_genres = String(params.with_genres).trim();
        }

        return await fetchTmdbData(api, cleanParams);
    } catch (error) {
        console.error('公司数据加载失败:', error);
        return [createErrorItem('companies', '数据加载失败', error)];
    }
}

// ===============豆瓣功能函数===============
async function loadDoubanCardItems(params = {}) {
  try {
    const url = params.url;
    if (!url) throw new Error("缺少片单 URL");
    if (url.includes("douban.com/doulist/")) {
      return loadDoubanDefaultList(params);
    } else if (url.includes("douban.com/subject_collection/")) {
      return loadDoubanSubjectCollection(params);
    } else {
        throw new Error("不支持的豆瓣 URL 格式");
    }
  } catch (error) {
    console.error("解析豆瓣片单失败:", error);
    throw error;
  }
}


async function loadDoubanDefaultList(params = {}) {
  const { start, limit } = calculatePagination(params);
  const url = params.url;
  const listId = url.match(/doulist\/(\d+)/)?.[1];
  if (!listId) throw new Error("无法从 URL 获取豆瓣豆列 ID");
  const pageUrl = `https://www.douban.com/doulist/${listId}/?start=${start}&sort=&playable=&sub_type=`;
  const response = await Widget.http.get(pageUrl, {
    headers: {
      Referer: `https://www.douban.com/`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  });
  if (!response || !response.data) throw new Error("获取豆瓣豆列数据失败");
  const docId = Widget.dom.parse(response.data);
  if (docId < 0) throw new Error("解析豆瓣豆列 HTML 失败");
  const itemElements = Widget.dom.select(docId, "div.doulist-item");
  let fallbackItemElements = [];
  if (!itemElements || itemElements.length === 0) {
       const articleElement = Widget.dom.selectFirst(docId, ".article");
       if (articleElement >= 0) {
            fallbackItemElements = Widget.dom.select(articleElement, ".doulist-subject");
            if (!fallbackItemElements || fallbackItemElements.length === 0) {
                 fallbackItemElements = Widget.dom.select(articleElement, "li.subject-item");
            }
       }
  }
  const finalItemElements = (itemElements && itemElements.length > 0) ? itemElements : fallbackItemElements;
  if (!finalItemElements || finalItemElements.length === 0) {
      const paging = Widget.dom.selectFirst(docId, ".paginator .next a");
      if (paging < 0) {
          return [];
      } else {
           return [];
      }
  }
  let doubanIds = [];
  for (const itemId of finalItemElements) {
       let titleElementId = Widget.dom.selectFirst(itemId, ".title a");
       if (titleElementId < 0) {
           titleElementId = Widget.dom.selectFirst(itemId, ".item-title a");
       }
       if (titleElementId < 0) {
           titleElementId = Widget.dom.selectFirst(itemId, "a[onclick*='subject']");
       }
      if (titleElementId >= 0) {
          const link = await Widget.dom.attr(titleElementId, "href");
          const idMatch = link ? link.match(/subject\/(\d+)/) : null;
          const title = await Widget.dom.text(titleElementId);
          if (idMatch && idMatch[1]) {
              let coverUrl = "";
              let imgElementId = Widget.dom.selectFirst(itemId, ".post img");
              if (imgElementId < 0) {
                 imgElementId = Widget.dom.selectFirst(itemId, ".item-poster img");
              }
              if (imgElementId >= 0) {
                  coverUrl = await Widget.dom.attr(imgElementId, "src");
                   if (coverUrl) {
                       coverUrl = coverUrl.replace(/\/(s|m|sq)\//, '/l/');
                   }
              }
              let description = "";
              let abstractElementId = Widget.dom.selectFirst(itemId, ".abstract");
              if (abstractElementId < 0) {
                  abstractElementId = Widget.dom.selectFirst(itemId, ".card-abstract");
              }
               if (abstractElementId >= 0) {
                   description = await Widget.dom.text(abstractElementId);
                   description = description.trim().replace(/\n\s*/g, ' ');
               }
              let rating = undefined;
              let ratingElementId = Widget.dom.selectFirst(itemId, ".rating .rating_nums");
              if (ratingElementId < 0) {
                  ratingElementId = Widget.dom.selectFirst(itemId, ".item-rating .rating_nums");
              }
              if (ratingElementId >= 0) {
                  rating = await Widget.dom.text(ratingElementId);
                  rating = rating.trim();
              }
              const genres = await Widget.dom.attr(titleElementId, "data-genres");
              doubanIds.push({
                  id: idMatch[1],
                  type: "douban",
                  title: title ? title.trim() : "未知标题",
                  coverUrl: coverUrl || undefined,
                  description: formatItemDescription({
                      description: description || undefined,
                      rating: rating,
                      releaseDate: item.releaseDate
                  }),
                  rating: rating ? parseFloat(rating) : undefined,
                  genreTitle: getDoubanGenreTitles(genres?.split(',') || [])
                });
          } else {
             console.warn("解析豆列项时未找到 subject ID, Title:", title, "Link:", link);
          }
      } else {
         console.warn("在豆列项中未找到标题链接元素, Item ID:", itemId);
      }
  }
  return doubanIds;
}


async function loadDoubanSubjectCollection(params = {}) {
  const listIdMatch = params.url.match(/subject_collection\/(\w+)/);
  if (!listIdMatch) throw new Error("无法从 URL 获取豆瓣合集 ID");
  const listId = listIdMatch[1];
  const { start, limit } = calculatePagination(params);
  const apiUrl = `https://m.douban.com/rexxar/api/v2/subject_collection/${listId}/items`;
  return await loadDoubanItemsFromApi({
      ...params,
      url: apiUrl,
  });
}


async function loadDoubanItemsFromApi(params = {}) {
  const { start, limit } = calculatePagination(params);
  const url = params.url;
  const apiUrl = `${url}?start=${start}&count=${limit}&updated_at&items_only=1&for_mobile=1`;
  const listIdMatch = params.url.match(/subject_collection\/(\w+)/);
  const referer = listIdMatch ? `https://m.douban.com/subject_collection/${listIdMatch[1]}/` : 'https://m.douban.com/';
  const response = await Widget.http.get(apiUrl, {
    headers: {
      Referer: referer,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    },
  });
  if (response.data && response.data.subject_collection_items) {
    const items = response.data.subject_collection_items;
    const doubanIds = items.map((item) => ({
      id: item.id,
      type: "douban",
      title: item.title,
      coverUrl: item.cover?.url,
      description: formatItemDescription({
          description: item.card_subtitle || item.description,
          rating: item.rating?.value,
          releaseDate: item.year
      }),
      rating: item.rating?.value,
      releaseDate: item.year,
      genreTitle: getDoubanGenreTitles(item.genres || [])
    }));
    return doubanIds;
  }
  return [];
}


async function loadDoubanRecommendMovies(params = {}) {
  return await loadDoubanRecommendItems(params, "movie");
}


async function loadDoubanRecommendShows(params = {}) {
  return await loadDoubanRecommendItems(params, "tv");
}


async function loadDoubanRecommendItems(params = {}, mediaType = "movie") {
  const { start, limit } = calculatePagination(params);
  const category = params.category || "";
  const subType = params.type || "";
  const tags = params.tags || "";
  const encodedTags = encodeURIComponent(tags);
  
  let url;
  if (category === "全部" || category === "all") {
    url = `https://m.douban.com/rexxar/api/v2/${mediaType}/recommend?refresh=0&start=${start}&count=${limit}&selected_categories=${encodeURIComponent(JSON.stringify(params.selected_categories || {}))}&uncollect=false&score_range=0,10`;
    if (encodedTags) url += `&tags=${encodedTags}`;
  } else {
    url = `https://m.douban.com/rexxar/api/v2/subject/recent_hot/${mediaType}?start=${start}&count=${limit}&category=${encodeURIComponent(category)}&type=${encodeURIComponent(subType)}`;
  }

  const response = await Widget.http.get(url, {
    headers: {
      Referer: `https://movie.douban.com/explore`,
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    },
  });

  const items = response.data?.subjects || response.data?.items || [];
  return items.map((item) => {
    const rating = item.rating?.value || (item.rate ? parseFloat(item.rate) : undefined);
    const releaseYear = item.year || item.release_date?.substring(0, 4);
    const cover = item.cover?.url || item.pic?.normal;
    
    const dynamicDesc = item.card_subtitle || item.description || "";

    return {
      id: String(item.id),
      type: "douban",
      title: item.title,
      coverUrl: cover,
      description: formatItemDescription({
        description: dynamicDesc,
        rating: rating,
        releaseDate: releaseYear ? `${releaseYear}-01-01` : undefined
      }),
      rating: rating,
      releaseDate: releaseYear ? `${releaseYear}-01-01` : undefined,
      genreTitle: getDoubanGenreTitles(item.genres || [])
    };
  });
}
