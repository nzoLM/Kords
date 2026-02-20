import { Button } from "./ui/button"

export default function PostForm({ closeForm }) {

    // const createPost = async () => {
    //     try {
    //         const response = fetch(`${process.env.NEXT_API_URL}/post`,
    //             {

    //             }
    //         );

    //     }
    // }
    return (
        <div className="bg-background w-2/3 h-2/3 absolute p-4 rounded-lg top-1/8 left-1/2 -translate-x-1/2 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={closeForm}
                    className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    ×
                </button>
                <div className="flex justify-around flex-1">
                    <p>General</p>
                    <p>Lessons</p>
                    <p>Videos</p>
                </div>
            </div>
            <form className="h-full flex flex-col justify-evenly" action="">
                <label htmlFor="title">Title</label>
                <input className="border rounded" type="text" name="title" id="" />
                <label htmlFor="content">Content</label>
                <textarea className="border rounded" name="content" id=""></textarea>
                <label htmlFor="media">Add a file</label>
                <input type="file" name="media" id="" />
                <Button className={"self-end w-fit cursor-pointer"} type="submit">
                    Create
                </Button>
            </form>
        </div>
    )
}