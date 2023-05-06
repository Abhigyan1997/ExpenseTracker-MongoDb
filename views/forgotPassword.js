async function forgotPassword(e){
    e.preventDefault()
    const data={
        email:e.target.Email.value
    }
    const response=await axios.post('http://localhost:3000/password/forgotpassword',data)
}