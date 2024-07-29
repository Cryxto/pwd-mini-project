import { DashboardActionType, DashboardInterface,  } from "./dashboardAnnotation";

export const dashboardReducer = (state:DashboardInterface, action: DashboardActionType )=>{
  switch (action.type) {
    case "POPULATE":
      return {
        ...state, 
        Organization : action.payload
      }
    case "GET" :
      return {
        ...state
      }
    
    default:
      throw new Error("Unknown action");
  }
}

