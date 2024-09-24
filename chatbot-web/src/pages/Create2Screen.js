import React, { useState, useEffect } from "react";
import axiosInstance from "../components/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useToast } from "../components/ToastContext";

function Create2Screen() {
  const navigate = useNavigate();
  const accessToken = sessionStorage.getItem("accessToken");
  const isLoggedIn = Boolean(accessToken);
  const showToast = useToast();
  const location = useLocation();
  const { id, name, description } = location.state || {};
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
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

  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [links, setLinks] = useState([]);
  const [qnaSections, setQnaSections] = useState([]);

  const [totalSize, setTotalSize] = useState(0);

  const [tab, setActiveTab] = useState("files");

  const handleTabClick = (newTab) => {
    setActiveTab(newTab);
  };

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

  useEffect(() => {
    if (files.length === 0 && text === "" && links.length === 0 && qnaSections.length === 0) {
      const savedFiles = JSON.parse(sessionStorage.getItem("files")) || [];
      const savedText = sessionStorage.getItem("text") || "";
      const savedLinks = JSON.parse(sessionStorage.getItem("links")) || [];
      const savedQnaSections = JSON.parse(sessionStorage.getItem("qnaSections")) || [];
  
      setFiles(savedFiles);
      setText(savedText);
      setLinks(savedLinks);
      setQnaSections(savedQnaSections);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("files", JSON.stringify(files));
    sessionStorage.setItem("text", text);
    sessionStorage.setItem("links", JSON.stringify(links));
    sessionStorage.setItem("qnaSections", JSON.stringify(qnaSections));

    const fileSize = files.reduce((acc, file) => acc + file.size, 0);
    const textSize = text.length;
    const linksSize = links.length;
    const qnaSize = qnaSections.length;

    setTotalSize(fileSize + textSize + linksSize + qnaSize);
  }, [files, text, links, qnaSections]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const fileDetails = selectedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      file
    }));

    setFiles((prevFiles) => [...prevFiles, ...fileDetails]);
  };

  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleAddLink = (newLink) => {
    setLinks((prevLinks) => [...prevLinks, newLink]);
  };

  const handleRemoveLink = (index) => {
    setLinks((prevLinks) => prevLinks.filter((_, i) => i !== index));
  };

  const handleLinkChange = (index, updatedLink) => {
    setLinks((prevLinks) =>
      prevLinks.map((link, i) => (i === index ? updatedLink : link))
    );
  };

  const handleAddSection = () => {
    setQnaSections((prevSections) => [
      ...prevSections,
      {
        id: Date.now(),
        question: "",
        answer: "",
      },
    ]);
  };

  const handleRemoveSection = (id) => {
    setQnaSections((prevSections) =>
      prevSections.filter((section) => section.id !== id)
    );
  };

  const handleUpdateSection = (id, field, value) => {
    setQnaSections((prevSections) =>
      prevSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const getQaPairsWithoutId = (sections) => {
    return sections.map(({ question, answer }) => ({ question, answer }));
  };

  const handleUploadData = async () => {
    setLoading(true);
    if (!name || !id || !description) {
      console.error("Name, ID, and Description are required fields.");
      showToast("잘못된 접근입니다.", "error");
      return; 
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("id", id);
    formData.append("text", text);
    formData.append("website_links", JSON.stringify(links));

    const qaPairsWithoutId = getQaPairsWithoutId(qnaSections);

    formData.append("qa_pairs", JSON.stringify(qaPairsWithoutId));
    files.forEach(file => {
      formData.append('files', file.file);
    });
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await axiosInstance.post("/chatbots/create_chatbot", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
   
      console.log(response.data);
      showToast("챗봇이 생성되었습니다.", "success");
      navigate("/dashboard/chatbots");
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
        <div className="border-t py-8">
          <h1 className="mb-2 text-center text-3xl font-bold">
            Create A Chatbot
          </h1>
          <p className="text-center text-zinc-500">
            챗봇에 학습시킬 데이터를 추가해주세요
          </p>
        </div>
        <div className="w-full max-w-7xl px-4 lg:mx-auto">
          <div
            dir="ltr"
            data-orientation="horizontal"
            className="flex rounded-full font-semibold leading-6 lg:hidden"
          >
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="bg-zinc-100 p-1 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 mb-8 flex h-auto w-full items-start justify-start gap-2 overflow-x-auto rounded-full px-3 py-2 data-[state=active]:shadow-sm"
              tabindex="0"
              data-orientation="horizontal"
            >
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-:R6jtsvf9jt3ta:-content-Files"
                data-state={tab === "files" ? "active" : "inactive"}
                id="radix-:R6jtsvf9jt3ta:-trigger-Files"
                class="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 text-zinc-600"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("files")}
              >
                <div
                  class="flex flex-row gap-2 w-full justify-center"
                  
                >
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
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    ></path>
                  </svg>
                  Files
                </div>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-:rh:-content-Text"
                data-state={tab === "text" ? "active" : "inactive"}
                id="radix-:rh:-trigger-Text"
                class="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 text-zinc-600"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("text")}
              >
                <div
                  class="flex flex-row gap-2 w-full justify-center"
                  
                >
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
                      d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                    ></path>
                  </svg>
                  Text
                </div>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-:rh:-content-Website"
                data-state={tab === "website" ? "active" : "inactive"}
                id="radix-:rh:-trigger-Website"
                class="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 text-zinc-600"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("website")}
              >
                <div
                  class="flex flex-row gap-2 w-full justify-center"
                  
                >
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
                      d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                    ></path>
                  </svg>
                  Website
                </div>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected="false"
                aria-controls="radix-:rh:-content-Q&amp;A"
                data-state={tab === "qna" ? "active" : "inactive"}
                id="radix-:rh:-trigger-Q&amp;A"
                class="items-center justify-center whitespace-nowrap text-sm ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-sm dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300 dark:data-[state=active]:bg-zinc-950 dark:data-[state=active]:text-zinc-50 flex w-full font-semibold rounded-full px-2 py-3 text-zinc-600"
                tabindex="-1"
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabClick("qna")}
              >
                <div
                  class="flex flex-row gap-2 w-full justify-center"
                >
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
                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                    ></path>
                  </svg>
                  Q&amp;A
                </div>
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
                          id="radix-:R2qjtsvf9jt3ta:"
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
                              data-state={tab === "files" ? "active" : "inactive"}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                tab === 'files' ? 'bg-zinc-50 text-violet-600' : 'text-zinc-700 hover:bg-zinc-50 hover:text-violet-600'
                              }`}
                              onClick={() => handleTabClick("files")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className={`h-5 w-5 shrink-0 ${
                                  tab === 'files' ? 'text-violet-600' : 'text-zinc-400 group-hover:text-violet-600'
                                }`}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                ></path>
                              </svg>
                              Files
                            </a>
                          </li>
                          <li>
                            <a
                              data-state={tab === "text" ? "active" : "inactive"}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                tab === 'text' ? 'bg-zinc-50 text-violet-600' : 'text-zinc-700 hover:bg-zinc-50 hover:text-violet-600'
                              }`}
                              onClick={() => handleTabClick("text")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className={`h-5 w-5 shrink-0 ${
                                  tab === 'text' ? 'text-violet-600' : 'text-zinc-400 group-hover:text-violet-600'
                                }`}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                                ></path>
                              </svg>
                              Text
                            </a>
                          </li>
                          <li>
                            <a
                              data-state={tab === "website" ? "active" : "inactive"}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                tab === 'website' ? 'bg-zinc-50 text-violet-600' : 'text-zinc-700 hover:bg-zinc-50 hover:text-violet-600'
                              }`}
                              onClick={() => handleTabClick("website")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className={`h-5 w-5 shrink-0 ${
                                  tab === 'website' ? 'text-violet-600' : 'text-zinc-400 group-hover:text-violet-600'
                                }`}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                ></path>
                              </svg>
                              Website
                            </a>
                          </li>
                          <li>
                            <a
                              data-state={tab === "qna" ? "active" : "inactive"}
                              className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                                tab === 'qna' ? 'bg-zinc-50 text-violet-600' : 'text-zinc-700 hover:bg-zinc-50 hover:text-violet-600'
                              }`}
                              onClick={() => handleTabClick("qna")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                                className={`h-5 w-5 shrink-0 ${
                                  tab === 'qna' ? 'text-violet-600' : 'text-zinc-400 group-hover:text-violet-600'
                                }`}
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                                ></path>
                              </svg>
                              Q&amp;A
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
              <div className="pb-10">
                <div className="flex flex-col align-top lg:flex-row lg:space-x-8 lg:align-middle">
                  <div className="lg:w-4/6">
                    <div className="rounded-lg border border-zinc-200 bg:white text-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                      <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">
                          {tab}
                        </h3>
                      </div>
                      <div className="p-6 pt-0">
                        {tab === "files" && (
                          <FilesSection
                            files={files}
                            onFileChange={handleFileChange}
                            onRemoveFile={handleRemoveFile}
                          />
                        )}
                        {tab === "text" && (
                          <TextSection
                            text={text}
                            onTextChange={handleTextChange}
                          />
                        )}
                        {tab === "website" && (
                          <WebsiteSection
                            links={links}
                            onAddLink={handleAddLink}
                            onRemoveLink={handleRemoveLink}
                            onLinkChange={handleLinkChange}
                          />
                        )}

                        {tab === "qna" && (
                          <QnaSection
                            handleAddSection={handleAddSection}
                            qnaSections={qnaSections}
                            onRemoveSection={handleRemoveSection}
                            onUpdateSection={handleUpdateSection}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div class="m-auto my-4 w-full lg:my-0 lg:w-2/6">
                    <div class="rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 sm: mt-2 lg:mt-0">
                      <div class="p-4">
                        <div class="text-center font-semibold lg:mb-2">
                          Sources
                        </div>
                        <button
                          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1 mt-4 w-full"
                          type="submit"
                          onClick={handleUploadData}
                        >
                          Create Chatbot
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
            href={isLoggedIn ? "/dashboard" : "/login"}
          >
            {isLoggedIn ? "Dashboard" : "Sign In"}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      )}
      </main>
    </div>
  );
}

const FilesSection = ({ files, onFileChange, onRemoveFile }) => (
  <div>
    <div
      role="presentation"
      tabindex="0"
      className="border rounded border-neutral-200 p-16"
      onClick={() => document.getElementById("fileInput").click()} 
    >
      <input
        accept="text/html,.pdf,.doc,.docx,.txt"
        multiple
        tabindex="-1"
        type="file"
        name="file"
        style={{ display: "none" }}
        id="fileInput"
        onChange={onFileChange}
      />
      <div class="flex flex-col items-center justify-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="h-5 w-5 fill-current"
        >
          <path
            fill-rule="evenodd"
            d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <div class="items-center justify-center text-center">
          <p class="text-sm text-zinc-600 ">
            Drag &amp; drop files here, or click to select files
          </p>
          <span
            class="text-xs text-zinc-500 dark:text-zinc-300"
            id="file_type_help"
          >
            Supported File Types: .pdf, .doc, .docx, .txt
          </span>
        </div>
      </div>
    </div>
    {files.length > 0 && (
      <div className="pt-8">
        <div>
          <div className="my-4 flex items-center">
            <hr className="w-full border-t border-zinc-300" />
            <span className="whitespace-nowrap px-2 text-zinc-600">
              Attached Files
            </span>
            <hr className="w-full border-t border-zinc-300" />
          </div>
          <div className="mt-5 max-h-[36rem] overflow-auto pr-2">
            {files.map((file) => (
              <div className="grid grid-cols-10 pb-4" key={file.name}>
                <div className="col-span-9">
                  <span className="break-words">{file.name}</span>
                  <span className="text-sm text-zinc-500">
                    {" "}
                    ({file.size} bytes)
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    className="inline-flex items-center justify-center rounded-md text-sm text-red-500 hover:bg-red-50 hover:text-red-600"
                    type="button"
                    onClick={() => onRemoveFile(file.name)}
                  >
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
                      className="h-4 w-4"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

const TextSection = ({ text, onTextChange }) => (
  <div class="w-full">
    <textarea
      placeholder="Enter text ..."
      name="data"
      rows="20"
      class="my-2 w-full min-w-0  flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white p-1 px-3  text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
      value={text}
      onChange={onTextChange}
    ></textarea>
    <p class="h-8 text-center text-sm text-zinc-600">
      {text.length} characters
    </p>
  </div>
);

const WebsiteSection = ({ links, onAddLink, onRemoveLink, onLinkChange }) => {
  const [currentLink, setCurrentLink] = useState("");

  const handleFetchClick = () => {
    if (currentLink.trim()) {
      onAddLink(currentLink);
      setCurrentLink(""); // Clear the input after adding the link
    }
  };
  return (
    <div>
      <label class="my-2 block text-sm font-medium leading-6 text-zinc-900">
        Crawl
      </label>
      <div class="relative mt-2 rounded-md">
        <div class="flex flex-col gap-2 lg:flex-row ">
          <input
            class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="https://www.example.com"
            type="text"
            value={currentLink}
            onChange={(e) => setCurrentLink(e.target.value)}
            name="website"
          />
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-800/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90 h-9 px-4 py-1"
            onClick={handleFetchClick}
          >
            Fetch
          </button>
        </div>
        <div class="py-4 text-sm text-zinc-600">
          This will crawl all the links starting with the URL (not including
          files on the website).
        </div>
      </div>
      <div class="mt-12">
        <div class="my-4 flex items-center">
          <hr class="w-full border-t border-zinc-300" />
          <span class="whitespace-nowrap px-2 text-zinc-600">
            Included Links
          </span>
          <hr class="w-full border-t border-zinc-300" />
        </div>
        <div
          dir="ltr"
          class="relative overflow-hidden mt-6 pr-3"
          style={{
            position: "relative",
            "--radix-scroll-area-corner-width": "0px",
            "--radix-scroll-area-corner-height": "0px",
          }}
        >
          <style>{`[data-radix-scroll-area-viewport]{scrollbar-width:"none"-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`}</style>
          <div
            data-radix-scroll-area-viewport=""
            class="w-full rounded-[inherit] max-h-[70vh]"
            style={{ overflow: "hidden scroll" }}
          >
            <div style={{ "min-width": "100%", display: "table" }}>
              {links.map((link, index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center">
                    <div className="flex w-full items-center">
                      <input
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="https://www.example.com/"
                        type="text"
                        value={link}
                        onChange={(e) => onLinkChange(index, e.target.value)}
                        name="website"
                      />
                      <button
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent h-9 w-9 ml-2 px-2"
                        type="button"
                        onClick={() => onRemoveLink(index)}
                      >
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
                          className="lucide lucide-trash h-4 w-4"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QnaSection = ({
  handleAddSection,
  qnaSections,
  onRemoveSection,
  onUpdateSection,
}) => (
  <div>
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-3 ">
        <button
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 bg-zinc-100 text-zinc-900 shadow-sm hover:bg-zinc-200/90 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80 h-9 w-9"
          type="button"
          onClick={handleAddSection}
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
            class="lucide lucide-plus h-4 w-4 text-zinc-700"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5v14"></path>
          </svg>
        </button>
      </div>
    </div>
    <div
      dir="ltr"
      className="relative overflow-hidden mt-6"
      style={{
        position: "relative",
        "--radix-scroll-area-corner-width": "0px",
        "--radix-scroll-area-corner-height": "0px",
      }}
    >
      <style>{`[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`}</style>
      <div
        data-radix-scroll-area-viewport=""
        className="w-full rounded-[inherit] max-h-[90vh]"
        style={{ overflow: "hidden scroll" }}
      >
        <div style={{ "min-width": "100%", display: "table" }}>
          {qnaSections.map((section) => (
            <div id={section.id} className="mb-6 rounded border p-3 shadow">
              <div className="flex items-end justify-between">
                <label className="mb-2 text-sm text-zinc-700">Question</label>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 text-red-500 hover:bg-red-50 hover:text-red-600 bg-transparent h-9 w-9 mb-1 px-2"
                  type="button"
                  onClick={() => onRemoveSection(section.id)}
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
                    class="lucide lucide-trash h-4 w-4 text-red-600"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
              <textarea
                className="w-full min-w-0 appearance-none rounded-md border border-zinc-900/10 bg-white p-1 px-3  text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                rows="3"
                value={section.question}
                onChange={(e) =>
                  onUpdateSection(section.id, "question", e.target.value)
                }
              ></textarea>
              <div className="">
                <label className="mt-8 text-sm text-zinc-700">Answer</label>
                <textarea
                  className="mt-1 w-full min-w-0 appearance-none rounded-md border border-zinc-900/10 bg-white p-1 px-3  text-zinc-900 shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm"
                  rows="8"
                  value={section.answer}
                  onChange={(e) =>
                    onUpdateSection(section.id, "answer", e.target.value)
                  }
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Create2Screen;
