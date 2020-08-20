<template>
    <el-tabs v-model="activeName" class="login-container" align="center" label-width="80px" stretch type="border-card">
        <el-tab-pane label="登录" name="login">
            <el-form :model="form"
                     ref="loginForm"
                     :rules="rules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-button type="primary" @click="onLogin" :loading="loading">登录</el-button>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
            <el-form :model="form"
                     status-icon
                     :rules="rules"
                     ref="registerForm"
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
                <el-form-item>
                    <el-button type="primary" @click="onSignUp" :loading="loading">注册</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import {login, createUser} from "@/api/user";
    import {setToken} from "@/utils/token";

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
                form: {
                    username: '',
                    password: '',
                    checkPassword: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'change' },
                        { max: 16, message: '长度小于16个字符', trigger: 'change' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'change' }
                    ],
                    checkPassword: [
                        { validator: validatePass2, trigger: 'change' }
                    ]
                },
                redirect: undefined
            }
        },
        watch: {
            $route: {
                handler: function(route) {
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
                        login(this.form.username, this.form.password).then(res => {
                            this.$store.commit('setUser', res.data.user)
                            setToken(res.data.token)
                            this.$router.push({ path: this.redirect || "/" });
                        }).catch(err => console.log(err)).finally(() => this.loading = false)
                    }
                })
            },
            onSignUp() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        createUser(this.form.username, this.form.password).then(() => {
                            this.$message.success("注册成功")
                            this.activeName = 'login'
                        }).catch(err => console.log(err)).finally(() => this.loading = false)
                    }
                })
            }
        }
    }
</script>

<style>
    .login-container {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        -moz-border-radius: 5px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
        font-size: larger;
    }
    .el-tabs__item {
        font-size: large;
    }
</style>