function getUrl() {
    let url = process.env.VUE_APP_BACKEND_URL + ":" + process.env.VUE_APP_BACKEND_PORT;
    console.log(url);
    return url;
}

export { getUrl }