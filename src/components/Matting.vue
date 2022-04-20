<script setup lang="ts">
import { useMatting, useMattingBoard } from '@/composables/use-matting'
import useMattingCursor from '@/composables/use-matting-cursor';
import { RADIUS_SLIDER_MIN, RADIUS_SLIDER_MAX, RADIUS_SLIDER_STEP, HARDNESS_SLIDER_MAX, HARDNESS_SLIDER_STEP, HARDNESS_SLIDER_MIN, EventType } from '@/constants'
import { ref, onMounted, Ref, computed } from 'vue'
import { generateResultImageURL } from '@/helpers/dom-helper'

const inputCvs: Ref<null | HTMLCanvasElement> = ref(null);
const outputCvs: Ref<null | HTMLCanvasElement> = ref(null);
const resultURL: Ref<string> = ref('')
const resultLink: Ref<null | HTMLAnchorElement> = ref(null)
const generating: Ref<boolean> = ref(false)
const {
	picFile,
	isErasing,
	radius,
	hardness,
	brushSize,
	hardnessText,
} = useMatting()
const {
	width,
	height,
	inputCtx,
	outputCtx,
	outputHiddenCtx,
	draggingInputBoard,
	initialized,
	mattingSources
}
	= useMattingBoard({ picFile, isErasing, radius, hardness })

const { cursorImage, mattingCursorStyle, renderOutputCursor } = useMattingCursor({ inputCtx, isDragging: draggingInputBoard, isErasing, radius, hardness });
const onFileChange = (ev: Event) => {
	const { files } = (ev.target as HTMLInputElement)
	if (files && files[0] && /.+\.(jpg|png|gif|webp)/.test(files[0].name)) {
		picFile.value = files[0]
	} else {
		alert('未选择图片或图片格式不正确(只支持jpg、png、gif、webp), 请重新选择')
	}
}
const downloadFileName = computed(() => picFile.value ? `matting_${picFile.value.name}` : 'null')
const cantSave = computed(() => generating.value || !initialized.value)
const saveBtnClass = computed(() => ({ 'save-btn': true, 'disabled': cantSave.value }))
const saveBtnText = computed(() => generating.value ? '保存中...' : '保存')

onMounted(() => {
	initContextsAndSize()
	renderOutputCursor();
})

function initContextsAndSize() {
	const inputCanvas = inputCvs.value as HTMLCanvasElement
	const outputCanvas = outputCvs.value as HTMLCanvasElement
	inputCtx.value = inputCanvas.getContext('2d')
	outputCtx.value = outputCanvas.getContext('2d')
	const { clientWidth, clientHeight } = inputCanvas
	width.value = clientWidth
	height.value = clientHeight
}

function onDownloadResult() {
	if (mattingSources.value && !generating.value) {
		generating.value = true
		const url = generateResultImageURL(mattingSources.value.orig, outputHiddenCtx.value)
		generating.value = false
		resultURL.value = url
		setTimeout(() => {
			resultLink.value?.click()
		})
	}
}
</script>
<template>
	<div class="options-container">
		<div class="option">
			<label for="image">选择图片：</label>
			<input id="image" type="file" accept=".jpg,.png,.gif,.webp" @change="onFileChange" />
		</div>
		<div class="option">
			<span>画笔类型：</span>
			<label for="fix">修补</label>
			<input id="fix" type="radio" :value="false" v-model="isErasing" />
			<label for="matting">擦除</label>
			<input id="matting" :value="true" type="radio" v-model="isErasing" />
		</div>
		<div class="option">
			<label for="radius">画笔尺寸：</label>
			<input id="radius" class="range-input" type="range" v-model="radius" :max="RADIUS_SLIDER_MAX"
				:min="RADIUS_SLIDER_MIN" :step="RADIUS_SLIDER_STEP" />
			<span>{{ brushSize }}</span>
		</div>
		<div class="option">
			<label for="hardness">画笔硬度：</label>
			<input id="hardness" class="range-input" type="range" v-model="hardness" :max="HARDNESS_SLIDER_MAX"
				:min="HARDNESS_SLIDER_MIN" :step="HARDNESS_SLIDER_STEP" />
			<span>{{ hardnessText }}</span>
		</div>
		<button :class="saveBtnClass" @click="onDownloadResult" :disabled="cantSave">{{ saveBtnText }}</button>
	</div>
	<div class="board-container">
		<div class="matting-wrapper">
			<canvas class="matting-board" ref="inputCvs"></canvas>
			<img class="matting-cursor" :style="mattingCursorStyle" :src="cursorImage" ref="inputCursor" />
		</div>
		<div class="matting-wrapper">
			<canvas class="result-board" ref="outputCvs"></canvas>
			<img class="matting-cursor" :style="mattingCursorStyle" :src="cursorImage" />
		</div>
	</div>
	<a :href="resultURL" :download="downloadFileName" ref="resultLink"></a>
</template>
<style lang="less" scoped>
.options-container {
	height: 50px;
	display: flex;
	padding: 0 12px;
	align-items: center;

	.option {
		display: flex;
		align-items: center;
		padding: 0 10px;
		height: 100%;

		&:not(:last-child) {
			border-right: 1px solid #e3e7e9;
		}

		.range-input {
			position: relative;
			top: 2px;
		}
	}

	.save-btn {
		position: absolute;
		right: 20px;
		font-size: 16px;
		cursor: pointer;

		&.disabled {
			cursor: not-allowed;
		}
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
		border: 1px solid #c3c7c9;
		background: #e3e7e9;
		background-image: linear-gradient(45deg, #f6fafc 25%, transparent 0),
			linear-gradient(45deg, transparent 75%, #f6fafc 0),
			linear-gradient(45deg, #f6fafc 25%, transparent 0),
			linear-gradient(45deg, transparent 75%, #f6fafc 0);
		background-position: 0 0, 12px 12px, 12px 12px, 24px 24px;
		background-size: 24px 24px;
	}

	.matting-wrapper {
		position: relative;
		flex: 1 1;
	}

	.matting-board,
	.result-board {
		width: 100%;
		height: 100%;
	}

	.matting-board {
		cursor: none;
	}

	.result-board {
		cursor: grab;
	}

	.matting-cursor {
		/** 穿透画笔，触发画布点击事件 */
		pointer-events: none;
		display: none;
		position: absolute;
		left: -9999px;
		top: -9999px;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
}
</style>