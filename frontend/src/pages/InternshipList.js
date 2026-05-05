import React, { useEffect, useState } from "react";
import axios from "axios";

function InternshipList() {
    const [internships, setInternships] = useState([]);

    useEffect(()=> {
        axios.get("http://127.0.0.1:8000/api/internshipplacements/")
        .then(response => {
            console.log("API RESPONSE:", response.data);
            setInternships(response.data.results);
        })
        .catch(error => {
            console.error("Error fetching internships:", error);
        });
    }, []);

    return (
        <div style={{ padding: "20px "}}>
            <h2>Internship Placements</h2>

            {internships.length === 0 ? (
                <p>No internships found.</p>
            ) : (
                internships.map(internship => (
                    <div
                        key={internship.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "15px",
                            marginBottom: "15px",
                            borderRadius: "8px"
                        }}
                    >
                        <h3>{internship.organization_name}</h3>
                        <p><strong>Position:</strong> {internship.position}</p>
                        <p><strong>Location:</strong> {internship.location}</p>
                        <p><strong>Duration:</strong> {internship.duration}</p>
                        <p><strong>Stipend:</strong> {internship.stipend}</p>
                        <p>{internship.description}</p>
                        </div>
                    ))
                )}
            </div>
        );  
}

export default InternshipList;
