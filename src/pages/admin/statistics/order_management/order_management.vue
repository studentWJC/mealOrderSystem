<template>

  <div>
    <va-card style="width: 100%">

      <va-card-content>
        <va-data-table :items="orders2" :columns="columns" striped>


          <template #cell(actions)="{ rowIndex }">
            <va-button flat icon="edit" @click="onchange(rowIndex)" />
            <va-button flat icon="delete" @click="onDelete(orders[rowIndex].mealOrder.id)" />
          </template>
        </va-data-table>

        <va-button color="info" class="mr-4" @click="addClick">添加订单</va-button>

        <va-modal
          v-model="showModal2"
          hide-default-actions
          overlay-opacity="0.2"
        >
          <template #header>
            <h2>添加订单</h2>
          </template>
          <slot>
            <div>
              <va-form
                style="width: 300px;"
                tag="form"
              >
                <va-input
                  class="mt-3"
                  v-model="addOrderInfo.mealOrder.tableId"
                  label="TableId"
                />

                <va-input
                  class="mt-3"
                  v-model="addOrderInfo.mealOrder.isCompleted"
                  label="IsCompleted"
                />

                <va-input
                  class="mt-3"
                  v-model="addOrderInfo.orderList.x"
                  label="orderList_X"
                />

                <va-input
                  class="mt-3"
                  v-model="addOrderInfo.orderList.y"
                  label="orderList_Y"
                />

              </va-form>
            </div>
          </slot>
          <template #footer>
            <va-button @click="addhandleSubmit">
              提交添加
            </va-button>
          </template>
        </va-modal>
      </va-card-content>
    </va-card>

  </div>
  <va-modal
    v-model="showModal"
    hide-default-actions
    overlay-opacity="0.2"
  >
    <template #header>
      <h2>更新订单</h2>
    </template>
    <slot>
      <div>
        <va-form
          style="width: 300px;"
          tag="form"
        >
          <va-input
            class="mt-3"
            v-model="updateOrderInfo.mealOrder.tableId"
            label="TableId"
          />

          <va-input
            class="mt-3"
            v-model="updateOrderInfo.mealOrder.isCompleted"
            label="IsCompleted"
          />

          <va-input
            class="mt-3"
            v-model="updateOrderInfo.orderList.x"
            label="orderList_X"
          />

          <va-input
            class="mt-3"
            v-model="updateOrderInfo.orderList.y"
            label="orderList_Y"
          />

        </va-form>
      </div>
    </slot>
    <template #footer>
      <va-button @click="handleSubmit">
        提交更新
      </va-button>
    </template>
  </va-modal>


</template>

<script>
  import { defineComponent } from 'vue'

  const defaultItem = {
    id: null,
    tableId:null,
    time: null,
    isCompleted:null,
    writerId:null,
  }

  export default defineComponent({
    data () {

      const columns = [
        { key: 'id', sortable: true },
        { key: 'tableId', sortable: true },
        { key: 'time', sortable: true },
        { key: 'isCompleted', sortable: true },
        { key: 'writerId', sortable: true },
        { key: 'actions', width: 80 },
      ]
      return {
        orders:[],
        orders2:[],
        orderidInfo:1,
        addOrderInfo:{
          mealOrder:{
            tableId:"",
            isCompleted:""
          },
          orderList:[
            {
              x:null,
              y:null
            }
          ]
        },
        showModal: false,
        showModal2: false,
        columns,
        createdItem: { ...defaultItem },
        updateOrderInfo: {
          mealOrder:{
            tableId:"",
            isCompleted:"",
          },
          orderList:[{
            x:null,
            y:null
          }]
        }

      }
    },
    computed: {
      isNewData () {
        return Object.keys(this.createdItem).every((key) => !!this.createdItem[key])
      },
    },


    methods: {
      getAll(){
        this.axios.get("http://localhost:8081/order/list").then(res =>{
          console.log(res.data)
          this.orders = res.data.data;
          for(let i=0;i<res.data.data.length;i++) {
            this.orders2[i] = res.data.data[i].mealOrder;
          }
        })
      },
      onchange(id) {
        console.log(id);
        this.showModal = !this.showModal
        this.orderidInfo = this.orders[id].mealOrder.id
        this.updateOrderInfo.mealOrder.tableId = this.orders[id].mealOrder.tableId
        this.updateOrderInfo.mealOrder.isCompleted = this.orders[id].mealOrder.isCompleted
        this.updateOrderInfo.orderList.x = this.orders[id].orderList.x
        this.updateOrderInfo.orderList.y = this.orders[id].orderList.y
      },
      onDelete(id){
        this.axios.delete("http://localhost:8081/order/"+id).then(res =>{
          if(res.data.code===200){
            console.log("删除成功")
            this.getAll();
          }else {
            console.log("删除失败")
            this.getAll();
          }
        })
      },
      /**更新*/
      handleSubmit () {
        alert('-- 提交成功 --')
        this.axios.put("http://localhost:8081/order/"+this.orderidInfo,this.updateOrderInfo).then(res =>{
          console.log("返回了");
          console.log(res.data);
        })
        this.showModal = !this.showModal
        location.reload();
      },
      /*搜索*/

      addClick(){
        this.showModal2 = !this.showModal2
      },

      addhandleSubmit(e){
        alert('-- 提交成功 --')
        this.axios.post("http://localhost:8081/order",this.addOrderInfo).then(res =>{
          console.log("返回了")
          console.log(res.data)
        })
        this.showModal2 = !this.showModal2
        location.reload();
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

  .mr-4{
    margin-top:20px;
  }

</style>


