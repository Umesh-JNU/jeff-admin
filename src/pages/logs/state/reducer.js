const getDiff = ({ start, end }) => {
  const obj = { end: '---', time: '---' };
  if (end) {
    const date1 = new Date(start);
    const date2 = new Date(end);

    const timeDiffMs = date2.getTime() - date1.getTime();

    const hours = String(Math.floor(timeDiffMs / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((timeDiffMs % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = Math.floor((timeDiffMs % (1000 * 60)) / 1000);

    obj.checkInDate = date1.toLocaleDateString();
    obj.checkOutDate = date2.toLocaleDateString();
    obj.end = date2.toLocaleTimeString();
    obj.time = `${hours}:${minutes}`;
  }

  return obj;
}

const getFormattedLogs = (logs) => {
  return logs.map((log) => {
    return {
      ...log,
      start: new Date(log.start).toLocaleTimeString(),
      ...getDiff(log)
    }
  })
}
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
        logs: getFormattedLogs(action.payload.logs),
        loading: false,
      };

    case "FETCH_DRIVER_SUCCESS":
      return {
        ...state,
        userLogs: getFormattedLogs(action.payload.userLogs),
        user: action.payload.user,
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