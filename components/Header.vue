<template>
    <div class="header">
        <img class="logo" src="~/static/img/logo/android-chrome-192x192.png" alt="">
        <div class="header_title"><p class="title">慶榮五金行</p><p class="subtitle">Cing Rong Hardware</p></div>
        <div v-show="showNav">
            <b-navbar>
                <b-navbar-nav>
                    <b-nav-item href="/">首頁</b-nav-item>
                    <b-nav-item href="/admin/mCat">分類管理</b-nav-item>
                    <b-nav-item href="/admin/mPro">商品管理</b-nav-item>
                </b-navbar-nav>
            </b-navbar>
        </div>
    </div>
</template>
<script>
export default {
    props: ['showNav']
}
</script>