const tabs = document.querySelectorAll('[data-msg-tab-target]')
const tabContents = document.querySelectorAll('[data-msg-tab-content]')

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.msgTabTarget)
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('active-tab');
        })
        target.classList.add('active-tab')
    })
})
