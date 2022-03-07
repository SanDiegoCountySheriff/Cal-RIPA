import axios from 'axios'
import * as msal from '@azure/msal-browser'
import store from '@/store/index'

export default {
  authContext: null,

  async initialize() {
    await axios.get('/config.json').then(async res => {
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
      this.authContext = new msal.PublicClientApplication(msalConfig)

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

      return new Promise((resolve, reject) => {
        try {
          this.authContext.handleRedirectPromise().then(() => {
            const accounts = this.authContext.getAllAccounts()

            if (accounts.length > 0) {
              this.authContext.setActiveAccount(accounts[0])
              store.dispatch('setUserAccountInfo', accounts[0])
            }

            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    })
  },

  async acquireToken() {
    const token = await this.authContext.acquireTokenSilent(
      this.authContext.getActiveAccount(),
    )
    return token.idToken
  },

  isAuthenticated() {
    const account = this.authContext.getActiveAccount()
    if (!account) {
      return false
    }
    return new Date(account.idTokenClaims.exp * 1000) > Date.now()
  },

  signIn() {
    this.authContext.loginRedirect()
  },

  signOut() {
    this.authContext.logoutRedirect()
  },
}
