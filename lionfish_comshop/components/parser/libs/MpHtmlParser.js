var _createClass = function() {
    function e(t, i) {
        for (var s = 0; s < i.length; s++) {
            var e = i[s];
            e.enumerable = e.enumerable || !1, e.configurable = !0, "value" in e && (e.writable = !0), Object.defineProperty(t, e.key, e)
        }
    }
    return function(t, i, s) {
        return i && e(t.prototype, i), s && e(t, s), t
    }
}();

function _classCallCheck(t, i) {
    if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function")
}
var emoji, config = require("./config.js"),
    blankChar = config.blankChar,
    CssHandler = require("./CssHandler.js");
try {
    emoji = require("./emoji.js")
} catch (t) {}
var MpHtmlParser = function() {
    function s(t) {
        var i = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
        _classCallCheck(this, s), this.CssHandler = new CssHandler(i.tagStyle), this.data = t, this.DOM = [], this._attrName = "", this._attrValue = "", this._attrs = {}, this._domain = i.domain, this._i = 0, this._protocol = this._domain && this._domain.includes("://") ? this._domain.split("://")[0] : "http", this._start = 0, this._state = this.Text, this._STACK = [], this._tagName = "", this._audioNum = 0, this._imgNum = 0, this._videoNum = 0, this._useAnchor = i.useAnchor, this._pre = !1
    }
    return _createClass(s, [{
        key: "parse",
        value: function() {
            emoji && (this.data = emoji.parseEmoji(this.data)), config.highlight && (this.data = this.data.replace(/<[pP][rR][eE]([\s\S]*?)>([\s\S]+?)<\/[pP][rR][eE][\s\S]*?>/g, function(t, i, s) {
                return "<pre" + i + ">" + config.highlight(s, i) + "</pre>"
            })), this.data = this.CssHandler.getStyle(this.data);
            for (var t = this.data.length; this._i < t; this._i++) this._state(this.data[this._i]);
            for (this._state == this.Text && this.setText(); this._STACK.length;) this.popNode(this._STACK.pop());
            return this.DOM.length && (this.DOM[0].PoweredBy = "Parser"), this.DOM
        }
    }, {
        key: "setAttr",
        value: function() {
            for (config.trustAttrs[this._attrName] && ("src" == this._attrName && "/" == this._attrValue[0] && ("/" == this._attrValue[1] ? this._attrValue = this._protocol + ":" + this._attrValue : this._domain && (this._attrValue = this._domain + this._attrValue)), this._attrs[this._attrName] = this._attrValue ? this._attrValue : "src" == this._attrName || "alt" == this._attrName ? "" : "T"), this._attrValue = ""; blankChar[this.data[this._i]];) this._i++;
            this.checkClose() ? this.setNode() : this._state = this.AttrName
        }
    }, {
        key: "setText",
        value: function() {
            var t = this.getSelection();
            if (t) {
                if (!this._pre) {
                    for (var i, s = [], e = t.length, a = !1; i = t[--e];)(!blankChar[i] && (a = !0) || !blankChar[s[0]] && (i = " ")) && s.unshift(i);
                    if (!a) return;
                    t = s.join("")
                }
                var h, r, n;
                for (e = t.indexOf("&"); - 1 != e && -1 != (h = t.indexOf(";", e + 2));) "#" == t[e + 1] ? (r = parseInt(("x" == t[e + 2] ? "0" : "") + t.substring(e + 2, h)), isNaN(r) || (t = t.substring(0, e) + String.fromCharCode(r) + t.substring(h + 1))) : "nbsp" == (r = t.substring(e + 1, h)) ? t = t.substring(0, e) + " " + t.substring(h + 1) : "lt" != r && "gt" != r && "amp" != r && "ensp" != r && "emsp" != r && (n = !0), e = t.indexOf("&", e + 1);
                var l = this._STACK.length ? this._STACK[this._STACK.length - 1].children : this.DOM;
                l.length && "text" == l[l.length - 1].type ? (l[l.length - 1].text += t, n && (l[l.length - 1].decode = !0)) : l.push({
                    type: "text",
                    text: t,
                    decode: n
                })
            }
        }
    }, {
        key: "setNode",
        value: function() {
            var t = this._STACK.length ? this._STACK[this._STACK.length - 1].children : this.DOM,
                i = {
                    name: this._tagName.toLowerCase(),
                    attrs: this._attrs
                };
            if (config.LabelHandler(i, this), this._attrs = {}, !config.selfClosingTags[i.name]) {
                if (config.ignoreTags[i.name]) {
                    for (var s = this._i; this._i < this.data.length;) {
                        for (-1 == (this._i = this.data.indexOf("</", this._i + 1)) && (this._i = this.data.length), this._i += 2, this._start = this._i; !blankChar[this.data[this._i]] && ">" != this.data[this._i] && "/" != this.data[this._i];) this._i++;
                        if (this.data.substring(this._start, this._i).toLowerCase() == i.name) {
                            if (this._i = this.data.indexOf(">", this._i), -1 == this._i ? this._i = this.data.length : this._start = this._i + 1, this._state = this.Text, "svg" == i.name) {
                                var e = this.data.substring(s, this._i + 1);
                                for (i.attrs.xmlns || (e = ' xmlns="http://www.w3.org/2000/svg"' + e), this._i = s;
                                "<" != this.data[s];) s--;
                                e = this.data.substring(s, this._i) + e, this._i = this._start - 1, i.name = "img", i.attrs = {
                                    src: "data:image/svg+xml;utf8," + e.replace(/#/g, "%23"),
                                    ignore: "T"
                                }, t.push(i)
                            }
                            break
                        }
                    }
                    return
                }
                this._STACK.push(i), i.children = []
            }
            "/" == this.data[this._i] && this._i++, this._start = this._i + 1, this._state = this.Text, config.ignoreTags[i.name] || (("pre" == i.name || i.attrs.style && i.attrs.style.includes("white-space") && i.attrs.style.includes("pre")) && (this._pre = !0, i.pre = !0), t.push(i))
        }
    }, {
        key: "popNode",
        value: function(e) {
            if (config.blockTags[e.name] ? e.name = "div" : config.trustTags[e.name] || (e.name = "span"), e.pre) {
                this._pre = !1, e.pre = void 0;
                for (var t = this._STACK.length; t--;) this._STACK[t].pre && (this._pre = !0)
            }
            if (e.c) if ("ul" == e.name) {
                var i = 1;
                for (t = this._STACK.length; t--;) "ul" == this._STACK[t].name && i++;
                if (1 != i) for (t = e.children.length; t--;) e.children[t].floor = i
            } else if ("ol" == e.name) for (var s = function(t, i) {
                if ("a" == i) return String.fromCharCode(97 + (t - 1) % 26);
                if ("A" == i) return String.fromCharCode(65 + (t - 1) % 26);
                if ("i" == i || "I" == i) {
                    t = (t - 1) % 99 + 1;
                    var s = (["X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"][Math.floor(t / 10) - 1] || "") + (["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][t % 10 - 1] || "");
                    return "i" == i ? s.toLowerCase() : s
                }
                return t
            }, a = (t = 0, 1); r = e.children[t++];) "li" == r.name && (r.type = "ol", r.num = s(a++, e.attrs.type) + ".");
            if ("table" == e.name) {
                var h = function t(i) {
                    if ("th" == i.name || "td" == i.name) return e.attrs.border && (i.attrs.style = "border:" + e.attrs.border + "px solid gray;" + (i.attrs.style || "")), void(e.attrs.hasOwnProperty("cellpadding") && (i.attrs.style = "padding:" + e.attrs.cellpadding + "px;" + (i.attrs.style || "")));
                    if ("text" != i.type) for (var s = (i.children || []).length; s--;) t(i.children[s])
                };
                if (e.attrs.border && (e.attrs.style = "border:" + e.attrs.border + "px solid gray;" + (e.attrs.style || "")), e.attrs.hasOwnProperty("cellspacing") && (e.attrs.style = "border-spacing:" + e.attrs.cellspacing + "px;" + (e.attrs.style || "")), e.attrs.border || e.attrs.hasOwnProperty("cellpadding")) for (t = e.children.length; t--;) h(e.children[t])
            }
            if (1 == e.children.length && "div" == e.name && "div" == e.children[0].name) {
                var r = e.children[0].attrs;
                e.attrs.style = e.attrs.style || "", r.style = r.style || "", e.attrs.style.includes("padding") || e.attrs.style.includes("margin") && r.style.includes("margin") || e.attrs.style.includes("display") || r.style.includes("display") || e.attrs.id || e.attrs.id || e.attrs.class || r.class ? (e.attrs.style || (e.attrs.style = void 0), r.style || (r.style = void 0)) : (r.style.includes("padding") && (r.style = "box-sizing:border-box;" + r.style), e.attrs.style = e.attrs.style + ";" + r.style, e.attrs.id = (r.id || "") + (e.attrs.id || ""), e.attrs.class = (r.class || "") + (e.attrs.class || ""), e.children = e.children[0].children)
            }
            this.CssHandler.pop && this.CssHandler.pop(e)
        }
    }, {
        key: "checkClose",
        value: function() {
            return ">" == this.data[this._i] || "/" == this.data[this._i] && ">" == this.data[this._i + 1]
        }
    }, {
        key: "getSelection",
        value: function(t) {
            for (var i = this._start == this._i ? "" : this.data.substring(this._start, this._i); t && (blankChar[this.data[++this._i]] || (this._i--, 0)););
            return this._start = this._i + 1, i
        }
    }, {
        key: "Text",
        value: function(t) {
            if ("<" == t) {
                var i = this.data[this._i + 1];
                "a" <= i && i <= "z" || "A" <= i && i <= "Z" ? (this.setText(), this._state = this.TagName) : "/" == i ? (this.setText(), this._i++, "a" <= (i = this.data[this._i + 1]) && i <= "z" || "A" <= i && i <= "Z" ? (this._start = this._i + 1, this._state = this.EndTag) : this._state = this.Comment) : "!" == i && (this.setText(), this._state = this.Comment)
            }
        }
    }, {
        key: "Comment",
        value: function() {
            if ("--" == this.data.substring(this._i + 1, this._i + 3) || "[CDATA[" == this.data.substring(this._i + 1, this._i + 7)) {
                if (this._i = this.data.indexOf("--\x3e", this._i + 1), -1 == this._i) return this._i = this.data.length;
                this._i = this._i + 2
            } else -1 == (this._i = this.data.indexOf(">", this._i + 1)) && (this._i = this.data.length);
            this._start = this._i + 1, this._state = this.Text
        }
    }, {
        key: "TagName",
        value: function(t) {
            blankChar[t] ? (this._tagName = this.getSelection(!0), this.checkClose() ? this.setNode() : this._state = this.AttrName) : this.checkClose() && (this._tagName = this.getSelection(), this.setNode())
        }
    }, {
        key: "AttrName",
        value: function(t) {
            if (blankChar[t]) if (this._attrName = this.getSelection(!0).toLowerCase(), "=" == this.data[this._i]) {
                for (; blankChar[this.data[++this._i]];);
                this._start = this._i--, this._state = this.AttrValue
            } else this.setAttr();
            else if ("=" == t) {
                for (this._attrName = this.getSelection().toLowerCase(); blankChar[this.data[++this._i]];);
                this._start = this._i--, this._state = this.AttrValue
            } else this.checkClose() && (this._attrName = this.getSelection().toLowerCase(), this.setAttr())
        }
    }, {
        key: "AttrValue",
        value: function(t) {
            if ('"' == t || "'" == t) {
                if (this._start++, -1 == (this._i = this.data.indexOf(t, this._i + 1))) return this._i = this.data.length
            } else for (; !blankChar[this.data[this._i]] && ">" != this.data[this._i]; this._i++);
            for (this._attrValue = this.getSelection(); this._attrValue.includes("&quot;");) this._attrValue = this._attrValue.replace("&quot;", "");
            this.setAttr()
        }
    }, {
        key: "EndTag",
        value: function(t) {
            if (blankChar[t] || ">" == t || "/" == t) {
                for (var i = this.getSelection().toLowerCase(), s = !1, e = this._STACK.length; e--;) if (this._STACK[e].name == i) {
                    s = !0;
                    break
                }
                if (s) for (var a; s;)(a = this._STACK.pop()).name == i && (s = !1), this.popNode(a);
                else if ("p" == i || "br" == i) {
                    (this._STACK.length ? this._STACK[this._STACK.length - 1].children : this.DOM).push({
                        name: i,
                        attrs: {}
                    })
                }
                this._i = this.data.indexOf(">", this._i), -1 == this._i ? this._i = this.data.length : this._state = this.Text
            }
        }
    }]), s
}();
module.exports = function(t, i) {
    return new MpHtmlParser(t, i).parse()
};