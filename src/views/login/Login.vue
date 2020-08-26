<template>
    <div class="scrollbar">
        <el-tabs v-model="activeName" class="login-container" label-width="80px" stretch type="border-card">
            <el-tab-pane label="登录" name="login">
                <el-form :model="form"
                         ref="loginForm"
                         label-position="top"
                         hide-required-asterisk
                         :rules="rules">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="form.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verifyCode">
                        <el-input v-model="form.verifyCode"
                                  placeholder="验证码"
                                  style="width: 63%"/>
                        <div class="login-code">
                            <img :src="image" @click="getCode" alt="加载失败"/>
                        </div>
                    </el-form-item>
                    <el-form-item class="button-container">
                        <el-button type="primary" @click="onLogin" :loading="loading">登录</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="注册" name="register">
                <el-form :model="form"
                         status-icon
                         :rules="rules"
                         ref="registerForm"
                         label-position="top"
                         hide-required-asterisk>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPassword">
                        <el-input type="password" v-model="form.checkPassword" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="邀请码" prop="inviteCode">
                        <el-input type="password" v-model="form.inviteCode" autocomplete="off"/>
                    </el-form-item>
                    <el-form-item label="验证码" prop="verifyCode">
                        <el-input v-model="form.verifyCode"
                                  placeholder="验证码"
                                  style="width: 63%"/>
                        <div class="login-code">
                            <img :src="image" @click="getCode" alt="加载失败"/>
                        </div>
                    </el-form-item>
                    <el-form-item class="button-container">
                        <el-button type="primary" @click="onSignUp" :loading="loading">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import {login, createUser} from "@/api/user";
    import {setToken} from "@/utils/token";
    import {getVerifyCode} from "@/api/verifyCode";

    export default {
        name: 'Login',
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.activeName === 'register' && this.form.checkPassword !== '') {
                        this.$refs.registerForm.validateField('checkPassword')
                    }
                    callback()
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.form.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            return {
                activeName: 'login',
                loading: false,
                image: '',
                form: {
                    username: '',
                    password: '',
                    checkPassword: '',
                    uuid: '',
                    verifyCode: '',
                    inviteCode: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'change'},
                        {max: 16, message: '长度小于16个字符', trigger: 'change'}
                    ],
                    password: [
                        {validator: validatePass, trigger: 'change'}
                    ],
                    checkPassword: [
                        {validator: validatePass2, trigger: 'change'}
                    ],
                    verifyCode: [
                        {required: true, message: '请输入验证码', trigger: 'change'},
                    ],
                    inviteCode: [
                        {required: true, message: '请输入验证码', trigger: 'change'},
                    ]
                },
                redirect: undefined
            }
        },
        watch: {
            $route: {
                handler: function (route) {
                    this.redirect = route.query && route.query.redirect
                },
                immediate: true
            }
        },
        methods: {
            onLogin() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        login(this.form.username, this.form.password, this.form.uuid,
                            this.form.verifyCode).then(res => {
                            this.$store.commit('setUser', res.data.user)
                            setToken(res.data.token)
                            this.$router.push({path: this.redirect || "/"});
                        }).catch(() => {
                            this.form.verifyCode = ''
                            this.$nextTick(() => {
                                this.$refs.loginForm.clearValidate(['verifyCode'])
                                this.getCode()
                            })
                        }).finally(() => this.loading = false)
                    }
                })
            },
            onSignUp() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        createUser(this.form.username, this.form.password, this.form.uuid,
                            this.form.verifyCode, this.form.inviteCode).then(() => {
                            this.$message.success("注册成功")
                            this.activeName = 'login'
                        }).catch(err => console.log(err)).finally(() => {
                            this.form.verifyCode = ''
                            this.$nextTick(() => {
                                this.$refs.loginForm.clearValidate(['verifyCode'])
                                this.getCode()
                            })
                            this.loading = false
                        })
                    }
                })
            },
            getCode() {
                getVerifyCode().then(res => {
                    this.image = res.data.image
                    this.form.uuid = res.data.uuid
                }).catch(err => console.log(err))
            }
        },

        mounted() {
            this.getCode()
        }
    }
</script>

<style scoped>
    .scrollbar {
        height: 100%;
    }

    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 100px auto;
        width: 350px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        font-size: larger;
    }

    .el-tabs__item {
        font-size: large;
    }

    .login-code {
        width: 33%;
        height: 38px;
        float: right;
    }

    .login-code img {
        cursor: pointer;
        vertical-align: middle;
    }

    .button-container {
        margin-top: 30px;
        text-align: center;
    }
</style>