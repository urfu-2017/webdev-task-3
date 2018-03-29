export function processTravelOnMouseOver() {
    const cancelButton = this.querySelector('.travel__cancel-button');
    const okButton = this.querySelector('.travel__ok-button');
    const title = this.querySelector('.travel__title');
    okButton.style.display = 'block';
    cancelButton.style.display = 'block';
    title.disabled = false;
    title.style.border = 'solid 1px #000';
}

export function processTravelOnMouseOut() {
    const cancelButton = this.querySelector('.travel__cancel-button');
    const okButton = this.querySelector('.travel__ok-button');
    const title = this.querySelector('.travel__title');
    cancelButton.style.display = 'none';
    okButton.style.display = 'none';
    title.style.border = 'none';
}
