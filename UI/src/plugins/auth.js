import Vue from 'vue'
import axios from 'axios'
import * as msal from '@azure/msal-browser'

const msalConfig = {
  cache: {
    cacheLocation: 'localStorage',
  },
  mode: 'redirect',
}


async getAuthConfig() {
  return axios.get('/config.json').then(res => {
    console.log(res.data)
    msalConfig.auth = {
      tenant: res.data.Authentication.TenantId,
      clientId: res.data.Authentication.ClientId,
      authority: res.data.Authentication.AuthorityUrl,
    }
  
    msalInstance = new msal.PublicClientApplication(msalConfig)
  })
}


export default authService
