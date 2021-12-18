module.exports = {
    TMDB: "https://api.themoviedb.org/3/",
    API_KEY: "?api_key=c1f7f5d00c378570cda732e7df5c39a6",
    LANGUAGE_EN: "&language=en-US",
    LANGUAGE_CN: "&language=zh",
    IMAGE_HIGH_RES: "https://image.tmdb.org/t/p/original",
    IMAGE_LOW_RES: "https://image.tmdb.org/t/p/w500",
    PAGE: "&page=",
    BACKDROP_PLACEHOLDER: "https://loremflickr.com/g/480/270/dark",
    DEFAULT_REGION: "&region=US",

    MEDIA_INFO_PLACEHOLDER: {
        type: null,
        id: -1,
        title: "Network Down, Please Try Later",
        backdrop_highRes: this.BACKDROP_PLACEHOLDER,
        backdrop_lowRes: this.BACKDROP_PLACEHOLDER,
        poster_highRes: this.BACKDROP_PLACEHOLDER,
        poster_lowRes: this.BACKDROP_PLACEHOLDER,
    }
}