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
    <div className="p-4 max-w-xl w-full mx-auto mb-20">
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
          <Form className="gap-4 flex flex-col items-center">
            <h1 className="text-xl font-bold mb-4">Sign Up</h1>

            <div className="w-full max-w-md">
              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Email</span>
                </div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`input input-bordered w-full ${touched.email && errors.email ? 'input-error' : ''}`}
                />
                {touched.email && errors.email && (
                  <div className="text-red-600 mt-1 text-sm">{errors.email}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Username</span>
                </div>
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className={`input input-bordered w-full ${touched.username && errors.username ? 'input-error' : ''}`}
                />
                {touched.username && errors.username && (
                  <div className="text-red-600 mt-1 text-sm">{errors.username}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Password</span>
                </div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`input input-bordered w-full ${touched.password && errors.password ? 'input-error' : ''}`}
                />
                {touched.password && errors.password && (
                  <div className="text-red-600 mt-1 text-sm">{errors.password}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Confirm Password</span>
                </div>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`input input-bordered w-full ${touched.confirmPassword && errors.confirmPassword ? 'input-error' : ''}`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-red-600 mt-1 text-sm">{errors.confirmPassword}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">First Name</span>
                </div>
                <Field
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={`input input-bordered w-full ${touched.firstName && errors.firstName ? 'input-error' : ''}`}
                />
                {touched.firstName && errors.firstName && (
                  <div className="text-red-600 mt-1 text-sm">{errors.firstName}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Last Name</span>
                </div>
                <Field
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={`input input-bordered w-full ${touched.lastName && errors.lastName ? 'input-error' : ''}`}
                />
                {touched.lastName && errors.lastName && (
                  <div className="text-red-600 mt-1 text-sm">{errors.lastName}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Referral Code (optional)</span>
                </div>
                <Field
                  type="text"
                  name="referal"
                  placeholder="Referral Code"
                  className={`input input-bordered w-full ${touched.referal && errors.referal ? 'input-error' : ''}`}
                />
                {touched.referal && errors.referal && (
                  <div className="text-red-600 mt-1 text-sm">{errors.referal}</div>
                )}
              </label>

              <label className="form-control w-full mb-4">
                <div className="label">
                  <span className="label-text">Middle Name (optional)</span>
                </div>
                <Field
                  type="text"
                  name="middleName"
                  placeholder="Middle Name"
                  className={`input input-bordered w-full ${touched.middleName && errors.middleName ? 'input-error' : ''}`}
                />
                {touched.middleName && errors.middleName && (
                  <div className="text-red-600 mt-1 text-sm">{errors.middleName}</div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn btn-neutral ${isSubmitting ? 'btn-disabled' : ''}`}
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
