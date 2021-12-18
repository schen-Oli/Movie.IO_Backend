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

router.get('/:type/:id/:language', function(req, res) {
    let language = req.params.language == 'en' ? LANGUAGE_EN : LANGUAGE_CN;
    let type = req.params.type + "/";
    let id = req.params.id + "/";
    let operation = "reviews"
    let url = TMDB + type + id + operation + API_KEY + language;

    axios.get(url).then(response => {
        console.log(url);
        let result = response.data.results;
        var ret = [];
        var length = result.length > 6 ? 6 : result.length;
        for (var i = 0; i < length; i++) {
            var tmp = {};
            tmp.author = result[i].author;
            tmp.rate = result[i].author_details.rating;
            tmp.content = result[i].content;
            tmp.date = getDate(result[i].created_at);
            tmp.url = result[i].url;
            if (result[i].author_details.avatar_path) {
                if (result[i].author_details.avatar_path.indexOf("ttps") > 0) {
                    tmp.profile = result[i].author_details.avatar_path.substring(1, result[i].author_details.avatar_path.length);
                } else {
                    tmp.profile = IMAGE_HIGH_RES + result[i].author_details.avatar_path;
                }
            } else {
                tmp.profile = null;
            }
            ret.push(tmp);
        }
        res.json(ret);
    }).catch(err => {
        console.log(err);
    })
})

function getDate(date) {
    var year = date.substring(0, 4) + ", ";
    var month = getMonth(parseInt(date.substring(5, 7)));
    var day = parseInt(date.substring(8, 10)) + ", ";

    var hour = parseInt(date.substring(11, 13));
    var min = date.substring(14, 16) + ":";
    var sec = date.substring(17, 19) + " ";

    if (hour <= 12) {
        return month + day + year + hour + ":" + min + sec + "AM";
    } else {
        hour = hour - 12;
        return month + day + year + hour + ":" + min + sec + "PM";
    }
}

function getMonth(number) {
    var months = [
        "January ",
        "February ",
        "March ",
        "April ",
        "May ",
        "June ",
        "July ",
        "August ",
        "September ",
        "October ",
        "November ",
        "December "
    ]
    return months[number - 1];
}

module.exports = router;