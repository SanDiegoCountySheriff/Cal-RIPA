import RipaNonForceActionsTaken from '@/components/molecules/RipaNonForceActionsTaken'
import { defaultStop } from '@/utilities/stop.js'
import { shallowMount, mount } from '@vue/test-utils'
import Vuetify from 'vuetify'
import { computed } from 'vue'

describe('Ripa Non Force Actions Taken', () => {
  let vuetify
  let wrapper
  let stop

  beforeEach(() => {
    vuetify = new Vuetify()
    stop = defaultStop()
  })

  const factory = propsData => {
    return shallowMount(RipaNonForceActionsTaken, {
      vuetify,
      propsData: {
        ...propsData,
      },
      provide: {
        loadingPiiStep4: computed(() => false),
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = mount(RipaNonForceActionsTaken, {
      vuetify,
      propsData: { value: stop },
      provide: {
        loadingPiiStep4() {
          return false
        },
      },
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should filter search of person was conducted when selecting terry v. ohio frisk', () => {
    stop.nonForceActionsTaken.nonForceActionsTakenDuringStop = [16]
    wrapper = factory({ value: stop })

    const result = wrapper.vm.getNonForceActionsTakenSearchItems

    expect(result.includes(14)).toBeFalsy()
  })

  it('should filter terry v. ohio frisk if search of person was conducted', () => {
    stop.nonForceActionsTaken.nonForceActionsTakenDuringStop = [14]
    wrapper = factory({ value: stop })

    const result = wrapper.vm.getNonForceActionsTakenGeneralItems

    expect(result.includes(16)).toBeFalsy()
  })
})
