// import { createLocalVue, mount } from '@vue/test-utils'
// import RipaLabel from './../../src/components/atoms/RipaLabel.vue'
// import RipaAlert from './../../src/components/atoms/RipaAlert.vue'
// import RipaSelect from './../../src/components/atoms/RipaSelect.vue'
// import Vue from 'vue'
// import Vuetify from 'vuetify'

// Vue.use(Vuetify)

// describe('Ripa Label Tests', () => {
//   it('should have a bold label', async () => {
//     const wrapper = mount(RipaLabel, {
//       propsData: {
//         value: 'Label',
//         bold: true,
//       },
//     })

//     const div = wrapper.find('div')
//     const span = wrapper.find('span')

//     expect(div.classes().includes('tw-font-bold')).toBe(true)
//     expect(wrapper.vm.boldClass).toBe('tw-font-bold')
//     expect(span.text()).toBe('Label')

//     await wrapper.setProps({ value: 'New Label', bold: false })

//     expect(div.classes().includes('tw-font-bold')).toBe(false)
//     expect(wrapper.vm.boldClass).toBe('')
//     expect(span.text()).toBe('New Label')
//   })
// })

// describe('Ripa Alert tests', () => {
//   const localVue = createLocalVue()
//   let vuetify

//   beforeEach(() => {
//     vuetify = new Vuetify()
//   })

//   it('should outline correctly', async () => {
//     const wrapper = mount(RipaAlert, {
//       localVue,
//       vuetify,
//       propsData: {
//         alertType: 'warning',
//         alertOutlined: true,
//       },
//     })

//     const topDiv = wrapper.find('div')

//     expect(topDiv.classes().includes('warning--text')).toBe(true)
//     expect(topDiv.classes().includes('v-alert--outlined')).toBe(true)

//     await wrapper.setProps({ alertOutlined: false, alertType: 'info' })

//     expect(topDiv.classes().includes('warning--text')).toBe(false)
//     expect(topDiv.classes().includes('v-alert--outlined')).toBe(false)
//   })
// })

// describe('Ripa Select Tests', () => {
//   const localVue = createLocalVue()
//   let vuetify

//   beforeEach(() => {
//     vuetify = new Vuetify()
//   })

//   it('should render correctly', () => {
//     const value = ['test', 1]
//     const wrapper = mount(RipaSelect, {
//       localVue,
//       vuetify,
//       propsData: {
//         value: value,
//       },
//     })
//     expect(wrapper.element).toMatchSnapshot()
//   })
// })
