import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    try {
      // Szimulált adatok
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            sender: 'Kovács János',
            senderEmail: 'kovacs.janos@email.hu',
            subject: 'Kérdés a budapesti túráról',
            message: 'Szeretném kérdezni, hogy a budapesti túra során van-e lehetőség vegetáriánus étkezésre? Előre is köszönöm a választ!',
            date: '2024-03-15 10:30',
            read: false,
            replied: false
          },
          {
            id: 2,
            sender: 'Nagy Anna',
            senderEmail: 'nagy.anna@email.hu',
            subject: 'Csoportos kedvezmény',
            message: '8 fős csoporttal szeretnénk részt venni az egri bortúrán. Van lehetőség csoportos kedvezményre? Kérlek, írjátok meg a részleteket.',
            date: '2024-03-14 14:20',
            read: true,
            replied: false
          },
          {
            id: 3,
            sender: 'Szabó Péter',
            senderEmail: 'szabo.peter@email.hu',
            subject: 'Lemondás módosítása',
            message: 'Sajnos a szegedi halászlé túrát le kell mondanom. Hogyan tudom ezt megtenni? Előre is köszönöm a segítséget.',
            date: '2024-03-14 09:15',
            read: false,
            replied: false
          },
          {
            id: 4,
            sender: 'Tóth Eszter',
            senderEmail: 'toth.eszter@email.hu',
            subject: 'Köszönet a túráért',
            message: 'Szeretném megköszönni a csodálatos tokaji bortúrát! Felejthetetlen élmény volt, biztosan jövünk máskor is.',
            date: '2024-03-13 16:45',
            read: true,
            replied: true
          },
          {
            id: 5,
            sender: 'Varga Gábor',
            senderEmail: 'varga.gabor@email.hu',
            subject: 'Számla kérés',
            message: 'Szeretnék számlát kérni a múlt heti foglalásomról. A foglalás azonosítója: #12345. Köszönöm!',
            date: '2024-03-13 11:30',
            read: false,
            replied: false
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Hiba az üzenetek betöltésekor:', error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setReplyText('');
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    // Itt kellene backend hívás
    setMessages(messages.map(msg => 
      msg.id === selectedMessage.id ? { ...msg, replied: true } : msg
    ));
    
    setShowReplyModal(false);
    setSelectedMessage(null);
    setReplyText('');
    alert('Válasz elküldve!');
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