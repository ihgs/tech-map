<template>
  <div class="showMap">
    <h1>技術マップ</h1>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group label="Lang" align="left">
            <b-form-checkbox-group v-model="selectedLangs" :options="langs">
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group label="Tag" align="left">
            <b-form-checkbox-group button-variant="primary" v-model="selectedTags" :options="tags">
            </b-form-checkbox-group>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table striped hover :fields="fields" :items="displayData">
            <template slot="home" slot-scope="data">
              <b-link :href="data.value" target="blank">Home</b-link>
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
        if (langs === undefined) {
          continue
        }
        let targetFlag = false
        langs.forEach(value => {
          if (this.selectedLangs.includes(value)) {
            targetFlag = true
          }
        })
        if (!targetFlag) {
          continue
        }
        targetFlag = false
        tags.forEach(value => {
          if (this.selectedTags.includes(value)) {
            targetFlag = true
          }
        })
        if (!targetFlag) {
          continue
        }
        dataA.push({
          name: value,
          lang: tecData.lang.join(', '),
          tags: tecData.tags.join(', '),
          home: tecData.homepage,
          refs: tecData.refs
        })
      }
      return dataA
    }
  },
  mounted: function () {
    var that = this
    const url = '/static/map.yaml'
    axios.get(url).then(function (response) {
      that.mapData = YAML.parse(response.data)
      const langSet = new Set()
      const tagSet = new Set()
      for (let value in that.mapData.map) {
        const langs = that.mapData.map[value].lang
        if (langs !== undefined) {
          langs.forEach(value => {
            langSet.add(value)
          })
        }
        const tags = that.mapData.map[value].tags
        if (tags !== undefined) {
          tags.forEach(value => {
            tagSet.add(value)
          })
        }
      }
      that.selectedLangs = Array.from(langSet)
      that.langs = Array.from(langSet)
      that.selectedTags = Array.from(tagSet)
      that.tags = Array.from(tagSet)
    })
  },
  name: 'ShowMap',
  data () {
    return {
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
          key: 'home'
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
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>
