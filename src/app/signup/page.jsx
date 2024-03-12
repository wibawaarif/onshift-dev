"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message, ConfigProvider, Input, Spin, Checkbox } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import "@public/css/style.bundle.css"

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);

  const router = useRouter();
  const session = useSession();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    if (!session.data.user.workspace) {
      router?.push("/accounts");
      return;
    }
    router?.push("/dashboard/schedule");
    return;
  }

  const createAccount = async () => {
    // if (password !== repeatPassword) {
    //   setIsPasswordMatched(true)
    //   return
    // }
    const response = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username: name,
        type: "credentials",
      }),
    });

    const data = await response.json();

    if (data === "Email already exist") {
      message.error(data);
      return;
    } else {
      message.success("Account created");
      await signIn("credentials", {
        email,
        password,
        callbackUrl: `/accounts`,
      });
    }
  };

  const redirectHome = () => {
    router.push("/");
  };

  return (
    <div class="d-flex flex-column flex-root" id="kt_app_root">
            {contextHolder}
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">

        <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        
          <div class="w-lg-500px p-10">
    
            <form class="form w-100" novalidate="novalidate" id="kt_sign_up_form" data-kt-redirect-url="authentication/layouts/corporate/sign-in.html" action="#">
            
              <div class="text-center mb-11">
          
                <h1 class="text-gray-900 fw-bolder mb-3">Sign Up</h1>
      
                
                <div class="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>
              
              </div>
              <div class="row g-3 mb-9">
                <div class="col-md-12">
                  <a href="#" class="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
                  <img alt="Logo" src="/media/svg/brand-logos/google-icon.svg" class="h-15px me-3" />Sign in with Google</a>
                </div>
              </div>
              
            
              <div class="separator separator-content my-14">
                <span class="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
              </div>
        
              
              <div class="fv-row mb-8">
      
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" name="email" autocomplete="off" class="form-control bg-transparent" />
  
              </div>
              
              <div class="fv-row mb-8" data-kt-password-meter="true">
          
                <div class="mb-1">
                  
                  <div class="position-relative mb-3">
                    <input  onChange={(e) => setPassword(e.target.value)} value={password} class="form-control bg-transparent" type="password" placeholder="Password" name="password" autocomplete="off" />
                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2" data-kt-password-meter-control="visibility">
                      <i class="ki-duotone ki-eye-slash fs-2"></i>
                      <i class="ki-duotone ki-eye fs-2 d-none"></i>
                    </span>
                  </div>
                  
      
                  {/* <div class="d-flex align-items-center mb-3" data-kt-password-meter-control="highlight">
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                    <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                  </div> */}
  
                </div>
    
  
                {/* <div class="text-muted">Use 8 or more characters with a mix of letters, numbers & symbols.</div> */}
              </div>
            
            
              <div class="fv-row mb-2">
            
                <input onChange={(e) => setRepeatPassword(e.target.value)} value={repeatPassword} placeholder="Repeat Password" name="confirm-password" type="password" autocomplete="off" class="form-control bg-transparent" />
             
              </div>

              {
                isPasswordMatched && <div class="!text-red-600 mb-10">Password didn&apos;t match</div>
              }



              {/* <div class="fv-row mb-8">
                <label class="form-check form-check-inline">
                  <input class="form-check-input" type="checkbox" name="toc" value="1" />
                  <span class="form-check-label fw-semibold text-gray-700 fs-base ms-1">I Accept the 
                  <a href="#" class="ms-1 link-primary">Terms</a></span>
                </label>
              </div> */}

              <div class="d-grid mb-10 mt-10">
                <button onClick={() => createAccount()} class="!text-white bg-primary py-4 rounded-md hover:opacity-75">

                  <span>Sign up</span>

          
                </button>
              </div>
           
              
              <div class="text-gray-500 text-center fw-semibold fs-6">Already have an Account? {" "}
              <Link href="/signin">
                  <span className="link-primary">
                     Sign In
                   </span>
                   </Link></div>
          
            </form>
  
          </div>
      
        </div>
      
        <div class="w-lg-500px d-flex flex-stack px-10 mx-auto">
        
          <div class="me-10">
          
            <button class="btn btn-flex btn-link btn-color-gray-700 btn-active-color-primary rotate fs-base" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" data-kt-menu-offset="0px, 0px">
              <img data-kt-element="current-lang-flag" class="w-20px h-20px rounded me-3" src="/media/flags/united-states.svg" alt="" />
              <span data-kt-element="current-lang-name" class="me-1">English</span>
              <span class="d-flex flex-center rotate-180">
                <i class="ki-duotone ki-down fs-5 text-muted m-0"></i>
              </span>
            </button>
  
  
            <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-4 fs-7" data-kt-menu="true" id="kt_auth_lang_menu">
              
              <div class="menu-item px-3">
                <a href="#" class="menu-link d-flex px-5" data-kt-lang="English">
                  <span class="symbol symbol-20px me-4">
                    <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/united-states.svg" alt="" />
                  </span>
                  <span data-kt-element="lang-name">English</span>
                </a>
              </div>
          
              
              <div class="menu-item px-3">
                <a href="#" class="menu-link d-flex px-5" data-kt-lang="Spanish">
                  <span class="symbol symbol-20px me-4">
                    <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/spain.svg" alt="" />
                  </span>
                  <span data-kt-element="lang-name">Spanish</span>
                </a>
              </div>
          
              
              <div class="menu-item px-3">
                <a href="#" class="menu-link d-flex px-5" data-kt-lang="German">
                  <span class="symbol symbol-20px me-4">
                    <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/germany.svg" alt="" />
                  </span>
                  <span data-kt-element="lang-name">German</span>
                </a>
              </div>
          
              
              <div class="menu-item px-3">
                <a href="#" class="menu-link d-flex px-5" data-kt-lang="Japanese">
                  <span class="symbol symbol-20px me-4">
                    <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/japan.svg" alt="" />
                  </span>
                  <span data-kt-element="lang-name">Japanese</span>
                </a>
              </div>
          
              
              <div class="menu-item px-3">
                <a href="#" class="menu-link d-flex px-5" data-kt-lang="French">
                  <span class="symbol symbol-20px me-4">
                    <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/france.svg" alt="" />
                  </span>
                  <span data-kt-element="lang-name">French</span>
                </a>
              </div>
              
            </div>
    
          </div>
          
        
          <div class="d-flex fw-semibold text-primary fs-base gap-5">
            <a href="pages/team.html" target="_blank">Terms</a>
            <a href="pages/pricing/column.html" target="_blank">Plans</a>
            <a href="pages/contact.html" target="_blank">Contact Us</a>
          </div>
    
        </div>
    
      </div>
    
      <div class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style={{ backgroundImage: "url(/media/misc/auth-bg.png)" }}>
        
        <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">
      
          <a href="index.html">
            <img alt="Logo" src="/static/img/onshift-no-bg.png" class="h-72 h-lg-120" />
          </a>
  
        
          <img class="d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20" src="/media/misc/auth-screens.png" alt="" />
    
        
          <h1 class="d-none d-lg-block !text-white fs-2qx fw-bolder text-center mb-7">Fast, Efficient and Productive</h1>
    
      
          <div class="d-none d-lg-block !text-white fs-base text-center">In this kind of post, 
          <a href="#" class="opacity-75-hover text-warning fw-bold me-1">the blogger</a>introduces a person they’ve interviewed 
          <br />and provides some background information about 
          <a href="#" class="opacity-75-hover text-warning fw-bold me-1">the interviewee</a>and their 
          <br />work following this is a transcript of the interview.</div>
    
        </div>
        
      </div>
  
    </div>
  </div>
    // <ConfigProvider
    //   theme={{
    //     token: {
    //       colorPrimary: "#191407",
    //     },
    //   }}
    // >
    //   <div className="bg-[#FAFAFA] flex flex-col justify-center items-center h-screen w-screen">
    //     {contextHolder}

    //     <div
    //       onClick={() => redirectHome()}
    //       className="w-full h-12 px-28 cursor-pointer flex justify-center md:justify-normal lg:justify-normal items-center shadow-md"
    //     >
    //       <p className="font-bold text-xl">onshift</p>
    //     </div>

    //     <div className="w-[90%] md:hidden lg:hidden h-full flex justify-center items-center">
    //       <div className="w-[531px] h-[520px] shadow-lg px-6 py-6">
    //         <p className="text-3xl font-bold text-left mt-2">
    //           Let&apos;s Get Started 🚀
    //         </p>
    //         <p className="mt-2">Create your account</p>

    //         <div className="mt-6">
    //           <span>Email</span>
    //           <Input
    //             onChange={(e) => setEmail(e.target.value)}
    //             placeholder="Enter your email"
    //             prefix={<MailOutlined />}
    //             className="py-2"
    //           />
    //         </div>

    //         <div className="mt-5">
    //           <span>Password</span>
    //           <Input.Password
    //             onChange={(e) => setPassword(e.target.value)}
    //             prefix={<LockOutlined />}
    //             placeholder="Enter your password"
    //             className="py-2"
    //           />
    //         </div>

    //         <ConfigProvider
    //           theme={{
    //             token: {
    //               colorPrimary: "#1677ff",
    //             },
    //           }}
    //         >
    //           <button
    //             onClick={() => createAccount()}
    //             className="mt-8 w-full h-[50px] text-white rounded-[8px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //           >
    //             {spin ? <Spin /> : "Continue"}
    //           </button>
    //           <p className="text-center mt-4">Or sign up with</p>
    //           <button
    //             onClick={() => {
    //               signIn("google", { callbackUrl: "/dashboard/schedule" });
    //             }}
    //             className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
    //           >
    //             <GoogleOutlined className="mr-2" />
    //             Sign up with Google
    //           </button>
    //         </ConfigProvider>
    //         <div className="text-center mt-4">
    //           <Link href="/signin">
    //             Already have an account?{" "}
    //             <span className="hover:underline text-blue-500">Sign In</span>
    //           </Link>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="hidden lg:flex md:flex-1 w-full">
    //       <div className="bg-black w-1/2 h-full flex justify-center items-center">
    //         <Image
    //           height={404}
    //           width={559}
    //           alt="OnShift"
    //           src={"/static/img/onshift.png"}
    //         />
    //       </div>

    //       <div className="w-1/2 h-full flex justify-center items-center">
    //         <div className="w-[531px] h-[520px] shadow-lg px-6 py-6">
    //           <p className="text-3xl font-bold text-left mt-2">
    //             Let&apos;s Get Started 🚀
    //           </p>
    //           <p className="mt-2">Create your account</p>

    //           <div className="mt-6">
    //             <span>Email</span>
    //             <Input
    //               onChange={(e) => setEmail(e.target.value)}
    //               placeholder="Enter your email"
    //               prefix={<MailOutlined />}
    //               className="py-2"
    //             />
    //           </div>

    //           <div className="mt-5">
    //             <span>Password</span>
    //             <Input.Password
    //               onChange={(e) => setPassword(e.target.value)}
    //               prefix={<LockOutlined />}
    //               placeholder="Enter your password"
    //               className="py-2"
    //             />
    //           </div>

    //           <ConfigProvider
    //             theme={{
    //               token: {
    //                 colorPrimary: "#1677ff",
    //               },
    //             }}
    //           >
    //             <button
    //               onClick={() => createAccount()}
    //               className="mt-8 w-full h-[50px] text-white rounded-[8px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //             >
    //               {spin ? <Spin /> : "Continue"}
    //             </button>
    //             <p className="text-center mt-4">Or sign up with</p>
    //             <button
    //               onClick={() => {
    //                 signIn("google", { callbackUrl: "/dashboard/schedule" });
    //               }}
    //               className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
    //             >
    //                               <GoogleOutlined className="mr-2" />
    //               Sign up with Google
    //             </button>
    //           </ConfigProvider>
    //           <div className="text-center mt-4">
    //             <Link href="/signin">
    //               Already have an account?{" "}
    //               <span className="hover:underline text-blue-500">Sign In</span>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </ConfigProvider>
  );
};

export default SignUpPage;
