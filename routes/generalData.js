const express = require('express');
const router = express.Router();
const axios = require('axios');
const P = require('./constParams');

//Constant parameters
TMDB = P.TMDB;
API_KEY = P.API_KEY;
LANGUAGE = P.LANGUAGE;
IMAGE_HIGH_RES = P.IMAGE_HIGH_RES;
IMAGE_LOW_RES = P.IMAGE_LOW_RES;
FIRST_PAGE = P.PAGE + "1";
BACKDROP_PLACEHOLDER = P.BACKDROP_PLACEHOLDER;
MEDIA_INFO_PLACEHOLDER = P.MEDIA_INFO_PLACEHOLDER;
REGION = P.DEFAULT_REGION;

var typeURL, keyword, isMovie, type;

router.get('/:keyword/:type/:language', function(req, res) {

    LANGUAGE += req.params.language == 'zh' ? 'zh' : 'en-US';
    isMovie = req.params.type == 'movie';
    keyword = req.params.keyword;

    if (isMovie) {
        type = 'movie'
        typeURL = 'movie/';
        if (keyword == "trending") { keyword = "now_playing"; }
    } else {
        type = 'tv'
        typeURL = 'tv/';
        if (keyword == "upcoming") { keyword = "on_the_air"; }
        if (keyword == "trending") { keyword = "airing_today" }
    }

    var URL = TMDB + typeURL + keyword + API_KEY + LANGUAGE + FIRST_PAGE + REGION;

    axios.get(URL).then(response => {
        var result = response.data.results;
        var ret = new Array();
        for (var i = 0; i < 20; i++) {
            var dic = {};
            var currentMedia = result[i];
            dic.type = type;
            dic.id = currentMedia.id;
            dic.title = isMovie ? currentMedia.title : currentMedia.name;
            if (currentMedia.backdrop_path) {
                dic.backdrop_highRes = IMAGE_HIGH_RES + currentMedia.backdrop_path;
                dic.backdrop_lowRes = IMAGE_LOW_RES + currentMedia.backdrop_path;
            } else {
                dic.backdrop_highRes = BACKDROP_PLACEHOLDER;
                dic.backdrop_lowRes = BACKDROP_PLACEHOLDER;
            }
            if (currentMedia.poster_path) {
                dic.poster_highRes = IMAGE_HIGH_RES + currentMedia.poster_path;
                dic.poster_lowRes = IMAGE_LOW_RES + currentMedia.poster_path;
            } else {
                dic.poster_highRes = BACKDROP_PLACEHOLDER;
                dic.poster_lowRes = BACKDROP_PLACEHOLDER;
            }
            ret.push(dic);
        }
        res.json(ret);
    }).catch(err => {
        console.log(URL);
        console.log(err);
        var ret = new Array();
        for (var i = 0; i < 20; i++) {
            ret.push(MEDIA_INFO_PLACEHOLDER);
        }
        res.json(ret);
    })
});

module.exports = router;