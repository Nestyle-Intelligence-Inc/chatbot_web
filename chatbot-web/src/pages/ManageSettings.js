import React, { useState } from "react";

const ManageSettings = ({
  chatbotId,
  chatbotName,
  chatbotDescription,
  handleUpdateChatbot,
  handleDeleteChatbot,
}) => {
  const [tab, setActiveTab] = useState("general");
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const handleTabClick = (newTab) => {
    setActiveTab(newTab);
  };

  const [name, setName] = useState(chatbotName);
  const [description, setDescription] = useState(chatbotDescription);

  const handleSave = (event) => {
    event.preventDefault();
    handleUpdateChatbot(name, description);
  };

  const openDialog = () => {
    setIsDialogOpen(true); 
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const confirmDelete = () => {
    handleDeleteChatbot();
    setIsDialogOpen(false);
  };

  return (
    <div>
      <div class="mx-auto flex max-w-7xl flex-row justify-between px-4">
        <h4 class="my-6 text-3xl font-bold">Settings</h4>
      </div>
      <div className="flex flex-1 flex-col">
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
                aria-controls="radix-:r47:-content-General"
                data-state={tab === "general" ? "active" : "inactive"}
                id="radix-:r47:-trigger-General"
                className="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 text-zinc-600"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("general")}
              >
                <a class="flex flex-row gap-2 w-full justify-center">
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
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-:r47:-content-AI"
                data-state={tab === "ai" ? "active" : "inactive"}
                id="radix-:r47:-trigger-AI"
                className="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 text-zinc-600"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("ai")}
              >
                <a class="flex flex-row gap-2 w-full justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    class="h-5 w-5 shrink-0 text-zinc-600"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    ></path>
                  </svg>
                  AI
                </a>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12 hidden lg:col-span-2 sm:col-span-4 lg:block">
              <div>
                <div class="md:hidden">
                  <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                    <div class="relative flex h-6 items-center justify-end sm:hidden">
                      <div class="left-100 absolute inset-y-0 flex items-center sm:hidden">
                        <button
                          type="button"
                          id="radix-:r4g:"
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
                              data-state={
                                tab === "general" ? "active" : "inactive"
                              }
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                tab === "general"
                                  ? "bg-zinc-50 text-violet-600"
                                  : "text-zinc-700 hover:bg-zinc-50 hover:text-violet-600"
                              }`}
                              onClick={() => handleTabClick("general")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className={`h-5 w-5 shrink-0 ${
                                  tab === "general"
                                    ? "text-violet-600"
                                    : "text-zinc-400 group-hover:text-violet-600"
                                }`}
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
                          <li>
                            <a
                              data-state={tab === "ai" ? "active" : "inactive"}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                tab === "ai"
                                  ? "bg-zinc-50 text-violet-600"
                                  : "text-zinc-700 hover:bg-zinc-50 hover:text-violet-600"
                              }`}
                              onClick={() => handleTabClick("ai")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className={`h-5 w-5 shrink-0 ${
                                  tab === "ai"
                                    ? "text-violet-600"
                                    : "text-zinc-400 group-hover:text-violet-600"
                                }`}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                                ></path>
                              </svg>
                              AI
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <div class="col-span-12 lg:col-span-10">
              {tab === "general" && (
                <div class="pb-16">
                  <form id="general-form">
                    <div class="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 flex flex-col">
                      <div class="flex flex-col space-y-1.5 p-6">
                        <h3 class="text-2xl font-semibold leading-none tracking-tight">
                          General
                        </h3>
                      </div>
                      <div class="p-6 pt-0">
                        <div class="flex flex-col gap-1 mt-2 pb-6">
                          <label class="block text-sm font-medium text-zinc-700">
                            Chatbot ID
                          </label>
                          <div class="flex items-center space-x-4">
                            <div class="font-semibold">{chatbotId}</div>
                          </div>
                        </div>
                        <div class="flex flex-col gap-3 pb-4">
                          <label class="block text-sm font-medium text-zinc-700">
                            Name
                          </label>
                          <div class="space-y-2">
                            <input
                              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                              id="name"
                              aria-label="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div class="flex flex-col gap-3 pb-4">
                          <label class="block text-sm font-medium text-zinc-700">
                            Description
                          </label>
                          <div class="space-y-2">
                            <textarea
                              class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 h-10"
                              id="description"
                              aria-label="description"
                              value={description}
                              rows="4"
                              onChange={(e) => setDescription(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div class="items-center p-6 pt-0 flex justify-end">
                        <button
                          class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-10 rounded-md px-8"
                          disabled=""
                          type="button"
                          onClick={handleSave}
                        >
                          Save
                        </button>
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
                        Delete Chatbot
                      </h3>
                    </div>
                    <div class="p-6 pt-0">
                      <p>
                        Once you delete your chatbot, there is no going back.
                        Please be certain.
                      </p>
                      <p>
                        All your uploaded data will be deleted.
                        <b>&nbsp;This action is not reversible</b>
                      </p>
                    </div>
                    <div class="flex items-center p-6 pt-0 justify-end">
                      <button
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-zinc-50 dark:hover:bg-red-900/90 h-10 rounded-md px-6"
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded="false"
                        aria-controls="radix-:r52:"
                        data-state="closed"
                        onClick={openDialog}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {tab === "ai" && (
                <div className="pb-16">
                  <form id="ai-settings-form" data-gtm-form-interact-id="0">
                    <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                      <div class="flex flex-col space-y-1.5 p-6">
                        <h3 class="text-2xl font-semibold leading-none tracking-tight">
                          AI
                        </h3>
                      </div>
                      <div className="p-6 pt-0">
                        <div className="pb-8">
                          <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-4 mb-2 block font-semibold text-base text-zinc-700">
                            Model
                          </label>
                          <div className="space-y-2">
                            <div
                              type="button"
                              aria-haspopup="dialog"
                              aria-expanded="false"
                              aria-controls="radix-:r39:"
                              data-state="closed"
                            >
                              <button
                                class="inline-flex items-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 border border-zinc-200 bg-transparent shadow-sm hover:bg-zinc-100/70 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:bg-zinc-100/60 h-9 px-4 py-1 w-full justify-between rounded-md"
                                type="button"
                              >
                                <div class="flex items-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 320"
                                    fill="none"
                                    class="mr-2 h-4 w-4"
                                  >
                                    <title>OpenAI</title>
                                    <path
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="currentColor"
                                      d="M297 131a80.6 80.6 0 0 0-93.7-104.2 80.6 80.6 0 0 0-137 29A80.6 80.6 0 0 0 23 189a80.6 80.6 0 0 0 93.7 104.2 80.6 80.6 0 0 0 137-29A80.7 80.7 0 0 0 297.1 131zM176.9 299c-14 .1-27.6-4.8-38.4-13.8l1.9-1 63.7-36.9c3.3-1.8 5.3-5.3 5.2-9v-89.9l27 15.6c.3.1.4.4.5.7v74.4a60 60 0 0 1-60 60zM47.9 244a59.7 59.7 0 0 1-7.1-40.1l1.9 1.1 63.7 36.8c3.2 1.9 7.2 1.9 10.5 0l77.8-45V228c0 .3-.2.6-.4.8L129.9 266a60 60 0 0 1-82-22zM31.2 105c7-12.2 18-21.5 31.2-26.3v75.8c0 3.7 2 7.2 5.2 9l77.8 45-27 15.5a1 1 0 0 1-.9 0L53.1 187a60 60 0 0 1-22-82zm221.2 51.5-77.8-45 27-15.5a1 1 0 0 1 .9 0l64.4 37.1a60 60 0 0 1-9.3 108.2v-75.8c0-3.7-2-7.2-5.2-9zm26.8-40.4-1.9-1.1-63.7-36.8a10.4 10.4 0 0 0-10.5 0L125.4 123V92c0-.3 0-.6.3-.8L190.1 54a60 60 0 0 1 89.1 62.1zm-168.5 55.4-27-15.5a1 1 0 0 1-.4-.7V80.9a60 60 0 0 1 98.3-46.1l-1.9 1L116 72.8a10.3 10.3 0 0 0-5.2 9v89.8zm14.6-31.5 34.7-20 34.6 20v40L160 200l-34.7-20z"
                                    ></path>
                                  </svg>
                                  GPT-4o
                                </div>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke-width="1.5"
                                  stroke="currentColor"
                                  aria-hidden="true"
                                  class="ml-2 h-4 w-4 shrink-0 opacity-50"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                                  ></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div class="pt-6">
                            <div class="space-y-2">
                              <div class="space-y-1">
                                <div class="flex items-center justify-between">
                                  <label class="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block font-semibold text-base text-zinc-700">
                                    Temperature
                                  </label>
                                  <div class="flex items-center gap-2 font-semibold text-sm text-zinc-700">
                                    <label>0</label>
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
                                      class="lucide lucide-info h-4 w-4 cursor-pointer"
                                      data-state="closed"
                                    >
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M12 16v-4"></path>
                                      <path d="M12 8h.01"></path>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <input
                                    id="steps-range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 accent-zinc-700 dark:bg-zinc-700"
                                    type="range"
                                    value="0"
                                  />
                                  <div class="flex justify-between">
                                    <p class="text-xs text-zinc-700">
                                      Reserved
                                    </p>
                                    <p class="text-xs text-zinc-700">
                                      Creative
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              )}
              {isDialogOpen && (
                <div
                  role="alertdialog"
                  id="radix-:r16:"
                  aria-describedby="radix-:r18:"
                  aria-labelledby="radix-:r17:"
                  data-state="open"
                  class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-zinc-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-zinc-800 dark:bg-zinc-950"
                  tabindex="-1"
                  style={{'pointer-events': 'auto'}}
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
                        Delete chatbot
                      </h2>
                      <p
                        id="radix-:r18:"
                        class="text-sm text-zinc-500 dark:text-zinc-400 mt-2"
                      >
                        <p class="text-sm text-zinc-500">
                          Are you sure you want to delete your chatbot?
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
                      onClick={confirmDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ManageSettings;
