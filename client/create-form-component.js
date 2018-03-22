import * as NoReact from './no-react';

export class CreateFormComponent extends NoReact.Component {

    constructor(props) {
        super(props);

        this.title = '';
        this.error = null;
    }

    render() {
        return (
            <form class="create-form" onSubmit={this.onSubmitForm}>
                <h2 class="create-form__title">Добавление нового места</h2>
                <input
                    type="text"
                    class="input create-form__input"
                    placeholder="Введите название места"
                    onInput={this.onInput}
                />
                <div class="error create-form__error" ref={(el) => this.error = el}/>
                <button class="button">Добавить</button>
            </form>
        );
    }

    onSubmitForm = (e) => {
        e.preventDefault();

        if (!this.title) {
            this.error.innerHTML = 'Название места не может быть пустым';
            this.error.classList.remove('hidden');

            return;
        }

        this.error.classList.add('hidden');
        this.props.onSubmit({ title: this.title }).then(() => e.target.reset());
    }

    onInput = (e) => {
        this.title = e.target.value;

        if (!this.error.classList.contains('hidden')) {
            this.error.innerHTML = '';
            this.error.classList.add('hidden');
        }
    }
}
