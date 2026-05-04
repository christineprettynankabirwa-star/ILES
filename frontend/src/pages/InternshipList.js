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
        <div>
            <h2>Internship Placements</h2>

            {internships.length === 0 ? (
                <p>No internships found.</p>
            ) :(
                <u1>
                    {internships.map(internship => (
                        <li key={internship.id}>
                            {internship.company_name} - {internship.position}
                        </li>
                    ))}
                </u1>
            )}
            </div> 
        );  
}

export default InternshipList;
