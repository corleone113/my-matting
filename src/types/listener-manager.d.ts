interface MoveListenerContext {
	/** 触发滑动的画板 */
	mattingBoard: HTMLCanvasElement;
	/** 滑动开始的监听器 */
	start?: (ev: MouseEvent) => void | boolean;
	/** 滑动的监听器 */
	move: (ev: MouseEvent) => void;
	/** 滑动结束的监听器 */
	end?: (ev: MouseEvent) => void;
}

interface MoveStartEnd {
	/** 绘制开始时执行的回调 */
	moveStart: VoidFunction;
	/** 绘制结束时执行的回调 */
	moveEnd: VoidFunction;
}

type MoveStartEndCache = WeakMap<HTMLCanvasElement, MoveStartEnd>