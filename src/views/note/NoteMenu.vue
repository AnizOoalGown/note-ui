<template>
    <div>

        <div class="header">
            <el-input placeholder="输入关键字"
                      v-model="filterText"
                      clearable
                      size="medium"
                      prefix-icon="el-icon-search"
                      style="width: 240px"/>
            <el-switch v-model="editable" active-text="编辑"/>
        </div>

        <div class="main">
            <el-tree ref="tree"
                     :data="tree"
                     :draggable="editable"
                     :filter-node-method="filterNode"
                     :expand-on-click-node="!editable"
                     :props="defaultProps"
                     @node-click="nodeClick"
                     class="tree scrollbar">
            <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>
                    <i v-if="data.type === 'folder'" class="el-icon-folder" style="margin-right: 10px"/>
                    <i v-else-if="data.type === 'document'" class="el-icon-document" style="margin-right: 10px"/>
                    <span>{{ node.label }}</span>
                </span>
                <span v-if="editable">
                    <el-button type="text"
                               icon="el-icon-plus"
                               v-if="data.type === 'folder'"
                               @click="onAppend(data)"/>
                    <el-button type="text"
                               icon="el-icon-edit"
                               @click="onEdit()"/>
                    <el-popconfirm :title="deleteText(data)"
                                   style="margin-left: 10px"
                                   @onConfirm="onDelete(node, data)">
                        <el-button type="text"
                                   icon="el-icon-delete"
                                   slot="reference"/>
                    </el-popconfirm>
                </span>
            </span>
            </el-tree>

            <el-button type="text"
                       icon="el-icon-folder-add"
                       v-if="editable"
                       @click="onAppend()"
                       style="margin-left: 30px; font-size: 19px"> 新建
            </el-button>
        </div>


        <el-dialog :title="'新建' + typeText"
                   :visible.sync="newDialogVisible"
                   width="500px"
                   :append-to-body="true">
            <el-form ref="form" :model="form"
                     label-width="150px"
                     :rules="rules"
                     hide-required-asterisk>
                <el-form-item label="上级文件夹">
                    <span>{{ form.parentName }}</span>
                </el-form-item>
                <el-form-item label="文件夹/笔记" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio label="folder">文件夹</el-radio>
                        <el-radio label="document">笔记文档</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="typeText + '名称'" prop="name">
                    <el-input v-model="form.name"
                              size="small"
                              :placeholder="'请输入' + typeText + '名称'"
                              style="width: 200px"/>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="newDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="onConfirm(tmpData)" size="medium">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "NoteMenu",
        data() {
            return {
                filterText: '',
                editable: false,
                newDialogVisible: false,
                tmpData: {},
                tree: [{
                    id: 1,
                    type: 'folder',
                    name: '一级 1',
                    children: [{
                        id: 2,
                        type: 'folder',
                        name: '二级 1-1',
                        children: [{
                            id: 3,
                            type: 'document',
                            name: '三级 1-1-3'
                        }, {
                            id: 4,
                            type: 'document',
                            name: '三级 1-1-4'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                form: {
                    parentName: '',
                    type: '',
                    name: ''
                },
                rules: {
                    type: [
                        {required: true, message: '请选择类型', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'change'}
                    ]
                }
            };
        },

        methods: {
            filterNode(value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },
            nodeClick(data) {
                if (data.type === 'document' &&
                    !(this.$route.params.id && parseInt(this.$route.params.id) === data.id)) {
                    this.$router.push('/note/' + data.id)
                }
            },
            onAppend(data) {
                this.form.parentName = (data && data.name) || '根目录'
                this.tmpData = data
                this.newDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                })
            },
            onConfirm(data) {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        const child = {
                            id: new Date().getTime() % 1e6,
                            type: this.form.type,
                            name: this.form.name,
                            children: []
                        }
                        if (data) {
                            if (!data.children) {
                                this.$set(data, 'children', []);
                            }
                            data.children.push(child)
                        }
                        else {
                            this.tree.push(child)
                        }
                        this.newDialogVisible = false
                    }
                })
            },
            onEdit() {

            },
            deleteText(data) {
                if (data.children && data.children.length > 0)
                    return '确认删除【' + data.name + '】及其中的内容？'
                else
                    return '确认删除【' + data.name + '】？'
            },
            onDelete(node, data) {
                const parent = node.parent
                const children = parent.data.children || parent.data
                const index = children.findIndex(d => d.id === data.id)
                children.splice(index, 1)
            }
        },

        computed: {
            typeText() {
                if (this.form.type === 'folder') return '文件夹'
                else if (this.form.type === 'document') return '笔记'
                else return ''
            }
        },

        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
    }
</script>

<style scoped type="scss">
    .header {
        padding: 30px 30px 20px 30px;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
    }

    .main {
        padding: 0 0 30px 30px;
    }

    .tree {
        min-height: 40px;
        max-height: calc(100vh - 215px);
    }

    /deep/ .el-tree-node__expand-icon {
        font-size: 20px;
    }

    /deep/ .el-tree-node__content {
        height: 35px;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 18px;
        padding-right: 20px;
    }
</style>