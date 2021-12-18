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

router.get('/:type/:id/:language', function(req, res) {
    LANGUAGE += req.params.language == 'zh' ? 'zh' : 'en-US';
    let type = req.params.type + "/";
    let id = req.params.id + "/";
    let operation = "reviews"
    let url = TMDB + type + id + operation + API_KEY + LANGUAGE;

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