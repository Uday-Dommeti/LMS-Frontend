import { Bounce, toast } from "react-toastify";

const defaultConfig = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
};

export const notifySuccess = (msg) => {
    toast.success(msg,defaultConfig);
}

export const notifyWarning = (msg) => {
    toast.warning(msg,defaultConfig);
}

export const notifyError = (msg) => {
    toast.error(msg,defaultConfig);
}

export const notifyInfo = (msg) => {
    toast.info(msg,defaultConfig);
}