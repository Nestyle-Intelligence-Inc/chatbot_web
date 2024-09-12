import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useToast } from "../components/ToastContext";
import axios from "axios";

function LoginScreen() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const showToast = useToast();

  const from = location.state?.from || "/";

  const clientId =
    "665495678066-955g63lgtasttrl4v01escurfv05rbcd.apps.googleusercontent.com";

  const handleLogin = (email) => {
    axios
      .post("http://34.168.31.3/users/login", { email: email })
      .then((res) => {
        showToast("로그인 성공!", "success");
        setResponse(res.data);
        setError(null);
        console.log(res);
        sessionStorage.setItem("accessToken", res.data.access_token);
        localStorage.setItem("refreshToken", res.data.refresh_token);
        navigate(from);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
        setResponse(null);
      });
  };

  return (
    <div class=" grid  min-h-screen  bg-white">
      <section class="flex h-full flex-col px-6 pt-4">
        <a href="/">
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
            <span class="font-normal text-lg text-zinc-950">Chatbase</span>
          </div>
        </a>
        <div class="flex h-full flex-col items-center justify-center gap-4">
          <div class="mx-auto flex max-w-lg flex-col justify-center space-y-6 sm:w-[350px] pb-16">
            <h1 class="text-center text-2xl font-semibold tracking-tight">
              Login / Join
            </h1>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t"></span>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class=" text-muted-foreground bg-white px-2">
                  continue with
                </span>
              </div>
            </div>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  const decodedToken =jwtDecode(credentialResponse.credential);
                  handleLogin(decodedToken.email);
                }}
                onFailure={(err) => {
                  console.log(err);
                }}
              />
            </GoogleOAuthProvider>
            <p class="text-muted-foreground px-8 text-center text-sm">
              By continuing, you agree to our
              <a
                class="hover:text-primary underline underline-offset-4"
                href="/legal/terms"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                class="hover:text-primary underline underline-offset-4"
                href="/legal/privacy"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginScreen;
