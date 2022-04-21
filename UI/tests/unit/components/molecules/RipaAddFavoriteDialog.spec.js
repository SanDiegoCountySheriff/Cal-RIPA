import RipaAddFavoriteDialog from '@/components/molecules/RipaAddFavoriteDialog'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Add Favorite Dialog', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const factory = propsData => {
    return shallowMount(RipaAddFavoriteDialog, {
      vuetify,
      propsData: {
        ...propsData,
        onAddFavorite: jest.fn(),
        onClose: jest.fn(),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaAddFavoriteDialog, {
      vuetify,
      propsData: { onAddFavorite: jest.fn(), onClose: jest.fn() },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should set model', async () => {
    wrapper = factory()
    wrapper.vm.model = true
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toEqual(true)
    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(0)

    wrapper.vm.model = null

    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)
  })

  it('should get saved disabled', () => {
    wrapper = factory()

    expect(wrapper.vm.getSaveDisabled).toBeTruthy()
    wrapper.vm.favoriteName = 'Test'

    expect(wrapper.vm.getSaveDisabled).toBeFalsy()
  })

  it('should handle close', () => {
    wrapper = factory()

    wrapper.vm.handleClose()

    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)
  })

  it('should handle save', () => {
    wrapper = factory()

    wrapper.vm.handleSave()

    expect(wrapper.vm.onAddFavorite).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.onClose).toHaveBeenCalledTimes(1)
  })

  it('should watch show dialog', async () => {
    wrapper = factory()

    wrapper.setProps({ showDialog: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.viewModel).toBeTruthy()
  })
})
