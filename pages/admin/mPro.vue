<template>
  <div class="wrapper">
    <Header showNav="true"></Header>
    <div class="management_section">
      <h1>商品管理</h1>
      <div class="row">
        <div class="border col-4 p-3" :class="{'border-primary': !form.productKey, 'border-success': form.productKey}">
          <h4 v-if="!form.productKey" class="text-primary">新增商品</h4>
          <h4 v-if="form.productKey" class="text-success">編輯商品</h4>
          <b-form @submit="onSubmit" @reset="onReset">
              <b-form-group id="input-group-1" label="商品名稱:" label-for="product_name" class="text-dark font-weight-bold">
                  <b-form-input id="product_name" v-model="form.name" required></b-form-input>
              </b-form-group>
              <b-form-group id="input-group-2" label="說明:" label-for="product_name" class="text-dark font-weight-bold">
                  <b-form-textarea id="product_info" v-model="form.info" rows="3" max-rows="10"></b-form-textarea>
              </b-form-group>
              <b-form-group id="input-group-3" label="商品分類:" label-for="product_cat" class="text-dark font-weight-bold">
                  <b-form-select id="product_cat" v-model="form.category" class="mb-3"  required>
                      <b-form-select-option :value="null">請選擇商品分類</b-form-select-option>
                      <b-form-select-option :value="catKey" v-for="(cat, catKey, catIndex) in categories" :key="catIndex">{{cat.name}}</b-form-select-option>
                  </b-form-select>
                  <b-form-select id="product_sub_cat" v-model="form.subCategory" class="mb-3">
                      <b-form-select-option :value="null">請選擇商品子分類</b-form-select-option>
                      <b-form-select-option :value="catItemKey" v-for="(catItem, catItemKey, catItemIndex) in getSubCategory" :key="catItemIndex">{{catItem.name}}</b-form-select-option>
                  </b-form-select>
              </b-form-group>
              <b-form-group id="input-group-4" label="商品圖片:" label-for="product_src" class="text-dark font-weight-bold">
                  <b-form-group id="product_sub_cat" v-model="form.subCategory" class="mb-3">
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" id="inputItemImg" accept="image/*" @change="handleItemImg">
                      <label class="custom-file-label" for="inputItemImg">上傳圖片</label>
                    </div>
                    <hr>
                    <img id="itemImg" :src="form.src" class="img-fluid" alt="圖片預覽"/>
                    <hr>
                  </b-form-group>
              </b-form-group>
              <b-form-group>
                  <b-button type="submit" variant="primary" v-if="!form.productKey">送出</b-button>
                  <b-button type="submit" variant="success" v-if="form.productKey">修改</b-button>
                  <b-button type="reset" variant="danger">取消</b-button>
              </b-form-group>
          </b-form>
        </div>
        <div class="col-8">
          <b-table striped hover :fields="fields" :items="getProducts">
            <template #table-colgroup="scope">
              <col v-for="field in scope.fields"
                :key="field.key" :style="{ width: field.key === 'info' ? '300px' : '120px' }"
              >
            </template>
            <template #cell(img)="row_img">
              <img id="itemImg" :src="row_img.item.src" class="img-fluid" alt="圖片預覽" width="200"/>
            </template>
            <template #cell(show_details)="row_detail">
              <b-button size="sm" variant="success" @click="getProductByRow(row_detail)" class="mr-2">修改</b-button>
              <b-button size="sm" variant="danger" @click="deleteProduct(row_detail)" class="mr-2">刪除</b-button>
            </template>
          </b-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DB } from "~/services/fireinit.js";
import { ref, onValue, push, remove, set } from "firebase/database";
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
        name: '',
        src: '',
        info: ''
      },
      showSubCategory: false,
      fields: [
        {key: 'categoryName', label: '商品分類', sortable: true, width: '100'},
        {key: 'subCategoryName', label: '子分類', sortable: true},
        {key: 'img', label: '圖片', sortable: false},
        {key: 'name', label: '商品名稱', sortable: true},
        {key: 'info', label: '說明', sortable: true},
        {key: 'show_details', label: '操作', sortable: false}],
      allProduct: []
    };
  },
  watch: {
    "form.category" (val) {
      if (this.form.productKey===null) this.form.subCategory = null
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
      if (this.form.productKey) {
        this.editProduct(this.form)
      } else {
        this.addProduct(this.form)
      } 
      this.onReset(event)
    },
    onReset(event) {
      event.preventDefault()
      this.form = {productKey: null, category: null, subCategory: null, name: '', src: '', info: '', uploadImg: ''}
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
        this.form = {productKey: null, category: null, subCategory: null, name: '', src: '', info: '', uploadImg: ''}
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
        name: row.item.name, 
        src: row.item.src, 
        info: row.item.info, 
        uploadImg: row.item.src
      }
    },
    editProduct(item) {
      set(ref(DB, `Product/${item.productKey}`), {
        category: item.category,
        subCategory: item.subCategory,
        name: item.name,
        src: item.src,
        info: item.info
      })
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
            this.showSubCategory = Object.keys(subCategories).length > 0;
            return subCategories;
        }
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
