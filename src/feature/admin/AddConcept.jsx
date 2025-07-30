import React, { useState } from "react";
import {
  useAddconceptMutation,
  useDeleteconceptMutation,
  useDeletetechnologyMutation,
  useDeletetopicMutation,
  useGettechnologyQuery,
  useLazyGettechnologyQuery,
  useUpdateconceptMutation,
} from "../../services/technology";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function AddConcept() {
  const { tid } = useParams();
  const navigate = useNavigate();
  const { data: technology } = useGettechnologyQuery(tid);

  const [getLazyTechFn] = useLazyGettechnologyQuery();
  const [deltechFn] = useDeletetechnologyMutation();
  const [addconceptFn] = useAddconceptMutation();
  const [updconceptFn] = useUpdateconceptMutation();
  const [delconceptFn] = useDeleteconceptMutation();
  const [deltopicFn] = useDeletetopicMutation();
  const [flag, setflag] = useState({ status: false });
  const [modalFlag, setModalFlag] = useState(false);

  async function deleteTechnology(technology) {
    await deltechFn(technology._id);
    navigate("/admin");
  }

  async function addConcept() {
    const conceptName = document.getElementById("conceptname").value;

    if (conceptName) {
      await addconceptFn({ concept: { conceptName }, id: tid });
      getLazyTechFn(tid);
      document.getElementById("conceptname").value = "";
    }
  }
  const editConcepttt = (concept) => {
    document.getElementById("conceptname").value = concept.conceptName;
    setflag({ status: true, id: concept._id });
  };

  async function editConcept(concept) {
    const conceptName = document.getElementById("conceptname").value;

    if (conceptName) {
      await updconceptFn({ concept: { conceptName }, tid, cid: flag.id });
      getLazyTechFn(tid);
    }
    setflag({ status: false, id: null });
    document.getElementById("conceptname").value = "";
  }

  async function deleteConcept(concept) {
    await delconceptFn({ tid, cid: concept._id });
    getLazyTechFn(tid);
  }

  async function delTopic(concept, topicid) {
    console.log(concept);
    const cid = concept._id;
    const toid = topicid;
    await deltopicFn({ tid, cid, toid });
    getLazyTechFn(tid);
  }

  return (
    <div className="container-fluid mt-4 ">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-4 border-end px-3 w-25">
          <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded shadow-sm">
            <b className="fw-bold m-0 fs-5">{technology?.title}</b>
            <div className="btn-group">
              <Link to={`/admin/addconcept/${tid}/edittechnology/`}>
                <button
                  className="btn btn-sm btn-outline-primary"
                  title="Edit Technology"
                >
                  <i className="bi bi-pencil-square fs-4"></i>
                </button>
              </Link>
              <button
                className="btn btn-sm btn-outline-danger"
                title="Delete Technology"
                onClick={() => deleteTechnology(technology)}
              >
                <i className="bi bi-trash fs-4"></i>
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                title="Add Concept"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => setModalFlag(true)}
              >
                <i className="bi bi-plus-circle-fill fs-4"></i>
              </button>
            </div>
          </div>

          {/* Concept List */}
          <div className="mt-3">
            {technology?.concepts?.map((concept) => (
              <div key={concept._id} className="card mb-3 shadow-sm">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <b className="m-0">{concept.conceptName}</b>
                    <div className="d-flex gap-2">
                      <i
                        className="bi bi-pencil-square text-success fs-5 cursor-pointer"
                        title="Edit Concept"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          editConcepttt(concept);
                          setModalFlag(true);
                        }}
                      ></i>
                      <i
                        className="bi bi-trash text-danger fs-5 cursor-pointer"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Delete Concept"
                        style={{ cursor: "pointer" }}
                        onClick={() => deleteConcept(concept)}
                      ></i>
                      <Link
                        to={`/admin/addconcept/${tid}/addtopic/${concept._id}`}
                      >
                        <i
                          className="bi bi-plus-circle-fill text-primary fs-5"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Add Topic"
                        ></i>
                      </Link>
                    </div>
                  </div>

                  {/* Topics List */}
                  <div className="mt-2">
                    {concept.topics?.map((topic) => (
                      <div
                        key={topic._id}
                        className="d-flex align-items-center justify-content-between bg-light rounded   mb-1"
                      >
                        <Link
                          to={`/admin/addconcept/${tid}/topicdetails/${concept._id}/${topic._id}`}
                          className="text-decoration-none text-dark"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="View Topic"
                        >
                          <i className="bi bi-book text-primary me-2"></i>
                          {topic?.shortheading}
                        </Link>

                        <div className="btn-group">
                          <Link
                            to={`/admin/addconcept/${tid}/edittopic/${concept._id}/${topic._id}`}
                          >
                            <button
                              className="btn btn-outline-success btn-sm"
                              title="Edit Topic"
                            >
                              <i className="bi bi-pen"></i>
                            </button>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            title="Delete Topic"
                            onClick={() => delTopic(concept, topic._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="col-md-8 w-75 ">
          {modalFlag && (
            // <div
            //   className="modal fade"
            //   id="exampleModal"
            //   data-bs-backdrop="static"
            //   tabIndex="-1"
            //   aria-labelledby="exampleModalLabel"
            //   aria-hidden="true"
            // >
            //   <div className="modal-dialog">
            //     <div className="modal-content">
            //       <div className="modal-header">
            //         <h1 className="modal-title fs-5" id="exampleModalLabel">
            //           Concept Name
            //         </h1>
            //         <button
            //           type="button"
            //           className="btn-close"
            //           data-bs-dismiss="modal"
            //           aria-label="Close"
            //         ></button>
            //       </div>
            //       <div className="modal-body">
            //         <input
            //           type="text"
            //           id="conceptname"
            //           className="form-control"
            //           placeholder="Concept Name"
            //         />
            //       </div>
            //       <div className="modal-footer">
            //         <button
            //           type="button"
            //           className="btn btn-secondary"
            //           data-bs-dismiss="modal"
            //         >
            //           Close
            //         </button>

            //         {flag.status === true ? (
            //           <button
            //             type="button"
            //             className="btn btn-primary"
            //             data-bs-dismiss="modal"
            //             onClick={() => {
            //               editConcept();
            //             }}
            //           >
            //             Update changes
            //           </button>
            //         ) : (
            //           <button
            //             type="button"
            //             className="btn btn-primary"
            //             data-bs-dismiss="modal"
            //             onClick={() => {
            //               addConcept();
            //             }}
            //           >
            //             Add Concept
            //           </button>
            //         )}
            //       </div>
            //     </div>
            //   </div>
            // </div>
            <div className="concept-container">
              <div className="concept-dialog">
                <div className="concept-content">
                  <div className="concept-header">
                    <h1 className="concept-title fs-5">Concept Name</h1>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setModalFlag(false);

                        // handle close logic here, e.g., hiding this component
                      }}
                      aria-label="Close"
                    ></button>
                  </div>

                  <div className="concept-body">
                    <input
                      type="text"
                      id="conceptname"
                      className="form-control"
                      placeholder="Concept Name"
                    />
                  </div>

                  <div className="concept-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setModalFlag(false);
                        // handle close logic here
                      }}
                    >
                      Close
                    </button>

                    {flag.status === true ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          editConcept();
                        }}
                      >
                        Update changes
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          addConcept();
                        }}
                      >
                        Add Concept
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AddConcept;
