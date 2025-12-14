import { useState, useEffect } from 'react';
import RepellingButton from './RepellingButton';
import { STORY_TIMELINE } from '../data/story';

/**
 * DesktopView - Mô phỏng Apathy & Executive Dysfunction
 * 
 * Includes incoming notifications from "Mobile" world that are distracting
 */
interface Notification {
    id: number;
    sender: string;
    text: string;
}

function DesktopView() {
    const [timeLeft, setTimeLeft] = useState<number>(10 * 60); // 10 phút
    const [ticketExpired, setTicketExpired] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [storyIndex, setStoryIndex] = useState<number>(0);

    // Timeline for notifications (parallel to story)
    useEffect(() => {
        if (storyIndex >= STORY_TIMELINE.length) return;

        const currentStep = STORY_TIMELINE[storyIndex];

        // Chỉ hiện notification cho tin nhắn từ người khác (received)
        if (currentStep.type === 'image' || currentStep.type === 'text' && currentStep.sender !== 'Me') {
            const timer = setTimeout(() => {
                const newNotif: Notification = {
                    id: Date.now(),
                    sender: currentStep.sender,
                    text: currentStep.content,
                };

                setNotifications(prev => [...prev, newNotif]);
                // Play sound? (Optional)

                // Auto dismiss after 8 seconds (ignored)
                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
                }, 8000);

                setStoryIndex(prev => prev + 1);
            }, currentStep.delay);

            return () => clearTimeout(timer);
        } else {
            // Skip non-notification steps (like system or self)
            // But wait for delay to keep sync roughly? 
            // Or just skip immediately? Let's wait purely to pace it out.
            const timer = setTimeout(() => {
                setStoryIndex(prev => prev + 1);
            }, currentStep.delay);
            return () => clearTimeout(timer);
        }
    }, [storyIndex]);

    // Đếm ngược thời gian giữ vé
    useEffect(() => {
        if (timeLeft <= 0) {
            setTicketExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format thời gian MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handlePayment = () => {
        // Nếu bằng cách nào đó người dùng nhấn được nút
        alert('Bạn đã cố gắng... và thành công. Nhưng trong thực tế, việc này khó hơn nhiều.');
    };

    return (
        <div className="browser-window brain-fog">
            {/* Thanh trình duyệt giả */}
            <div className="browser-chrome">
                <div className="browser-dots">
                    <span className="browser-dot red"></span>
                    <span className="browser-dot yellow"></span>
                    <span className="browser-dot green"></span>
                </div>
                <div className="browser-address">
                    🔒 vetautet.vn/dat-ve
                </div>
            </div>

            {/* Nội dung trang đặt vé */}
            <div className="browser-content">
                <div className="ticket-header">
                    <h1>🎫 Đặt Vé Tàu Tết 2025</h1>
                    <p>Hành trình về nhà - Đoàn viên cùng gia đình</p>
                </div>

                {!ticketExpired ? (
                    <>
                        {/* Thẻ thông tin vé */}
                        <div className="ticket-card">
                            <div className="ticket-route">
                                <div className="ticket-city">
                                    <div className="code">SGN</div>
                                    <div className="name">Sài Gòn</div>
                                </div>
                                <div className="ticket-arrow">✈️ → 🏠</div>
                                <div className="ticket-city">
                                    <div className="code">HAN</div>
                                    <div className="name">Hà Nội</div>
                                </div>
                            </div>

                            <div className="ticket-details">
                                <div className="ticket-detail">
                                    <div className="label">Số vé còn lại</div>
                                    <div className="value">1 vé</div>
                                </div>
                                <div className="ticket-detail">
                                    <div className="label">Giá vé</div>
                                    <div className="value price">1.500.000 VNĐ</div>
                                </div>
                                <div className="ticket-detail">
                                    <div className="label">Thời gian giữ vé</div>
                                    <div className="value timer">{formatTime(timeLeft)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Nút thanh toán - sẽ chạy trốn */}
                        <div className="ticket-footer">
                            <RepellingButton onClick={handlePayment}>
                                💳 Thanh toán ngay
                            </RepellingButton>
                        </div>

                        <p className="helper-text">
                            Chỉ cần nhấn nút... Tại sao việc này lại khó thế?
                        </p>
                    </>
                ) : (
                    <div className="ticket-card" style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#8b5c5c', marginBottom: '16px' }}>
                            ⏰ Hết thời gian giữ vé
                        </h2>
                        <p style={{ color: 'var(--text-dim)' }}>
                            Vé đã được người khác đặt mất rồi...
                        </p>
                        <p style={{ marginTop: '20px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                            "Mình chỉ cần nhấn một nút thôi mà..."
                        </p>
                    </div>
                )}
            </div>

            {/* Notifications Container */}
            <div className="notifications-container">
                {notifications.map(notif => (
                    <div key={notif.id} className="desktop-notification slide-in">
                        <div className="notif-header">
                            <span className="notif-app">Zalo</span>
                            <span className="notif-time">bây giờ</span>
                        </div>
                        <div className="notif-body">
                            <strong>{notif.sender}</strong>
                            <p>{notif.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .notifications-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .desktop-notification {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 8px;
                    padding: 12px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-left: 4px solid var(--zalo-blue);
                    backdrop-filter: blur(4px);
                    animation: slideIn 0.3s ease-out;
                }
                .notif-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #666;
                    margin-bottom: 4px;
                }
                .notif-app {
                    font-weight: 600;
                    color: var(--zalo-blue);
                }
                .notif-body strong {
                    display: block;
                    font-size: 13px;
                    margin-bottom: 2px;
                    color: #333;
                }
                .notif-body p {
                    margin: 0;
                    font-size: 13px;
                    color: #555;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default DesktopView;
