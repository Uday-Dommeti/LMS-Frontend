import { Outlet, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { useDeleteQuizByIdMutation, useGetAllQuizzesQuery, useLazyGetAllQuizzesQuery } from "../../services/quiz";
import { useEffect, useRef, useState } from "react";
import QuizPreview from "../../components/QuizPreview";
import "../../components/Quizzes.css";
import QuizResults from "../../components/QuizResults";

function Quizes() {
    const { isLoading, data } = useGetAllQuizzesQuery();
    const [deleteQuizFn] = useDeleteQuizByIdMutation();
    const [LazyGetAllQuizzes] = useLazyGetAllQuizzesQuery();
    const [quizPreviewQuestions, setQuizPreviewQuestions] = useState([]);
    const [quizPreviewModal, setQuizPreviewModal] = useState(false);
    const [quizDeleteModal, setQuizDeleteModal] = useState(false);
    const [quizResultModal,setQuizResultModal] = useState(false);
    const [deleteQuizId, setDeleteQuizId] = useState("");
    const [quizResultId,setQuizResultId] = useState("");
    const [quizTitle, setQuizTitle] = useState("");
    let navigate = useNavigate()

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
    };

    const showQuizResultModal = (Id) => {
        setQuizResultId(Id);
        setQuizResultModal(true);
        let modal = new window.bootstrap.Modal(document.getElementById("quizResult"));
        modal.show();
    }

    const deleteQuiz = async () => {
        const deletedQuiz = await deleteQuizFn(deleteQuizId);
        if (deletedQuiz.data.message == "Quiz deleted successfully") {
            LazyGetAllQuizzes();
        }
    };

    const handleCopy = (quizId) => {
        const link = `http://localhost:3000/quiz/attempt/${quizId}`;
        navigator.clipboard.writeText(link);
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
                <div className="d-flex flex-wrap justify-content-start overflow-y-auto" style={{maxHeight:"73vh"}}>
                    {data?.allQuizzes?.map((quiz, index) => {
                        return (
                            <div key={quiz._id} className="quiz-card mx-1 shadow d-flex justify-content-between align-items-center">
                                <span className="quiz-title-text">{index + 1}) {quiz.quizTitle}</span>

                                <div className="quiz-actions">
                                    <button onClick={()=>{showQuizResultModal(quiz["_id"])}} className="quiz-icon-btn view">
                                        <i class="bi bi-file-earmark-text"></i>
                                    </button>

                                    <button onClick={()=>{handleCopy(quiz["_id"])}} className="quiz-icon-btn view">
                                        <i class="bi bi-copy"></i>
                                    </button>

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
                    {/* {copied && <span style={{ color: "green" }}>Copied!</span>} */}
                </div>
            )}

            <Outlet />

            <div className="modal fade" id="quizPreview" style={{ display: quizPreviewModal ? "block" : "none" }} tabIndex="-1">
                <Modal header="Quiz Preview">
                    <QuizPreview quizQuestions={quizPreviewQuestions} quizTitle={quizTitle}></QuizPreview>
                </Modal>
            </div>

            <div className="modal fade" id="quizDelete" style={{ display: quizDeleteModal ? "block" : "none" }} tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-md my-0 " style={{ width: "400px" }}>
                    <div className="modal-content">
                        <div className="modal-body m-2 fs-5 text-dark">Sure you want to delete it?</div>
                        <div className="modal-footer py-1 ">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deleteQuiz}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="quizResult" style={{ display: quizResultModal ? "block" : "none" }} tabIndex="-1">
                <Modal header="Quiz Result">
                    <QuizResults quizId={quizResultId}></QuizResults>
                </Modal>
            </div>
        </div>
    );
}

export default Quizes;
