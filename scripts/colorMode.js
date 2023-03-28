function switchMode() {
    const root = document.querySelector(':root').style

    if (localStorage.getItem('mode') === 'light') {
        localStorage.setItem('mode', 'dark')
        root.setProperty('--bg-color', '#1f1f1f')
        root.setProperty('--list-color', '#343434')
        root.setProperty('--header-color', '#04ace9')
        root.setProperty('--hover-color', '#404040')
        root.setProperty('--font-color', '#f9f9f9')
        document.querySelector('#color-mode-ico').src = "./ico/dark-mode.png"
        document.querySelectorAll('.list-edit').forEach((el) => el.src = "./ico/edit-dark-mode.png")
    }
    else {
        localStorage.setItem('mode', 'light')
        root.setProperty('--bg-color', '#e4f5fc')
        root.setProperty('--list-color', '#d0effc')
        root.setProperty('--header-color', '#00b9ff')
        root.setProperty('--hover-color', '#c5dde7')
        root.setProperty('--font-color', '#343434')
        document.querySelector('#color-mode-ico').src = "./ico/light-mode.png"
        document.querySelectorAll('.list-edit').forEach((el) => el.src = "./ico/edit-light-mode.png")
    }

}

export {switchMode}