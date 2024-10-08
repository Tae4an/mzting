import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/ProfileDetailModal.module.css';
import { ImageModal, PreviousChatsModal, GenerateImageModal, CommentModal } from '../components';

const ProfileDetailModal = ({ show, onClose, profile, onClick, showChatButton, loadChatRoomData }) => {
    const [showImageModal, setShowImageModal] = useState(false);
    const [showChatsModal, setShowChatsModal] = useState(false);
    const [showGenerateImageModal, setShowGenerateImageModal] = useState(false);
    const [previousChats, setPreviousChats] = useState([]);
    const [showCommentModal, setShowCommentModal] = useState(false);

    useEffect(() => {
        const fetchPreviousChats = async () => {
            if (show && loadChatRoomData) {
                const chatRoomData = await loadChatRoomData(profile.id);
                const formattedChats = chatRoomData.map(chat => ({
                    name: `채팅방 ${chat.name}`,
                    lastMessage: chat.lastMessage || "메시지 없음",
                }));
                setPreviousChats(formattedChats);
            }
        };

        fetchPreviousChats();
    }, [show, loadChatRoomData, profile.id]);

    const handleImageClick = () => {
        setShowImageModal(true);
    };

    const handleImageModalClose = () => {
        setShowImageModal(false);
    };

    const handleChatsClick = () => {
        setShowChatsModal(true);
    };

    const handleChatsModalClose = () => {
        setShowChatsModal(false);
    };

    const handleChatStart = () => {
        if (onClick) {
            onClose(); // 모달을 먼저 닫고
            onClick(); // 이후 onClick 콜백 호출
        }
    };

    if (!show || !profile) {
        return null;
    }

    const handleGenerateImageModal = () => {
        setShowGenerateImageModal(!showGenerateImageModal);
    };

    const openCommentModal = () => {
        setShowCommentModal(true)
    }

    const closeCommentModal = () => {
        setShowCommentModal(false)
    }

    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                    <div className={styles.profileHeader}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <button
                                className={styles.profileImageButton}
                                onClick={handleImageClick}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleImageClick();
                                }}
                                aria-label="View profile image"
                            >
                                <img
                                    src={profile.image}
                                    alt={profile.name}
                                    className={styles.profileImage}
                                />
                            </button>
                            <button onClick={handleGenerateImageModal} className={styles.generateImageButton}>
                                이미지 설정하기
                            </button>
                        </div>
                        <div>
                            <h2 className={styles.profileTitle}>
                                <span className={styles.profileName}>{profile.name}</span>
                                <span className={styles.profileType}>{profile.type}</span>
                            </h2>
                            <div className={styles.profileInfo}>
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
                    </div>
                    <div className={styles.profileDescription}>
                        <p>{profile.description}</p>
                    </div>
                    {showChatButton && (
                        <div className={styles.buttonContainer}>
                            <button className={styles.chatButton} onClick={handleChatStart}>대화 시작하기</button>
                            {previousChats.length > 0 && (
                                <button className={styles.chatButton} onClick={handleChatsClick}>이전 채팅방</button>
                            )}
                            <button className={styles.chatButton} onClick={openCommentModal}>해당 댓글 보기</button>
                        </div>
                    )}
                </div>
            </div>
            {showImageModal && (
                <ImageModal
                    show={showImageModal}
                    onClose={handleImageModalClose}
                    image={profile.image}
                />
            )}
            {showChatsModal && (
                <PreviousChatsModal
                    show={showChatsModal}
                    onClose={handleChatsModalClose}
                    mbti={profile.type} // MBTI 정보 전달
                    chats={previousChats}
                />
            )}
            {showGenerateImageModal && (
                <GenerateImageModal
                    show={showGenerateImageModal}
                    onClose={handleGenerateImageModal}
                    profileId={profile.id}
                />
            )}
            {showCommentModal && (<CommentModal
                show={showCommentModal}
                onClose={closeCommentModal}
                propsData={{type: profile.type, profileId: profile.id}}
                isResult = {false}
            />)}
        </>
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
    showChatButton: PropTypes.bool,
    loadChatRoomData: PropTypes.func,
};

ProfileDetailModal.defaultProps = {
    onClick: null,
    showChatButton: true,
    loadChatRoomData: null,
};

export {
    ProfileDetailModal
};
