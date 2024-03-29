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
        locations: action.payload.locations,
        locationCount: action.payload.locationCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        location: action.payload.location
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deleteId = action.payload;
      const updatedList = state.locations.filter(location => location._id !== deleteId);
      const updatedListCount = state.locationCount - 1;
      return {
        ...state,
        locations: updatedList,
        locationCount: updatedListCount,
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