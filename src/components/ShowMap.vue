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
import techMapStore from '../store/techMapStore'

export default {
  computed: {
    selectedLangs: {
      get () {
        return techMapStore.state.selectedLangs
      },
      set (value) {
        techMapStore.commit('SET_SELECTED_LANGS', value)
      }
    },
    selectedTags: {
      get () {
        return techMapStore.state.selectedTags
      },
      set (value) {
        techMapStore.commit('SET_SELECTED_TAGS', value)
      }
    },
    displayData: function () {
      return techMapStore.getters.displayData
    }
  },
  mounted: function () {
    techMapStore.dispatch('init')
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
    },
    handleCheckBox (selected, options, checkbox) {
      if (selected !== undefined) {
        if (selected.length === 0) {
          checkbox.interminate = false
          checkbox.allSelected = false
        } else if (selected.length < options.length) {
          checkbox.interminate = true
          checkbox.allSelected = false
        } else {
          checkbox.interminate = false
        }
      }
    }
  },
  watch: {
    selectedLangs: function () {
      this.handleCheckBox(this.selectedLangs, this.langs, this.lang)
    },
    selectedTags: function () {
      this.handleCheckBox(this.selectedTags, this.tags, this.tag)
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
      langs: techMapStore.state.langs,
      tags: techMapStore.state.tags,
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
