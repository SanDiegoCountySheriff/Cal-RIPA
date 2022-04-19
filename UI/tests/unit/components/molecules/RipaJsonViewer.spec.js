import RipaJsonViewer from '@/components/molecules/RipaJsonViewer.vue'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa JSON Viewer', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaJsonViewer, {
      vuetify,
      propsData: {
        ...propsData,
      },
      components: {
        VueJsonPretty: () => import('../../../../node_modules/vue-json-pretty'),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaJsonViewer, {
      vuetify,
      components: {
        VueJsonPretty: () => import('../../../../node_modules/vue-json-pretty'),
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })
})
