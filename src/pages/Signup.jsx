import { MessageSquare } from 'lucide-react'
import React from 'react'

const Signup = () => {
  return (

    // ----Start Main Container----//
    <div className=" main-container bg-themeDarkBG">
       
      <div>

        {/* ---Start Left Section--- */}
        <div>
          <div>
            <div>
              <div>
                <div>
                <MessageSquare className='size-6 text-primary' />
                </div>
                <h1>Create Account</h1>
                <p>Get started with your free account</p>
              </div>
            </div>
            <form>
              <div>
                <label>
                  <span>Full Name</span>
                </label>

                <div>
                  <div><User className="size-5 text-base-content/40" /></div>
                  <input type="text" placeholder='Enter Name' />
                </div>

                <div>
                  <div></div>
                  <input type="text" />
                </div>

              </div>
              <button></button>
            </form>
            <div></div>
          </div>

        </div>
        {/* --End Left Section */}


      {/* ---Start Right Section */}
        <div></div>
        {/* --End Right Section */}

      </div>

    </div>
    // End-Main Container
    
  )
}

export default Signup