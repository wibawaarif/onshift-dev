import React from 'react'
import "@public/css/style.bundle.css";
import "@public/css/plugins.bundle.css";
import Link from "next/link";

const Welcome = () => {
  return (
    <div style={{ backgroundImage: "url(/media/auth/bg8.jpg)" }} class="d-flex flex-column flex-root" id="kt_app_root">

			{/* <style>body { background-image: url('assets/media/auth/bg8.jpg'); } [data-bs-theme="dark"] body { background-image: url('assets/media/auth/bg8-dark.jpg'); }</style> */}

			<div class="d-flex flex-column flex-center flex-column-fluid">
		
				<div class="d-flex flex-column flex-center text-center p-10">
			
					<div class="card card-flush w-md-650px py-5">
						<div class="card-body">
		
                        <div class="d-flex flex-center pb-10">
              <a href="index.html">
                <img
                  alt="Logo"
                  src="/static/img/brand.png"
                  class="h-32 h-lg-32"
                />
              </a>
            </div>

			
							<h1 class="fw-bolder text-gray-900 mb-5">Welcome to Onshift</h1>
	
		
							<div class="fw-semibold fs-6 text-gray-500 mb-7">This is your opportunity to get creative and make a name 
							<br />that gives readers an idea</div>


							<div class="mb-0 flex justify-center">
								<img src="/media/auth/welcome.png" class="mw-100 mh-300px theme-light-show" alt="" />
							</div>

		
							<div class="mb-0">
                            <Link className='px-6 py-4 bg-blue-500 rounded-lg hover:bg-blue-600 transition delay-150' href="/dashboard/schedule">
                     <span className='!text-white'>
                        Go To Dashboard
                      </span>
                      </Link></div>
							</div>

						</div>
					</div>
	


			</div>

		</div>
  )
}

export default Welcome






