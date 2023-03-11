<script lang="ts">
import { defineComponent,computed, watch, createApp, h } from 'vue'

export default defineComponent({
	props: {
		some: String,
		list: Array,
	},
	setup(props: any, context: any){
		const computedSome = computed(()=>{
			const { some } = props
			return `computed_${some}`
		})
		const computedAttr = computed(()=>{
			const {attrs: {te}} = context
			return `computed_${te}`
		})
		return {
			computedSome,
			computedAttr,
			someSlot: context.slots.default,
			list: props.list
		}
	},
	beforeUpdate(){
		console.log('>>>', this.$attrs, this.someSlot()[0])
	}
})
</script>
<template>
	<p>Child computed some:{{computedSome}} computed te: {{computedAttr}}</p>
	<ul>
		<li v-for="(text, index) in list" :key="index">{{text}}</li>
	</ul>
</template>