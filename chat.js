document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.querySelector('.send-message');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.querySelector('.chat-messages');

    // 发送消息到AI API
    async function sendToAI(message) {
        try {
            const response = await fetch('https://open.aiproxy.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer sk-728439debb6140f9b370200c9a13da96'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "你是一个友好的AI助手，可以帮助回答用户的问题。"
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API错误详情:', errorData);
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            } else {
                console.error('API响应格式错误:', data);
                throw new Error('API响应格式错误');
            }
        } catch (error) {
            console.error('API调用错误:', error);
            return '抱歉，我现在无法回应。请稍后再试。错误信息：' + error.message;
        }
    }

    // 发送消息
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // 添加用户消息
            addMessage(message, 'user');
            messageInput.value = '';

            // 显示加载状态
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai';
            loadingDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas fa-spinner fa-spin"></i> AI正在思考...
                </div>
            `;
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 调用AI API
            const aiResponse = await sendToAI(message);
            
            // 移除加载状态
            chatMessages.removeChild(loadingDiv);
            
            // 添加AI回复
            addMessage(aiResponse, 'ai');
        }
    }

    // 添加消息到聊天框
    function addMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                ${message}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 回车发送消息
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}); 