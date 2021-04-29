import Vue from 'vue'
import axios from 'axios'
import { default as msalPlugin } from 'msal-browser'

const getAuthConfig = axios.get('/config.json').then(res => {
  return {
    tenant: res.Authentication.TenantId,
    clientId: res.Authentication.ClientId,
    authority: res.Authentication.AuthorityUrl,
  }
})

const msalConfig = {
  auth: {
    tenant: getAuthConfig.tenant,
    clientId: getAuthConfig.clientId,
    authority: getAuthConfig.authority,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  mode: 'redirect',
}

Vue.use(msalPlugin, msalConfig)
