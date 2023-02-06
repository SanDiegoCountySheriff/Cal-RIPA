import RipaAppBar from '@/components/molecules/RipaAppBar'
import { shallowMount, mount } from '@vue/test-utils'
import { computed } from 'vue'
import Vuetify from 'vuetify'

describe('Ripa App Bar', () => {
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

  const factory = (propsData, provideData) => {
    return shallowMount(RipaAppBar, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        admin: computed(() => provideData?.admin ?? false),
        authenticated: computed(() => provideData?.authenticated ?? true),
        dark: computed(() => provideData?.dark ?? false),
        environmentName: computed(() => provideData?.environmentName ?? ''),
        invalidUser: computed(() => provideData?.invalidUser ?? false),
        online: computed(() => provideData?.online ?? true),
        isApiUnavailable: computed(
          () => provideData?.isApiUnavailable ?? false,
        ),
      },
      stubs: ['router-link'],
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaAppBar, {
      vuetify,
      provide: {
        admin: computed(() => false),
        authenticated: computed(() => true),
        dark: computed(() => false),
        environmentName: computed(() => ''),
        invalidUser: computed(() => false),
        online: computed(() => true),
        isApiUnavailable: computed(() => false),
      },
      stubs: ['router-link'],
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
    wrapper.destroy()

    wrapper = factory({}, { environmentName: 'QA' })
    expect(wrapper.vm.getAppTitle).toEqual('RIPA (QA)')
    wrapper.destroy()

    wrapper = factory({}, { environmentName: 'DEV' })
    expect(wrapper.vm.getAppTitle).toEqual('RIPA (DEV)')
  })

  it('should get admin', async () => {
    wrapper = factory()
    expect(wrapper.vm.getAdmin).toBeFalsy()
    wrapper.destroy()

    wrapper = factory({}, { admin: true })
    expect(wrapper.vm.getAdmin).toBeTruthy()
  })

  it('should get online icon', async () => {
    wrapper = factory({}, { online: false })
    expect(wrapper.vm.getOnlineIcon).toEqual('mdi-wifi-strength-off')
    wrapper.destroy()

    wrapper = factory({}, { online: true })
    expect(wrapper.vm.getOnlineIcon).toEqual('mdi-wifi')
  })

  it('should get app bar background class', async () => {
    wrapper = factory()
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual('')
    wrapper.destroy()

    wrapper = factory({}, { environmentName: 'DEV' })
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual(
      'ripa-app-bar--dev-light',
    )
    wrapper.vm.$vuetify.theme.dark = true
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual(
      'ripa-app-bar--dev-dark',
    )
    wrapper.destroy()

    wrapper = factory({}, { environmentName: 'QA' })
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual(
      'ripa-app-bar--qa-light',
    )
    wrapper.vm.$vuetify.theme.dark = true
    expect(wrapper.vm.getAppBarBackgroundClass).toEqual('ripa-app-bar--qa-dark')
  })

  it('should handle view stops with errors', () => {
    wrapper = factory()

    wrapper.vm.handleViewStopsWithErrors()

    expect(wrapper.emitted('on-view-stops-with-errors')).toBeTruthy()
  })

  it('should handle theme change', () => {
    wrapper = factory()

    wrapper.vm.handleThemeChange()

    expect(wrapper.vm.$vuetify.theme.dark).toBeTruthy()
    expect(wrapper.emitted('on-update-dark')).toBeTruthy()
    expect(wrapper.emitted('on-update-dark').length).toEqual(1)

    wrapper.vm.handleThemeChange()

    expect(wrapper.vm.$vuetify.theme.dark).toBeFalsy()
    expect(wrapper.emitted('on-update-dark').length).toEqual(2)
  })

  it('should handle auth', async () => {
    wrapper = factory({}, { authenticated: false })

    wrapper.vm.handleLogIn = jest.fn()
    wrapper.vm.handleLogOut = jest.fn()
    wrapper.vm.handleAuth()

    expect(wrapper.vm.handleLogIn).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.handleLogOut).toHaveBeenCalledTimes(0)

    wrapper.destroy()

    wrapper = factory({}, { authenticated: true })

    wrapper.vm.handleLogIn = jest.fn()
    wrapper.vm.handleLogOut = jest.fn()
    wrapper.vm.handleAuth()

    expect(wrapper.vm.handleLogIn).toHaveBeenCalledTimes(0)
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

    expect(wrapper.emitted('on-update-user')).toBeTruthy()
  })

  it('should handle before destroy', () => {
    wrapper = factory()

    delete global.window
    const removeEventListener = jest.spyOn(window, 'removeEventListener')

    wrapper.destroy()

    expect(removeEventListener).toHaveBeenCalledTimes(0)
  })
})
