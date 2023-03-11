<script lang="ts">
import { defineComponent, } from 'vue'

export default defineComponent({
	props: {
		some: String
	},
	setup(_, context: any){
		return context.slots.default
	}
})
</script>
<template>
	<p>Some1</p>
</template>