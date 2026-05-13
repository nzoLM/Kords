import "@/styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import Navbar from "@/components/navbar";
import PostForm from "@/components/post-form";

const NO_NAVBAR_PAGES = ["/", "/login", "/signup"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const showNavbar = !NO_NAVBAR_PAGES.includes(router.pathname);
  const [postForm, setPostForm] = useState(false);

  return (
    <>
      <Head>
        <title>Kords</title>
      </Head>
      {showNavbar ? (
        <div className="flex min-h-screen">
          {postForm && (
            <div
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
