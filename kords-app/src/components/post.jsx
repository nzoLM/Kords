export default function Post({ id, title, content, mediaUrl, mediaType, author }) {

    

    return (
        <div className="p-4 w-full flex flex-col gap-2">
            <div className="flex gap-2">
                <div className="rounded-full w-8 h-8 bg-white"></div>
                <p>{author}</p>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-2xl">{title}</p>
                <p>{content}</p>
            </div>
            <div className="flex justify-around">
                <button onClick={}>
                    <p>Like</p>
                </button>
                <p>Recommended</p>
                <p>Comments</p>
                <p>Share</p>
            </div>
        </div>
    )
}