(window.webpackJsonp=window.webpackJsonp||[]).push([[7,3],{303:function(e,t,r){e.exports=r.p+"img/android-chrome-192x192.8fa749d.png"},304:function(e,t,r){"use strict";r.r(t);var o={props:["showNav"]},n=r(70),component=Object(n.a)(o,(function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"header"},[o("img",{staticClass:"logo",attrs:{src:r(303),alt:""}}),e._v(" "),e._m(0),e._v(" "),o("div",{directives:[{name:"show",rawName:"v-show",value:e.showNav,expression:"showNav"}]},[o("b-navbar",[o("b-navbar-nav",[o("b-nav-item",{attrs:{href:"/"}},[e._v("首頁")]),e._v(" "),o("b-nav-item",{attrs:{href:"/admin/mCat"}},[e._v("分類管理")]),e._v(" "),o("b-nav-item",{attrs:{href:"/admin/mPro"}},[e._v("產品管理")])],1)],1)],1)])}),[function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"header_title"},[r("p",{staticClass:"title"},[e._v("慶榮五金行")]),r("p",{staticClass:"subtitle"},[e._v("Cing Rong Hardware")])])}],!1,null,null,null);t.default=component.exports},306:function(e,t,r){var content=r(313);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,r(104).default)("0161b476",content,!0,{sourceMap:!1})},312:function(e,t,r){"use strict";r(306)},313:function(e,t,r){var o=r(103)(!1);o.push([e.i,".header{padding:0 10px;display:flex;justify-content:flex-start;background-color:#fff26b;flex-wrap:wrap;width:100%;position:fixed;z-index:999}.header .logo{width:58px;height:58px}.header .header_title{padding:0 34px}.header .header_title .title{margin:-4px 0;font-size:35px;font-weight:700}.header .header_title .subtitle{text-align:right;color:grey;margin:-12px 0 0;font-size:14px;font-weight:400}@media (max-width:428px){.header .logo{width:45px;height:45px}.header .header_title{text-align:center}.header .header_title .title{font-size:26px;font-weight:500}.header .header_title .subtitle{margin:-8px 0 0;font-size:10px}}.management_section{padding:100px 0}",""]),e.exports=o},323:function(e,t,r){"use strict";r.r(t);var o=r(29),n=(r(83),r(15),r(78)),c=r(161),l={data:function(){return{categories:[],tempCategoryName:"",tempSubCategoryName:[],categoryKey:""}},methods:{addNewCategory:function(){var e=this,t={name:this.tempCategoryName,subCategory:[]};Object(c.e)(Object(c.g)(n.a,"Category"),t).then((function(){console.log("Data saved successfully!"),e.tempCategoryName="",e.getCategories()})).catch((function(e){console.log("Data saved error",e)}))},addNewSubCategory:function(e){var t=this,r={name:this.tempSubCategoryName[e],subCategory:[]};Object(c.e)(Object(c.g)(n.a,"Category/".concat(e,"/subCategory")),r).then((function(){console.log("Data saved successfully!"),t.tempSubCategoryName[e]="",t.getCategories()})).catch((function(e){console.log("Data saved error",e)}))},deleteCategory:function(e){var t=this;Object(c.h)(Object(c.g)(n.a,"Category/"+e)).then((function(){console.log("Data remove successfully!"),t.getCategories()})).catch((function(e){console.log("Data remove error",e)}))},deleteSubCategory:function(e,t){var r=this;Object(c.h)(Object(c.g)(n.a,"Category/".concat(e,"/subCategory/").concat(t))).then((function(){console.log("Data remove successfully!"),r.getCategories()})).catch((function(e){console.log("Data remove error",e)}))},getCategories:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:Object(c.c)(Object(c.g)(n.a,"Category"),(function(t){var r=t.val();e.categories=r||[]}),{onlyOnce:!0});case 1:case"end":return t.stop()}}),t)})))()}},created:function(){},mounted:function(){this.$store.state.user?this.getCategories():this.$router.push("/admin")}},d=(r(312),r(70)),component=Object(d.a)(l,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"wrapper"},[r("Header",{attrs:{showNav:"true"}}),e._v(" "),r("div",{staticClass:"management_section"},[r("h1",[e._v("分類管理")]),e._v(" "),e._l(e.categories,(function(t,o,n){return r("ul",{key:n},[r("li",[e._v(e._s(t.name)+"\n        "),r("b-button",{attrs:{size:"sm",variant:"outline-danger"},on:{click:function(t){return e.deleteCategory(o)}}},[e._v("x")]),e._v(" "),r("ul",[e._l(t.subCategory,(function(t,n){return r("li",{key:n},[e._v("\n            "+e._s(t.name)+"\n            "),r("b-button",{attrs:{size:"sm",variant:"outline-danger"},on:{click:function(t){return e.deleteSubCategory(o,n)}}},[e._v("x")])],1)})),e._v(" "),r("li",[r("b-row",{staticClass:"my-1"},[r("b-col",{attrs:{sm:"2"}},[r("b-form-input",{staticClass:"col-sm",attrs:{placeholder:t.name+"-新增子分類",id:"input_"+o},model:{value:e.tempSubCategoryName[o],callback:function(t){e.$set(e.tempSubCategoryName,o,t)},expression:"tempSubCategoryName[catKey]"}})],1),e._v(" "),r("b-col",{attrs:{sm:"1"}},[r("b-button",{attrs:{size:"sm",variant:"outline-primary"},on:{click:function(t){return e.addNewSubCategory(o)}}},[e._v("+")])],1)],1)],1)],2)],1),e._v(" "),n==Object.values(e.categories).length-1?r("li",[r("b-row",{staticClass:"my-1"},[r("b-col",{attrs:{sm:"2"}},[r("b-form-input",{staticClass:"col-sm",attrs:{placeholder:"新增商品分類"},model:{value:e.tempCategoryName,callback:function(t){e.tempCategoryName=t},expression:"tempCategoryName"}})],1),e._v(" "),r("b-col",{attrs:{sm:"1"}},[r("b-button",{attrs:{size:"sm",variant:"outline-primary"},on:{click:e.addNewCategory}},[e._v("+")])],1)],1)],1):e._e()])}))],2)],1)}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{Header:r(304).default})}}]);