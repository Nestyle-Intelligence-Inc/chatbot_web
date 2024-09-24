import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useToast } from "../components/ToastContext";
import axiosInstance from "../components/axiosInstance";

function DashboardScreen() {
  // 로그인 여부 불러오기
  const accessToken = sessionStorage.getItem("accessToken");
  const isLoggedIn = Boolean(accessToken);
  const location = useLocation();
  const [chatbots, setChatbots] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDialogToggle = () => {
    if (isDialogOpen) {
      closeDialog();
    } else {
      openDialog();
    }
  };

  const handleResourceButton = () => {
    window.location.href =
      `${process.env.REACT_APP_API_URL}/docs#/default/create_chatbot_endpoint_chatbots_post`;
  };

  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    axiosInstance
      .get("/users/me")
      .then((response) => {
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
    if (path === "/dashboard/chatbots") {
      axiosInstance
        .get("/chatbots/")
        .then((response) => {
          setChatbots(response.data);
        })
        .catch((error) => {
          console.error("API 호출 오류:", error);
        });
    }
  }, [location.pathname]);

  const handleNewButtonClick = () => {
    navigate("/create");
  };

  const handleSignOut = () => {
    axiosInstance
      .post("/users/logout")
      .then((response) => {
        console.log(response);
        showToast("로그아웃 되었습니다.", "success");
        navigate("/");
        sessionStorage.clear();
        localStorage.clear();
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete("/users/delete-account", {
        data: { confirmation: 'DELETE MY ACCOUNT' },
      });

      console.log(response.data);
      sessionStorage.clear();
      localStorage.clear();
      showToast("회원탈퇴가 완료되었습니다.", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <div className="mb-20 flex min-h-screen flex-col">
      <nav className="relative flex flex-row items-center justify-between bg-white px-2 py-2 md:px-6 md:pb-0">
        <nav aria-label="Breadcrumb" class="flex items-center">
          <ol
            class="break-words text-zinc-500 sm:gap-2.5 dark:text-zinc-500 flex flex-wrap items-center gap-2 p-2 md:pb-0 text-sm font-medium leading-6"
            role="list"
          >
            <li class="flex items-center">
              <a class="pointer-events-auto inline-block" href="/">
                <div class="flex items-center gap-1 text-zinc-800">
                  <span class="sr-only">Chatbase logo</span>
                  <svg
                    width="256"
                    height="256"
                    viewBox="0 0 256 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-7 w-7"
                  >
                    <rect width="256" height="256" rx="60" fill="black"></rect>
                    <title>Chatbase Logo Icon</title>
                    <path
                      d="M197.9 149.8C196.972 158.975 193.935 167.811 189.025 175.618C184.116 183.424 177.468 189.989 169.6 194.8C163.9 198.3 157.7 201 151.3 202.8L148 165C153 161.4 156.5 155.6 156.9 149.4L197.9 149.7V149.8Z"
                      fill="white"
                    ></path>
                    <path
                      d="M198 110.3H156.9C157 103.5 153.4 96.9 148 92.8C142.454 88.7651 135.631 86.8817 128.8 87.5C125.8 87.8 122.9 88.5 120.2 89.5L99.6 58.5C111.8 53.3 125.6 51.7 139 52.9C152.793 53.8615 165.987 58.9094 176.9 67.4C183.096 72.8004 188.147 79.3881 191.754 86.7737C195.361 94.1593 197.451 102.193 197.9 110.4L198 110.3Z"
                      fill="white"
                    ></path>
                    <path
                      d="M151.3 202.8C139.98 205.816 128.138 206.328 116.6 204.3C103.243 202.25 90.7508 196.421 80.6 187.5C56.5 165.2 52.8 124.5 64.4 95.1C67.4053 86.8939 72.0747 79.3977 78.115 73.0821C84.1552 66.7665 91.4359 61.7679 99.5 58.4L120.2 89.4C117.6 90.4 115.2 91.8 112.9 93.6C102.5 101.8 99.9 116.6 100.1 129.9C100.2 142.7 102.9 156.9 113.1 164.7C117.796 168.116 123.398 170.064 129.2 170.3C135.6 170.6 142.2 169.2 147.5 165.5L148 165.1L151.3 202.8Z"
                      fill="#B2AEB9"
                    ></path>
                  </svg>
                </div>
              </a>
            </li>
            <li
              role="presentation"
              aria-hidden="true"
              class="[&amp;>svg]:size-3.5"
            ></li>
          </ol>
        </nav>
        <div className="flex flex-row items-center justify-center gap-1">
          <button className="whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:text-zinc-600 h-9 w-9 pointer-events-auto flex items-center justify-center text-zinc-700 lg:hidden"
          onClick={handleDialogToggle}>
            {isDialogOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line
                    x1="4"
                    x2="20"
                    y1="8"
                    y2="8"
                    class="origin-top-left transition-transform duration-300 translate-x-2 translate-y-[-2px] rotate-45"
                  ></line>
                  <line
                    x1="4"
                    x2="20"
                    y1="16"
                    y2="16"
                    class="origin-bottom-left transition-transform duration-300 ease-in-out translate-x-2 translate-y-[2px] -rotate-45"
                  ></line>
                </svg>
              )}
              {!isDialogOpen && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line
                    x1="4"
                    x2="20"
                    y1="8"
                    y2="8"
                    class="origin-top-left transition-transform duration-300"
                  ></line>
                  <line
                    x1="4"
                    x2="20"
                    y1="16"
                    y2="16"
                    class="origin-bottom-left transition-transform duration-300 ease-in-out"
                  ></line>
                </svg>
              )}
          </button>
          <span
            className="relative shrink-0 rounded-full hidden h-9 w-9 items-center justify-center overflow-hidden border border-zinc-300 bg-zinc-50/50 text-sm font-medium hover:cursor-pointer lg:flex"
            type="button"
            id="radix-:r0:"
            aria-haspopup="menu"
            aria-expanded={isDropdownOpen ? "true" : "false"}
            data-state={isDropdownOpen ? "open" : "closed"}
            onClick={toggleDropdown}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-user mt-2 h-7 w-7 stroke-1 text-zinc-500"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          {isDropdownOpen && (
            <div
              data-radix-popper-content-wrapper=""
              dir="ltr"
              style={{
                position: "fixed",
                left: "0px",
                top: "0px",
                transform: "translate(975px, 52px)",
                "min-width": "max-content",
                "--radix-popper-transform-origin": "100% 0px",
                "will-change": "transform",
                "z-index": "50",
                "--radix-popper-available-width": "1143px",
                "--radix-popper-available-height": "851px",
                "--radix-popper-anchor-width": "36px",
                "--radix-popper-anchor-height": "36px",
              }}
            >
              <div
                data-side="bottom"
                data-align="end"
                role="menu"
                aria-orientation="vertical"
                data-state="open"
                data-radix-menu-content=""
                dir="ltr"
                id="radix-:rj:"
                aria-labelledby="radix-:ri:"
                class="z-50 min-w-[8rem] overflow-hidden border border-zinc-200 bg-white text-zinc-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col gap-1 rounded-xl p-3"
                tabindex="-1"
                data-orientation="vertical"
                style={{
                  outline: "none",
                  "--radix-dropdown-menu-content-transform-origin":
                    "var(--radix-popper-transform-origin)",
                  "--radix-dropdown-menu-content-available-width":
                    "var(--radix-popper-available-width)",
                  "--radix-dropdown-menu-content-available-height":
                    "var(--radix-popper-available-height)",
                  "--radix-dropdown-menu-trigger-width":
                    "var(--radix-popper-anchor-width)",
                  "--radix-dropdown-menu-trigger-height":
                    "var(--radix-popper-anchor-height)",
                  "pointer-events": "auto",
                }}
              >
                <div class="flex flex-col">
                  <div class="px-2 font-semibold py-0 text-xs text-zinc-500">
                    {email}
                  </div>
                </div>
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  class="-mx-1 my-1 h-px dark:bg-zinc-800 bg-zinc-200/85"
                ></div>
                <div class="flex flex-col gap-1">
                  <a class="contents" href="/dashboard/chatbots">
                    <div
                      role="menuitem"
                      class="relative flex select-none items-center px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 cursor-pointer rounded-xl text-zinc-500 transition-colors ease-in-out hover:text-zinc-950"
                      tabindex="-1"
                      data-orientation="vertical"
                      data-radix-collection-item=""
                    >
                      Dashboard
                    </div>
                  </a>
                  <a class="contents" href="/dashboard/settings">
                    <div
                      role="menuitem"
                      class="relative flex select-none items-center px-2 py-1.5 text-sm outline-none focus:bg-zinc-100 focus:text-zinc-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-zinc-800 dark:focus:text-zinc-50 cursor-pointer rounded-xl text-zinc-500 transition-colors ease-in-out hover:text-zinc-950"
                      tabindex="-1"
                      data-orientation="vertical"
                      data-radix-collection-item=""
                    >
                      Account Settings
                    </div>
                  </a>
                </div>
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  class="-mx-1 my-1 h-px dark:bg-zinc-800 bg-zinc-200/85"
                ></div>
                <form
                  action="javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')"
                  class="contents"
                >
                  <button
                    className="inline-flex items-center whitespace-nowrap text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:text-zinc-600 h-9 w-full cursor-pointer justify-start rounded-xl p-2 font-normal text-zinc-500 transition-colors ease-in-out hover:text-zinc-950"
                    type="button"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="flex flex-1 flex-col">
        <nav className="no-scrollbar flex flex-row items-center justify-start gap-7 overflow-auto overflow-y-hidden whitespace-nowrap border-b p-1 font-medium lg:justify-center">
          <Link
            className={`relative col-span-1 items-center p-1 text-sm font-medium ${
              location.pathname === "/dashboard/chatbots"
                ? "text-zinc-800"
                : "text-zinc-500"
            }`}
            to="/dashboard/chatbots"
          >
            Chatbots
            <div
              className={`absolute -left-0 top-[1.89rem] h-[0.15rem] w-full rounded-3xl transition-all ease-in-out ${
                location.pathname === "/dashboard/chatbots"
                  ? "bg-violet-500"
                  : ""
              }`}
            ></div>
          </Link>
          <Link
            className={`relative col-span-1 items-center p-1 text-sm font-medium ${
              location.pathname === "/dashboard/settings"
                ? "text-zinc-800"
                : "text-zinc-500"
            }`}
            to="/dashboard/settings"
          >
            Settings
            <div
              className={`absolute -left-0 top-[1.89rem] h-[0.15rem] w-full rounded-3xl transition-all ease-in-out ${
                location.pathname === "/dashboard/settings"
                  ? "bg-violet-500"
                  : ""
              }`}
            ></div>
          </Link>
        </nav>
        <Routes>
          <Route
            path="chatbots"
            element={
              <Chatbots
                chatbotList={chatbots}
                handleNewButtonClick={handleNewButtonClick}
              />
            }
          />
          <Route
            path="settings"
            element={
              <Settings
                email={email}
                handleConfirmDelete={handleConfirmDelete}
              />
            }
          />
        </Routes>
      </main>
      {isDialogOpen && (
        <div
          role="dialog"
          id="radix-:R26bt3ta:"
          aria-describedby="radix-:R26bt3taH2:"
          aria-labelledby="radix-:R26bt3taH1:"
          data-state="open"
          className="fixed z-50 bg-white p-6 shadow-lg transition-all ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-500 data-[state=open]:duration-500 dark:bg-zinc-950 inset-x-0 top-16 border-b data-[state=closed]:slide-out-to-top-16 h-full data-[state=open]:slide-in-from-top-16 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex min-w-full flex-col items-start justify-start gap-2"
          tabindex="-1"
          style={{ "pointer-events": "auto" }}
        >
          <a
            target="_blank"
            className="flex w-full flex-row gap-3 rounded-md  p-2 text-start text-base  font-semibold  outline-0 transition-all duration-75 ease-in-out hover:bg-zinc-100 hover:text-violet-700"
            type="button"
          >
            Affiliates
          </a>
          <a
            className="flex w-full flex-row gap-3  rounded-md  p-2 text-start text-base  font-semibold  outline-0 transition-all duration-75 ease-in-out hover:bg-zinc-100 hover:text-violet-700"
            type="button"
          >
            Pricing
          </a>
          <div className="w-full" data-orientation="vertical">
            <div
              data-state="closed"
              data-orientation="vertical"
              className="border-b border-none p-0"
            >
              <h3
                data-orientation="vertical"
                data-state="closed"
                className="flex"
              >
                <button
                  type="button"
                  aria-controls="radix-:r6:"
                  aria-expanded="false"
                  data-state="closed"
                  data-orientation="vertical"
                  id="radix-:r5:"
                  className="group/accordion flex flex-1 items-center justify-between text-sm font-medium outline-none ring-0 transition-all duration-300 ease-in-out focus:outline-none focus:ring-0 [&amp;[data-state=open]>svg]:opacity-100 p-0"
                  data-radix-collection-item=""
                  onClick={handleResourceButton}
                >
                  <div className="flex w-full flex-row items-center justify-between gap-3 rounded-md p-2 text-start text-base  font-semibold  outline-0 transition-all duration-75 ease-in-out hover:bg-zinc-100 hover:text-violet-700">
                    <span>Resources</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-arrow-right hidden h-5 w-5 shrink-0 text-zinc-900 opacity-0 transition-all duration-300 ease-in-out group-hover/accordion:translate-x-1 group-hover/accordion:opacity-100 lg:block dark:text-zinc-900 dark:group-hover/accordion:text-zinc-900 [&amp;[data-state=open]>svg]:translate-x-2 [&amp;[data-state=open]>svg]:opacity-100"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </h3>
              <div
                data-state="closed"
                id="radix-:r6:"
                hidden=""
                role="region"
                aria-labelledby="radix-:r5:"
                data-orientation="vertical"
                className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
                style={{
                  "--radix-accordion-content-height":
                    "var(--radix-collapsible-content-height)",
                  "--radix-accordion-content-width":
                    "var(--radix-collapsible-content-width)",
                }}
              ></div>
            </div>
          </div>
          <a
            className="flex w-full flex-row gap-3 rounded-md p-2 text-start text-base font-semibold outline-0 transition-all duration-75 ease-in-out hover:bg-zinc-100 hover:text-violet-700 mt-2 border-t"
            type="button"
            href={isLoggedIn ? "/dashboard" : "/login"}
          >
            {isLoggedIn ? "Dashboard" : "Sign In"}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </div>
  );
}

const Chatbots = ({ chatbotList, handleNewButtonClick }) => (
  <div className="py-8">
    <div className="mx-auto max-w-3xl px-3 pb-12">
      <div>
        {chatbotList.length === 0 ? (
          <div className="mx-auto max-w-3xl px-3 pb-12">
            <div className="flex w-full items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black md:text-3xl">
                  Chatbots
                </h1>
              </div>
            </div>
            <div>
              <div className="py-16">
                <div className="flex justify-center">
                  <a
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1"
                    href="/create/1"
                  >
                    New Chatbot
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex w-full items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-black md:text-3xl">
                  Chatbots
                </h1>
              </div>
              <div className="flex justify-center">
                <a
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1 cursor-pointer"
                  onClick={handleNewButtonClick}
                >
                  New
                </a>
              </div>
            </div>
            <div className="m-auto my-8 grid w-full max-w-3xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
              {chatbotList.map((chatbot) => (
                <div className="flex items-center justify-center">
                  <a href={`/manage/${chatbot.id}/playground`}>
                    <div className="relative flex w-40 flex-col justify-between overflow-hidden rounded border">
                      <div className="flex h-14 items-center justify-center px-1">
                        <h3 className="m-auto overflow-hidden text-center text-xs font-semibold md:text-sm">
                          {chatbot.name}
                        </h3>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Settings = ({ email, handleConfirmDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteAccount = () => {
    setIsDialogOpen(false);
    handleDeleteAccount();
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div className="mx-auto flex w-full max-w-7xl flex-row px-4">
        <h4 className="my-8 font-bold text-3xl">Settings</h4>
      </div>
      <div className="w-full max-w-7xl px-4 lg:mx-auto">
        <div
          dir="ltr"
          data-orientation="horizontal"
          class="flex rounded-full font-semibold leading-6 lg:hidden"
        >
          <div
            role="tablist"
            aria-orientation="horizontal"
            class="bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 mb-8 flex h-auto w-full items-start justify-start gap-2 overflow-x-auto rounded-full px-3 py-2 data-[state=active]:shadow-sm"
            tabindex="0"
            data-orientation="horizontal"
            style={{ outline: "none" }}
          >
            <button
              type="button"
              role="tab"
              aria-selected="false"
              aria-controls="radix-:r1o:-content-General"
              data-state="inactive"
              id="radix-:r1o:-trigger-General"
              class="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 bg-white text-zinc-900"
              tabindex="-1"
              data-orientation="horizontal"
              data-radix-collection-item=""
            >
              <a
                class="flex flex-row gap-2 w-full justify-center"
                href="./general"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  class="h-5 w-5 shrink-0 text-zinc-900"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                General
              </a>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div class="col-span-12 hidden lg:col-span-2 sm:col-span-4 lg:block">
            <div>
              <div class="md:hidden">
                <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                  <div class="relative flex h-6 items-center justify-end sm:hidden">
                    <div class="left-100 absolute inset-y-0 flex items-center sm:hidden">
                      <button
                        type="button"
                        id="radix-:r1t:"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        data-state="closed"
                        class="inline-flex items-center justify-center rounded-md p-2 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      >
                        <span class="sr-only">Open main menu</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="lucide lucide-menu block h-6 w-6"
                          aria-hidden="true"
                        >
                          <line x1="4" x2="20" y1="12" y2="12"></line>
                          <line x1="4" x2="20" y1="6" y2="6"></line>
                          <line x1="4" x2="20" y1="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="hidden grow flex-col gap-y-5 overflow-y-auto border-zinc-200  bg-white sm:flex ">
                <nav class="flex flex-1 flex-col">
                  <ul role="list" class="flex flex-1 flex-col">
                    <li>
                      <ul class="space-y-1">
                        <li>
                          <a
                            class="bg-zinc-50 text-violet-600 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                            href="./general"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              class="text-violet-600 h-5 w-5 shrink-0"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                              ></path>
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              ></path>
                            </svg>
                            General
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-10">
            <div className="pb-16">
              <form id="general-account-form">
                <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">
                      General
                    </h3>
                  </div>
                  <div className="p-6 pt-0 flex flex-col gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Email
                      </label>
                      <input
                        class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="This is your email"
                        id="user-email"
                        aria-label="example.com"
                        value={email}
                      ></input>
                    </div>
                  </div>
                </div>
              </form>
              <div class="relative my-10">
                <div class="absolute inset-0 flex items-center">
                  <span class="w-full border-t"></span>
                </div>
                <div class="relative flex justify-center text-xs uppercase">
                  <span class="bg-white px-2 font-bold text-red-400">
                    Danger Zone
                  </span>
                </div>
              </div>
              <div class="rounded-lg border bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 border-red-200">
                <div class="flex flex-col space-y-1.5 p-6">
                  <h3 class="text-2xl font-semibold leading-none tracking-tight text-red-500">
                    Delete Account
                  </h3>
                </div>
                <div class="p-6 pt-0">
                  <p>
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <p>
                    All your uploaded data and trained chatbots will be deleted.
                    <b>&nbsp;This action is not reversible</b>
                  </p>
                </div>
                <div class="flex items-center p-6 pt-0 justify-end">
                  <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90 h-10 rounded-md px-4"
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded="false"
                    aria-controls="radix-:r21:"
                    data-state="closed"
                    onClick={openDialog}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isDialogOpen && (
        <div
          role="alertdialog"
          id="radix-:r16:"
          aria-describedby="radix-:r18:"
          aria-labelledby="radix-:r17:"
          data-state="open"
          class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-zinc-800 dark:bg-zinc-950"
          tabindex="-1"
          style={{ "pointer-events": "auto" }}
        >
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-triangle-alert h-6 w-6 text-red-600"
                aria-hidden="true"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
                <path d="M12 9v4"></path>
                <path d="M12 17h.01"></path>
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h2
                id="radix-:r17:"
                class="text-lg font-medium leading-6 text-zinc-900"
              >
                Delete Account
              </h2>
              <p
                id="radix-:r18:"
                class="text-sm text-zinc-500 dark:text-zinc-400 mt-2"
              >
                <p class="text-sm text-zinc-500">
                  Are you sure you want to delete your account?
                  <br />
                  <b>This action cannot be undone.</b>
                </p>
              </p>
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100/70 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 rounded-xl disabled:bg-zinc-100/60 h-9 px-4 py-1"
              type="button"
              onClick={closeDialog}
            >
              Cancel
            </button>
            <button
              class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90 h-9 px-4 py-1"
              type="button"
              onClick={handleConfirmDelete}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardScreen;
