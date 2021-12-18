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

router.get('/:type/:id/:language', function(req, res) {

    LANGUAGE += req.params.language == 'zh' ? 'zh' : 'en-US';
    let TYPE = req.params.type + "/";
    let ID = req.params.id + "/";

    let url = TMDB + TYPE + ID + "credits" + API_KEY + LANGUAGE;

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