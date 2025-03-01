import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../slices/authSlice.js"

import {apiConnector} from "../apiConnector.js"
import { endpoints } from "../apis.js"
import { setUser } from "../../slices/profileSlice.js"

const {
    SENDOTP_API,
    SIGNUP_API,
    LOGIN_API,
} = endpoints

export function sendOtp(email, navigate) { 
    return async (dispatch) => {
        // const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", SENDOTP_API, {
                email, 
                checkUserPresent: true,
            }) 
            console.log("SENDOTP API RESPONSE...........", response.data.message)

            if(!response.data.success) {
                toast.error(response.data.message)
                throw new Error(response.data.message)
            }
            toast.success("OTP Sent Successfully")
            navigate("/verify-email")

        } catch(error) {
            console.log("SENDOTP API ERROR...........", error)
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
        dispatch(setLoading(false))
        
    }
}

export function signUp(
    accountType,
    fullName,
    email, 
    password,
    confirmPassword, 
    otp,
    navigate
) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try{ 
            const response = await apiConnector("POST", SIGNUP_API, {
                accountType,
                fullName,
                email,
                password,
                confirmPassword,
                otp,
            })

            console.log("SIGNUP API RESPONSE...........", response)
            
            if(!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Signup Successful")
            navigate("/login")

        } catch(error) {
            console.log("SIGNUP API ERROR.............", error)
            toast.error()
            navigate("/signup")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate) {
    return async (dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                email, 
                password
            })
            // console.log("LOGIN API RESPONSE..............", response) 
            if(!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Login Successful")
            
            dispatch(setToken(response.data.token))
            const userImage = response.data?.user?.image
                ? response.data.user.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.fullName}`
            dispatch(setUser({ ...response.data.user, image: userImage }))

            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("user", JSON.stringify(response.data.user))
            navigate("/")
        } catch(error) {
            console.log("LOGIN API ERROR..............", error)
            toast.error("Login Failed")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}

export function getPasswordResetToken(email, setEmailSent) {
    return async (dispatch) => {
        dispatch(setLoading(true))
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})

            console.log("RESET PASSWORD TOKEN RESPONSE..........", response)

            if(!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Reset Email Sent")
            setEmailSent(true)
        } catch(error) {
            console.log("RESET PASSWORD TOKEN ERROR", error)
            toast.error("Failed To Send Email For Resetting Password");
        }
        dispatch(setLoading(false))
    }
}


export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, { password, confirmPassword, token });

      console.log("RESET Password RESPONSE ... ", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Has Been Reset Successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error............", error);
      toast.error("Unable To Reset Password");
    }
    dispatch(setLoading(false));
  }
}

