import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Link from 'next/link'

export default function PostDropdownMenu({postId}: {postId: string}) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="px-2 py-1 border rounded-md">⋯</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link href={`/posts/${postId}`} className="cursor-pointer">詳細</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/posts/edit/${postId}`} className="cursor-pointer">編集</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 cursor-pointer">削除</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
