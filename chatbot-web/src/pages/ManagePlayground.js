import React, {useState} from "react";

const ManagePlayground = ({ conversationId, messages, onSubmit, handleReset }) => {
  const [inputValue, setInputValue] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      setInputValue(''); 
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex w-full flex-1 justify-center pb-4">
        <div className="flex w-full flex-col items-center px-4 md:max-w-5xl">
          <div className="my-6 flex w-full justify-between">
            <div className="flex items-end">
              <h4 className="font-bold text-3xl">Playground</h4>
            </div>
          </div>

          <div className="flex h-full w-full justify-center">
            <div className="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 flex w-full flex-col overflow-y-hidden">
              <div className="flex min-h-[700px] w-full flex-1 p-0 md:basis-1">
                <div className="flex w-full flex-1 gap-2">
                  <div className="relative flex w-full flex-row justify-between bg-zinc-50">
                    <div className="min-h-[500px] w-full md:min-h-0">
                      <div className="relative flex h-full w-full items-center justify-center bg-dot-black/[0.2] bg-zinc-50 px-2 py-2 dark:bg-black dark:bg-dot-white/[0.5] lg:px-14 md:px-5 md:py-5">
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text sm:max-h-[824px]">
                          <div className="top-4 left-6 w-full md:absolute md:w-auto"></div>
                          <div className="z-20 h-[80vh] w-full md:h-full md:max-w-md">
                            <div className="flex h-full w-full flex-col">
                              <div className="flex h-full w-full flex-col">
                                <div className="h-full w-full overflow-hidden rounded-lg border-[1px]">
                                <main className="group relative flex h-full flex-col bg-white data-[theme=dark]:bg-black">
                                  <header
                                    className="relative flex items-center justify-between px-5 text-black"
                                    style={{
                                      background:
                                        "linear-gradient(0deg, rgba(0, 0, 0, 0.02) 0.44%, rgba(0, 0, 0, 0) 49.5%), rgb(255, 255, 255)",
                                    }}
                                  >
                                    <div className="my-4 flex h-10 items-center">
                                      <div className="flex flex-col justify-center gap-px">
                                        <h1 className="font-semibold text-sm">
                                          {conversationId}
                                        </h1>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus:visible:ring-ring disabled:pointer-events-none disabled:opacity-80 underline-offset-4 hover:underline dark:text-zinc-50 h-7 w-7 p-0 text-inherit opacity-70 hover:opacity-85"
                                      onClick={handleReset}>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-refresh-cw h-full w-full p-1 transition-transform duration-700 ease-in-out hover:rotate-180"
                                        >
                                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                          <path d="M21 3v5h-5"></path>
                                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                          <path d="M8 16H3v5"></path>
                                        </svg>
                                      </button>
                                    </div>
                                  </header>

                                  <div className="relative flex flex-1 basis-full flex-col overflow-y-hidden scroll-smooth shadow-inner">
                                    <div className="flex w-full flex-1 flex-col space-y-5 overflow-y-auto px-5 pt-5 pb-4 sm:overscroll-contain">
                                      {messages.map((message, index) => (
                                        <div
                                          key={index}
                                          className={`flex w-full items-end ${
                                            message.user
                                              ? "justify-end pr-8"
                                              : ""
                                          }`}
                                        >
                                          <div
                                            className={`group/message relative max-w-[min(calc(100%-40px),65ch)] ${
                                              message.user ? "ml-auto" : ""
                                            }`}
                                          >
                                            <div
                                              className={`hyphens-auto break-words text-left text-sm leading-5 antialiased relative inline-block max-w-full rounded-[20px] px-5 py-4 ${
                                                message.user
                                                  ? "bg-black text-white rounded-br"
                                                  : "bg-zinc-200/50 text-zinc-800/80 rounded-bl"
                                              } group-data-[theme=dark]:${
                                                message.user
                                                  ? "bg-zinc-800/80 text-zinc-300"
                                                  : "bg-zinc-800/80 text-zinc-300"
                                              }`}
                                            >
                                              <p className="prose-zinc prose group-data-[theme=dark]:prose-invert w-full text-sm">
                                              {message.user || message.bot}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 flex-col justify-end">
                                    <form>
                                      <div className="flex min-h-16 items-end border-zinc-200 border-t group-data-[theme=dark]:border-zinc-800">
                                        <textarea
                                          className="flex w-full border-zinc-200 bg-white text-sm ring-offset-white disabled:cursor-not-allowed sm:overscroll-contain dark:border-zinc-800 dark:bg-zinc-950 dark:placeholder:text-zinc-400 placeholder:text-zinc-500 disabled:opacity-50 focus-visible:outline-none dark:focus-visible:ring-zinc-300 focus-visible:ring-violet-500 dark:ring-offset-zinc-950 my-auto max-h-40 min-h-8 resize-none rounded-none border-0 placeholder-zinc-400 group-data-[mobile=true]:text-[16px] sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-auto overflow-y-auto p-3 group-data-[theme=dark]:bg-black group-data-[theme=dark]:text-white flex-1"
                                          placeholder="Message..."
                                          value={inputValue}
                                          onChange={(e) => setInputValue(e.target.value)}
                                        ></textarea>
                                        <button
                                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 w-9 my-3 mr-2 size-5 bg-transparent shadow-none group-data-[theme=dark]:hover:bg-zinc-800/90 hover:bg-zinc-100/90"
                                          type="submit" onClick={handleSubmit}
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 20"
                                            className="size-5 text-zinc-700 group-data-[theme=dark]:text-white"
                                          >
                                            <title>Paper Plane</title>
                                            <path
                                              fill="currentColor"
                                              d="M15.44 1.68c.69-.05 1.47.08 2.13.74.66.67.8 1.45.75 2.14-.03.47-.15 1-.25 1.4l-.09.35a43.7 43.7 0 0 1-3.83 10.67A2.52 2.52 0 0 1 9.7 17l-1.65-3.03a.83.83 0 0 1 .14-1l3.1-3.1a.83.83 0 1 0-1.18-1.17l-3.1 3.1a.83.83 0 0 1-.99.14L2.98 10.3a2.52 2.52 0 0 1 .04-4.45 43.7 43.7 0 0 1 11.02-3.9c.4-.1.92-.23 1.4-.26Z"
                                            ></path>
                                          </svg>
                                        </button>
                                      </div>
                                    </form>
                                  </div>

                                  <footer className="flex min-h-10 w-full max-w-full shrink-0 items-center justify-center gap-2 overflow-hidden text-nowrap bg-zinc-50 px-4 py-2 text-xs text-zinc-500 group-data-[theme=dark]:bg-zinc-900/90 group-data-[theme=dark]:text-zinc-400">
                                    <p className="flex items-center justify-center shrink-0">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 16 17"
                                        fill="none"
                                        className="size-4  group-data-[theme=dark]:opacity-60"
                                      >
                                        <title>Chatbase</title>
                                        <path
                                          fill="#A1A1AA"
                                          d="M16.5 3.803V12.2a3.8 3.8 0 0 1-3.8 3.8H4.299A3.8 3.8 0 0 1 .5 12.201v-8.4A3.803 3.803 0 0 1 4.302 0h8.395c2.1 0 3.803 1.703 3.803 3.803Z"
                                        ></path>
                                        <path
                                          fill="#FAFAFA"
                                          d="M12.866 9.296c-.086 1.145-.793 2.202-1.765 2.811a4.34 4.34 0 0 1-1.148.5l-.203-2.353c.31-.23.533-.59.555-.975l2.562.017h-.001Zm.008-2.468H10.31c.007-.424-.217-.837-.555-1.094-.338-.258-.778-.363-1.2-.331a1.898 1.898 0 0 0-.54.12L6.727 3.587c.765-.321 1.63-.426 2.462-.345.855.082 1.71.357 2.37.905.788.653 1.24 1.66 1.313 2.681l.002.001Z"
                                        ></path>
                                        <path
                                          fill="#FAFAFA"
                                          d="M9.957 12.607a5.035 5.035 0 0 1-2.168.095c-.824-.142-1.626-.483-2.243-1.049C4.032 10.261 3.804 7.72 4.532 5.88a4.17 4.17 0 0 1 1.186-1.683 3.944 3.944 0 0 1 1.009-.608l1.288 1.938a1.771 1.771 0 0 0-.452.256c-.651.517-.811 1.44-.803 2.273.007.8.173 1.687.811 2.171a1.83 1.83 0 0 0 1.009.35c.399.023.812-.068 1.14-.297l"
                                        ></path>
                                      </svg>
                                      Powered by Nestyle.ai
                                    </p>
                                  </footer>
                                </main>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePlayground;
