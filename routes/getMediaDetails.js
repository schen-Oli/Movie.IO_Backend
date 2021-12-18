const express = require('express');
const router = express.Router();
const axios = require('axios');
const P = require('./constParams');

TMDB = P.TMDB;
API_KEY = P.API_KEY;
LANGUAGE = P.LANGUAGE;
PAGE = P.PAGE;
BACKDROP_PLACEHOLDER = P.BACKDROP_PLACEHOLDER;
REGION = P.DEFAULT_REGION;
IMAGE_HIGH_RES = P.IMAGE_HIGH_RES;
IMAGE_LOW_RES = P.IMAGE_LOW_RES;

function getGenres(genres) {
    if (genres.length == 0) {
        return null;
    }
    var gen = "";
    for (var i = 0; i < genres.length; i++) {
        var tmpGenre = genres[i].name;
        gen = gen + tmpGenre + ", ";
    }
    var ret = gen.substring(0, gen.length - 2);
    return ret;
}

function getLang(langs) {
    if (langs.length == 0) {
        return null
    }
    var lang = "";
    for (var i = 0; i < langs.length; i++) {
        var tmpLan = langs[i].english_name;
        lang = lang + tmpLan + ", ";
    }
    var ret = lang.substring(0, lang.length - 2);
    return ret;
}

function getRuntime(totTime) {
    if (totTime == 0) {
        return null;
    }
    var hour = Math.floor(totTime / 60);
    var min = totTime % 60;
    if (hour == 0) {
        var time = min + "mins";
    } else {
        var time = hour + "hrs " + min + "mins";
    }
    return time;
}

function getYear(date) {
    if (date == "" || !date) {
        return null;
    }
    return date.substring(0, 4);
}

function getExternalIDs(data) {
    var ret = {
        cnt: 0,
        ids: {}
    }
    if (data.imdb_id) {
        ret.cnt += 1;
        ret.ids.imdb = data.imdb_id
    }
    if (data.facebook_id) {
        ret.cnt += 1;
        ret.ids.facebook = data.facebook_id
    }
    if (data.instagram_id) {
        ret.cnt += 1;
        ret.ids.instagram = data.instagram_id
    }
    if (data.twitter_id) {
        ret.cnt += 1;
        ret.ids.twitter = data.twitter_id
    }
    return ret;
}

router.get('/:type/:id/:language', function(req, res) {

    LANG = LANGUAGE + req.params.language == 'zh' ? 'zh' : 'en-US';
    let isMovie = req.params.type == 'movie' ? true : false;
    let id = req.params.id

    var type, typeURL;

    if (isMovie) {
        type = "movie";
        typeURL = "movie/"
    } else {
        type = "tv";
        typeURL = "tv/"
    }

    let generalDetailURL = axios.get(TMDB + typeURL + id + API_KEY + LANG);
    let socialMediaURL = axios.get(TMDB + type + "/" + id + "/external_ids" + API_KEY);
    let youtubeURL = axios.get(TMDB + type + "/" + id + "/videos" + API_KEY + LANGUAGE + 'en-US');
    let keyWordsURL = axios.get(TMDB + type + "/" + id + "/keywords" + API_KEY);
    let providersURL = axios.get(TMDB + type + "/" + id + "/watch/providers" + API_KEY)

    axios.all([generalDetailURL, socialMediaURL, youtubeURL, keyWordsURL, providersURL]).then(axios.spread(function(res1, res2, res3, res4, res5) {
        var ret = {};
        ret.type = type;
        ret.id = id;

        getGeneralDetail(ret, res1.data, isMovie);
        ret.external_ids = getExternalIDs(res2.data);
        getYoutubeKeys(ret, res3.data);
        ret.keywords = getKeywords(res4.data.keywords);
        getProviders(ret, res5.data.results.US);

        res.json(ret);
    })).catch(err => {
        console.log(err)
    });
})

function getGeneralDetail(ret, result, isMovie) {
    if (isMovie) {
        ret.title = result.title;
        ret.date = getYear(result.release_date);
        ret.runtime = getRuntime(result.runtime);
    } else {
        ret.title = result.name;
        ret.date = getYear(result.first_air_date);
        ret.runtime = getRuntime(result.episode_runtime);
    }
    ret.genres = getGenres(result.genres);
    ret.lang = getLang(result.spoken_languages);
    ret.overview = result.overview;
    ret.vote = result.vote_average / 2;
    ret.tagline = result.tagline;
    if (result.backdrop_path) {
        ret.backdrop_highRes = IMAGE_HIGH_RES + result.backdrop_path;
        ret.backdrop_lowRes = IMAGE_LOW_RES + result.backdrop_path;
    } else {
        ret.backdrop_highRes = null;
        ret.backdrop_lowRes = null;
    }
    if (result.poster_path) {
        ret.poster_highRes = IMAGE_HIGH_RES + result.poster_path;
        ret.poster_lowRes = IMAGE_LOW_RES + result.poster_path;
    } else {
        ret.poster_highRes = null;
        ret.poster_lowRes = null;
    }
}

function getYoutubeKeys(ret, data) {
    var res = data.results;
    if (res.length == 0) {
        console.log("No youtube video provided")
        ret.youtube = null;
    } else {
        dic = {
            Teaser: [],
            Clip: [],
            Other: []
        }
        for (var i = 0; i < res.length; i++) {
            tmpRes = res[i];
            if (tmpRes.site == "YouTube") {
                if (tmpRes.type == "Trailer") {
                    ret.youtube = tmpRes.key;
                    break;
                } else if (tmpRes.type == "Teaser") {
                    dic.Teaser.push(tmpRes.key);
                } else if (tmpRes.type == "Clip") {
                    dic.Clip.push(tmpRes.key)
                } else {
                    dic.Other.push(tmpRes.key);
                }
            }
        }
        if (!ret.youtube) {
            if (dic.Teaser.length != 0) {
                ret.youtube = dic.Teaser[0].key;
            } else if (dic.Clip.length != 0) {
                ret.youtube = dic.Clip[0].key;
            } else if (dic.Other.length != 0) {
                ret.youtube = dic.Other[0].key;
            } else {
                ret.youtube = null;
            }
        }
    }
}

function getProviders(ret, data) {
    var dic = {};
    if (data) {
        dic.link = data.link;
        var arr = [];
        if (data.buy) {
            arr = arr.concat(data.buy);
        }
        if (data.flatrate) {
            arr = arr.concat(data.flatrate);
        }
        if (data.rent) {
            arr = arr.concat(data.rent);
        }
        var retArr = [];
        for (var item of arr) {
            if (!checkSameProvider(retArr, item)) {
                item.logo_path = IMAGE_HIGH_RES + item.logo_path;
                retArr.push(item);
            }
        }
        dic.providers = retArr;
        dic.cnt = retArr.length;
        ret.providers = dic;
    } else {
        ret.providers = null;
    }

}

function checkSameProvider(arr, provider) {
    for (item of arr) {
        if (item.provider_id == provider.provider_id) {
            return true;
        }
    }
    return false;
}

function getKeywords(keywords) {
    var ret = [];
    if (keywords) {
        var cnt = keywords.length >= 8 ? 8 : keywords.length;
        for (var i = 0; i < cnt; i++) {
            ret.push(keywords[i]);
        }
        return ret;
    }
    return ret;
}

module.exports = router;