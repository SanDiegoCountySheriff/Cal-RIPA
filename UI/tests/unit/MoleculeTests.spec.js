import { mount } from '@vue/test-utils'
import RipaStopDate from './../../src/components/molecules/RipaStopDate.vue'
import RipaModelMixin from './../../src/components/mixins/RipaModelMixin.vue'

describe('Ripa Stop Date tests', () => {

  it('should match snapshot', () => {
    const wrapper = mount(RipaStopDate, {
      propsData: {
        adminEditing: true,
      },
      mixins: [RipaModelMixin],
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
