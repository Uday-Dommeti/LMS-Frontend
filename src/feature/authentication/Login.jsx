import { useFormik } from "formik";
import { useLoginMutation } from "../../services/user";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { notifyError, notifySuccess } from "../../components/Toast";

function Login() {
    const [LoginFn] = useLoginMutation();
    const navigate = useNavigate();

    const loginForm = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        onSubmit: async (values) => {
            const res = await LoginFn(values);
            if (res?.data?.message === "Authentication successfull") {
                notifySuccess("Login successfull");
                localStorage.setItem("token", res?.data?.token);
                localStorage.setItem("role", res?.data?.role);
                localStorage.setItem("username",res?.data?.username);
                res?.data?.role === "Admin" ? navigate("/admin") : navigate(-1);
            } else {
                notifyError(res?.data?.message);
            }
        }
    });

    useEffect(() => {
        if (localStorage.getItem("token")) navigate("/");
    }, []);

    return (
        <div className="login-wrapper">
            <form className="login-card" onSubmit={loginForm.handleSubmit}>
                <h2 className="login-title">Welcome Back</h2>

                <div className="float-field">
                    <input type="email" id="email" className="float-input" placeholder=" " {...loginForm.getFieldProps("email")} required />
                    <label className="float-label" htmlFor="email">Email</label>
                </div>

                <div className="float-field">
                    <input type="password" id="password" className="float-input" placeholder=" " {...loginForm.getFieldProps("password")} required />
                    <label className="float-label" htmlFor="password">Password</label>
                </div>

                <button className="login-btn" type="submit">
                    Login
                </button>

                <p className="login-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
