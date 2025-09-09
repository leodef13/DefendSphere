import type { ComponentProps } from 'react'

export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`card ${className}`} {...props} />
}
export function CardHeader({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`p-4 pb-0 ${className}`} {...props} />
}
export function CardContent({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`p-4 ${className}`} {...props} />
}

// Стандартные компоненты кнопок согласно ТЗ
export function PrimaryButton({ children, className = '', ...props }: ComponentProps<'button'>) {
  return (
    <button 
      className={`bg-[#134876] text-white px-4 py-2 rounded hover:bg-[#0f3556] flex items-center transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ComponentProps<'button'>) {
  return (
    <button 
      className={`bg-gray-200 text-[#134876] px-4 py-2 rounded hover:bg-gray-300 flex items-center transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function DangerButton({ children, className = '', ...props }: ComponentProps<'button'>) {
  return (
    <button 
      className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Компоненты форм согласно ТЗ
export function FormInput({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input 
      className={`border rounded px-3 py-2 w-full focus:border-[#134876] focus:outline-none transition-colors ${className}`}
      {...props}
    />
  )
}

export function FormLabel({ children, className = '', ...props }: ComponentProps<'label'>) {
  return (
    <label 
      className={`text-gray-800 font-medium mb-1 flex items-center ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export function FormSelect({ className = '', children, ...props }: ComponentProps<'select'>) {
  return (
    <select 
      className={`border rounded px-3 py-2 w-full focus:border-[#134876] focus:outline-none transition-colors ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export function FormTextarea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea 
      className={`border rounded px-3 py-2 w-full focus:border-[#134876] focus:outline-none transition-colors resize-vertical ${className}`}
      {...props}
    />
  )
}

// Обратная совместимость
export function Button({ className = '', ...props }: ComponentProps<'button'>) {
  return <button className={className} {...props} />
}
