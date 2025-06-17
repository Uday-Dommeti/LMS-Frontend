import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetAlltechnologiesQuery } from "../../services/technology";
function Technology() {
  const navigate = useNavigate();
  var { data: technologies, isLoading } = useGetAlltechnologiesQuery();

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }
  const handlesubmit = (technology) => {
    if (
      technology.concepts?.length > 0 &&
      technology.concepts[0].topics?.length > 0
    ) {
      // navigate(`/technologydetails/${technology._id}/${technology.concepts[0]._id}/${technology.concepts[0].topics[0]._id}`);
      navigate(
        `/Training/${
          technology.title
        }/${technology.concepts[0].conceptName.replaceAll(
          " ",
          "-"
        )}/${technology.concepts[0].topics[0].title.replaceAll(" ", "-")}`
      );
    } else {
      alert("No concepts or topics available for this technology.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center text-success mb-4">
        FullStack Training Tutorials
      </h2>
      <div className="row justify-content-start">
        {technologies?.map((technology) => (
          <div key={technology._id} className="col-md-4 col-lg-3 mb-4">
            <div className="card shadow border-0 rounded-3 h-100 tech-card">
              <div className="card-body text-center">
                <h5 className="card-title text-dark fw-bold">
                  {technology.title}
                </h5>
                <img
                  src={technology.image}
                  alt={technology.title}
                  className="img-fluid rounded mb-3"
                  style={{ height: "150px", objectFit: "cover" }}
                />
                <p className="card-text text-secondary">
                  {technology.description}
                </p>
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={() => handlesubmit(technology)}
                >
                  Explore More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Technology;
