const api = require("../../lib/api.js");
const config = require("../../config.js");
const request = require('../../lib/request.js');
const wxParse = require('../../lib/wxParse/wxParse.js');

Page({
    data: {
        navs: [],
        currentNav: 0,
        content: ''
    },
    onLoad: function () {
        let navs = [];
        this.getProducts().then(resp => {
            if (resp) {
                resp.forEach(item => {
                    navs.push(item);
                });
            }

            this.setData({
                navs: navs
            });

            this.loadPage(this.data.currentNav);
        });
    },
    navbarTap: function (e) {
        this.loadPage(e.currentTarget.dataset.idx)
    },
    loadPage(index) {
        this.setData({
            currentNav: index
        });
        let cardId = this.data.navs[index].id;
        this.getCard(cardId).then(resp => {
            let that = this;
            wxParse.wxParse('content', 'md', resp.desc, that, 5);
        });
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
    getCard(cardId){
        return request({
            method: "GET",
            data: {
                "fields": "desc",
                "key": config.key,
                "token": config.token
            },
            url: api.cardUrl(cardId)
        });
    },
    onPullDownRefresh: function () {
        this.onLoad();
        wx.stopPullDownRefresh();
    },
});
