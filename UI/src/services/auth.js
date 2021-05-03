import axios from 'axios'
import * as msal from '@azure/msal-browser'

let authConfig = {
  cache: {
    cacheLocation: 'localStorage',
  },
  mode: 'redirect',
}

let msalInstance

const AuthService = {
  getAuthConfig: async () => {
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
        return true
      })
      .catch(err => {
        if (err) {
          return false
        }
      })
    return loadConfig
  },
  tryLogin: async () => {
    await msalInstance.handleRedirectPromise()
    const accounts = msalInstance.getAllAccounts()
    console.log(accounts)
    if (accounts.length === 0) {
      // No user signed in
      msalInstance.loginRedirect()
    } else {
      // if user is signed in, get account info
      // go to home page
      return accounts[0]
    }
  },
}

export default AuthService
