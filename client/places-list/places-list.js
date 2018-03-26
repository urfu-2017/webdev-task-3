/* eslint-disable no-unused-vars */
import { Component } from '../component';
import { Place } from '../place/place';
import styles from './places-list.css';
/* eslint-enable no-unused-vars */

export class PlacesList extends Component {

    render() {
        return (
            <ul class={styles.placesList}>
                {this.props.places.map(place => (
                    <li class={styles.item} style={this._getStyle(place)}>
                        <Place
                            place={place}
                            onChangePlace={this.props.onChangePlace}
                            onDeletePlace={this.props.onDeletePlace}
                        />
                    </li>
                ))}
            </ul>
        );
    }

    _getStyle(place) {
        const { search, visibility } = this.props;
        const isDescription = place.description.toLowerCase().includes(search.toLowerCase());
        const isVisited = visibility === 'all' ||
            (visibility === 'visited' && place.isVisited) ||
            (visibility === 'unvisited' && !place.isVisited);

        return `display: ${isDescription && isVisited ? 'block' : 'none'}`;
    }
}
