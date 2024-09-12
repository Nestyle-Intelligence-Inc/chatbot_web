import React, { useState, useEffect } from "react";
import {
  useNavigate,
  Link,
  useLocation,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import ManagePlayground from "./ManagePlayground";
import ManageActivity from "./ManageActivity";
import ManageData from "./ManageData";
import ManageSettings from "./ManageSettings";
import axiosInstance from "../components/axiosInstance";
import { useToast } from "../components/ToastContext";

function ManageScreen() {
  const { chatbotId } = useParams();
  const showToast = useToast();
  const accessToken = sessionStorage.getItem("accessToken");
  const isLoggedIn = Boolean(accessToken);
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [chatbotInfo, setChatbotInfo] = useState(
    {
      name: '',
      description: '',
      id: '',
      website_links: [],
      qa_examples: [],
      text: ''
    }
  );
  const [email, setEmail] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
  
  // Data
  const [files, setFiles] = useState([]);
  const [text, setText] = useState("");
  const [links, setLinks] = useState([]);
  const [qnaSections, setQnaSections] = useState([]);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    axiosInstance
      .get(`/chatbots/${chatbotId}`)
      .then((response) => {
        setChatbotInfo( {
          name: response.data.name,
          description: response.data.description,
          id: chatbotId,
          website_links: response.data.website_links,
          qa_examples: response.data.qa_examples,
          text: response.data.text
        });
        console.log('chatbotInfo fetched:', response.data);
        if (response.data.text !== '') {
          setText(response.data.text);
        }
    
        if (response.data.website_links === null) {
          setLinks([]);
        }else {
          setLinks(response.data.website_links);
        }
    
        if (response.data.qa_examples !== null && response.data.qa_examples!== undefined) {
          setQnaSections(response.data.qa_examples);
        }
      })
      .catch((error) => {
        console.error("API 호출 오류:", error);
      });
  }, [chatbotId]);
  
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
    if (path === `/manage/${chatbotId}/data`) {
      axiosInstance
        .get(`/chatbots/${chatbotId}/files`)
        .then((response) => {
          const loadedFiles = response.data.map(file => ({
            ...file,
            status: 'existing'
          }));
          setFiles(loadedFiles);
        })
        .catch((error) => {
          console.error("파일 API 호출 오류:", error);
        });
    }
  }, [chatbotId]);

  // Playground
  const [conversationId, setConversationId] = useState('');
  const [messages, setMessages] = useState([]);

  const handleApiCall = async (inputValue) => {
    try {
      const newUserMessage = { user: inputValue };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
  
      const requestBody = {
        chatbot_id: chatbotId,
        question: inputValue,
      };
  
      if (conversationId.trim() !== '') {
        requestBody.conversation_id = conversationId;
      }
  
      const response = await axiosInstance.post('/chatbots/chat', requestBody);
  
      const botMessages = response.data.conversation_history.slice(-1);
      
      setMessages((prevMessages) => [
        ...prevMessages,
        ...botMessages.map((msg) => ({ bot: msg.bot })),
      ]);
      setConversationId(response.data.current_conversation_id);
  
      console.log('response :: ', response.data);
    } catch (error) {
      console.error('API 호출 오류:', error);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setConversationId(''); 
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const fileDetails = selectedFiles.map((file) => ({
      id: null, 
      file_name: file.name,
      file_type: file.type,
      file,
      status: 'new'
    }));

    setFiles((prevFiles) => [...prevFiles, ...fileDetails]);
    console.log('add files ::: ', files);
  };

  const handleRemoveFile = (fileName) => {
    console.log('delete fileName ::: ', fileName);
    setFiles((prevFiles) => prevFiles.map(file => 
      file.file_name === fileName 
        ? { ...file, status: 'deleted' } 
        : file
    ));
    console.log('delete files ::: ', files);
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
    if (!Array.isArray(sections)) {
      console.warn('Expected sections to be an array, but got:', sections);
      return []; // 빈 배열 반환
    }
    return sections.map(({ question, answer }) => ({ question, answer }));
  };

  const handleDeleteFile = () => {
    const deletedFiles = files.filter(file => file.status === 'deleted' && file.id !== null);
    deletedFiles.forEach(file => {
      axiosInstance
        .delete(`/chatbots/${chatbotId}/files/${file.id}`)
        .catch((error) => console.error("파일 삭제 오류:", error));
    });
  };

  const handleUploadData = async () => {
    setLoading(true);

    if (!chatbotInfo.name || !chatbotInfo.id || !chatbotInfo.description) {
      console.error("Name, ID, and Description are required fields.");
      showToast("잘못된 접근입니다.", "error");
      return; 
    }

    handleDeleteFile();
    
    const formData = new FormData();
    formData.append("name", chatbotInfo.name);
    formData.append("description", chatbotInfo.description);
    formData.append("id", chatbotInfo.id);
    formData.append("text", text);
    formData.append("website_links", JSON.stringify(links || []));

    const newFiles = files.filter(file => file.status === 'new');
    console.log("newFiles :: ", newFiles);
    newFiles.forEach(file => {
      formData.append("files", file.file);
    });

    const qaPairsWithoutId = getQaPairsWithoutId(qnaSections || []);
    if (qaPairsWithoutId.length > 0) {
      formData.append("qa_pairs", JSON.stringify(qaPairsWithoutId));
    }

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
      showToast("데이터가 업데이트 되었습니다.", "success");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  
  // Settings
  const handleDeleteChatbot = async () => {
    // TODO::: dialog 띄우기
    axiosInstance
    .delete(`/chatbots/${chatbotId}`)
    .then((response) => {
      console.log(response.data);
      navigate('/dashboard/chatbots');
      showToast("챗봇이 삭제되었습니다.", "success");
    })
    .catch((error) => {
      console.error("API 호출 오류:", error);
    });
  };

  const handleUpdateChatbot = async (name, description) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("id", chatbotInfo.id);

    axiosInstance
      .post('/chatbots/create_chatbot', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log('Chatbot updated successfully', response.data);
        setChatbotInfo(response.data);
        showToast("데이터가 업데이트 되었습니다.", "success");
      })
      .catch((error) => {
        console.error('Error updating chatbot', error);
      });
  };


  return (
    <div className="ManageScreen">
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
          <button class="whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-80 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:text-zinc-600 h-9 w-9 pointer-events-auto flex items-center justify-center text-zinc-700 lg:hidden">
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
          </button>
          <span
            class="relative shrink-0 rounded-full hidden h-9 w-9 items-center justify-center overflow-hidden border border-zinc-300 bg-zinc-50/50 text-sm font-medium hover:cursor-pointer lg:flex"
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
              location.pathname === `/manage/${chatbotId}/playground`
                ? "text-zinc-800"
                : "text-zinc-500"
            }`}
            to={`/manage/${chatbotId}/playground`}
          >
            Playground
            <div
              className={`absolute -left-0 top-[1.89rem] h-[0.15rem] w-full rounded-3xl transition-all ease-in-out ${
                location.pathname === `/manage/${chatbotId}/playground`
                  ? "bg-violet-500"
                  : ""
              }`}
            ></div>
          </Link>
          <Link
            className={`relative col-span-1 items-center p-1 text-sm font-medium ${
              location.pathname === `/manage/${chatbotId}/activity`
                ? "text-zinc-800"
                : "text-zinc-500"
            }`}
            to={`/manage/${chatbotId}/activity`}
          >
            Activity
            <div
              className={`absolute -left-0 top-[1.89rem] h-[0.15rem] w-full rounded-3xl transition-all ease-in-out ${
                location.pathname === `/manage/${chatbotId}/activity`
                  ? "bg-violet-500"
                  : ""
              }`}
            ></div>
          </Link>
          <Link
            className={`relative col-span-1 items-center p-1 text-sm font-medium ${
              location.pathname === `/manage/${chatbotId}/data`
                ? "text-zinc-800"
                : "text-zinc-500"
            }`}
            to={`/manage/${chatbotId}/data`}
          >
            Data
            <div
              className={`absolute -left-0 top-[1.89rem] h-[0.15rem] w-full rounded-3xl transition-all ease-in-out ${
                location.pathname === `/manage/${chatbotId}/data`
                  ? "bg-violet-500"
                  : ""
              }`}
            ></div>
          </Link>
          <Link
            className={`relative col-span-1 items-center p-1 text-sm font-medium ${
              location.pathname === `/manage/${chatbotId}/settings`
                ? "text-zinc-800"
                : "text-zinc-500"
            }`}
            to={`/manage/${chatbotId}/settings`}
          >
            Settings
            <div
              className={`absolute -left-0 top-[1.89rem] h-[0.15rem] w-full rounded-3xl transition-all ease-in-out ${
                location.pathname === `/manage/${chatbotId}/settings`
                  ? "bg-violet-500"
                  : ""
              }`}
            ></div>
          </Link>
        </nav>
        <Routes>
          <Route
            path="playground"
            element={<ManagePlayground 
              conversationId={chatbotInfo.name}
              messages={messages}
              onSubmit={handleApiCall}
              handleReset={handleReset}
               />}
          />
          <Route
            path="activity"
            element={<ManageActivity messages={messages} />}
          />
          <Route
            path="data"
            element={
              <ManageData
              files={files} 
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
              text={text}
              onTextChange={handleTextChange}
              links={links}
              onAddLink={handleAddLink} 
              onRemoveLink={handleRemoveLink} 
              onLinkChange={handleLinkChange}
              handleAddSection={handleAddSection}
              qnaSections={qnaSections}
              onRemoveSection={handleRemoveSection}
              onUpdateSection={handleUpdateSection}
              totalSize={totalSize}
              handleUploadData={handleUploadData}
              />
            }
          />
          <Route
            path="settings"
            element={<ManageSettings 
              chatbotId={chatbotId} 
              chatbotName={chatbotInfo.name}
              chatbotDescription={chatbotInfo.description} 
              handleUpdateChatbot={handleUpdateChatbot}
              handleDeleteChatbot={handleDeleteChatbot}
               />}
          />
        </Routes>
      </main>
      <main className="ManageScreen-content"></main>
    </div>
  );
}

export default ManageScreen;
