import axios from 'axios'
import AuthenticationContext from 'adal-angular/lib/adal.js'
import store from '@/store/index'

export default {
  authenticationContext: null,
  clientId: null,

  async initialize() {
    await axios.get('/config.json').then(res => {
      const config = {
        tenant: res.data.Authentication.TenantId,
        clientId: res.data.Authentication.ClientId,
        postLogoutRedirectUri: window.location.origin,
        redirectUri: window.location.origin,
        cacheLocation: 'localStorage',
        loadFrameTimeout: 60000,
      }

      const environmentName = res.data.Configuration?.Environment || 'DEV'

      store.dispatch('setApiConfig', {
        apiBaseUrl: res.data.Configuration.ServicesBaseUrl,
        apiSubscription: res.data.Configuration.Subscription,
        defaultCounty: res.data.Configuration.DefaultCounty,
        displayBeatInput: res.data.Configuration.DisplayBeatsInput === 'true',
        displayDebugger: res.data.Configuration.DisplayDebugger === 'true',
        agencyQuestions: res.data.AgencyQuestions || [],
        environmentName: environmentName.toUpperCase(),
        useOfficerUpn: res.data.Configuration.UseOfficerUpn === 'true',
      })

      this.clientId = config.clientId
      this.authenticationContext = new AuthenticationContext(config)

      return new Promise((resolve, reject) => {
        try {
          if (
            this.authenticationContext.isCallback(window.location.hash) ||
            window.self !== window.top
          ) {
            // redirect to the location specified in the url params.
            this.authenticationContext.handleWindowCallback()
          } else {
            // try pull the user out of local storage
            const user = this.authenticationContext.getCachedUser()
            store.dispatch('setUserAccountInfo', user)
            if (user !== null) {
              localStorage.setItem('ripa_adal_user', JSON.stringify(user))
            }
            resolve()
          }
        } catch (error) {
          localStorage.removeItem('ripa_adal_user')
          reject(error)
        }
      })
    })
  },

  acquireToken() {
    return new Promise((resolve, reject) => {
      this.authenticationContext.acquireToken(this.clientId, (error, token) => {
        if (error || !token) {
          return reject(error)
        } else {
          return resolve(token)
        }
      })
    })
  },

  acquireTokenRedirect() {
    this.authenticationContext.acquireTokenRedirect(this.clientId)
  },

  isAuthenticated() {
    // getCachedToken will only return a valid, non-expired token.
    if (this.authenticationContext.getCachedToken(this.clientId)) {
      return true
    }

    return false
  },

  getUserProfile() {
    return this.authenticationContext.getCachedUser().profile
  },

  signIn() {
    this.authenticationContext.login()
  },

  signOut() {
    localStorage.removeItem('ripa_adal_user')
    this.authenticationContext.logOut()
  },
}
