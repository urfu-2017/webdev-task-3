function htmlToElement(html) {
    html = html.trim();

    const template = document.createElement('template');
    template.innerHTML = html;

    return template.content.firstChild;
}

export default htmlToElement;
