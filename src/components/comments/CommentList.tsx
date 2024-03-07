/* eslint-disable @next/next/no-img-element */
import { CommentApiResponse } from "@/interface";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-toastify";

interface CommentListProps {
    comments?: CommentApiResponse;
    displayStore?: boolean;
}
export default function CommentList({ comments, displayStore }: CommentListProps) {
    const { data: session } = useSession();
    const handleDeleteComment = async (id: number) => {
        const ok = window.confirm("댓글을 삭제하겠습니까?");
        if (ok) {
            const result = await axios.delete(`/api/comments?id=${id}`);
            if (result.status === 200) {
                toast.success("댓글 삭제");
            } else {
                toast.error("댓글 삭제 실패");
            }
        }
    };
    return (
        <div className="my-10">
            {comments?.data.length ? (
                comments?.data.map((comment) => (
                    <div
                        key={comment.id}
                        className="flex items-center space-x-4 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-8"
                    >
                        <div>
                            <img
                                src={comment?.user?.image || "/images/markers/default.png"}
                                width={40}
                                height={40}
                                className="rounded-full bg-gray-10 h-10 w-10"
                                alt="profile image"
                            />
                        </div>
                        <div className="flex  flex-col space-y-1 flex-1">
                            <div>{comment.user?.email}</div>
                            <div className="text-xs">
                                {new Date(comment.createdAt)?.toLocaleDateString()}
                            </div>
                            <div className="text-black mt-1 text-base">{comment.body}</div>
                            {displayStore && comment.store && (
                                <div className="mt-2">
                                    <Link
                                        href={`/stores/${comment.store.id}`}
                                        className="text-blue-700 hover:text-blue-500 underline font-medium"
                                    >
                                        {comment.store.name}
                                    </Link>
                                </div>
                            )}
                        </div>
                        <div>
                            {comment.userId === session?.user.id && (
                                <button
                                    onClick={() => handleDeleteComment(comment.id)}
                                    type="button"
                                    className="underline text-gray-500 hover:text-gray-400"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-5 border border-gray-200 rounded-md text-sm text-gray-400">
                    댓글이 없습니다.
                </div>
            )}
        </div>
    );
}
