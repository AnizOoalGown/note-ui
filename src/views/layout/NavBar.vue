<template>
    <el-row class="nav-bar">
        <el-col :offset="1" :span="2" class="title">Notes</el-col>
        <el-col :offset="2" :span="16">
            <el-menu class="menubar"
                     :router="true"
                     :default-active="activeIndex"
                     mode="horizontal"
                     background-color="#2B2B2B"
                     text-color="#fff"
                     active-text-color="#ffd04b">
                <el-menu-item index="/note">我的笔记</el-menu-item>
                <el-menu-item index="/profile">个人中心</el-menu-item>
                <el-menu-item index="/about">关于Notes</el-menu-item>
            </el-menu>
        </el-col>
        <el-col :offset="1" :span="2" class="username">{{ $store.getters.username }}</el-col>
    </el-row>
</template>

<script>
    export default {
        name: "NavBar",
        data() {
            return {
                activeIndex: '/note'
            }
        }
    }
</script>

<style scoped type="scss">
    .nav-bar {
        height: 70px;
        background-color: #2B2B2B;
    }
    .title {
        color: white;
        font-size: xx-large;
        margin-top: 15px;
    }
    .username {
        color: white;
        font-size: large;
        margin-top: 25px;
    }
    .menubar .el-menu-item {
        padding-top: 10px;
        font-size: large;
        height: 70px;
        width: 200px;
        text-align: center;
    }
</style>