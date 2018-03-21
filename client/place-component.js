import * as NoReact from './no-react';
import styles from './place-component.css';

export class PlaceComponent extends NoReact.Component {

    root = null;
    input = null;
    checkbox = null;

    render() {
        const { place } = this.props;

        return (
            <article class={styles.container} ref={(el) => this.root = el}>
                <input type="checkbox" ref={(el) => this.checkbox = el}/>
                <input
                    ref={(el) => this.input = el}
                    type="text"
                    readonly={true}
                    value={place.title}
                    onBlur={this.onBlur}
                />
                <time>12.12.2012</time>
                <div class={styles.actions}>
                    <span class={styles.action} onClick={this.enableEditMode}>Изменить</span>
                    <spanx class={styles.action}>Удалить</spanx>
                </div>
            </article>
        );
    }

    enableEditMode = (e) => {
        e.preventDefault();
        this.input.removeAttribute('readonly');
    }

    onBlur = (e) => {
        const { title } = this.props.place;
        const newTitle = e.target.value;

        if (newTitle && newTitle !== title) {
            console.info(newTitle);
        }

        this.input.setAttribute('readonly', true);
    };
}
