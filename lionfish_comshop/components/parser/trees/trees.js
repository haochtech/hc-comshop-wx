function _defineProperty(t, r, e) {
    return r in t ? Object.defineProperty(t, r, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[r] = e, t
}
Component({
    properties: {
        nodes: Array,
        controls: Object
    },
    methods: {
        triggerError: function(t, r, e, i, o) {
            this._top && this._top.triggerEvent("error", {
                source: t,
                target: r,
                errMsg: e,
                errCode: i,
                context: o
            })
        },
        loadSource: function(t) {
            var r = this.data.controls[t.id] ? this.data.controls[t.id].index + 1 : 1;
            return r < t.dataset.source.length && (this.setData(_defineProperty({}, "controls." + t.id + ".index", r)), !0)
        },
        play: function(t) {
            if (this._top.group && this._top.group.pause(this._top.i), 1 < this._top.videoContexts.length && this._top.data.autopause) for (var r = this._top.videoContexts.length; r--;) this._top.videoContexts[r].id != t.currentTarget.id && this._top.videoContexts[r].pause()
        },
        imgtap: function(t) {
            var r = t.currentTarget.dataset.attrs;
            if (!r.ignore) {
                var e = !0;
                if (this._top.triggerEvent("imgtap", {
                    id: t.currentTarget.id,
                    src: r.src,
                    ignore: function() {
                        return e = !1
                    }
                }), e) {
                    if (this._top.group) return this._top.group.preview(this._top.i, r.i);
                    var i = this._top.imgList,
                        o = i[r.i] ? i[r.i] : (i = [r.src], r.src);
                    wx.previewImage({
                        current: o,
                        urls: i
                    })
                }
            }
        },
        imglongtap: function(t) {
            this._top.triggerEvent("imglongtap", {
                id: t.currentTarget.id,
                src: t.currentTarget.dataset.attrs.src
            })
        },
        linkpress: function(t) {
            var r = !0,
                e = t.currentTarget.dataset.attrs;
            e.ignore = function() {
                return r = !1
            }, this._top.triggerEvent("linkpress", e), r && (e["app-id"] || e.appId ? wx.navigateToMiniProgram({
                appId: e["app-id"] || e.appId,
                path: e.path || ""
            }) : e.href && ("#" == e.href[0] ? this._top.navigateTo({
                id: e.href.substring(1)
            }) : 0 == e.href.indexOf("http") || 0 == e.href.indexOf("//") ? wx.setClipboardData({
                data: e.href,
                success: function() {
                    wx.showToast({
                        title: "链接已复制"
                    })
                }
            }) : wx.navigateTo({
                url: e.href
            })))
        },
        adError: function(t) {
            this.triggerError("ad", t.currentTarget, t.detail.errMsg, t.detail.errCode)
        },
        videoError: function(t) {
            !this.loadSource(t.currentTarget) && this._top && this.triggerError("video", t.currentTarget, t.detail.errMsg, void 0, this._top.getVideoContext(t.currentTarget.id))
        },
        audioError: function(t) {
            this.loadSource(t.currentTarget) || this.triggerError("audio", t.currentTarget, t.detail.errMsg)
        },
        loadVideo: function(t) {
            this.setData(_defineProperty({}, "controls." + t.currentTarget.id, {
                play: !0,
                index: 0
            }))
        }
    },
    detached: function() {
        this._observer && this._observer.disconnect()
    }
});