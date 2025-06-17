import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAlltechnologiesQuery,
  useTopicdetailsQuery,
} from "../../services/technology";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { Helmet } from "react-helmet";
import "./TopicDetails.css";
import Modal from "./Modal";

function TopicDetails() {
  const { tName, cName, toName } = useParams();
  const { data: allTechnologies, isLoading: isAllTechnologiesLoading } =
    useGetAlltechnologiesQuery();
  const tech = allTechnologies?.find((el) => el.title === tName);
  const concept = tech?.concepts?.find(
    (el) => el.conceptName === cName.replaceAll("-", " ")
  );
  const filteredTopic = concept?.topics?.find(
    (el) => el.title === toName.replaceAll("-", " ")
  );
  var validContents = filteredTopic?.contents?.filter(
    (content) => typeof content.content === "string"
  );
  const tid = tech?._id;
  const cid = concept?._id;
  const [modalSrc, setModalSrc] = useState({});

  const { isLoading: isTechnologyLoading } = useTopicdetailsQuery({ tid, cid });
  const [activeTab, setActiveTab] = useState("");
  const uniqueTabs = useMemo(() => {
    return [...new Set(validContents.map((content) => content.type))];
  }, [validContents]);
  const filteredContent = validContents.filter(
    (content) => content.type === activeTab
  );

  useEffect(() => {
    var temp = filteredContent.map((el) => {
      parse(el.content).filter((ele) => {
        if (
          ele !== "\n" &&
          ((ele.type === "p" && ele.props.children !== undefined) ||
            ele.type == "img" ||
            ele.type === "iframe")
        ) {
          return true;
        }
      });
      return el;
    });
    console.log("lkj", temp);
  }, [filteredContent]);

  useEffect(() => {
    const tab = localStorage.getItem("activeTab");
    const findTab = uniqueTabs?.filter((el) => el === tab);
    let filteredTab = findTab.length > 0 ? tab : validContents[0]?.type;
    setActiveTab(filteredTab);
    localStorage.setItem("activeTab", filteredTab);
  }, [uniqueTabs, validContents]);

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
          <img
            {...domNode.attribs}
            onClick={() => openModal(src, domNode.name)}
            style={{ cursor: "zoom-in", objectFit: "contain", width: "100%" }}
            alt=""
          />
        );
      }
    },
  };

  useEffect(() => {
    console.log(modalSrc);
  }, [modalSrc]);

  return (
    <div className="container-fluid py-1 px-0 bg-white">
      {/* Loader for Initial API Fetching */}
      {isTechnologyLoading || isAllTechnologiesLoading ? (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <Helmet>
            <title>{filteredTopic?.shortheading}</title>
            <meta name="description" content="Nested component" />
          </Helmet>
          <h2 className="p-1 fw-bold" style={{ color: "rgb(42, 82, 152)" }}>
            {filteredTopic?.title}
          </h2>

          {/* Content Section */}
          {uniqueTabs && uniqueTabs.length > 0 ? (
            <div className="card border-0">
              <div className="card-header bg-white px-0 position-sticky top-0">
                <ul className="nav nav-tabs card-header-tabs border-bottom-0">
                  {uniqueTabs.map((tab) => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`nav-link text-bold ${
                          activeTab === tab
                            ? "text-primary fw-semibold"
                            : "text-secondary"
                        }`}
                        onClick={() => {
                          setActiveTab(tab);
                          localStorage.setItem("activeTab", tab);
                        }}
                      >
                        <i
                          className={`bi bi-${
                            tab.toLowerCase() === "theory"
                              ? "book"
                              : tab.toLowerCase() === "practice"
                              ? "code-square"
                              : tab.toLowerCase() === "quiz"
                              ? "question-circle"
                              : "file-text"
                          } me-2`}
                        ></i>
                        {tab && tab === "Description" ? "Notes" : tab}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-body p-2">
                {filteredContent.length > 0 ? (
                  <div className="content-wrapper">
                    {filteredContent.map((content, index) => (
                      <div className="content-section mb-3" key={content._id}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 className="mb-0 ">
                            <span className="badge bg-primary me-2">
                              {index + 1}
                            </span>
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
                                console.log(
                                  "ooo",
                                  parse(content.content).filter(
                                    (el) => el.type === "iframe"
                                  )
                                );
                              }}
                            >
                              <i className="bi bi-zoom-in"></i> Fullscreen
                            </button>
                          )}
                        </div>
                        <div className="content-body bg-white rounded-3 shadow-sm border border-grey">
                          {parse(content.content, options).map((el, i) => {
                            if (
                              (el.type === "p" &&
                                el.props.children !== undefined) ||
                              el.type === "img" ||
                              el.type === "iframe"
                            ) {
                              if (activeTab === "Examples") {
                                return (
                                  <div key={i} className="px-2">
                                    <p
                                      className={` ms-5 mb-2 ${
                                        Array.isArray(el?.props?.children)
                                          ? "ps-5"
                                          : "ms-0"
                                      }`}
                                    >
                                      {el.props.children}
                                    </p>
                                    {el.type === "iframe" && (
                                      <span className="ms-5 pb-4 ps-5">
                                        <a href={el.props.src} target="blank">
                                          {el.props.src}
                                        </a>
                                      </span>
                                    )}
                                  </div>
                                );
                              } else {
                                return el;
                              }
                            }
                            return null; // Return null for elements that don't match
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
              </div>
            </div>
          ) : (
            // <div className="alert alert-warning d-flex align-items-center" role="alert">
            //   <i className="bi bi-exclamation-triangle-fill me-2"></i>
            //   <div>No content available for this topic.</div>
            // </div>
            <div className="d-flex justify-content-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </>
      )}
      {modalSrc?.src != undefined && (
        <Modal modalSrc={modalSrc} setModalSrc={setModalSrc}></Modal>
      )}
    </div>
  );
}

export default TopicDetails;
