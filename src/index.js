import App from './components/App';
import PlacesList from './components/PlacesList';

document.getElementById('root').innerHTML = new PlacesList({ greeter: 'Hello' }).render();
