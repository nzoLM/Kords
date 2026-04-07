import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { setAuthToken } from '@/utils/auth'
import Logo from '@/components/logo'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData(event.currentTarget)
      
      // Convertir FormData en JSON
      const data = {
        email: formData.get('email'),
        password: formData.get('password')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Erreur de connexion')
      }

      // Sauvegarder le token
      setAuthToken(result.token)
      
      // Rediriger vers la timeline
      router.push('/timeline')

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-1/2 flex-col h-screen justify-center items-center'>
      <Logo></Logo>
      <form onSubmit={onSubmit} className='flex flex-col gap-4 justify-center p-8 rounded-lg shadow-lg bg-card w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-4'>Log in</h1>
        
        {error && (
          <div className='bg-destructive/10 text-destructive p-3 rounded-md text-sm'>
            {error}
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <label htmlFor="email" className='text-sm font-medium'>Email</label>
          <input 
            type="email" 
            name="email" 
            id="email"
            required
            className='border rounded-md px-3 py-2 bg-input'
            disabled={isLoading}
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="password" className='text-sm font-medium'>Password</label>
          <input 
            type="password" 
            name="password" 
            id="password"
            required
            className='border rounded-md px-3 py-2 bg-input'
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className='cursor-pointer bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        <Link className='self-center text-center w-fit cursor-pointer hover:opacity-50 transition' href={"/signup"}>No account ? Sign up here.</Link>
      </form>
    </div>
  )
}