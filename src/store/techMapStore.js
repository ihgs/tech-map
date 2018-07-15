import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const YAML = require('yamljs')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    test: true,
    data: [],
    langs: [],
    selectedLangs: [],
    tags: [],
    selectedTags: [],
    displayData: []

  },
  mutations: {
    SET_DATA (state, data) {
      state.data = data
    },
    ADD_LANG (state, lang) {
      if (!state.langs.includes(lang)) {
        state.langs.push(lang)
      }
    },
    ADD_TAG (state, tag) {
      if (!state.tags.includes(tag)) {
        state.tags.push(tag)
      }
    },
    SET_SELECTED_LANGS (state, target) {
      state.selectedLangs = target
    },
    SET_SELECTED_TAGS (state, target) {
      state.selectedTags = target
    }
  },
  actions: {
    init (context) {
      const url = './static/map.yaml'
      axios.get(url).then(function (response) {
        const data = YAML.parse(response.data)
        for (let value in data.map) {
          const langs = data.map[value].lang
          if (langs !== undefined) {
            langs.forEach(value => {
              context.commit('ADD_LANG', value)
            })
          }
          const tags = data.map[value].tags
          if (tags !== undefined) {
            tags.forEach(value => {
              context.commit('ADD_TAG', value)
            })
          }
        }
        context.commit('SET_DATA', data)
        context.commit('SET_SELECTED_LANGS', context.state.langs)
        context.commit('SET_SELECTED_TAGS', context.state.tags)
      })
    }
  },
  getters: {
    displayData: state => {
      const dataA = []
      for (let value in state.data.map) {
        const tecData = state.data.map[value]
        const langs = tecData.lang
        const tags = tecData.tags
        if (langs === undefined || tags === undefined) {
          continue
        }
        const matchLang = langs.filter(v => {
          return state.selectedLangs.indexOf(v) !== -1
        })
        if (matchLang.length === 0) {
          continue
        }
        const matchTag = tags.filter(v => {
          return state.selectedTags.indexOf(v) !== -1
        })
        if (matchTag.length === 0) {
          continue
        }
        dataA.push({
          name: value,
          lang: tecData.lang.join(', '),
          tags: tecData.tags,
          home: tecData.homepage,
          refs: tecData.refs
        })
      }
      return dataA
    }
  }
})
