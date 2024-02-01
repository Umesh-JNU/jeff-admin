export default function tripReducer(state, action) {
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
        trips: action.payload.trips,
        tripCount: action.payload.tripCount,
        loading: false,
      };

    case "FETCH_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        trip: action.payload.trip,
        subTrip: action.payload.subTrip
      };

    case "ADD_SUCCESS":
      return { ...state, loading: false, success: true };

    case "UPDATE_DETAILS_SUCCESS":
      return {
        ...state,
        loading: false,
        trip: action.payload.trip,
        trips: action.payload.trips
      };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, success: true };

    case "DELETE_SUCCESS":
      const deletedtripId = action.payload;
      const updatedtrips = state.trips.filter(trip => trip._id !== deletedtripId);
      const updatedtripCount = state.tripCount - 1;
      return {
        ...state,
        trips: updatedtrips,
        tripCount: updatedtripCount,
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