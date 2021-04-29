import { PublicClientApplication } from '@azure/msal-browser'

export const doSignIn = async () => {
  await this.$msalInstance
    .loginPopup({})
    .then(() => {
      const myAccounts = this.$msalInstance.getAllAccounts()
      this.account = myAccounts[0]
      this.$emitter.emit('login', this.account)
    })
    .catch(error => {
      console.error(`error during authentication: ${error}`)
    })
}
