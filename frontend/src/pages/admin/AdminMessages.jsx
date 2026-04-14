import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Javítva: AuthContext nagybetűvel
import BackButton from '../../components/BackButton';
import './AdminMessages.css';

const AdminMessages = () => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/messages/inbox', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Mivel a backend API 'sender_name' és 'sender_email' mezőket ad vissza, 
      // átalakítjuk a frontend által várt formátumra
      const formatted = res.data.map(m => ({
        ...m,
        sender: m.sender_name || 'Ismeretlen',
        senderEmail: m.sender_email || '',
        date: m.created_at,
        read: m.is_read === 1
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Hiba az üzenetek betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/messages/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
    } catch (error) {
      console.error('Hiba az olvasottnak jelöléskor:', error);
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/messages', {
        receiver_id: selectedMessage.sender_id,
        subject: `RE: ${selectedMessage.subject}`,
        message: replyText,
        type: 'reply'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Válasz elküldve!');
    } catch (error) {
      alert('Hiba a válasz küldésekor.');
    }

    setShowReplyModal(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt az üzenetet?')) {
      setMessages(messages.filter(msg => msg.id !== id));
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.senderEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('hu-HU');
  };

  const unreadCount = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="admin-messages">
        <BackButton to="/admin" label="Vissza a vezérlőpultra" />
        <div className="loading-spinner">Üzenetek betöltése...</div>
      </div>
    );
  }

  return (
    <div className="admin-messages">
      <BackButton to="/admin" label="Vissza a vezérlőpultra" />
      
      <div className="admin-messages-header">
        <h2>Üzenetek</h2>
        <div className="messages-stats">
          <div className="stat-badge">
            <span className="stat-label">Összes:</span>
            <span className="stat-value">{messages.length}</span>
          </div>
          <div className="stat-badge unread">
            <span className="stat-label">Olvasatlan:</span>
            <span className="stat-value">{unreadCount}</span>
          </div>
        </div>
      </div>

      <div className="messages-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Keresés név, email vagy tárgy alapján..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="messages-list">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">Nincs megjeleníthető üzenet</div>
        ) : (
          filteredMessages.map(message => (
            <div 
              key={message.id} 
              className={`message-item ${!message.read ? 'unread' : ''}`}
              onClick={() => handleMarkAsRead(message.id)}
            >
              <div className="message-status">
                {!message.read && <span className="unread-dot"></span>}
              </div>
              <div className="message-sender">
                <div className="sender-name">{message.sender}</div>
                <div className="sender-email">{message.senderEmail}</div>
              </div>
              <div className="message-content">
                <div className="message-subject">{message.subject}</div>
                <div className="message-preview">{message.message.substring(0, 80)}...</div>
              </div>
              <div className="message-date">
                {formatDateTime(message.date)}
              </div>
              <div className="message-actions">
                <button 
                  className="action-btn reply"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReply(message);
                  }}
                  title="Válasz"
                >
                  ✉️
                </button>
                <button 
                  className="action-btn delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMessage(message.id);
                  }}
                  title="Törlés"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Válasz modal */}
      {showReplyModal && selectedMessage && (
        <div className="modal-overlay">
          <div className="modal-content reply-modal">
            <div className="modal-header">
              <h3>Válasz küldése</h3>
              <button className="close-btn" onClick={() => setShowReplyModal(false)}>✕</button>
            </div>
            
            <div className="original-message">
              <div className="message-info">
                <strong>Feladó:</strong> {selectedMessage.sender} ({selectedMessage.senderEmail})
              </div>
              <div className="message-info">
                <strong>Tárgy:</strong> {selectedMessage.subject}
              </div>
              <div className="message-info">
                <strong>Dátum:</strong> {formatDateTime(selectedMessage.date)}
              </div>
              <div className="message-body">
                <strong>Eredeti üzenet:</strong>
                <p>{selectedMessage.message}</p>
              </div>
            </div>

            <div className="reply-form">
              <div className="form-group">
                <label htmlFor="reply">Válasz *</label>
                <textarea
                  id="reply"
                  rows="6"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Írd ide a válaszod..."
                />
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="send-btn" 
                onClick={handleSendReply}
                disabled={!replyText.trim()}
              >
                Válasz küldése
              </button>
              <button 
                className="cancel-btn" 
                onClick={() => setShowReplyModal(false)}
              >
                Mégse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;