"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message, ConfigProvider, Input, Spin } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { SlLocationPin } from "react-icons/sl";
import { motion } from "framer-motion";
import "@public/css/style.bundle.css";
import "@public/css/plugins.bundle.css";
import PlaceComponent from "@/components/place-autocomplete/page";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);
  const [address, setAddress] = useState(null);
  const [latitude, setLatitude] = useState(24.432928);
  const [longitude, setLongitude] = useState(54.644539);
  const [totalTeam, setTotalTeam] = useState(2);
  const [currentStep, setCurrentStep] = useState(1);
  const [team, setTeam] = useState([
    {
      team: "",
      position: "",
    },
    {
      team: "",
      position: "",
    },
  ]);
  const [form, setForm] = useState({
    name: "",
    startDayOfWeek: "Monday",
    businessName: "",
    industry: "",
    totalEmployee: "1-5",
    email: "",
    password: "",
    team: [],
  });

  const router = useRouter();
  const session = useSession();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    // if (!session.data.user.workspace) {
    //   router?.push("/accounts");
    //   return;
    // }
    router?.push("/dashboard/schedule");
    return;
  }

  const createAccount = async () => {
    setSpin(true);
    // if (password !== repeatPassword) {
    //   setIsPasswordMatched(true)
    //   return
    // }
    const response = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...form, businessAddress: address, type: "credentials", team}),
    });

    const data = await response.json();

    if (data === "Email already exist") {
      message.error(data);
      return;
    } else {
      setSpin(false);
      message.success("Account created");
      await signIn("credentials", {
        email,
        password,
        callbackUrl: `/dashboard/schedule`,
      });
    }
  };

  const redirectHome = () => {
    router.push("/");
  };

  return (
    <div class="d-flex flex-column flex-root" id="kt_app_root">
      <div
        class="d-flex flex-column flex-lg-row flex-column-fluid stepper stepper-pills stepper-column stepper-multistep"
        id="kt_create_account_stepper"
      >
        <div class="d-flex flex-column flex-lg-row-auto w-lg-350px w-xl-500px">
          <div
            class="d-flex flex-column position-lg-fixed top-0 bottom-0 w-lg-350px w-xl-500px scroll-y bgi-size-cover bgi-position-center"
            style={{ backgroundImage: "url(/media/misc/auth-bg.png)" }}
          >
            <div class="d-flex flex-center py-10 py-lg-20 mt-lg-20">
              <a href="index.html">
                <img
                  alt="Logo"
                  src="/static/img/onshift-no-bg.png"
                  class="h-72 h-lg-120"
                />
              </a>
            </div>

            <div class="d-flex flex-row-fluid justify-content-center p-10">
              <div class="stepper-nav">
                <div
                  className={`stepper-item ${
                    currentStep == 1 ? "current" : ""
                  }`}
                  data-kt-stepper-element="nav"
                >
                  <div class="stepper-wrapper">
                    <div class="stepper-icon rounded-3">
                      {currentStep > 1 ? (
                        <i
                          style={{ color: "#1ac653" }}
                          class="ki-duotone ki-check fs-2"
                        ></i>
                      ) : (
                        <span class="stepper-number">1</span>
                      )}
                    </div>

                    <div class="stepper-label">
                      <h3 class="stepper-title fs-2">Preference</h3>
                      <div class="stepper-desc fw-normal">
                        Select your account type
                      </div>
                    </div>
                  </div>

                  <div class="stepper-line h-40px"></div>
                </div>

                <div
                  className={`stepper-item ${
                    currentStep == 2 ? "current" : ""
                  }`}
                  data-kt-stepper-element="nav"
                >
                  <div class="stepper-wrapper">
                    <div class="stepper-icon rounded-3">
                      {currentStep > 2 ? (
                        <i
                          style={{ color: "#1ac653" }}
                          class="ki-duotone ki-check fs-2"
                        ></i>
                      ) : (
                        <span class="stepper-number">2</span>
                      )}
                    </div>

                    <div class="stepper-label">
                      <h3 class="stepper-title fs-2">Account Info</h3>
                      <div class="stepper-desc fw-normal">
                        Setup your account name
                      </div>
                    </div>
                  </div>

                  <div class="stepper-line h-40px"></div>
                </div>

                <div
                  className={`stepper-item ${
                    currentStep == 3 ? "current" : ""
                  }`}
                  data-kt-stepper-element="nav"
                >
                  <div class="stepper-wrapper">
                    <div class="stepper-icon">
                      {currentStep > 3 ? (
                        <i
                          style={{ color: "#1ac653" }}
                          class="ki-duotone ki-check fs-2"
                        ></i>
                      ) : (
                        <span class="stepper-number">3</span>
                      )}
                    </div>

                    <div class="stepper-label">
                      <h3 class="stepper-title fs-2">Account Details</h3>
                      <div class="stepper-desc fw-normal">
                        Setup your account details
                      </div>
                    </div>
                  </div>

                  <div class="stepper-line h-40px"></div>
                </div>

                <div
                  className={`stepper-item ${
                    currentStep == 4 ? "current" : ""
                  }`}
                  data-kt-stepper-element="nav"
                >
                  <div class="stepper-wrapper">
                    <div class="stepper-icon">
                      {currentStep > 4 ? (
                        <i
                          style={{ color: "#1ac653" }}
                          class="ki-duotone ki-check fs-2"
                        ></i>
                      ) : (
                        <span class="stepper-number">4</span>
                      )}
                    </div>

                    <div class="stepper-label">
                      <h3 class="stepper-title">Business Details</h3>
                      <div class="stepper-desc fw-normal">
                        Setup your business details
                      </div>
                    </div>
                  </div>

                  {/* <div class="stepper-line h-40px"></div> */}
                </div>

                {/* <div
                  className={`stepper-item ${
                    currentStep == 5 ? "current" : ""
                  }`}
                  data-kt-stepper-element="nav"
                >
                  <div class="stepper-wrapper">
                    <div class="stepper-icon">
                      {currentStep > 5 ? (
                        <i
                          style={{ color: "#1ac653" }}
                          class="ki-duotone ki-check fs-2"
                        ></i>
                      ) : (
                        <span class="stepper-number">5</span>
                      )}
                    </div>

                    <div class="stepper-label">
                      <h3 class="stepper-title">User Credentials</h3>
                      <div class="stepper-desc fw-normal">
                        Register your account
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>

            <div class="d-flex flex-center flex-wrap px-5 py-10">
              <div class="d-flex fw-normal">
                <a
                  href="https://keenthemes.com"
                  class="text-success px-5"
                  target="_blank"
                >
                  Terms
                </a>
                <a
                  href="https://devs.keenthemes.com"
                  class="text-success px-5"
                  target="_blank"
                >
                  Plans
                </a>
                <a
                  href="https://1.envato.market/EA4JP"
                  class="text-success px-5"
                  target="_blank"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex flex-column flex-lg-row-fluid py-10">
          <div class="d-flex flex-center flex-column flex-column-fluid">
            <div class="w-lg-750px w-xl-900px p-10 p-lg-15 mx-auto">
              <form
                class="my-auto pb-5"
                novalidate="novalidate"
                id="kt_create_account_form"
              >
                {currentStep == 1 && (
                  <motion.div
                    key={"step1"}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div class="current" data-kt-stepper-element="content">
                      <div class="w-100">
                        <div class="pb-2 pb-lg-4">
                          <h2 class="fw-bold text-7xl text-gray-900">
                            User Credentials
                          </h2>

                          {/* <div class="text-muted fw-semibold fs-6">
                          If you need more info, please check out
                          <a href="#" class="link-primary fw-bold">
                            Help Page
                          </a>
                          .
                        </div> */}
                        </div>

                        <div class="fv-row mb-8">
                          <label class="form-label !mb-0">
                            <p className="text-2xl">Email</p>
                          </label>
                          <input
                            onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                            }
                            value={form.email}
                            type="text"
                            placeholder="Email"
                            name="email"
                            autocomplete="off"
                            class="form-control bg-transparent"
                          />
                        </div>
                        <div class="fv-row mb-3">
                          <label class="form-label !mb-0">
                            <p className="text-2xl">Password</p>
                          </label>
                          <input
                            onChange={(e) =>
                              setForm({ ...form, password: e.target.value })
                            }
                            value={form.password}
                            type="password"
                            placeholder="Password"
                            name="password"
                            autocomplete="off"
                            class="form-control bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep == 2 && (
                  <motion.div
                    key={"step2"}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 2 }}
                  >
                    <div class="current" data-kt-stepper-element="content">
                      <div class="w-100">
                        <div class="pb-2 pb-lg-4">
                          <h2 class="fw-bold text-7xl text-gray-900">
                            Account Info
                          </h2>
                        </div>

                        <div class="mb-10 fv-row">
                          <label class="form-label mb-3">
                            <p className="text-2xl">What's your name?</p>
                          </label>

                          <input
                            type="text"
                            class="form-control form-control-lg form-control-solid"
                            name="account_name"
                            placeholder="Your fullname"
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
                            value={form.name}
                          />
                        </div>

                        <div class="mb-10 fv-row">
                          <label class="form-label mb-3">
                            <p className="text-2xl">
                              What's your business's address?
                            </p>
                          </label>
                          <PlaceComponent
                            address={address}
                            setAddress={setAddress}
                            setLatitude={setLatitude}
                            setLongitude={setLongitude}
                            style="form-control form-control-lg form-control-solid"
                          ></PlaceComponent>
                        </div>

                        <div class="fv-row mb-10">
                          <label class="form-label">
                            <p className="text-2xl">
                              What day of the week do your schedule start?
                            </p>
                          </label>

                          <select
                            onChange={(e) =>
                              setForm({
                                ...form,
                                startDayOfWeek: e.target.value,
                              })
                            }
                            value={form.startDayOfWeek}
                            name="business_type"
                            class="form-select form-select-lg form-select-solid"
                            data-control="select2"
                            data-placeholder="Select..."
                            data-allow-clear="true"
                            data-hide-search="true"
                          >
                            <option></option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* <div class="current" data-kt-stepper-element="content">
                    <div class="w-100">
                      <div class="pb-10 pb-lg-15">
                                           <h2 class="fw-bold d-flex align-items-center text-7xl text-gray-900">
          Let's make work easier.
          <span
            class="ms-1"
            data-bs-toggle="tooltip"
            title="Billing is issued based on your selected account typ"
          >
          </span>
        </h2>                        <div class="text-muted fw-semibold fs-6">
                          <p className="text-2xl">How will you be using Onshift?</p>
                        </div>

  

                      </div>
  
                      <div class="fv-row">
                        <div class="row">

                          <div class="col-lg-6">
                            <label
                              onClick={() => setCurrentStep(2)}
                              class="btn btn-outline btn-outline-dashed py-10 btn-active-light-primary p-7 d-flex align-items-center"
                              for="kt_create_account_form_account_type_personal"
                            >
                              <i class="ki-duotone ki-badge fs-3x me-5">
                                <span class="path1"></span>
                                <span class="path2"></span>
                                <span class="path3"></span>
                                <span class="path4"></span>
                                <span class="path5"></span>
                              </i>
  
                              <span class="d-block fw-semibold text-start">
                                <span class="text-gray-900 fw-bold d-block fs-4 mb-2">
                                  Do you own or manage a business?
                                </span>
                                <span class="text-muted fw-semibold fs-6">
                                  Set up a new business
                                </span>
                              </span>
                            </label>
                          </div>
  
                          <div class="col-lg-6">
                            <label
                              class="btn btn-outline btn-outline-dashed btn-active-light-primary p-7 d-flex align-items-center"
                              for="kt_create_account_form_account_type_corporate"
                            >
                              <i class="ki-duotone ki-briefcase fs-3x me-5">
                                <span class="path1"></span>
                                <span class="path2"></span>
                              </i>
  
                              <span class="d-block fw-semibold text-start">
                                <span class="text-gray-900 fw-bold d-block fs-4 mb-2">
                                  Are you an employee joining a team?
                                </span>
                                <span class="text-muted fw-semibold fs-6">
                                  Create corporate account to mane users
                                </span>
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  </motion.div>
                )}

                {currentStep == 3 && (
                  <motion.div
                    key={currentStep}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div class="current" data-kt-stepper-element="content">
                      <div class="w-100">
                        <div class="pb-2 pb-lg-4">
                          <h2 class="fw-bold text-7xl text-gray-900">
                            More About You
                          </h2>

                          {/* <div class="text-muted fw-semibold fs-6">
                          If you need more info, please check out
                          <a href="#" class="link-primary fw-bold">
                            Help Page
                          </a>
                          .
                        </div> */}
                        </div>

                        <div className="w-full h-96 overflow-y-auto">
                          {team?.map((x, index) => (
                            <div className="flex h-40 w-full gap-x-4">
                              <div className="h-full w-[50%] flex flex-col">
                                <p>Team</p>
                                <Input
                                  onChange={(e) =>
                                    setTeam((y) => {
                                      const cloneTeam = [...y];
                                      cloneTeam[index] = {
                                        position: x.position,
                                        team: e.target.value,
                                      };
                                      return cloneTeam;
                                    })
                                  }
                                  placeholder="Enter your email"
                                  value={x?.team}
                                  className="py-2"
                                />
                              </div>

                              <div className="h-full w-full">
                                <p>Position</p>
                                <Input
                                  onChange={(e) =>
                                    setTeam((y) => {
                                      const cloneTeam = [...y];
                                      cloneTeam[index] = {
                                        position: e.target.value,
                                        team: x.team,
                                      };
                                      return cloneTeam;
                                    })
                                  }
                                  placeholder="Enter your email"
                                  value={x?.position}
                                  className="py-2"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                        type="button"
                          onClick={() =>
                            setTeam((y) => {
                              const cloneTeam = [...y];
                              cloneTeam.push({ team: "", position: "" });
                              return cloneTeam;
                            })
                          }
                          className="transition duration-300 mt-4 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                        >
                          + ADD TEAM
                        </button>

                        {/* <div class="fv-row mb-10">
                        <label class="form-label">
                          <p className="text-2xl">What brings you to Onshift?</p>
                        </label>
  
                        <select
                          onChange={(e) => setForm({...form, reasonToCreate: e.target.value})}
                          value={form.reasonToCreate}
                          name="business_type"
                          class="form-select form-select-lg form-select-solid"
                          data-control="select2"
                          data-placeholder="Select..."
                          data-allow-clear="true"
                          data-hide-search="true"
                        >
                          <option></option>
                          <option value="Scheduling">Scheduling</option>
                          <option value="Time Tracking">Time Tracking</option>
                          <option value="Payroll">Payroll</option>
                        </select>
                      </div> */}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep == 4 && (
                  <motion.div
                    key={currentStep}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div class="current" data-kt-stepper-element="content">
                      <div class="w-100">
                        <div class="pb-2 pb-lg-4">
                          <h2 class="fw-bold text-7xl text-gray-900">
                            Business Details
                          </h2>

                          {/* <div class="text-muted fw-semibold fs-6">
                          If you need more info, please check out
                          <a href="#" class="link-primary fw-bold">
                            Help Page
                          </a>
                          .
                        </div> */}
                        </div>

                        <div class="mb-10 fv-row">
                          <label class="form-label mb-3">
                            <p className="text-2xl">
                              What's your business called?
                            </p>
                          </label>

                          <input
                            type="text"
                            class="form-control form-control-lg form-control-solid"
                            name="account_name"
                            placeholder="Business name"
                            onChange={(e) =>
                              setForm({ ...form, businessName: e.target.value })
                            }
                            value={form.businessName}
                          />
                        </div>

                        <div class="fv-row mb-10">
                          <label class="form-label">
                            <p className="text-2xl">
                              What kind of business is it?
                            </p>
                          </label>

                          <select
                            onChange={(e) =>
                              setForm({ ...form, industry: e.target.value })
                            }
                            value={form.industry}
                            name="business_type"
                            class="form-select form-select-lg form-select-solid"
                            data-control="select2"
                            data-placeholder="Select..."
                            data-allow-clear="true"
                            data-hide-search="true"
                          >
                            <option value="Food & Beverage">
                              Food & Beverage
                            </option>
                            <option value="Healthcare">Healthcare</option>
                          </select>
                        </div>

                        <div class="mb-10 fv-row">
                          <label class="form-label mb-3">
                            <p className="text-2xl">
                              How many people work there?
                            </p>
                          </label>

                          <div className="flex">
                            {[
                              "1-5",
                              "6-10",
                              "11-19",
                              "20-29",
                              "30-50",
                              "51+",
                            ].map((x) => {
                              return (
                                <div
                                  onClick={() =>
                                    setForm({ ...form, totalEmployee: x })
                                  }
                                  className={`px-6 py-4 border cursor-pointer border-gray-400 ${
                                    form.totalEmployee == x && "bg-gray-400"
                                  }`}
                                >
                                  {x}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* {currentStep === 5 && (
                  <motion.div
                    key={currentStep}
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                )} */}

                <div class="" data-kt-stepper-element="content">
                  <div class="w-100">
                    <div class="pb-10 pb-lg-15">
                      <h2 class="fw-bold text-gray-900">Billing Details</h2>

                      <div class="text-muted fw-semibold fs-6">
                        If you need more info, please check out
                        <a href="#" class="text-primary fw-bold">
                          Help Page
                        </a>
                        .
                      </div>
                    </div>

                    <div class="d-flex flex-column mb-7 fv-row">
                      <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                        <span class="required">Name On Card</span>
                        <span
                          class="ms-1"
                          data-bs-toggle="tooltip"
                          title="Specify a card holder's name"
                        >
                          <i class="ki-duotone ki-information-5 text-gray-500 fs-6">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                        </span>
                      </label>

                      <input
                        type="text"
                        class="form-control form-control-solid"
                        placeholder=""
                        name="card_name"
                        value="Max Doe"
                      />
                    </div>

                    <div class="d-flex flex-column mb-7 fv-row">
                      <label class="required fs-6 fw-semibold form-label mb-2">
                        Card Number
                      </label>

                      <div class="position-relative">
                        <input
                          type="text"
                          class="form-control form-control-solid"
                          placeholder="Enter card number"
                          name="card_number"
                          value="4111 1111 1111 1111"
                        />

                        <div class="position-absolute translate-middle-y top-50 end-0 me-5">
                          <img
                            src="/media/svg/card-logos/visa.svg"
                            alt=""
                            class="h-25px"
                          />
                          <img
                            src="/media/svg/card-logos/mastercard.svg"
                            alt=""
                            class="h-25px"
                          />
                          <img
                            src="/media/svg/card-logos/american-express.svg"
                            alt=""
                            class="h-25px"
                          />
                        </div>
                      </div>
                    </div>

                    <div class="row mb-10">
                      <div class="col-md-8 fv-row">
                        <label class="required fs-6 fw-semibold form-label mb-2">
                          Expiration Date
                        </label>

                        <div class="row fv-row">
                          <div class="col-6">
                            <select
                              name="card_expiry_month"
                              class="form-select form-select-solid"
                              data-control="select2"
                              data-hide-search="true"
                              data-placeholder="Month"
                            >
                              <option></option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                              <option value="11">11</option>
                              <option value="12">12</option>
                            </select>
                          </div>

                          <div class="col-6">
                            <select
                              name="card_expiry_year"
                              class="form-select form-select-solid"
                              data-control="select2"
                              data-hide-search="true"
                              data-placeholder="Year"
                            >
                              <option></option>
                              <option value="2024">2024</option>
                              <option value="2025">2025</option>
                              <option value="2026">2026</option>
                              <option value="2027">2027</option>
                              <option value="2028">2028</option>
                              <option value="2029">2029</option>
                              <option value="2030">2030</option>
                              <option value="2031">2031</option>
                              <option value="2032">2032</option>
                              <option value="2033">2033</option>
                              <option value="2034">2034</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="col-md-4 fv-row">
                        <label class="d-flex align-items-center fs-6 fw-semibold form-label mb-2">
                          <span class="required">CVV</span>
                          <span
                            class="ms-1"
                            data-bs-toggle="tooltip"
                            title="Enter a card CVV code"
                          >
                            <i class="ki-duotone ki-information-5 text-gray-500 fs-6">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                            </i>
                          </span>
                        </label>

                        <div class="position-relative">
                          <input
                            type="text"
                            class="form-control form-control-solid"
                            minlength="3"
                            maxlength="4"
                            placeholder="CVV"
                            name="card_cvv"
                          />

                          <div class="position-absolute translate-middle-y top-50 end-0 me-3">
                            <i class="ki-duotone ki-credit-cart fs-2hx">
                              <span class="path1"></span>
                              <span class="path2"></span>
                            </i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="d-flex flex-stack">
                      <div class="me-5">
                        <label class="fs-6 fw-semibold form-label">
                          Save Card for further billing?
                        </label>
                        <div class="fs-7 fw-semibold text-muted">
                          If you need more info, please check budget planning
                        </div>
                      </div>

                      <label class="form-check form-switch form-check-custom form-check-solid">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          value="1"
                          checked="checked"
                        />
                        <span class="form-check-label fw-semibold text-muted">
                          Save Card
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="" data-kt-stepper-element="content">
                  <div class="w-100">
                    <div class="pb-8 pb-lg-10">
                      <h2 class="fw-bold text-gray-900">Your Are Done!</h2>

                      <div class="text-muted fw-semibold fs-6">
                        If you need more info, please
                        <a
                          href="authentication/layouts/corporate/sign-in.html"
                          class="link-primary fw-bold"
                        >
                          Sign In
                        </a>
                        .
                      </div>
                    </div>

                    <div class="mb-0">
                      <div class="fs-6 text-gray-600 mb-5">
                        Writing headlines for blog posts is as much an art as it
                        is a science and probably warrants its own post, but for
                        all advise is with what works for your great & amazing
                        audience.
                      </div>

                      <div class="notice d-flex bg-light-warning rounded border-warning border border-dashed p-6">
                        <i class="ki-duotone ki-information fs-2tx text-warning me-4">
                          <span class="path1"></span>
                          <span class="path2"></span>
                          <span class="path3"></span>
                        </i>

                        <div class="d-flex flex-stack flex-grow-1">
                          <div class="fw-semibold">
                            <h4 class="text-gray-900 fw-bold">
                              We need your attention!
                            </h4>
                            <div class="fs-6 text-gray-700">
                              To start using great tools, please,
                              <a
                                href="utilities/wizards/vertical.html"
                                class="fw-bold"
                              >
                                Create Team Platform
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="d-flex flex-stack pt-15">
                  <div class="mr-2">
                    {currentStep !== 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        type="button"
                        class="btn btn-lg btn-light-primary me-3"
                      >
                        <i class="ki-duotone ki-arrow-left fs-4 me-1">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                        Previous
                      </button>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      class="btn btn-lg btn-primary"
                      data-kt-stepper-action="submit"
                    >
                      <span class="indicator-label">
                        Submit
                        <i class="ki-duotone ki-arrow-right fs-4 ms-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </span>
                      <span class="indicator-progress">
                        Please wait...
                        <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    </button>
                    {currentStep !== 4 && (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        type="button"
                        class="!text-white bg-primary py-4 rounded-md px-4 hover:opacity-75"
                        data-kt-stepper-action="next"
                      >
                        <div className="flex justify-center items-center">
                          <div>Continue</div>
                          <i class="ki-duotone ki-arrow-right fs-4 ms-1">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                        </div>
                      </button>
                    )}

                    {currentStep == 4 && (
                      <button
                        onClick={createAccount}
                        type="button"
                        class="!text-white bg-primary w-24 py-4 rounded-md px-4 hover:opacity-75"
                        data-kt-stepper-action="next"
                      >
                        <div className="flex justify-center items-center">
                          {spin ? <Spin /> : <div>Submit</div>}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    //   <div class="d-flex flex-column flex-root" id="kt_app_root">
    //           {contextHolder}
    //   <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    //     <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">

    //       <div class="d-flex flex-center flex-column flex-lg-row-fluid">

    //         <div class="w-lg-500px p-10">

    //           <form class="form w-100" novalidate="novalidate" id="kt_sign_up_form" data-kt-redirect-url="authentication/layouts/corporate/sign-in.html" action="#">

    //             <div class="text-center mb-11">

    //               <h1 class="text-gray-900 fw-bolder mb-3">Sign Up</h1>

    //               <div class="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>

    //             </div>
    //             <div class="row g-3 mb-9">
    //               <div class="col-md-12">
    //                 <a href="#" class="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
    //                 <img alt="Logo" src="/media/svg/brand-logos/google-icon.svg" class="h-15px me-3" />Sign in with Google</a>
    //               </div>
    //             </div>

    //             <div class="separator separator-content my-14">
    //               <span class="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
    //             </div>

    //             <div class="fv-row mb-8">

    //               <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder="Email" name="email" autocomplete="off" class="form-control bg-transparent" />

    //             </div>

    //             <div class="fv-row mb-8" data-kt-password-meter="true">

    //               <div class="mb-1">

    //                 <div class="position-relative mb-3">
    //                   <input  onChange={(e) => setPassword(e.target.value)} value={password} class="form-control bg-transparent" type="password" placeholder="Password" name="password" autocomplete="off" />
    //                   <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2" data-kt-password-meter-control="visibility">
    //                     <i class="ki-duotone ki-eye-slash fs-2"></i>
    //                     <i class="ki-duotone ki-eye fs-2 d-none"></i>
    //                   </span>
    //                 </div>

    //                 {/* <div class="d-flex align-items-center mb-3" data-kt-password-meter-control="highlight">
    //                   <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
    //                   <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
    //                   <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
    //                   <div class="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
    //                 </div> */}

    //               </div>

    //               {/* <div class="text-muted">Use 8 or more characters with a mix of letters, numbers & symbols.</div> */}
    //             </div>

    //             <div class="fv-row mb-2">

    //               <input onChange={(e) => setRepeatPassword(e.target.value)} value={repeatPassword} placeholder="Repeat Password" name="confirm-password" type="password" autocomplete="off" class="form-control bg-transparent" />

    //             </div>

    //             {
    //               isPasswordMatched && <div class="!text-red-600 mb-10">Password didn&apos;t match</div>
    //             }

    //             {/* <div class="fv-row mb-8">
    //               <label class="form-check form-check-inline">
    //                 <input class="form-check-input" type="checkbox" name="toc" value="1" />
    //                 <span class="form-check-label fw-semibold text-gray-700 fs-base ms-1">I Accept the
    //                 <a href="#" class="ms-1 link-primary">Terms</a></span>
    //               </label>
    //             </div> */}

    //             <div class="d-grid mb-10 mt-10">
    //               <button onClick={() => createAccount()} class="!text-white bg-primary py-4 rounded-md hover:opacity-75">

    //                 <span>Sign up</span>

    //               </button>
    //             </div>

    //             <div class="text-gray-500 text-center fw-semibold fs-6">Already have an Account? {" "}
    //             <Link href="/signin">
    //                 <span className="link-primary">
    //                    Sign In
    //                  </span>
    //                  </Link></div>

    //           </form>

    //         </div>

    //       </div>

    //       <div class="w-lg-500px d-flex flex-stack px-10 mx-auto">

    //         <div class="me-10">

    //           <button class="btn btn-flex btn-link btn-color-gray-700 btn-active-color-primary rotate fs-base" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start" data-kt-menu-offset="0px, 0px">
    //             <img data-kt-element="current-lang-flag" class="w-20px h-20px rounded me-3" src="/media/flags/united-states.svg" alt="" />
    //             <span data-kt-element="current-lang-name" class="me-1">English</span>
    //             <span class="d-flex flex-center rotate-180">
    //               <i class="ki-duotone ki-down fs-5 text-muted m-0"></i>
    //             </span>
    //           </button>

    //           <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-4 fs-7" data-kt-menu="true" id="kt_auth_lang_menu">

    //             <div class="menu-item px-3">
    //               <a href="#" class="menu-link d-flex px-5" data-kt-lang="English">
    //                 <span class="symbol symbol-20px me-4">
    //                   <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/united-states.svg" alt="" />
    //                 </span>
    //                 <span data-kt-element="lang-name">English</span>
    //               </a>
    //             </div>

    //             <div class="menu-item px-3">
    //               <a href="#" class="menu-link d-flex px-5" data-kt-lang="Spanish">
    //                 <span class="symbol symbol-20px me-4">
    //                   <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/spain.svg" alt="" />
    //                 </span>
    //                 <span data-kt-element="lang-name">Spanish</span>
    //               </a>
    //             </div>

    //             <div class="menu-item px-3">
    //               <a href="#" class="menu-link d-flex px-5" data-kt-lang="German">
    //                 <span class="symbol symbol-20px me-4">
    //                   <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/germany.svg" alt="" />
    //                 </span>
    //                 <span data-kt-element="lang-name">German</span>
    //               </a>
    //             </div>

    //             <div class="menu-item px-3">
    //               <a href="#" class="menu-link d-flex px-5" data-kt-lang="Japanese">
    //                 <span class="symbol symbol-20px me-4">
    //                   <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/japan.svg" alt="" />
    //                 </span>
    //                 <span data-kt-element="lang-name">Japanese</span>
    //               </a>
    //             </div>

    //             <div class="menu-item px-3">
    //               <a href="#" class="menu-link d-flex px-5" data-kt-lang="French">
    //                 <span class="symbol symbol-20px me-4">
    //                   <img data-kt-element="lang-flag" class="rounded-1" src="/media/flags/france.svg" alt="" />
    //                 </span>
    //                 <span data-kt-element="lang-name">French</span>
    //               </a>
    //             </div>

    //           </div>

    //         </div>

    //         <div class="d-flex fw-semibold text-primary fs-base gap-5">
    //           <a href="pages/team.html" target="_blank">Terms</a>
    //           <a href="pages/pricing/column.html" target="_blank">Plans</a>
    //           <a href="pages/contact.html" target="_blank">Contact Us</a>
    //         </div>

    //       </div>

    //     </div>

    //     <div class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style={{ backgroundImage: "url(/media/misc/auth-bg.png)" }}>

    //       <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">

    //         <a href="index.html">
    //           <img alt="Logo" src="/static/img/onshift-no-bg.png" class="h-72 h-lg-120" />
    //         </a>

    //         <img class="d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20" src="/media/misc/auth-screens.png" alt="" />

    //         <h1 class="d-none d-lg-block !text-white fs-2qx fw-bolder text-center mb-7">Fast, Efficient and Productive</h1>

    //         <div class="d-none d-lg-block !text-white fs-base text-center">In this kind of post,
    //         <a href="#" class="opacity-75-hover text-warning fw-bold me-1">the blogger</a>introduces a person they’ve interviewed
    //         <br />and provides some background information about
    //         <a href="#" class="opacity-75-hover text-warning fw-bold me-1">the interviewee</a>and their
    //         <br />work following this is a transcript of the interview.</div>

    //       </div>

    //     </div>

    //   </div>
    // </div>

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
