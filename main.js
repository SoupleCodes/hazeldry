const ws = new WebSocket("wss://chaos.goog-search.eu.org/")
const posts = document.getElementById("posts")
const contents = document.getElementById("contents")

function buildPost(msg) {
    const post = document.createElement("div")
    post.classList.add("post")
    post.id = msg._id

    const pfpcontainer = document.createElement("div")
    pfpcontainer.classList.add("post-pfp-container")

    const pfp = document.createElement("img")
    pfp.src = msg.author.avatar
    pfp.classList.add("post-pfp")
    pfpcontainer.appendChild(pfp)
    post.appendChild(pfpcontainer)

    const content = document.createElement("div")
    content.classList.add("post-content")
    content.innerText = "@" + msg.author.username + " - " + msg.content
    post.appendChild(content)

    const calc = Math.ceil(contents.scrollHeight - contents.scrollTop)
    posts.appendChild(post)
    if(calc === contents.clientHeight) {
        contents.scrollTo({ top: contents.scrollHeight, behavior: 'smooth'})
    }

    console.log(msg)
}

ws.onmessage = (e) => {
    let data = JSON.parse(e.data)
    switch (data.command) {
        case "greet":
            let messages = data.messages.reverse()
            messages.forEach(message => {
                buildPost(message)
            })
            contents.scrollTop = contents.scrollHeight
            break
        case "new_post":
            buildPost(data.data)
            break
        default:
            console.log(data)
    }
}