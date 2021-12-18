const express = require('express');
const router = express.Router();
const axios = require('axios');
const P = require('./constParams');

TMDB = P.TMDB;
API_KEY = P.API_KEY;
LANGUAGE = P.LANGUAGE;
IMAGE_HIGH_RES = P.IMAGE_HIGH_RES;
IMAGE_LOW_RES = P.IMAGE_LOW_RES;
FIRST_PAGE = P.PAGE + "1";
BACKDROP_PLACEHOLDER = P.BACKDROP_PLACEHOLDER;
MEDIA_INFO_PLACEHOLDER = P.MEDIA_INFO_PLACEHOLDER;
REGION = P.DEFAULT_REGION;

router.get('/:operation/:type/:id/:language', function(req, res) {

    LANGUAGE += req.params.language == 'zh' ? 'zh' : 'en-US';
    let operation = req.params.operation == "rec" ? "recommendations" : "similar";
    let type = req.params.type;
    let id = req.params.id;

    let url = TMDB + type + "/" + id + "/" + operation + API_KEY + LANGUAGE + FIRST_PAGE;

    axios.get(url).then(response => {
        let result = response.data.results;
        var ret = [];
        for (var i = 0; i < result.length; i++) {
            var dictionary = {};
            var currentMedia = result[i];
            dictionary.type = type;
            dictionary.id = currentMedia.id;
            dictionary.title = type == "movie/" ? currentMedia.title : currentMedia.name;
            if (currentMedia.backdrop_path) {
                dictionary.backdrop_highRes = IMAGE_HIGH_RES + currentMedia.backdrop_path;
                dictionary.backdrop_lowRes = IMAGE_LOW_RES + currentMedia.backdrop_path;
            } else {
                dictionary.backdrop_highRes = BACKDROP_PLACEHOLDER;
                dictionary.backdrop_lowRes = BACKDROP_PLACEHOLDER;
            }
            if (currentMedia.poster_path) {
                dictionary.poster_highRes = IMAGE_HIGH_RES + currentMedia.poster_path;
                dictionary.poster_lowRes = IMAGE_LOW_RES + currentMedia.poster_path;
            } else {
                dictionary.poster_highRes = BACKDROP_PLACEHOLDER;
                dictionary.poster_lowRes = BACKDROP_PLACEHOLDER;
            }
            ret.push(dictionary);
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

})

module.exports = router;