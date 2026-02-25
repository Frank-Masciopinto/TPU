/*!
 * @name        lst-zoom-swap
 * @author       <>
 * @modified    Tuesday, May 12th, 2020
 * @version     1.0.1
 */
 ! function(t, e) {
     "use strict";
     "function" == typeof define && define.amd ? define(["jquery"], function(t) {
         e(t)
     }) : "object" == typeof module && module.exports ? module.exports = t.EasyZoom = e(require("jquery")) : t.EasyZoom = e(t.jQuery)
 }(this, function(i) {
     "use strict";
     var c, d, l, p, u, f, o = {
         loadingNotice: "Loading image",
         errorNotice: "The image could not be loaded",
         errorDuration: 2500,
         linkAttribute: "href",
         preventClicks: !0,
         beforeShow: i.noop,
         beforeHide: i.noop,
         onShow: i.noop,
         onHide: i.noop,
         onMove: i.noop
     };

     function s(t, e) {
         this.$target = i(t), this.opts = i.extend({}, o, e, this.$target.data()), void 0 === this.isOpen && this._init()
     }
     return s.prototype._init = function() {
         this.$link = this.$target.find("a"), this.$image = this.$target.find("img"), this.$flyout = i('<div class="easyzoom-flyout" />'), this.$notice = i('<div class="easyzoom-notice" />'), this.$target.on({
             "hover.easyzoom": i.proxy(this._onHover, this)
         }), this.opts.preventClicks && this.$target.on("hover.easyzoom", function(t) {
             t.preventDefault()
         })
     }, s.prototype.show = function(t, e) {
         var o = this;
         if (!1 !== this.opts.beforeShow.call(this)) {
             if (!this.isReady) return this._loadImage(this.$link.attr(this.opts.linkAttribute), function() {
                 !o.isMouseOver && e || o.show(t)
             });
             this.$target.append(this.$flyout);
             var i = this.$target.outerWidth(),
                 s = this.$target.outerHeight(),
                 h = this.$flyout.width(),
                 n = this.$flyout.height(),
                 a = this.$zoom.width(),
                 r = this.$zoom.height();
             (c = a - h) < 0 && (c = 0), (d = r - n) < 0 && (d = 0), l = c / i, p = d / s, this.isOpen = !0, this.opts.onShow.call(this), t && this._move(t)
         }
     },  s.prototype._loadImage = function(t, e) {
         var o = new Image;
         this.$target.addClass("is-loading").append(this.$notice.text(this.opts.loadingNotice)), this.$zoom = i(o).on("error", i.proxy(this._onError, this)).on("load", e, i.proxy(this._onLoad, this)), o.style.position = "absolute", o.src = t
     },  s.prototype.hide = function() {
         this.isOpen && !1 !== this.opts.beforeHide.call(this) && (this.$flyout.detach(), this.isOpen = !1, this.opts.onHide.call(this))
     }, s.prototype.swap = function(t, e, o) {
         this.hide(), this.isReady = !1, this.detachNotice && clearTimeout(this.detachNotice), this.$notice.parent().length && this.$notice.detach(), this.$target.removeClass("is-loading is-ready is-error"), this.$image.attr({
             src: t,
             srcset: i.isArray(o) ? o.join() : o
         }), this.$link.attr(this.opts.linkAttribute, e)
     }, s.prototype.teardown = function() {
         this.hide(), this.$target.off(".easyzoom").removeClass("is-loading is-ready is-error"), this.detachNotice && clearTimeout(this.detachNotice), delete this.$link, delete this.$zoom, delete this.$image, delete this.$notice, delete this.$flyout, delete this.isOpen, delete this.isReady
     }, i.fn.easyZoom = function(e) {
         return this.each(function() {
             var t = i.data(this, "easyZoom");
             t ? void 0 === t.isOpen && t._init() : i.data(this, "easyZoom", new s(this, e))
         })
     }, s
 });
