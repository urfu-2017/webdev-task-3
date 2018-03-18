import './style.css';

class App {
    constructor(container, props) {
        this.container = container;
        this.props = props;
    }

    render() {
        this.container.innerText = this.props.text;
    }
}

export default App;
