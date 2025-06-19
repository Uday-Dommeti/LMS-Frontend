import React, { useEffect, useMemo, useState } from "react";
import {
  useGetAlltechnologiesQuery,
  useTopicdetailsQuery,
} from "../../services/technology";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./TopicDetails.css";
import TopicChildDetails from "./TopicChildDetails";

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

  const { isLoading: isTechnologyLoading } = useTopicdetailsQuery({ tid, cid });
  const [activeTab, setActiveTab] = useState("");
  const uniqueTabs = useMemo(() => {
    return [...new Set(validContents.map((content) => content.type))];
  }, [validContents]);
  const filteredContent = validContents.filter(
    (content) => content.type === activeTab
  );

  useEffect(() => {
    const tab = localStorage.getItem("activeTab");
    const findTab = uniqueTabs?.filter((el) => el === tab);
    let filteredTab = findTab.length > 0 ? tab : validContents[0]?.type;
    setActiveTab(filteredTab);
    localStorage.setItem("activeTab", filteredTab);
  }, [uniqueTabs, validContents]);

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
                            ? "text-primary fw-semibold border border-bottom-0"
                            : "text-secondary"
                        }`}
                        onClick={() => {
                          setActiveTab(tab);
                          localStorage.setItem("activeTab", tab);
                        }}
                      >
                        <i className={`bi bi-file-text me-2`}></i>
                        {tab && tab === "Description" ? "Notes" : tab}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <TopicChildDetails
                activeTab={activeTab}
                filteredContent={filteredContent}
              ></TopicChildDetails>
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
    </div>
  );
}

export default TopicDetails;
