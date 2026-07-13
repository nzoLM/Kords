import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useLayoutEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import PostForm from "@/components/post-form";
import gsap from "gsap";

const NO_NAVBAR_PAGES = ["/", "/login", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = !NO_NAVBAR_PAGES.includes(router.pathname);
  const [postForm, setPostForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const postRef = useRef(null)

  useLayoutEffect(() => {
    if (postForm) setShowPostForm(true);
  }, [postForm])

  useLayoutEffect(() => {
    if (!showPostForm || !postRef.current) return;

    if (postForm) {
      gsap.fromTo(
        postRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power1.out" },
      );
    } else {
      gsap.to(postRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.out",
        onComplete: () => setShowPostForm(false),
      });
    }
  }, [postForm, showPostForm])

  return (
    <>
      <Head>
        <title>Kords</title>
      </Head>
      {showNavbar ? (
        <div className="flex min-h-screen">
          {showPostForm && (
            <div
              ref={postRef}
              className="z-50 top-0 fixed w-full h-full bg-black/60 backdrop-blur-sm"
              onClick={() => setPostForm(false)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <PostForm closeForm={() => setPostForm(false)} />
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
