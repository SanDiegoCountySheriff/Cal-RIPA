import axios from 'axios'
import * as msal from '@azure/msal-browser'
import store from '@/store/index'

let authConfig = {
  cache: {
    cacheLocation: 'localStorage',
  },
  mode: 'redirect',
}

let msalInstance

const AuthService = {
  tryLogin: async () => {
    if (!sessionStorage.getItem('ripa-accessToken')) {
      const authConfig = await getAuthConfig()
      // if auth config gets set, try login
      if (authConfig) {
        await msalInstance.handleRedirectPromise()

        msalInstance.loginRedirect()

        const currentAccount = await msalInstance.getAllAccounts()

        if (currentAccount.length) {
          store.dispatch('setUserAccountInfo', currentAccount[0])
          sessionStorage.setItem(
            'ripa-accessToken',
            currentAccount[0].accessToken,
          )
          return true
        }
      } else {
        // if there is an error getting auth config, go into offline mode
        // since we cannot authenticate the user
        return false
      }
    } else {
      // user is already logged in
      return true
    }
  },
}

const getAuthConfig = async () => {
  const loadConfig = await axios
    .get('/config.json')
    .then(res => {
      authConfig = {
        ...authConfig,
        auth: {
          tenant: res.data.Authentication.TenantId,
          clientId: res.data.Authentication.ClientId,
          authority: res.data.Authentication.AuthorityUrl,
        },
      }
      msalInstance = new msal.PublicClientApplication(authConfig)
      store.dispatch('setAuthConfig', true)
      return true
    })
    .catch(err => {
      if (err) {
        store.dispatch('setAuthConfig', false)
        return false
      }
    })
  return loadConfig
}

export default AuthService
