import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/ProfileDetailModal.module.css';

const ProfileDetailModal = ({ show, onClose, profile, onClick, showChatButton }) => {
    const handleChatStart = () => {
        onClose();
        if (onClick) onClick();
    };

    if (!show || !profile) {
        return null;
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <div className={styles.profileHeader}>
                    <img src={profile.image} alt={profile.name} className={styles.profileImage} />
                    <div className={styles.profileInfo}>
                        <h2>{profile.name} <span className={styles.profileType}>{profile.type}</span></h2>
                        <p className={styles.profileDetail}>나이 : {profile.age}</p>
                        <p className={styles.profileDetail}>키 : {profile.height}</p>
                        <p className={styles.profileDetail}>직업 : {profile.job}</p>
                        <p className={styles.profileDetail}>취미 : {profile.hobbies}</p>
                        {profile.tags && (
                            <div className={styles.profileTags}>
                                {profile.tags.split(' ').map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.profileDescription}>
                    <p>{profile.description}</p>
                </div>
                {showChatButton && (
                    <div className={styles.buttonContainer}>
                        <button className={styles.chatButton} onClick={handleChatStart}>대화 시작하기</button>
                    </div>
                )}
            </div>
        </div>
    );
};

ProfileDetailModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    profile: PropTypes.shape({
        image: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        job: PropTypes.string.isRequired,
        hobbies: PropTypes.string.isRequired,
        tags: PropTypes.string,
        description: PropTypes.string.isRequired,
    }).isRequired,
    onClick: PropTypes.func,
    showChatButton: PropTypes.bool
};

ProfileDetailModal.defaultProps = {
    onClick: null,
    showChatButton: true
};

export {
    ProfileDetailModal
};
