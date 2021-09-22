interface MouseListenerContext {
	/** 触发鼠标事件的目标DOM */
	mouseTarget: HTMLElement;
	/** mousedown监听器 */
	down?: (ev: MouseEvent) => void | boolean;
	/** mousemove监听器 */
	move: (ev: MouseEvent) => void;
	/** mouseup监听器 */
	up?: (ev: MouseEvent) => void;
	/** 触发鼠标事件的第二目标DOM */
	anotherTarget: HTMLElement;
}

/** 用于解绑mousedown监听器、mouseup监听器的回调的配置对象 */
interface UnbindDownUpConfig {
	/** 解绑mousedown监听器的回调 */
	unbindDown: VoidFunction;
	/** 解绑mouseup监听器的回调 */
	unbindUp: VoidFunction;
}

/** 事件监听配置对象 */
interface ListenerConfig {
	/** 事件类型 */
	eventType: string;
	/** 事件监听器 */
	listener: (ev: Event) => void;
}

/** 存放UnbindDownUpConfig对象的容器 */
type UnbindDownUpCache = WeakMap<HTMLElement, UnbindDownUpConfig>;

/** 存放解绑mousemove监听器的回调的容器 */
type UnbindMoveCache = WeakMap<HTMLElement, VoidFunction>;

/** 存放所有解绑mousemove监听器的回调的容器 */
type AllUnbindMoveCache = Set<VoidFunction>;
