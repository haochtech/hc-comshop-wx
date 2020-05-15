
var app = getApp(),
    util = require("../../utils/util.js");
Page({
    mixins: [require("../../mixin/cartMixin.js")],
    data: {
        list: [],
        supplyList: [],
        noMore: !1,
        supply_diy_name: "供应商"
    },
    page: 1,
    onLoad: function(t) {
        this.getData()
    },
    authSuccess: function() {
        var t = this;
        this.page = 1, this.setData({
            needAuth: !1,
            noMore: !1,
            list: [],
            supplyList: []
        }, function() {
            t.getData()
        })
    },
    onShow: function() {
        var a = this;
        util.check_login_new().then(function(t) {
            t ? a.setData({
                needAuth: !1
            }) : a.setData({
                needAuth: !0,
                navBackUrl: "/lionfish_comshop/pages/supply/index"
            })
        })
    },
    getData: function() {
        wx.showLoading();
        var t = wx.getStorageSync("token"),
            s = this,
            a = wx.getStorageSync("community");
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                controller: "supply.get_list",
                token: t,
                page: s.page,
                head_id: a.communityId
            },
            dataType: "json",
            success: function(t) {
                if (wx.stopPullDownRefresh(), wx.hideLoading(), 1 == s.page) {
                    var a = t.data.supply_diy_name || "供应商";
                    wx.setNavigationBarTitle({
                        title: a + "列表"
                    }), s.setData({
                        supply_diy_name: a
                    })
                }
                if (0 == t.data.code) {
                    var e = s.data.supplyList.concat(t.data.data);
                    s.setData({
                        supplyList: e
                    })
                } else s.setData({
                    noMore: !0
                })
            }
        })
    },
    goDetails: function(t) {
        var a = t.currentTarget.dataset.id || 0;
        a && wx.navigateTo({
            url: "/lionfish_comshop/pages/supply/home?id=" + a
        })
    },
    onPullDownRefresh: function() {
        var t = this;
        this.page = 1, this.setData({
            noMore: !1,
            list: [],
            supplyList: []
        }, function() {
            t.getData()
        })
    },
    openSku: function(t) {
        if (this.authModal()) {
            var a = t.currentTarget.dataset.shopidx,
                e = this.data.supplyList[a].goods_list || [];
            this.setData({
                list: e
            });
            var s = this,
                i = e[t.currentTarget.dataset.idx],
                n = i.actId,
                o = i.skuList;
            s.setData({
                addCar_goodsid: n
            });
            var u = o.list || [],
                r = [];
            if (0 < u.length) {
                for (var l = 0; l < u.length; l++) {
                    var p = u[l].option_value[0],
                        d = {
                            name: p.name,
                            id: p.option_value_id,
                            index: l,
                            idx: 0
                        };
                    r.push(d)
                }
                for (var h = "", c = 0; c < r.length; c++) c == r.length - 1 ? h += r[c].id : h = h + r[c].id + "_";
                var g = o.sku_mu_list[h];
                s.setData({
                    sku: r,
                    sku_val: 1,
                    cur_sku_arr: g,
                    skuList: i.skuList,
                    visible: !0,
                    showSku: !0
                })
            } else {
                var f = i;
                s.setData({
                    sku: [],
                    sku_val: 1,
                    skuList: [],
                    cur_sku_arr: f
                });
                var _ = {
                    detail: {
                        formId: ""
                    }
                };
                _.detail.formId = "the formId is a mock one", s.gocarfrom(_)
            }
        }
    },
    onReachBottom: function() {
        this.data.noMore || (this.page++, this.getData())
    },
    onShareAppMessage: function() {}
});