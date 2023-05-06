async function addItem(e) {
    try {
        e.preventDefault()

        const Item = {
            amount: e.target.Number.value,
            description: e.target.Desc.value,
            Item: e.target.item.value
        }
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:3000/expense/addItem', Item, { headers: { "authentication": token } })
        showOnScreen(response.data.expense)
    } catch (err) {
        document.body.innerHTML += `<div>${err}</div>`
    }
}

function showOnScreen(data) {
    const parentNode = document.getElementById('itemList')
    const childNode = `<li id="${data._id}" >${data.Item} ${data.description} ${data.amount} <button style="margin-top: 10px;" class="btn btn-danger" onclick="deleteItem('${data._id}')" >delete expense</button></li>`
    parentNode.innerHTML += childNode
}

function parseJwt(token) {
    try {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' +c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (err) {
        console.log(err)
    }
}

window.addEventListener('DOMContentLoaded', () => {
    var page = 1
    localStorage.setItem('limit',3)
    var limit=localStorage.getItem('limit')
    const token = localStorage.getItem("token")
    const decoded = parseJwt(token)
    if (decoded.ispremium) {
        document.getElementById('message').innerHTML = `<h5>you are primum user</h5>`
        showLeaderBoard()
        document.getElementById('rzp-button').style.visibility = "hidden"
    }

    axios.get(`http://localhost:3000/expense/getItem?page=${page}&limit=${limit}`, { headers: { "authentication": token } })
        .then((response) => {
            for (var i = 0; i < response.data.expense.length; i++) {

                showOnScreen(response.data.expense[i])
            }
                showPage(response.data)
        })
})

// pagination
const pagination = document.getElementById('pagination')
function showPage({
    hasnextpage,
    nextpage,
    currentpage,
    haspreviouspage,
    previouspage
}) {
    pagination.innerHTML = ''
    if (haspreviouspage) {
        const btn2 = document.createElement('button')
        btn2.innerHTML = previouspage
        btn2.addEventListener('click', () => getExpenses(previouspage))
        pagination.appendChild(btn2)
    }
    const btn1 = document.createElement('button')
    btn1.innerHTML = `<h3>${currentpage}</h3>`
    btn1.addEventListener('click', () => getExpenses(currentpage))

    if(hasnextpage){
        const btn3 = document.createElement('button')
        btn3.innerHTML = nextpage
        btn3.addEventListener('click', () => getExpenses(nextpage))
        pagination.appendChild(btn3)
    }
}

function getExpenses(page) {
    const limit = localStorage.getItem('limit')
    const token = localStorage.getItem('token')
    axios.get(`http://localhost:3000/expense/getItem?page=${page}&limit=${limit}`, { headers: { "authentication": token } })
        .then((response) => {
            console.log(response)
            document.getElementById('itemList').innerHTML=""
            for(var i=0;i<response.data.expense.length;i++){
                showOnScreen(response.data.expense[i])
            }
            showPage(response.data)
        })
}


function deleteItem(itemId) {
    const token = localStorage.getItem('token')
    axios.delete(`http://localhost:3000/expense/deleteItem/${itemId}`, { headers: { "authentication": token } })
        .then((response) => {
            if (response.status === 201) {
                const parentNode = document.getElementById('itemList')
                const childnode = document.getElementById(itemId)
                parentNode.removeChild(childnode)
            }
        })

}

document.getElementById('rzp-button').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:3000/purchase/buyPremium', { headers: { "authentication": token } })

    var option = {
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            const res = await axios.post('http://localhost:3000/purchase/updatetransaction', {
                order_id: option.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { "authentication": token } })

            alert('you are premium user now')
            document.getElementById('rzp-button').style.visibility = "hidden"
            document.getElementById('download').style.visibility = "visible"
            document.getElementById('message').innerHTML = `<h5>you are primum user</h5>`
            localStorage.setItem('token', res.data.token)
            showLeaderBoard()
        }
    }
    const rzp1 = new Razorpay(option)
    rzp1.open();
    e.preventDefault()
}

function showLeaderBoard() {
    document.getElementById('download').style.visibility = "visible"
    const inputElement = document.createElement('input')
    inputElement.type = 'button'
    inputElement.value = 'show leaderboard'
    inputElement.onclick = async () => {
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:3000/premium/leaderboard', { headers: { "authentication": token } })

        const leaderboard = document.getElementById('leaderboard')
        leaderboard.innerHTML = `<h5> leader board</h5>`

        response.data.forEach((userDetails) => {
            console.log(userDetails)
            leaderboard.innerHTML += `<li>Name - ${userDetails.Name} total amount-${userDetails.total_amount}</li>`
        })
    }
    document.getElementById('message').appendChild(inputElement)
}

async function download() {
    const token = localStorage.getItem('token')
    axios.get('http://localhost:3000/expense/download', { headers: { "authentication": token } })
        .then((response) => {
            if (response.status == 201) {
                var a = document.createElement("a");
                a.href = response.data.fileUrl;
                a.download = 'myexpense.txt';
                a.click();
                alert("download successfully")

            } else {
                throw new Error(response.data.message)
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

function setLimit(e){
    e.preventDefault()

    const limit=document.getElementById('limit').value
    localStorage.setItem('limit',limit)
    getExpenses()

}