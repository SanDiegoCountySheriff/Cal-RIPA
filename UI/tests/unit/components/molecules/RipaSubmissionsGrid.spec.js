import RipaSubmissionsGrid from '@/components/molecules/RipaSubmissionsGrid.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

const localVue = createLocalVue()
localVue.use(VueRouter)

describe('Ripa Submissions Grid', () => {
  let vuetify
  let wrapper
  const routes = []
  const router = new VueRouter({ routes })

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaSubmissionsGrid, {
      localVue,
      router,
      vuetify,
      propsData: {
        ...propsData,
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory({ savedFilters: {} })

    expect(wrapper.element).toMatchSnapshot()
  })

  it.todo('should get submissions')

  it.todo('should get pagination length')

  it.todo('should calculate items to')

  it.todo('should calculate items from')

  it.todo('should get filter status')

  it.todo('should init')

  it.todo('should handle go to submission')

  it.todo('should handle update items per page')

  it.todo('should handle submission detail items per page')

  it.todo('should handle next page')

  it.todo('should handle previous page')

  it.todo('should handle jump to page')

  it.todo('should handle submission detail paginate')

  it.todo('should method submission from date change')

  it.todo('should method submission to date change')

  it.todo('should handle filter')

  it.todo('should get column sort name')

  it.todo('should watch items')

  it.todo('should watch current submission')

  it.todo('should watch sortDesc')
})
