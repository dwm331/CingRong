<template>
  <div class="wrapper">
    <Header showNav="true"></Header>
    <div class="management_section">
      <h1>商品管理</h1>
      <div>
        <h4>新增商品</h4>
        <b-form @submit="onSubmit" @reset="onReset">
            <b-form-group id="input-group-1" label="商品名稱:" label-for="product_name" class="col-3">
                <b-form-input id="product_name" v-model="form.name" required></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="說明:" label-for="product_name" class="col-3">
                <b-form-input id="product_info" v-model="form.info"></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-3" label="商品分類:" label-for="product_cat" class="col-3">
                <b-form-select id="product_cat" v-model="form.category" class="mb-3"  required>
                    <b-form-select-option :value="null">請選擇商品分類</b-form-select-option>
                    <b-form-select-option :value="catKey" v-for="(cat, catKey, catIndex) in categories" :key="catIndex">{{cat.name}}</b-form-select-option>
                </b-form-select>
                <b-form-select id="product_sub_cat" v-model="form.subCategory" class="mb-3">
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
import { ref, onValue, push, remove } from "firebase/database";
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
      showSubCategory: false,
      fields: [
        {key: 'categoryName', label: '商品分類', sortable: true}, 
        {key: 'subCategoryName', label: '子分類', sortable: true}, 
        {key: 'name', label: '商品名稱', sortable: true}, 
        {key: 'info', label: '說明', sortable: true}, 
        {key: 'show_details', label: '操作', sortable: false}],
      allProduct: []
    };
  },
  watch: {
    "form.category" (val) {
        this.form.subCategory = null
    }
  },
  methods: {
    onSubmit(event) {
        event.preventDefault()
        this.addProduct()
        this.onReset(event)
    },
    onReset(event) {
        event.preventDefault()
        this.form = {category: null, subCategory: null, name: '', src: '', info: ''}
    },
    addProduct() {
        push(ref(DB, 'Product' ), this.form)
        .then((data) => {
            console.log('Data saved successfully!', data)
            this.form = {category: null, subCategory: null, name: '', src: '', info: ''}
            this.getProduct()
        })
        .catch((error) => {
            console.log('Data saved error', error)
        });
    },
    deleteProduct(row) {
        if(!row.item) return
        if(!row.item.productKey) return
        remove(ref(DB, `Product/${row.item.productKey}`))
        .then(() => {
            console.log('Data remove successfully!')
            this.getProduct()
        })
        .catch((error) => {
            console.log('Data remove error', error)
        });
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
    },
    async getProduct() {
      var dataPath = ref(DB, 'Product')
      this.allProduct = [];
      onValue(dataPath, (snapshot) => {
        const productData = snapshot.val();
        if (productData) {
          var productJson = JSON.stringify(productData);
          this.allProduct = JSON.parse(productJson);
        } else {
          this.allProduct = [];
        }
      }, {
        onlyOnce: true
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
    }
  },
  computed: {
    getSubCategory() {
        if (this.form.category) {
            let subCategories = this.categories[this.form.category]["subCategory"] || {};
            this.showSubCategory = Object.keys(subCategories).length > 0;
            return subCategories;
        }
    },
    getProducts() {
        let vm = this;
        return Object.keys(this.allProduct).map(key => {
            let item = this.allProduct[key]
            let categoryName = vm.categories[item.category]?vm.categories[item.category]["name"]:''
            let subCategoryName = vm.categories[item.category]?vm.categories[item.category]["subCategory"]?vm.categories[item.category]["subCategory"][item.subCategory]["name"]:'':''
            return {...item, productKey: key, categoryName: categoryName, subCategoryName: subCategoryName}
        });
    }
  },
  mounted() {
    this.getProduct();
    this.getCategories()
  }
};

</script>
<style>
@import "~assets/css/components/header.min.css";
@import "~assets/css/admin/management.min.css";
</style>
