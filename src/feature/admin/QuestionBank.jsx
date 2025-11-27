import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useEffect, useRef, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import { TagsInput } from "react-tag-input-component";
import { useAddQuestionMutation, useGetQuestionsQuery } from "../../services/technology";



function QuestionBank() {
    const [tags, setTags] = useState([]);
    const [addNewQuestionFn] = useAddQuestionMutation();
    const {isLoading,data} = useGetQuestionsQuery()
    const [questions,setQuestions] = useState([])
    let [quizQues, setQuizQues] = useState({
        category: "",
        // questionNo: 1,
        question: "",
        options: [],
        correctOption: null,
        tags: tags,
        difficulty: "",
        // questionImage: null
    })
    let imageInputRef = useRef();
    let [modalDisplay, setModalDisplay] = useState(false);
    let [addQModal, setAddQModal] = useState(false);
    // let [questionImage,setQuestionImage] = useState(null);

    let [questionEditor, setQuestionEditor] = useState(EditorState.createEmpty());
    let [optionsEditor, setOptionsEditor] = useState([
        EditorState.createEmpty(),
        EditorState.createEmpty(),
        EditorState.createEmpty(),
        EditorState.createEmpty(),
    ])

    let handleCategorySelect = (e) => {
        setQuizQues({ ...quizQues, category: e.target.value });
    }

    // let handleTagsSelect()

    let handleQuestionChange = (editorState) => {
        setQuestionEditor(editorState);
        const questionText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setQuizQues((prev) => {
            return { ...prev, question: questionText };
        })
    };

    let handleQuestionImageChange = (e) => {
        // console.log(e.target.files[0]);
        let imageFile = e.target.files[0];
        imageFile.url = URL.createObjectURL(imageFile);
        // console.log(imageFile.url)
        // setQuestionImage(e.target.files[0]);
        setQuizQues({ ...quizQues, questionImage: imageFile });
    }

    let handleOptionsChange = (editorState, index) => {
        setOptionsEditor((prevEditors) => {
            const newEditors = [...prevEditors];
            newEditors[index] = editorState;
            return newEditors
        });


        const newOptions = [...quizQues.options];
        // console.log(newOptions,index);
        newOptions[index] = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        // console.log(newOptions);
        setQuizQues({ ...quizQues, options: newOptions });
    }

    const handleCorrectOptionSelect = (option) => {
        setQuizQues((prev) => ({
            ...prev,
            correctOption: draftToHtml(convertToRaw(option.getCurrentContent())),
        }));
    };

    let addQuestion = (e) => {
        // setTopicInfo({ ...topicInfo, quizcontent: [...(topicInfo.quizcontent || []), quizQues] });
        console.log(quizQues);
        addNewQuestionFn(quizQues);
        setQuizQues({
            category: "",
            // questionNo: 1,
            question: "",
            options: [],
            correctOption: null,
            tags: tags,
            difficulty: "",
            // questionImage: null
        });
        setQuestionEditor(EditorState.createEmpty());
        setOptionsEditor([
            EditorState.createEmpty(),
            EditorState.createEmpty(),
            EditorState.createEmpty(),
            EditorState.createEmpty(),
        ])
        setTags([]);
    }

    const showAddModal = () => {
        setModalDisplay(true);
        let modal = new window.bootstrap.Modal(document.getElementById("addContent"));
        modal.show();
        // setAddQModal(false);
    }

    useEffect(() => {
        // console.log("Tags:",tags);
        setQuizQues({ ...quizQues, tags });
    }, [tags])

    useEffect(()=>{
        console.log(data)
    },[isLoading])

    return (
        <div>
            <div className="d-flex justify-content-between">
                <h3>Question Bank</h3>
                <button data-bs-toggle="modal" data-bs-target="#addQuestion" className="btn btn-primary" onClick={() => { setAddQModal(true) }}>Add New Question</button>
            </div>
                <div>
                    {data?.questions?.map((que)=>{
                        return <li>{que.question}</li>
                    })}
                </div>
            <div class="modal fade" id="addQuestion" style={{ display: addQModal ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
                <div class="modal-dialog modal-lg my-0 modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">New Question</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div className="mb-3 border p-2 rounded">
                                <div className='d-flex justify-content-between m-2 align-items-center'>
                                    <select name="" id="" value={quizQues?.category} onChange={handleCategorySelect} className="form-select w-25">
                                        <option value="" disabled>Please select Category</option>
                                        <option value="HTML">HTML</option>
                                        <option value="CSS">CSS</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="ReactJS">ReactJS</option>
                                    </select>
                                    <select name="" value={quizQues?.difficulty} id="" onChange={(e) => { setQuizQues({ ...quizQues, difficulty: e.target.value }) }} className="form-select w-25">
                                        <option value="" disabled>Please select Difficulty</option>
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                    {/* <input
                                        type="file"
                                        accept='image/*'
                                        className='d-none border border-1 w-25'
                                        ref={imageInputRef}
                                    // onChange={handleQuestionImageChange}
                                    />
                                    <div className='d-flex flex-column'>
                                        <button type='button' onClick={() => { imageInputRef.current.click() }} className='btn btn-success'>Add Image</button>
                                        {quizQues.questionImage && <b>{quizQues.questionImage.name}</b>}
                                    </div> */}
                                </div>
                                <Editor
                                    editorState={questionEditor}
                                    onEditorStateChange={handleQuestionChange}
                                    toolbarHidden
                                    placeholder="Enter Question"
                                />
                                {/* <textarea name="" id=""
                                readOnly
                                rows="5"
                                className='form-control mt-3'
                                value={quizQues.question}
                                ></textarea> */}

                                <div className='d-flex flex-wrap'>
                                    {
                                        optionsEditor?.map((option, index) => {
                                            return <div key={`opt-${index}`} className="mt-3 border p-3 rounded w-50">
                                                <div className="d-flex align-items-center justify-content-between mb-2">
                                                    <label className="mb-0">
                                                        <strong>Option {String.fromCharCode(65 + index)}</strong>
                                                    </label>

                                                    <div className='d-flex align-items-center'>
                                                        <input
                                                            type="radio"
                                                            name="correctOption"
                                                            checked={quizQues.correctOption === draftToHtml(convertToRaw(option.getCurrentContent()))}
                                                            id={index}
                                                            onChange={() => handleCorrectOptionSelect(option)}
                                                        />
                                                        <label htmlFor={index} className='ms-1'> Correct Answer </label>
                                                    </div>
                                                </div>
                                                <Editor
                                                    editorState={option}
                                                    onEditorStateChange={(editorState) => { handleOptionsChange(editorState, index) }}
                                                    toolbarHidden
                                                />
                                                {/* <textarea name="" id=""
                                      readOnly
                                      className='form-control mt-3'
                                      rows={2}
                                      value={quizQues.options[index] || "" }
                                      ></textarea> */}
                                            </div>
                                        })

                                    }

                                </div>
                                <div className='m-2 d-flex justify-content-between'>
                                    <TagsInput
                                        value={tags}
                                        onChange={setTags}
                                        name="tags"
                                        placeHolder="enter tags"
                                    ></TagsInput>
                                    {/* <button type='button' className='btn btn-info' onClick={showAddModal}>Preview</button> */}
                                </div>
                                <div className="modal fade" id="addContent" style={{ display: modalDisplay ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                                    {/* <Modal quizContent={topicInfo.quizcontent}></Modal> */}
                                </div>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type='button' className='btn btn-primary' onClick={() => addQuestion()} data-bs-dismiss="modal">Add New Question</button>
                            {/* <button type="button" class="btn btn-primary">Understood</button> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionBank;