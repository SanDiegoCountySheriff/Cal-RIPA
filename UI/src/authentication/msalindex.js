import axios from 'axios'
import * as msal from '@azure/msal-browser'
import store from '@/store/index'

export default {
  authContext: null,
  clientId: null,
  accountId: null,

  async initialize() {
    await axios.get('/config.json').then(res => {
      const msalConfig = {
        auth: {
          clientId: res.data.Authentication.ClientId,
          authority: res.data.Authentication.AuthorityUrl,
          redirectUri: window.location.origin,
          postLogoutRedirectUri: window.location.origin,
        },
        cache: {
          cacheLocation: 'localStorage',
        },
        system: {
          loadFrameTimeout: 60000,
        },
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
        modifyBeatId: res.data.Configuration.ModifyBeatId === 'true',
        beatIdNumberOfDigits: res.data.Configuration.BeatIdNumberOfDigits || 0,
      })

      this.clientId = msalConfig.auth.clientId
      this.authContext = new msal.PublicClientApplication(msalConfig)
      return new Promise((resolve, reject) => {
        try {
          this.authContext.loginPopup({ scopes: ['User.ReadWrite'] })
          resolve()
          //   if (window.self !== window.top) {
          //     // redirect to the location specified in the url params.
          //     this.authContext.handleRedirectPromise()
          //   } else {
          //     // try pull the user out of local storage
          //     const user = this.authContext.getAccountByUsername(
          //       'JKELLASH@sdsheriff.com',
          //     )
          //     console.log('User: ', user)
          //     store.dispatch('setUserAccountInfo', user)
          //     if (user !== null) {
          //       localStorage.setItem('ripa_adal_user', JSON.stringify(user))
          //     }
          //     resolve()
          //   }
        } catch (error) {
          localStorage.removeItem('ripa_adal_user')
          reject(error)
        }
      })
    })
  },

  acquireToken() {
    const account = this.authContext.getAllAccounts()[0]

    return new Promise((resolve, reject) => {
      this.authContext.acquireTokenSilent(account, (error, token) => {
        if (error || !token) {
          return reject(error)
        } else {
          return resolve(token)
        }
      })
    })
  },

  acquireTokenRedirect() {
    this.authContext.acquireTokenRedirect()
  },

  isAuthenticated() {
    if (this.authContext.getTokenCache(this.clientId)) {
      return true
    }

    return false
  },

  getUserProfile() {
    return this.authContext.getCachedUser().profile
  },

  signIn() {
    this.authContext.loginPopup()
  },

  signOut() {
    localStorage.removeItem('ripa_adal_user')
    this.authenticationContext.logOutRedirect()
  },
}
