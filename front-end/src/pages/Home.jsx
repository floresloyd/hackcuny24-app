/* eslint-disable no-unused-vars */
import { signOut } from "firebase/auth"
import userDatabase from "../Fireserver"
import { useNavigate } from "react-router-dom"

function Home() {
    const history = useNavigate();

    const handleSignOut = () => {
        signOut(userDatabase).then(val =>{
            console.log(val, "val")
            history("/")
        })
    }

    return (
        <div>
            <h1> Home </h1>
            <button onClick={handleSignOut}>Sign Out</button>
        </div>
    )
}

export default Home 