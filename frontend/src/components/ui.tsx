import type { ComponentProps } from 'react'

export function Card({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`card bg-white rounded-lg shadow border border-gray-200 ${className}`} {...props} />
}
export function CardHeader({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`p-4 pb-0 ${className}`} {...props} />
}
export function CardContent({ className = '', ...props }: ComponentProps<'div'>) {
  return <div className={`p-4 ${className}`} {...props} />
}
export function Button({ className = '', ...props }: ComponentProps<'button'>) {
  return <button className={className} {...props} />
}
