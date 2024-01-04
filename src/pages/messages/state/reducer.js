export default function userReducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
    case "FETCH_DETAILS_REQUEST":
      return { ...state, loading: true };

    case "FETCH_SUCCESS":
      return {
        ...state,
        messages: action.payload.messages,
        messageCount: action.payload.messageCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        message: action.payload.message
      };

    case "DELETE_SUCCESS":
      const deleteId = action.payload;
      const updatedList = state.messages.filter(message => message._id !== deleteId);
      const updatedListCount = state.messageCount - 1;
      return {
        ...state,
        messages: updatedList,
        messageCount: updatedListCount,
        loading: false,
        success: true
      };

    case "FETCH_FAIL":
    case "FETCH_DETAILS_FAIL":
      return { ...state, loading: false, loadingUpdate: false, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    case 'CLEAR_SUCCESS':
      return { ...state, success: null };

    default:
      return state;
  }
};