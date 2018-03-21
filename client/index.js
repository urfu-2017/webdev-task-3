/* eslint-disable no-unused-vars */
import * as NoReact from './no-react';
import { CreateFormComponent } from './create-form-component';
import { PlacesComponent } from './places-component';

document.addEventListener('DOMContentLoaded', () => {

    let placesComponent = null;

    function createNewPlace(place) {
        placesComponent.addPlace(place);

        return Promise.resolve();
    }

    const rootElement = (
        <div>
            <CreateFormComponent onSubmit={createNewPlace} />
            <PlacesComponent ref={(el) => placesComponent = el}/>
        </div>
    );

    document.body.appendChild(rootElement);
});
