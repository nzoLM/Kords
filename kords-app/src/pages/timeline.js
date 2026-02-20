import Navbar from "@/components/navbar"
import Post from "@/components/post"
import { useState } from "react";
import PostForm from "@/components/post-form";

export default function Timeline() {
    const [form, setForm] = useState(false);

    return (
        <div className="flex min-h-screen">
            {
                form &&
                <div className="z-50 absolute w-full h-full bg-black/50">
                    <PostForm closeForm={() => setForm(false)}></PostForm>

                </div>
            }
            <Navbar onClick={() => setForm(true)}></Navbar>
            <div className="flex flex-col">
                <div className="flex justify-around p-4">
                    <p>General</p>
                    <p>Lessons</p>
                    <p>Videos</p>
                </div>
                <div className="flex flex-col border-b">
                    <Post
                        title={"test"}
                        content={"Test content jfldfsdfdfdsf dsqdsq fdsf fsdfs fdsf fdsf fsdfsd fjndsfjdfjdsjjjjjjjjdjdjdjjdjdjdjdjd djjdjdj djjdjdjdj jdjdjdj jdj"}
                        author={"Enzo"}
                    />
                </div>
            </div>
            
        </div>
    )
}