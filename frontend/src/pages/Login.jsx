import loginImg from "../assets/login.svg"
import { Template } from "../components/core/auth/Template"

export const Login = () => {
    return (
        <Template 
            title = "Log In"
            image={loginImg}
            formType = "login"
        />
    )
}
