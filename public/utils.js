'use strict'

const clearChildren = node => {
    while (node.firstChild) 
        node.removeChild(node.firstChild)
}

const queryToString = obj => Object.entries(obj)
    .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v))
    .join('&')

const jetch = async (url, method = 'GET', body = null, query = null) => {
    if (query !== null) {
        url += '?' + queryToString(query)
    }
    const options = { method, headers: { 'Content-Type': 'application/json' } }
    if (body !== null) {
        options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    if (response.status != 200) {
        alert('Не удалось выполнить запрос')
        throw new Error(`Request failed: ${method} ${response.url}, code=${response.status}`)
    }
    return response
}


const ofClass = classname => Array.from(document.querySelectorAll(`.${classname}`))

const nop = () => {}

const setSubmitButton = (node, btnOk, btnCancel) => {
    const ENTER_CODE = 13
    const ESC_CODE = 27

    node.onkeydown = e => {
        if (btnOk && e.keyCode === ENTER_CODE) {
            btnOk.click()
        } else if (btnCancel && e.keyCode === ESC_CODE) {
            btnCancel.click()
        }
    }
}
