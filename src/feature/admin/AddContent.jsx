
import React, { useEffect, useRef, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useAddcontentMutation, useLazyTopicdetailsQuery } from '../../services/technology';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from './Modal';

function AddContent() {
  var [addcontentFn] = useAddcontentMutation();
  const [topicdetailsFn]=useLazyTopicdetailsQuery()
  
  var { tid, cid, topicId } = useParams();
  var navigate = useNavigate();

  let [topicInfo, setTopicInfo] = useState({
    title: '',
    shortheading: '',
    type: '',
    content: '',
  });

  let [topicSelected,setTopicSelected]=useState(false);
  let [isQuiz,setIsQuiz]= useState(false);
  let editorState = EditorState.createEmpty();
  let [description, setDescription] = useState(editorState);
  let [isError, setError] = useState(null);
  let [quizQues,setQuizQues] = useState({
    questionNo:1,
    question:"",
    options:[],
    correctOption:null,
    questionImage:null
  })
  let imageInputRef = useRef()
  let [modalDisplay,setModalDisplay] = useState(false);
  let [addQModal,setAddQModal] = useState(false);
  // let [questionImage,setQuestionImage] = useState(null);

  let [questionEditor,setQuestionEditor] = useState(EditorState.createEmpty());
  let [optionsEditor,setOptionsEditor] = useState([
    EditorState.createEmpty(),
    EditorState.createEmpty(),
    EditorState.createEmpty(),
    EditorState.createEmpty(),
  ])

  let handleQuestionChange = (editorState) =>{
    setQuestionEditor(editorState);
    const questionText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setQuizQues((prev)=>{
      return {...prev,question:questionText};
    })
  };

  let handleQuestionImageChange = (e) => {
    // console.log(e.target.files[0]);
    let imageFile = e.target.files[0];
    imageFile.url = URL.createObjectURL(imageFile);
    // console.log(imageFile.url)
    // setQuestionImage(e.target.files[0]);
    setQuizQues({...quizQues,questionImage:imageFile});
  }

  let handleOptionsChange = (editorState,index) => {
    setOptionsEditor((prevEditors)=>{
      const newEditors = [...prevEditors];
      newEditors[index] = editorState;
      return newEditors
    });


    const newOptions = [...quizQues.options];
    // console.log(newOptions,index);
    newOptions[index] = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    // console.log(newOptions);
    setQuizQues({...quizQues,options:newOptions});
  }

  const handleCorrectOptionSelect = (index) => {
    setQuizQues((prev) => ({
      ...prev,
      correctOption: index,
    }));
  };
  

  // useEffect(()=>{
  //   console.log("Topic Info:",topicInfo);
  // },[topicInfo])

  // useEffect(()=>{
  //   console.log(quizQues);
  // },[quizQues])

  let onChangeValue = (e) => {
    setTopicInfo({
      ...topicInfo,
      [e.target.name]: e.target.value,
    });
    
  };

  let onSelectValue = (e) => {
    setTopicInfo({
      ...topicInfo,
      [e.target.name]: e.target.value,
    });
    if(e.target.name === "type"){
      setTopicSelected(true);
    }
    if(e.target.name === "type" && e.target.value === "Quiz"){
      setIsQuiz(true);
    }
    else{
      setIsQuiz(false);
    }
  }


  

  let addQuestion = (e) =>{
    setTopicInfo({...topicInfo,quizcontent:[...(topicInfo.quizcontent || []),quizQues]});
    setQuizQues({
      questionNo:quizQues.questionNo+1,
      question:"",
      options:[],
      correctOption:null,
      questionImage:null
    });
    setQuestionEditor(EditorState.createEmpty());
    setOptionsEditor([
      EditorState.createEmpty(),
      EditorState.createEmpty(),
      EditorState.createEmpty(),
      EditorState.createEmpty(),
    ])
  }

  let onEditorStateChange = (editorState) => {
    setDescription(editorState);
    const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setTopicInfo((prev) => ({ ...prev, content: htmlContent }));
  };

  

  let addcontent = async (event) => {
    try {
      event.preventDefault();
      console.log('Topic Info:', topicInfo);
      const formData = new FormData();
      formData.append('topicInfo',JSON.stringify(topicInfo));
      topicInfo.quizcontent?.forEach((q,index)=>{
        formData.append(`questionImage_${index}`,q.questionImage || "");
      });
      for(var pair of formData.entries()){
        console.log(pair[0],pair[1]);
      }
      var res = await addcontentFn({ formData, tid, cid, topicId });
      console.log('Response:', res);
      navigate(`/admin/addconcept/${tid}/topicdetails/${cid}/${topicId}`);
      topicdetailsFn({tid,cid}) 
      


    } catch (error) {
      console.log('Error in adding content',error); 
    }
  };

  const handleCancel = () => {
       navigate(-1); 
     };

  const showAddModal = () => {
    setModalDisplay(true);
    let modal = new window.bootstrap.Modal(document.getElementById("addContent"));
    modal.show();
    // setAddQModal(false);
  }
  
    

     

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card shadow-lg border-0 rounded">
            <div className="card-header bg-primary text-white justify-content-between d-flex">
              <h3 className="mb-0">Add Content</h3>
              <div>
                <button
              className="btn  btn-sm  p-0"
               onClick={handleCancel}
               title="Close">
                <i className="bi bi-x-circle text-light fs-4 "></i>        
             </button>
              </div>

            </div>

            <div className="card-body p-4">
              <form onSubmit={addcontent}>
                {/* Title Input */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label fw-bold">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={topicInfo.title}
                    onChange={onChangeValue}
                    className="form-control"
                    placeholder="Enter Title"
                    required
                  />
                </div>

                {/* Short Heading Input */}
                <div className="mb-3">
                  <label htmlFor="shortheading" className="form-label fw-bold">Short Heading</label>
                  <input
                    type="text"
                    name="shortheading"
                    value={topicInfo.shortheading}
                    onChange={onChangeValue}
                    className="form-control"
                    placeholder="Enter Short Heading"
                    required
                  />
                </div>

                {/* Content Type Dropdown */}
                <div className="mb-3">
                  <label htmlFor="type" className="form-label fw-bold">Content Type</label>
                  <select
                    name="type"
                    value={topicInfo.type}
                    onChange={onSelectValue}
                    className="form-select"
                    required
                  >
                    <option value="">Select content type</option>
                    <option value="Description">Concepts</option>
                    <option value="Video">Video</option>
                    <option value="Practise-questions">Practice Questions</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Examples">Examples</option>
                    <option value="Quiz">Quiz</option>
                    <option value="Projects">Projects</option>
                  </select>
                </div>

                {/* Rich Text Editor */}
                {topicSelected && !isQuiz && <div className="mb-3">
                  <label htmlFor="content" className="form-label fw-bold">Description</label>
                  <div className="border p-2 rounded bg-light">
                    <Editor
                      editorState={description}
                      toolbarClassName="toolbarClassName"
                      wrapperClassName="wrapperClassName"
                      editorClassName="editorClassName"
                      onEditorStateChange={onEditorStateChange}
                    />
                  </div>
                  <textarea
                    readOnly
                    className="form-control mt-3"
                    rows="5"
                    value={draftToHtml(convertToRaw(description.getCurrentContent()))}
                  />
                </div>
                }
                {
                  topicSelected && isQuiz &&
                  <div>
                    <button type='button' className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#addQuestion" onClick={()=>{setAddQModal(true)}}>Add Question</button>
                    

                    <div class="modal fade" id="addQuestion" style={{display: addQModal ? "block" : "none"}} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
                      <div class="modal-dialog modal-lg my-0 modal-dialog-scrollable">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">New Question</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            <div className="mb-3 border p-2 rounded">
                              <div className='d-flex justify-content-between m-2 align-items-center'>
                                <h3>Create Question</h3>
                                <input 
                                type="file" 
                                accept='image/*'
                                className='d-none border border-1 w-25'
                                ref={imageInputRef}
                                onChange={handleQuestionImageChange}
                                />
                                <div className='d-flex flex-column'>
                                  <button type='button' onClick={()=>{imageInputRef.current.click()}} className='btn btn-success'>Add Image</button>
                                  {quizQues.questionImage && <b>{quizQues.questionImage.name}</b> }
                                </div>
                              </div>
                                <Editor
                                editorState={questionEditor}
                                onEditorStateChange={handleQuestionChange}
                                // toolbarHidden
                                />
                                {/* <textarea name="" id=""
                                readOnly
                                rows="5"
                                className='form-control mt-3'
                                value={quizQues.question}
                                ></textarea> */}
                                
                              <div className='d-flex flex-wrap'>
                                {
                                  optionsEditor.map((option,index)=>{
                                    return <div key={`opt-${index}`} className="mt-3 border p-3 rounded w-50">
                                      <div className="d-flex align-items-center justify-content-between mb-2">
                                        <label className="mb-0">
                                          <strong>Option {String.fromCharCode(65 + index)}</strong>
                                        </label>

                                        <div className='d-flex align-items-center'>
                                          <input
                                          type="radio"
                                          name="correctOption"
                                          checked={quizQues.correctOption === index}
                                          id={index}
                                          onChange={() => handleCorrectOptionSelect(index)}
                                          />
                                          <label htmlFor={index} className='ms-1'> Correct Answer </label>
                                        </div>
                                      </div>
                                      <Editor
                                      editorState={option}
                                      onEditorStateChange={(editorState)=>{handleOptionsChange(editorState,index)}}
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
                                <button type='button' className='btn btn-primary' onClick={() => addQuestion()}>Add New Question</button>
                                <button type='button' className='btn btn-info' onClick={showAddModal}>Preview</button>
                              </div>
                              <div className="modal fade" id="addContent" style={{display: modalDisplay ? "block" : "none" }} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel">
                                <Modal quizContent={topicInfo.quizcontent} setTopicInfo={setTopicInfo} topicInfo={topicInfo}></Modal>
                              </div>
                              
                            </div>
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Understood</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                
                

                {/* Error Message */}
                {isError !== null && <div className="alert alert-danger">{isError}</div>}

                {/* Submit Button */}
                <div className="text-center">
                  <button type="submit" className="btn btn-success w-100">
                    <i className="bi bi-check-circle me-2"></i>Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddContent;


// import React, { useState } from 'react';
// import { EditorState, convertToRaw } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import draftToHtml from 'draftjs-to-html';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import { useAddcontentMutation, useLazyTopicdetailsQuery } from '../../services/technology';
// import { useNavigate, useParams } from 'react-router-dom';


// function AddContent() {
//   const [addcontentFn] = useAddcontentMutation();
//   const [topicdetailsFn] = useLazyTopicdetailsQuery();
//   const { tid, cid, topicId } = useParams();
//   const navigate = useNavigate();

//   const [topicInfo, setTopicInfo] = useState({
//     title: '',
//     shortheading: '',
//     type: '',
//     content: '',
//   });

//   const [editorState, setEditorState] = useState(EditorState.createEmpty());
//   const [isError, setError] = useState(null);

//   const onChangeValue = (e) => {
//     setTopicInfo({
//       ...topicInfo,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const onEditorStateChange = (editorState) => {
//     setEditorState(editorState);
//     const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));
//     setTopicInfo((prev) => ({ ...prev, content: htmlContent }));
//   };

//   const addContent = async (event) => {
//     event.preventDefault();
//     if (!topicInfo.title || !topicInfo.shortheading || !topicInfo.type || !topicInfo.content) {
//       setError('All fields are required.');
//       return;
//     }

//     try {
//       const response = await addcontentFn({ topicInfo, tid, cid, topicId });

//       if (response.error) {
//         throw new Error(response.error);
//       }

//       await topicdetailsFn({ tid, cid });
//       navigate(`/admin/addconcept/${tid}/topicdetails/${cid}/${topicId}`);
//     } catch (error) {
//       console.error('Error in adding content:', error);
//       setError('Failed to add content. Please try again.');
//     }
//   };

//   const handleCancel = () => {
//     navigate(-1); // Navigate back
//   };

//   return (
//     <div className="container my-4 ">
//       <div className="row justify-content-center">
//         <div className="col-md-12">
//           <div className="card shadow-lg border-0 rounded">
//             {/* Header with Close Button */}
//             <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
//               <h3 className="mb-0">Add Content</h3>
//               <button
//                 className="btn btn-primary btn-sm  p-0"
//                 onClick={handleCancel}
//                 title="Close"
//               ><i className="bi bi-x-circle text-danger fs-4 "></i>
                
//               </button>
//             </div>

//             <div className="card-body p-4">
//               <form onSubmit={addContent}>
//                 {/* Title Input */}
//                 <div className="mb-3">
//                   <label htmlFor="title" className="form-label fw-bold">Title</label>
//                   <input
//                     type="text"
//                     name="title"
//                     value={topicInfo.title}
//                     onChange={onChangeValue}
//                     className="form-control"
//                     placeholder="Enter Title"
//                     required
//                   />
//                 </div>

//                 {/* Short Heading Input */}
//                 <div className="mb-3">
//                   <label htmlFor="shortheading" className="form-label fw-bold">Short Heading</label>
//                   <input
//                     type="text"
//                     name="shortheading"
//                     value={topicInfo.shortheading}
//                     onChange={onChangeValue}
//                     className="form-control"
//                     placeholder="Enter Short Heading"
//                     required
//                   />
//                 </div>

//                 {/* Content Type Dropdown */}
//                 <div className="mb-3">
//                   <label htmlFor="type" className="form-label fw-bold">Content Type</label>
//                   <select
//                     name="type"
//                     value={topicInfo.type}
//                     onChange={onChangeValue}
//                     className="form-select"
//                     required
//                   >
//                     <option value="">Select content type</option>
//                     <option value="Concepts">Concepts</option>
//                     <option value="Video">Video</option>
//                     <option value="Practise-questions">Practice Questions</option>
//                     <option value="Assignments">Assignments</option>
//                     <option value="Examples">Examples</option>
//                     <option value="Quiz">Quiz</option>
//                     <option value="Projects">Projects</option>
//                   </select>
//                 </div>

//                 {/* Rich Text Editor */}
//                 <div className="mb-3">
//                   <label htmlFor="content" className="form-label fw-bold">Description</label>
//                   <div className="border p-2 rounded bg-light">
//                     <Editor
//                       editorState={editorState}
//                       toolbarClassName="toolbarClassName"
//                       wrapperClassName="wrapperClassName"
//                       editorClassName="editorClassName"
//                       onEditorStateChange={onEditorStateChange}
//                     />
//                   </div>
//                 </div>

//                 {/* Error Message */}
//                 {isError && <div className="alert alert-danger">{isError}</div>}

//                 {/* Submit & Cancel Buttons */}
//                 <div className="text-center">
//                    <button type="submit" className="btn btn-success w-100">
//                      <i className="bi bi-check-circle me-2"></i>Submit
//                    </button>
//                  </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddContent;

