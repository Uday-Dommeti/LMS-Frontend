import { useFormik } from "formik"
import { useCreateAccountMutation } from "../../services/user";
import { Link, useNavigate } from "react-router-dom";

function SignUp() {

    const [createAccountFn] = useCreateAccountMutation();
    const navigate = useNavigate();

    const SignupForm = useFormik({
        initialValues: {
            username: "",
            email: "",
            phone: "",
            role: "",
            password: ""
        },
        onSubmit: async (values) => {
            const res = await createAccountFn(values);
            SignupForm.resetForm();
            if (res?.data?.message === "Account created successfully") {
                alert("Account created successfully");
                navigate("/login");
            }
            else {
                alert("Error in signup, please try again");
            }
        }
    });

    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={SignupForm.handleSubmit}>
                <h2 className="login-title">Create Account</h2>

                <div className="float-field">
                    <input
                        type="text"
                        id="username"
                        className="float-input"
                        placeholder=" "
                        {...SignupForm.getFieldProps("username")}
                        required
                    />
                    <label className="float-label" htmlFor="username">Username</label>
                </div>

                <div className="float-field">
                    <input
                        type="email"
                        id="email"
                        className="float-input"
                        placeholder=" "
                        {...SignupForm.getFieldProps("email")}
                        required
                    />
                    <label className="float-label" htmlFor="email">Email</label>
                </div>

                <div className="float-field">
                    <input
                        type="number"
                        id="phone"
                        className="float-input"
                        placeholder=" "
                        {...SignupForm.getFieldProps("phone")}
                        required
                    />
                    <label className="float-label" htmlFor="phone">Phone Number</label>
                </div>

                <div className="float-field">
                    <select
                        id="role"
                        className="float-input float-select"
                        {...SignupForm.getFieldProps("role")}
                        required
                    >
                        <option value="" disabled>Please select</option>
                        <option value="Admin">Admin</option>
                        {/* <option value="Teacher">Teacher</option> */}
                        <option value="Student">Student</option>
                    </select>
                    <label className="float-label" htmlFor="role">Role</label>
                </div>

                <div className="float-field">
                    <input
                        type="password"
                        id="password"
                        className="float-input"
                        placeholder=" "
                        {...SignupForm.getFieldProps("password")}
                        required
                    />
                    <label className="float-label" htmlFor="password">Password</label>
                </div>


                <button className="login-btn" type="submit">Sign Up</button>
                <p className="login-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>

            </form>
        </div>
    );
}

export default SignUp;
