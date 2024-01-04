export default function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "ADD_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        trucks: action.payload.trucks,
        truckCount: action.payload.truckCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        truck: action.payload.truck
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deleteId = action.payload;
      const updatedList = state.trucks.filter(truck => truck._id !== deleteId);
      const updatedListCount = state.truckCount - 1;
      return {
        ...state,
        trucks: updatedList,
        truckCount: updatedListCount,
        loading: false,
        success: true
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'CLEAR_SUCCESS':
      return { ...state, success: null };

    default:
      return state;
  }
};