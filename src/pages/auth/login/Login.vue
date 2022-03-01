<template>
  <form @submit.prevent="onsubmit">
    <va-input
      class="mb-3"
      v-model="ruleForm.name"
      type="name"
      :label="$t('用户名')"
      :error="!!usernameErrors.length"
      :error-messages="usernameErrors"
    />

    <va-input
      class="mb-3"
      v-model="ruleForm.password"
      type="password"
      :label="$t('密码')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />


    <!--    <div class="auth-layout__options d-flex align&#45;&#45;center justify&#45;&#45;space-between">-->
    <!--      <va-checkbox v-model="keepLoggedIn" class="mb-0" :label="$t('记住我')"/>-->
    <!--      <router-link class="ml-1 link" :to="{name: 'recover-password'}">{{$t('auth.recover_password')}}</router-link>-->
    <!--    </div>-->

    <div class="d-flex justify--center mt-3">
      <va-button @click="onsubmit" class="my-0">{{ $t('登录') }}</va-button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      // email: '',
      // password: '',
      keepLoggedIn: false,
      usernameErrors: [],
      passwordErrors: [],
      ruleForm: {
        name: '王俊超',
        password: '1234512'
      }
    }
  },
  computed: {
    formReady () {
      return !this.usernameErrors.length && !this.passwordErrors.length
    },
  },
  methods: {
    onsubmit () {
      this.usernameErrors = this.ruleForm.name ? [] : ['Username is required']
      this.passwordErrors = this.ruleForm.password ? [] : ['Password is required']
      if (!this.formReady) {
        return
      }

      //alert('submit!');
      this.axios.post("http://localhost:8081/login", this.ruleForm).then(res =>{
        console.log(res)
        console.log(res.data)
        console.log(res.data.code)
        if(res.status===500){
          alert('用户不存在!');
        }
        else {
          const code = res.data.code;
          if(code===200){
            alert('登录成功!');
            const jwt = res.data.data.token
            const userInfo = res.data.data
            this.$store.commit("SET_TOKEN",jwt)
            this.$store.commit("SET_USERINFO",userInfo)
            this.$router.push({ name: 'statistics' })

          }

          else{
            alert(res.data.message)
          }
        }

      })


      // console.log(this.$store.getters.getUser)
    }       // this.$router.push({ name: 'dashboard' })
  }

}
</script>
