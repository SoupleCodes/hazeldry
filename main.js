const ws = new WebSocket("wss://chaos.goog-search.eu.org/")
const posts = document.getElementById("posts")
const contents = document.getElementById("contents")

function buildPost(msg) {
    const post = document.createElement("div")
    post.classList.add("post")
    post.id = msg._id

    // Pfp
    const pfpcontainer = document.createElement("div")
    pfpcontainer.classList.add("post-pfp-container")

    const pfp = document.createElement("img")
    pfp.src = msg.author.avatar
    pfp.classList.add("post-pfp")
    pfpcontainer.appendChild(pfp)
    post.appendChild(pfpcontainer)

    // Content
    const content = document.createElement("div")
    content.classList.add("post-content")

    
    content.innerText = "@" + msg.author.username + " - " + msg.content
    post.appendChild(content)

    const scrollThreshold = 100;
    const isNearBottom = contents.scrollHeight - contents.scrollTop <= contents.clientHeight + scrollThreshold;
    posts.appendChild(post)
    if(isNearBottom) {
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
        case "deleted_post":
            document.getElementById(data._id).remove()
            break
        case "edited_post":
            let targElement = document.getElementById(data._id)
            let author = targElement.innerText.split(" - ")[0]
            targElement.querySelector(".post-content").innerText = author + " - " + data.content
            break
        default:
            console.log(data)
    }
}