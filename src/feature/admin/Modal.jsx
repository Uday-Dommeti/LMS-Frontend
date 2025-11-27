import { Editor } from 'react-draft-wysiwyg';
import HTMLReactParser from "html-react-parser/lib/index";
import parse from "html-react-parser";
import { useEffect, useRef, useState } from "react";
import draftToHtml from 'draftjs-to-html';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

function Modal({ quizContent, setTopicInfo, topicInfo }) {
    const [editModalOpen, setEditModalOpen] = useState(false);
    let [questionEditor, setQuestionEditor] = useState(null);
    let [optionsEditor, setOptionsEditor] = useState([
        EditorState.createEmpty(),
        EditorState.createEmpty(),
        EditorState.createEmpty(),
        EditorState.createEmpty(),
    ])
    let [quizQuesEdit, setQuizQuesEdit] = useState({
        question: "",
        options: [],
        correctOption: null,
        questionImage: null
    })
    // let [newTopicInfo, setNewTopicInfo] = useState(topicInfo);
    let editModRef = useRef();
    let imageInputRef = useRef();

    let showEditModal = (ques) => {
        setQuizQuesEdit(ques);
        setEditModalOpen(true);
        let modal = new window.bootstrap.Modal(editModRef.current);
        modal.show();
    }

    useEffect(() => {
        setQuestionEditor(convertHtmlToEditorState(quizQuesEdit.question));
        setOptionsEditor([
            convertHtmlToEditorState(quizQuesEdit.options[0] || ""),
            convertHtmlToEditorState(quizQuesEdit.options[1] || ""),
            convertHtmlToEditorState(quizQuesEdit.options[2] || ""),
            convertHtmlToEditorState(quizQuesEdit.options[3] || ""),
        ])
    }, [editModalOpen])

    function convertHtmlToEditorState(html) {
        const blocksFromHtml = htmlToDraft(html);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
    }

    let handleQuestionChange = (editorState) => {
        setQuestionEditor(editorState);
        const questionText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setQuizQuesEdit((prev) => {
            return { ...prev, question: questionText };
        })
    };

    let handleQuestionImageChange = (e) => {
        let imageFile = e.target.files[0];
        imageFile.url = URL.createObjectURL(imageFile);
        setQuizQuesEdit({ ...quizQuesEdit, questionImage: imageFile });
    }

    let handleOptionsChange = (editorState, index) => {
        setOptionsEditor((prevEditors) => {
            const newEditors = [...prevEditors];
            newEditors[index] = editorState;
            return newEditors
        });


        const newOptions = [...quizQuesEdit.options];
        newOptions[index] = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setQuizQuesEdit({ ...quizQuesEdit, options: newOptions });
    }

    const handleCorrectOptionSelect = (index) => {
        setQuizQuesEdit((prev) => ({
            ...prev,
            correctOption: index,
        }));
    };

    // const editTopicInfo = () => {
    //     document.activeElement.blur();
    //     let updatedQuizContent = quizContent.filter((quizQues) => {
    //         return quizQues.questionNo != quizQuesEdit.questionNo
    //     })
    //     updatedQuizContent.push(quizQuesEdit);
    //     updatedQuizContent.sort((a, b) => {
    //         return a.questionNo > b.questionNo ? 1 : -1
    //     })
    //     setTopicInfo({ ...topicInfo, quizcontent: updatedQuizContent });
    //     setEditModalOpen(false);
    // }

    // const deleteQuizQues = (Qno) => {
    //     let updatedQuizContent = quizContent.filter((quizQues) => {
    //         return quizQues.questionNo != Qno
    //     })
    //     setTopicInfo({ ...topicInfo, quizcontent: updatedQuizContent });
    // }


    return <div className="modal-dialog modal-lg my-0 modal-dialog-scrollable">
        <div className="modal-content vh-100">
            <div className="modal-header bg-primary">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Questions Preview</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <ol className="list-group">
                    {
                        quizContent?.map((ques) => {
                            let question = parse(ques.question);
                            let options = ques.options.map((option) => parse(option));
                            return <li className="list-group-item p-4">
                                <div className="d-flex flex-wrap justify-content-between m-2">
                                    <li className={ques.questionImage ? "w-50 mt-2 fs-5" : "w-100 mt-2 fs-5"}>
                                        {question}
                                    </li>
                                    {ques.questionImage &&
                                        <img src={ques.questionImage.url} alt="" className="w-50" />
                                    }
                                </div>
                                <ul className="list-group m-2 d-flex flex-wrap">
                                    {
                                        options.map((option, i) => {
                                            return <li className={ques.correctOption === i ? "list-group-item active bg-success border border-0 d-flex justify-content-between align-items-center w-100" : "list-group-item w-100"}>
                                                <span className="w-75 d-flex">
                                                    {String.fromCharCode(65 + i)})
                                                    <span className='w-100'> {option}</span>
                                                </span>
                                                {ques.correctOption === i && <i class="bi bi-check-circle fs-5"></i>}
                                            </li>
                                        })
                                    }
                                </ul>
                                <div className='d-flex justify-content-between'>
                                    <button className="btn btn-warning" type="button" onClick={() => { showEditModal(ques) }}>Edit</button>
                                    <button className='btn btn-danger' type='button'>Delete</button>
                                </div>
                            </li>
                        })
                    }
                </ol>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Ok</button>
                {/* <button type="button" className="btn btn-primary">Save changes</button> */}
            </div>
        </div>

        <div class="modal fade" id="editModal" ref={editModRef} style={{ display: editModalOpen ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel1">
            <div class="modal-dialog modal-dialog-scrollable my-0 modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div className='d-flex justify-content-between m-2 align-items-center'>
                            <h3>Edit Question</h3>
                            <input
                                type="file"
                                accept='image/*'
                                className='d-none border border-1 w-25'
                                ref={imageInputRef}
                                onChange={handleQuestionImageChange}
                            />
                            <div className='d-flex flex-column'>
                                {!quizQuesEdit.questionImage &&
                                    <button type='button' onClick={() => { imageInputRef.current.click() }} className='bi bi-plus-circle btn btn-success p-0 fs-5'></button>
                                }
                                {quizQuesEdit.questionImage &&
                                    <div className='d-flex flex-column'>
                                        <b>{quizQuesEdit.questionImage.name}</b>
                                        <div className='d-flex justify-content-between'>
                                            <i type='button' onClick={() => { imageInputRef.current.click() }} className='bi bi-pencil-square text-info fs-5'></i>
                                            <i onClick={() => { setQuizQuesEdit({ ...quizQuesEdit, questionImage: null }) }} className='bi bi-x-circle-fill text-danger fs-5'></i>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <Editor
                            editorState={questionEditor}
                            onEditorStateChange={handleQuestionChange}
                        />
                        <div className='d-flex flex-wrap'>
                            {
                                optionsEditor.map((option, index) => {
                                    return <div key={`opt-${index}`} className="mt-3 border p-3 rounded w-50">
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <label className="mb-0">
                                                <strong>Option {String.fromCharCode(65 + index)}</strong>
                                            </label>

                                            <div className='d-flex align-items-center'>
                                                <input
                                                    type="radio"
                                                    name="correctOption"
                                                    checked={quizQuesEdit.correctOption === index}
                                                    id={index}
                                                    onChange={() => handleCorrectOptionSelect(index)}
                                                />
                                                {/* <label htmlFor={index} className='ms-1'> Correct Answer </label> */}
                                            </div>
                                        </div>
                                        <Editor
                                            editorState={option}
                                            onEditorStateChange={(editorState) => { handleOptionsChange(editorState, index) }}
                                            toolbarHidden
                                        />
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Modal;