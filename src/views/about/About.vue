<template>
    <div class="about-container">
        <div class="title">作者信息</div>
        <el-divider/>
        <el-form label-width="100px">
            <el-form-item label="作者">
                <span>Joshua Wang</span>
            </el-form-item>
            <el-form-item label="GitHub">
                <span>https://github.com/AnizOoalGown</span>
            </el-form-item>
            <el-form-item label="邮箱">
                <span>urfriendmyfriend@163.com</span>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'About',
    }
</script>

<style scoped>
    .about-container {
        width: 500px;
        margin: 0 auto;
    }

    .title {
        padding-top: 50px;
        font-size: x-large;
    }

</style>