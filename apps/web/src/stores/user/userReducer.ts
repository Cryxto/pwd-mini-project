import { UserActionType, UserStateInterface } from "./userAnnotation";

export const userReducer = (state:UserStateInterface, action: UserActionType)=>{
  switch (action.type) {
    case "SIGN_IN":
      return {
        ...state, 
        user: action.payload.user,
        isSignIn: action.payload.isSignIn
      }
    case "SIGN_OUT" :
      return {
        ...state,
        user : null,
        isSignIn : false
      }
    case "INFO":
      return state
    default:
      throw new Error("Unknown action");
  }
}

