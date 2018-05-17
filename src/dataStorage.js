import {
    getAllSights,
    createSight,
    deleteAllSights,
    setSightNotVisited,
    setSightVisited,
    deleteSightById,
    changeSightIndex,
    updateSightById
} from './restApi';


export default class DataStorage {
    constructor(dataChangedCb) {
        this._dataChangedCb = dataChangedCb;
        this._data = [];

        this._requestAndRefetch();
    }

    get data() {
        return this._data;
    }

    async _requestAndRefetch(request = null, ...args) {
        if (request) {
            await request(...args);
        }
        this._data = await getAllSights();
        this.dataChanged();
    }

    dataChanged() {
        this._dataChangedCb(this, this._data);
    }

    async createItem(item) {
        this._data.push(item);
        this.dataChanged();
        await this._requestAndRefetch(createSight, item);
    }

    async deleteAll() {
        this._data = [];
        this.dataChanged();
        await this._requestAndRefetch(deleteAllSights);
    }

    async setVisitedValue(itemId, value) {
        const item = this._data.find(it => it.id === itemId);
        if (!item) {
            return;
        }
        item.visited = value;
        this.dataChanged();
        if (value) {
            await setSightVisited(itemId);
        } else {
            await setSightNotVisited(itemId);
        }
    }

    async deleteItem(id) {
        this._data = this._data.filter(it => it.id !== id);
        this.dataChanged();
        await this._requestAndRefetch(deleteSightById, id);
    }

    async changeItemIndex(oldIndex, newIndex) {
        const item = this._data[oldIndex];
        this._data.splice(oldIndex, 1);
        this._data.splice(newIndex, 0, item);
        this.dataChanged();
        await this._requestAndRefetch(changeSightIndex, oldIndex, newIndex);
    }

    async updateItemDescription(itemId, description) {
        const item = this._data.find(it => it.id === itemId);
        item.description = description;
        this.dataChanged();
        await this._requestAndRefetch(updateSightById, itemId, description);
    }
}
