<template>
  <div class="wrapper">
    <Header showNav="true"></Header>
    <b-container class="management_section">
      <h1>產品管理</h1>
      <b-row>
        <b-col cols="8">
          <b-form>
            <b-form-group id="search-group-3" label="查詢產品分類:" label-for="product_search_cat" class="text-primary font-weight-bold">
              <b-form-select id="product_search_cat" v-model="search.category" class="col-4">
                <b-form-select-option :value="null">請選擇產品分類</b-form-select-option>
                <b-form-select-option :value="catKey" v-for="(cat, catKey, catIndex) in categories" :key="catIndex">{{cat.name}}</b-form-select-option>
              </b-form-select>
              <b-form-select id="product_search_sub_cat" v-model="search.subCategory" class="col-4">
                <b-form-select-option :value="null">請選擇產品子分類</b-form-select-option>
                <b-form-select-option :value="catItemKey" v-for="(catItem, catItemKey, catItemIndex) in getSubCategory" :key="catItemIndex">{{catItem.name}}</b-form-select-option>
              </b-form-select>
              <b-button variant="secondary" @click="getProductByCategoryKey()">顯示所有產品</b-button>
              <span class="text-secondary">共 {{Object.keys(allProduct).length}} 筆資料</span>
            </b-form-group>
          </b-form>
          <b-table striped hover :fields="fields" :items="getProducts">
            <template #table-colgroup="scope">
              <col v-for="field in scope.fields" :key="field.key" :style="{ width: field.key === 'info' ? '300px' : '120px' }">
            </template>
            <template #cell(img)="row_img">
              <img id="itemImg" :src="row_img.item.src" class="img-fluid" alt="圖片預覽" width="200"/>
            </template>
            <template #cell(show_details)="row_detail">
              <b-button size="sm" variant="success" @click="getProductByRow(row_detail)" class="mr-2">修改</b-button>
              <b-button size="sm" variant="danger" @click="deleteProduct(row_detail)" class="mr-2">刪除</b-button>
            </template>
          </b-table>
        </b-col>
        <b-col>
          <div class="border p-3" :class="{'border-primary': !form.productKey, 'border-success': form.productKey}">
            <div class="row p-3">
              <h4 v-if="!form.productKey" class="text-primary m-0">新增產品</h4>
              <h4 v-if="form.productKey" class="text-success m-0">編輯產品</h4>
              <b-button v-if="form.productKey" size="sm" pill variant="outline-success" @click="form.productKey=null" class="ml-2" height="30px">取消</b-button>
            </div>
            <b-form @submit="onSubmit" @reset="onReset">
              <b-form-group id="input-group-0" label="產品編號:" label-for="product_no" class="text-dark font-weight-bold">
                <b-form-input id="product_no" v-model="form.no" required></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-1" label="產品名稱:" label-for="product_name" class="text-dark font-weight-bold">
                <b-form-input id="product_name" v-model="form.name" required></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-2" label="說明:" label-for="product_info" class="text-dark font-weight-bold">
                <b-form-textarea id="product_info" v-model="form.info" rows="3" max-rows="10"></b-form-textarea>
              </b-form-group>
              <b-form-group id="input-group-3" label="產品分類:" label-for="product_cat" class="text-dark font-weight-bold">
                <b-form-select id="product_cat" v-model="form.category" class="mb-3"  required>
                  <b-form-select-option :value="null">請選擇產品分類</b-form-select-option>
                  <b-form-select-option :value="catKey" v-for="(cat, catKey, catIndex) in categories" :key="catIndex">{{cat.name}}</b-form-select-option>
                </b-form-select>
                <b-form-select id="product_sub_cat" v-model="form.subCategory" class="mb-3">
                  <b-form-select-option :value="null">請選擇產品子分類</b-form-select-option>
                  <b-form-select-option :value="catItemKey" v-for="(catItem, catItemKey, catItemIndex) in getSubCategory" :key="catItemIndex">{{catItem.name}}</b-form-select-option>
                </b-form-select>
              </b-form-group>
              <b-form-group id="input-group-4" label="產品圖片:" label-for="product_src" class="text-dark font-weight-bold">
                <b-form-file id="product_src" accept="image/*" @change="handleItemImg"></b-form-file>
                <b-img :src="form.src" fluid alt="圖片預覽"></b-img>
              </b-form-group>
              <b-form-group>
                <b-button type="submit" variant="primary" v-if="!form.productKey">送出</b-button>
                <b-button type="submit" variant="success" v-if="form.productKey">修改</b-button>
                <b-button type="reset" variant="danger">取消</b-button>
              </b-form-group>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { DB } from "~/services/fireinit.js";
import { ref, onValue, push, remove, set, query, orderByChild, equalTo } from "firebase/database";
export default {
  data() {
    return {
      categories: [],
      tempCategoryName: "",
      tempSubCategoryName: [],
      categoryKey: "",
      options: [],
      form: {
        productKey: null,
        category: null,
        subCategory: null,
        no: '',
        name: '',
        src: '',
        info: ''
      },
      search: {
        category: null,
        subCategory: null,
      },
      fields: [
        {key: 'categoryName', label: '產品分類', sortable: true, width: '100'},
        {key: 'subCategoryName', label: '子分類', sortable: true},
        {key: 'img', label: '圖片', sortable: false},
        {key: 'no', label: '產品編號', sortable: true},
        {key: 'name', label: '產品名稱', sortable: true},
        {key: 'info', label: '說明', sortable: true},
        {key: 'show_details', label: '操作', sortable: false}],
      allProduct: []
    };
  },
  watch: {
    "form.category" (val) {
      if (this.form.productKey===null) this.form.subCategory = null
    },
    "search.category" (val) {
      this.search.subCategory = null
      this.getProductByCategoryKey(val, null)
    },
    "search.subCategory" (val) {
      this.getProductByCategoryKey(null,val)
    }
  },
  methods: {
    handleItemImg(event) {
      const selectedImg =  event.target.files[0];
      this.createBase64Img(selectedImg);
    },
    createBase64Img(fileObj) {
      const reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = () => {
        //console.log("file 转 base64结果：" + reader.result);
        this.form.src = reader.result;
      }
    },
    onSubmit(event) {
      event.preventDefault()
      if (Boolean(this.form.productKey)) {
        this.editProduct(this.form)
      } else {
        this.addProduct(this.form)
      } 
      this.onReset(event)
    },
    onReset(event) {
      event.preventDefault()
      this.form = {productKey: null, category: null, subCategory: null, no: '', name: '', src: '', info: ''}
    },
    addProduct(item) {
      push(ref(DB, 'Product' ), {
        category: item.category,
        subCategory: item.subCategory,
        name: item.name,
        src: item.src,
        info: item.info
      })
      .then((data) => {
        console.log('Data saved successfully!', data)
        this.form = {productKey: null, category: null, subCategory: null, no: '', name: '', src: '', info: ''}
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
    getProductByRow(row) {
      if(!row.item) return
      if(!row.item.productKey) return
      this.form = {
        productKey: row.item.productKey,
        category: row.item.category, 
        subCategory: row.item.subCategory || null, 
        no: row.item.no,
        name: row.item.name, 
        src: row.item.src, 
        info: row.item.info
      }
    },
    async getProductByCategoryKey(categoryKey,subCategoryKey) {
      var dataPath =  query(ref(DB, `Product`))
      if (Boolean(categoryKey)) {
        dataPath =  query(ref(DB, `Product`), orderByChild('category'), equalTo(categoryKey));
      }
      if (Boolean(subCategoryKey)) {
        dataPath =  query(ref(DB, `Product`), orderByChild('subCategory'), equalTo(subCategoryKey));
      }
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
    editProduct(item) {
      let data = {
        category: item.category,
        subCategory: item.subCategory || '',
        no: item.no,
        name: item.name,
        src: item.src,
        info: item.info
      }
      set(ref(DB, `Product/${item.productKey}`), data)
      .then(() => {
        console.log('Data update successfully!')
        this.getProduct()
      })
      .catch((error) => {
        console.log('Data update error', error)
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
        return subCategories;
      } else if (this.search.category) {
        let subCategories = this.categories[this.search.category]["subCategory"] || {};
        return subCategories;
      }
      return []
    },
    getProducts() {
        let vm = this;
        return Object.keys(this.allProduct).map(key => {
            let item = this.allProduct[key]
            let categoryName = vm.categories[item.category]?vm.categories[item.category]["name"]:''
            let subCategoryName = vm.categories[item.category]?vm.categories[item.category]["subCategory"]?vm.categories[item.category]["subCategory"][item.subCategory]?vm.categories[item.category]["subCategory"][item.subCategory]["name"]:'':'':''
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
