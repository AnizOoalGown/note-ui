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

        <div class="main" v-loading="treeLoading">
            <el-tree ref="tree"
                     :data="tree"
                     :default-expanded-keys="[161197]"
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
                               @click="onAppend(false, data)"/>
                    <el-button type="text"
                               icon="el-icon-edit"
                               @click="onEdit(data)"/>
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
                       @click="onAppend(true)"
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
                <el-button type="primary" @click="onConfirm()" size="medium">确定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="重命名"
                   :visible.sync="editDialogVisible"
                   width="500px"
                   :append-to-body="true">
            <el-form ref="editForm" :model="form"
                     label-width="150px"
                     :rules="rules"
                     hide-required-asterisk>
                <el-form-item :label="typeText + '名'">
                    <el-input v-model="form.name"
                              size="small"
                              :placeholder="'请输入' + typeText + '名'"
                              style="width: 200px"/>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false" size="medium">取消</el-button>
                <el-button type="primary" @click="onEditConfirm()" size="medium">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {createNote, deleteNote, getMenuTreeByUserId, updateNote} from "@/api/note";

    export default {
        name: "NoteMenu",
        data() {
            return {
                filterText: '',
                editable: false,
                newDialogVisible: false,
                editDialogVisible: false,
                tmpData: {
                    id: undefined,
                    root: true,
                    parentId: undefined,
                    orderNo: undefined,
                },
                tree: [],
                treeLoading: false,
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
                return data.name.indexOf(value) !== -1
            },
            nodeClick(data) {
                if (data.type === 'document' &&
                    !(this.$route.params.id && parseInt(this.$route.params.id) === data.id)) {
                    this.$router.push('/note/' + data.id)
                }
            },
            onAppend(root, data) {
                this.tmpData.root = root
                if (root) {
                    this.form.parentName = '根目录'
                    this.tmpData.parentId = 0
                    this.tmpData.orderNo = this.tree.length
                } else {
                    this.form.parentName = data.name
                    this.tmpData.parentId = data.id
                    this.tmpData.orderNo = data.children.length
                }
                this.newDialogVisible = true
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                })
            },
            onConfirm() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.treeLoading = true
                        this.newDialogVisible = false
                        const note = {
                            type: this.form.type,
                            name: this.form.name,
                            parentId: this.tmpData.parentId,
                            orderNo: this.tmpData.orderNo
                        }
                        createNote(note).then(res => {
                            this.getMenuTree().then(() => {
                                if (note.type === 'document') {
                                    this.$router.push('/note/' + res.data)
                                }
                            }).finally(() => this.treeLoading = false)
                        }).catch(err => console.log(err))
                    }
                })
            },
            onEditConfirm() {
                this.treeLoading = true
                const note = {
                    name: this.form.name,
                    id: this.tmpData.id
                }
                updateNote(note).then(() => {
                    this.getMenuTree().finally(() => this.treeLoading = false)
                }).catch(err => console.log(err))
            },
            onEdit(data) {
                this.tmpData.id = data.id
                this.form.name = data.name
                this.form.type = data.type
                this.editDialogVisible = true
            },
            deleteText(data) {
                if (data.children && data.children.length > 0)
                    return '确认删除“' + data.name + '”及其中的内容？'
                else
                    return '确认删除“' + data.name + '“？'
            },
            onDelete(node, data) {
                this.treeLoading = true
                deleteNote(data.id)
                    .then(() => {
                        this.$router.replace('/note')
                        this.getMenuTree().finally(() => this.treeLoading = false)
                    })
                    .catch(err => console.log(err))
            },
            getMenuTree() {
                return new Promise(resolve => {
                    getMenuTreeByUserId(this.$store.getters.userId)
                        .then(res => this.tree = res.data)
                        .catch(err => console.log(err))
                        .finally(() => {
                            resolve()
                        })
                })
            }
        },

        mounted() {
            this.treeLoading = true
            this.getMenuTree().finally(() => {
                this.treeLoading = false
            })
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