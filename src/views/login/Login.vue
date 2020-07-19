<template>
    <el-tabs v-model="activeName" class="login-container" align="center" label-width="80px" stretch type="border-card">
        <el-tab-pane label="登录" name="login">
            <el-form :model="form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-button type="primary" @click="onLogin">登录</el-button>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
            <el-form :model="form" :rules="rules" hide-required-asterisk ref="registerForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="role">
                    <el-select v-model="form.role" placeholder="select role" style="width: 100%">
                        <el-option label="ADMIN" value="ADMIN"></el-option>
                        <el-option label="DESIGNER" value="DESIGNER"></el-option>
                        <el-option label="VIEWER" value="VIEWER"></el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="onSignUp">注册</el-button>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                activeName: 'login',
                form: {
                    username: '',
                    password: '',
                    role: ''
                },
                rules: {
                    username: [
                        { required: true, message: 'Enter username', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: 'Enter password', trigger: 'blur' }
                    ],
                    role: [
                        { required: true, message: 'Select role', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            onLogin() {
                this.$router.push('/')
            },
            onSignUp() {
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