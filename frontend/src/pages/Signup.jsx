import signupImg from "../assets/signup.svg"
import { Template } from "../components/core/auth/Template"

export const Signup = () => {
    return (
        <div className="kartik">
        <Template 
            title = "Sign Up"
            image = {signupImg}
            formType = "signup"
        />
        </div>
    )
}

