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
        mills: action.payload.mills,
        millCount: action.payload.millCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        mill: action.payload.mill
      };
    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deleteId = action.payload;
      const updatedList = state.mills.filter(mill => mill._id !== deleteId);
      const updatedListCount = state.millCount - 1;
      return {
        ...state,
        mills: updatedList,
        millCount: updatedListCount,
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