import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Logo from '@/components/logo'
import { LuEyeClosed, LuEye } from "react-icons/lu";
// import { setAuthToken } from '@/utils/auth'

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData(event.currentTarget)

      // Convertir FormData en JSON
      const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get("confirmPassword")
      }

      // Vérifier si les mots de passe correspondent
      if (data.password !== data.confirmPassword) {
        throw new Error('Les mots de passe ne correspondent pas')
      }

      // Vérifier la longueur minimale
      if (data.password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de l'inscription.")
      }

      // Sauvegarder le token
      //   setAuthToken(result.token)

      // Rediriger vers la page de connexion
      router.push('/login')

    } catch (error) {
      console.error(error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex flex-col flex-1/2 h-screen justify-center items-center'>
      <Logo></Logo>
      <form onSubmit={onSubmit} className='flex flex-col gap-4 justify-center p-8 rounded-lg shadow-lg bg-card w-full max-w-md'>
        <h1 className='text-2xl font-bold text-center mb-4'>Sign up</h1>

        {error && (
          <div className='bg-destructive/10 text-destructive p-3 rounded-md text-sm'>
            {error}
          </div>
        )}
        <div className='flex flex-col gap-2'>
          <label htmlFor="username" className='text-sm font-medium'>Username</label>
          <input
            type="text"
            name="username"
            id="username"
            required
            className='border rounded-md px-3 py-2 bg-input'
            disabled={isLoading}
          />
        </div>
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
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              required
              minLength={6}
              className='border rounded-md px-3 py-2 bg-input w-full pr-10'
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className='transition cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              disabled={isLoading}
            >
              {showPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor="confirmPassword" className='text-sm font-medium'>Confirm password</label>
          <div className='relative'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              id="confirmPassword"
              required
              minLength={6}
              className='border rounded-md px-3 py-2 bg-input w-full pr-10'
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='transition cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              disabled={isLoading}
            >
              {showConfirmPassword ? <LuEye size={20} /> : <LuEyeClosed size={20} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className='bg-primary text-primary-foreground py-2 px-4 rounded-md font-medium hover:opacity-90 disabled:opacity-50'
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        <Link className='self-center text-center w-fit cursor-pointer hover:opacity-50 transition' href={"/login"}>Already have an account ? Log in here.</Link>

      </form>
    </div>
  )
}