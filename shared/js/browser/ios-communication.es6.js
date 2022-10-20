/**
 * @module iOS integration
 *
 * @description
 * iOS shares the majority of functionality from {@link "macOS integration"}, with the exception
 * of the webkit handlers listed below.
 *
 * **Incoming data**
 *
 * Please see the links under the heading 'macOS -> JavaScript Interface' from {@link "macOS integration"}
 *
 * Examples from the macOS integration:
 * - {@link "macOS integration".onChangeProtectionStatus}
 * - {@link "macOS integration".onChangeRequestData}
 * - {@link "macOS integration".onChangeLocale}
 *
 * **Outgoing messages**
 *
 * Although iOS uses the outgoing messages from the {@link "macOS integration"} - there are some that are iOS-only,
 * those are listed below under `"Webkit Message Handlers"`
 *
 * @category integrations
 */
import { setupColorScheme } from './common.es6'
import {
    fetch as macosFetch,
    backgroundMessage,
    getBackgroundTabData
} from './macos-communication.es6'

const setColorScheme = setupColorScheme()
window.onChangeTheme = function (themeName) {
    setColorScheme(themeName)
}

window.history.replaceState({}, '', window.location.href)

/**
 * Close the Dashboard.
 * @category Webkit Message Handlers
 * @param {{}} args - An empty object to keep the `webkit` message handlers happy
 * @example
 * ```js
 * window.webkit.messageHandlers.privacyDashboardClose.postMessage(args)
 * ```
 */
export function privacyDashboardClose (args) {
    window.webkit.messageHandlers.privacyDashboardClose.postMessage(args)
}

/**
 * On iOS, the breakage report form is handled natively - so all the dashboard needs
 * to do in this situation is ping the correct message to the backend.
 *
 * @category Webkit Message Handlers
 * @param {{}} args - An empty object to keep the `webkit` message handlers happy
 * @example
 * ```js
 * window.webkit.messageHandlers.privacyDashboardShowReportBrokenSite.postMessage(args)
 * ```
 */
export function privacyDashboardShowReportBrokenSite (args) {
    window.webkit.messageHandlers.privacyDashboardShowReportBrokenSite.postMessage(args)
}

/**
 * @category Internal API
 * @param message
 * @returns {boolean|undefined}
 */
const fetch = (message) => {
    if (!window.webkit) {
        console.error('window.webkit not available')
        return
    }

    if (message.closePrivacyDashboard) {
        privacyDashboardClose({})
        return
    }

    if (message.checkBrokenSiteReportHandled) {
        privacyDashboardShowReportBrokenSite({})
        return true // Return true to prevent HTML form from showing
    }

    macosFetch(message)
}

export {
    backgroundMessage,
    getBackgroundTabData,
    fetch
}
