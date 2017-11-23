const api = require("../../lib/api.js");
const config = require("../../config.js");
const request = require('../../lib/request.js');
const wxParse = require('../../lib/wxParse/wxParse.js');

Page({
    data: {
        navs: [],
        currentNav: 0,
        content: '',
        hidden: true,
        isStarted: false,
        bgImageUrl: ''
    },
    onLoad: function () {
        this.getProducts().then(resp => {
            this.toggleLoading();
            let navs = [];
            if (resp) {
                resp.forEach(item => {
                    navs.push(item);
                });
            }

            this.setData({
                navs: navs
            });
        }).then(() => {
            this.loadPage(this.data.currentNav);
            this.toggleLoading();
            this.setData({
                isStarted: true
            });
            // 设置背景图
            this.getCard(config.bgImageCardId).then(resp => {
                if(resp.desc){
                    this.setData({
                        bgImageUrl: resp.desc
                    });
                }
            });
        });
    },
    onReady: function () {
        wx.showShareMenu({
            withShareTicket: true
        });
    },
    navbarTap: function (e) {
        this.loadPage(e.currentTarget.dataset.idx)
    },
    loadPage(index) {
        if(this.data.isStarted && index === this.data.currentNav){
            return;
        }

        let cardId = this.data.navs[index].id;
        this.getCard(cardId).then(resp => {
            this.toggleLoading();
            let that = this;
            wxParse.wxParse('content', 'md', resp.desc, that);
        }).then(() => {
            this.setData({
                currentNav: index
            });
            this.toggleLoading();
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
        this.setData({
            isStarted: false
        });
        this.onLoad();
        wx.stopPullDownRefresh();
    },
    toggleLoading(){
        this.setData({
            hidden: !this.data.hidden
        });
    }
});
