import { Outlet, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { useDeleteQuizByIdMutation, useGetAllQuizzesQuery, useLazyGetAllQuizzesQuery } from "../../services/technology";
import { useEffect, useRef, useState } from "react";
import QuizPreview from "../../components/QuizPreview";
import "../../components/Quizzes.css";

function Quizes() {
    const { isLoading, data } = useGetAllQuizzesQuery();
    const [deleteQuizFn] = useDeleteQuizByIdMutation();
    const [LazyGetAllQuizzes] = useLazyGetAllQuizzesQuery();
    const [quizPreviewQuestions, setQuizPreviewQuestions] = useState([]);
    const [quizPreviewModal, setQuizPreviewModal] = useState(false);
    const [quizDeleteModal, setQuizDeleteModal] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState("");
    const [quizTitle, setQuizTitle] = useState("");
    let navigate = useNavigate()
    let noRef = useRef();

    const showQuizPreviewModal = (quiz) => {
        setQuizTitle(quiz?.quizTitle);
        setQuizPreviewQuestions(quiz?.quizQuestions);
        setQuizPreviewModal(true);
        let modal = new window.bootstrap.Modal(document.getElementById("quizPreview"));
        modal.show();
    };

    const showQuizDeleteModal = (Id) => {
        setDeleteQuizId(Id);
        setQuizDeleteModal(true);
        let modal = new window.bootstrap.Modal(document.getElementById("quizDelete"));
        modal.show();
        noRef.current.focus();
    };

    const deleteQuiz = async () => {
        const deletedQuiz = await deleteQuizFn(deleteQuizId);
        if (deletedQuiz.data.message == "Quiz deleted successfully") {
            LazyGetAllQuizzes();
        }
    };

    return (
        <div className="quizes-container">
            <div className="quizes-header d-flex justify-content-between">
                <h4 className="quizes-title">Quizzes</h4>
                <button className="quiz-btn-primary" onClick={() => navigate("/admin/quizes/createquiz")}>
                    Create new Quiz
                </button>
            </div>

            {data && (
                <div className="d-flex flex-wrap justify-content-start">
                    {data?.allQuizzes?.map((quiz, index) => {
                        return (
                            <div key={quiz._id} className="quiz-card mx-1 shadow d-flex justify-content-between align-items-center">
                                <span className="quiz-title-text">{index + 1}) {quiz.quizTitle}</span>

                                <div className="quiz-actions">
                                    <button className="quiz-icon-btn view" onClick={() => showQuizPreviewModal(quiz)}>
                                        <i className="bi bi-eye"></i>
                                    </button>

                                    <button className="quiz-icon-btn edit" onClick={() => navigate(`/admin/quizes/editquiz/${quiz["_id"]}`)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>

                                    <button className="quiz-icon-btn delete" onClick={() => showQuizDeleteModal(quiz["_id"])}>
                                        <i className="bi bi-trash3-fill"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <Outlet />

            <div className="modal fade" id="quizPreview" style={{ display: quizPreviewModal ? "block" : "none" }} tabIndex="-1">
                <Modal header="Quiz Preview">
                    <QuizPreview quizQuestions={quizPreviewQuestions} quizTitle={quizTitle}></QuizPreview>
                </Modal>
            </div>

            <div className="modal fade" id="quizDelete" style={{ display: quizDeleteModal ? "block" : "none" }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-md my-0 " style={{width:"400px"}}>
                    <div className="modal-content">
                        <div className="modal-body m-2 fs-5 text-dark">Sure you want to delete it?</div>
                        <div className="modal-footer py-1 ">
                            <button type="button" className="btn btn-secondary" ref={noRef} data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteQuiz}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quizes;
