<template>
  <div class="tips-all">
    <div class="allTips" style="margin-top: 20px">
      <!--      <va-h1 style="font-size: large">所有公告</va-h1>-->
      <!--      <va-button style="font-size: large" @click="back">返回</va-button>-->

      <va-h1 style="font-size: large">全部公告</va-h1>
      <va-button class="mb-4" :rounded="false"  size="medium" @click="back" style="margin-left: 20px;margin-top: 20px">返回</va-button>


      <div class="row row-equal">
        <div class="flex xs12 lg4" v-for="notice in notices">
          <va-card stripe stripe-color="success">
            <va-card-title>
              {{notice.title}}
            </va-card-title>
            <va-card-content>{{notice.detail}}</va-card-content>
            <va-card-actions align="stretch" vertical>
              <!-- <va-button @click="getData(notice.id)">详情</va-button>-->
              <va-button-group>
                <va-button @click="getData(notice.id)">详情</va-button>-->
                <va-button @click="getdeleteid(notice.id)">删除</va-button>-->
              </va-button-group>
            </va-card-actions>
          </va-card>
        </div>
      </div>
    </div>
  </div>
  <va-modal v-model="tipsDetail"
            :overlay="false"
            hide-default-actions
            no-outside-dismiss size="large">

    <div class="noticeDetail" style="width: 100%">
      <div class="title" style="width: 100%">
        <va-input
          class="mb-4"
          v-model="noticeTitle"
        >
          <template #prepend>
            <va-h1 style="width: 5rem">公告标题</va-h1>
          </template>
        </va-input>
      </div>
      <div>
        <va-input
          class="mb-4"
          v-model="noticeContent"
          type="textarea"
          autosize
        >
          <template #prepend>
            <va-h1 style="width: 5rem">公告内容</va-h1>
          </template>
        </va-input>
      </div>

      <va-card class="flex xs12 lg12">
        <va-card-content>
          <va-h1 style="font-size: large">发送给:</va-h1>
          <div class="mb-4">{{ selection }}</div>
          <va-checkbox
            v-model="selection"
            array-value= "0"
            style="margin-top: 5px"
            label="管理员"
          />
          <va-checkbox
            v-model="selection"
            array-value="1"
            style="margin-top: 5px"
            label="前台服务人员"
          />
          <va-checkbox
            v-model="selection"
            array-value="2"
            style="margin-top: 5px"
            label="后厨人员"
          />

        </va-card-content>
      </va-card>

      <div style="margin-top: 10px">
        <va-button class="mr-4" @click="cancelMeal">取消</va-button>
        <va-button class="mr-4" @click="submitEdit()">确定</va-button>
      </div>
    </div>

  </va-modal>
</template>

<script>

  export default {
    name: 'tips-all',
    data() {
      return {
        tipEditId:null,
        tipDeleteId:null,
        tipsContent: '',
        tipsDetail: false,
        notices: {},
        // selection: ["0"],
        noticeTitle: '',
        noticeOrder: '',
        noticeTime: '',
        noticeContent: '',
        birthdate:'',
        editNotice:{
          title:'',
          // eslint-disable-next-line @typescript-eslint/camelcase
          writer_id:null,
          birthdate:''
        },

        addNotice:{
          notice:{
            title:"",
            detail:"",
            // eslint-disable-next-line @typescript-eslint/camelcase
            writer_id:null,
            birthdate:''
          },
          list:[],
        },
      }
    },
    methods: {
      getAll() {
        this.axios.get("/notice/list").then(res => {
          console.log(res.data)
          this.notices = res.data.data
        })
      },
      back() {
        this.$router.push({name: 'tables'})
      },
      getdeleteid(id) {
        /*console.log(id);
        this.deleteMeal = !this.deleteMeal
        this.deleteId = id;*/
        this.axios.delete("/notice/"+id).then(res=>{
          this.$vaToast.init({ message: '删除成功', color: 'success',duration:2000 })
          console.log(res.data)
          this.getAll();
        })
      },
      getData(id) {

        this.axios.get("/notice/"+id).then(res=>{
          console.log(res.data)
          this.tipEditId = id;
          const tmp = res.data.data;
          this.tipsDetail = !this.tipsDetail
          this.noticeTitle = tmp.title
          this.noticeContent = tmp.detail
          this.birthdate = tmp.birthdate
          // for(let i=0;i<tmp.)
        })
      },

      submitEdit(){
        this.addNotice.notice.title = this.noticeTitle
        this.addNotice.notice.detail = this.noticeContent
        for(let i=0;i<this.selection.length;i++){
          this.addNotice.list[i] = parseInt(this.selection[i])
        }
        this.axios.put("/notice/xiugai/"+this.tipEditId, this.addNotice).then(res => {
          if(res.code===200){
            console.log("提交成功")
          }
        })
        location.reload();
      },
      cancelMeal() {
        this.tipsDetail = false;
      },
      /*获取当前时间戳*/
      getTime(){
        setInterval(()=>{
          //new Date() new一个data对象，当前日期和时间
          //toLocaleString() 方法可根据本地时间把 Date 对象转换为字符串，并返回结果。
          this.nowtime = new Date().toLocaleString();
        },1000)
      }
    },

    created() {
      this.getAll();
    },
  }
</script>

<style lang="scss">
  .row-equal {
    height: 100%;
  }

  .flex {
    height: 100%;
  }
</style>
