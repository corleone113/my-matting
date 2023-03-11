<script setup lang="ts">
import { reactive, readonly, ref, shallowReactive, watch, watchEffect, defineEmits, useCssModule, onMounted, } from 'vue'
import { cloneDeep } from 'lodash'
import Some from './Some.vue'
import Some1Vue from './Some1.vue';

const some = ref('some')
const te = ref('te')
const list = ref(['some', 'corleone', 'kill', 'normal'])
const obj = reactive({
	profile: {
		what: {
			pity: 'pity'
		}
	}
})
const msg = ref(0)
const changeList = () => {
	++msg.value
	list.value.splice(1, 0, 'what')
	++msg.value
	// obj.profile.what.pity = 'what a pity'
}
watch([obj], (newObj, oldObj) => {
	console.log('the obj changed??', newObj, oldObj, useCssModule('some'))
})
// onMounted(()=>{
// 	setTimeout(()=>{
// 		msg.value = 'corleone xiao'
// 		msg.value = 'corleone fucker'
// 	})
// })
watchEffect(() => {
	console.log('msg changed', msg.value, list.value)
})


</script>
<template>
	<p>Parent some:{{ some }}</p>
	<input type="text" v-model="some">
	<input type="text" v-model="te">
	<button @click="changeList">Change List</button>{{ msg }}
	<Some :some="some" :te="te" :list="list">
		<p>{{ some }}--{{ te }}</p>
	</Some>
	<Some1Vue :some="some">
		<p style="color:indianred;">{{ some }}--{{ te }}</p>
	</Some1Vue>
</template>
<style module="some">
.what {
	color: indianred;
}
</style>