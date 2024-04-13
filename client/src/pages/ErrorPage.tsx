import React from "react";
import { Link } from "react-router-dom";

const ErrorPage: React.FC = () => {
  const mailsupport = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`;

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="my-auto text-center">
        <p className="text-8xl font-semibold text-blue-600">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl xxl:!text-4xl">
          Page not found
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600 xxl:!text-2xl">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <Link
            to={`/`}
            className="xxl:!px-4.5 rounded-md bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 xxl:!py-3.5 xxl:!text-xl"
          >
            Go back home
          </Link>
          <Link
            to={mailsupport}
            className="xxl:!px-4.5 rounded-md border-gray-50 bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 xxl:!py-3.5 xxl:!text-xl"
          >
            Contact support
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
