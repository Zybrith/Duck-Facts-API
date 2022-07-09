const update = document.querySelector('#update-button')
const removeButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

const fact = {
    fact: 'Ducks cannot effectively use modern fax machines, because of the way that they are.',
    author: 'Faxing Facter'
}

const removeAuthor = {
    author: 'Faxing Facter'
}

update.addEventListener('click', _=>{
    fetch('/facts', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(fact)
    })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(res => {
            window.location.reload(true)
        })
})

removeButton.addEventListener('click', _ => {
    fetch('/facts', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(removeAuthor)
    })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(res => {
            if (res == 'No fact to delete'){
                messageDiv.textContent = 'There is no faxed Faxing Facter fact to delete.'
            }else{
                window.location.reload()
            }
        })
})