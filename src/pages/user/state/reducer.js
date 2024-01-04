export default function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
    case "ADD_REQUEST":
    case "UPDATE_DETAILS_REQUEST":
      return { ...state, loading: true };

    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        userCount: action.payload.userCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user
      };

    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };

    case "UPDATE_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        users: action.payload.users
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deleteduserId = action.payload;
      const updatedusers = state.users.filter(user => user._id !== deleteduserId);
      const updateduserCount = state.userCount - 1;
      return {
        ...state,
        users: updatedusers,
        userCount: updateduserCount,
        loading: false
      };

    case "FETCH_FAIL":
    case "ADD_FAIL":
    case "FETCH_DETAILS_FAIL":
    case "UPDATE_DETAILS_FAIL":
    case "UPDATE_FAIL":
      return { ...state, loading: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};