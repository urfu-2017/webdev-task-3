import { Component } from '../component/index';
import s from './controls.css';

export class Controls extends Component {

    constructor(props) {
        super(props);
        this.search = null;
        this.visibility = null;

        this.onFiltersChange = this.onFiltersChange.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    shouldUpdate(nextProps) {
        return this.props.search !== nextProps.search ||
            this.props.visibility !== nextProps.visibility;
    }

    render() {
        const { search, visibility } = this.props;

        return (
            <div class={s.controls}>
                <div class={s.filters}>
                    <input
                        class={s.search}
                        ref={el => this.search = el}
                        onInput={this.onFiltersChange}
                        type="text"
                        placeholder="Поиск"
                        value={search}
                    />
                    <select
                        class={s.visibility}
                        ref={el => this.visibility = el}
                        onChange={this.onFiltersChange}
                    >
                        <option selected={visibility === 'all'} value="all">Все</option>
                        <option selected={visibility === 'visited'} value="visited">Посетил</option>
                        <option
                            selected={visibility === 'unvisited'}
                            value="unvisited"
                        >
                            Посетить
                        </option>
                    </select>
                </div>
                <button class={s.clear} onClick={this.onClear}>Очистить список</button>
            </div>
        );
    }

    onFiltersChange() {
        const search = this.search.value;
        const visibility = this.visibility.value;

        this.props.onFilterChange(search, visibility);
    }

    /**
     * @param {Event} evt
     */
    onClear(evt) {
        evt.preventDefault();
        this.props.onClear();
    }
}
