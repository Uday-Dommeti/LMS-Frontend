import { useEffect, useState } from "react";
import QuestionPrompt from "./QuestionPrompt";
import Modal from "./Modal";
import QuestionPreview from "./QuestionPreview";

function QuizPreview({ quizQuestions,quizTitle }) {

    const [previewModal, setPreviewModal] = useState(false);
    const [previewId, setPreviewId] = useState("");
    const showPreviewModal = (id) => {
        console.log(id);
        setPreviewId(id);
        setPreviewModal(true);
        let modal = new window.bootstrap.Modal(document.getElementById("previewQuestionQuiz"));
        modal.show();
        // setAddQModal(false);
    }
    // useEffect(() => {
    //     console.log(quizQuestions)
    // }, [quizQuestions])
    return (
        <div className="d-flex flex-column p-2 quiz-preview-container">
            <h3 className="text-center">{quizTitle ? quizTitle : "Quiz Preview"}</h3>
            <div className="d-flex flex-column">
                {!quizQuestions?.length ? <b className="text-center">No questions added</b>
                    : (
                        quizQuestions?.map((que, index) => {
                            return <span className="quiz-preview-item" role="button" onClick={()=>{showPreviewModal(que)}}> <strong>{index + 1})</strong> <QuestionPrompt id={que}></QuestionPrompt> </span>
                        })
                    )}
            </div>
            <div className="modal fade" id="previewQuestionQuiz" style={{ display: previewModal ? "block" : "none" }} tabindex="-1" aria-labelledby="staticBackdropLabel">
                <Modal header="Question Preview">
                    <QuestionPreview Id={previewId} type={"Read only"}/>
                </Modal>
            </div>
        </div>
    )
}

export default QuizPreview;