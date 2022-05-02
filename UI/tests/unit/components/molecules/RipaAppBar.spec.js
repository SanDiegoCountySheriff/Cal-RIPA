import RipaAppBar from '@/components/molecules/RipaAppBar'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa App Bar', () => {
  jest.useFakeTimers()
  let vuetify
  let wrapper
  const { window } = global

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  afterAll(() => {
    global.window = window
  })

  const factory = propsData => {
    return shallowMount(RipaAppBar, {
      vuetify,
      propsData: {
        ...propsData,
        onUpdateDark: jest.fn(),
        onUpdateUser: jest.fn(),
        onViewStopsWithErrors: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaAppBar, {
      vuetify,
      propsData: {
        onUpdateDark: jest.fn(),
        onUpdateUser: jest.fn(),
        onViewStopsWithErrors: jest.fn(),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should get theme icon', () => {
    wrapper = factory()

    expect(wrapper.vm.getThemeIcon).toEqual('mdi-moon-first-quarter')
    wrapper.vm.$vuetify.theme.dark = true
    expect(wrapper.vm.getThemeIcon).toEqual('mdi-white-balance-sunny')
  })

  it('should get theme tooltip', () => {
    wrapper = factory()

    expect(wrapper.vm.getThemeTooltip).toEqual('View dark mode')
    wrapper.vm.$vuetify.theme.dark = true
    expect(wrapper.vm.getThemeTooltip).toEqual('View light mode')
  })

  it('should get app title', async () => {
    wrapper = factory()

    expect(wrapper.vm.getAppTitle).toEqual('RIPA')

    wrapper.setProps({ environmentName: 'QA' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getAppTitle).toEqual('RIPA (QA)')
    wrapper.setProps({ environmentName: 'DEV' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getAppTitle).toEqual('RIPA (DEV)')
  })

  it('should get admin', async () => {
    wrapper = factory()

    wrapper.setProps({ admin: false })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.getAdmin).toBeFalsy()

    wrapper.setProps({ admin: true })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.getAdmin).toBeTruthy()
  })

  it('should get online icon', async () => {
    wrapper = factory()

    expect(wrapper.vm.getOnlineIcon).toEqual('mdi-wifi-strength-off')
    wrapper.setProps({ online: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getOnlineIcon).toEqual('mdi-wifi')
  })

  it('should get app bar background class', async () => {
    wrapper = factory()

    wrapper.setProps({ environmentName: '' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getAppBarBackgroundClass).toEqual('')

    wrapper.setProps({ environmentName: 'DEV' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual(
      'ripa-app-bar--dev-light',
    )

    wrapper.vm.$vuetify.theme.dark = true
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual(
      'ripa-app-bar--dev-dark',
    )

    wrapper.setProps({ environmentName: 'QA' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.getAppBarBackgroundClass).toEqual('ripa-app-bar--qa-dark')

    wrapper.vm.$vuetify.theme.dark = false
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual(
      'ripa-app-bar--qa-light',
    )
  })

  it('should handle view stops with errors', () => {
    wrapper = factory()

    wrapper.vm.handleViewStopsWithErrors()

    expect(wrapper.vm.onViewStopsWithErrors).toHaveBeenCalled()
  })

  it('should handle theme change', () => {
    wrapper = factory()

    wrapper.vm.handleThemeChange()

    expect(wrapper.vm.$vuetify.theme.dark).toBeTruthy()
    expect(wrapper.vm.onUpdateDark).toHaveBeenCalledTimes(1)

    wrapper.vm.handleThemeChange()

    expect(wrapper.vm.$vuetify.theme.dark).toBeFalsy()
    expect(wrapper.vm.onUpdateDark).toHaveBeenCalledTimes(2)
  })

  it('should handle auth', async () => {
    wrapper = factory()

    wrapper.vm.handleLogIn = jest.fn()
    wrapper.vm.handleLogOut = jest.fn()
    wrapper.vm.handleAuth()

    expect(wrapper.vm.handleLogIn).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.handleLogOut).toHaveBeenCalledTimes(0)

    wrapper.setProps({ authenticated: true })
    await wrapper.vm.$nextTick()
    wrapper.vm.handleAuth()

    expect(wrapper.vm.handleLogIn).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.handleLogOut).toHaveBeenCalledTimes(1)
  })

  it('should handle logout', () => {
    wrapper = factory()

    wrapper.vm.handleLogOut()

    expect(wrapper.emitted('handleLogOut')).toBeTruthy()
  })

  it('should handle login', () => {
    wrapper = factory()

    wrapper.vm.handleLogIn()

    expect(wrapper.emitted('handleLogIn')).toBeTruthy()
  })

  it('should handle user change', () => {
    wrapper = factory()

    wrapper.vm.handleUserChange()

    expect(wrapper.vm.onUpdateUser).toHaveBeenCalledTimes(1)
  })

  it('should handle shrink', () => {
    wrapper = factory()

    wrapper.vm.handleShrink()
    jest.advanceTimersByTime(3000)

    expect(wrapper.vm.expandButton).toBeFalsy()
    expect(wrapper.vm.buttonText).toEqual('!')
  })

  it('should watch stops with errors', async () => {
    wrapper = factory()
    const handleShrink = jest.spyOn(wrapper.vm, 'handleShrink')

    wrapper.setProps({ stopsWithErrors: [1, 2] })
    await wrapper.vm.$nextTick()

    expect(handleShrink).toHaveBeenCalledTimes(1)
  })

  it('should watch stops with errors empty array', async () => {
    wrapper = factory()
    const handleShrink = jest.spyOn(wrapper.vm, 'handleShrink')

    wrapper.setProps({ stopsWithErrors: [] })
    await wrapper.vm.$nextTick()

    expect(handleShrink).toHaveBeenCalledTimes(0)
  })

  it('should handle before destroy', () => {
    wrapper = factory()

    delete global.window
    const removeEventListener = jest.spyOn(window, 'removeEventListener')

    wrapper.destroy()

    expect(removeEventListener).toHaveBeenCalledTimes(0)
  })
})
