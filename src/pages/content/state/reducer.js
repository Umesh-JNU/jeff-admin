export default function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "ADD_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        content: action.payload.content,
        loading: false,
      };

    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };

    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "FETCH_FAIL":
    case "ADD_FAIL":
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