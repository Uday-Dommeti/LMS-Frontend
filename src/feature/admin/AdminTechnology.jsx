import React from 'react';
import { Link } from 'react-router-dom';
import { useGetAlltechnologiesQuery } from '../../services/technology';

function AdminTechnology() {
    const { data: technologies, isLoading } = useGetAlltechnologiesQuery();

    if (isLoading) return <p className="text-center mt-4">Loading...</p>;

    return (
        <div className='container mt-4'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-start">Technologies</h2>
                <Link to="/admin/addtechnology" className="btn btn-primary">
                    Add Technology
                </Link>
                <Link to="/admin/questionbank" className='btn btn-warning'>Question Bank</Link>
            </div>
            <h2 className='text-center text-success mb-4'>FullStack Training Tutorials</h2>
            <div className='row justify-content-center'>
                {technologies?.map((technology) => (
                    <div key={technology._id} className='col-md-4 col-lg-3 mb-4'>
                        <div className='card shadow border-0 rounded-3 h-100 tech-card'>
                            <div className='card-body text-center'>
                                <h5 className='card-title text-dark fw-bold'>{technology.title}</h5>
                                <img 
                                    src={technology.image} 
                                    alt={technology.title} 
                                    className='img-fluid rounded mb-3' 
                                    style={{ height: '150px', objectFit: 'cover' }} 
                                />
                                <p className='card-text text-secondary'>{technology.description}</p>
                                <Link to={`/admin/addconcept/${technology._id}`} className="btn btn-outline-primary">
                                More Info
                            </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default AdminTechnology;
