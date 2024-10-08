import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/ChatPage.module.css';
import { ChatBox, TimePassedModal, IntroductionModal, ChatHistory, MissionModal } from '../components';
import { sendPostRequest } from '../services';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChatPage = () => {
    const location = useLocation();
    const state = location.state || {};
    const navigate = useNavigate();

    const selectedProfile = state.selectedProfile || state;
    const {
        image,
        name,
        type,
        age,
        height,
        job,
        hobbies,
        tags,
        description
    } = selectedProfile;

    const chatRoomId = state.chatRoomId;
    const isFirst = state.isFirst || false;

    const mbti = type ? type.replace('#', '') : '';

    const [messages, setMessages] = useState([]);
    const [stages, setStages] = useState({
        stage1Complete: false,
        stage2Complete: false,
        stage3Complete: false
    });
    const [isActualMeeting, setIsActualMeeting] = useState(false);
    const [claudeResponse, setClaudeResponse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [backgroundChanged, setBackgroundChanged] = useState(false);
    const [stageToComplete, setStageToComplete] = useState(null);
    const [isIntroModalOpen, setIsIntroModalOpen] = useState(isFirst);
    const [previousChat, setPreviousChat] = useState(50);
    const [chatDiff, setChatDiff] = useState(0);
    const [chatCount, setChatCount] = useState(0);
    const [showMissionModal, setShowMissionModal] = useState(false);

    const openShowMissionModal = () => {
        setShowMissionModal(true)
    }

    const closeShowMissionModal = () => {
        setShowMissionModal(false)
    }

    useEffect(() => {
        if(isFirst) {
            setIsIntroModalOpen(true);
        }
    }, [isFirst]);

    const handleHistoryLoaded = (formattedMessages, loadedStages) => {
        setMessages(formattedMessages);
        if (loadedStages) {
            setStages(loadedStages);
        }
    };

    useEffect(() => {
        if (claudeResponse) {
            updateStages(claudeResponse);
        }
    }, [claudeResponse]);

    useEffect(() => {
        if (stageToComplete !== null) {
            const timer = setTimeout(() => {
                handleModalDisplay(stageToComplete);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [stageToComplete]);

    useEffect(() => {
        if (stages.stage3Complete) {
            const timer = setTimeout(() => {
                navigate('/result', {
                    state: {
                        chatRoomId: chatRoomId,
                        profileDetails: selectedProfile
                    }
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [stages.stage3Complete, navigate, chatRoomId, selectedProfile]);

    const handleCloseIntroModal = () => {
        setIsIntroModalOpen(false);
        if (isFirst) {
            sendInitialMessage();
        }
    };

    const handleModalDisplay = (stage) => {
        let modalMessage;

        switch(stage) {
            case 1:
                modalMessage = "약속 날짜까지 시간이 흘렀습니다...";
                break;
            case 2:
                modalMessage = "대화를 마무리하고 있습니다...";
                break;
            case 3:
                modalMessage = "소개팅이 끝나고 있습니다...";
                break;
            default:
                return;
        }

        setIsModalOpen(true);

        const timer = setTimeout(() => {
            setIsModalOpen(false);
            if (stage === 1) setIsActualMeeting(true);

            setTimeout(() => {
                setBackgroundChanged(true);
            }, 500);
        }, 3000);

        return () => clearTimeout(timer);
    };

    const updateStages = (claudeResponse) => {
        setStages(prevStages => {
            const newStages = {
                stage1Complete: claudeResponse.stage1Complete,
                stage2Complete: claudeResponse.stage2Complete,
                stage3Complete: claudeResponse.stage3Complete
            };

            if (newStages.stage1Complete && !prevStages.stage1Complete) {
                toast.success("미션 완료: 성공적으로 약속을 잡았습니다!", {
                    position: "top-center",
                    autoClose: 5000,
                });
                setStageToComplete(1);
            } else if (newStages.stage2Complete && !prevStages.stage2Complete) {
                toast.success("미션 완료: 실제 만남에서 대화를 나눴습니다!", {
                    position: "top-center",
                    autoClose: 5000,
                });
                setStageToComplete(2);
            } else if (newStages.stage3Complete && !prevStages.stage3Complete) {
                toast.success("미션 완료: 만남 후 애프터 여부를 결정했습니다!", {
                    position: "top-center",
                    autoClose: 5000,
                });
                setStageToComplete(3);
            }

            return newStages;
        });
    };

    const sendInitialMessage = async () => {
        const initialContext = {
            name,
            type,
            age,
            height,
            job,
            hobbies: Array.isArray(hobbies) ? hobbies.join(', ') : hobbies,
            tags: Array.isArray(tags) ? tags.join(', ') : tags,
            description
        };

        const initialMessageContent = `안녕하세요. 소개팅 상대방의 정보입니다: ${JSON.stringify(initialContext)}`;

        try {
            const requestData = {
                message : initialMessageContent,
                mbti : mbti,
                chatRoomId : chatRoomId
            }
            console.log(requestData);
            const response = await sendPostRequest(requestData, "api/ask-claude")

            if (response.claudeResponse && response.claudeResponse.text) {
                const responseMessage = {
                    content: response.claudeResponse.text,
                    isSent: false,
                    avatar: image,
                    botInfo: {
                        feel: response.claudeResponse.feel,
                        score: response.claudeResponse.score,
                        evaluation: response.claudeResponse.evaluation
                    }
                };
                setMessages(prevMessages => [...prevMessages, responseMessage]);
                setClaudeResponse(response.claudeResponse);
            }

            setPreviousChat(response.claudeResponse.score)
        } catch (error) {
            console.error('Error sending initial message:', error);
        }
    };

    const handleSendMessage = async (content) => {
        setChatCount(chatCount + 1)
        try {
            const newMessage = { content, isSent: true };
            setMessages(prevMessages => [...prevMessages, newMessage]);

            const processingData = async () => {
                const requestData = {
                    message : content,
                    mbti : mbti,
                    chatRoomId : chatRoomId
                }

                console.log(requestData)

                const response = await sendPostRequest(requestData, "/api/ask-claude")

                setChatDiff(response.claudeResponse.score - previousChat)
                setPreviousChat(response.claudeResponse.score)

                console.log("chatDiff: ", chatDiff)

                // Claude의 응답을 \n을 기준으로 여러 개의 메시지로 나누기
                const splitMessages = response.claudeResponse.text.split('\n').filter(msg => msg.trim() !== '');
                console.log(splitMessages)

                return {
                    ...response,
                    claudeResponse: {
                        ...response.claudeResponse,
                        messages: splitMessages
                    }
                };
            }

            const response = await processingData()

            if (response.claudeResponse && response.claudeResponse.messages) {
                const totalMessages = response.claudeResponse.messages.length;

                for (let index = 0; index < totalMessages; index++) {
                    const message = response.claudeResponse.messages[index];
                    const isLastMessage = index === totalMessages - 1;

                    await new Promise(resolve => setTimeout(resolve, 2000)); // 각 메시지마다 2초의 간격

                    const responseMessage = {
                        content: message,
                        isSent: false,
                        scoreDiff: response.claudeResponse.score - previousChat,
                        avatar: image,
                        isLastInGroup: isLastMessage,
                        botInfo: isLastMessage ? {
                            feel: response.claudeResponse.feel,
                            score: response.claudeResponse.score,
                            evaluation: response.claudeResponse.evaluation
                        } : null
                    };

                    setMessages(prevMessages => [...prevMessages, responseMessage]);

                    if (isLastMessage) {
                        setClaudeResponse(response.claudeResponse);
                    }
                }
            }

            setPreviousChat(response.claudeResponse.score)
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <main className={`${styles.mainContainer} ${backgroundChanged ? styles.backgroundChanged : ''}`}>
            <div className={styles.contentWrapper}>
                {!isFirst && (
                    <ChatHistory
                        chatRoomId={chatRoomId}
                        image={image}
                        onHistoryLoaded={handleHistoryLoaded}
                    />
                )}
                <ChatBox
                    image={image}
                    name={name}
                    profileDetails={{image, name, type, age, height, job, hobbies, tags, description}}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    stages={stages}
                    isActualMeeting={isActualMeeting}
                    openShowMissionModal={openShowMissionModal}
                />
            </div>
            {isIntroModalOpen && (
                <IntroductionModal
                    isOpen={isIntroModalOpen}
                    onClose={handleCloseIntroModal}
                    profileDetails={selectedProfile}
                />
            )}
            <TimePassedModal
                isOpen={isModalOpen}
                message={stageToComplete === 1 ? "약속 날짜까지 시간이 흐르고.." :
                    stageToComplete === 2 ? "대화를 마무리하고 있습니다..." :
                        "소개팅이 끝나고 있습니다..."}
            />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {showMissionModal && <MissionModal
                chatCount={chatCount}
                onClose={closeShowMissionModal}
            />}
        </main>
    );
};

export { ChatPage };