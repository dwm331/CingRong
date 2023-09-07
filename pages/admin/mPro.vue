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
                <h6 v-if="imgurConfig.account_username" class="text-primary m-0">登入帳號:{{imgurConfig.account_username}}</h6>
                <a v-if="!imgurConfig.account_username" href="https://api.imgur.com/oauth2/authorize?response_type=token&client_id=e44a28476a6576b" target="_self">登入imgur</a>
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
import axios from 'axios'
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
      allProduct: [],
      imgurConfig: {
        albumHash: "W3v7chF_pp",
        accessToken: null,
        account_username: null,
        expires_in: null,
        clientID: ""
      },
      uploadfile: null
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
      this.uploadfile = event.target.files[0];
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

      // 有上傳檔案，才上傳
      if(this.uploadfile != null) {
        if(this.imgurConfig.accessToken == null) {
          alert("請先登錄imgur");
          return;
        }

        var uploadSt = this.uploadimage(this.uploadfile);
        if(typeof uploadSt === 'object' && uploadSt.hasOwnProperty('data')) {
          if(!uploadSt.data.success) {
            alert("上傳發生錯誤" + uploadSt.data.error);
            return;
          }
        } else {
          alert("上傳發生錯誤" + uploadSt);
          return;
        }
      }

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
        src:  item.src,
        info: item.info
      })
      .then((data) => {
        console.log('Data saved successfully!', data)
        this.form = {productKey: null, category: null, subCategory: null, no: '', name: '', src: '', info: ''}
        this.getProduct()
      })
      .catch((error) => {
        console.log('Data saved error', error)
        this.delimage(this.from.scr)
      });
    },
    deleteProduct(row) {
        if(!row.item) return
        if(!row.item.productKey) return
        remove(ref(DB, `Product/${row.item.productKey}`))
        .then(() => {
            console.log('Data remove successfully!')
            this.getProduct()
            this.delimage(this.from.scr)
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
        this.delimage(this.from.scr)
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
    getUrlLoginInfo() {
        // TODO: 存store

        // 獲取完整的URL
        var url = window.location.href;

        // 使用正則表達式匹配access_token、expires_in和account_username
        var tokenMatch = url.match(/access_token=([^&]+)/);
        var expiresMatch = url.match(/expires_in=([^&]+)/);
        var usernameMatch = url.match(/account_username=([^&]+)/);

        // 檢查匹配是否成功
        if (tokenMatch && expiresMatch && usernameMatch) {
          // 提取access_token、expires_in和account_username
          var accessToken = tokenMatch[1];
          var expires_in = expiresMatch[1];
          var accountUsername = usernameMatch[1];

          // 打印提取的值
          //console.log("Access Token:", accessToken);
          //console.log("Expires In:", expires_in);
          //console.log("Account Username:", accountUsername);

          this.imgurConfig.accessToken = accessToken;
          this.imgurConfig.account_username = accountUsername;
          this.imgurConfig.expires_in = expires_in;

          localStorage.setItem('imgurConfig', JSON.stringify(this.imgurConfig));

        } else {
          console.log("無法提取所需的參數。");
        }
    },
    uploadimage(file) {
      // 設置要發送的請求頭，包括Bearer Token
      const headers = {
        'Authorization': 'Bearer ' + this.imgurConfig.accessToken, // 將 'your_access_token_here' 替換為你的實際Bearer Token
        'Content-Type': 'application/json', // 設置請求的內容類型
      };

      // 創建一個FormData對象來包含文件和其他數據
      const formData = new FormData();
      formData.append('image', file); // 'file'是你要上傳的文件字段，你需要將其替換為實際的字段名


      // 設置要發送的數據（如果有的話）
      const otherData = {
        "album": this.imgurConfig.albumHash
      };

      // 發送POST請求的示例
      axios.post('https://api.imgur.com/3/image', formData, { headers, params: otherData })
        .then(response => {
          // 請求成功後的處理
          console.log('響應數據:', response.data);
          if( response.data.success) {
            // id: "qr1PHJG"，link: "https://i.imgur.com/qr1PHJG.jpg"
            this.form.src = response.data.data.link
            console.log("uploadimage", this.form)
          } else {
            alert("上傳imgur發生問題",  response.data.data.error)
          }
          return response.data;
        })
        .catch(error => {
          // 請求失敗後的處理
          console.error('請求失敗:', error);
          return error;
        });
    },
    delimage(srcurl) {
      // 設置要發送的請求頭，包括Bearer Token
      const headers = {
        'Authorization': 'Bearer ' + this.imgurConfig.accessToken, // 將 'your_access_token_here' 替換為你的實際Bearer Token
        'Content-Type': 'application/json', // 設置請求的內容類型
      };

      var imageHash = this.getFileNameFromUrl(url);

      // 發送POST請求的示例
      axios.delete('https://api.imgur.com/3/image/' + imageHash , null, { headers })
        .then(response => {
          // 請求成功後的處理
          console.log('響應數據:', response.data);
          if( response.data.success) {
            // id: "qr1PHJG"，link: "https://i.imgur.com/qr1PHJG.jpg"
          } else {
            alert("刪除imgur發生問題",  response.data.data.error)
          }
        })
        .catch(error => {
          // 請求失敗後的處理
          console.error('請求失敗:', error);
        });
    },
    getFileNameFromUrl(url) {
      // 使用正則表達式匹配URL中的文件名
      const filenameMatch = url.match(/\/([^/]+)\.jpg$/i);

      if (filenameMatch) {
        // 獲取匹配到的文件名（不包括擴展名）
        console.log('文件名:', filename);
        return filenameMatch[1];
      } else {
        console.log('未找到文件名');
        return "";
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
    },
    async getAppSetting() {
      var dataPath = ref(DB, 'AppSetting')
      this.allProduct = [];
      onValue(dataPath, (snapshot) => {
        const AppSettingData = snapshot.val();
        console.log(AppSettingData)
        if (AppSettingData) {
          this.imgurConfig.clientID = AppSettingData.IMGUR.CLIENTID;
        } else {
          this.imgurConfig.clientID = "";
        }

        console.log("getAppSetting", this.imgurConfig)
      }, {
        onlyOnce: true
      });
    },
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
    if (!this.$store.state.user) {
      this.$router.push('/admin')
      return
    }
    this.getProduct();
    this.getCategories()
    this.getAppSetting();

    // 檢查檢查網址  ，再localStorage
    this.getUrlLoginInfo();
    if( this.imgurConfig.accessToken == null ||  (this.imgurConfig.accessToken != null && this.imgurConfig.accessToken == "")) {
      localStorage.setItem('imgurConfig', JSON.stringify(this.imgurConfig));
      var cimgurConfig = JSON.parse(localStorage.getItem('imgurConfig'));
      if(cimgurConfig.accessToken != null) {
        this.imgurConfig = cimgurConfig
      }
    }
  }
};

</script>
<style>
@import "~assets/css/components/header.min.css";
@import "~assets/css/admin/management.min.css";
</style>
