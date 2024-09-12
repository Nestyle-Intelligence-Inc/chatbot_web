import React, { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";

function Create1Screen() {
  const navigate = useNavigate();
  const showToast = useToast();
  const accessToken = sessionStorage.getItem("accessToken");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const isLoggedIn = Boolean(accessToken);
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
      "http://34.168.31.3/docs#/default/create_chatbot_endpoint_chatbots_post";
  };
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [email, setEmail] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/users/me")
      .then((response) => {
        setEmail(response.data.email);
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const isButtonDisabled = () => {
    return name.trim() === "" || role.trim() === "";
  };

  const handleCreateIdButtonClick = async () => {
    setLoading(true);
    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("description", role.trim());
    try {
      const response = await axiosInstance.post(
        "/chatbots/create_chatbot",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      navigate("/create/2", {
        state: {
          id: response.data.id,
          name: name.trim(),
          description: role.trim(),
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="CreateScreen">
      <nav class="relative flex flex-row items-center justify-between bg-white px-2 py-2 md:px-6 md:pb-0">
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
        <div class="flex flex-row items-center justify-center gap-1">
          <button class="whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:text-zinc-600 h-9 w-9 pointer-events-auto flex items-center justify-center text-zinc-700 lg:hidden"
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
            class="relative shrink-0 rounded-full hidden h-9 w-9 items-center justify-center overflow-hidden border border-zinc-300 bg-zinc-50/50 text-sm font-medium hover:cursor-pointer lg:flex"
            type="button"
            id="radix-:r0:"
            aria-haspopup="menu"
            aria-expanded="false"
            data-state="closed"
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
        </div>
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
      </nav>
      <main className="flex flex-1 flex-col">
        <div className="border-t py-8">
          <h1 className="mb-2 text-center text-3xl font-bold">
            Create A Chatbot
          </h1>
          <p className="text-center text-zinc-500">
            챗봇의 이름과 역할을 적어주세요
          </p>
        </div>

        <div className="w-full max-w-7xl px-4 lg:mx-auto">
          <div className="col-span-12 log:col-span-10">
            <div className="pb-16">
              <form id="general-chatbot-form">
                <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                  <div className="flex flex-col space-y-1.5 p-6">
                    <h3 class="text-2xl font-semibold leading-none tracking-tight">
                      General
                    </h3>
                  </div>
                  <div className="p-6 pt-0 flex flex-col gap-4">
                    <div class="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for=":r1h:-form-item"
                      >
                        Name
                      </label>
                      <input
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="team name"
                        placeholder="예: 아이작 상담 챗봇"
                        value={name}
                        onChange={handleNameChange}
                      />
                    </div>
                    <div class="space-y-2">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        for=":r1h:-form-item"
                      >
                        Description
                      </label>
                      <textarea
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="team name"
                        placeholder="해외여행시 사용되는 이심/유심 관련된 고객의 질문에만 답변을 함"
                        value={role}
                        rows="3"
                        onChange={handleRoleChange}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1 mt-4 w-full"
            onClick={handleCreateIdButtonClick}
            disabled={isButtonDisabled()}
          >
            Next
          </button>
        </div>
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

export default Create1Screen;
