import React, { useEffect, useState } from "react";
import { useGetAlltechnologiesQuery, useTopicdetailsQuery } from "../../services/technology";
import { useDeletecontentMutation, useLazyTopicdetailsQuery } from "../../services/technology";
import { Link, Outlet, useParams } from "react-router-dom";
import parse from "html-react-parser";

function Topicdetails() {
  const { tid, cid, topicId } = useParams();
  const { data: technology,  } = useTopicdetailsQuery({ tid, cid });
  const [topicdetails, setTopicdetails] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  const [deletecontentFn] = useDeletecontentMutation();
  const [fetchTopicdetails, { data: fetchedDetails }] = useLazyTopicdetailsQuery();
  const {data,isLoading}=useGetAlltechnologiesQuery()
  


  useEffect(() => {
    fetchTopicdetails({ tid, cid });
  }, [tid, cid, fetchTopicdetails]);

  useEffect(() => {
    if (technology) {
      const selectedConcept = technology?.concepts?.find((concept) => concept._id === cid);
      const selectedTopic = selectedConcept?.topics?.find((topic) => topic._id === topicId);
      const validContents = selectedTopic?.contents?.filter((content) => typeof content.content === "string");

      setTopicdetails(validContents || []);
    }
  }, [technology, cid, topicId]);

  // Extract unique content types dynamically
  const uniqueTabs = [...new Set(topicdetails.map((content) => content.type))];


  // Set the first available tab as active if not already set
  useEffect(() => {
    if (uniqueTabs.length > 0 && !activeTab) {
      setActiveTab(uniqueTabs[0]);
      console.log(uniqueTabs);
    }
  }, [uniqueTabs, activeTab]);

  const deleteContent = async (contentId) => {
    await deletecontentFn({ tid, cid, topicId, contentId });
    setTopicdetails((prevDetails) => prevDetails.filter((content) => content._id !== contentId));
  };

  const filteredContent = topicdetails.filter((content) => content.type === activeTab);

  // console.log(filteredContent);

  return (
    <div className="container mt-4">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 className="fw-bold">
          
          {
            data?.map((technology)=>{
              return(
                <>
                 
                
                 {
                    technology._id===tid &&
                    technology.concepts.map((concept)=>{
                      return(
                        <>
                        {
                          concept._id===cid &&
                          concept.topics.map((topic)=>{
                            return(
                              <>
                              {
                                topic._id===topicId &&
                                <h6 className="breadcrumb-item active text-primary" aria-current="page"><h3 className="p-1">{topic.title}</h3></h6>
                              }
                              </>
                            )
                          })
                        }
                        </>
                      )
                    })
                 }
                </>
              )
            })
            
          }
          
          </h6>
        {technology?.concepts?.length > 0 && (
          <Link to={`/admin/addconcept/${technology._id}/topicdetails/${technology.concepts[0]._id}/${topicId}/addcontent`}>
            <button className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>Add Content
            </button>
          </Link>
        )}
      </div>

      {/* Dynamic Tabs */}
      {uniqueTabs.length > 0 ? (
        <ul className="nav nav-tabs">
          {uniqueTabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <>
        <div className="alert alert-warning text-center">No content types available.</div>
        </>
      )}

      <Outlet />

      <div>
        {filteredContent.length > 0 ? (
          filteredContent.map((content) => (
            <div className="card shadow-sm mb-3 border-0 rounded" key={content._id}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title text-primary">{content.shortheading}</h5>
                  <div>
                    <Link to={`/admin/addconcept/${tid}/edittopic/${cid}/${topicId}/${content._id}/editcontent`} className="text-success me-3">
                      <i className="bi bi-pencil-square fs-5"></i>
                    </Link>
                    <i className="bi bi-trash fs-5 text-danger" onClick={() => deleteContent(content._id)} role="button"></i>
                  </div>
                </div>
                <div className="card-text">{parse(content.content)}</div>
              </div>
            </div>
          ))
        ) :
        (
          <>
          
          {/* <div className="alert alert-warning text-center">No content available for {activeTab}.</div> */}
          </>
        )
        }
      </div>
    </div>
  );
}

export default Topicdetails;

