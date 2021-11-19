const urlForm = document.getElementById("url-form")
const hamburger = document.getElementById("hamburger")
const links = document.querySelectorAll(".nav-link")



// ====================
// Navigation 

const toggleNav = () => {
    const nav = document.querySelector(".nav-items")
    nav.classList.toggle("nav-open")
}

// ====================
// Error Handling

const removeError = () => {
    const input = document.getElementById("input")
    const errorMsg = document.querySelector(".error-msg")
    input.classList.remove("error")
    errorMsg.style.display = "none"

}

const invalidUrl = () => {
    const errorMsg = document.querySelector(".error-msg")
    const input = document.getElementById("input")
    errorMsg.textContent = "Invalid URL.."
    errorMsg.style.display = "block"
    input.classList.add("error")
}

const empty = () => {
    const errorMsg = document.querySelector(".error-msg")
    const input = document.getElementById("input")
    errorMsg.textContent = "Please add a link"
    errorMsg.style.display = "block"
    input.classList.add("error")
    return false
}

const checkUsrInput = () => {
    const input = document.getElementById("input")
    const usrInput = input.value
    input.value = ""
    const url = usrInput === "" ? empty() : usrInput 
    return url
}


// ====================
// Onclick function

const copyUrl = (btn) => {
    btn.style.background = "black"
    btn.textContent = "Copied!"
    const txtBox = document.createElement("textarea")
    const url = btn.previousElementSibling
    txtBox.textContent = url.textContent
    /* Select the text field */
    txtBox.select()
    txtBox.setSelectionRange(0, 99999) /* For mobile devices */
    /* Copy the text inside the text field */
    navigator.clipboard.writeText(txtBox.textContent)
    /* Alert the copied text */
    alert(`${txtBox.textContent} copied to clipboard.`);
}

// ====================
// Render functions

const showShortContainer = (div) => {
    const shortsContainer = document.querySelector(".shorts-container")
    shortsContainer.style.display = "block"
    shortsContainer.appendChild(div)
    const features = document.querySelector(".features")
    features.style.paddingTop = "5em"
}

const displayUrl = res => {
    removeError()
    const div = fillTemplate(res)
    saveToLocalStorage(res)
    showShortContainer(div)
}

// =======================
// Html Template function

const fillTemplate = (data) => {
    const content = document.getElementById("short-temp").content
    const copyHtml = document.importNode(content, true)
    const div = copyHtml.querySelector(".short-container")
    const og = copyHtml.querySelector(".og-url")
    const short = copyHtml.querySelector(".short-url")

    if(data.result) {
        og.textContent = data.result.original_link
        short.textContent = data.result.short_link
    }else {
        og.textContent = data.ogUrl
        short.textContent = data.Short
    }
    return div
}


// =======================
// Local Storage Functions

const saveToLocalStorage = (res) => {
    const ogUrl = res.result.original_link
    const shortUrl = res.result.short_link
    const url = {ogUrl : ogUrl , Short : shortUrl}

    let urlStorage = localStorage.getItem("urls")

    ? JSON.parse(localStorage.getItem("urls"))
    : [];
    urlStorage.push(url)
    localStorage.setItem("urls", JSON.stringify(urlStorage));
}

const getLocalStorage = () => {
    const urls = JSON.parse(localStorage.getItem("urls"))
    if(urls) {
        urls.forEach(url => {
            const div = fillTemplate(url)
            showShortContainer(div)
        })
    }
}


// =======================
// Fetch Functions

const handleResponse = (res) => {
    res ? displayUrl(res) : invalidUrl()
}

const fetchUrl = async (url) => {
    const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`)
    let data = await res.json()
    data = data.ok ? data : false
    return data
}

const shortenUrl = (e) => {
    e.preventDefault()
    const url = checkUsrInput()
    if(url) {
        fetchUrl(url).then(res => {
            handleResponse(res)
        })
    }
}

const deleteShorts = () => {
    localStorage.clear()
    window.location.reload()
    console.log("X")
}


getLocalStorage()
urlForm.addEventListener("submit", shortenUrl)
hamburger.addEventListener("click", toggleNav)
links.forEach(link => {
    link.addEventListener("click", toggleNav)
})
// localStorage.clear()









