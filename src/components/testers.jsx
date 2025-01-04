import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Section from "./Section";
import { smallSphere, stars } from "../assets";

const SUPABASE_URL = "https://dpreldjtbgpkaxivsyxi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcmVsZGp0Ymdwa2F4aXZzeXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5OTc0NjAsImV4cCI6MjA0NzU3MzQ2MH0.vDlIQwUOxeVoUkdQPlD8uOhAmRzJDodJrNy3fvXVVVY";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AffiliatePage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

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
                setShowForm(false);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setMessage('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section className="overflow-hidden" id="tester">
            <div className="container relative z-2">
                <div className="hidden relative justify-center mb-[6.5rem] lg:flex">
                    <img
                        src={smallSphere}
                        className="relative z-1"
                        width={255}
                        height={255}
                        alt="Sphere"
                    />
                    <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                        <img
                            src={stars}
                            className="w-full"
                            width={950}
                            height={400}
                            alt="Stars"
                        />
                    </div>
                </div>

                <h1 className="text-center text-white text-4xl font-bold mt-8">Become a Tester</h1>

                <div className="mt-16 px-8 text-white text-center text-xl italic">
                    <p className="mb-6">Join our exclusive tester program and gain early access to new features and updates. Help shape the future of our platform while enjoying unique rewards and insights.</p>

                    <p className="mb-6">As a tester, you’ll collaborate directly with our team, provide valuable feedback, and be the first to explore groundbreaking tools and functionalities.</p>

                    <p className="mb-6 font-bold">Benefits for Testers:</p>
                    <ul className="list-disc list-inside mb-6">
                        <li>Earn <strong>5000 NFC (newFrequency Coins)</strong> upon completing the 14-day testing program.</li>
                        <li>These coins can be used for transactions, staking, and other platform activities as their value grows.</li>
                        <li>Exclusive tester-only access to premium features and content.</li>
                        <li>Gain recognition as a founding member of our tester community.</li>
                        <li>Opportunity to influence the future development of our app.</li>
                    </ul>

                    <p className="mb-6 font-bold">Limited Slots Available - Only the first 12 testers can join!</p>

                    <p className="mb-6 font-bold">Act fast! The program lasts for 14 days only!</p>

                    <p className="mb-6 font-bold">Start your journey with us today!</p>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-lg w-auto max-w-xs mx-auto"
                    >
                        Join as a Tester
                    </button>
                </div>

                {showForm && (
                    <div style={styles.formOverlay}>
                        <div style={styles.formContainer}>
                            <h2 style={styles.title}>Tester Sign-Up</h2>
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
                                        onClick={() => setShowForm(false)}
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
                    </div>
                )}
            </div>
        </Section>
    );
};

const styles = {
    formOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    formContainer: {
        backgroundColor: '#333',
        borderRadius: '8px',
        padding: '20px 30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
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

export default AffiliatePage;
