<template>
  <div class="wrapper">
    <Header showNav="true"></Header>
    <div class="management_section">
      <h1>商品管理</h1>
      <div>
        <h4>新增商品</h4>
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="input-group-1" label="商品名稱:" label-for="product_name" class="col-3">
                <b-form-input id="product_name" v-model="form.name" required></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="說明:" label-for="product_name" class="col-3">
                <b-form-input id="product_info" v-model="form.info"></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-3" label="商品分類:" label-for="product_cat" class="col-3">
                <b-form-select id="product_cat" v-model="form.category" class="mb-3" v-for="(cat, catKey, catIndex) in categories" :key="catIndex" required>
                    <b-form-select-option :value="null">請選擇商品分類</b-form-select-option>
                    <b-form-select-option :value="catItemKey" v-for="(catItem, catItemKey, catItemIndex) in cat" :key="catItemIndex">{{catItem.name}}</b-form-select-option>
                </b-form-select>
                <b-form-select id="product_sub_cat" v-model="form.subCategory" class="mb-3" v-show="showSubCategory" required>
                    <b-form-select-option :value="null">請選擇商品子分類</b-form-select-option>
                    <b-form-select-option :value="catItemKey" v-for="(catItem, catItemKey, catItemIndex) in getSubCategory" :key="catItemIndex">{{catItem.name}}</b-form-select-option>
                </b-form-select>
            </b-form-group>
            <b-form-group  class="col-3">
                <b-button type="submit" variant="primary">送出</b-button>
                <b-button type="reset" variant="danger">取消</b-button>
            </b-form-group>
        </b-form>
        <div>
            <b-table striped hover :fields="fields" :items="getProducts">
                <template #cell(show_details)="row">
                    <b-button size="sm" @click="deleteProduct(row)" class="mr-2">刪除</b-button>
                </template>
            </b-table>
        </div>
      </div>
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
      categoryKey: "",
      options: [],
      form: {
        category: null,
        subCategory: null,
        name: '',
        src: '',
        info: ''
      },
      show: true,
      showSubCategory: false,
      fields: [{key: 'categoryName', label: '商品分類', sortable: true}, {key: 'subCategoryName', label: '子分類', sortable: true}, {key: 'name', label: '商品名稱', sortable: true}, {key: 'info', label: '說明', sortable: true}, {key: 'show_details', label: '操作', sortable: false}],
      products: []
    };
  },
  methods: {
    onSubmit(event) {
        event.preventDefault()
        this.addProduct()
        this.onReset(event)
    },
    onReset(event) {
        event.preventDefault()
        this.form.name = ''
        this.form.info = ''
        this.form.category = null
        this.show = false
        this.$nextTick(() => {
            this.show = true
        })
    },
    addProduct() {
        DB.ref("Product").child(this.form.category).push(this.form);
        this.$nuxt.refresh();
    },
    deleteProduct(row) {
        DB.ref("Product").child(row.item.category).child(row.item.productKey).remove();
        this.$nuxt.refresh();
    },
    getCategoryName(id) {
        if(Object.keys(this.categories).length > 0){
            for(var p in this.categories){
                let oneObj = this.categories[p]
                if(Object.keys(oneObj).length > 0){
                    for(var inputObj in oneObj){
                        if (inputObj == id) {
                            return oneObj[inputObj].name
                        }
                    }
                }
            }
        }
    },
    getSubCategoryName(id, subId) {
        if(Object.keys(this.categories).length > 0){
            for(var p in this.categories){
                let oneObj = this.categories[p]
                if(Object.keys(oneObj).length > 0){
                    for(var inputObj in oneObj){
                        for(var inputSubObj in oneObj[inputObj].subCategory){
                            if (inputObj == id && inputSubObj == subId) {
                                return oneObj[inputObj].subCategory[inputSubObj].name
                            }
                        }
                    }
                }
            }
        }
    }
  },
  async fetch() {
    var data = DB.ref("Category");
    this.categories = await data.once("value", function (snapshot) {
      console.log("Category data num:", snapshot.numChildren());
    });

    if (this.categories.exists() > 0) {
      var datago = JSON.stringify(this.categories);
      this.categories = JSON.parse(datago);
      this.categoryKey = Object.keys(this.categories)[0];
    } else {
      this.categories = [];
    }

    var dataP = DB.ref("Product");
    this.products = await dataP.once("value", function (snapshot) {
        console.log("products data num:", snapshot.numChildren());
    });

    if (this.products.exists() > 0) {
        var datago2 = JSON.stringify(this.products);
        this.products = JSON.parse(datago2);
        // this.productsKey = Object.keys(this.products)[0];
    } else {
        this.products = [];
    }
  },
  created() {},
  computed: {
    getSubCategory() {
        if (this.form.category) {
            let subCategories = this.categories[this.categoryKey][this.form.category]["subCategory"] || {};
            this.showSubCategory = Object.keys(subCategories).length > 0;
            return subCategories;
        }
    },
    getProducts() {
        var arr = []
        if(Object.keys(this.products).length > 0){
            for(var p in this.products){
                let oneObj = this.products[p]
                if(Object.keys(oneObj).length > 0){
                    for(var inputObj in oneObj){
                        let id = oneObj[inputObj]["category"]
                        let subId = oneObj[inputObj]["subCategory"]
                        oneObj[inputObj]["categoryName"] = this.getCategoryName(id)
                        oneObj[inputObj]["subCategoryName"] = this.getSubCategoryName(id, subId)
                        oneObj[inputObj]["productKey"] = inputObj
                        arr.push(oneObj[inputObj])
                    }
                }
            }
        }
        // console.log('arr',arr)
        return arr;
    }
  }
};

</script>
<style>
@import "~assets/css/components/header.min.css";
@import "~assets/css/admin/management.min.css";
</style>
