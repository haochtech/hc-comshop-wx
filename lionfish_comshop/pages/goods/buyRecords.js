
var util = require("../../utils/util.js"),
    status = require("../../utils/index.js"),
    app = getApp(),
    buyClearTime = null;

function count_down(t, a) {
    var o = Math.floor(a / 1e3),
        e = o / 3600 / 24,
        i = Math.floor(e),
        s = o / 3600 - 24 * i,
        n = Math.floor(s),
        d = o / 60 - 1440 * i - 60 * n,
        r = Math.floor(d),
        u = o - 86400 * i - 3600 * n - 60 * r;
    if (t.setData({
        endtime: {
            days: fill_zero_prefix(i),
            hours: fill_zero_prefix(n),
            minutes: fill_zero_prefix(r),
            seconds: fill_zero_prefix(u),
            show_detail: 1
        }
    }), a <= 0) return clearTimeout(buyClearTime), void t.setData({
        endtime: {
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "00"
        }
    });
    buyClearTime = setTimeout(function() {
        count_down(t, a -= 1e3)
    }, 1e3)
}
function fill_zero_prefix(t) {
    return t < 10 ? "0" + t : t
}
Page({
    data: {
        showData: 1,
        goodDetail: {},
        showTitle: "",
        endTime: "",
        loadText: "正在加载",
        showBtn: !0,
        showSku: !1,
        skuList: [],
        cartNum: 0,
        type: 0,
        goodsStatus: 0,
        needAuth: !1,
        goodsIndex: 1,
        goods_id: 0,
        endtime: {
            days: "00",
            hours: "00",
            minutes: "00",
            seconds: "00"
        },
        rushList: [],
        hasRefeshin: !1,
        pageNum: 1,
        is_share_html: !0,
        iconArr: {
            home: "",
            car: ""
        }
    },
    goodId: 0,
    community_id: "",
    onLoad: function(e) {
        var i = this,
            s = wx.getStorageSync("token");
        status.setIcon().then(function(t) {
            i.setData({
                iconArr: t
            })
        }), this.goodId = e.id, this.community_id = e.community_id;
        var t = wx.getStorageSync("community"),
            n = t && t.communityId || "";
        if (n) console.log("step3"), o(), d();
        else {
            var a = {};
            void 0 !== e.community_id && 0 < e.community_id && (a.communityId = e.community_id), util.getCommunityInfo(a).then(function(t) {
                console.log("step1"), o(), d(t)
            }).
            catch (function(t) {
                console.log("step4 新人"), "" != Object.keys(t) && i.addhistory(t, !0)
            })
        }
        function o() {
            console.log("step2"), "undefined" != e.community_id && 0 < e.community_id && app.util.request({
                url: "entry/wxapp/index",
                data: {
                    controller: "index.get_community_info",
                    community_id: e.community_id
                },
                dataType: "json",
                success: function(t) {
                    if (0 == t.data.code) {
                        var a = t.data.data,
                            o = n;
                        e.community_id != o && wx.showModal({
                            title: "温馨提示",
                            content: "是否切换为分享人所在小区“" + a.communityName,
                            confirmColor: "#F75451",
                            success: function(t) {
                                t.confirm ? (app.globalData.community = a, app.globalData.changedCommunity = !0, wx.setStorage({
                                    key: "community",
                                    data: a
                                }), s && i.addhistory(a), d(a), console.log("用户点击确定")) : t.cancel && (i.showNoBindCommunity(), console.log("用户点击取消"))
                            }
                        })
                    }
                }
            }), i.setData({
                goods_id: e.id
            }, function() {
                i.load_buy_record()
            })
        }
        function d(t) {
            t && (n = t.communityId), app.util.request({
                url: "entry/wxapp/index",
                data: {
                    controller: "goods.get_goods_detail",
                    token: s,
                    id: e.id,
                    community_id: n
                },
                dataType: "json",
                success: function(t) {
                    wx.hideLoading();
                    var a = t.data.data && t.data.data.goods || "";
                    a && 0 != a.length && "" != Object.keys(a) || wx.showModal({
                        title: "提示",
                        content: "该商品不存在，回首页",
                        showCancel: !1,
                        confirmColor: "#F75451",
                        success: function(t) {
                            t.confirm && wx.switchTab({
                                url: "/lionfish_comshop/pages/index/index"
                            })
                        }
                    });
                    var o = t.data.comment_list;
                    o.map(function(t) {
                        3 < 14 * t.content.length / app.globalData.systemInfo.windowWidth && (t.showOpen = !0), t.isOpen = !0
                    }), i.setData({
                        order_comment_count: t.data.order_comment_count,
                        order_comment_images: t.data.order_comment_images,
                        comment_list: o,
                        loadover: !0,
                        goods: a,
                        buy_record_arr: t.data.data.buy_record_arr,
                        site_name: t.data.data.site_name,
                        share_title: a.share_title,
                        options: t.data.data.options,
                        goods_image: t.data.data.goods_image,
                        goods_image_length: t.data.data.goods_image.length,
                        service: a.tag,
                        favgoods: a.favgoods,
                        cur_time: t.data.data.cur_time,
                        order: {
                            goods_id: t.data.data.goods.goods_id,
                            pin_id: t.data.data.pin_id
                        },
                        showSkeleton: !1,
                        is_comunity_rest: t.data.is_comunity_rest,
                        goodsdetails_addcart_bg_color: t.data.goodsdetails_addcart_bg_color || "linear-gradient(270deg, #f9c706 0%, #feb600 100%)",
                        goodsdetails_buy_bg_color: t.data.goodsdetails_buy_bg_color || "linear-gradient(90deg, #ff5041 0%, #ff695c 100%)"
                    }), 1 == t.data.is_comunity_rest && wx.showModal({
                        title: "温馨提示",
                        content: "团长休息中，欢迎下次光临!",
                        showCancel: !1,
                        confirmColor: "#F75451",
                        confirmText: "好的",
                        success: function(t) {}
                    });
                    var e = 0;
                    0 < (e = 0 == a.over_type ? 1e3 * (a.begin_time - t.data.data.cur_time) : 1e3 * (a.end_time - t.data.data.cur_time)) && count_down(i, e)
                }
            })
        }
        "undefined" != e.share_id && 0 < e.share_id && wx.setStorage({
            key: "share_id",
            data: e.share_id
        })
    },
    showNoBindCommunity: function() {
        wx.showModal({
            title: "提示",
            content: "您未绑定该小区，请切换后下单！",
            showCancel: !1,
            confirmColor: "#F75451",
            success: function(t) {
                t.confirm && wx.redirectTo({
                    url: "/lionfish_comshop/pages/position/community"
                })
            }
        })
    },
    addhistory: function(t) {
        var a = 1 < arguments.length && void 0 !== arguments[1] && arguments[1],
            o = t.communityId;
        console.log("addhistory");
        var e = wx.getStorageSync("token");
        app.util.request({
            url: "entry/wxapp/index",
            data: {
                controller: "index.addhistory_community",
                community_id: o,
                token: e
            },
            dataType: "json",
            success: function(t) {
                a && (console.log("新人 社区"), app.util.request({
                    url: "entry/wxapp/index",
                    data: {
                        controller: "index.get_community_info",
                        community_id: o
                    },
                    dataType: "json",
                    success: function(t) {
                        if (0 == t.data.code) {
                            var a = t.data.data;
                            app.globalData.community = a, app.globalData.changedCommunity = !0, wx.setStorage({
                                key: "community",
                                data: a
                            })
                        }
                    }
                }))
            }
        })
    },
    authSuccess: function() {
        var t = this.goodId,
            a = wx.getStorageSync("community"),
            o = a && a.communityId || this.community_id || "";
        wx.redirectTo({
            url: "/lionfish_comshop/pages/goods/buyRecords?id=" + t + "&community_id=" + o
        })
    },
    authModal: function() {
        return !this.data.needAuth || (this.setData({
            showAuthModal: !this.data.showAuthModal
        }), !1)
    },
    load_buy_record: function() {
        var o = this,
            t = this.data.goods_id;
        o.data.hasRefeshin || (o.setData({
            hasRefeshin: !0,
            loadMore: !0
        }), app.util.request({
            url: "entry/wxapp/index",
            data: {
                controller: "goods.load_buy_recordlist",
                goods_id: t,
                pageNum: o.data.pageNum
            },
            dataType: "json",
            success: function(t) {
                if (0 == t.data.code) {
                    var a = o.data.rushList.concat(t.data.data);
                    o.setData({
                        rushList: a,
                        pageNum: o.data.pageNum + 1,
                        loadMore: !1,
                        hasRefeshin: !1,
                        tip: ""
                    })
                } else 1 == t.data.code ? o.setData({
                    loadMore: !1,
                    tip: "^_^已经到底了"
                }) : t.data.code
            }
        }))
    },
    addToCart: function(t) {
        if (this.authModal()) {
            var a = t.detail.formId,
                o = wx.getStorageSync("token");
            app.util.request({
                url: "entry/wxapp/user",
                data: {
                    controller: "user.get_member_form_id",
                    token: o,
                    from_id: a
                },
                dataType: "json",
                success: function(t) {}
            }), this.setData({
                is_just_addcar: 1
            }), this.openSku()
        }
    },
    openSku: function() {
        var t = this.data.goods_id,
            a = this.data.options;
        this.setData({
            addCar_goodsid: t
        });
        var o = a.list || [],
            e = [];
        if (0 < o.length) {
            for (var i = 0; i < o.length; i++) {
                var s = o[i].option_value[0],
                    n = {
                        name: s.name,
                        id: s.option_value_id,
                        index: i,
                        idx: 0
                    };
                e.push(n)
            }
            for (var d = "", r = 0; r < e.length; r++) r == e.length - 1 ? d += e[r].id : d = d + e[r].id + "_";
            var u = a.sku_mu_list[d];
            this.setData({
                sku: e,
                sku_val: 1,
                cur_sku_arr: u,
                skuList: a,
                visible: !0,
                showSku: !0
            })
        } else {
            var c = this.data.goods,
                l = {
                    canBuyNum: c.total,
                    spuName: c.goodsname,
                    actPrice: c.actPrice,
                    marketPrice: c.marketPrice,
                    stock: c.total,
                    skuImage: c.image_thumb
                };
            this.setData({
                sku: [],
                sku_val: 1,
                cur_sku_arr: l,
                skuList: []
            });
            var m = {
                detail: {
                    formId: ""
                }
            };
            m.detail.formId = "the formId is a mock one", this.gocarfrom(m)
        }
    },
    gocarfrom: function(t) {
        this.data.is_just_addcar;
        wx.showLoading();
        var a = wx.getStorageSync("token");
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                controller: "user.get_member_form_id",
                token: a,
                from_id: t.detail.formId
            },
            dataType: "json",
            success: function(t) {}
        }), this.goOrder()
    },
    closeSku: function() {
        this.setData({
            visible: 0,
            stopClick: !1
        })
    },
    goOrder: function() {
        var i = this;
        i.data.can_car && (i.data.can_car = !1);
        wx.getStorageSync("token");
        var t = wx.getStorageSync("community"),
            s = i.data.goods_id,
            a = t.communityId,
            o = i.data.sku_val,
            e = i.data.cur_sku_arr,
            n = "",
            d = i.data.is_just_addcar;
        e && e.option_item_ids && (n = e.option_item_ids);
        var r = {
            goods_id: s,
            community_id: a,
            quantity: o,
            sku_str: n,
            buy_type: "dan",
            pin_id: 0,
            is_just_addcar: d
        };
        util.addCart(r).then(function(t) {
            if (1 == t.showVipModal) {
                var a = t.data.pop_vipmember_buyimage;
                wx.hideLoading(), i.setData({
                    pop_vipmember_buyimage: a,
                    showVipModal: !0,
                    visible: !1
                })
            } else if (3 == t.data.code || 7 == t.data.code) wx.showToast({
                title: t.data.msg,
                icon: "none",
                duration: 2e3
            });
            else if (4 == t.data.code) wx.showToast({
                title: "您未登录",
                duration: 2e3
            });
            else if (6 == t.data.code) {
                var o = t.data.msg,
                    e = t.data.max_quantity || "";
                0 < e && i.setData({
                    sku_val: e
                }), wx.showToast({
                    title: o,
                    icon: "none",
                    duration: 2e3
                })
            } else {
                if (1 == d) i.closeSku(), wx.showToast({
                    title: "已加入购物车",
                    image: "../../images/addShopCart.png"
                }), app.globalData.cartNum = t.data.total, i.setData({
                    cartNum: t.data.total
                }), status.indexListCarCount(s);
                else 3 < getCurrentPages().length ? wx.redirectTo({
                    url: "/lionfish_comshop/pages/order/placeOrder?type=dan"
                }) : wx.navigateTo({
                    url: "/lionfish_comshop/pages/order/placeOrder?type=dan"
                })
            }
        }).
        catch (function(t) {
            app.util.message(t || "请求失败", "", "error")
        })
    },
    selectSku: function(t) {
        var a = t.currentTarget.dataset.type.split("_"),
            o = this.data.sku,
            e = {
                name: a[3],
                id: a[2],
                index: a[0],
                idx: a[1]
            };
        o.splice(a[0], 1, e), this.setData({
            sku: o
        });
        for (var i = "", s = 0; s < o.length; s++) s == o.length - 1 ? i += o[s].id : i = i + o[s].id + "_";
        var n = this.data.skuList.sku_mu_list[i];
        this.setData({
            cur_sku_arr: n
        }), console.log(i)
    },
    submit: function(t) {
        var a = t.detail.formId,
            o = wx.getStorageSync("token");
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                controller: "user.get_member_form_id",
                token: o,
                from_id: a
            },
            dataType: "json",
            success: function(t) {}
        })
    },
    balance: function(t) {
        this.authModal() && (this.setData({
            is_just_addcar: 0
        }), this.openSku())
    },
    setNum: function(t) {
        var a = t.currentTarget.dataset.type,
            o = 1,
            e = 1 * this.data.sku_val;
        "add" == a ? o = e + 1 : "decrease" == a && 1 < e && (o = e - 1);
        for (var i = this.data.sku, s = this.data.skuList, n = "", d = 0; d < i.length; d++) d == i.length - 1 ? n += i[d].id : n = n + i[d].id + "_";
        o > s.sku_mu_list[n].canBuyNum && (o -= 1), this.setData({
            sku_val: o
        })
    },
    onShow: function() {
        var a = this;
        util.check_login_new().then(function(t) {
            t ? (0, status.cartNum)("", !0).then(function(t) {
                0 == t.code && a.setData({
                    cartNum: t.data
                })
            }) : a.setData({
                needAuth: !0
            })
        })
    },
    confirmSku: function() {
        this.closeSku()
    },
    onUnload: function() {
        clearTimeout(buyClearTime), console.log("onUload"), this.setData({
            showSku: !1
        })
    },
    onReachBottom: function() {
        this.load_buy_record()
    }
});