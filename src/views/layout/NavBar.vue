<template>
    <el-row class="nav-bar">
        <el-col :offset="1" :span="2" class="title">Notes</el-col>
        <el-col :offset="3" :span="15">
            <el-menu class="menubar"
                     :router="true"
                     :default-active="this.$route.path"
                     mode="horizontal"
                     background-color="#2B2B2B"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="/note">我的笔记</el-menu-item>
                <el-menu-item index="/profile">个人中心</el-menu-item>
                <el-menu-item index="/about">关于Notes</el-menu-item>
            </el-menu>
        </el-col>
        <el-col :offset="1" :span="2">
            <el-dropdown trigger="hover">
                <div class="username el-dropdown-link">
                    {{ $store.getters.username }}<i class="el-icon-arrow-down el-icon--right"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                        <router-link to="/profile" style="color: #606266; text-decoration: none">
                            个人中心
                        </router-link>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="saveAndLogout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-col>
    </el-row>
</template>

<script>
    import {logout} from "@/api/user";
    import {removeToken} from "@/utils/token";

    export default {
        name: "NavBar",

        methods: {
            saveAndLogout() {
                this.$confirm('确定退出登录？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const logoutAndClearData = () => {
                        logout().then(() => {
                            removeToken()
                            this.$store.commit('setUser', {
                                id: undefined,
                                username: undefined
                            })
                            location.reload()
                        }).catch(err => console.log(err))
                    }

                    if (this.$route.matched[1].path === '/note' && this.$route.params.id) {
                        this.$store.dispatch('saveNote', this.$route.params.id).then(() => {
                            logoutAndClearData()
                        })
                    }
                    else {
                        logoutAndClearData()
                    }
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped type="scss">
    .nav-bar {
        height: 55px;
        background-color: #2B2B2B;
    }

    .title {
        color: white;
        font-size: xx-large;
        margin-top: 7px;
    }

    .username {
        font-size: x-large;
        margin-top: 12px;
    }

    .menubar .el-menu-item {
        font-size: large;
        height: 55px;
        width: 200px;
        text-align: center;
    }

    .el-dropdown-link {
        cursor: pointer;
        color: white;
    }

    .el-icon-arrow-down {
        font-size: 12px;
    }
</style>