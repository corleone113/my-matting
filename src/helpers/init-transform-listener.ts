import { InitMattingDragConfig, InitMattingScaleConfig, InitTransformListenerConfig } from '@/types/transform';
import {
	dragMattingBoards,
	generateRangeOffset,
	redrawMattingBoardsWhileScaling,
	updateRangeByMousePosition,
} from './transform-helper';

/** 初始化画板变换的监听器 */
export function initDragListener(mattingTransformConfig: InitMattingDragConfig) {
	const {
		outputContexts: { ctx: outputCtx2D },
		transformConfig,
		listenerManager,
	} = mattingTransformConfig;
	let dragWhenMoving: (ev: MouseEvent) => void;
	listenerManager.initMouseListeners({
		mouseTarget: outputCtx2D.canvas,
		down(ev) {
			const { pageX, pageY } = ev;
			const { positionRange } = transformConfig;
			const rangeOffset = generateRangeOffset({ pageX, pageY, positionRange });
			dragWhenMoving = generateDragListener({ ...mattingTransformConfig, rangeOffset });
		},
		move(ev) {
			dragWhenMoving(ev);
		},
	});
}

/** 生成画板拖动的监听器 */
function generateDragListener(mattingTransformConfig: InitTransformListenerConfig) {
	const { inputContexts, outputContexts, transformConfig, rangeOffset } = mattingTransformConfig;
	return (ev: MouseEvent) => {
		const { positionRange } = transformConfig;
		updateRangeByMousePosition(ev, positionRange, rangeOffset);
		dragMattingBoards([
			{ transformConfig, ...inputContexts },
			{ transformConfig, withBorder: true, ...outputContexts },
		]);
	};
}

/** 初始化缩放监听器 */
export function initScaleListener(mattingTransformConfig: InitMattingScaleConfig): VoidFunction {
	const {
		inputContexts: { ctx: inputCtx },
		outputContexts: { ctx: outputCtx },
		listenerManager,
	} = mattingTransformConfig;
	return listenerManager.initWheelListener({
		mattingBoards: [inputCtx.canvas, outputCtx.canvas],
		wheel(ev) {
			redrawMattingBoardsWhileScaling(ev, mattingTransformConfig);
		},
	});
}
