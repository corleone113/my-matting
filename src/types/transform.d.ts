import ListenerManager from '@/helpers/listener-manager';
import { InitTransformedDrawBaseConfig, PositionRange } from './common';
import { DirectlyDrawingContext } from './dom';

/** 抠图画板进行变换的配置对象 */
export type DragMattingBoardConfig = DirectlyDrawingContext & InitTransformedDrawBaseConfig;

export type ScaleMattingBoardConfig = DragMattingBoardConfig;

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

/** 画板变换监听器配置对象 */
export interface InitTransformListenerConfig extends InitMattingDragConfig {
	/** 计算绘制范围的偏移量 */
	rangeOffset: PositionRange;
}

/** 生成绘制返回偏移量的配置对象 */
export interface GenerateRangeOffsetConfig {
	pageX: number;
	pageY: number;
	positionRange: PositionRange;
}
