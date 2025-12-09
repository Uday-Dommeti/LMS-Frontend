
import React, { useEffect, useRef, useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useAddcontentMutation, useLazyTopicdetailsQuery } from '../../services/technology';
import { useNavigate, useParams } from 'react-router-dom';

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
                    <button type='button' className='btn btn-primary'>Create Quiz</button>
                    

                    
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

