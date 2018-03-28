import { Component } from '../component';
import loader from './loader.svg';
import styles from './loader.css';

export class Loader extends Component {

    shouldUpdate() {
        return false;
    }

    render() {
        return (
            <img class={styles.loader} src={loader} alt=""/>
        );
    }
}
