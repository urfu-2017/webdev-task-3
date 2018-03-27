import 'babel-polyfill';
import { Component } from './component';
import { CreateForm } from './create-form/create-form';
import { Controls } from './controls/controls';
import { PlacesList } from './places-list/places-list';
import { debounce } from './utils';
import styles from './index.css';
import { Loader } from './loader/loader';

const pageSize = 100;
const api = 'https://webdev-task-2-ocypkazlhm.now.sh/api/v1/locations';
const options = {
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    }
};

class Application extends Component {

    constructor(props) {
        super(props);
        this.state = {
            places: [],
            visibility: 'all',
            search: '',
            isFetching: false
        };

        this.addNewPlace = this.addNewPlace.bind(this);
        this.clearPlaces = this.clearPlaces.bind(this);
        this.changeFilters = debounce(this.changeFilters.bind(this), 300, this);
        this.changePlace = this.changePlace.bind(this);
        this.deletePlace = this.deletePlace.bind(this);
        this.changeOrder = this.changeOrder.bind(this);
    }

    async componentDidMount() {
        const response = await this.sendRequest(`${api}?pageSize=${pageSize}`);
        const places = await response.json();

        this.setState({ places });
    }

    async addNewPlace({ name }) {
        const body = JSON.stringify({ description: name });
        const response = await this.sendRequest(api, 'POST', body);
        const place = await response.json();

        if (response.status !== 201) {
            throw place.error;
        }

        this.setState({ places: [...this.state.places, place] });
    }

    async changePlace(place) {
        const body = JSON.stringify(place);
        const response = await this.sendRequest(`${api}/${place.id}`, 'PATCH', body);

        if (response.status !== 200) {
            throw Error('Не удалось изменить данные');
        }

        this.setState({
            places: this.state.places.map(p => p.id === place.id ? place : p)
        });
    }

    async deletePlace(place) {
        const response = await this.sendRequest(`${api}/${place.id}`, 'DELETE');
        let { places } = this.state.places;

        if (response.status === 200) {
            places = places.filter(p => p.id !== place.id);
        }

        this.setState({ places });
    }

    async clearPlaces() {
        const response = await this.sendRequest(api, 'DELETE');

        if (response.status === 200) {
            this.setState({ places: [] });
        }
    }

    async changeOrder(id, position) {
        if (position < 0 || position > this.state.places.length - 1) {
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
        const response = await this.sendRequest(`${api}/order`, 'PUT', body);

        if (response.status !== 200) {
            this.setState({ places: oldOrder });
        }
    }

    async changeFilters(search, visibility) {
        const response = await this.sendRequest(
            `${api}?pageSize=${pageSize}&search=${search}`, 'GET');
        const places = await response.json();

        this.setState({ search, visibility, places });
    }

    async sendRequest(url, method, body) {
        this.setState({ isFetching: true });
        try {
            const response = await fetch(url, { method, body, ...options });
            this.setState({ isFetching: false });

            return response;
        } catch (err) {
            this.setState({ isFetching: false });
            throw err;
        }
    }

    render() {
        const { search, visibility, places, isFetching } = this.state;

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
                <div style={`display: ${isFetching ? 'block' : 'none'}`} class={styles.loader}>
                    <Loader/>
                </div>
            </div>
        );
    }
}

const root = document.getElementById('app-root');
const application = <Application/>;
application.mount(root);
