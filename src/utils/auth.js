import Cookies from 'js-cookie'

const TokenKey = 'session';

const Account = 'token';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getAccount() {
  return Cookies.get(Account)
}

export function setAccount(account) {
  return Cookies.set(Account, account)
}

export function removeAccount() {
  return Cookies.remove(Account)
}
