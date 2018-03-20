class DragController {
    setStartDrag(item) {
        this.startDrag = item
        this.setEndDrag(item)
    }

    setEndDrag(item) {
        this.endDrag = item
    }

    isDifferent() {
        return this.startDrag !== this.endDrag
    }

    getSwapedElements() {
        return [this.startDrag, this.endDrag]
    }
}

export default new DragController()
