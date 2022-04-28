import store from '@/store'
import Vuex from 'vuex'
import axios from 'axios'
import {
  USER,
  LEGACY_USER,
  DEFAULT_STATE,
} from '../../constants/RipaFormContainerTestConstants'

jest.mock('axios')

describe('Store', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})
  })

  beforeEach(() => {
    store.dispatch('setApiConfig', { apiBaseUrl: '' })
  })

  afterEach(() => {
    store.replaceState(DEFAULT_STATE)
  })

  it('should be a Vuex store', () => {
    expect(store).toBeInstanceOf(Vuex.Store)
  })

  it('should dispatch updateInvalidUser:false on successful user', async () => {
    axios.get.mockResolvedValue({ data: USER })
    await store.dispatch('getUser')

    expect(store.state.user.isInvalid).toBe(false)
  })

  it('should dispatch updateInvalidUser:true on unsuccessful user', async () => {
    axios.get.mockRejectedValue(new Error('error'))
    await store.dispatch('getUser')

    expect(store.state.user.isInvalid).toBe(true)
  })

  it('should dispatch updateInvalidUser:true on user without race', async () => {
    axios.get.mockResolvedValue({ data: LEGACY_USER })
    await store.dispatch('getUser')

    expect(store.state.user.isInvalid).toBe(true)
  })
})
