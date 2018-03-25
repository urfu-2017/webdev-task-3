import './common.css';
import './App.css';

import Main from '../Main';
import Header from '../Header';
import Footer from '../Footer';
import Component from '../Component';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(new Header({ elemClass: 'page__header' }).render());
        fragment.appendChild(new Main({ elemClass: 'page__main' }).render());
        fragment.appendChild(new Footer({ elemClass: 'page__footer' }).render());

        return fragment;
    }
}

export default App;
