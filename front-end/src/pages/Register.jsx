import { useNavigate } from "react-router-dom"
import userDatabase from "../Fireserver"
import { createUserWithEmailAndPassword } from "firebase/auth"

function Login() {
    const history = useNavigate() // Routes 

    const handleSignUp =(e)=> {
        e.preventDefault() // Prevents browser refresh
        const email = e.target.email.value
        const password = e.target.password.value

        createUserWithEmailAndPassword(userDatabase, email, password).then(data =>{
            console.log(data, "authdata")
            history("/")
        }).catch(err => {
            alert(err.code)
        })
    }

    return (

        <div>
            <h1> Register </h1>
            <form onSubmit={(e) => handleSignUp(e)}>
                <input type="text" name='email' placeholder="Email" />
                <input type="password" name='password' placeholder="Password"/>
                <button> signup</button>
            </form>


        </div>
    )
}

export default Login
