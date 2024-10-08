import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/SignupPage.module.css';
import MZting_logo from '../assets/Images/MZting_logo.png';

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [mbti, setMbti] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== passwordCheck) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post('/api/auth/register', {
                username: email, // Use email as the username/userId
                password,
                name,
                nickname,
                email,
                mbti,
                gender,
                age,
            });
            alert('Registration successful');
            navigate('/login');
        } catch (error) {
            if (error.response) {
                setError(error.response.data);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    const generateAgeOptions = () => {
        const options = [];
        for (let i = 1; i <= 100; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return options;
    };

    const handleLogoClick = () => {
        navigate('/login');
    };

    return (
        <div className={styles.signupFormContainer}>
            <form className={styles.signupForm} onSubmit={handleSubmit}>
                <img
                    src={MZting_logo}
                    className={styles.signupLogo}
                    alt="Signup Logo"
                    onClick={handleLogoClick}
                    style={{ cursor: 'pointer'}}
                />
                {error && <p className={styles.error}>{error}</p>}
                <div className={styles.inputGroup}>
                    <label htmlFor="userEmail" className={styles.label}>Email (ID)</label>
                    <input
                        type="email"
                        id="userEmail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="이메일 입력"
                        className={styles.textInput}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="userPassword" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="userPassword"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="비밀번호 입력"
                        className={styles.textInput}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="userPasswordCheck" className={styles.label}>Password Check</label>
                    <input
                        type="password"
                        id="userPasswordCheck"
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                        required
                        placeholder="비밀번호 확인"
                        className={styles.textInput}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="userName" className={styles.label}>Name</label>
                    <input
                        type="text"
                        id="userName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="이름 입력"
                        className={styles.textInput}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="userNickName" className={styles.label}>Nick Name</label>
                    <input
                        type="text"
                        id="userNickName"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        placeholder="닉네임 입력"
                        className={styles.textInput}
                    />
                </div>
                <div className={styles.selectGender}>
                    <label htmlFor="userGender" className={styles.label}>Gender</label>
                    <select
                        id="userGender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className={styles.textInput}
                    >
                        <option value="" disabled>성별 선택</option>
                        <option value="Male">남성</option>
                        <option value="Female">여성</option>
                    </select>
                </div>
                <div className={styles.selectAge}>
                    <label htmlFor="userAge" className={styles.label}>Age</label>
                    <select
                        id="userAge"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        className={styles.textInput}
                    >
                        <option value="" disabled>나이 선택</option>
                        {generateAgeOptions()}
                    </select>
                </div>
                <div className={styles.selectMBTI}>
                    <label htmlFor="userMbti" className={styles.label}>MBTI</label>
                    <select
                        id="userMbti"
                        value={mbti}
                        onChange={(e) => setMbti(e.target.value)}
                        required
                        className={styles.textInput}
                    >
                        <option value="" disabled>MBTI 선택</option>
                        <option value="INTJ">INTJ</option>
                        <option value="INTP">INTP</option>
                        <option value="ENTJ">ENTJ</option>
                        <option value="ENTP">ENTP</option>
                        <option value="INFJ">INFJ</option>
                        <option value="INFP">INFP</option>
                        <option value="ENFJ">ENFJ</option>
                        <option value="ENFP">ENFP</option>
                        <option value="ISTJ">ISTJ</option>
                        <option value="ISFJ">ISFJ</option>
                        <option value="ESTJ">ESTJ</option>
                        <option value="ESFJ">ESFJ</option>
                        <option value="ISTP">ISTP</option>
                        <option value="ISFP">ISFP</option>
                        <option value="ESTP">ESTP</option>
                        <option value="ESFP">ESFP</option>
                    </select>
                </div>
                <button type="submit" className={styles.signupButton}>Sign Up</button>
            </form>
        </div>
    );
};

export { SignupForm };