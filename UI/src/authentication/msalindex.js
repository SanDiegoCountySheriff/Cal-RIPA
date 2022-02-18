import axios from 'axios'
import * as msal from '@azure/msal-browser'
import store from '@/store/index'

export default {
  authContext: null,
  accountId: null,
  localAccountId: null,
  aud: null,
  tenantId: null,

  async initialize() {
    console.log('initializing authentication')
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
      this.tenantId = res.data.Authentication.TenantId
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
            const account = this.authContext.getAllAccounts()[0]
            if (account !== undefined) {
              console.log('attempting to save user account info')
              this.localAccountId = account.localAccountId
              this.aud = account.idTokenClaims.aud
              this.authContext.setActiveAccount(account)

              store.dispatch('setUserAccountInfo', account)
              localStorage.setItem('ripa_msal_user', JSON.stringify(account))
            }
            resolve()
          })
        } catch (error) {
          localStorage.removeItem('ripa_msal_user')
          reject(error)
        }
      })
    })
  },

  acquireToken() {
    console.log('acquiring the token')
    const tokenStorageString = `${this.localAccountId}.${this.tenantId}-login.windows.net-idtoken-${this.aud}-${this.tenantId}---`
    const tokenCache = this.authContext.getTokenCache()
    if (tokenCache.storage.browserStorage.windowStorage[tokenStorageString]) {
      return JSON.parse(
        tokenCache.storage.browserStorage.windowStorage[tokenStorageString],
      ).secret
    }
  },

  isAuthenticated(location) {
    const tokenStorageString = `${this.localAccountId}.${this.tenantId}-login.windows.net-idtoken-${this.aud}-${this.tenantId}---`
    console.log('checking is authenticated from: ', location)
    const tokenCache = this.authContext.getTokenCache()
    const tokenString =
      tokenCache.storage.browserStorage.windowStorage[tokenStorageString]

    return (
      tokenString !== undefined &&
      JSON.parse(
        tokenCache.storage.browserStorage.windowStorage[tokenStorageString],
      ).secret !== null
    )
  },

  signIn() {
    console.log('signing in')
    this.authContext.loginRedirect()
  },

  signOut() {
    localStorage.removeItem('ripa_msal_user')
    this.authContext.logOutRedirect()
  },
}
