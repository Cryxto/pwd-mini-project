import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='fixed h-screen w-screen max-h-screen overflow-hidden z-50 flex flex-col top-0 items-center text-slate-50 justify-center bg-slate-800'>
      <h1 className='text-9xl'>404</h1>
      <br />
      <h2 className='text-4xl'>Not Found</h2>
    </div>
  )
}