import axios from 'axios'
import * as msal from '@azure/msal-browser'
import store from '@/store/index'
import router from '../router'

let authConfig = {
  cache: {
    cacheLocation: 'localStorage',
  },
  mode: 'redirect',
}

let msalInstance

const AuthService = {
  tryLogin: async () => {
    if (!sessionStorage.getItem('ripa-idToken')) {
      const authConfig = await getAuthConfig()
      // if auth config gets set, try login
      if (authConfig) {
        await msalInstance.handleRedirectPromise()
        const currentAccount = await msalInstance.getAllAccounts()
        if (currentAccount.length) {
          // check to see if user is not in any groups.  If not, redirect
          if (currentAccount[0].idTokenClaims.roles.length === 0) {
            store.dispatch('setInvalidUser', true)
            // redirect to home page
            router.push('/checkUser')
          }
          const accessToken = await msalInstance.acquireTokenSilent({
            account: currentAccount[0],
            scopes: ['user.read'],
          })
          store.dispatch('setUserAccountInfo', currentAccount[0])
          sessionStorage.setItem('ripa-idToken', accessToken.idToken)
          return true
        } else {
          msalInstance.loginRedirect()
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
  getApiConfig: () => {
    return axios.get('/config.json')
  },
  getIsAuthenticated: async () => {
    if(sessionStorage.getItem('ripa-idToken')) {
        const accounts = await msalInstance.getAllAccounts()
        return accounts.length > 0
    }
    return false
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
      store.dispatch('setApiConfig', {
        apiBaseUrl: res.data.Configuration.ServicesBaseUrl,
        apiSubscription: res.data.Configuration.Subscription,
      })
      return true
    })
    .catch(err => {
      if (err) {
        store.dispatch('setAuthConfig', false)
        store.dispatch('setApiConfig', null)
        return false
      }
    })
  return loadConfig
}

export default AuthService
