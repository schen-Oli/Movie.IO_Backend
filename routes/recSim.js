const express = require('express');
const router = express.Router();
const axios = require('axios');
const PARAMETERS = require('./constParams');

TMDB = PARAMETERS.TMDB;
API_KEY = PARAMETERS.API_KEY;
LANGUAGE_CN = PARAMETERS.LANGUAGE_CN;
LANGUAGE_EN = PARAMETERS.LANGUAGE_EN;
IMAGE_HIGH_RES = PARAMETERS.IMAGE_HIGH_RES;
IMAGE_LOW_RES = PARAMETERS.IMAGE_LOW_RES;
FIRST_PAGE = PARAMETERS.PAGE + "1";
BACKDROP_PLACEHOLDER = PARAMETERS.BACKDROP_PLACEHOLDER;
MEDIA_INFO_PLACEHOLDER = PARAMETERS.MEDIA_INFO_PLACEHOLDER;
REGION = PARAMETERS.DEFAULT_REGION;

router.get('/:operation/:type/:id/:language', function(req, res) {

    let language = req.params.language == 'en' ? LANGUAGE_EN : LANGUAGE_CN;
    let operation = req.params.operation == "rec" ? "recommendations" : "similar";
    let type = req.params.type;
    let id = req.params.id;

    let url = TMDB + type + "/" + id + "/" + operation + API_KEY + language + FIRST_PAGE;

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