const api = require("../../lib/api.js");
const config = require("../../config.js");
const request = require('../../lib/request.js');

Page({
    data: {
        navs: [],
        // default index
        currentNav: 0
    },
    onLoad: function () {
        let navs = [{
            id: "index",
            name: "首页"
        }];
        this.getProducts().then((resp) => {
            if (resp) {
                resp.forEach(item => {
                    navs.push(item);
                });
            }

            this.setData({
                navs: navs
            });
        });
    },
    navbarTap: function (e) {
        this.setData({
            currentNav: e.currentTarget.dataset.idx
        })
    },
    getProducts() {
        return request({
            method: 'GET',
            data: {
                "fields": "id,name",
                "key": config.key,
                "token": config.token
            },
            url: api.productsUrl()
        });
    },
    onPullDownRefresh: function () {
        this.onLoad();
    },
});
