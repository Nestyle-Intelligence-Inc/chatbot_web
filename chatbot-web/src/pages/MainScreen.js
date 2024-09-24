import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MainScreen() {
  const accessToken = sessionStorage.getItem("accessToken");
  const isLoggedIn = Boolean(accessToken);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = () => {
    if (isLoggedIn) {
      navigate("/create/1");
    } else {
      navigate("/login", { state: { from: "/create/1" } });
    }
  };

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

  return (
    <div>
      <header className="sticky inset-x-0 top-0 z-100 h-16 bg-white">
        <nav className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between px-6">
          <div className="flex flex-1 items-center">
            <a className="pointer-events-auto inline-block" href="/">
              <div className="flex items-center gap-1 text-zinc-800">
                <span className="sr-only">Chatbase logo</span>
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
                <span class="font-normal text-lg text-zinc-950">NeTalk</span>
              </div>
            </a>
          </div>
          <div className="hidden flex-1 items-center justify-center gap-14 text-sm font-semibold leading-6 text-gray-900 lg:flex">
            <a target="_blank">Affiliates</a>
            <a target="_self">Pricing</a>
            <nav
              aria-label="Main"
              data-orientation="horizontal"
              dir="ltr"
              className="relative z-10 flex max-w-max flex-1 items-center justify-center"
            >
              <div style={{ position: "relative" }}>
                <ul
                  data-orientation="horizontal"
                  className="group flex flex-1 list-none items-center justify-center space-x-1"
                  dir="ltr"
                >
                  <li>
                    <button
                      id="radix-:r9:-trigger-radix-:ra:"
                      data-state="closed"
                      aria-expanded="false"
                      aria-controls="radix-:r9:-content-radix-:ra:"
                      class="group inline-flex w-max items-center justify-center rounded-md bg-white transition-colors hover:text-zinc-900 outline-zinc-950 focus:outline-1 focus:text-zinc-900 disabled:pointer-events-none disabled:opacity-50 dark:hover:text-zinc-50 dark:focus:text-zinc-50 group h-auto p-0 text-sm font-semibold leading-6 text-gray-900 hover:bg-transparent"
                      data-radix-collection-item=""
                    >
                      Resources
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
                        class="lucide lucide-chevron-down relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6"></path>
                      </svg>
                    </button>
                  </li>
                </ul>
              </div>
              <div className="absolute left-0 top-full flex justify-center"></div>
            </nav>
          </div>
          <div className="hidden flex-1 items-center justify-end lg:flex">
            <a
              className="text-sm font-semibold leading-6 text-zinc-900 transition-opacity animate-in fade-in"
              href={isLoggedIn ? "/dashboard/chatbots" : "/login"}
            >
              {isLoggedIn ? "Dashboard" : "Sign In"}{" "}
              <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="lg:hidden">
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:text-zinc-600 h-9 w-9 pointer-events-auto"
              onClick={handleDialogToggle}
            >
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
          </div>
        </nav>
        <span
          aria-hidden="true"
          className="block h-[1px] w-full scale-x-0 bg-zinc-200 opacity-0 transition-all duration-300 ease-in-out"
        ></span>
      </header>
      <div className="relative  flex min-h-[86.1vh] flex-col justify-between overflow-x-clip scroll-smooth md:overflow-y-visible">
        <main className="isolate flex flex-col gap-40">
          <section className="mx-auto flex w-full max-w-screen-xl px-4 my-14 sm:mt-28 sm:h-[38rem]">
            <div className="flex-[4]">
              <div className="flex flex-col gap-8">
                <h1 className="col-start-1 row-start-2  max-w-[36rem] text-start text-6xl font-extrabold  tracking-tight text-zinc-900 md:text-left md:text-[4.5rem] md:leading-[4.5rem] lg:text-8xl xl:max-w-[43.5rem] xl:text-8xl ">
                  Custom ChatGPT for your website
                </h1>
                <p className="col-start-1 row-start-3 max-w-xl  text-start text-zinc-900 md:text-left md:text-lg md:leading-6  md:tracking-normal ">
                  Build a custom GPT, embed it on your website and let it handle
                  customer support, lead generation, engage with your users, and
                  more.
                </p>
                <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-6">
                  <div className="flex w-fit flex-col place-items-center items-center justify-center">
                    <button
                      className="group/cta flex flex-row gap-3 rounded-xl bg-black px-5 py-2 text-base font-semibold leading-8 text-white shadow-sm transition-all duration-700 ease-in-out hover:animate-gradient hover:shadow-sm hover:saturate-150 focus-visible:animate-gradient focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      onClick={handleCreate}
                    >
                      Build your Chatbot &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <div className="hidden flex-[3] justify-center sm:flex">
            <img src={require("../main_background.png")} alt="" />
          </div> */}
        </main>
      </div>

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
            href={isLoggedIn ? "/dashboard/chatbots" : "/login"}
          >
            {isLoggedIn ? "Dashboard" : "Sign In"}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
    </div>
  );
}

export default MainScreen;
