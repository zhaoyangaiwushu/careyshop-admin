<template>
  <div class="cs-p">
    <el-form :inline="true" size="small" @submit.native.prevent>
      <el-form-item v-if="auth.add">
        <el-button icon="el-icon-plus" :disabled="loading" @click="handleCreate('create')">新增顶层菜单</el-button>
      </el-form-item>

      <el-form-item>
        <el-button-group>
          <el-button icon="el-icon-circle-plus-outline" :disabled="loading" @click="checkedNodes(true)">展开</el-button>

          <el-button icon="el-icon-remove-outline" :disabled="loading" @click="checkedNodes(false)">收起</el-button>
        </el-button-group>
      </el-form-item>
      <cs-help
        :router="$route.path"
        style="padding-bottom: 19px;">
      </cs-help>
    </el-form>
    <el-row :gutter="20">
      <el-col :span="10">
        <el-tree
          v-if="hackReset"
          class="tree-scroll"
          node-key="id"
          :data="treeData"
          :props="treeProps"
          :filter-node-method="filterNode"
          :highlight-current="true"
          :default-expand-all="isExpandAll"
          :default-expanded-keys="expanded"
          :allow-drag="allowDrag"
          :draggable="true"
          @node-click="handleNodeClick"
          @node-drop="handleDrop"
          ref="tree">
          <span class="custom-tree-node action" slot-scope="{node, data}">
            <span class="brother-showing" :class="{'status-tree': !data.status}">
              <i v-if="auth.move" class="el-icon-sort move-tree cs-mr-5"/>
              <i v-if="data.icon" :class="`iconfont icon${data.icon}`"/>
              <i v-else-if="data.children" :class="`el-icon-${node.expanded ? 'folder-opened' : 'folder'}`"/>
              <i v-else class="el-icon-document"/>
              {{node.label}}
            </span>

            <span class="active">
              <el-button
                v-if="auth.add"
                type="text"
                size="mini"
                @click.stop="handleAppend(data.menu_id)">
                新增
              </el-button>

              <el-button
                v-if="auth.status"
                type="text"
                size="mini"
                @click.stop="enable(data.menu_id, data.status)">
                {{data.status ? '禁用' : '启用'}}
              </el-button>

              <el-button
                v-if="auth.del"
                type="text"
                size="mini"
                @click.stop="remove(data.menu_id)">
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>

      <el-col :span="14">
        <el-card
          v-show="auth.add || auth.set" class="box-card" shadow="never">

          <div slot="header">
            <span>{{textMap[formStatus]}}</span>
            <el-button v-if="formStatus === 'create' && auth.add" type="text" :loading="formLoading"
                       style="float: right; padding: 3px 0;" @click="create">确定
            </el-button>
            <el-button v-else-if="formStatus === 'update' && auth.set" type="text" :loading="formLoading"
                       style="float: right; padding: 3px 0;" @click="update">修改
            </el-button>
          </div>

          <el-form :model="form" :rules="rules" ref="form" label-width="80px">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader
                v-model="form.parentId"
                placeholder="不选择表示顶层菜单 试试搜索：首页"
                :key="form.menu_id"
                :options="treeData"
                :props="cascaderProps"
                style="width: 100%;"
                filterable
                clearable>
              </el-cascader>
            </el-form-item>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="名称"
                  prop="menuName">
                  <el-input
                    v-model="form.menuName"
                    placeholder="请输入菜单名称"
                    :clearable="true"/>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="别名"
                  prop="menuAlias">
                  <el-input
                    v-model="form.menuAlias"
                    placeholder="可输入菜单别名"
                    :clearable="true"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="图标"
                  prop="icon">
                  <cs-icon-select
                    v-model="form.icon"
                    :user-input="true"
                    placeholder="可选择菜单图标"/>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="排序"
                  prop="sort">
                  <el-input-number
                    v-model="form.sort"
                    :min="0"
                    :max="255"
                    style="width: 120px;"
                    controls-position="right"/>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="模块">
                  <el-radio-group v-model="module" size="small">
                    <el-radio-button
                      v-for="(name, index) in treeModule"
                      :key="index"
                      :label="index"
                      :disabled="module !== index">{{name}}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="导航"
                  prop="isNavi">
                  <el-switch
                    v-model="form.isNavi"
                    active-value="1"
                    inactive-value="0">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="链接类型"
                  prop="type">
                  <el-radio-group v-model="form.type">
                    <el-radio label="0">模块</el-radio>
                    <el-radio label="1">外链</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item
                  label="打开方式"
                  prop="target">
                  <el-radio-group v-model="form.target">
                    <el-radio label="_self">当前窗口</el-radio>
                    <el-radio label="_blank">新窗口</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item
              label="URL"
              prop="url">
              <el-input
                v-model="form.url"
                placeholder="可输入链接地址"
                :clearable="true"/>
            </el-form-item>

            <el-form-item
              label="参数"
              prop="params">
              <el-input
                v-model="form.params"
                placeholder="可输入链接参数"
                :clearable="true"/>
            </el-form-item>

            <el-form-item
              label="备注"
              prop="remark">
              <el-input
                v-model="form.remark"
                placeholder="可输入菜单备注"
                type="textarea"
                :rows="3"/>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getMenuModule,
    delMenuItem,
    addMenuItem,
    setMenuItem,
    setMenuStatus,
    setMenuIndex
  } from '@/api/auth/menu'

  export default {
    props: {
      treeData: {
        default: () => []
      },
      loading: {
        default: false
      },
      module: {
        default: ''
      }
    },
    data() {
      return {
        hackReset: true,
        isExpandAll: false,
        expanded: [],
        filterText: '',
        treeModule: {},
        treeProps: {
          label: 'menuName',
          children: 'children'
        },
        cascaderProps: {
          value: 'id',
          label: 'menuName',
          children: 'children',
          checkStrictly: true,
          emitPath: false
        },
        auth: {
          add: false,
          del: false,
          set: false,
          status: false,
          move: false
        },
        form: {
          parentId: undefined,
          name: undefined,
          menuAlias: undefined,
          icon: undefined,
          remark: undefined,
          type: '0',
          url: undefined,
          params: undefined,
          target: '_self',
          isNavi: '0',
          sort: 50
        },
        rules: {
          name: [
            {
              required: true,
              message: '名称不能为空',
              trigger: 'blur'
            },
            {
              max: 32,
              message: '长度不能大于 32 个字符',
              trigger: 'blur'
            }
          ],
          menuAlias: [
            {
              max: 16,
              message: '长度不能大于 16 个字符',
              trigger: 'blur'
            }
          ],
          sort: [
            {
              type: 'number',
              message: '必须为数字值',
              trigger: 'blur'
            }
          ],
          type: [
            {
              required: true,
              message: '链接类型不能为空',
              trigger: 'blur'
            }
          ],
          url: [
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ],
          params: [
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ],
          remark: [
            {
              max: 255,
              message: '长度不能大于 255 个字符',
              trigger: 'blur'
            }
          ]
        },
        formStatus: 'create',
        formLoading: false,
        textMap: {
          create: '新增菜单',
          update: '编辑菜单'
        }
      }
    },
    mounted() {
      getMenuModule()
        .then(res => {
          this.treeModule = res || {}
        })
        .then(() => {
          this._validationAuth()
        })
    },
    methods: {
      // 验证权限
      _validationAuth() {
        this.auth.add = this.$permission('/setting/auth/menu/add')
        this.auth.del = this.$permission('/setting/auth/menu/del')
        this.auth.set = this.$permission('/setting/auth/menu/set')
        this.auth.status = this.$permission('/setting/auth/menu/status')
        this.auth.move = this.$permission('/setting/auth/menu/move')
      },
      // 过滤菜单
      filterNode(value, data) {
        if (!value) {
          return true
        }
        return data.name.indexOf(value) !== -1
      },
      // 展开或收起节点
      checkedNodes(isExpand) {
        this.filterText = ''
        this.expanded = []
        this.hackReset = false

        this.$nextTick(() => {
          this.isExpandAll = isExpand
          this.hackReset = true
        })
      },
      // 重置表单
      resetForm() {
        this.form = {
          parentId: 0,
          name: '',
          menuAlias: '',
          icon: '',
          remark: '',
          type: '0',
          url: '',
          params: '',
          target: '_self',
          isNavi: '0',
          sort: 50
        }
      },
      // 重置元素
      resetElements(val = 'create') {
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })

        this.formStatus = val
        this.formLoading = false
      },
      // 点击树节点事件
      handleNodeClick(data) {
        if (!this.auth.add && !this.auth.set) {
          return
        }

        this.resetForm()
        this.resetElements('update')

        this.form = {
          ...data,
          type: data.type.toString(),
          isNavi: data.isNavi.toString()
        }
      },
      // 新增菜单表单初始化
      handleCreate(status) {
        this.resetForm()
        this.resetElements(status)

        if (this.$refs.tree.getCurrentKey()) {
          this.$refs.tree.setCurrentKey(null)
        }
      },
      // 追加菜单
      handleAppend(key) {
        this.handleCreate('create')
        this.$refs.tree.setCurrentKey(key)
        this.form.parentId = key
      },
      // 新增菜单
      create() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.formLoading = true
            addMenuItem({
              ...this.form,
              module: this.module
            }).then(res => {
                if(res.code != 200){
                  this.$message.error(res.msg)
                }else{
                  this.$emit('refresh')
                  this.$message.success('操作成功')
                }
              }).catch(() => {
                this.formLoading = false
              })
          }
        })
      },
      // 更新菜单
      update() {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.formLoading = true
            setMenuItem(this.form)
              .then(res => {
                if (!this.isExpandAll) {
                  this.expanded = [res.data.parentId || res.data.menu_id]
                }

                this.$emit('refresh')
                this.$message.success('操作成功')
              })
              .catch(() => {
                this.formLoading = false
              })
          }
        })
      },
      // 删除菜单
      remove(key) {
        this.$confirm('确定要执行该操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            delMenuItem(key)
              .then(() => {
                this.$refs.tree.remove(this.$refs.tree.getNode(key))
                this.handleCreate('create')
                this.$message.success('操作成功')
              })
          })
          .catch(() => {
          })
      },
      // 启用与禁用的切换
      enable(key, val) {
        this.$confirm('状态的切换会影响上下级菜单，是否确认操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            setMenuStatus(key, val ? 0 : 1)
              .then(() => {
                if (!this.isExpandAll) {
                  this.expanded = [this.$refs.tree.getNode(key).data.parentId || key]
                }

                this.$emit('refresh')
                this.$message.success('操作成功')
              })
          })
          .catch(() => {
          })
      },
      /**
       * 拖拽成功后操作
       * @param draggingNode  被拖拽节点对应的 Node
       * @param dropNode      结束拖拽时最后进入的节点
       * @param dropType      被拖拽节点的放置位置（before、after、inner）
       * @param ev            event
       */
      handleDrop(draggingNode, dropNode, dropType, ev) {
        // 获取原始数据
        let setMenu = {
          menu_id: draggingNode.data.menu_id,
          parentId: draggingNode.data.parentId
        }

        // 待排序编号
        let indexMenu = []

        // 处理插入到其他菜单中
        if (dropType === 'inner') {
          setMenu.parentId = dropNode.key
        } else {
          setMenu.parentId = dropNode.data.parentId
          dropNode.parent.childNodes.forEach((value, index) => {
            indexMenu.push(value.key)
            value.data.sort = index + 1
          })
        }

        setMenuItem(setMenu)
          .then(res => {
            draggingNode.data.parentId = res.data.parentId
          })
          .catch(() => {
            this.$emit('refresh')
          })

        if (indexMenu.length > 0) {
          setMenuIndex(indexMenu)
            .catch(() => {
              this.$emit('refresh')
            })
        }
      },
      // 判断节点是否可移动
      allowDrag() {
        return this.auth.move
      }
    }
  }
</script>

<style lang="scss" scoped>
  .tree-scroll {
    max-height: 615px;
    overflow: auto;
    padding-bottom: 1px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .brother-showing {
    i {
      width: 16px;
    }

    .iconfont {
      font-size: 16px;
      vertical-align: baseline;
    }
  }

  .active {
    display: none;
  }

  .action:hover .active {
    display: block;
  }

  .move-tree {
    color: $color-text-placehoder;
    cursor: move;
  }

  .status-tree {
    color: $color-text-placehoder;
    text-decoration: line-through
  }

  .box-card {
    border-radius: 0;
    border: 1px solid $color-border-1;
  }
</style>
