import RipaBeatsGrid from '@/components/molecules/RipaBeatsGrid.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Beats Grid', () => {
  let vuetify
  let wrapper

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  afterEach(() => {
    wrapper.destroy()
  })

  const factory = propsData => {
    return shallowMount(RipaBeatsGrid, {
      vuetify,
      propsData: {
        ...propsData,
        onEditBeat: jest.fn(),
        onDeleteBeat: jest.fn(),
        items: [
          {
            id: 1,
            community: 'community 1',
            command: 'command 1',
            commandAuditGroup: 'audit group 1',
            commandAuditSize: 'audit size 1',
          },
          {
            id: 2,
            community: 'community 2',
            command: 'command 2',
            commandAuditGroup: 'audit group 2',
            commandAuditSize: 'audit size 2',
          },
        ],
      },
    })
  }

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  it.todo('should compute formTitle')

  it.todo('should compute isRowKeyDisabled')

  it.todo('should compute isDuplicateKey')

  it.todo('should edit item')

  it.todo('should delete item')

  it.todo('should close')

  it.todo('should close delete')

  it.todo('should save')

  it.todo('should watch items')

  it.todo('should watch dialog')

  it.todo('should watch dialogDelete')
})
