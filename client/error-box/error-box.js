import { Component } from '../component';
import styles from './error-box.css';

export class ErrorBox extends Component {

    render() {
        const error = this.props.error;
        const className = styles.errorBox + (error ? ` ${styles.visible}` : '');

        return (
            <div class={className}>{String(error)}</div>
        );
    }
}
