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
         </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
   data() {
      return {
         banners: [
            {href: "https://picsum.photos/1024/480", title: "單筆訂單滿999免運<br>門市取貨199免運", message: ""},
            {href: "https://picsum.photos/1024/480", title: "線上訂購系統全新上線", message: ""},
            {href: "https://picsum.photos/1024/480", title: "防疫後生活", message: "官網、蝦皮、門市同步販售"},
            {href: "https://picsum.photos/1024/480", title: "居家收納．歲末大掃除", message: "DIY五金 ｜ 收納工具 | 清潔用品"},
            {href: "https://picsum.photos/1024/480", title: "新商品上市", message: ""}
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
         }]
      }
   }
};
</script>
<style>
@import "~assets/css/global.min.css";
@import "~assets/css/components/header.min.css";
@import "~assets/css/components/footer.min.css";
@import "~assets/css/CingRong/style.min.css";
</style>