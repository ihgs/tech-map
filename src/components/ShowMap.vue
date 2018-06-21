<template>
  <div class="showMap">
    <h1>技術マップ</h1>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group label="Lang" align="left">
            <b-form-checkbox v-model="lang.allSelected" :indeterminate="lang.interminate" @change="toggleAllLang">
              {{ lang.allSelected ? 'Un-select All': 'Select All'}}
            </b-form-checkbox>
            <b-form-checkbox-group v-model="selectedLangs" :options="langs">
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Tag" align="left">
            <b-form-checkbox v-model="tag.allSelected" :indeterminate="tag.interminate" @change="toggleAllTag">
              {{ tag.allSelected ? 'Un-select All': 'Select All'}}
            </b-form-checkbox>
            <b-form-checkbox-group button-variant="primary" v-model="selectedTags" :options="tags">
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <h4 align="left">Display data: {{displayData.length}}</h4>
          <b-table striped hover :fields="fields" :items="displayData" class="data-table">
            <template slot="name" slot-scope="data">
              <a :href="data.item.home" target="blank">{{data.value}}</a>
            </template>
            <template slot="tags" slot-scope="data">
              <b-badge variant="primary" @click="filterTag(tag)" class="tagbadge" v-for="tag in data.value" v-bind:key="tag">
                {{tag}}
              </b-badge>
            </template>
            <template slot="home" slot-scope="data">
              <b-link :href="data.value" target="blank" v-if="data.value !== undefined">Home</b-link>
            </template>
          </b-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios'
const YAML = require('yamljs')
export default {
  computed: {
    displayData: function () {
      if (this.mapData === undefined || this.mapData.map === undefined) {
        return []
      }
      const dataA = []
      for (let value in this.mapData.map) {
        const tecData = this.mapData.map[value]
        const langs = tecData.lang
        const tags = tecData.tags
        if (langs === undefined || tags === undefined) {
          continue
        }
        const matchLang = langs.filter(v => {
          return this.selectedLangs.indexOf(v) !== -1
        })
        if (matchLang.length === 0) {
          continue
        }
        const matchTag = tags.filter(v => {
          return this.selectedTags.indexOf(v) !== -1
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
  },
  mounted: function () {
    const that = this
    const url = './static/map.yaml'
    axios.get(url).then(function (response) {
      that.mapData = YAML.parse(response.data)
      for (let value in that.mapData.map) {
        const langs = that.mapData.map[value].lang
        if (langs !== undefined) {
          langs.forEach(value => {
            if (!that.langs.includes(value)) {
              that.langs.push(value)
              that.selectedLangs.push(value)
            }
          })
        }
        const tags = that.mapData.map[value].tags
        if (tags !== undefined) {
          tags.forEach(value => {
            if (!that.tags.includes(value)) {
              that.tags.push(value)
              that.selectedTags.push(value)
            }
          })
        }
      }
    })
  },
  name: 'ShowMap',
  methods: {
    toggleAllLang (checked) {
      this.selectedLangs = checked ? this.langs : []
    },
    toggleAllTag (checked) {
      this.selectedTags = checked ? this.tags : []
    },
    filterTag (tag) {
      this.selectedTags = [ tag ]
    }
  },
  watch: {
    selectedLangs: function () {
      if (this.selectedLangs !== undefined) {
        if (this.selectedLangs.length === 0) {
          this.lang.interminate = false
          this.lang.allSelected = false
        } else if (this.selectedLangs.length < this.langs.length) {
          this.lang.interminate = true
          this.lang.allSelected = false
        } else {
          this.lang.interminate = false
        }
      }
    },
    selectedTags: function () {
      if (this.selectedTags !== undefined) {
        if (this.selectedTags.length === 0) {
          this.tag.interminate = false
          this.tag.allSelected = false
        } else if (this.selectedTags.length < this.tags.length) {
          this.tag.interminate = true
          this.tag.allSelected = false
        } else {
          this.tagInterminate = false
        }
      }
    }
  },
  data () {
    return {
      lang: {
        interminate: false,
        allSelected: true
      },
      tag: {
        interminate: false,
        allSelected: true
      },
      selectedLangs: [],
      selectedTags: [],
      mapData: [],
      langs: [],
      tags: [],
      fields: [
        {
          key: 'name',
          sortable: true
        },
        {
          key: 'lang'
        },
        {
          key: 'tags'
        },
        {
          key: 'refs'
        }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
a {
  color: #42b983;
}

.tagbadge {
  margin: 2px;
}

</style>
