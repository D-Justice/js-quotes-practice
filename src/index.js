document.addEventListener('DOMContentLoaded', () => {
    const baseURL = 'http://localhost:3000'
    const quoteList = document.getElementById('quote-list')
    const quoteForm = document.getElementById('new-quote-form')
    const quoteInput = document.getElementById('new-quote')
    const authorInput = document.getElementById('author')
    //Used to update like number before page reload
    let failLike = 0

    const render = (data) => {
        
        
        for (let i in data) {

            const quoteContainer = document.createElement('li')
            const quoteItem = document.createElement('blockquote')
            const author = document.createElement('p')
            const likes = document.createElement('p')
            const likeButton = document.createElement('button')
            const deleteButton = document.createElement('button')
            try {
                var likesNumber = data[i].likes.length
                console.log('hit')
            }
            catch {
                var likesNumber = 0
            }
            console.log(likesNumber)
            quoteItem.innerHTML = `<br>${data[i].quote}`
            author.textContent = data[i].author
            likeButton.textContent = 'LIKE: '
            likes.textContent = `${likesNumber}`
            deleteButton.textContent = 'Delete'

            quoteContainer.style.borderLeft = '5px solid #c7cdd1'
            quoteContainer.style.paddingLeft = '20px'

            author.style.fontSize = '1.5vw'
            quoteItem.style.fontSize = '2vw'
            likes.style.paddingLeft = '10px'
            likes.style.display = 'inline'
            deleteButton.style.marginTop = '20px'
            deleteButton.style.display = 'block'
            
            
            quoteContainer.appendChild(quoteItem)
            quoteContainer.appendChild(author)
            quoteContainer.appendChild(likeButton)
            quoteContainer.appendChild(likes)
            quoteContainer.appendChild(deleteButton)
            
            quoteList.appendChild(quoteContainer)

            deleteButton.addEventListener('click', (e) => {
                console.log(data[i])
                deleteQuote(data[i].id)
                e.target.parentNode.remove()

            })
            likeButton.addEventListener('click', (e) => {
                let newLike = {
                    'quoteId': (data[i].id),
                    'createdAt': Date.now()
                    
                }
                try {
                    likes.textContent = (data[i].likes.length += 1)
                }
                catch {
                    likes.textContent = failLike += 1
                }
                
                addLike(newLike)
            })
        }
    }

    const addLike = (element) =>{
        fetch(`${baseURL}/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(element)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Like Sent')
        })

    }

    const deleteQuote = (quoteID) => {
        fetch(`${baseURL}/quotes/${quoteID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))
    }
    const createQuote = () => {
        newQuote({
            'quote': quoteInput.value,
            'author': authorInput.value
            
        })
    }
    const fetchQuotes = () => {
        fetch(`${baseURL}/quotes?_embed=likes`) 
        .then(response => response.json())
        .then(data => render(data))
        .catch(error => console.log(error))
    }
    const newQuote = (quote) => {
        fetch(`${baseURL}/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        })
        .then(response => response.json())
        .then(data => {
            let newData = [data]
            render(newData)
        })
        
    }



fetchQuotes()
quoteForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(authorInput.value, quoteInput.value)
    createQuote()
    quoteForm.reset()
})
//fetchLikes()
})