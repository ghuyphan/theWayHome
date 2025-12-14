import { useState, useEffect, useRef } from 'react';
import MaskingInput from './MaskingInput';
import { STORY_TIMELINE, MASKED_RESPONSES } from '../data/story';
import { playNotificationSound } from '../utils/sound';
import {
    ArrowLeft,
    Search,
    Phone,
    Video,
    MoreHorizontal,
    Smile,
    Image,
    Send,
    List
} from 'lucide-react';

/**
 * MobileView - Simulation of Social Pressure & Internal Conflict
 *
 * Design: Replica of Zalo (Vietnamese popular messaging app)
 */
interface Message {
    id: number;
    type: 'sent' | 'received' | 'system' | 'inner_monologue';
    text: string;
    time: string;
    sender?: string;
}

function MobileView() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [innerThought, setInnerThought] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, innerThought]);

    // Story Engine - Simplified & Robust
    useEffect(() => {
        if (currentStepIndex >= STORY_TIMELINE.length) return;

        const currentStep = STORY_TIMELINE[currentStepIndex];
        let timer: ReturnType<typeof setTimeout>;

        const executeStep = () => {
            // Handle Inner Monologue (Thoughts)
            if (currentStep.type === 'inner_monologue') {
                setInnerThought(currentStep.content);
                // Clear thought after some time? Or keep it until next thought/message?
                // Let's clear it after 4 seconds or next event
                setTimeout(() => setInnerThought(null), 4000);

                // Do not add to main chat history? Or add as a system note?
                // For now, only overlay.
                // Advance step immediately after showing? Or wait?
                // The delay was "before appearing". So we waited already.
                setCurrentStepIndex(prev => prev + 1);
            }
            // Handle Chat Messages
            else {
                const newMessage: Message = {
                    id: Date.now(),
                    type: currentStep.type as Message['type'],
                    text: currentStep.content,
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    sender: currentStep.sender
                };

                setMessages(prev => [...prev, newMessage]);

                if (currentStep.type !== 'system' && currentStep.type !== 'image') {
                    // Only play sound for text messages from others
                    playNotificationSound();
                }

                setCurrentStepIndex(prev => prev + 1);
            }
        };

        // Delay handling
        timer = setTimeout(executeStep, currentStep.delay);

        return () => clearTimeout(timer);
    }, [currentStepIndex]);

    const handleSendMessage = (displayText: string, realText: string) => {
        const newMessage: Message = {
            id: Date.now(),
            type: 'sent',
            text: displayText,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, newMessage]);

        // If user is actually typing "real" vs "mask", trigger inner thought overlay
        if (realText && realText !== displayText) {
            setInnerThought(realText);
            setTimeout(() => setInnerThought(null), 3000);
        }
    };

    const getRandomMaskedResponse = () => {
        return MASKED_RESPONSES[Math.floor(Math.random() * MASKED_RESPONSES.length)];
    };

    return (
        <div className="phone-frame">
            {/* Zalo Header */}
            <header className="zalo-header">
                <div className="header-left">
                    <ArrowLeft size={24} className="icon-back" />
                    <div className="search-bar">
                        <Search size={16} className="search-icon" />
                        <span className="search-placeholder">Tìm kiếm</span>
                    </div>
                </div>
                <div className="header-right">
                    <List size={26} className="icon-hamburger" />
                </div>
            </header>

            {/* Chat Specific Header (Sub-header) */}
            <div className="zalo-chat-sub-header">
                <ArrowLeft size={24} className="icon-back-chat" />
                <div className="chat-avatar-header">
                    <span className="avatar-placeholder">M</span>
                </div>
                <div className="header-info">
                    <div className="header-name">Mẹ</div>
                    <div className="header-status">Truy cập vừa xong</div>
                </div>
                <div className="header-actions">
                    <Phone size={22} className="action-icon" />
                    <Video size={24} className="action-icon" />
                    <MoreHorizontal size={24} className="action-icon" />
                </div>
            </div>

            {/* Messages Area */}
            <div className="zalo-messages-area">
                {messages.length === 0 && (
                    <div className="chat-begin-notice">
                        Cuộc trò chuyện bắt đầu.
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className={`cw-message-row ${msg.type}`}>
                        {msg.type === 'received' && (
                            <div className="cw-avatar">M</div>
                        )}

                        {msg.type === 'system' ? (
                            <div className="cw-system-msg">{msg.text}</div>
                        ) : (
                            <div className="cw-bubble">
                                <div className="cw-text">{msg.text}</div>
                                <div className="cw-time">{msg.time}</div>
                            </div>
                        )}
                    </div>
                ))}

                <div ref={messagesEndRef} />
            </div>

            {/* Inner Thought Overlay */}
            {innerThought && (
                <div className="inner-thought-container">
                    <div className="inner-thought-content">
                        {innerThought}
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="zalo-input-area">
                <div className="input-toolbar">
                    <Smile size={26} strokeWidth={1.5} />
                    <Image size={26} strokeWidth={1.5} />
                    <MoreHorizontal size={26} strokeWidth={1.5} />
                </div>
                <div className="input-wrapper">
                    <MaskingInput onSend={handleSendMessage} targetText={getRandomMaskedResponse()} />
                </div>
                <button className="zalo-send-btn">
                    <Send size={24} />
                </button>
            </div>

            <style>{`
                /* Variables */
                .phone-frame {
                    background: var(--zalo-bg-light);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    overflow: hidden;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                }

                /* Header */
                .zalo-header {
                    background: var(--zalo-blue);
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 16px;
                    color: white;
                }
                .header-left { display: flex; align-items: center; gap: 12px; flex: 1; }
                .icon-back { cursor: pointer; }
                .search-bar {
                    background: rgba(255,255,255,0.2);
                    border-radius: 4px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    flex: 1;
                    max-width: 200px;
                    color: white;
                }
                .search-icon { opacity: 0.8; margin-right: 8px; }
                .search-placeholder { font-size: 14px; opacity: 0.9; }

                /* Chat Sub Header */
                .zalo-chat-sub-header {
                    background: var(--zalo-blue);
                    height: 56px;
                    display: flex;
                    align-items: center;
                    padding: 0 10px;
                    color: white;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                    z-index: 2;
                }
                .icon-back-chat { margin-right: 12px; cursor: pointer; }
                .chat-avatar-header {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: #ddd; margin-right: 12px;
                    display: flex; align-items: center; justify-content: center;
                    color: #555; font-weight: bold;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .header-info { flex: 1; }
                .header-name { font-size: 17px; font-weight: 500; }
                .header-status { font-size: 12px; opacity: 0.8; margin-top: 2px; }
                .header-actions { display: flex; gap: 20px; padding-right: 8px; align-items: center; }
                .action-icon { cursor: pointer; opacity: 0.9; }

                /* Messages */
                .zalo-messages-area {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    background: #e2eaf4; /* Slight blue-grey tint common in chat apps or generic wallpaper */
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .chat-begin-notice {
                    text-align: center; font-size: 12px; color: #888; margin: 20px 0;
                    background: rgba(0,0,0,0.05); padding: 4px 12px; border-radius: 12px; align-self: center;
                }

                .cw-message-row {
                    display: flex;
                    margin-bottom: 2px;
                    max-width: 85%;
                }
                .cw-message-row.received { align-self: flex-start; }
                .cw-message-row.sent { align-self: flex-end; justify-content: flex-end; }
                .cw-message-row.system { align-self: center; max-width: 100%; margin: 10px 0; }

                .cw-avatar {
                    width: 28px; height: 28px; border-radius: 50%;
                    background: #ccc; margin-right: 8px; margin-top: auto; margin-bottom: 4px; /* Align bottom */
                    display: flex; align-items: center; justify-content: center;
                    font-size: 10px; color: #fff;
                }

                .cw-bubble {
                    padding: 10px 14px;
                    border-radius: 12px;
                    position: relative;
                    box-shadow: 0 1px 1px rgba(0,0,0,0.08);
                    min-width: 60px;
                }
                .cw-message-row.received .cw-bubble {
                    background: var(--zalo-bubble-received);
                    border: 1px solid #e1e4ea;
                    border-top-left-radius: 4px;
                }
                .cw-message-row.sent .cw-bubble {
                    background: var(--zalo-bubble-sent);
                    border: 1px solid #dbe5f1;
                    border-top-right-radius: 4px;
                }

                .cw-text {
                    color: var(--zalo-text-primary);
                    font-size: 15px;
                    line-height: 1.4;
                    word-wrap: break-word;
                }
                .cw-time {
                    font-size: 10px;
                    color: var(--zalo-text-secondary);
                    text-align: right;
                    margin-top: 4px;
                }

                .cw-system-msg {
                    font-size: 12px; color: #888; font-style: italic; background: rgba(255,255,255,0.4);
                    padding: 4px 8px; border-radius: 4px;
                }

                /* Inner Thought */
                .inner-thought-container {
                    position: absolute;
                    bottom: 100px; left: 0; right: 0;
                    display: flex; justify-content: center;
                    z-index: 10;
                    animation: fadeIn 0.3s ease-out;
                }
                .inner-thought-content {
                    background: rgba(0, 0, 0, 0.85);
                    color: #ffcccc;
                    padding: 12px 24px;
                    border-radius: 24px;
                    font-size: 14px;
                    max-width: 80%;
                    text-align: center;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                    backdrop-filter: blur(4px);
                }

                /* Input Area */
                .zalo-input-area {
                    background: white;
                    border-top: 1px solid #ddd;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .input-toolbar { display: flex; gap: 16px; color: #666; }
                .input-wrapper { flex: 1; }
                .zalo-send-btn {
                    background: transparent; border: none; color: var(--zalo-blue); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                }

                /* Override Masking Input Styles for Zalo Theme */
                .input-wrapper .chat-input {
                    background: transparent !important;
                    border: none !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    color: black !important;
                    font-size: 16px !important;
                    height: 100%;
                }
                .input-wrapper .chat-input::placeholder {
                    color: #999 !important;
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

export default MobileView;
