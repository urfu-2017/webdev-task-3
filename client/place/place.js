import { Component } from '../component/index';
import s from './place.css';

export class Place extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditMode: false
        };

        this.input = null;

        this.onVisitChange = this.onVisitChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.enableEdit = this.enableEdit.bind(this);
        this.disableEdit = this.disableEdit.bind(this);
    }

    render() {
        const { description, isVisited } = this.props.place;
        const { isEditMode } = this.state;

        return (
            <div class={s.place}>
                <input
                    onChange={this.onVisitChange}
                    class={s.visit}
                    type="checkbox"
                    checked={isVisited}
                />
                <input
                    ref={el => this.input = el}
                    class={s.name}
                    type="text"
                    readonly={!isEditMode}
                    value={description}
                />
                <span
                    onClick={this.enableEdit}
                    class={s.action}
                    title="Редактировать"
                >
                    &#9998;
                </span>
                <span onClick={this.onDelete} class={s.action} title="Удалить">&#10006;</span>
            </div>
        );
    }

    onVisitChange(evt) {
        const isVisited = evt.target.checked;

        if (this.state.isFetching) {
            return;
        }

        this.props.onChangePlace({ ...this.props.place, isVisited })
            .catch(() => {
                evt.target.checked = !isVisited;
            });
    }

    onDescriptionChange() {
        const newDescription = this.input.value;
        const place = this.props.place;

        if (!newDescription || (newDescription === place.description)) {
            this.input.value = place.description;
            return;
        }

        this.props.onChangePlace({ ...this.props.place, description: newDescription })
            .catch(() => {
                this.input.value = place.description;
            });
    }

    onDelete() {
        this.props.onDeletePlace(this.props.place);
    }

    enableEdit() {
        this.setState({ isEditMode: true });
        this.input.focus();

        setTimeout(() => {
            document.addEventListener('click', this.disableEdit);
        }, 300);
    }

    disableEdit(evt) {
        if (evt.target !== this.input) {
            this.setState({ isEditMode: false });
            document.removeEventListener('click', this.disableEdit);
            this.onDescriptionChange();
        }
    }
}
