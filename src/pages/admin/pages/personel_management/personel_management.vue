

<template>

  <div >

    <va-card style="width: 100%">

      <va-card-content>
        <div class="search" style="width: 100%;">
          <va-input
            class="mb-4"
            v-model="searchInfo"
          >
            <template #prependInner>
              <va-icon
                name="search"
              />
            </template>
            <template #appendInner>
              <va-button style="margin-right: 0;width: 80px"
                flat @click="onsubmit">{{ $t('搜索') }}
              </va-button>
            </template>
          </va-input>
        </div>
        <va-data-table :items="users" :columns="columns" striped>
          <template #headerAppend>
            <tr class="table-example--slot">
              <th
                v-for="key in Object.keys(createdItem)"
                :key="key"
                colspan="1"
              >
                <va-input
                  :placeholder="key"
                  v-model="createdItem[key]"
                />
              </th>
              <th colspan="1">
                <va-button
                  @click="handleAddSubmit"
                  :disabled="!isNewData"
                >
                  Add
                </va-button>
              </th>
            </tr>
          </template>

          <template #cell(actions)="{ rowIndex }">
            <va-button flat icon="edit" @click="onchange(rowIndex)" />
            <va-button flat icon="delete" @click="onDelete(users[rowIndex].id)" />
          </template>
        </va-data-table>

        <va-modal
          v-model="showModal"
          hide-default-actions
          overlay-opacity="0.2"
        >
          <template #header>
            <h2>修改信息</h2>
          </template>
          <slot>
            <div>
              <va-form
                style="width: 300px;"
                tag="form"
              >
                <va-input
                  class="mt-3"
                  v-model="userInfo.name"
                  label="Username"
                />

                <va-input
                  class="mt-3"
                  v-model="userInfo.password"
                  type="password"
                  label="Password"
                />

                <va-input
                  class="mt-3"
                  v-model="userInfo.status"
                  label="Status"
                />

              </va-form>
            </div>
          </slot>
          <template #footer>
            <va-button @click="handleSubmit">
              提交修改
            </va-button>
          </template>
        </va-modal>
      </va-card-content>
    </va-card>

  </div>


</template>

<script>
  import { defineComponent } from 'vue'

  const defaultItem = {
    id: null,
    name: '',
    status: null,
    phone:''
  }

  export default defineComponent({
    data () {

      const columns = [
        { key: 'id', sortable: true },
        { key: 'name', sortable: true },
        { key: 'status', sortable: true },
        { key: 'phone', sortable: true },
        { key: 'actions', width: 80 },
      ]
      return {
        users:[],
        useridInfo:1,
        userInfo:{
          name:"",
          password:"",
          status: 0,
        },
        userAddInfo:{
          name:"",
          password:"",
          status: 0,
          phone:""
        },
        showModal: false,
        columns,
        createdItem: { ...defaultItem },
      }
    },
    computed: {
      isNewData () {
        return Object.keys(this.createdItem).every((key) => !!this.createdItem[key])
      },
    },


    methods: {
      getAll(){
        this.axios.get("http://localhost:8081/user/list").then(res =>{
          console.log(res.data)
          this.users=res.data.data
        })
      },
      onchange(id) {
        console.log(id);
        this.showModal = !this.showModal
        this.useridInfo = this.users[id].id
        this.userInfo.name = this.users[id].name
        this.userInfo.password = this.users[id].password
        this.userInfo.status = this.users[id].status
      },
      onDelete(id){
        this.axios.delete("http://localhost:8081/user/"+id).then(res =>{
          if(res.data.code===200){
            console.log("删除成功")
            this.getAll();
          }else {
            console.log("删除失败")
            this.getAll();
          }
        })
      },
      /**修改*/
      handleSubmit (e) {
        alert('-- 提交成功 --')
        this.axios.put("http://localhost:8081/user/"+this.useridInfo,this.userInfo).then(res =>{
          console.log("返回了");
          console.log(res.data);
        })
        this.showModal = !this.showModal
        this.userInfo.usernameInfo = ""
        this.userInfo.userpasswordInfo = ""
        this.userInfo.userstatusInfo = 0
        this.getAll();
      },
      /*搜索*/
      onsubmit(){
        this.axios.post("http://localhost:8081/user/search",this.searchInfo).then(res=>{
          this.users = res.data.data
        })
      },
      handleAddSubmit(e){
        alert('-- 提交成功 --')
        this.axios.post("http://localhost:8081/user/new",this.createdItem).then(res =>{
          console.log("返回了")
          console.log(res.data)
        })
        this.showModal2 = !this.showModal2
        this.userAddInfo.name = ""
        this.userAddInfo.password = ""
        this.userAddInfo.status = 0
        this.userAddInfo.phone=""
        this.getAll();
      }
    },
    created() {
      this.getAll();
    }
  })
</script>

<style lang="scss" scoped>
  .table-example--slot {
    th {
      padding-top: 5px;
      padding-bottom: 5px;
      vertical-align: middle;
    }
  }
</style>


