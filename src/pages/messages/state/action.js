
import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const getAll = async (dispatch, token, curPage, resultPerPage, query) => {
  let url = `/api/admin/enquiry/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`;

  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get(
      url,
      { headers: { Authorization: token } }
    );
    console.log("all message", data);
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const del = async (dispatch, token, id) => {
  if (
    window.confirm("Are you sure you want to delete this message?") === true
  ) {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      await axiosInstance.delete(`/api/admin/enquiry/${id}`, {
        headers: { Authorization: token },
      });
      dispatch({ type: "DELETE_SUCCESS", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_FAIL", payload: getError(error) });
    }
  }
}

export const getDetails = async (dispatch, token, id) => {
  // console.log(token, id);
  try {
    dispatch({ type: "FETCH_DETAILS_REQUEST" });

    const { data } = await axiosInstance.get(`/api/admin/enquiry/${id}`, {
      headers: { Authorization: token },
    });

    console.log("message", data);
    dispatch({ type: "FETCH_DETAILS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({
      type: "FETCH_DETAILS_FAIL",
      payload: getError(err),
    });
  }
};