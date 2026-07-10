import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import Navbar from "@/components/navbar";
import PostForm from "@/components/post-form";
import gsap from "gsap";

const NO_NAVBAR_PAGES = ["/", "/login", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = !NO_NAVBAR_PAGES.includes(router.pathname);
  const [postForm, setPostForm] = useState(false);
  const postRef = useRef(null)

  useEffect(() => {
    if (postRef.current == null) {
      gsap.fromTo(
        postRef.current,
        { opacity: 1, ease: "power1.out", duration: 0.3 },
        { opacity: 0, ease: "power1.out", duration: 0.5 },

      );
 
    } else {
      gsap.fromTo(
        postRef.current,
        { opacity: 0, ease: "power1.out", duration: 0.3 },
        { opacity: 1, ease: "power1.out", duration: 0.3 },
      );
    }
  }, [])

  return (
    <>
      <Head>
        <title>Kords</title>
      </Head>
      {showNavbar ? (
        <div className="flex min-h-screen">
          {postForm && (
            <div
              ref={postRef}
              className="z-50 top-0 fixed w-full h-full bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setTimeout(() => setPostForm(false), 300)
                setPostForm(false)
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <PostForm closeForm={() => {
                  setTimeout(() => setPostForm(false), 1000)
                  setPostForm(false)
                }} />
              </div>
            </div>
          )}
          <Navbar onClick={() => setPostForm(true)} />
          <Component {...pageProps} />
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
}
