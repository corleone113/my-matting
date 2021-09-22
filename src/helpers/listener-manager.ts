import { EventType } from '@/constants';

const { MouseDown, Mouseup, Mousemove } = EventType;

export default class ListenerManager {
	private unbindDownUpCache: UnbindDownUpCache = new WeakMap();
	private unbindMoveCache: UnbindMoveCache = new WeakMap();
	private allUnbindMoveCahe: AllUnbindMoveCache = new Set();

	/** 初始化鼠标相关事件监听器 */
	initMouseListeners(ctx: MouseListenerContext) {
		const { mouseTarget } = ctx;
		let unbindConfig = this.unbindDownUpCache.get(mouseTarget);
		if (unbindConfig) {
			const { unbindDown, unbindUp } = unbindConfig;
			unbindDown();
			unbindUp();
		}
		this.unbindAllMoveListeners();
		unbindConfig = this.bindMouseListeners(ctx);
		this.unbindDownUpCache.set(mouseTarget, unbindConfig);
		return unbindConfig;
	}

	private unbindAllMoveListeners() {
		this.allUnbindMoveCahe.forEach((unbind) => unbind());
		this.allUnbindMoveCahe.clear();
	}

	private bindMouseListeners(listenersContext: MouseListenerContext): UnbindDownUpConfig {
		const { mouseTarget, down, move, up, anotherTarget } = listenersContext;
		const moveListener = (ev: Event) => {
			requestAnimationFrame(() => move(ev as MouseEvent));
		};
		const downListener = (ev: Event) => {
			const isTarget = ev.target === mouseTarget;
			const isAnotherTarget = ev.target === anotherTarget;
			if (isTarget || isAnotherTarget) {
				const extraCondition = down && down(ev as MouseEvent);
				const shouldBindMove = extraCondition !== false;
				if (shouldBindMove) {
					const removeMove = this.listenEvent({
						eventType: Mousemove,
						listener: moveListener,
					});
					this.unbindMoveCache.set(mouseTarget, removeMove);
					isAnotherTarget && this.allUnbindMoveCahe.add(removeMove);
				}
			}
		};
		const upListener = (ev: Event) => {
			up && up(ev as MouseEvent);
			this.unbindMoveListeners(mouseTarget);
		};
		const unbindDown = this.listenEvent({
			eventType: MouseDown,
			listener: downListener,
		});
		const unbindUp = this.listenEvent({
			eventType: Mouseup,
			listener: upListener,
		});
		return { unbindDown, unbindUp };
	}

	/** 移除mousemove监听器 */
	private unbindMoveListeners(mattingBoard: HTMLElement) {
		const unbindMove = this.unbindMoveCache.get(mattingBoard);
		unbindMove && unbindMove();
		this.unbindMoveCache.delete(mattingBoard);
	}

	/** 监听事件，返回移除监听器的回调 */
	private listenEvent(
		listenerConfig: ListenerConfig,
		options: boolean | AddEventListenerOptions = false,
		...targets: HTMLElement[]
	): VoidFunction {
		const { eventType, listener } = listenerConfig;
		let removeListenerCallback: VoidFunction;
		if (!this.isNeedToBindToTargets(targets)) {
			removeListenerCallback = this.bindListener(window, eventType, listener, options);
		} else {
			removeListenerCallback = this.bindListeners(targets, eventType, listener, options);
		}
		return removeListenerCallback;
	}

	/** 是否需要绑定在目标元素上 */
	private isNeedToBindToTargets(targets: HTMLElement[]) {
		return targets.length !== 0;
	}

	/** 为单个目标绑定监听器 */
	private bindListener(
		target: Window | HTMLElement,
		eventType: string,
		listener: EventListener,
		options: boolean | AddEventListenerOptions,
	): VoidFunction {
		target.addEventListener(eventType, listener, options);
		return () => target.removeEventListener(eventType, listener, options);
	}

	/** 为多个目标绑定监听器 */
	private bindListeners(
		targets: HTMLElement[],
		eventType: string,
		listener: EventListener,
		options: boolean | AddEventListenerOptions,
	): VoidFunction {
		targets.forEach((target) => {
			target.addEventListener(eventType, listener, options);
		});
		return () =>
			targets.forEach((target) => {
				target.removeEventListener(eventType, listener, options);
			});
	}
}
