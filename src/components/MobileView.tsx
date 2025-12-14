import { useState, useEffect, useRef } from 'react';
import MaskingInput from './MaskingInput';
import { STORY_TIMELINE, MASKED_RESPONSES } from '../data/story';

/**
 * MobileView - Mô phỏng Social Pressure & Masking
 * 
 * Giao diện chat giống Zalo
 */
interface Message {
    id: number;
    type: 'sent' | 'received' | 'system';
    text: string;
    time: string;
}

function MobileView() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
    const [showRealThoughts, setShowRealThoughts] = useState<boolean>(false);
    const [lastRealText, setLastRealText] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Story Engine
    useEffect(() => {
        if (currentStepIndex >= STORY_TIMELINE.length) return;

        const currentStep = STORY_TIMELINE[currentStepIndex];

        // Nếu là tin nhắn nhận hoặc system, tự động hiện sau delay
        if (currentStep.type === 'image' || currentStep.type === 'text' && currentStep.sender !== 'Me' || currentStep.type === 'system') {
            const timer = setTimeout(() => {
                const newMessage: Message = {
                    id: Date.now(),
                    type: currentStep.type === 'system' ? 'system' : 'received',
                    text: currentStep.content,
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages(prev => [...prev, newMessage]);
                setCurrentStepIndex(prev => prev + 1);
            }, currentStep.delay);

            return () => clearTimeout(timer);
        }
    }, [currentStepIndex]);

    const handleSendMessage = (displayText: string, realText: string) => {
        // Add user message
        const newMessage: Message = {
            id: Date.now(),
            type: 'sent',
            text: displayText,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, newMessage]);

        // Show real thoughts if different
        if (realText && realText !== displayText) {
            setLastRealText(realText);
            setShowRealThoughts(true);
            setTimeout(() => setShowRealThoughts(false), 5000);
        }

        // Advance story if we were waiting for user input (which is implicit if not handled above)
        // Hiện tại story engine đơn giản, chỉ cần user reply là coi như xong step hiện tại?
        // Nhưng logic ở useEffect trên chỉ handle non-user steps.
        // Vậy step nào là của user? Trong STORY_TIMELINE hiện tại không có type 'sent'.
        // Giả sử user reply bất kỳ lúc nào cũng được, nhung nếu muốn strict timeline thì cần thêm type 'sent' vào story.ts.
        // Hiện tại cứ cho là user reply tự do, không ảnh hưởng story lắm, TRỪ KHI story dừng lại đợi user?
        // Với data hiện tại, story cứ chạy. Nhưng ta có thể pause nếu cần.
        // Để đơn giản: User reply không ảnh hưởng story progression trong bản v1 này, story cứ chạy theo time.
    };

    // Lấy câu "polite" ngẫu nhiên cho masking input
    const getRandomMaskedResponse = () => {
        return MASKED_RESPONSES[Math.floor(Math.random() * MASKED_RESPONSES.length)];
    };

    return (
        <div className="phone-frame" style={{ background: 'var(--zalo-bg)' }}>
            {/* Zalo Header */}
            <div className="chat-header" style={{ background: 'var(--zalo-blue)', color: 'var(--zalo-header-text)' }}>
                <div style={{ fontSize: '20px', marginRight: '10px' }}>⬅</div>
                <div className="chat-avatar">👩</div>
                <div className="chat-info">
                    <div className="chat-name">Mẹ</div>
                    <div className="chat-status">Truy cập vừa xong</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '15px' }}>
                    <span>📞</span>
                    <span>📹</span>
                    <span>☰</span>
                </div>
            </div>

            {/* Messages List */}
            <div className="chat-messages" style={{ background: 'var(--zalo-bg)' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#888', fontSize: 'small' }}>
                        Cuộc trò chuyện bắt đầu.
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className={`message-row ${msg.type === 'sent' ? 'sent-row' : 'received-row'}`}>
                        {msg.type === 'received' && <div className="chat-avatar-small">👩</div>}
                        <div
                            className={`message-bubble ${msg.type}`}
                            style={{
                                background: msg.type === 'sent' ? 'var(--zalo-bubble-sent)' : 'var(--zalo-bubble-received)',
                                color: '#000',
                                border: '1px solid #e5e5e5'
                            }}
                        >
                            {msg.text}
                            <div className="message-time" style={{ color: '#888' }}>{msg.time}</div>
                        </div>
                    </div>
                ))}

                {/* Real thoughts overlay */}
                {showRealThoughts && lastRealText && (
                    <div className="real-thoughts-overlay">
                        <div className="thoughts-label">Những điều không thể nói:</div>
                        "{lastRealText}"
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chat-input-area">
                <MaskingInput onSend={handleSendMessage} targetText={getRandomMaskedResponse()} />
                <button className="chat-send-btn" style={{ color: 'var(--zalo-blue)' }}>➤</button>
            </div>

            <style>{`
                .message-row {
                    display: flex;
                    align-items: flex-end;
                    margin-bottom: 15px;
                    gap: 8px;
                }
                .sent-row {
                    justify-content: flex-end;
                }
                .received-row {
                    justify-content: flex-start;
                }
                .message-bubble {
                    max-width: 70%;
                    padding: 8px 12px;
                    border-radius: 12px;
                    position: relative;
                    font-size: 15px;
                    box-shadow: 0 1px 1px rgba(0,0,0,0.05);
                }
                .message-bubble.sent {
                    border-bottom-right-radius: 4px;
                }
                .message-bubble.received {
                    border-bottom-left-radius: 4px;
                }
                .chat-avatar-small {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    background: #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                }
                .real-thoughts-overlay {
                    align-self: center;
                    background: rgba(139, 92, 92, 0.9);
                    padding: 12px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    color: white;
                    font-style: italic;
                    text-align: center;
                    max-width: 90%;
                    margin: 10px auto;
                    animation: fadeInOut 5s ease-in-out;
                    position: absolute;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                }
                .thoughts-label {
                    font-size: 10px;
                    text-transform: uppercase;
                    opacity: 0.8;
                    margin-bottom: 4px;
                }
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, 10px); }
                    10% { opacity: 1; transform: translate(-50%, 0); }
                    90% { opacity: 1; transform: translate(-50%, 0); }
                    100% { opacity: 0; transform: translate(-50%, -10px); }
                }
            `}</style>
        </div>
    );
}

export default MobileView;
