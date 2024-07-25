'use client';

import { Formik, Field, Form, FormikHelpers, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { Bounce, toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { signUpProceed } from '@/server.actions';
import React from 'react';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface SignUpValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  referal: string;
  middleName: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  username: Yup.string().required('Required'),
  password: Yup.string()
    .min(5, 'Password must be at least 5 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  referal: Yup.string(),
  middleName: Yup.string(),
});

export function SignUp() {
  const router = useRouter();

  const handleSubmit = async (
    values: SignUpValues,
    { setSubmitting, setErrors }: FormikHelpers<SignUpValues>,
  ) => {
    await sleep(500);
    setSubmitting(true);

    const {
      email,
      username,
      password,
      firstName,
      lastName,
      referal,
      middleName,
    } = values;
    const res = await signUpProceed({
      email,
      username,
      password,
      firstName,
      lastName,
      referal,
      middleName,
    });

    if (res.ok) {
      toast.success('Sign Up success!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored',
        transition: Bounce,
      });
      router.push('/sign-in');
    } else {
      if (Array.isArray(res.error as Array<any>)) {
        const errorMessages = function () {
          return (
            <ul className="ml-5 list-disc">
              {(res.error as Array<any>).map((e: string, i: number) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          );
        };
        toast.error(errorMessages, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      } else if (typeof res.error === 'string') {
        toast.error(`Server error: ${res.error}`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'colored',
          transition: Bounce,
        });
      }

      // Set form errors if needed
      if (res.error) {
        setErrors(res.error as FormikErrors<SignUpValues>);
      }
    }

    setSubmitting(false);
  };

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          username: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          referal: '',
          middleName: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="gap-4 flex flex-col max-w-full items-center">
            <h1 className='text-xl font-bold'>Sign Up</h1>

            <div id="input" className="w-80">
              <label className="input input-bordered flex items-center gap-2 my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="grow"
                />
              </label>
              {touched.email && errors.email && (
                <div className="text-red-600">{errors.email}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="grow"
                />
              </label>
              {touched.username && errors.username && (
                <div className="text-red-600">{errors.username}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 1 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="grow"
                />
              </label>
              {touched.password && errors.password && (
                <div className="text-red-600">{errors.password}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-4 w-4 opacity-70"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 1 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="grow"
                />
              </label>
              {touched.confirmPassword && errors.confirmPassword && (
                <div className="text-red-600">{errors.confirmPassword}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="grow"
                />
              </label>
              {touched.firstName && errors.firstName && (
                <div className="text-red-600">{errors.firstName}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="grow"
                />
              </label>
              {touched.lastName && errors.lastName && (
                <div className="text-red-600">{errors.lastName}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <Field
                  type="text"
                  name="referal"
                  placeholder="Referral Code (optional)"
                  className="grow"
                />
              </label>
              {touched.referal && errors.referal && (
                <div className="text-red-600">{errors.referal}</div>
              )}

              <label className="input input-bordered flex items-center gap-2 my-2">
                <Field
                  type="text"
                  name="middleName"
                  placeholder="Middle Name (optional)"
                  className="grow"
                />
              </label>
              {touched.middleName && errors.middleName && (
                <div className="text-red-600">{errors.middleName}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn ${isSubmitting ? 'btn-disabled' : ''}`}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
