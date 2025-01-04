import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dpreldjtbgpkaxivsyxi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmVsZGp0Ymdwa2F4aXZzeXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5OTc0NjAsImV4cCI6MjA0NzU3MzQ2MH0.vDlIQwUOxeVoUkdQPlD8uOhAmRzJDodJrNy3fvXVVVY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AffiliateSignUp = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, email, phone, password } = formData;

        if (!name || !email || !phone || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name, phone },
                },
            });

            if (error) {
                setMessage(`Error: ${error.message}`);
            } else {
                setMessage(`Welcome, ${name}! 🎉 Thank you for signing up.`);
                setFormData({ name: '', email: '', phone: '', password: '' });
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setMessage('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.title}>Affiliate Sign-Up</h2>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label htmlFor="name" style={styles.label}>Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="phone" style={styles.label}>Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="password" style={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.buttonContainer}>
                    <button
                        type="button"
                        style={{ ...styles.button, ...styles.cancelButton }}
                        onClick={() => setFormData({ name: '', email: '', phone: '', password: '' })}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
            </form>
            {message && <div style={styles.message}>{message}</div>}
        </div>
    );
};

const styles = {
    formContainer: {
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '20px 30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
        margin: 'auto',
        color: 'white',
    },
    title: {
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #555',
        borderRadius: '4px',
        backgroundColor: '#444',
        color: 'white',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#06f',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    cancelButton: {
        backgroundColor: '#555',
    },
    message: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '14px',
    },
};

export default AffiliateSignUp;