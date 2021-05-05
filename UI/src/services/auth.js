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
        msalInstance.handleRedirectPromise().then(response => {
          // once you have the auth config, redirect to login
          const currentAccount = msalInstance.getAllAccounts()
          if (!currentAccount.length) {
            // error during authentication or couldn't find you
            // need to handle this
          }
          store.dispatch('setUserAccountInfo', response)
          sessionStorage.setItem('ripa-accessToken', response.accessToken)
          return true
        })
        msalInstance.loginRedirect()
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
