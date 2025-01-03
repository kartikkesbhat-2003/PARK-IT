import signupImg from "../assets/signup.svg"
import { Template } from "../components/core/auth/Template"

export const Signup = () => {
    return (
        <Template 
            title = "Sign Up"
            image = {signupImg}
            formType = "signup"
        />
    )
}

