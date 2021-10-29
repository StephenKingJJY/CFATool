<template>
  <div>
    <a-drawer
      v-model:visible="visible"
      class="custom-class"
      style="color: red"
      title="Wrong title set"
      placement="right"
      @after-visible-change="afterVisibleChange"
    >
    <Drawer :getCount='getCount' @count='update' @v='change'/>
    </a-drawer>
    <a-row :gutter="[0,32]">
    <a-col :span="8" :offset="8"><div>
      <h1>{{ msg }}</h1>
      <p>
        An elegant tool for practicing and remembering CFA keypoints. 
        <br />
        {{deadline}} to go before the examination.
      </p>
    </div>
    </a-col>
    <a-col :span="8" :offset="8">
      <a-row type="flex" justify="space-between">
        <a-col>
          <h3>Quiz.{{quiz.id}} <a-typography-link href="/"><SwapOutlined :style="{fontSize: '16px', color: '#08c'}" /></a-typography-link></h3>
        </a-col>
        <a-col>
          <h3 v-if='quiz.type==1'><a-tag color="pink">Quantitative Methods</a-tag></h3>
          <h3 v-if='quiz.type==2'><a-tag color="red">Economics</a-tag></h3>
          <h3 v-if='quiz.type==3'><a-tag color="orange">Financial Analysis Techniques</a-tag></h3>
          <h3 v-if='quiz.type==4'><a-tag color="green">Corporate Issuers</a-tag></h3>
          <h3 v-if='quiz.type==5'><a-tag color="cyan">Equity Investments</a-tag></h3>
          <h3 v-if='quiz.type==6'><a-tag color="blue">Fixed Income</a-tag></h3>
          <h3 v-if='quiz.type==7'><a-tag color="purple">Derivatives</a-tag></h3>
          <h3 v-if='quiz.type==8'><a-tag color="black">Alternative Investments</a-tag></h3>
          <h3 v-if='quiz.type==9'><a-tag color="grey">Portfolio Management</a-tag></h3>
          <h3 v-if='quiz.type==10'><a-tag color="yellow">Ethical and Professional Standards</a-tag></h3>
        </a-col>
      </a-row>
    <p>
      {{quiz.content}}
    </p>

      <a-image
        v-if="quiz.img"
        :width="200"
        :src="quiz.img"
      />
      <p v-if="quiz.img" />
        <a-list item-layout="horizontal" :data-source="quiz.option" :split='false' size='small'>
          <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :description='item.title' >
                <template #avatar>
                  {{ item.option }}
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
    </a-col>  
    <a-col :span="8" :offset="8">
      <a-divider orientation="right">
        <a-badge :count="getCount.length" dot @click="showDrawer">
        Ur Answer
        </a-badge>
      </a-divider>
      <a-space align="center" direction="vertical" style="width: 100%">
        <a-radio-group v-model:value="value" name="radioGroup" @change="check()" :disabled='disable'>
          <a-radio :value="1">A</a-radio>
          <a-radio :value="2">B</a-radio>
          <a-radio :value="3">C</a-radio>
        </a-radio-group>
      </a-space>
    </a-col>
    <a-col :span="8" :offset="8" v-if='showC'>
    <a-alert
      message="Correct!"
      :description="quiz.jieda"
      type="success"
      show-icon
    />
    </a-col>
    <a-col :span="8" :offset="8" v-if='showU'>
      <a-alert
        message="Incorrect!"
        :description="quiz.jieda"
        type="error"
        show-icon
      />
    </a-col>
    </a-row>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {reactive,ref,watch} from 'vue'
import { SwapOutlined } from '@ant-design/icons-vue'
import Drawer from './Drawer.vue'
import axios from 'axios'
var store = require('store')

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components:{
    SwapOutlined,
    Drawer
  },
  setup(){
    let value = ref(0)
    let disable = ref(false)
    let showC = ref(false)
    let showU = ref(false)

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)
    
    var examday = dayjs('2022-02-15')
    var deadline = examday.toNow(true)

    // deadline = deadline.to(examday)
    // deadline = deadline.format('D days')

/* 获取quiz数据的逻辑 */
    
    let quiz = reactive({
      id:1,
      content:'An interest rate is best interpreted as:',
      img:'',
      type:10,
      option:[{
        option:'A',
        title: 'a discount rate or a measure of risk.',
      }, {
        option:'B',
        title: 'a measure of risk or a required rate of return.',
      }, {
        option:'C',
        title: 'a required rate of return or the opportunity cost of consumption.',
      }],
      answer:1,
      jieda:'正确答案是A.'
    })

    let quizid = ref('random')
    axios.get('/'+quizid.value).then((res)=>{
        quiz.id = res.data.id
        quiz.content = res.data.content
        quiz.type = res.data.type
        quiz.img = res.data.img
        for (var i=0;i<3;i++){ 
          quiz.option[i].title = res.data.option[i]
        }
        quiz.answer = res.data.answer
        quiz.jieda = res.data.jieda
    })

    watch(quizid,(value)=>{
      axios.get('/'+value).then((res)=>{
        quiz.id = res.data.id
        quiz.content = res.data.content
        quiz.type = res.data.type
        quiz.img = res.data.img
        for (var i=0;i<3;i++){ 
          quiz.option[i].title = res.data.option[i]
        }
        quiz.answer = res.data.answer
        quiz.jieda = res.data.jieda
      })
    })
    
    const change = (params) => {
      quizid.value=params
    }

/* end */

/* 处理getcount的逻辑 */

    let getCount = ref([])

    try {
      var a = store.get('incorrect_quiz').idList || []
    } catch (error) {
      a=[]
    }
    getCount.value=a 
    
    watch(getCount,(value)=>{
      store.set('incorrect_quiz', {idList : value})
    })

    function check(){
      disable.value = true
      if(quiz.answer==value.value){
        showC.value=true
      }else{
        var storeList = getCount.value
        storeList.push(quiz.id)
        var hash=[];
        for (var i = 0; i < storeList.length; i++) {
          for (var j = i+1; j < storeList.length; j++) {
            if(storeList[i]===storeList[j]){
              ++i;
            }
          }
            hash.push(storeList[i]);
        }
        getCount.value=hash
        showU.value=true
      }
    }

    const update = (params) => {
      getCount.value=params
    }

/* end */


    const visible = ref(false);

    const afterVisibleChange = bool => {
      console.log('visible', bool);
    };

    const showDrawer = () => {
      disable.value = false
      value.value = 0
      showC.value=false
      showU.value=false
      visible.value = true;
    };

    return {
      quiz,
      value,
      deadline,
      check,
      disable,
      showC,
      showU,
      getCount,
      visible,
      afterVisibleChange,
      showDrawer,
      update,
      change
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
