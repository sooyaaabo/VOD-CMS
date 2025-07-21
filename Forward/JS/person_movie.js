// 引用链接: https://raw.githubusercontent.com/EmrysChoo/ForwardWidgets/main/Widgets/person_movie.js
WidgetMetadata = {
  id: "person.movie.tmdb",
  title: "TMDB人物影视作品",
  version: "1.0.4",
  requiredVersion: "0.0.1",
  description: "获取 TMDB 个人相关作品数据（Forward 5折优惠码 LUCKY.5)",
  author: "Evan",
  site: "https://github.com/EmrysChoo/ForwardWidgets",
  cacheDuration: 172800,
  modules: [
    {
      id: "allWorks",
      title: "全部作品",
      functionName: "getAllWorks",
      cacheDuration: 172800,
      params: [
        {
          name: "personId",
          title: "个人ID",
          type: "input",
          description: "在 TMDB 网站获取的数字 ID",
          placeholders: [
            { title: "张艺谋", value: "607" },
            { title: "李安", value: "1614" },
            { title: "周星驰", value: "57607" },
            { title: "成龙", value: "18897" },
            { title: "吴京", value: "78871" },
            { title: "王家卫", value: "12453" },
            { title: "姜文", value: "77301" },
            { title: "贾樟柯", value: "24011" },
            { title: "陈凯歌", value: "20640" },
            { title: "徐峥", value: "118711" },
            { title: "宁浩", value: "17295" },
            { title: "黄渤", value: "128026" },
            { title: "葛优", value: "76913" },
            { title: "胡歌", value: "1106514" },
            { title: "张译", value: "3963465" },
            { title: "沈腾", value: "1519026" },
            { title: "王宝强", value: "71051" },
            { title: "赵丽颖", value: "1260868" },
            { title: "孙俪", value: "52898" },
            { title: "张若昀", value: "1675905" },
            { title: "秦昊", value: "1016315" },
            { title: "易烊千玺", value: "2223265" },
            { title: "王倦", value: "2467977" },
            { title: "孔笙", value: "1494556" },
            { title: "张国立", value: "543178" },
            { title: "陈思诚", value: "1065761" },
            { title: "徐克", value: "26760" },
            { title: "林超贤", value: "81220" },
            { title: "郭帆", value: "1100748" },
            { title: "史蒂文·斯皮尔伯格", value: "488" },
            { title: "詹姆斯·卡梅隆", value: "2710" },
            { title: "克里斯托弗·诺兰", value: "525" },
            { title: "阿尔弗雷德·希区柯克", value: "2636" },
            { title: "斯坦利·库布里克", value: "240" },
            { title: "黑泽明", value: "5026" },
            { title: "莱昂纳多·迪卡普里奥", value: "6193" },
            { title: "阿米尔·汗", value: "52763" },
            { title: "宫崎骏", value: "608" },
            { title: "蒂姆·伯顿", value: "510" },
            { title: "杨紫琼", value: "1620" },
            { title: "凯特·布兰切特", value: "112" },
            { title: "丹尼尔·戴·刘易斯", value: "11856" },
            { title: "宋康昊", value: "20738" }
          ]
        },
        { name: "language", title: "语言", type: "language", value: "zh-CN" },
        {
          name: "type",
          title: "类型",
          type: "enumeration",
          enumOptions: [
            { title: "全部", value: "all" },
            { title: "电影", value: "movie" },
            { title: "电视剧", value: "tv" }
          ],
          value: "all"
        },
        {
          name: "sort_by",
          title: "排序方式",
          type: "enumeration",
          enumOptions: [
            { title: "发行日期降序", value: "release_date.desc" },
            { title: "评分降序", value: "vote_average.desc" },
            { title: "热门降序", value: "popularity.desc" }
          ],
          value: "popularity.desc"
        }
      ]
    },
    {
      id: "actorWorks",
      title: "演员作品",
      functionName: "getActorWorks",
      cacheDuration: 172800,
      params: []
    },
    {
      id: "directorWorks",
      title: "导演作品",
      functionName: "getDirectorWorks",
      cacheDuration: 172800,
      params: []
    },
    {
      id: "otherWorks",
      title: "其他作品",
      functionName: "getOtherWorks",
      cacheDuration: 172800,
      params: []
    }
  ]
};

// 复用 allWorks 参数到其他模块
["actorWorks", "directorWorks", "otherWorks"].forEach(id => {
  var module = WidgetMetadata.modules.find(m => m.id === id);
  module.params = JSON.parse(JSON.stringify(WidgetMetadata.modules[0].params));
});

// 基础获取TMDB人员作品方法,使用 combined_credits 接口
async function fetchCredits(personId, language) {
  var api = `person/${personId}/combined_credits`;
  var response = await Widget.tmdb.get(api, { params: { language: language || "zh-CN" } });
  if (!response || (!response.cast && !response.crew)) {
    throw new Error("获取作品数据失败");
  }

  var normalize = function(item) {
    return Object.assign({}, item, {
      mediaType: item.media_type,
      releaseDate: item.release_date || item.first_air_date
    });
  };

  return {
    cast: (response.cast || []).map(normalize),
    crew: (response.crew || []).map(normalize)
  };
}

// 过滤函数：按 mediaType 筛选
function filterByType(items, targetType) {
  return targetType === "all" ? items : items.filter(item => item.mediaType === targetType);
}

// 排序函数：根据 sort_by 参数排序
function applySorting(items, sortBy) {
  var sorted = items.slice();
  switch (sortBy) {
    case "vote_average.desc":
      sorted.sort(function(a, b) {
        return (b.vote_average || 0) - (a.vote_average || 0);
      });
      break;
    case "release_date.desc":
      sorted.sort(function(a, b) {
        return new Date(b.release_date || b.first_air_date) - new Date(a.release_date || a.first_air_date);
      });
      break;
    // popularity.desc 默认顺序已由 TMDB 返回
  }
  return sorted;
}

// 合并去重并格式化输出的通用函数
function formatResults(items) {
  var seen = {};
  var result = [];
  items.forEach(function(item) {
    if (!seen[item.id]) {
      seen[item.id] = true;
      result.push(item);
    }
  });
  return result.map(function(movie) {
    return {
      id: movie.id,
      type: "tmdb",
      title: movie.title || movie.name,
      description: movie.overview,
      releaseDate: movie.releaseDate,
      posterPath: movie.poster_path,
      backdropPath: movie.backdrop_path,
      rating: movie.vote_average,
      mediaType: movie.mediaType
    };
  });
}

// 各模块函数
async function getAllWorks(params) {
  var p = params || {};
  var credits = await fetchCredits(p.personId, p.language);
  var list = credits.cast.concat(credits.crew);
  list = filterByType(list, p.type);
  list = applySorting(list, p.sort_by);
  return formatResults(list);
}
async function getActorWorks(params) {
  var p = params || {};
  var credits = await fetchCredits(p.personId, p.language);
  var list = credits.cast;
  list = filterByType(list, p.type);
  list = applySorting(list, p.sort_by);
  return formatResults(list);
}
async function getDirectorWorks(params) {
  var p = params || {};
  var credits = await fetchCredits(p.personId, p.language);
  var list = credits.crew.filter(function(item) {
    return item.job && item.job.toLowerCase().indexOf("director") !== -1;
  });
  list = filterByType(list, p.type);
  list = applySorting(list, p.sort_by);
  return formatResults(list);
}
async function getOtherWorks(params) {
  var p = params || {};
  var credits = await fetchCredits(p.personId, p.language);
  var list = credits.crew.filter(function(item) {
    var job = item.job && item.job.toLowerCase();
    return job && job.indexOf("director") === -1 && job.indexOf("actor") === -1;
  });
  list = filterByType(list, p.type);
  list = applySorting(list, p.sort_by);
  return formatResults(list);
}
