import { Lock, MessageSquare, Phone, User } from 'lucide-react'
// import React from 'react'

const Signup = () => {
  return (

    // ----Start Main Container----//
    <div className=" main-container min-h-screen grid lg:grid-cols-2 border-1 ">


    {/* ---Start Left Section--- */}
 
    <div className='flex flex-col justify-center items-center p-6 sm:p-12 bg-blue-200 border-1'>

        <div className='w-full max-w-md space-y-8 border-1 bg-amber-300'>
            <div className='text-center mb-8 border-1'>
              <div className=' flex flex-col items-center gap-2 group  border-1'>
                <div className=' size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover: bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary' />
                </div>
                <h1 className='text-xl font-bold mt-2'>Create Account</h1>
                <p className='text-base-content/60'>Get started with your free account</p>
              </div>
            </div>
            {/* ---Start Form---- */}
            <form className=' space-y-6 border-1'>
              <div className='form-control'>
                <label className='label'> 
                  <span className='label-text font-medium'>Full Name</span>
                </label>

                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input type="text" className={'input input-bordered w-full pl-10'} placeholder='Enter Name' />
                </div>

                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>Phone</span>
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Phone className='size-5 text-base-content/40' />
                    </div>
                    <input type="number" className={'input input-bordered w-full pl-10'} placeholder='+92-xxxxxxxxxx' />
                    {/* <button>
                    <Lock className="size-5 text-base-content/40" />

                    </button> */}
                  </div>
                </div>

              </div>
              <button>Create Account</button>
            </form>
            {/* ---End Form---- */}
            <div></div>

        </div>
      </div>

        {/* --End Left Section */}


      {/* ---Start Right Section */}
        <div className='bg-amber-900 border-1'></div>
        {/* --End Right Section */}


    </div>
    // End-Main Container
    
  )
}

export default Signup