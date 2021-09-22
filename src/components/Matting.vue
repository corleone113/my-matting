<script setup lang="ts">
import { ref } from 'vue'
const isMatting = ref(false)
</script>
<template>
	<div class="options-container">
		<div class="option">
			<span>画笔类型：</span>
			<label for="fix">修补</label>
			<input id="fix" name="pen" type="radio" :value="false" v-model="isMatting" />
			<label for="matting">擦除</label>
			<input id="matting" name="pen" :value="true" type="radio" v-model="isMatting" />
			{{ isMatting }}
		</div>
		<div class="option"></div>
	</div>
	<div class="board-container">
		<canvas class="matting-board"></canvas>
		<canvas class="result-board"></canvas>
	</div>
</template>
<style lang="less" scoped>
.options-container {
	height: 50px;
	display: flex;
	padding: 0 12px;
	align-items: center;

	.option {
		margin-right: 10px;
	}
}
.board-container {
	position: fixed;
	top: 50px;
	bottom: 0;
	left: 0;
	width: 100vw;
	min-width: 800px;
	min-height: 600px;
	display: flex;
	.matting-board,
	.result-board {
		flex: 1 50%;
		border: 1px solid #886363;
		background: #e3e7e9;
		background-image: linear-gradient(45deg, #f6fafc 25%, transparent 0),
			linear-gradient(45deg, transparent 75%, #f6fafc 0),
			linear-gradient(45deg, #f6fafc 25%, transparent 0),
			linear-gradient(45deg, transparent 75%, #f6fafc 0);
		background-position: 0 0, 12px 12px, 12px 12px, 24px 24px;
		background-size: 24px 24px;
	}
}
</style>