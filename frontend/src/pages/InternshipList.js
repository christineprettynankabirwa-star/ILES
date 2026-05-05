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
                <ul>
                    {internships.results && internships.results.map((item) => (
                        <li key={item.id}>
                            <strong>Organization:</strong> {ClipboardItem.organisation_name}
                        </li>
                    ))}
                </ul>
            )}
            </div> 
        );  
}

export default InternshipList;
