import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../config/api'
import { MessageCircle, X } from 'lucide-react'

const AssistantButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "👋 Hello! I'm your Security Assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [available, setAvailable] = useState<boolean | null>(null)
  const [provider, setProvider] = useState<string>('')

  useEffect(() => {
    // check integration status
    const check = async () => {
      try {
        const res = await fetch(`${API_ENDPOINTS.AI_ASSISTANT}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
        })
        if (res.ok) {
          const data = await res.json()
          setAvailable(!!data.active)
          setProvider(data.provider || '')
          if (!data.active) {
            setMessages([{ role: 'ai', text: 'AI ассистент недоступен. Настройте интеграцию в Admin Panel → Integrations' }])
          }
        } else {
          setAvailable(false)
          setMessages([{ role: 'ai', text: 'AI ассистент недоступен. Настройте интеграцию в Admin Panel → Integrations' }])
        }
      } catch {
        setAvailable(false)
        setMessages([{ role: 'ai', text: 'AI ассистент недоступен. Настройте интеграцию в Admin Panel → Integrations' }])
      }
    }
    check()
  }, [])

  const send = async () => {
    const text = input.trim()
    if (!text) return
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'ai', text: '…' }])
    setInput('')
    try {
      const res = await fetch(`${API_ENDPOINTS.ASSISTANT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text, userId: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).id : '', userRole: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).role : '' })
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'ai', text: String(data.response || data.message || 'OK') }
          return copy
        })
      } else {
        setMessages((prev) => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'ai', text: 'Ассистент недоступен. Попробуйте позже.' }
          return copy
        })
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'ai', text: 'Ошибка подключения к ассистенту.' }
        return copy
      })
    }
  }

  return (
    <>
      {/* Floating Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50"
        style={{ backgroundColor: '#56a3d9' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 z-40 flex flex-col slide-in">
          {/* Chat Header */}
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center gap-2" style={{ backgroundColor: '#56a3d9' }}>
            <MessageCircle size={20} />
            <span className="font-medium">Security Assistant</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role === 'user' ? 'user-message' : 'ai-message'} fade-in`}>{m.text}</div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Введите сообщение..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              />
              <button className="btn-primary px-4 py-2 rounded-lg transition-colors duration-200" onClick={send}>
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AssistantButton