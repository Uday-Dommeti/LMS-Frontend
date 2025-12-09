import { useEffect, useRef, useState } from "react";
import { useAddQuestionMutation, useEditQuestionMutation, useGetQuestionByIdQuery, useLazyGetQuestionByIdQuery, useLazyGetQuestionsQuery } from "../services/technology";
import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import { TagsInput } from "react-tag-input-component";
import htmlToDraft from "html-to-draftjs";


function QuestionForm({ type, Id }) {

    // const {isLoading,data} = useGetQuestionByIdQuery(Id);
    const [LazyGetQueByIdFn, { isLoading, data }] = useLazyGetQuestionByIdQuery();
    const [addNewQuestionFn] = useAddQuestionMutation();
    const [LazyGetQuesFn] = useLazyGetQuestionsQuery();
    const [editQuestionFn] = useEditQuestionMutation();
    const [tags, setTags] = useState([]);
    let [quizQues, setQuizQues] = useState({
        category: "",
        // questionNo: 1,
        question: "",
        optionType: "Multiple choice",
        options: [],
        correctOption: [],
        tags: tags,
        difficulty: "",
        // questionImage: null
    })
    let imageInputRef = useRef();
    const [isFocused, setIsFocused] = useState(false);

    let [questionEditor, setQuestionEditor] = useState(EditorState.createEmpty());
    let [optionsEditor, setOptionsEditor] = useState([EditorState.createEmpty()])

    let handleCategorySelect = (e) => {
        setQuizQues({ ...quizQues, category: e.target.value });
    }

    // let handleTagsSelect()
    let handleOptionTypeChange = (e) => {
        console.log(e.target.value);
        if (e.target.value == "Text answer") {
            setQuizQues({ ...quizQues, optionType: e.target.value, correctOption: [""] })
        }
        else if (e.target.value == "Multiple choice") {
            setQuizQues({ ...quizQues, optionType: e.target.value, correctOption: [] })
        }
        else {
            setQuizQues({ ...quizQues, optionType: e.target.value });
        }
        // if(e.target.value == "Multiple choice" || "Multiple select"){
        //     setOptionsEditor([...optionsEditor,EditorState.createEmpty()])
        // }
    }

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

    const handleCorrectOptionSelect = (option, e) => {
        let updatedCorrectOption;
        if (quizQues.optionType == "Multiple select") {
            if (e.target.checked) {
                updatedCorrectOption = [...quizQues.correctOption, draftToHtml(convertToRaw(option.getCurrentContent()))]
            }
            else {
                updatedCorrectOption = quizQues.correctOption.filter((opt) => opt != draftToHtml(convertToRaw(option.getCurrentContent())))
            }
        }
        else {
            updatedCorrectOption = [draftToHtml(convertToRaw(option.getCurrentContent()))];
        }
        setQuizQues({ ...quizQues, correctOption: updatedCorrectOption });
    };

    let addQuestion = async (e) => {
        // setTopicInfo({ ...topicInfo, quizcontent: [...(topicInfo.quizcontent || []), quizQues] });
        console.log(quizQues);
        const res = await addNewQuestionFn(quizQues).unwrap();
        // console.log(res);
        LazyGetQuesFn();
        setQuizQues({
            category: "",
            // questionNo: 1,
            question: "",
            optionType: "Multiple choice",
            options: [],
            correctOption: [],
            tags: tags,
            difficulty: "",
            // questionImage: null
        });
        setQuestionEditor(EditorState.createEmpty());
        setOptionsEditor([EditorState.createEmpty()])
        setTags([]);
    }

    const editQuestion = async () => {
        console.log("Edited Question:", quizQues);
        const { data } = await editQuestionFn(quizQues);
        if (data?.message == "Edited question successfully") {
            console.log("Question edited successfully");
            setQuizQues({
                category: "",
                // questionNo: 1,
                question: "",
                optionType: "Multiple choice",
                options: [],
                correctOption: [],
                tags: tags,
                difficulty: "",
                // questionImage: null
            });
            setQuestionEditor(EditorState.createEmpty());
            setOptionsEditor([EditorState.createEmpty()])
            setTags([]);
            LazyGetQueByIdFn(Id);
            LazyGetQuesFn();
        }
    }

    function convertHtmlToEditorState(html) {
        const blocksFromHtml = htmlToDraft(html);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        return EditorState.createWithContent(contentState);
    }

    useEffect(() => {
        // console.log("Tags:",tags);
        setQuizQues({ ...quizQues, tags });
    }, [tags])

    useEffect(() => {
        console.log(quizQues);
    }, [quizQues])

    useEffect(() => {
        if (type == "edit" && data) {
            const requestedQuestion = data?.requestedQuestion;
            setQuizQues(requestedQuestion);
            setQuestionEditor(convertHtmlToEditorState(requestedQuestion.question));
            setOptionsEditor(() => requestedQuestion.options.map((option) => convertHtmlToEditorState(option) || ""))
            setTags(requestedQuestion.tags)
        }
    }, [data])

    useEffect(() => {
        if (Id) {
            LazyGetQueByIdFn(Id);
            // console.log(Id);
        }
    }, [Id])

    return (
        <div className="mb-3 border p-2 rounded d-flex flex-column justify-content-center">
            <div className='d-flex justify-content-between m-2 align-items-center'>
                <select name="" id="" value={quizQues?.category} onChange={handleCategorySelect} className="form-select w-25">
                    <option value="" disabled>Select Category</option>
                    <option value="HTML">HTML</option>
                    <option value="CSS">CSS</option>
                    <option value="JavaScript">JavaScript</option>
                    <option value="ReactJS">ReactJS</option>
                </select>
                <select name="" value={quizQues?.difficulty} id="" onChange={(e) => { setQuizQues({ ...quizQues, difficulty: e.target.value }) }} className="form-select w-25">
                    <option value="" disabled>Select Difficulty</option>
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
                toolbarHidden={!isFocused}
                wrapperClassName="question-editor-wrapper"
                placeholder="Enter Question"
                onFocus={() => { setIsFocused(true) }}
                onBlur={() => { setIsFocused(false) }}
            />
            {/* <textarea name="" id=""
                                        readOnly
                                        rows="5"
                                        className='form-control mt-3'
                                        value={quizQues.question}
                                        ></textarea> */}
            <select name="answerType" id="" className="form-select w-25 mt-2" onChange={handleOptionTypeChange}>
                <option value="Multiple choice">Multiple choice</option>
                <option value="Multiple select">Multiple select</option>
                <option value="Text answer">Text answer</option>
            </select>
            {["Multiple choice", "Multiple select"].includes(quizQues.optionType) ?
                (<div className='d-flex flex-wrap'>
                    {
                        optionsEditor?.map((option, index) => {
                            return <div key={`opt-${index}`} className="mt-3 border p-3 rounded w-100">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <label className="mb-0">
                                        <strong>Option {String.fromCharCode(65 + index)}</strong>
                                    </label>

                                    <div className='d-flex align-items-center'>
                                        {quizQues.optionType == "Multiple choice" &&
                                            <input
                                                type="radio"
                                                name="correctOption"
                                                checked={quizQues.correctOption.includes(draftToHtml(convertToRaw(option.getCurrentContent())))}
                                                id={index}
                                                onChange={() => handleCorrectOptionSelect(option)}
                                            />
                                        }
                                        {quizQues.optionType == "Multiple select" &&
                                            <input
                                                type="checkbox"
                                                name="correctOption"
                                                checked={quizQues.correctOption.includes(draftToHtml(convertToRaw(option.getCurrentContent())))}
                                                id={index}
                                                onChange={(e) => handleCorrectOptionSelect(option, e)}
                                            />
                                        }
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
                    <div className="d-flex justify-content-center w-100">
                        <button className="btn btn-secondary mx-4 mt-2" onClick={() => { setOptionsEditor([...optionsEditor, EditorState.createEmpty()]) }}>Add Option</button>
                    </div>
                </div>)
                :
                (<div className="my-2">
                    <Editor
                        editorState={convertHtmlToEditorState(quizQues.correctOption[0])}
                        onEditorStateChange={(editorState) => { handleCorrectOptionSelect(editorState) }}
                        toolbarHidden
                    ></Editor>
                </div>)
            }
            <div className='m-2 d-flex justify-content-between align-items-center'>
                <TagsInput
                    value={tags}
                    onChange={setTags}
                    name="tags"
                    placeHolder="enter tags"
                    classNames={""}
                ></TagsInput>
                <button type='button' className='btn btn-primary h-25 m-2' onClick={type == "add" ? addQuestion : editQuestion} data-bs-dismiss="modal">{type == "add" ? "Save Question" : "Save Changes"}</button>
            </div>
        </div>
    )
}

export default QuestionForm;