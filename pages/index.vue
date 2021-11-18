<template>
  <div class="wrapper">
    <Header></Header>
    <div class="main">
      <div class="bannder_section">
         <div class="menu">
            <div class="nav_title">商品分類</div>
            <ul class="first_layer">
               <li v-for="(category, index) in categories" :key="index" :class="{'hasSub': category.subCategories}">
                  <nuxt-link to="/" v-b-toggle="`wrap_subList-${category.name}`">{{ category.name }}</nuxt-link>
                  <b-collapse :id="'wrap_subList-'+category.name" role="tabpanel" class="wrap_subList">
                     <ul class="second_layer">
                        <li v-for="(subCategory, subIndex) in category.subCategories" :key="'sub'+subIndex" class="subList"  :class="{'hasSub': subCategory.subCategories}">
                           <nuxt-link to="/" v-b-toggle="`wrap_detailList-${subCategory.name}`">
                              {{ subCategory.name }}
                           </nuxt-link>
                        </li>
                     </ul>
                  </b-collapse>
               </li>
            </ul>
         </div>
         <div class="content_section">
            <div class="banner">
               <b-carousel
                  id="carousel-1"
                  v-model="slide"
                  :interval="4000"
                  controls
                  indicators
                  background="#ababab"
                  img-width="1024"
                  img-height="480"
                  style="text-shadow: 1px 1px 2px #333;"
                  @sliding-start="onSlideStart"
                  @sliding-end="onSlideEnd"
               >
                  <b-carousel-slide v-for="(banner, index) in banners" :key="index" :img-src="banner.href">
                  <h1 class="banner_title" v-html="banner.title"></h1>
                  <p>{{banner.message}}</p>
                  </b-carousel-slide>
               </b-carousel>
            </div>
            <div class="separator">商品列表</div>
            <b-card-group columns class="product_list row deck" >
               <b-card
                  class="product_card"
                  :title="prod.name"
                  :img-src="prod.src"
                  img-alt="Image"
                  img-top
                  v-for="(prod, prodIndex) in product" :key="prodIndex"
               >
                  <b-card-text>
                     {{prod.info}}
                  </b-card-text>
                  <b-card-text class="product_tags">
                     <span v-for="(tag, tagIndex) in prod.categories" :key="tagIndex">{{tag}}．</span>
                  </b-card-text>
               </b-card>
            </b-card-group>
         </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
import { DB } from "@/services/fireinit.js";
export default {
   data() {
      return {
         slide: 0,
         sliding: null,
         banners: [
            {href: "./img/banner/istockphoto-1307328937-612x612.png", title: "單筆訂單滿999免運<br>門市取貨199免運", message: ""},
            {href: "./img/banner/screw.png", title: "線上訂購系統全新上線", message: ""},
            {href: "./img/banner/istockphoto-1307328937-612x612.png", title: "防疫後生活", message: "官網、蝦皮、門市同步販售"},
            {href: "./img/banner/screw.png", title: "居家收納．歲末大掃除", message: "DIY五金 ｜ 收納工具 | 清潔用品"},
            {href: "./img/banner/istockphoto-1307328937-612x612.png", title: "新商品上市", message: ""}
         ],
         categories: [{
            name: '防疫專區'
         },
         {
            name: 'DIY材料',
            subCategories: [
               {
                  name: '修繕/水電材料'
               },
               {
                  name: '手工具/零件/鎖/繩'
               },
               {
                  name: 'DIY拼接'
               },
               {
                  name: 'DIY五金'
               }
            ]
         },
         {
            name: '百貨'
         },
         {
            name: '品牌專區',
            subCategories: [
               {
                  name: '品牌一'
               },
               {
                  name: '品牌二'
               },
               {
                  name: '品牌三'
               }
            ]
         }],
         product: [
            {name: "五金量測工具", src: "./img/sicon/7558265_measure_scale_weight_icon.svg", info: "Some quick example text to build on the card title.", categories: ["DIY拼接", "修繕/水電材料", "百貨"]},
            {name: "裝潢工具", src: "./img/sicon/4622506_drill_kit_labor_mechanic_tool_icon.svg", info: "Some quick example text to build on the card title.", categories: ["DIY拼接", "修繕/水電材料", "百貨"]},
            {name: "鋁窗", src: "./img/sicon/7558302_door_entrance_lock_icon.svg", info: "Some quick example text to build on the card title.", categories: ["防疫專區", "DIY拼接"]},
            {name: "工具燈", src: "./img/sicon/7558276_setting_configuration_gear_icon.svg", info: "", categories: ["防疫專區", "DIY拼接"]},
            {name: "五金工具", src: "./img/sicon/7558279_machine_technology_communication_icon.svg", info: "", categories: ["防疫專區", "DIY拼接", "DIY五金"]},
            {name: "螺絲組", src: "./img/sicon/7558287_nuts_groundnuts_dry fruit_icon.svg", info: "", categories: ["防疫專區", "DIY五金"]},
            {name: "鋁門", src: "./img/sicon/7558294_door_entrance_home_icon.svg", info: "", categories: ["防疫專區", "DIY五金"]},
            {name: "鋁梯", src: "./img/sicon/7558292_stepladder_construction_home_icon.svg", info: "", categories: ["防疫專區", "百貨"]},
         ]
      }
   },
   methods: {
      onSlideStart(slide) {
        this.sliding = true
      },
      onSlideEnd(slide) {
        this.sliding = false
      }
   },
   created() {
    console.log("created")
  },
  async fetch() {
    var data = DB.ref("/")

    this.journals = await data.once("value", function (snapshot) {
      console.log("data num:", snapshot.numChildren());
    });

    if (this.journals.exists() > 0) {
      var datago = JSON.stringify(this.journals);
      this.journals = JSON.parse(datago);
    } else {
      this.journals = [];
    }
    console.log(this.journals)
  },
};
</script>
<style>
@import "~assets/css/global.min.css";
@import "~assets/css/components/header.min.css";
@import "~assets/css/components/footer.min.css";
@import "~assets/css/CingRong/style.min.css";
</style>
