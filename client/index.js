import 'babel-polyfill';
/* eslint-disable no-unused-vars */
import { Component } from './component';
import { CreateForm } from './create-form/create-form';
import { Controls } from './controls/controls';
import { PlacesList } from './places-list/places-list';
/* eslint-enable no-unused-vars */

import { debounce } from './utils';
import styles from './index.css';

const api = 'https://webdev-task-2-ocypkazlhm.now.sh/api/v1/locations';
const options = {
    mode: 'cors',
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// eslint-disable-next-line no-unused-vars
class Application extends Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
            visibility: 'all',
            search: ''
        };

        this.addNewPlace = this.addNewPlace.bind(this);
        this.clearPlaces = this.clearPlaces.bind(this);
        this.changeFilters = debounce(this.changeFilters.bind(this), 300);
        this.changePlace = this.changePlace.bind(this);
        this.deletePlace = this.deletePlace.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
    }

    async componentDidMount() {
        const response = await fetch(`${api}?pageSize=${Number.MAX_SAFE_INTEGER}`, options);
        const places = await response.json();

        this.setState({ places });
    }

    async addNewPlace({ name }) {
        const body = JSON.stringify({ description: name });

        const response = await fetch(api, { method: 'POST', body, ...options });
        const place = await response.json();

        if (response.status !== 201) {
            throw place.error;
        }

        this.setState({ places: [...this.state.places, place] });
    }

    async changePlace(place) {
        const body = JSON.stringify(place);

        const response = await fetch(`${api}/${place.id}`, { method: 'PATCH', body, ...options });

        if (response.status !== 200) {
            return Promise.reject();
        }

        this.setState({ places: this.state.places.map(p => p.id === place.id ? place : p) });
    }

    async deletePlace(place) {
        const response = await fetch(`${api}/${place.id}`, { method: 'DELETE', ...options });

        if (response.status === 200) {
            this.setState({ places: this.state.places.filter(p => p.id !== place.id) });
        }
    }

    async clearPlaces() {
        const response = await fetch(api, { method: 'DELETE', ...options });

        if (response.status === 200) {
            this.setState({ places: [] });
        }
    }

    async changeOrder(id, position) {
        if (position < 0 || position > this.state.places.length - 1) {
            console.info(position);
            return;
        }

        const { places } = this.state;
        const oldPosition = places.findIndex(place => place.id === id);
        const place = places[oldPosition];

        const oldOrder = places.slice();
        const newOrder = places.slice();

        newOrder.splice(oldPosition, 1);
        newOrder.splice(position, 0, place);

        this.setState({ places: newOrder });

        const body = JSON.stringify({ id, position });
        const response = await fetch(`${api}/order`, { method: 'PUT', body, ...options });

        if (response.status !== 200) {
            this.setState({ places: oldOrder });
        }
    }

    async changeFilters(search, visibility) {
        const response = await fetch(
            `${api}?pageSize=${Number.MAX_SAFE_INTEGER}&search=${search}`, options);
        const places = await response.json();

        this.setState({ search, visibility, places });
    }

    render() {
        const { search, visibility, places } = this.state;

        return (
            <div>
                <header class={styles.header}>
                    <div class={styles.container}>
                        <Controls
                            visibility={visibility}
                            search={search}
                            onClear={this.clearPlaces}
                            onFilterChange={this.changeFilters}
                        />
                    </div>
                </header>
                <div class={`${styles.content} ${styles.container}`}>
                    <CreateForm onAddPlace={this.addNewPlace}/>
                    <PlacesList
                        places={places}
                        visibility={visibility}
                        search={search}
                        onChangePlace={this.changePlace}
                        onDeletePlace={this.deletePlace}
                        onChangeOrder={this.changeOrder}
                    />
                </div>
            </div>
        );
    }
}

const root = document.getElementById('app-root');
const application = <Application/>;
application.mount(root);
