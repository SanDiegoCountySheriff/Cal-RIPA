import { mount } from '@vue/test-utils'
import RipaStopDate from './../../src/components/molecules/RipaStopDate.vue'
import RipaModelMixin from './../../src/components/mixins/RipaModelMixin.vue'
import { defaultStop } from './../../src/utilities/stop.js'
import Vuetify from 'vuetify'

describe('Ripa Stop Date', () => {
  let vuetify
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  it('should match snapshot', () => {
    const wrapper = mount(RipaStopDate, {
      vuetify,
      propsData: {
        value: stop,
      },
      mixins: [RipaModelMixin],
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
