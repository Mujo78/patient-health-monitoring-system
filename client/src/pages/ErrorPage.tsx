import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage: React.FC = () => {

  return (
    <main className="h-screen w-full font-Poppins flex justify-center items-center">
      <div className="text-center my-auto">
        <p className="text-8xl font-semibold text-blue-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
        <p className="mt-6 text-base leading-7 text-gray-600">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to={`/`}
            className="rounded-md bg-blue-700 px-3.5 py-2.5 transition-colors duration-300 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go back home
          </Link>
          <Link 
            to={"/"} 
            className="rounded-md bg-gray-600 border-gray-50 px-3.5 py-2.5 transition-colors duration-300 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
            Contact support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage