export default class ListenerManager {
    private moveStartEndCache: MoveStartEndCache = new WeakMap()

    initMoveListeners(ctx: MoveListenerContext){
        const { mattingBoard } = ctx
        this.moveStartEndCache.delete(mattingBoard)
    }
}