<template>
    <div class="profile-container scrollbar">
        <div class="title">个人信息</div>
        <el-divider/>
        <el-form :model="userInfoForm"
                 status-icon
                 :rules="userInfoRules"
                 ref="userInfoForm"
                 hide-required-asterisk
                 label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfoForm.username" autocomplete="off"
                          @input="saveUserInfoShow = true"/>
            </el-form-item>
            <el-form-item v-if="saveUserInfoShow">
                <el-button type="primary" @click="submitUserInfoForm">保存</el-button>
                <el-button @click="resetUserInfoForm">取消</el-button>
            </el-form-item>
        </el-form>

        <div class="title">修改密码</div>
        <el-divider/>
        <el-form :model="passwordForm"
                 status-icon
                 :rules="passwordRules"
                 ref="passwordForm"
                 hide-required-asterisk
                 label-width="100px">
            <el-form-item label="旧密码" prop="password">
            <el-input type="password" v-model="passwordForm.password" autocomplete="off"
                      @input="savePasswordShow = true"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="passwordForm.newPassword" autocomplete="off"
                          @input="savePasswordShow = true"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newCheckPassword">
                <el-input type="password" v-model="passwordForm.newCheckPassword" autocomplete="off"
                          @input="savePasswordShow = true"></el-input>
            </el-form-item>
            <el-form-item v-if="savePasswordShow">
                <el-button type="primary" @click="submitPasswordForm">保存</el-button>
                <el-button @click="resetPasswordForm">取消</el-button>
            </el-form-item>
        </el-form>

        <div class="title">退出登录</div>
        <el-divider/>
        <el-button>退出登录</el-button>

        <div class="title">销户</div>
        <el-divider/>
        <el-button type="danger">销户</el-button>
    </div>
</template>

<script>
    export default {
        name: 'Profile',

        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.userInfoForm.newCheckPassword !== '') {
                        this.$refs.userInfoForm.validateField('newCheckPassword')
                    }
                    callback()
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.userInfoForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            return {
                saveUserInfoShow: false,
                savePasswordShow: false,
                userInfoForm: {
                    username: this.$store.getters.username
                },
                passwordForm: {
                    password: '',
                    newPassword: '',
                    newCheckPassword: ''
                },
                userInfoRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ]
                },
                passwordRules: {
                    password: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    newCheckPassword: [
                        { validator: validatePass2, trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {
            submitUserInfoForm() {
                this.$refs.userInfoForm.validate((valid) => {
                    if (valid) {
                        alert('submit!')
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })
            },
            resetUserInfoForm() {
                this.$refs.userInfoForm.resetFields()
                this.saveUserInfoShow = false
            },
            submitPasswordForm() {
                this.$refs.passwordForm.validate((valid) => {
                    if (valid) {
                        alert('submit!')
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })
            },
            resetPasswordForm() {
                this.$refs.passwordForm.resetFields()
                this.savePasswordShow = false
            }
        }
    }
</script>

<style scoped>
    .profile-container {
        width: 500px;
        margin: 0 auto;
        height: calc(100vh - 70px)
    }

    .title {
        padding-top: 50px;
        font-size: x-large;
    }

    .el-input {
        width: 240px;
    }
</style>