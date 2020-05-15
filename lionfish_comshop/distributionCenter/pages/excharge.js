var _extends = Object.assign || function(t) {
        for (var a = 1; a < arguments.length; a++) {
            var n = arguments[a];
            for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i])
        }
        return t
    }, app = getApp(),
    util = require("../../utils/util.js");
Page({
    mixins: [require("../../mixin/commonMixin.js")],
    data: {
        type: 1,
        items: [{
            name: "1",
            value: "余额",
            show: !0,
            checked: !1
        }, {
            name: "2",
            value: "微信零钱",
            show: !0,
            checked: !1
        }, {
            name: "3",
            value: "支付宝",
            show: !0,
            checked: !1
        }, {
            name: "4",
            value: "银行卡",
            show: !0,
            checked: !1
        }],
        info: [],
        tixian_money: "",
        final_money: 0
    },
    canTixian: !0,
    onLoad: function(t) {
        wx.showLoading(), this.getData()
    },
    onShow: function() {
        var a = this;
        util.check_login_new().then(function(t) {
            t ? a.setData({
                needAuth: !1
            }) : a.setData({
                needAuth: !0
            })
        })
    },
    authSuccess: function() {
        var t = this;
        this.setData({
            needAuth: !1
        }, function() {
            wx.showLoading(), t.getData()
        })
    },
    getData: function() {
        var t = wx.getStorageSync("token"),
            u = this;
        app.util.request({
            url: "entry/wxapp/user",
            data: {
                controller: "distribution.get_commission_info",
                token: t
            },
            dataType: "json",
            success: function(t) {
                if (wx.hideLoading(), 0 == t.data.code) {
                    var a = t.data.data.commiss_tixian_publish,
                        n = u.data.items,
                        i = t.data.data;
                    0 == i.commiss_tixianway_yuer && (n[0].show = !1), 0 == i.commiss_tixianway_weixin && (n[1].show = !1), 0 == i.commiss_tixianway_alipay && (n[2].show = !1), 0 == i.commiss_tixianway_bank && (n[3].show = !1);
                    for (var e = u.data.type, o = 0; o < n.length; o++) if (n[o].show) {
                        n[o].checked = !0, e = n[o].name;
                        break
                    }
                    var s = t.data,
                        c = s.is_need_subscript,
                        r = s.need_subscript_template;
                    u.setData({
                        info: t.data.data,
                        items: n,
                        type: e,
                        is_need_subscript: c,
                        need_subscript_template: r,
                        commiss_tixian_publish: a
                    })
                } else wx.showModal({
                    title: "提示",
                    content: t.data.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && (console.log("用户点击确定"), wx.reLaunch({
                            url: "/lionfish_comshop/pages/user/me"
                        }))
                    }
                })
            }
        })
    },
    formSubmit: function(t) {
        var a = t.detail.value,
            n = 0,
            i = this.data.type,
            e = [{}, {}, {
                bankusername: "微信真实姓名"
            }, {
                bankusername: "支付宝真实姓名",
                bankaccount: "支付宝账户"
            }, {
                bankname: "银行卡名称",
                bankusername: "持卡人姓名",
                bankaccount: "银行卡账户"
            }];
        for (var o in a) {
            if (a[o] = a[o].replace(/(^\s*)|(\s*$)/g, ""), !a[o]) {
                var s = e[i][o];
                wx.showToast({
                    title: "请输入" + (s || "正确的表单内容"),
                    icon: "none"
                }), n = 1;
                break
            }
            if ("money" == o && 1 * a[o] <= 0) return void wx.showToast({
                title: "请输入正确的金额",
                icon: "none"
            })
        }
        if (1 != n) {
            a.type = i;
            var c = this.data,
                r = parseFloat(c.tixian_money),
                u = c.info.money,
                d = parseFloat(c.info.commiss_min_tixian_money);
            if ("" == r || r < d) return wx.showToast({
                title: "最小提现" + d + "元",
                icon: "none"
            }), !1;
            if (u < r) {
                wx.showToast({
                    title: "本次最大可提现" + u + "元",
                    icon: "none"
                });
                var l = (u * (100 - c.info.commiss_tixian_bili) / 100).toFixed(2);
                return this.setData({
                    tixian_money: u,
                    final_money: l
                }), !1
            }
            if (this.canTixian) {
                this.canTixian = !1, wx.showLoading();
                var m = wx.getStorageSync("token"),
                    h = this;
                app.util.request({
                    url: "entry/wxapp/user",
                    data: _extends({
                        controller: "distribution.tixian_sub",
                        token: m
                    }, a),
                    dataType: "json",
                    success: function(t) {
                        wx.hideLoading(), 0 == t.data.code ? wx.showToast({
                            title: "已提交申请",
                            icon: "none",
                            duration: 2e3,
                            success: function() {
                                h.setData({
                                    canPay: !1,
                                    tixian_money: "",
                                    final_money: 0
                                }), h.getData()
                            }
                        }) : wx.showToast({
                            title: t.data.msg ? t.data.msg : "提交失败，请重试",
                            icon: "none"
                        })
                    }
                })
            }
        }
    },
    bindIptFocus: function() {
        this.setData({
            onFocus: !0
        })
    },
    bindIptBlur: function() {
        this.setData({
            onFocus: !1
        })
    },
    radioChange: function(t) {
        this.setData({
            type: t.detail.value
        })
    },
    bindTixianMoneyInput: function(t) {
        var a = this.data.info.money,
            n = t.detail.value;
        /^(\d?)+(\.\d{0,2})?$/.test(n) || (n = n.substring(0, n.length - 1), n = parseFloat(n)), a < n && wx.showToast({
            title: "本次最大可提现" + a + "元",
            icon: "none"
        });
        var i = this.data.info.commiss_tixian_bili,
            e = ((0 < parseFloat(n) ? parseFloat(n) : 0) * (100 - i) / 100).toFixed(2),
            o = !1;
        return o = !! n, this.setData({
            tixian_money: n,
            final_money: e,
            canPay: o
        }), n
    },
    getAll: function() {
        var t = this.data,
            a = 1 * t.info.money,
            n = (a * (100 - t.info.commiss_tixian_bili) / 100).toFixed(2),
            i = !1;
        i = !! a, this.setData({
            tixian_money: a,
            final_money: n,
            canPay: i
        })
    }
});