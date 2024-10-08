import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/MainPage.module.css';

const ProfileCard = ({ image, name, type, tags, onClick, isRecommended }) => {
    const tagList = tags.split('#').filter(tag => tag.trim() !== '');

    return (
        <button
            className={`${styles.profileCard} ${isRecommended ? styles.recommendedCard : ''}`}
            onClick={onClick}
        >
            {isRecommended && <div className={styles.recommendedBadge}>추천</div>}
            <img src={image} alt={name} className={styles.profileImage} />
            <div className={styles.profileHeader}>
                <span className={styles.profileName}>{name}</span>
                <span className={styles.mbtiTag}>#{type.replace('#', '')}</span>
            </div>
            <div className={styles.profileTags}>
                {tagList.map((tag, index) => (
                    <span key={index} className={styles.tag}>#{tag.trim()}</span>
                ))}
            </div>
        </button>
    );
};

ProfileCard.propTypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isRecommended: PropTypes.bool,
};

ProfileCard.defaultProps = {
    isRecommended: false,
};

export { ProfileCard };