import React, { useState } from "react";
import parse from "html-react-parser";
import Modal from "./Modal";
import QuizApp from "../quiz/Quiz";

function TopicChildDetails({ activeTab, filteredContent }) {
  const [modalSrc, setModalSrc] = useState({});

  const openModal = (src, type) => {
    setModalSrc({ src: src, type: type });
    const modalEl = document.getElementById("fullScreenImage");
    if (modalEl) modalEl.style.display = "block";
  };

  const options = {
    replace: (domNode) => {
      if (domNode.type === "tag" && domNode.name === "img") {
        const src = domNode.attribs.src;
        return (
          <div className="d-flex justify-content-center">
            <img
              {...domNode.attribs}
              onClick={() => openModal(src, domNode.name)}
              style={{
                cursor: "zoom-in",
                objectFit: "contain",
                maxWidth: "100%",
                minHeight: "300px",
              }}
              alt=""
            />
          </div>
        );
      }
    },
  };
  return (
    <div className="card-body p-2 h-100">
      {filteredContent.length > 0 ? (
        <div className="content-wrapper">
          {filteredContent.map((content, index) => (
            <div className="content-section mb-3" key={content._id}>
              {activeTab !== "Quiz" && (
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="mb-0 ">
                    <span className="badge bg-primary me-2">{index + 1}</span>
                    {content.shortheading}
                  </h5>
                  {activeTab === "Description" && (
                    <button
                      className="btn btn-info d-none d-lg-flex"
                      onClick={() => {
                        var temp = parse(content.content).filter(
                          (el) => el.type === "iframe"
                        );
                        openModal(temp[0]?.props?.src, temp[0]?.type);
                      }}
                    >
                      <i className="bi bi-zoom-in"></i> Fullscreen
                    </button>
                  )}
                </div>
              )}
              <div className="content-body bg-white rounded-3 shadow-sm border border-grey">
                {parse(content.content, options).map((el, i) => {
                  if (el !== "\n" && el?.type !== undefined) {
                    if (activeTab === "Examples") {
                      return (
                        <div key={i} className="px-2 m-3">
                          {el.props.children !== undefined && (
                            <p
                              className={` ms-5 mb-2 ${
                                Array.isArray(el?.props?.children)
                                  ? "ps-5"
                                  : "ms-0"
                              }`}
                            >
                              {el.props.children}
                            </p>
                          )}
                          {el.type === "iframe" && (
                            <span className="pb-4 w-100">
                              <a
                                className="w-100"
                                href={el.props.src}
                                target="blank"
                              >
                                {el.props.src}
                              </a>
                            </span>
                          )}
                        </div>
                      );
                    } else if (activeTab === "Assignments") {
                      return (
                        <div key={i} className="">
                          {el}
                        </div>
                      );
                    } else if (activeTab === "Quiz") {
                      return <QuizApp />;
                    } else {
                      if (el?.type !== "p" || el.props.children !== undefined) {
                        return el;
                      }
                    }
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="alert alert-info d-flex align-items-center"
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          <div>No content available for this section yet.</div>
        </div>
      )}
      {modalSrc?.src != undefined && (
        <Modal modalSrc={modalSrc} setModalSrc={setModalSrc}></Modal>
      )}
    </div>
  );
}

export default TopicChildDetails;
