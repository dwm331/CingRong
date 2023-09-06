<template>
  <div class="wrapper">
    <Header></Header>
    <client-only>
      <div class="login_section" v-if="!this.$store.state.user">
        <b-alert show variant="warning">尚未登入</b-alert>
        <input type="text" class="form-control" placeholder="帳號" v-model="formEmail">
        <input type="password" class="form-control" placeholder="密碼" v-model="formPassword">
        <button class="btn btn-primary" type="button" @click="login">登入</button>
      </div>
    </client-only>
  </div>
</template>
<script>
import Header from "~/components/Header.vue";
export default {
  data() {
    return {
      formEmail: "",
      formPassword: ""
    }
  },
  methods: {
    login() {
         this.$store
        .dispatch("auth/signInWithEmail", {
          email: this.formEmail,
          password: this.formPassword,
        })
        .then((data) => {
          if (data.status === "success") {
            const user = data.user;
            console.log("[Signed in]", this.formEmail);
            this.$router.push('/admin/mCat')
          } else {
            alert(data.code)
          }
        })
    },
  },
  mounted() {
    if (this.$store.state.user) {
      this.$router.push('/admin/mCat')
    }
  }
};
</script>
<style>
@import "~assets/css/components/header.min.css";
@import "~assets/css/admin/style.min.css";
</style>

