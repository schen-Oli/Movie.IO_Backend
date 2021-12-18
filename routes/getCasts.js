const express = require('express');
const router = express.Router();
const axios = require('axios');
const PARAMETERS = require('./constParams');

TMDB = PARAMETERS.TMDB;
API_KEY = PARAMETERS.API_KEY;
LANGUAGE_CN = PARAMETERS.LANGUAGE_CN;
LANGUAGE_EN = PARAMETERS.LANGUAGE_EN;
PAGE = PARAMETERS.PAGE;
BACKDROP_PLACEHOLDER = PARAMETERS.BACKDROP_PLACEHOLDER;
REGION = PARAMETERS.DEFAULT_REGION;
IMAGE_HIGH_RES = PARAMETERS.IMAGE_HIGH_RES;
IMAGE_LOW_RES = PARAMETERS.IMAGE_LOW_RES;

router.get('/:type/:id/:language', function(req, res) {

    let lang = req.params.language == "en" ? LANGUAGE_EN : LANGUAGE_CN;
    let type = req.params.type + "/";
    let id = req.params.id + "/";

    let url = TMDB + type + id + "credits" + API_KEY + lang;

    axios.get(url).then(response => {
        var result = response.data;
        if (result) {
            result = result.cast;
        } else {
            res.json(null);
        }

        var ret = [];
        for (var i = 0; i < result.length; i++) {
            var tmpDic = result[i];
            var newDic = {};
            newDic.name = tmpDic.name;
            if (tmpDic.profile_path) {
                newDic.profile = IMAGE_HIGH_RES + tmpDic.profile_path;
            } else {
                newDic.profile = null;
            }
            newDic.id = tmpDic.id;
            newDic.character = tmpDic.character;
            ret.push(newDic);
        }

        res.json(ret);
    })

})

module.exports = router;