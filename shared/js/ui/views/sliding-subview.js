import $ from 'jquery'
import { isAndroid, isIOS } from '../environment-check.js'
import Parent from '../base/view.js'
import { setupMaterialDesignRipple } from './utils/utils.js'

function SlidingSubview(ops) {
    ops.appendTo = $('.sliding-subview--root')
    Parent.call(this, ops)

    this.$root = $('.sliding-subview--root')
    this.$root.addClass('sliding-subview--open')

    // @ts-ignore
    this.setupNavigationSupport()
    // @ts-ignore
    this.setupClose()
}

SlidingSubview.prototype = $.extend({}, Parent.prototype, {
    setupClose: function () {
        this._cacheElems('.js-sliding-subview', ['close', 'done'])
        this.bindEvents([
            [this.$close, 'click', this._destroy],
            [this.$done, 'click', this._done],
        ])

        // Set up Material design features on Android
        if (isAndroid()) {
            setupMaterialDesignRipple(this.$parent[0], '.link-action')
        }
    },

    setupNavigationSupport: function () {
        // @ts-ignore
        const url = new URL(window.location)
        url.searchParams.set('open', 'true')
        window.history.pushState({}, '', url)

        if (this.popstateHandler) {
            window.removeEventListener('popstate', this.popstateHandler)
        }
        this.popstateHandler = (e) => {
            // @ts-ignore
            this._destroy(null, { fromNavigation: true })
        }
        window.addEventListener('popstate', this.popstateHandler)
    },

    _destroy: function (e, opts = {}) {
        if (this.popstateHandler) {
            window.removeEventListener('popstate', this.popstateHandler)
        }

        // @ts-ignore
        const url = new URL(window.location)
        url.searchParams.delete('open')
        window.history.replaceState({}, '', url)

        if (opts.fromNavigation && isIOS()) {
            // Don't animate out if we've navigated back to the root screen
            this.$root.addClass('sliding-subview--immediate')
            window.setTimeout(() => {
                this.$root.removeClass('sliding-subview--open')
                this.destroy()
                // @ts-ignore
                window.history.replaceState({}, '', window.location)
                window.setTimeout(() => {
                    this.$root.removeClass('sliding-subview--immediate')
                }, 1)
            }, 1)
            return
        }

        this.$root.removeClass('sliding-subview--open')
        const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches === true
        if (isReduced) {
            this.destroy()
            // @ts-ignore
            window.history.replaceState({}, '', window.location)
        } else {
            window.setTimeout(() => {
                this.destroy()
                // @ts-ignore
                window.history.replaceState({}, '', window.location)
            }, 325) // 325ms = 0.3s in .sliding-subview--root transition + 25ms padding
        }
    },

    _done: function () {
        this.model.site.close()
    },
})

export default SlidingSubview
