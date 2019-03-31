const serviceWorker = navigator.serviceWorker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        serviceWorker.register('./sw.js').then(registration => {
            console.log('sw registration successful with scope: ' + registration.scope)
            serviceWorker.addEventListener('message', event => {
                const msgEl = document.getElementById('msg')
                msgEl.textContent = event.data
            })
        }).catch(err => {
            console.log('sw registration failed:' + err)
        })
    })
    const form = document.getElementById('form')
    const input = document.getElementById('input')
    form.addEventListener('submit', event => {
        event.preventDefault()
        const val = input.value.trim() 
        if (!val) {
            return
        } 
        serviceWorker.controller && serviceWorker.controller.postMessage(val)
    })
}
