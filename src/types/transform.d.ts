import ListenerManager from '@/helpers/listener-manager';
import { InitTransformedDrawBaseConfig, PositionRange } from './common';
import { DirectlyDrawingContext } from './dom';

export interface InitMattingTransformConfig extends InitTransformedDrawBaseConfig {
	/** 输入画板变换时绘制的上下文对象 */
	inputContexts: DirectlyDrawingContext;
	/** 输出画板变换时绘制的上下文对象 */
	outputContexts: DirectlyDrawingContext;
}

export interface InitMattingScaleConfig extends InitMattingTransformConfig {
	listenerManager: ListenerManager;
}

/** 初始化抠图画板变化的配置对象 */
export interface InitMattingDragConfig extends InitMattingScaleConfig {
	/** 是否正在拖动左侧输入区画板 */
	draggingInputBoard: boolean;
}

/** 生成绘制返回偏移量的配置对象 */
export interface GenerateRangeOffsetConfig {
	pageX: number;
	pageY: number;
	positionRange: PositionRange;
}
