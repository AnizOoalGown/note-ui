<template>
    <div class="scrollbar">
        <div class="profile-container">
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
                    <el-button type="primary" @click="submitUserInfoForm" :loading="saveUserInfoLoading">保存</el-button>
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
                    <el-button type="primary" @click="submitPasswordForm" :loading="savePasswordLoading">保存</el-button>
                    <el-button @click="resetPasswordForm">取消</el-button>
                </el-form-item>
            </el-form>

            <div class="title">退出登录</div>
            <el-divider/>
            <el-button @click="logout">退出登录</el-button>

            <div class="title">销户</div>
            <el-divider/>
            <el-button type="danger" @click="closeAccount" :loading="closeLoading">销户</el-button>
        </div>
    </div>
</template>

<script>
    import {deleteUser, getUser, logout, updatePassword, updateUsername} from "@/api/user";
    import {removeToken} from "@/utils/token";

    export default {
        name: 'Profile',

        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.passwordForm.newCheckPassword !== '') {
                        this.$refs.passwordForm.validateField('newCheckPassword')
                    }
                    callback()
                }
            }
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.passwordForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            return {
                saveUserInfoShow: false,
                savePasswordShow: false,
                saveUserInfoLoading: false,
                savePasswordLoading: false,
                closeLoading: false,
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
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { max: 16, message: '长度小于16个字符', trigger: 'blur' }
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
                        this.saveUserInfoLoading = true
                        updateUsername(this.$store.getters.userId, this.userInfoForm.username).then(() => {
                            getUser(this.$store.getters.userId).then(res => {
                                this.$store.commit('setUser', res.data)
                            }).catch(err => console.log(err))
                        }).then(() => this.$message.success('修改用户信息成功'))
                            .catch(err => console.log(err))
                            .finally(() => this.saveUserInfoLoading = false)
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
                        this.savePasswordLoading = true
                        updatePassword(this.$store.getters.userId,
                            this.passwordForm.password, this.passwordForm.newPassword)
                            .then(() => this.$message.success('修改密码成功'))
                            .catch(err => console.log(err))
                            .finally(() => this.savePasswordLoading = false)
                    }
                })
            },
            resetPasswordForm() {
                this.$refs.passwordForm.resetFields()
                this.savePasswordShow = false
            },
            logout() {
                this.$confirm('确定退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    logout().then(() => {
                        removeToken()
                        this.$store.commit('setUser', {
                            id: undefined,
                            username: undefined
                        })
                        location.reload()
                    }).catch(err => console.log(err))
                }).catch(() => {})
            },
            closeAccount() {
                this.$prompt('请输入密码', '确定删除此账户？', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({value}) => {
                    this.closeLoading = true
                    deleteUser(this.$store.getters.userId, value)
                        .then(() => {
                            this.$message.success('删除用户' + this.$store.getters.username + '成功')
                            removeToken()
                            this.$store.commit('setUser', {
                                id: undefined,
                                username: undefined
                            })
                            location.reload()
                        })
                        .catch(err => console.log(err))
                        .finally(() => this.closeLoading = false)
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped>
    .scrollbar {
        width: 100%;
    }

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