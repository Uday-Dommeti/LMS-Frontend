import { useState } from "react";
import Modal from "../../components/Modal";
import { useGetStudentResultsQuery } from "../../services/quiz";
import QuizAttempt from "./QuizAttempt";


function QuizResults() {

    const { isLoading, data } = useGetStudentResultsQuery();
    const [quizResultModal, setQuizResultModal] = useState(false);
    const [quizId, setQuizId] = useState("");
    const [currentResult, setCurrentResult] = useState({});

    const showQuizResultModal = (result) => {
        setQuizId(result?.quizId);
        setCurrentResult(result);
        setQuizResultModal(true);
        let modal = new window.bootstrap.Modal(document.getElementById("quizResult"));
        modal.show();
    }

    return (
        <div className="quiz-results-wrapper">

            {isLoading && <h4 className="quiz-loading-text">Please wait...</h4>}

            {!isLoading && (
                <ul className="quiz-results-list list-unstyled">
                    {data?.studentResults.map((result) => (
                        <li
                            className="quiz-result-card"
                            onClick={() => showQuizResultModal(result)}
                            role="button"
                        >
                            {result?.quizTitle}
                        </li>
                    ))}
                </ul>
            )}

            <div
                className="modal fade quiz-result-modal"
                id="quizResult"
                style={{ display: quizResultModal ? "block" : "none" }}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabIndex="-1"
            >
                <Modal header="Quiz Result">
                    <QuizAttempt
                        type={"Only result"}
                        quizId={quizId}
                        currentResult={currentResult}
                    />
                </Modal>
            </div>

        </div>
    );

}

export default QuizResults;