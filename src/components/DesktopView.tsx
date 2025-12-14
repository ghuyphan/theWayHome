import { useState, useEffect } from 'react';
import RepellingButton from './RepellingButton';
import { STORY_TIMELINE } from '../data/story';
import { playNotificationSound } from '../utils/sound';
import {
    TrainFront,
    MapPin,
    Calendar,
    Clock,
    AlertCircle,
    CreditCard
} from 'lucide-react';

/**
 * DesktopView - Simulation of Apathy & Executive Dysfunction
 */
interface Notification {
    id: number;
    sender: string;
    text: string;
}

function DesktopView() {
    const [timeLeft, setTimeLeft] = useState<number>(10 * 60); // 10 minutes
    const [ticketExpired, setTicketExpired] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [storyIndex, setStoryIndex] = useState<number>(0);

    // Timeline for notifications
    useEffect(() => {
        if (storyIndex >= STORY_TIMELINE.length) return;

        const currentStep = STORY_TIMELINE[storyIndex];

        if (currentStep.type === 'inner_monologue') {
            // System thoughts on desktop? Maybe not needed as notifications, 
            // but could be interesting. For now, skip.
            setStoryIndex(prev => prev + 1);
        }
        else if (currentStep.type === 'image' || currentStep.type === 'text' && currentStep.sender !== 'Me') {
            const timer = setTimeout(() => {
                const newNotif: Notification = {
                    id: Date.now(),
                    sender: currentStep.sender,
                    text: currentStep.content,
                };

                setNotifications(prev => [...prev, newNotif]);
                playNotificationSound();

                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
                }, 8000);

                setStoryIndex(prev => prev + 1);
            }, currentStep.delay);

            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setStoryIndex(prev => prev + 1);
            }, currentStep.delay);
            return () => clearTimeout(timer);
        }
    }, [storyIndex]);

    // Timer
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

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} `;
    };

    const handlePayment = () => {
        alert('Bạn đã cố gắng... và thành công. Nhưng trong thực tế, việc này khó hơn nhiều.');
    };

    return (
        <div className="browser-window brain-fog">
            {/* Main Booking Interface */}
            <div className="booking-container">
                <nav className="site-nav">
                    <span className="logo">VETAU<span className="highlight">TET</span>.VN</span>
                    <div className="nav-links">
                        <span>Trang chủ</span>
                        <span>Lịch trình</span>
                        <span className="active">Thanh toán</span>
                    </div>
                </nav>

                <main className="booking-content">
                    {!ticketExpired ? (
                        <div className="booking-layout">
                            <div className="booking-left">
                                <h1 className="page-title">Xác nhận đặt vé</h1>
                                <p className="page-subtitle">Vui lòng hoàn tất thanh toán trong thời gian giữ vé.</p>

                                <div className="ticket-summary">
                                    <div className="route-header">
                                        <div className="city">
                                            <span className="code">SGN</span>
                                            <span className="name">TP. Hồ Chí Minh</span>
                                        </div>
                                        <div className="route-visual">
                                            <div className="line"></div>
                                            <TrainFront className="icon-vehicle" />
                                            <div className="duration">32h 30m</div>
                                        </div>
                                        <div className="city">
                                            <span className="code">HAN</span>
                                            <span className="name">Hà Nội</span>
                                        </div>
                                    </div>

                                    <div className="trip-info">
                                        <div className="info-item">
                                            <Calendar size={18} className="info-icon" />
                                            <div>
                                                <div className="label">Ngày đi</div>
                                                <div className="value">25/01/2025 (26 Tết)</div>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <Clock size={18} className="info-icon" />
                                            <div>
                                                <div className="label">Giờ khởi hành</div>
                                                <div className="value">06:00 AM</div>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <MapPin size={18} className="info-icon" />
                                            <div>
                                                <div className="label">Toa / Ghế</div>
                                                <div className="value">Toa 8 / Ghế 32 (Giường nằm)</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="booking-right">
                                <div className="payment-card">
                                    <div className="timer-box">
                                        <div className="timer-label">Thời gian giữ vé còn lại</div>
                                        <div className="timer-value">{formatTime(timeLeft)}</div>
                                    </div>

                                    <div className="price-row">
                                        <span>Tổng tiền</span>
                                        <span className="price">1.520.000₫</span>
                                    </div>

                                    <div className="payment-actions">
                                        <p className="instruction">Nhấn nút bên dưới để thanh toán qua QR</p>
                                        <div className="action-area">
                                            < RepellingButton onClick={handlePayment}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <CreditCard size={18} />
                                                    Thanh toán ngay
                                                </span>
                                            </RepellingButton>
                                        </div>
                                        <p className="helper-text-desktop">
                                            Chỉ cần một cái click chuột... sao lại nặng nề thế này?
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="expired-state">
                            <AlertCircle size={64} color="#8b5c5c" />
                            <h2>Hết thời gian giữ vé</h2>
                            <p>Bạn đã bỏ lỡ cơ hội đặt vé này.</p>
                            <button className="btn-secondary" disabled>Tìm chuyến khác</button>
                        </div>
                    )}
                </main>
            </div>

            {/* Notifications Container */}
            <div className="notifications-container">
                {notifications.map(notif => (
                    <div key={notif.id} className="desktop-notification slide-in">
                        <div className="notif-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {/* Placeholder for Zalo Icon if image fails, but we imported it */}
                                <div className="app-icon-placeholder" style={{ background: 'blue', width: 16, height: 16, borderRadius: 4 }}></div>
                                <span className="notif-app">Zalo</span>
                            </div>
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
                .booking-container {
                    background: #f5f7fa;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Segoe UI', sans-serif;
                    color: #333;
                }
                .site-nav {
                    background: white;
                    padding: 16px 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e1e4ea;
                }
                .logo { font-weight: 800; font-size: 20px; color: #2d3748; }
                .logo .highlight { color: #0068FF; }
                .nav-links { display: flex; gap: 24px; font-size: 14px; font-weight: 500; color: #718096; }
                .nav-links .active { color: #0068FF; }

                .booking-content {
                    flex: 1;
                    padding: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                }
                .booking-layout {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 32px;
                }
                .page-title { font-size: 24px; margin-bottom: 8px; color: #2d3748; }
                .page-subtitle { color: #718096; margin-bottom: 32px; }

                .ticket-summary {
                    background: white;
                    border-radius: 12px;
                    padding: 32px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
                }
                .route-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                    padding-bottom: 24px;
                    border-bottom: 1px dashed #e2e8f0;
                }
                .city { text-align: center; }
                .city .code { display: block; font-size: 32px; font-weight: 700; color: #2d3748; }
                .city .name { color: #718096; font-size: 14px; }
                
                .route-visual {
                    flex: 1;
                    margin: 0 40px;
                    position: relative;
                    text-align: center;
                }
                .route-visual .line {
                    height: 2px;
                    background: #cbd5e0;
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    z-index: 1;
                }
                .icon-vehicle {
                    position: relative;
                    z-index: 2;
                    background: white;
                    padding: 0 8px;
                    color: #0068FF;
                }
                .duration { margin-top: 8px; font-size: 12px; color: #718096; font-weight: 500; }

                .trip-info {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }
                .info-item { display: flex; gap: 12px; align-items: flex-start; }
                .info-icon { color: #718096; margin-top: 2px; }
                .info-item .label { font-size: 12px; color: #718096; margin-bottom: 2px; }
                .info-item .value { font-size: 14px; font-weight: 500; color: #2d3748; }

                .booking-right { display: flex; flex-direction: column; }
                .payment-card {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
                }
                .timer-box {
                    background: #fff5f5;
                    border: 1px solid #fed7d7;
                    border-radius: 8px;
                    padding: 12px;
                    text-align: center;
                    margin-bottom: 24px;
                }
                .timer-label { font-size: 12px; color: #c53030; margin-bottom: 4px; }
                .timer-value { font-size: 20px; font-weight: 700; color: #9b2c2c; font-family: monospace; }
                
                .price-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    font-size: 16px;
                    font-weight: 500;
                }
                .price-row .price { font-size: 24px; color: #0068FF; font-weight: 700; }

                .payment-actions { text-align: center; }
                .instruction { font-size: 13px; color: #718096; margin-bottom: 16px; }
                
                .action-area {
                    position: relative;
                    height: 60px; /* Space for the moving button */
                    display: flex;
                    justify-content: center;
                }

                .helper-text-desktop {
                    margin-top: 20px;
                    font-size: 12px;
                    font-style: italic;
                    color: #a0aec0;
                }

                .expired-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 60vh;
                    text-align: center;
                }
                .expired-state h2 { margin-top: 24px; color: #2d3748; }
                .expired-state p { color: #718096; margin-bottom: 24px; }
                .btn-secondary {
                    padding: 10px 24px;
                    border-radius: 6px;
                    border: 1px solid #cbd5e0;
                    background: white;
                    color: #cbd5e0;
                    cursor: not-allowed;
                }

                /* Notifications */
                .notifications-container {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    width: 320px;
                    z-index: 50;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .desktop-notification {
                    background: white;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    border-left: 4px solid #0068FF;
                    animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .notif-header {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                    color: #718096;
                    margin-bottom: 8px;
                }
                .notif-app { font-weight: 600; color: #2d3748; }
                .notif-body strong { display: block; font-size: 14px; margin-bottom: 4px; color: #2d3748; }
                .notif-body p { margin: 0; font-size: 13px; color: #4a5568; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default DesktopView;
