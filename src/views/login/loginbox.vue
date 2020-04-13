<template>
  <el-form class="login-form" status-icon :rules="loginRules" ref="loginForm" :model="loginForm" label-width="0" size="default">
    <el-form-item prop="username">
      <el-input size="small" @keyup.enter.native="handleLogin()" v-model="loginForm.username" auto-complete="off" placeholder="请输入账号">
        <i slot="prefix" class="el-icon-user"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small" @keyup.enter.native="handleLogin()" :type="passwordType" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"/>
        <i slot="prefix" class="el-icon-key"/>
      </el-input>
    </el-form-item>
    <el-form-item v-if="captcha" prop="login_code">
      <el-row :span="34">
        <el-col :span="14">
          <el-input size="small" @keyup.enter.native="handleLogin()" v-model="loginForm.login_code" auto-complete="off" placeholder="请输入验证码">
            <i slot="prefix" class="el-icon-mobile"/>
          </el-input>
        </el-col>
        <el-col :span="10">
          <div class="login-code">
            <img :src="codeUrl" class="login-code-img" @click="refreshCode" alt=""/>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-checkbox v-model="remember">保持登录</el-checkbox>
    <el-form-item>
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        @click.native.prevent="handleLogin"
        class="login-submit">登 录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapActions } from 'vuex'
import { getAppCaptcha } from '@/api/aided/app'

export default {
  name: 'loginbox',
  data() {
    return {
      remember: false,
      loading: false,
      captcha: false,
      passwordType: 'password',
      codeUrl: '',
      sessionId: '',
      loginForm: {
        username: 'admin',
        password: 'admin888',
        appkey: this.$baseConfig.APP_KEY,
        login_code: '',
        session_id: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
        ],
        login_code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    getAppCaptcha(this.$baseConfig.APP_KEY)
      .then(res => {
        if (res.data.captcha) {
          this.captcha = true
          this.sessionId = res.data.session_id
          this.refreshCode()
        }
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    ...mapActions('careyshop/account', [
      'login'
    ]),
    /**
     * @description 获取验证码
     */
    refreshCode() {
      let url = this.$baseConfig.BASE_API
      url += '/v1/app/method/image.app.captcha'
      url += '?session_id=' + this.sessionId
      url += '&t=' + Math.random()

      this.codeUrl = url
    },
    /**
     * @description 是否显示实际密码
     */
    showPassword() {
      this.passwordType === '' ? (this.passwordType = 'password') : (this.passwordType = '')
    },
    /**
     * @description 正式登录
     */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.session_id = this.sessionId

          this.login({ login: this.loginForm, remember: this.remember })
            .then(() => {
              this.captcha = false
              this.$store.dispatch('careyshop/account/load')
              this.$router.replace(this.$route.query.redirect || '/')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
