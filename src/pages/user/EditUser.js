import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { useParams } from "react-router-dom";
import reducer from "./state/reducer";
import { getDetails, update } from "./state/action";
import { EditForm, UploadFileComp } from "../../components";
import PhoneInput, { PhoneNumber, isValidPhoneNumber, parsePhoneNumber } from 'react-phone-number-input'
import { toast } from "react-toastify";
import { toastOptions } from "../../utils/error";

export default function EditUserModel(props) {
	const { state } = useContext(Store);
	const { token } = state;
	const { id } = useParams();  // user/:id

	const [{ loading, error, loadingUpdate, user, success }, dispatch] = useReducer(reducer, {
		loading: true,
		loadingUpdate: false,
		error: "",
	});

	const userData = {
		email: "",
		firstname: "",
		lastname: "",
		mobile_no: "",
		country_code: "",
		role: "driver",
		profile_url: ""
	};
	const userAttr = [
		{
			type: "text",
			props: {
				label: "Firstname",
				name: "firstname",
				minLength: 4,
				maxLength: 30,
				required: true
			}
		},
		{
			type: "text",
			props: {
				label: "Lastname",
				name: "lastname",
				minLength: 4,
				maxLength: 30,
				required: true
			}
		},
		{
			type: "email",
			props: {
				label: "Email",
				name: "email",
				type: "email",
				required: true,
			}
		},
		// {
		// 	type: "select",
		// 	col: 12,
		// 	props: {
		// 		label: "Role",
		// 		name: "role",
		// 		value: 'driver',
		// 		placeholder: "Select Role",
		// 		options: [{ 'driver': 'Driver' }, { 'admin': 'Admin' }]
		// 	}
		// }
	];

	const [info, setInfo] = useState(userData);
	const [value, setValue] = useState();
	const [profileImg, setProfileImg] = useState();
	const handleImageChange = (location) => {
		setInfo({ ...info, profile_url: location });
		setProfileImg(location);
	}

	useEffect(() => {
		if (user && user._id === id) {
			console.log({ user })
			setInfo({
				email: user.email,
				firstname: user.firstname,
				lastname: user.lastname,
				country_code: user.country_code,
				mobile_no: user.mobile_no,
				role: user.role,
				profile_url: user.profile_url,
			});
			setValue(user.country_code + user.mobile_no);
			setProfileImg(user.profile_url);
		}

		(async () => {
			await getDetails(dispatch, token, id);
		})();
	}, [id, props.show]);

	const resetForm = () => {
		setInfo(userData);
		setProfileImg("")
	};
	const submitHandler = async (e) => {
		e.preventDefault();
		if (!isValidPhoneNumber(info.country_code + info.mobile_no)) {
			return toast.error("Please fill a valid mobile number", toastOptions);
		}

		await update(dispatch, token, id, info);
		if (success) {
			resetForm();
		}
	};

	return (
		<EditForm
			{...props}
			title="Edit Driver"
			data={info}
			setData={setInfo}
			inputFieldProps={userAttr}
			submitHandler={submitHandler}
			target="/admin/drivers"
			successMessage="Driver Updated Successfully! Redirecting..."
			reducerProps={{ loadingUpdate, error, success, dispatch }}
		>
			{user && value &&
				<>
					<p style={{ marginBottom: "0.5rem" }}>Mobile No.</p>
					<PhoneInput
						className="form-control"
						defaultCountry={parsePhoneNumber(value).country}
						value={value}
						onChange={(e) => {
							console.log(e);
							if (e) {
								setInfo({
									...info,
									country_code: '+' + parsePhoneNumber(e)?.countryCallingCode,
									mobile_no: parsePhoneNumber(e)?.nationalNumber
								});
							}
						}}
					/>
				</>}
			
			<p className="mb-3"></p>
			<UploadFileComp label="Upload Image" accept="image/*" file={profileImg} setFile={handleImageChange} fileType="image" />
		</EditForm>
	);
}