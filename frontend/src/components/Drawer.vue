<template>
  <a-list
    class="demo-loadmore-list"
    item-layout="horizontal"
    :data-source="getCount2"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a @click="remove(item)">remove</a>
        </template>
        <a-list-item-meta>
          <template #title>
            <a @click="change(item)">{{ item }}</a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>
<script>
import { defineComponent,watch,ref } from 'vue';
var store = require('store')

export default defineComponent({
    name:'Drawer',
    props: {
        getCount: Array
    },
    emits:['count','v'],
    setup(props,ctx) {
        
        let getCount2 = ref(props.getCount)

        function remove(item){
            getCount2.value = getCount2.value.filter(function(i) {
                return i != item
            })
        }

        function change(item){
          ctx.emit('v',item)
        }

        watch(getCount2,(value)=>{
            ctx.emit('count',value)
            store.set('incorrect_quiz', {idList : value})
        })

        return {
            getCount2,
            remove,
            change
        };
    },
});
</script>
<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}
</style>