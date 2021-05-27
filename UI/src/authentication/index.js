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
        cacheLocation: 'localStorage',
      }
      store.dispatch('setApiConfig', {
        apiBaseUrl: res.data.Configuration.ServicesBaseUrl,
        apiSubscription: res.data.Configuration.Subscription,
        defaultCounty: res.data.Configuration.DefaultCounty,
        displayBeatInput: res.data.Configuration.DisplayBeatsInput === 'true',
        environmentName: res.data.Configuration.Environment,
        displayEnvironment: res.data.Configuration.Environment !== 'p',
      })
      this.clientId = config.clientId
      this.authenticationContext = new AuthenticationContext(config)

      return new Promise((resolve, reject) => {
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
          console.log(user)
          if (user) {
            resolve()
          } else {
            // no user at all - go sign in.
            this.signIn()
          }
        }
      })
    })
  },

  bearerToken() {
    const token = localStorage.getItem(`adal.access.token.key${this.clientId}`)
    return token || ''
  },

  acquireToken() {
    return new Promise((resolve, reject) => {
      this.authenticationContext.acquireToken(
        '<azure active directory resource id>',
        (error, token) => {
          if (error || !token) {
            return reject(error)
          } else {
            return resolve(token)
          }
        },
      )
    })
  },

  acquireTokenRedirect() {
    this.authenticationContext.acquireTokenRedirect(
      '<azure active directory resource id>',
    )
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
    this.authenticationContext.logOut()
  },
}
