"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { message, Input, Checkbox, ConfigProvider, Spin } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage/page";
import "@public/css/style.bundle.css"

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (searchParams.toString().split("=")[0] === "message") {
      message.error(searchParams.toString().split("=")[1].replace(/\+/g, " "));
    }
  }, [searchParams]);

  if (session.status === "loading") {
    return <LoadingPage />;
  }

  if (session.status === "authenticated") {
    if (!session.data.user.workspace) {
      router?.push("/accounts");
      return;
    }
    router?.push("/dashboard/schedule");
    return;
  }

  const redirectHome = () => {
    router.push("/");
  };

  const handleForgotPassword = async () => {
    setSpin(true);

    if (email === "") {
      messageApi.open({
        type: "error",
        content: "Email cannot be empty",
      });
      return;
    }
    const response = await fetch("api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();
    setSpin(false);
    if (data === "Email not found") {
      message.error(data);
      return;
    } else {
      message.success("Password Successfully Updated");
      setIsForgotPassword(false);
      clearFields();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpin(true);
    console.log('test 123')
    if (password === "" || email === "") {
      messageApi.open({
        type: "error",
        content: "Email or password cannot be empty",
      });
      setSpin(false);
      return;
    }

    try {
      const res = await signIn(
        "credentials",
        {
          email,
          password,
          redirect: false,
        },
        { remember }
      );
      setSpin(false);
      if (res?.error == null) {
        router.push("/dashboard/schedule");
      } else {
        messageApi.open({
          type: "error",
          content: res?.error,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <div class="d-flex flex-column flex-root" id="kt_app_root">
      {contextHolder}
    <div class="d-flex flex-column flex-lg-row flex-column-fluid">
      <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
        <div class="d-flex flex-center flex-column flex-lg-row-fluid">
          <div class="w-lg-500px p-10">
            <form class="form w-100" novalidate="novalidate" id="kt_sign_in_form" data-kt-redirect-url="index.html" action="#">
              <div class="text-center mb-11">
                <h1 class="text-gray-900 fw-bolder mb-3">Sign In</h1>
                <div class="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>
              </div>
              <div class="row g-3 mb-9">
                <div class="col-md-12">
                  <a href="#" class="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
                  <img alt="Logo" src="/media/svg/brand-logos/google-icon.svg" class="h-15px me-3" />Sign in with Google</a>
                </div>
                {/* <div class="col-md-6">
                  <a href="#" class="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
                  <img alt="Logo" src="/media/svg/brand-logos/apple-black.svg" class="theme-light-show h-15px me-3" />
                  <img alt="Logo" src="/media/svg/brand-logos/apple-black-dark.svg" class="theme-dark-show h-15px me-3" />Sign in with Apple</a>
                </div> */}
              </div>
              <div class="separator separator-content my-14">
                <span class="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
              </div>
              <div class="fv-row mb-8">
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" name="email" autocomplete="off" class="form-control bg-transparent" />
              </div>
              <div class="fv-row mb-3">
          
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" name="password" autocomplete="off" class="form-control bg-transparent" />
      
              </div>
            
      
              <div class="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
                <div></div>
  
                <a href="authentication/layouts/corporate/reset-password.html" class="link-primary">Forgot Password ?</a>
              </div>
  
              <div class="d-grid mb-10">
                <button onClick={handleSubmit} type="submit" class="!text-white bg-primary py-4 rounded-md hover:opacity-75">
                  <span class="indicator-label">Sign In</span>
                  <span class="indicator-progress">Please wait... 
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                </button>
              </div>

              
              <div class="text-gray-500 text-center fw-semibold fs-6">Not a Member yet? {" "}
              <Link href="/signup">
                  <span className="link-primary">
                     Sign Up
                   </span>
                   </Link>
          </div>
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
          <a href="#" class="opacity-75-hover text-warning fw-bold me-1">the blogger</a>introduces a person they&apos;ve interviewed 
          <br />and provides some background information about 
          <a href="#" class="opacity-75-hover text-warning fw-bold me-1"> the interviewee</a>and their 
          <br />work following this is a transcript of the interview.</div>
    
        </div>
        
      </div>
  
    </div>
  </div>
    // <div className="bg-[#FAFAFA] flex flex-col justify-center items-center h-screen w-screen">
    //   {contextHolder}

    //   <div
    //     onClick={() => redirectHome()}
    //     className="w-full cursor-pointer h-12 px-28 justify-center md:justify-normal lg:justify-normal flex items-center shadow-md"
    //   >
    //     <p className="font-bold text-xl">onshift</p>
    //   </div>

    //   <div className="w-[90%] md:hidden lg:hidden h-full flex justify-center items-center">
    //     <div
    //       className={`${
    //         isForgotPassword ? "h-[350px]" : "h-[520px]"
    //       } w-[531px] shadow-lg px-6 py-6`}
    //     >
    //       <p className="text-3xl font-bold text-center mt-2">
    //         {isForgotPassword ? "Forgot Password" : "Sign In"}
    //       </p>
    //       {isForgotPassword ? (
    //         <>
    //           <div className="mt-6">
    //             <span>Email</span>
    //             <Input
    //               onChange={(e) => setEmail(e.target.value)}
    //               placeholder="Enter your email"
    //               value={email}
    //               prefix={<MailOutlined />}
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
    //               onClick={handleForgotPassword}
    //               className="mt-5 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
    //             >
    //               {spin ? <Spin /> : "Reset Password"}
    //             </button>
    //           </ConfigProvider>

    //           <div className="text-center mt-4">
    //             <div>
    //               Already have an account?{" "}
    //               <span
    //                 onClick={() => setIsForgotPassword(false) & clearFields()}
    //                 className="hover:underline hover:cursor-pointer text-blue-500"
    //               >
    //                 Sign In
    //               </span>
    //             </div>
    //           </div>
    //         </>
    //       ) : (
    //         <>
    //           <div className="mt-6">
    //             <span>Email</span>
    //             <Input
    //               onChange={(e) => setEmail(e.target.value)}
    //               placeholder="Enter your email"
    //               value={email}
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

    //           <div className="flex justify-between mt-5">
    //             <Checkbox
    //               value={remember}
    //               onChange={(e) => setRemember(e.target.checked)}
    //             >
    //               Remember me
    //             </Checkbox>

    //             <span
    //               onClick={() => setIsForgotPassword(true) & clearFields()}
    //               className="hover:underline hover:cursor-pointer"
    //             >
    //               Forgot password?
    //             </span>
    //           </div>

    //           <button
    //             onClick={handleSubmit}
    //             className="mt-8 w-full h-[50px] rounded-[8px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //           >
    //             {spin ? <Spin /> : "Sign in"}
    //           </button>
    //           <p className="text-center mt-4">Or sign in with</p>
    //           <button
    //             onClick={() => {
    //               signIn("google", { callbackUrl: "/dashboard/schedule" });
    //             }}
    //             className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
    //           >
    //             <GoogleOutlined className="mr-2" />
    //             Sign in with Google
    //           </button>
    //           <div className="text-center mt-4">
    //             <Link href="/signup">
    //               Don&apos;t have an account yet?{" "}
    //               <span className="hover:underline text-blue-500">
    //                 Create one.
    //               </span>
    //             </Link>
    //           </div>
    //         </>
    //       )}
    //     </div>
    //   </div>

    //   <div className="hidden md:flex lg:flex flex-1 w-full">
    //     <div className="bg-black w-1/2 h-full flex justify-center items-center">
    //       <Image
    //         height={404}
    //         width={559}
    //         alt="OnShift"
    //         src={"/static/img/onshift.png"}
    //       />
    //     </div>

    //     <div className="w-1/2 h-full flex justify-center items-center">
    //       <div
    //         className={`${
    //           isForgotPassword ? "h-[350px]" : "h-[520px]"
    //         } w-[531px] shadow-lg px-6 py-6`}
    //       >
    //         <p className="text-3xl font-bold text-center mt-2">
    //           {isForgotPassword ? "Forgot Password" : "Sign In"}
    //         </p>
    //         {isForgotPassword ? (
    //           <>
    //             <div className="mt-6">
    //               <span>Email</span>
    //               <Input
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 placeholder="Enter your email"
    //                 value={email}
    //                 prefix={<MailOutlined />}
    //                 className="py-2"
    //               />
    //             </div>
    //             <ConfigProvider
    //               theme={{
    //                 token: {
    //                   colorPrimary: "#1677ff",
    //                 },
    //               }}
    //             >
    //               <button
    //                 onClick={handleForgotPassword}
    //                 className="mt-5 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
    //               >
    //                 {spin ? <Spin /> : "Reset Password"}
    //               </button>
    //             </ConfigProvider>

    //             <div className="text-center mt-4">
    //               <div>
    //                 Already have an account?{" "}
    //                 <span
    //                   onClick={() => setIsForgotPassword(false) & clearFields()}
    //                   className="hover:underline hover:cursor-pointer text-blue-500"
    //                 >
    //                   Sign In
    //                 </span>
    //               </div>
    //             </div>
    //           </>
    //         ) : (
    //           <>
    //             <div className="mt-6">
    //               <span>Email</span>
    //               <Input
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 placeholder="Enter your email"
    //                 value={email}
    //                 className="py-2"
    //               />
    //             </div>

    //             <div className="mt-5">
    //               <span>Password</span>
    //               <Input.Password
    //                 onChange={(e) => setPassword(e.target.value)}
    //                 prefix={<LockOutlined />}
    //                 placeholder="Enter your password"
    //                 className="py-2"
    //               />
    //             </div>

    //             <div className="flex justify-between mt-5">
    //               <Checkbox
    //                 value={remember}
    //                 onChange={(e) => setRemember(e.target.checked)}
    //               >
    //                 Remember me
    //               </Checkbox>

    //               <span
    //                 onClick={() => setIsForgotPassword(true) & clearFields()}
    //                 className="hover:underline hover:cursor-pointer"
    //               >
    //                 Forgot password?
    //               </span>
    //             </div>

    //             <button
    //               onClick={handleSubmit}
    //               className="mt-8 w-full h-[50px] rounded-[8px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    //             >
    //               {spin ? <Spin /> : "Sign in"}
    //             </button>
    //             <p className="text-center mt-4">Or sign in with</p>
    //             <button
    //               onClick={() => {
    //                 signIn("google", { callbackUrl: "/dashboard/schedule" });
    //               }}
    //               className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
    //             >
    //               <GoogleOutlined className="mr-2" />
    //               Sign in with Google
    //             </button>
    //             <div className="text-center mt-4">
    //               <Link href="/signup">
    //                 Don&apos;t have an account yet?{" "}
    //                 <span className="hover:underline text-blue-500">
    //                   Create one.
    //                 </span>
    //               </Link>
    //             </div>
    //           </>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SignIn;
