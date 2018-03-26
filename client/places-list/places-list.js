/* eslint-disable no-unused-vars */
import { Component } from '../component';
import { Place } from '../place/place';
import styles from './places-list.css';
/* eslint-enable no-unused-vars */

// eslint-disable-next-line no-empty-function
function stub() {}

export class PlacesList extends Component {

    _getStyle(place) {
        const { visibility } = this.props;
        const isVisited = visibility === 'all' ||
            (visibility === 'visited' && place.isVisited) ||
            (visibility === 'unvisited' && !place.isVisited);

        return `display: ${isVisited ? 'block' : 'none'}`;
    }

    render() {
        const { visibility, search } = this.props;
        const onChangeOrder = visibility === 'all' && !search ? this.props.onChangeOrder : stub;

        return (
            <ul class={styles.placesList}>
                {this.props.places.map((place, index) => (
                    <li class={styles.item} style={this._getStyle(place)}>
                        <Place
                            order={index}
                            place={place}
                            onChangePlace={this.props.onChangePlace}
                            onDeletePlace={this.props.onDeletePlace}
                            onChangeOrder={onChangeOrder}
                        />
                    </li>
                ))}
            </ul>
        );
    }
}
