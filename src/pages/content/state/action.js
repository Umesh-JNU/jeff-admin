
import axiosInstance from "../../../utils/axiosUtil";
import { getError } from "../../../utils/error";

export const create = async (dispatch, token, input) => {
  try {
    dispatch({ type: 'ADD_REQUEST' });
    const { data } = await axiosInstance.post(
      "/api/admin/content", input,
      { headers: { Authorization: token } }
    );

    setTimeout(() => {
      dispatch({ type: 'ADD_SUCCESS' });
    }, 1500);
  } catch (err) {
    dispatch({ type: "ADD_FAIL", payload: getError(err) });
  }
};

export const getContent = async (dispatch, token) => {
  try {
    dispatch({ type: "FETCH_REQUEST" });
    const { data } = await axiosInstance.get("/api/admin/content",
      { headers: { Authorization: token } }
    );
    console.log("content", data);
    dispatch({ type: "FETCH_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "FETCH_FAIL", payload: getError(error) });
  }
};

export const update = async (dispatch, token, info) => {
  console.log("update content", { info })
  const type = Object.keys(info)[0];
  try {
    dispatch({ type: "UPDATE_REQUEST" });

    await axiosInstance.put(`/api/admin/content/?TYPE=${type}`, info, {
      headers: { Authorization: token },
    });

    setTimeout(() => {
      dispatch({ type: "UPDATE_SUCCESS" });
    }, 2000);
  } catch (err) {
    dispatch({ type: "UPDATE_FAIL", payload: getError(err) });
  }
};
