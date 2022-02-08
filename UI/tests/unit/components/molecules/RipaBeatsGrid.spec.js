import RipaBeatsGrid from '@/components/molecules/RipaBeatsGrid.vue'
import { shallowMount } from '@vue/test-utils'
import Vuetify from 'vuetify'

describe('Ripa Beats Grid', () => {
  let vuetify
  let wrapper
  let beats

  beforeEach(() => {
    vuetify = new Vuetify()
    beats = [
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
    ]
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
      },
    })
  }

  const saveTestCases = [
    {
      editedIndex: -1,
      editedItem: {
        id: 3,
        community: 'community 3',
        command: 'command 3',
        commandAuditGroup: 'audit group 3',
        commandAuditSize: 'audit size 3',
      },
      expected: [
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
        {
          id: 3,
          community: 'community 3',
          command: 'command 3',
          commandAuditGroup: 'audit group 3',
          commandAuditSize: 'audit size 3',
        },
      ],
    },
    {
      editedIndex: 0,
      editedItem: {
        id: 1,
        community: 'community 1 edited',
        command: 'command 1',
        commandAuditGroup: 'audit group 1',
        commandAuditSize: 'audit size 1',
      },
      expected: [
        {
          id: 1,
          community: 'community 1 edited',
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
  ]

  it('should match snapshot', () => {
    wrapper = factory()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('should compute formTitle', () => {
    wrapper = factory({ items: beats })

    expect(wrapper.vm.formTitle).toEqual('New Item')

    wrapper.setData({ editedIndex: 1 })

    expect(wrapper.vm.formTitle).toEqual('Edit Item')
  })

  it('should compute isRowKeyDisabled', () => {
    wrapper = factory({ items: beats })

    expect(wrapper.vm.isRowKeyDisabled).toBeFalsy()

    wrapper.setData({ editedIndex: 1 })

    expect(wrapper.vm.isRowKeyDisabled).toBeTruthy()
  })

  it('should compute isDuplicateKey', () => {
    wrapper = factory({ items: beats })

    expect(wrapper.vm.isDuplicateKey).toBeTruthy()

    wrapper.setData({ editedIndex: 1 })
    wrapper.setData({ editedItem: { id: '1' } })

    expect(wrapper.vm.isDuplicateKey).toBeFalsy()
  })

  it('should edit item', () => {
    wrapper = factory({ items: beats })
    const item = wrapper.vm.items[0]

    wrapper.vm.editItem(item)

    expect(wrapper.vm.editedIndex).toEqual(0)
    expect(wrapper.vm.editedItem).toEqual(item)
    expect(wrapper.vm.dialog).toBeTruthy()
  })

  it('should delete item', () => {
    wrapper = factory({ items: beats })
    const item = wrapper.vm.items[0]

    wrapper.vm.deleteItem(item)

    expect(wrapper.vm.editedIndex).toEqual(0)
    expect(wrapper.vm.editedItem).toEqual(item)
    expect(wrapper.vm.dialogDelete).toBeTruthy()
  })

  it('should delete item confirm', () => {
    wrapper = factory({ items: beats })
    wrapper.vm.closeDelete = jest.fn()
    wrapper.setData({ editedItem: wrapper.vm.items[0] })
    wrapper.setData({ editedIndex: 0 })

    wrapper.vm.deleteItemConfirm()

    expect(wrapper.vm.items).toEqual([
      {
        id: 2,
        community: 'community 2',
        command: 'command 2',
        commandAuditGroup: 'audit group 2',
        commandAuditSize: 'audit size 2',
      },
    ])
    expect(wrapper.vm.onDeleteBeat).toHaveBeenCalledWith({
      id: 1,
      community: 'community 1',
      command: 'command 1',
      commandAuditGroup: 'audit group 1',
      commandAuditSize: 'audit size 1',
    })
    expect(wrapper.vm.closeDelete).toHaveBeenCalledTimes(1)
  })

  it('should close', async () => {
    wrapper = factory({ items: beats })

    wrapper.vm.close()

    expect(wrapper.vm.dialog).toBeFalsy()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.editedItem).toEqual({
      id: '',
      community: '',
      command: '',
      commandAuditGroup: '',
      commandAuditSize: '',
    })
    expect(wrapper.vm.editedIndex).toEqual(-1)
  })

  it('should close delete', async () => {
    wrapper = factory({ items: beats })
    wrapper.vm.closeDelete()

    expect(wrapper.vm.dialogDelete).toBeFalsy()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.editedItem).toEqual({
      id: '',
      community: '',
      command: '',
      commandAuditGroup: '',
      commandAuditSize: '',
    })
    expect(wrapper.vm.editedIndex).toEqual(-1)
  })

  saveTestCases.forEach(test => {
    it(`should save with editedIndex: ${test.editedIndex}`, () => {
      wrapper = factory({ items: beats })
      wrapper.setData({ editedIndex: test.editedIndex })
      wrapper.setData({ editedItem: test.editedItem })

      wrapper.vm.save()

      expect(wrapper.vm.beats).toEqual(test.expected)
    })
  })

  it('should watch items', async () => {
    wrapper = factory({ items: beats })
    wrapper.vm.beats.push({
      id: 3,
      community: 'community 3',
      command: 'command 3',
      commandAuditGroup: 'audit group 3',
      commandAuditSize: 'audit size 3',
    })

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.beats).toEqual([
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
      {
        id: 3,
        community: 'community 3',
        command: 'command 3',
        commandAuditGroup: 'audit group 3',
        commandAuditSize: 'audit size 3',
      },
    ])
  })

  it('should watch dialog', async () => {
    wrapper = factory({ items: beats })
    wrapper.setData({ dialog: null })
    wrapper.vm.close = jest.fn()

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.close).toHaveBeenCalled()
  })

  it('should watch dialogDelete', async () => {
    wrapper = factory({ items: beats })
    wrapper.setData({ dialogDelete: null })
    wrapper.vm.closeDelete = jest.fn()

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.closeDelete).toHaveBeenCalled()
  })
})
