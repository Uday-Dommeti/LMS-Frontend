import { useEffect, useState } from "react";
import { useDeleteQuestionMutation, useGetQuestionByIdQuery, useLazyGetQuestionByIdQuery, useLazyGetQuestionsQuery } from "../services/technology";
import parse from "html-react-parser";
import QuestionForm from "./QuestionForm";
import Modal from "./Modal";


function QuestionPreview({ Id, type }) {
    // const { isLoading, data } = useGetQuestionByIdQuery(Id)
    const [lazyGetQueById, { isLoading, data }] = useLazyGetQuestionByIdQuery();
    const [LazyGetQue] = useLazyGetQuestionsQuery();
    const [deleteQueFn] = useDeleteQuestionMutation();
    const [question, setQuestion] = useState(null);
    const [editQModal, setEditQModal] = useState(false)
    useEffect(() => {
        // console.log(isLoading);
        // console.log(data);
        // console.log(Id);
        if (data) {
            setQuestion(data?.requestedQuestion);
        }
    }, [data])

    useEffect(() => {
        // {data} = useGetQuestionByIdQuery(Id);
        if (Id) {
            lazyGetQueById(Id);
            // console.log(Id);
        }
    }, [Id])

    const showEditModal = () => {
        setEditQModal(true);
        const modal = new window.bootstrap.Modal(document.getElementById("editQuestion"));
        modal.show();
    }

    return (
        <div className="question-preview-container">
            {typeof question?.question === "string" &&
                <div>
                    <div className="d-flex justify-content-between">
                        <b>Category: {question.category}</b>
                        <b>Difficulty: {question.difficulty}</b>
                    </div>
                    <div className="d-flex">
                        <b>Q)</b>
                        <span>{parse(question.question)}</span>
                    </div>
                    <ul className="list-group">
                        {
                            question?.options.map((option, index) => {
                                return <li className={question.correctOption?.includes(option) ? "list-group-item active bg-success border border-0 d-flex justify-content-between align-items-center w-100" : "list-group-item w-100"}>
                                    <div className="d-flex">
                                        <b>{String.fromCharCode(65 + index)})</b>
                                        <span>{parse(option)}</span>
                                    </div>
                                    {question.correctOption === option && <i class="bi bi-check-circle fs-5"></i>}
                                </li>
                            })
                        }
                    </ul>
                    <div className="m-1 p-1">
                        <b>Tags:</b>
                        <span>
                            {question.tags.map((tag) => {
                                return <span> {tag}</span>
                            })}
                        </span>
                    </div>
                    {!type &&
                        <div className="d-flex justify-content-between">
                            <button className="btn btn-primary" onClick={showEditModal}>Edit</button>
                            <button className="btn btn-danger" onClick={async () => { await deleteQueFn(Id); LazyGetQue() }} data-bs-dismiss="modal">Delete</button>
                        </div>
                    }
                    <div class="modal fade" id="editQuestion" style={{ display: editQModal ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
                        <Modal header="Edit Question">
                            <QuestionForm type={"edit"} Id={Id} />
                        </Modal>
                    </div>
                </div>
            }
        </div>
    )
}

export default QuestionPreview;