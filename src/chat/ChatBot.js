import React, { useState } from 'react';
import axios from 'axios';
import '../css/chatRoom.css';
import '../css/chatBot/chatBot.css';

function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const sendMessage = async () => {
    try {
      // 보낸 메시지를 메시지 목록에 추가
      setMessages(prevMessages => [...prevMessages, { content: input, sender: 'user' }]);

      const res = await axios.post('/chatBot', { message: input });
     
      // 받은 메시지를 메시지 목록에 추가
      const content = res.data.choices[0].message.content;
      setMessages(prevMessages => [...prevMessages, { content: content, sender: 'Tocar' }]);

      setInput('');
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div>
         <button  className="chat-button" onClick={openModal}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-robot" viewBox="0 0 16 16">
      <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135"/>
     <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5"/>
</svg>
    </button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="chat-container">
              <div className="messages-container">
                {messages.map((message, index) => (
                  <div key={index} className={`message ${message.sender === 'user' ? 'receiver' : 'sender'}`}> 
                    <div className="message-sender">{message.sender === 'user' ? 'Me' : message.sender}</div>
                    <div className="message-text"> {message.content}</div>
                  </div>
                ))}
              </div>
              <div className="input-area">
                <input
                  className="message-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button className="send-button" onClick={sendMessage}>send</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBot;
