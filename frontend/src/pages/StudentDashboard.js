import { useState, useEffect } from 'react';

function StudentDashbord() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placement, setPlacement] = useState(null);
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({
        week_number: '',
        description: '',
        hours_worked: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.log("No token found");
            
        }
}