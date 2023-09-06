<template>
  <div class="wrapper">
    <Header showNav="true"></Header>
    <div class="management_section">
      <h1>分類管理</h1>
      <ul v-for="(catItem, catKey, catIndex) in categories" :key="catIndex">
        <li>{{catItem.name}}
          <b-button size="sm" variant="outline-danger" @click="deleteCategory(catKey)">x</b-button>
          <ul>
            <li v-for="(subCatItem, subCatItemIndex) in catItem.subCategory" :key="subCatItemIndex">
              {{subCatItem.name}}
              <b-button size="sm" variant="outline-danger" @click="deleteSubCategory(catKey,subCatItemIndex)">x</b-button>
            </li>
            <li>
              <b-row class="my-1">
                <b-col sm="2">
                  <b-form-input class="col-sm" :placeholder="`${catItem.name}-新增子分類`" :id="`input_${catKey}`" v-model="tempSubCategoryName[catKey]"></b-form-input>
                </b-col>
                <b-col sm="1">
                  <b-button size="sm" variant="outline-primary" @click="addNewSubCategory(catKey)">+</b-button>
                </b-col>
              </b-row>
            </li>
          </ul>
        </li>
        <li v-if="catIndex==Object.values(categories).length-1">
          <b-row class="my-1">
            <b-col sm="2">
              <b-form-input class="col-sm" placeholder="新增商品分類" v-model="tempCategoryName"></b-form-input>
            </b-col>
            <b-col sm="1">
              <b-button size="sm" variant="outline-primary" @click="addNewCategory">+</b-button>
            </b-col>
          </b-row>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { DB } from "~/services/fireinit.js";
import { ref, onValue, push, remove } from "firebase/database";
export default {
  data() {
    return {
      categories: [],
      tempCategoryName: "",
      tempSubCategoryName: [],
      categoryKey: ""
    };
  },
  methods: {
    addNewCategory() {
      const tempCategory = 
      {
        name: this.tempCategoryName,
        subCategory: [],
      }
      push(ref(DB, 'Category' ), tempCategory)
      .then(() => {
        console.log('Data saved successfully!')
        this.tempCategoryName = ''
        this.getCategories()
      })
      .catch((error) => {
        console.log('Data saved error', error)
      });
    },
    addNewSubCategory(key) {
      let tempCategory = 
      {
        name: this.tempSubCategoryName[key],
        subCategory: [],
      }
      push(ref(DB, `Category/${key}/subCategory`), tempCategory)
      .then(() => {
        console.log('Data saved successfully!')
        this.tempSubCategoryName[key] = ''
        this.getCategories()
      })
      .catch((error) => {
        console.log('Data saved error', error)
      });
    },
    deleteCategory(key) {
      remove(ref(DB, 'Category/' + key))
      .then(() => {
        console.log('Data remove successfully!')
        this.getCategories()
      })
      .catch((error) => {
        console.log('Data remove error', error)
      });
    },
    deleteSubCategory(key, index) {
      remove(ref(DB, `Category/${key}/subCategory/${index}`))
      .then(() => {
        console.log('Data remove successfully!')
        this.getCategories()
      })
      .catch((error) => {
        console.log('Data remove error', error)
      });
    },
    async getCategories() {
      onValue(ref(DB, 'Category'), (snapshot) => {
        const categoriesData = snapshot.val();
        if (categoriesData) {
          this.categories = categoriesData
        } else {
          this.categories = [];
        }
      }, {
        onlyOnce: true
      });
    },
  },
  created() {
  },
  mounted() {
    if (!this.$store.state.user) {
      this.$router.push('/admin')
      return
    }
    this.getCategories()
  }
};
</script>
<style>
@import "~assets/css/components/header.min.css";
@import "~assets/css/admin/management.min.css";
</style>
