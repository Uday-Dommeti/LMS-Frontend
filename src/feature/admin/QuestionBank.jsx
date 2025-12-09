import { useEffect, useState } from "react";
import { useGetQuestionsQuery } from "../../services/technology";
import parse from "html-react-parser";
import QuestionForm from "../../components/QuestionForm";
import Modal from "../../components/Modal";
import QuestionPreview from "../../components/QuestionPreview";
import { Link } from "react-router-dom";
import FilterComp from "../../components/filter";




function QuestionBank() {
    const { isLoading, data } = useGetQuestionsQuery();

    let [previewModal, setPreviewModal] = useState(false);
    let [addQModal, setAddQModal] = useState(false);
    let [previewId, setPreviewId] = useState("");
    const [filQuestions, setFilQuestions] = useState([]);

    // let [questionImage,setQuestionImage] = useState(null);



    const showPreviewModal = (id) => {
        setPreviewId(id);
        setPreviewModal(true);
        let modal = new window.bootstrap.Modal(document.getElementById("previewQuestion"));
        modal.show();
        // setAddQModal(false);
    }

    useEffect(() => {
        setFilQuestions(data?.questions);
    }, [data])

    // useEffect(() => {
    //     console.log(data)
    // }, [isLoading])

    return (
        <div className="d-flex shadow-lg rounded-3 m-2" style={{ border: "1px solid #f8c8c8ff" }}>
            <div className="m-3 w-100">
                <div className="d-flex justify-content-end">
                    <button data-bs-toggle="modal" data-bs-target="#addQuestion" className="btn btn-primary" onClick={() => { setAddQModal(true) }}>Add New Question</button>
                    {/* <Link>Filter</Link> */}
                </div>
                <div className="d-flex flex-wrap list-unstyled m-2">
                    {filQuestions?.map((que, index) => {
                        return <li className="w-50 shadow-sm rounded p-2" type="button" onClick={() => { showPreviewModal(que._id) }} data-bs-target="#previewQuestion">
                            <header className="d-flex">
                                <b>{index + 1})</b>
                                <span className="d-flex flex-wrap question-pr">{parse(que.question)}</span>
                            </header>
                        </li>
                    })}
                </div>
                <div class="modal fade" id="addQuestion" style={{ display: addQModal ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
                    <Modal header="New Question">
                        <QuestionForm type={"add"} />
                    </Modal>
                </div>
                <div className="modal fade" id="previewQuestion" style={{ display: previewModal ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
                    <Modal header="Question Preview">
                        <QuestionPreview Id={previewId} />
                    </Modal>
                </div>

            </div>
            {filQuestions &&
                <FilterComp filQuestions={filQuestions} setFilQuestions={setFilQuestions}></FilterComp>
            }
        </div>
    )
}

export default QuestionBank;