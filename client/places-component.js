/* eslint-disable no-unused-vars */
import * as NoReact from './no-react';
import { PlaceComponent } from './place-component';

export class PlacesComponent extends NoReact.Component {

    constructor(props) {
        super(props);

        this.placesContainer = null;
    }

    render() {
        return (
            <main>
                <header>
                    <input type="text"/>
                </header>
                <ul ref={(el) => this.placesContainer = el} />
            </main>
        );
    }

    addPlace(place) {
        this.placesContainer.appendChild(
            <li><PlaceComponent place={place}/></li>
        );
    }
}
