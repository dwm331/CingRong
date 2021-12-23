<template>
  <div class="wrapper">
    <Header showNav="true"></Header>
    <div class="management_section">
      <h1>分類管理</h1>
      <ul v-for="(cat, catKey, catIndex) in categories" :key="catIndex">
        <li  v-for="(catItem, catItemIndex) in cat" :key="catItemIndex">{{catItem.name}}
          <b-button size="sm" variant="outline-danger" @click="deleteCategory(catItemIndex)">x</b-button>
          <ul>
            <li v-for="(subCatItem, subCatItemIndex) in catItem.subCategory" :key="subCatItemIndex">
              {{subCatItem.name}}
              <b-button size="sm" variant="outline-danger" @click="deleteSubCategory(catItemIndex,subCatItemIndex)">x</b-button>
            </li>
            <li>
              <b-row class="my-1">
                <b-col sm="2">
                  <b-form-input class="col-sm" :placeholder="`${catItem.name}-新增子分類`" id="subCategory" v-model="tempSubCategoryName[catItemIndex]"></b-form-input>
                </b-col>
                <b-col sm="1">
                  <b-button size="sm" variant="outline-primary" @click="addNewSubCategory(catItemIndex)">+</b-button>
                </b-col>
              </b-row>
            </li>
          </ul>
        </li>
        <li>
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
    loadCategories() {
      this.$fetch();
      this.$nuxt.refresh();
    },
    addNewCategory() {
      let tempCategory = 
      {
        name: this.tempCategoryName,
        subCategory: [],
      }
      Object.values(this.categories).push(tempCategory);
      DB.ref("Category").child(this.categoryKey).push(tempCategory);
      this.tempCategoryName = "";
      this.$nuxt.refresh();
    },
    addNewSubCategory(index) {
      let tempCategory = 
      {
        name: this.tempSubCategoryName[index],
        subCategory: [],
      }
      Object.values(this.categories).push(tempCategory);
      DB.ref("Category").child(this.categoryKey).child(index).child("subCategory").push(tempCategory);
      this.tempSubCategoryName[index] = "";
      this.$nuxt.refresh();
    },
    deleteCategory(index) {
      // console.log("deleteCategory:","Category/"+this.categoryKey+"/"+index)
      DB.ref("Category").child(this.categoryKey).child(index).remove();
      this.$nuxt.refresh();
    },
    deleteSubCategory(index, subIndex) {
      // console.log("deleteSubCategory:","Category/"+this.categoryKey+"/"+index+"/subCategory/"+subIndex)
      DB.ref("Category").child(this.categoryKey).child(index).child("subCategory").child(subIndex).remove();
      this.$nuxt.refresh();
    }
  },
  async fetch() {
    var data = DB.ref("Category");
    this.categories = await data.once("value", function (snapshot) {
      console.log("data num:", snapshot.numChildren());
    });

    if (this.categories.exists() > 0) {
      var datago = JSON.stringify(this.categories);
      this.categories = JSON.parse(datago);
      this.categoryKey = Object.keys(this.categories)[0];
    } else {
      this.categories = [];
    }
  },
  created() {
  }
};
</script>
<style>
@import "~assets/css/components/header.min.css";
@import "~assets/css/admin/management.min.css";
</style>
