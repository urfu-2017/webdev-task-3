import { Component } from '../component/index';
import s from './error-box.css';

export class ErrorBox extends Component {

    render() {
        const error = this.props.error;
        const className = s.errorBox + (error ? ` ${s.visible}` : '');
        console.info(className);

        return (
            <div class={className}>{String(error)}</div>
        );
    }
}
